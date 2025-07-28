import { ref, onMounted, onUnmounted, Ref, ComputedRef, readonly } from 'vue'
import type { CarouselProps, CarouselState } from '../types'
import { debounce } from '../utils/debounce'

interface UseWheelOptions {
   goNext: () => void
   goPrev: () => void
   goNextPage: () => void
   goPrevPage: () => void
   state: CarouselState
   props: CarouselProps
   canGoNext: ComputedRef<boolean>
   canGoPrev: ComputedRef<boolean>
   containerRef: Ref<HTMLElement | null>
}

export function useWheel({
   containerRef,
   state,
   props,
   goNext,
   goPrev,
   goNextPage,
   goPrevPage,
   canGoNext,
   canGoPrev,
}: UseWheelOptions) {
   const isWheeling = ref(false)
   let wheelTimeout: NodeJS.Timeout | null = null

   const wheelOptions = {
      threshold: props.wheelOptions?.threshold ?? 30,
      velocityThreshold: props.wheelOptions?.velocityThreshold ?? 10,
      pageScrollThreshold: props.wheelOptions?.pageScrollThreshold ?? 100,
      debounceTime: props.wheelOptions?.debounceTime ?? 10,
      preventDefault: true,
      stopPropagation: true,
   }

   const resetWheelState = debounce(() => {
      state.isWheeling = false
      isWheeling.value = false
   }, wheelOptions.debounceTime || 10)

   const handleWheel = (e: WheelEvent) => {
      if (!props.mousewheel || state.isDragging) return

      const isHorizontal = props.direction === 'horizontal'
      const primaryDelta = isHorizontal ? e.deltaX : e.deltaY
      const absPrimaryDelta = Math.abs(primaryDelta)

      const isAtFirstSlide = !canGoPrev.value
      const isAtLastSlide = !canGoNext.value

      const verticalDelta = e.deltaY
      const isScrollingToPrevFromFirst = verticalDelta < 0 && isAtFirstSlide
      const isScrollingToNextFromLast = verticalDelta > 0 && isAtLastSlide

      if ((isScrollingToPrevFromFirst || isScrollingToNextFromLast) && props.direction === 'vertical') {
         return
      }

      if (absPrimaryDelta >= 1) {
         if (wheelOptions.preventDefault) {
            e.preventDefault()
         }
         if (wheelOptions.stopPropagation) {
            e.stopPropagation()
         }

         if (absPrimaryDelta < wheelOptions.threshold) {
            resetWheelState()
            return
         }

         if (wheelTimeout) {
            clearTimeout(wheelTimeout)
         }

         state.isWheeling = true
         isWheeling.value = true

         const isPageScroll = absPrimaryDelta > wheelOptions.pageScrollThreshold

         if (primaryDelta > wheelOptions.velocityThreshold) {
            if (canGoNext.value) {
               if (isPageScroll) {
                  goNextPage()
               } else {
                  goNext()
               }
            }
         } else if (primaryDelta < -wheelOptions.velocityThreshold) {
            if (canGoPrev.value) {
               if (isPageScroll) {
                  goPrevPage()
               } else {
                  goPrev()
               }
            }
         }

         resetWheelState()
      }
   }

   onMounted(() => {
      const container = containerRef.value
      if (!container || !props.mousewheel) return

      container.addEventListener('wheel', handleWheel, {
         passive: !wheelOptions.preventDefault,
         capture: false,
      })
   })

   onUnmounted(() => {
      const container = containerRef.value
      if (!container) return

      container.removeEventListener('wheel', handleWheel)

      if (wheelTimeout) {
         clearTimeout(wheelTimeout)
         wheelTimeout = null
      }
   })

   return {
      isWheeling: readonly(isWheeling),
   }
}
