<script setup lang="ts">
import type { CarouselProps } from '../types'
import Pagination from './Pagination/Pagination.vue'
import { useCarousel } from '../composables/useCarousel'
import { useDimensions } from '../composables/useDimensions'
import { usePaginationVisibility } from '../composables/usePaginationVisibility'
import { computed, nextTick, onBeforeMount, onMounted, readonly, ref, watch } from 'vue'

const props = withDefaults(defineProps<CarouselProps>(), {
   gap: 0,
   speed: 300,
   loop: false,
   itemsToShow: 1,
   currentItem: 0,
   easing: 'ease',
   autoPlay: false,
   mousewheel: true,
   draggable: true,
   pagination: 'dots',
   paginationSize: 'md',
   autoPlayInterval: 3000,
   direction: 'horizontal',
   paginationVisibility: 'always',
   paginationHoverEdgeThreshold: 0.2,
   paginationHoverInitialTimeout: 1000,
   bufferSize: 5,
   autoFocus: false,
   maxDomElements: 10,
   wheelOptions: () => ({
      threshold: 30,
      velocityThreshold: 10,
      pageScrollThreshold: 100,
      debounceTime: 10,
      preventDefault: true,
      stopPropagation: true,
   }),
})

const emit = defineEmits<{
   (e: 'slide-change', index: number): void
}>()

const containerRef = ref<HTMLElement | null>(null)

const { containerCSSVars, containerClass, itemsToShow, slideHeight, slideWidth, isInitialized } =
   useDimensions({
      direction: props.direction,
      containerRef,
      itemsToShow: props.itemsToShow,
      gap: props.gap,
   })

const carousel = useCarousel({
   props,
   slideWidth,
   slideHeight,
   itemsToShow,
})

const {
   state,
   goNext,
   goPrev,
   progress,
   canGoNext,
   canGoPrev,
   goToSlide,
   carouselTrack,
   trackStyle,
   carouselContainer,
   keyboardComposable,
   visibleSlideIndices,
   renderedSlideIndices,
} = carousel

// Pagination visibility composable
const { isPaginationVisible, isMouseNearEdge } = usePaginationVisibility({
   containerRef,
   pagination: props.pagination,
   paginationVisibility: props.paginationVisibility,
   paginationPosition: props.paginationPosition,
   direction: props.direction,
   paginationHoverEdgeThreshold: props.paginationHoverEdgeThreshold,
   paginationHoverInitialTimeout: props.paginationHoverInitialTimeout,
})

// CRITICAL FIX: Stable virtual rendering with consistent keys
const slidesData = computed(() => {
   if (!isInitialized.value) {
      // SSR: render limited slides for initial load
      const limit = itemsToShow.value
      return props.data.slice(0, limit).map((item, index) => ({
         item,
         originalIndex: index,
         isVirtual: false,
      }))
   }

   // Virtual rendering: only render slides in the current window
   const renderedIndices = renderedSlideIndices.value
   return renderedIndices.map((index) => ({
      item: props.data[index],
      originalIndex: index,
      isVirtual: true,
   }))
})

// Memoized pagination visibility
const showPagination = computed(() => {
   return props?.pagination && props?.pagination.length > 0 && props?.data?.length > itemsToShow.value
})

// More conservative slide class computation to prevent SSR issues
const getSlideClasses = (originalIndex: number) => {
   const classes = ['carousel-slide']

   if (isInitialized.value) {
      if (state?.isDragging) {
         classes.push('slide-moving')
      }

      if (
         props.direction === 'horizontal' &&
         originalIndex === state.currentIndex - 1 + itemsToShow.value
      ) {
         classes.push('carouse-last-visible-slide')
      }
   }

   return classes.join(' ')
}

// Performance optimization: Batch style updates but ensure SSR compatibility
const containerStyles = computed(() => ({
   ...containerCSSVars.value,
}))

