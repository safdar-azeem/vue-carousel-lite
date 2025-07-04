<script setup lang="ts">
import { computed } from 'vue'
import PaginationDots from './PaginationDots.vue'
import PaginationLines from './PaginationLines.vue'
import PaginationButtons from './PaginationButtons.vue'
import PaginationFraction from './PaginationFraction.vue'
import type { CarouselProps, PaginationType } from '../../types/'

interface PaginationProps {
   canGoNext: boolean
   canGoPrev: boolean
   totalSlides: number
   itemsToShow: number
   currentIndex: number
   onGoNext: () => void
   onGoPrev: () => void
   visibleSlideIndices: number[]
   type: CarouselProps['pagination']
   onGoToSlide: (index: number) => void
   direction: CarouselProps['direction']
   position: CarouselProps['paginationPosition']
   paginationSize?: CarouselProps['paginationSize']
}

const props = defineProps<PaginationProps>()

const positionClasses = computed(() => {
   return [
      'carousel-pagination',
      `carousel-pagination--${props.direction}`,

      props.paginationSize === 'sm' ? 'carousel-pagination--sm' : '',
      props.paginationSize === 'lg' ? 'carousel-pagination--lg' : '',
   ]
})

const paginationType = computed(() => {
   if (Array.isArray(props.type)) {
      return props.type
   }
   return [props.type]
})

const getPosition = (type: PaginationType) => {
   let position = ''
   if (typeof props?.position === 'string') {
      position = props.position
   } else {
      const index = paginationType?.value?.indexOf(type)
      position = props.position?.[index] as string
   }

   return `carousel-pagination--${position}`
}
</script>

<template>
   <div :class="[...positionClasses, getPosition('dots')]" v-if="paginationType?.includes('dots')">
      <PaginationDots
         :current-index="currentIndex"
         :total-slides="totalSlides"
         :visible-slide-indices="visibleSlideIndices"
         :on-go-to-slide="onGoToSlide" />
   </div>

   <div :class="[...positionClasses, getPosition('lines')]" v-if="paginationType?.includes('lines')">
      <PaginationLines
         :current-index="currentIndex"
         :total-slides="totalSlides"
         :visible-slide-indices="visibleSlideIndices"
         :on-go-to-slide="onGoToSlide" />
   </div>
   <div :class="[...positionClasses, getPosition('buttons')]" v-if="paginationType?.includes('buttons')">
      <PaginationButtons
         :can-go-next="canGoNext"
         :can-go-prev="canGoPrev"
         :on-go-next="onGoNext"
         :on-go-prev="onGoPrev" />
   </div>
   <div
      :class="[...positionClasses, getPosition('fraction')]"
      v-if="paginationType?.includes('fraction')">
      <PaginationFraction :current-index="currentIndex" :total-slides="totalSlides" />
   </div>
</template>

<style>
@import '../../css/pagination.css';
</style>
