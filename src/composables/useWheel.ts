import { ref, onMounted, onUnmounted, Ref, ComputedRef, readonly, computed } from 'vue'
import type { CarouselProps, CarouselState } from '../types'

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

   // Navigation lock to prevent rapid scrolling during transitions
   const isNavigationLocked = ref(false)
   // Blocking flag to swallow inertia events after navigation finishes
   const isPostNavigationBlocking = ref(false)

   let lockTimeout: NodeJS.Timeout | null = null

   // Gesture accumulation for smooth 60fps handling
   let accumulatedDelta = 0
   let lastWheelTime = 0
   const GESTURE_TIMEOUT = 50 // ms to consider wheel events as same gesture

   // Reactive wheel options to handle dynamic config changes
   const options = computed(() => ({
      threshold: props.wheelOptions?.threshold ?? 10,
      velocityThreshold: props.wheelOptions?.velocityThreshold ?? 8,
      pageScrollThreshold: props.wheelOptions?.pageScrollThreshold ?? 80,
      debounceTime: props.wheelOptions?.debounceTime ?? 5,
      scrollByPage: props.wheelOptions?.scrollByPage ?? false,
      lockDuringTransition: props.wheelOptions?.lockDuringTransition ?? true,
      preventDefault: props.wheelOptions?.preventDefault ?? true,
      stopPropagation: props.wheelOptions?.stopPropagation ?? true,
   }))

   const getLockDuration = () => {
      return (props.speed || 300) + 50 // Add small buffer
   }

   const lockNavigation = () => {
      if (!options.value.lockDuringTransition) return

      isNavigationLocked.value = true
      isPostNavigationBlocking.value = true // Start blocking inertia

      if (lockTimeout) {
         clearTimeout(lockTimeout)
      }

      lockTimeout = setTimeout(() => {
         isNavigationLocked.value = false
         // Note: We do NOT reset isPostNavigationBlocking here.
         // It is reset in handleWheel only when the gesture stream breaks.
      }, getLockDuration())
   }

   const resetWheelState = () => {
      requestAnimationFrame(() => {
         state.isWheeling = false
         isWheeling.value = false
      })
   }

   const handleWheel = (e: WheelEvent) => {
      if (!props.mousewheel || state.isDragging) return

      const now = performance.now()
      const timeSinceLastWheel = now - lastWheelTime
      lastWheelTime = now // Always update time to track gesture continuity

      // 1. LOCKED STATE: Block everything during transition
      if (isNavigationLocked.value) {
         if (options.value.preventDefault) e.preventDefault()
         return
      }

      // 2. INERTIA BLOCKING: Swallow events after unlock until user stops
      if (isPostNavigationBlocking.value) {
         // If events are coming in fast (< 120ms gap), it's likely inertia from the previous swipe
         if (timeSinceLastWheel < GESTURE_TIMEOUT) {
            if (options.value.preventDefault) e.preventDefault()
            return
         }
         // Gap detected (> 120ms), safe to consider this a new gesture
         isPostNavigationBlocking.value = false
         accumulatedDelta = 0 // Clean start
      }

      const isHorizontal = props.direction === 'horizontal'
      const primaryDelta = isHorizontal ? (e.deltaX !== 0 ? e.deltaX : e.deltaY) : e.deltaY
      const absPrimaryDelta = Math.abs(primaryDelta)

      // Boundary checks for vertical page scroll fallback
      const isAtFirstSlide = !canGoPrev.value
      const isAtLastSlide = !canGoNext.value
      const isScrollingToPrevFromFirst = primaryDelta < 0 && isAtFirstSlide
      const isScrollingToNextFromLast = primaryDelta > 0 && isAtLastSlide

      // Allow native scroll at boundaries for vertical carousels
      if ((isScrollingToPrevFromFirst || isScrollingToNextFromLast) && props.direction === 'vertical') {
         return
      }

      // Prevent default browser scrolling
      if (absPrimaryDelta >= 1) {
         if (options.value.preventDefault && !isScrollingToPrevFromFirst && !isScrollingToNextFromLast) {
            e.preventDefault()
         }
         if (options.value.stopPropagation) {
            e.stopPropagation()
         }
      }

      // Reset accumulation if this is a new distinct gesture (time gap)
      // This handles the case where inertia blocking wasn't active but user paused
      if (timeSinceLastWheel > GESTURE_TIMEOUT) {
         accumulatedDelta = 0
      }

      accumulatedDelta += primaryDelta

      // Check threshold
      if (Math.abs(accumulatedDelta) < options.value.threshold) {
         return
      }

      // --- ACTION TRIGGERED ---

      state.isWheeling = true
      isWheeling.value = true

      const scrollDirection = accumulatedDelta > 0 ? 'next' : 'prev'
      let navigated = false

      if (scrollDirection === 'next' && canGoNext.value) {
         if (options.value.scrollByPage) {
            goNextPage()
         } else {
            goNext()
         }
         navigated = true
      } else if (scrollDirection === 'prev' && canGoPrev.value) {
         if (options.value.scrollByPage) {
            goPrevPage()
         } else {
            goPrev()
         }
         navigated = true
      }

      if (navigated) {
         lockNavigation()
         accumulatedDelta = 0 // Reset immediately after successful trigger
      }

      setTimeout(resetWheelState, options.value.debounceTime)
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

      if (lockTimeout) {
         clearTimeout(lockTimeout)
         lockTimeout = null
      }
   })

   return {
      isWheeling: readonly(isWheeling),
   }
}
