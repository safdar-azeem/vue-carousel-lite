import { ref, computed, reactive, watch, nextTick, ComputedRef, readonly } from 'vue'
import type { CarouselProps, CarouselState } from '../types'

interface UseCarouselStateOptions {
   props: CarouselProps
   itemsToShow: ComputedRef<number>
   totalSlides: ComputedRef<number>
}

export function useCarouselState({ props, itemsToShow, totalSlides }: UseCarouselStateOptions) {
   const state = reactive<CarouselState>({
      currentIndex: 0,
      isTransitioning: false,
      isDragging: false,
      isHovered: false,
      isWheeling: false,
   })

   // Virtual rendering state
   const renderWindowStart = ref(0)
   const renderWindowEnd = ref(0)
   const BUFFER_SIZE = props?.bufferSize || 5
   const WINDOW_SIZE = props?.maxDomElements || 10

   // Track pending window updates to prevent visual glitches
   const pendingWindowUpdate = ref<{
      newStart: number
      newEnd: number
      targetIndex: number
   } | null>(null)

   // Cached computations to prevent unnecessary recalculations
   const computedCache = ref({
      maxIndex: 0,
      canGoNext: true,
      canGoPrev: false,
      progress: 0,
      lastItemsToShow: 0,
      lastTotalSlides: 0,
   })

   // Performance-optimized maxIndex calculation with caching
   const maxIndex = computed(() => {
      const currentItemsToShow = itemsToShow.value
      const currentTotalSlides = totalSlides.value

      // Use cache if inputs haven't changed
      if (
         computedCache.value.lastItemsToShow === currentItemsToShow &&
         computedCache.value.lastTotalSlides === currentTotalSlides
      ) {
         return computedCache.value.maxIndex
      }

      let newMaxIndex: number
      if (props.direction === 'vertical') {
         newMaxIndex = Math.max(0, currentTotalSlides - 1)
      } else {
         newMaxIndex = Math.max(0, currentTotalSlides - currentItemsToShow)
      }

      // Update cache
      computedCache.value.maxIndex = newMaxIndex
      computedCache.value.lastItemsToShow = currentItemsToShow
      computedCache.value.lastTotalSlides = currentTotalSlides

      return newMaxIndex
   })

   // Memoized navigation state
   const canGoNext = computed(() => {
      const result = state.currentIndex < maxIndex.value
      computedCache.value.canGoNext = result
      return result
   })

   const canGoPrev = computed(() => {
      const result = state.currentIndex > 0
      computedCache.value.canGoPrev = result
      return result
   })

   // Optimized progress calculation
   const progress = computed(() => {
      const max = maxIndex.value
      if (max === 0) return 100

      const result = (state.currentIndex / max) * 100
      computedCache.value.progress = result
      return result
   })

   // Performance-optimized visible slide indices calculation
   const visibleSlideIndices = computed(() => {
      const indices: number[] = []
      const start = state.currentIndex
      const end = Math.min(start + itemsToShow.value, totalSlides.value)

      // Pre-allocate array for better performance
      indices.length = end - start

      for (let i = start; i < end; i++) {
         indices[i - start] = i
      }

      return indices
   })

   const calculateOptimalWindow = (targetIndex: number) => {
      const total = totalSlides.value

      // If total slides are less than or equal to window size, return all
      if (total <= WINDOW_SIZE) {
         return { start: 0, end: total - 1 }
      }

      let halfWindow = Math.floor(WINDOW_SIZE / 2)
      let start = targetIndex - halfWindow
      let end = targetIndex + halfWindow

      // Adjust if start or end are out of bounds
      if (start < 0) {
         start = 0
         end = WINDOW_SIZE - 1
      } else if (end >= total) {
         end = total - 1
         start = end - WINDOW_SIZE + 1
      }

      console.log('idealStart :>> ', start)
      console.log('idealEnd :>> ', end)

      return { start, end }
   }

   // Virtual rendering: Calculate which slides should be rendered
   const renderedSlideIndices = computed(() => {
      const total = totalSlides.value
      const windowStart = renderWindowStart.value
      const windowEnd = renderWindowEnd.value

      const indices: number[] = []
      for (let i = windowStart; i <= windowEnd; i++) {
         if (i >= 0 && i < total) {
            indices.push(i)
         }
      }

      return indices
   })

   // FIXED: Smart buffer edge detection with hysteresis
   const shouldUpdateRenderWindow = (targetIndex: number) => {
      const total = totalSlides.value

      if (total <= itemsToShow.value + BUFFER_SIZE * 2) {
         return false
      }

      const windowStart = renderWindowStart.value
      const windowEnd = renderWindowEnd.value

      // Initialize window if not set
      if (windowStart === 0 && windowEnd === 0) {
         return true
      }

      // Only update when we're at the very edge of safe zone (not before)
      const leftEdge = windowStart + 2 // More conservative
      const rightEdge = windowEnd - itemsToShow.value - 2 // More conservative

      return targetIndex <= leftEdge || targetIndex >= rightEdge
   }

   // FIXED: Deferred window update to prevent visual glitches
   const updateRenderWindow = (targetIndex: number, immediate = false) => {
      const total = totalSlides.value

      if (total <= itemsToShow.value + BUFFER_SIZE * 2) {
         renderWindowStart.value = 0
         renderWindowEnd.value = total - 1
         return
      }

      const { start, end } = calculateOptimalWindow(targetIndex)

      if (immediate) {
         // Immediate update for initialization
         renderWindowStart.value = start
         renderWindowEnd.value = end
         pendingWindowUpdate.value = null
      } else {
         // Defer the window update to prevent visual glitches
         pendingWindowUpdate.value = { newStart: start, newEnd: end, targetIndex }
      }
   }

   // Apply pending window update after transition
   const applyPendingWindowUpdate = () => {
      if (pendingWindowUpdate.value) {
         const { newStart, newEnd } = pendingWindowUpdate.value
         renderWindowStart.value = newStart
         renderWindowEnd.value = newEnd
         pendingWindowUpdate.value = null
      }
   }

   // Virtual offset for transform calculation
   const virtualOffset = computed(() => {
      return renderWindowStart.value
   })

   // FIXED: Slide navigation with deferred window updates
   const goToSlide = (index: number, smooth = true) => {
      if (state.isTransitioning && smooth) return

      const targetIndex = Math.max(0, Math.min(index, maxIndex.value))
      if (targetIndex === state.currentIndex) return

      // Check if we need a window update, but don't apply it yet
      const needsWindowUpdate = shouldUpdateRenderWindow(targetIndex)

      if (needsWindowUpdate && !state.isTransitioning) {
         updateRenderWindow(targetIndex, false) // Prepare but don't apply
      }

      // Update current index immediately
      state.currentIndex = targetIndex

      // Handle transition
      if (smooth) {
         state.isTransitioning = true

         setTimeout(() => {
            state.isTransitioning = false
            // Apply window update after transition completes
            applyPendingWindowUpdate()
         }, props.speed || 300)
      } else {
         // For non-smooth transitions, apply window update immediately
         applyPendingWindowUpdate()
      }
   }

   // Optimized navigation methods with boundary checks
   const goNext = (smooth = true) => {
      if (!canGoNext.value || state.isTransitioning || state.isWheeling) return
      goToSlide(state.currentIndex + 1, smooth)
   }

   const goPrev = (smooth = true) => {
      if (!canGoPrev.value || state.isTransitioning || state.isWheeling) return
      goToSlide(state.currentIndex - 1, smooth)
   }

   const goNextPage = (smooth = true) => {
      if (!canGoNext.value || state.isTransitioning || state.isWheeling) return
      const nextIndex = Math.min(state.currentIndex + itemsToShow.value, maxIndex.value)
      goToSlide(nextIndex, smooth)
   }

   const goPrevPage = (smooth = true) => {
      if (!canGoPrev.value || state.isTransitioning || state.isWheeling) return
      const prevIndex = Math.max(state.currentIndex - itemsToShow.value, 0)
      goToSlide(prevIndex, smooth)
   }

   // High-performance state update function with validation and batching
   const updateState = (() => {
      let updatePending = false
      let pendingUpdates: Partial<CarouselState> = {}

      const flushUpdates = () => {
         if (!updatePending) return

         updatePending = false
         const updates = { ...pendingUpdates }
         pendingUpdates = {}

         // Apply all updates in a single batch
         Object.assign(state, updates)
      }

      return (updates: Partial<CarouselState>) => {
         // Validate and merge updates
         Object.entries(updates).forEach(([key, value]) => {
            const typedKey = key as keyof CarouselState

            switch (typedKey) {
               case 'currentIndex':
                  if (typeof value === 'number' && value >= 0) {
                     pendingUpdates.currentIndex = Math.max(0, Math.min(value, maxIndex.value))
                  }
                  break
               case 'isTransitioning':
               case 'isDragging':
               case 'isHovered':
               case 'isWheeling':
                  if (typeof value === 'boolean') {
                     pendingUpdates[typedKey] = value
                  }
                  break
            }
         })

         if (!updatePending) {
            updatePending = true
            nextTick(flushUpdates)
         }
      }
   })()

   // Initialize render window
   watch(
      () => totalSlides.value,
      () => {
         updateRenderWindow(state.currentIndex, true) // Immediate for initialization
      },
      { immediate: true }
   )

   // Watch for transition completion to apply pending updates
   watch(
      () => state.isTransitioning,
      (isTransitioning) => {
         if (!isTransitioning && pendingWindowUpdate.value) {
            // Small delay to ensure smooth visual transition
            setTimeout(() => {
               applyPendingWindowUpdate()
            }, 50)
         }
      }
   )

   // Optimized watcher for itemsToShow changes
   let previousMaxIndex = maxIndex.value
   watch(
      () => maxIndex.value,
      (newMaxIndex) => {
         if (newMaxIndex !== previousMaxIndex) {
            previousMaxIndex = newMaxIndex

            // Only adjust current index if it's now out of bounds
            if (state.currentIndex > newMaxIndex) {
               goToSlide(newMaxIndex, false)
            }
         }
      },
      { flush: 'sync' }
   )

   return {
      state: readonly(state),
      maxIndex,
      canGoNext,
      canGoPrev,
      progress,
      visibleSlideIndices,
      renderedSlideIndices,
      virtualOffset,
      goToSlide,
      goNext,
      goPrev,
      goNextPage,
      goPrevPage,
      updateState,
   }
}
