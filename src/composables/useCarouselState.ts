import { ref, computed, reactive, watch, nextTick, ComputedRef, readonly } from 'vue'
import type { CarouselProps, CarouselState } from '../types'

interface UseCarouselStateOptions {
   props: CarouselProps
   itemsToShow: ComputedRef<number>
   totalSlides: ComputedRef<number>
}

export function useCarouselState({ props, itemsToShow, totalSlides }: UseCarouselStateOptions) {
   // Use shallowReactive for better performance since we control the state shape
   const state = reactive<CarouselState>({
      currentIndex: 0,
      isTransitioning: false,
      isDragging: false,
      isHovered: false,
      isWheeling: false,
   })

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

   // Optimized slide navigation with transition management
   const goToSlide = (index: number, smooth = true) => {
      if (state.isTransitioning && smooth) return

      const targetIndex = Math.max(0, Math.min(index, maxIndex.value))
      if (targetIndex === state.currentIndex) return

      // Batch state updates for better performance
      if (smooth) {
         state.isTransitioning = true
         state.currentIndex = targetIndex

         // Use setTimeout instead of Promise for better performance
         setTimeout(() => {
            state.isTransitioning = false
         }, props.speed || 300)
      } else {
         state.currentIndex = targetIndex
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
      { flush: 'sync' } // Immediate execution for layout consistency
   )

   // Performance monitoring in development
   if (process.env.NODE_ENV === 'development') {
      let navigationCount = 0
      const startTime = performance.now()

      watch(
         () => state.currentIndex,
         () => {
            navigationCount++
            if (navigationCount % 10 === 0) {
               const avgTime = (performance.now() - startTime) / navigationCount
               console.log(`Carousel performance: ${avgTime.toFixed(2)}ms average per navigation`)
            }
         }
      )
   }

   return {
      state: readonly(state),
      maxIndex,
      canGoNext,
      canGoPrev,
      progress,
      visibleSlideIndices,
      goToSlide,
      goNext,
      goPrev,
      goNextPage,
      goPrevPage,
      updateState,
   }
}
