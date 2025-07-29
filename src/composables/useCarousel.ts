import { useDrag } from './useDrag'
import { useHover } from './useHover'
import { useWheel } from './useWheel'
import { useAutoplay } from './useAutoplay'
import { useKeyboard } from './useKeyboard'
import type { CarouselProps } from '../types'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { useCarouselState } from './useCarouselState'

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
      renderedSlideIndices,
      virtualOffset,
   } = carouselState

   // FIXED: Stable transform calculation that maintains position during window updates
   const transformValue = computed(() => {
      const gap = itemsToShow?.value > 1 ? props?.gap || 0 : 0
      const slideWithGap =
         props.direction === 'vertical' ? slideHeight.value + gap : slideWidth.value + gap

      // Calculate the relative position within the current render window
      const relativeIndex = state.currentIndex - virtualOffset.value

      // Ensure we don't go negative (which would cause visual glitches)
      const safeRelativeIndex = Math.max(0, relativeIndex)

      return -safeRelativeIndex * slideWithGap
   })

   // CSS transform style with stable transitions
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

   // UPDATED: Initialize interaction composables with gap-aware calculations and virtual offset
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
      virtualOffset,
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
      renderedSlideIndices,
      virtualOffset,

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
