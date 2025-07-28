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
   const directionLock = ref<'horizontal' | 'vertical' | null>(null)
   const accumulatedDeltaY = ref(0)
   const VERTICAL_THRESHOLD = 30 // Pixels before allowing parent scroll

   const resetWheelState = debounce(() => {
      state.isWheeling = false
      isWheeling.value = false
      directionLock.value = null
      accumulatedDeltaY.value = 0
   }, 150)

   const handleWheel = (e: WheelEvent) => {
      if (!props.mousewheel || state.isDragging) return

      const isHorizontal = props.direction === 'horizontal'
      const primaryDelta = isHorizontal ? e.deltaX : e.deltaY
      const absPrimaryDelta = Math.abs(primaryDelta)
      const verticalDelta = e.deltaY
      const absVerticalDelta = Math.abs(verticalDelta)

      // Accumulate vertical delta for threshold checking
      accumulatedDeltaY.value += absVerticalDelta

      // Determine scroll direction if not locked
      if (!directionLock.value) {
         const absDeltaX = Math.abs(e.deltaX)
         if (absPrimaryDelta > absVerticalDelta && absPrimaryDelta > 10) {
            directionLock.value = 'horizontal'
         } else if (absVerticalDelta > absPrimaryDelta && absVerticalDelta > 10) {
            directionLock.value = 'vertical'
         }
      }

      // Allow parent scrolling for vertical direction if threshold is met
      if (
         isHorizontal &&
         directionLock.value === 'vertical' &&
         accumulatedDeltaY.value > VERTICAL_THRESHOLD
      ) {
         return // Let parent handle vertical scroll
      }

      // Handle carousel navigation
      if (
         (isHorizontal && directionLock.value === 'horizontal') ||
         (!isHorizontal && directionLock.value === 'vertical') ||
         (!directionLock.value && absPrimaryDelta >= 10)
      ) {
         e.preventDefault()
         e.stopPropagation()

         if (absPrimaryDelta < 10) {
            resetWheelState()
            return
         }

         if (wheelTimeout) {
            clearTimeout(wheelTimeout)
         }

         state.isWheeling = true
         isWheeling.value = true

         const isPageScroll = absPrimaryDelta > 100

         if (primaryDelta > 0) {
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
