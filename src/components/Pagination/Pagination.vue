<script setup lang="ts">
import type { CarouselProps, PaginationType } from '../../types/'
import PaginationButtons from './PaginationButtons.vue'
import PaginationDots from './PaginationDots.vue'
import PaginationLines from './PaginationLines.vue'
import PaginationFraction from './PaginationFraction.vue'
import { computed } from 'vue'

interface PaginationProps {
   type: CarouselProps['pagination']
   position: CarouselProps['paginationPosition']
   direction: CarouselProps['direction']
   currentIndex: number
   totalSlides: number
   itemsToShow: number
   paginationSize?: CarouselProps['paginationSize']
   visibleSlideIndices: number[]
   canGoNext: boolean
   canGoPrev: boolean
   onGoToSlide: (index: number) => void
   onGoNext: () => void
   onGoPrev: () => void
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
