<script setup lang="ts">
import type { CarouselProps } from '../types'
import Pagination from './Pagination/Pagination.vue'
import { useCarousel } from '../composables/useCarousel'
import { useDimensions } from '../composables/useDimensions'
import { usePaginationVisibility } from '../composables/usePaginationVisibility'
import { computed, onBeforeMount, onMounted, readonly, ref, watch } from 'vue'

const props = withDefaults(defineProps<CarouselProps>(), {
   gap: 0,
   speed: 300,
   loop: false,
   itemsToShow: 1,
   currentItem: 0,
   easing: 'ease',
   pagination: 'dots',
   autoPlay: false,
   mousewheel: true,
   paginationSize: 'md',
   autoPlayInterval: 3000,
   direction: 'horizontal',
   paginationPosition: 'bottom-center',
   paginationVisibility: 'always',
   paginationEdgeThreshold: 0.2,
   paginationInitialTimeout: 1000,
})

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
} = carousel

// Pagination visibility composable
const { isPaginationVisible, isMouseNearEdge } = usePaginationVisibility({
   containerRef,
   pagination: props.pagination,
   paginationVisibility: props.paginationVisibility,
   paginationPosition: props.paginationPosition,
   direction: props.direction,
   paginationEdgeThreshold: props.paginationEdgeThreshold,
   paginationInitialTimeout: props.paginationInitialTimeout,
})

// CRITICAL FIX: Proper SSR slide limiting logic restored
const slidesData = computed(() => {
   if (!isInitialized.value) {
      if (props.direction === 'vertical') {
         return props.data.slice(0, itemsToShow.value)
      } else {
         return props.data.slice(0, itemsToShow.value)
      }
   }
   return props.data
})

// Memoized pagination visibility
const showPagination = computed(() => {
   return props?.pagination && props?.pagination.length > 0 && props?.data?.length > itemsToShow.value
})

// More conservative slide class computation to prevent SSR issues
const getSlideClasses = (index: number) => {
   const classes = ['carousel-slide']

   if (isInitialized.value) {
      if (state?.isDragging) {
         classes.push('slide-moving')
      }

      if (props.direction === 'horizontal' && index === state.currentIndex - 1 + itemsToShow.value) {
         classes.push('carouse-last-visible-slide')
      }
   }

   return classes.join(' ')
}

// Performance optimization: Batch style updates but ensure SSR compatibility
const containerStyles = computed(() => ({
   ...containerCSSVars.value,
}))

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

onMounted(() => {
   isInitialMount = false
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
            <div ref="carouselContainer" class="carousel-container">
               <div
                  ref="carouselTrack"
                  :class="`carousel-track ${itemsToShow > 1 ? 'carousel-track-multiple' : ''}`"
                  :style="trackStyle">
                  <div
                     v-for="(item, index) in slidesData"
                     :key="`slide-${index}-${isInitialized ? 'full' : 'limited'}`"
                     v-memo="[
                        item,
                        index,
                        state?.isDragging,
                        state.currentIndex,
                        itemsToShow,
                        visibleSlideIndices.includes(index),
                        isInitialized,
                     ]"
                     :class="getSlideClasses(index)"
                     :aria-hidden="isInitialized ? !visibleSlideIndices.includes(index) : false"
                     role="group">
                     <div class="carousel-slide-content">
                        <slot :item="item" :index="index">
                           <div class="carousel-default-content">Slide {{ index + 1 }}</div>
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
            :itemsToShow="itemsToShow"
            :progress="progress"
            :visible-slide-indices="visibleSlideIndices"
            :can-go-next="canGoNext"
            :can-go-prev="canGoPrev"
            :on-go-to-slide="goToSlide"
            :direction="direction"
            :on-go-next="goNext"
            :on-go-prev="goPrev"
            :is-pagination-visible="isPaginationVisible"
            :is-mouse-near-edge="isMouseNearEdge" />
      </div>
   </div>
</template>

<style>
@import '../css/carousel.css';
</style>
