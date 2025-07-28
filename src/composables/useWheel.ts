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
   const VERTICAL_THRESHOLD = 30

   // Add wheel event throttling to prevent double navigation
   const lastWheelTime = ref(0)
   const WHEEL_THROTTLE_DELAY = 200 // Minimum time between wheel navigations
   const wheelEventQueue = ref<WheelEvent[]>([])
   let isProcessingWheel = false

   const resetWheelState = debounce(() => {
      state.isWheeling = false
      isWheeling.value = false
      directionLock.value = null
      accumulatedDeltaY.value = 0
      wheelEventQueue.value = []
      isProcessingWheel = false
   }, 150)

   // Process wheel events in a controlled manner
   const processWheelEvent = async (e: WheelEvent) => {
      if (isProcessingWheel) return

      isProcessingWheel = true
      const currentTime = Date.now()

      // Throttle wheel events to prevent rapid fire
      if (currentTime - lastWheelTime.value < WHEEL_THROTTLE_DELAY) {
         isProcessingWheel = false
         return
      }

      lastWheelTime.value = currentTime

      const isHorizontal = props.direction === 'horizontal'
      const primaryDelta = isHorizontal ? e.deltaX : e.deltaY
      const absPrimaryDelta = Math.abs(primaryDelta)
      const verticalDelta = e.deltaY
      const absVerticalDelta = Math.abs(verticalDelta)

      // Accumulate vertical delta for threshold checking
      accumulatedDeltaY.value += absVerticalDelta

      // Determine scroll direction if not locked
      if (!directionLock.value) {
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
         isProcessingWheel = false
         return // Let parent handle vertical scroll
      }

      // Handle carousel navigation with strict conditions
      if (
         (isHorizontal && directionLock.value === 'horizontal') ||
         (!isHorizontal && directionLock.value === 'vertical') ||
         (!directionLock.value && absPrimaryDelta >= 10)
      ) {
         e.preventDefault()
         e.stopPropagation()

         if (absPrimaryDelta < 10) {
            resetWheelState()
            isProcessingWheel = false
            return
         }

         if (wheelTimeout) {
            clearTimeout(wheelTimeout)
         }

         // Prevent navigation if already transitioning
         if (state.isTransitioning) {
            isProcessingWheel = false
            return
         }

         state.isWheeling = true
         isWheeling.value = true

         const isPageScroll = absPrimaryDelta > 100

         // Single navigation call with strict boundary checks
         if (primaryDelta > 0) {
            if (canGoNext.value && !state.isTransitioning) {
               if (isPageScroll) {
                  goNextPage()
               } else {
                  goNext()
               }
            }
         } else {
            if (canGoPrev.value && !state.isTransitioning) {
               if (isPageScroll) {
                  goPrevPage()
               } else {
                  goPrev()
               }
            }
         }

         // Add additional delay before allowing next wheel event
         setTimeout(() => {
            isProcessingWheel = false
         }, 50)

         resetWheelState()
      } else {
         isProcessingWheel = false
      }
   }

   const handleWheel = (e: WheelEvent) => {
      if (!props.mousewheel || state.isDragging || state.isTransitioning) return

      // Queue the event and process it
      wheelEventQueue.value.push(e)

      // Process only the latest event, discard others
      if (wheelEventQueue.value.length > 1) {
         wheelEventQueue.value = [wheelEventQueue.value.pop()!]
      }

      const latestEvent = wheelEventQueue.value[0]
      if (latestEvent) {
         processWheelEvent(latestEvent)
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

      wheelEventQueue.value = []
      isProcessingWheel = false
   })

   return {
      isWheeling: readonly(isWheeling),
   }
}