// CRITICAL FIX: Ultra-stable key generation to prevent DOM thrashing
const getSlideKey = (slideData: any) => {
   // Use only the original index as the key - this prevents re-rendering during window shifts
   return `slide-${slideData.originalIndex}`
}

// Expose carousel methods for external control
defineExpose({
   goToSlide,
   goNext,
   goPrev,
   state: readonly(state),
   canGoNext,
   canGoPrev,
   focus: keyboardComposable.focus,
})

// Fixed watchers with proper SSR handling
let isInitialMount = true

onBeforeMount(() => {
   if (props?.currentItem) {
      carousel.goToSlide(props.currentItem, false)
   }
})

watch(
   () => props.currentItem,
   (newValue: any, oldValue: any) => {
      if (isInitialMount) {
         isInitialMount = false
         return
      }

      if (newValue !== oldValue && newValue !== state.currentIndex) {
         carousel.goToSlide(newValue, !isInitialMount)
      }
   },
   { flush: 'post' }
)

watch(
   () => state.currentIndex,
   (newIndex) => {
      emit('slide-change', newIndex)
   }
)

onMounted(async () => {
   isInitialMount = false
   await nextTick()
   if (props?.autoFocus) {
      setTimeout(() => {
         carouselContainer.value?.focus()
      }, 500)
   }
})
</script>

<template>
   <div class="carousel-wrapper">
      <div
         ref="containerRef"
         tabindex="0"
         class="carousel-focus-container"
         role="region"
         :aria-live="state.isTransitioning ? 'polite' : 'off'"
         :aria-busy="state.isTransitioning">
         <div :class="containerClass" :style="containerStyles">
            <div
               ref="carouselContainer"
               class="carousel-container"
               :class="props?.draggable ? '' : 'carousel-container--no-drag'">
               <div
                  ref="carouselTrack"
                  :class="`carousel-track ${itemsToShow > 1 ? 'carousel-track-multiple' : ''}`"
                  :style="trackStyle">
                  <div
                     v-for="slideData in slidesData"
                     :key="getSlideKey(slideData)"
                     v-memo="[
                        slideData.item,
                        slideData.originalIndex,
                        state?.isDragging,
                        state.currentIndex,
                        itemsToShow,
                        visibleSlideIndices.includes(slideData.originalIndex),
                        isInitialized,
                     ]"
                     :class="getSlideClasses(slideData.originalIndex)"
                     :aria-hidden="
                        isInitialized ? !visibleSlideIndices.includes(slideData.originalIndex) : false
                     "
                     role="group">
                     <div class="carousel-slide-content">
                        <slot :item="slideData.item" :index="slideData.originalIndex">
                           <div class="carousel-default-content">
                              Slide {{ slideData.originalIndex + 1 }}
                           </div>
                        </slot>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <Pagination
            :paginationSize="paginationSize"
            v-if="showPagination"
            v-memo="[
               pagination,
               paginationPosition,
               paginationVisibility,
               state.currentIndex,
               props.data.length,
               itemsToShow,
               progress,
               visibleSlideIndices,
               canGoNext,
               canGoPrev,
               direction,
            ]"
            :type="pagination"
            :position="paginationPosition"
            :visibility="paginationVisibility"
            :current-index="state.currentIndex"
            :total-slides="props.data.length"
            :items-to-show="itemsToShow"
            :progress="progress"
            :visible-slide-indices="visibleSlideIndices"
            :can-go-next="canGoNext"
            :can-go-prev="canGoPrev"
            :on-go-to-slide="goToSlide"
            :direction="direction"
            :on-go-next="goNext"
            :on-go-prev="goPrev"
            :is-pagination-visible="isPaginationVisible"
            :is-mouse-near-edge="isMouseNearEdge">
            <template #prev-icon>
               <slot name="prev-icon" />
            </template>
            <template #next-icon>
               <slot name="next-icon" />
            </template>
         </Pagination>
      </div>
   </div>
</template>

<style>
@import '../css/carousel.css';
</style>
