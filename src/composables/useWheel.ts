import { ref, onMounted, onUnmounted, readonly, type Ref, type ComputedRef } from 'vue'
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
   const wheelLock = ref(false)
   let wheelTimeout: NodeJS.Timeout | null = null
   let lastWheelDirection = 0
   let accumulatedDelta = 0
   let accumulateTimeout: NodeJS.Timeout | null = null

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

   // Release lock quickly after wheel events stop
   const releaseWheelLock = debounce(() => {
      wheelLock.value = false
   }, 35)

   const handleWheel = (e: WheelEvent) => {
      if (!props.mousewheel || state.isDragging) return

      const isHorizontal = props.direction === 'horizontal'
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)

      // CRITICAL FIX: Stricter intent detection
      // Compare absolute values directly to allow native page scroll
      if (isHorizontal && absY > absX) {
         return
      }
      if (!isHorizontal && absX > absY) {
         return
      }

      const primaryDelta = isHorizontal ? e.deltaX : e.deltaY
      const currentDirection = Math.sign(primaryDelta)

      // Smart lock break: allow rapid consecutive swipes by detecting direction changes
      const isDirectionChange = currentDirection !== 0 && lastWheelDirection !== 0 && currentDirection !== lastWheelDirection

      if (isDirectionChange) {
         wheelLock.value = false
         accumulatedDelta = 0
      }

      lastWheelDirection = currentDirection

      // Lock detection:
      // Ignore further wheel events until wheel inertia stops
      if (wheelLock.value) {
         if (wheelOptions.preventDefault && e.cancelable) {
            e.preventDefault()
         }
         if (wheelOptions.stopPropagation) {
            e.stopPropagation()
         }
         // Keep extending the lock if user is still spinning the wheel
         releaseWheelLock()
         return
      }

      const isAtFirstSlide = !canGoPrev.value
      const isAtLastSlide = !canGoNext.value

      const verticalDelta = e.deltaY
      const isScrollingToPrevFromFirst = verticalDelta < 0 && isAtFirstSlide
      const isScrollingToNextFromLast = verticalDelta > 0 && isAtLastSlide

      if ((isScrollingToPrevFromFirst || isScrollingToNextFromLast) && !isHorizontal) {
         return
      }

      if (Math.abs(primaryDelta) >= 1) {
         if (wheelOptions.preventDefault && e.cancelable) {
            e.preventDefault()
         }
         if (wheelOptions.stopPropagation) {
            e.stopPropagation()
         }

         // Accumulate delta to support both smooth trackpads and clicky mouse wheels
         accumulatedDelta += primaryDelta

         if (Math.abs(accumulatedDelta) < wheelOptions.threshold) {
            resetWheelState()
            
            // Clear accumulated delta quickly if user pauses scrolling
            if (accumulateTimeout) clearTimeout(accumulateTimeout)
            accumulateTimeout = setTimeout(() => {
               accumulatedDelta = 0
            }, 40)
            return
         }

         const triggeredDelta = accumulatedDelta
         accumulatedDelta = 0
         if (accumulateTimeout) clearTimeout(accumulateTimeout)

         if (wheelTimeout) {
            clearTimeout(wheelTimeout)
         }

         // Apply the lock so subsequent fast events during this physical flick are ignored
         wheelLock.value = true
         releaseWheelLock()

         state.isWheeling = true
         isWheeling.value = true

         const isPageScroll = Math.abs(triggeredDelta) > wheelOptions.pageScrollThreshold

         if (triggeredDelta > wheelOptions.velocityThreshold) {
            if (canGoNext.value) {
               if (isPageScroll) goNextPage()
               else goNext()
            }
         } else if (triggeredDelta < -wheelOptions.velocityThreshold) {
            if (canGoPrev.value) {
               if (isPageScroll) goPrevPage()
               else goPrev()
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
