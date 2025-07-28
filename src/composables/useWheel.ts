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

   // Restore the original debounced reset logic
   const resetWheelState = debounce(() => {
      state.isWheeling = false
      isWheeling.value = false
   }, 300)

   const handleWheel = (e: WheelEvent) => {
      if (!props.mousewheel || state.isDragging) return

      const isHorizontal = props.direction === 'horizontal'
      const primaryDelta = isHorizontal ? e.deltaX : e.deltaY
      const absPrimaryDelta = Math.abs(primaryDelta)

      // Restore original boundary checks
      const isAtFirstSlide = !canGoPrev.value
      const isAtLastSlide = !canGoNext.value

      // Determine vertical deltas regardless of direction
      const verticalDelta = e.deltaY

      const isScrollingToPrevFromFirst = verticalDelta < 0 && isAtFirstSlide
      const isScrollingToNextFromLast = verticalDelta > 0 && isAtLastSlide

      // Allow parent scroll prevention only for vertical direction at boundaries
      if ((isScrollingToPrevFromFirst || isScrollingToNextFromLast) && props.direction === 'vertical') {
         // Don't prevent default - let parent handle the vertical scroll
         return
      }

      // For carousel direction scrolling within bounds, prevent default to block parent scroll
      if (absPrimaryDelta >= 1) {
         e.preventDefault()
         e.stopPropagation()

         if (absPrimaryDelta < 30) {
            resetWheelState()
            return
         }

         if (wheelTimeout) {
            clearTimeout(wheelTimeout)
         }

         state.isWheeling = true
         isWheeling.value = true

         const isPageScroll = absPrimaryDelta > 130

         if (primaryDelta > 20) {
            if (canGoNext.value) {
               if (isPageScroll) {
                  goNextPage()
               } else {
                  goNext()
               }
            }
         } else {
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

      // Use passive: false to allow preventDefault when needed
      // This is critical for proper parent scroll prevention
      container.addEventListener('wheel', handleWheel, {
         passive: false,
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
