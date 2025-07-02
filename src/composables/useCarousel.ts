import { computed, ComputedRef, ref, Ref } from 'vue'
import type { CarouselProps } from '../types'
import { useAutoplay } from './useAutoplay'
import { useCarouselState } from './useCarouselState'
import { useDrag } from './useDrag'
import { useHover } from './useHover'
import { useKeyboard } from './useKeyboard'
import { useWheel } from './useWheel'

interface UseCarouselOptions {
   props: CarouselProps
   slideWidth: Ref<number>
   slideHeight: Ref<number>
   itemsToShow: ComputedRef<number>
}

export function useCarousel({ props, slideWidth, slideHeight, itemsToShow }: UseCarouselOptions) {
   const carouselTrack = ref<HTMLElement | null>(null)
   const carouselContainer = ref<HTMLElement | null>(null)

   const totalSlides = computed(() => props.data.length)

   const carouselState = useCarouselState({
      props,
      itemsToShow,
      totalSlides,
   })

   const {
      state,
      goToSlide,
      goNext,
      goPrev,
      goNextPage,
      goPrevPage,
      canGoNext,
      canGoPrev,
      progress,
      updateState,
      visibleSlideIndices,
   } = carouselState

   // UPDATED: Calculate transform value accounting for gaps
   const transformValue = computed(() => {
      const gap = itemsToShow?.value > 1 ? props?.gap || 0 : 0

      if (props.direction === 'vertical') {
         // For vertical direction, we need to account for gaps between slides
         const slideWithGap = slideHeight.value + gap
         return -state.currentIndex * slideWithGap
      }

      // For horizontal direction, we need to account for gaps between slides
      const slideWithGap = slideWidth.value + gap
      return -state.currentIndex * slideWithGap
   })

   // CSS transform style
   const trackStyle = computed(() => {
      const transform =
         props.direction === 'vertical'
            ? `translateY(${transformValue.value}px)`
            : `translateX(${transformValue.value}px)`

      const transition =
         state.isTransitioning && !state.isDragging
            ? `transform ${props.speed || 300}ms ${props.easing || 'ease'}`
            : 'none'

      return {
         transform,
         transition,
      }
   })

   // UPDATED: Initialize interaction composables with gap-aware calculations
   const dragComposable = useDrag({
      containerRef: carouselContainer,
      trackRef: carouselTrack,
      state,
      props,
      slideWidth,
      slideHeight,
      goToSlide,
      canGoNext,
      canGoPrev,
      updateState,
   })

   const wheelComposable = useWheel({
      containerRef: carouselContainer,
      state,
      props,
      goNext,
      goPrev,
      goNextPage,
      goPrevPage,
      canGoNext,
      canGoPrev,
   })

   const hoverComposable = useHover({
      containerRef: carouselContainer,
      state,
   })

   const keyboardComposable = useKeyboard({
      containerRef: carouselContainer,
      props,
      goNext,
      goPrev,
      goNextPage,
      goPrevPage,
      goToSlide,
      totalSlides,
   })

   const autoplayComposable = useAutoplay({
      props,
      state,
      goNext,
      canGoNext,
   })

   return {
      // Refs
      carouselTrack,
      carouselContainer,

      // State
      state,
      canGoNext,
      canGoPrev,
      progress,
      visibleSlideIndices,

      // Navigation
      goToSlide,
      goNext,
      goPrev,
      goNextPage,
      goPrevPage,

      // Styles
      trackStyle,

      // Composables (expose for advanced usage)
      dragComposable,
      wheelComposable,
      hoverComposable,
      keyboardComposable,
      autoplayComposable,
   }
}
