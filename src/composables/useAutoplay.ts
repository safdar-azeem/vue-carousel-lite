import { ref, watch, onMounted, onUnmounted, ComputedRef, readonly } from 'vue'
import type { CarouselProps, CarouselState } from '../types'

interface UseAutoplayOptions {
   props: CarouselProps
   state: CarouselState
   goNext: () => void
   canGoNext: ComputedRef<boolean>
}

export function useAutoplay({ props, state, goNext, canGoNext }: UseAutoplayOptions) {
   const autoplayTimer = ref<NodeJS.Timeout | null>(null)
   const isAutoplayPaused = ref(false)
   const isAutoplayActive = ref(false)

   const startAutoplay = () => {
      if (!props.autoPlay || isAutoplayActive.value) return

      isAutoplayActive.value = true
      isAutoplayPaused.value = false

      const interval = props.autoPlayInterval || 3000

      autoplayTimer.value = setInterval(() => {
         // Check if autoplay should be paused
         if (
            isAutoplayPaused.value ||
            state.isHovered ||
            state.isDragging ||
            state.isWheeling ||
            state.isTransitioning
         ) {
            return
         }

         if (canGoNext.value) {
            goNext()
         } else {
            // Stop at the end (no looping)
            stopAutoplay()
         }
      }, interval)
   }

   const stopAutoplay = () => {
      if (autoplayTimer.value) {
         clearInterval(autoplayTimer.value)
         autoplayTimer.value = null
      }
      isAutoplayActive.value = false
      isAutoplayPaused.value = false
   }

   const pauseAutoplay = () => {
      isAutoplayPaused.value = true
   }

   const resumeAutoplay = () => {
      if (props.autoPlay && isAutoplayActive.value) {
         isAutoplayPaused.value = false
      }
   }

   const restartAutoplay = () => {
      stopAutoplay()
      if (props.autoPlay) {
         setTimeout(startAutoplay, 100)
      }
   }

   // Watch for hover state changes
   watch(
      () => state.isHovered,
      (isHovered) => {
         if (isHovered) {
            pauseAutoplay()
         } else {
            resumeAutoplay()
         }
      }
   )

   // Watch for drag state changes
   watch(
      () => state.isDragging,
      (isDragging) => {
         if (isDragging) {
            pauseAutoplay()
         } else {
            // Resume after a brief delay to allow transition to complete
            setTimeout(resumeAutoplay, 500)
         }
      }
   )

   // Watch for wheel state changes
   watch(
      () => state.isWheeling,
      (isWheeling) => {
         if (isWheeling) {
            pauseAutoplay()
         } else {
            setTimeout(resumeAutoplay, 1000)
         }
      }
   )

   // Watch for manual navigation - restart autoplay timer
   watch(
      () => state.currentIndex,
      () => {
         if (state.isDragging || state.isWheeling) return
         restartAutoplay()
      }
   )

   // Watch for autoPlay prop changes
   watch(
      () => props.autoPlay,
      (enabled) => {
         if (enabled) {
            startAutoplay()
         } else {
            stopAutoplay()
         }
      }
   )

   onMounted(() => {
      if (props.autoPlay) {
         // Start autoplay after a brief delay to ensure everything is initialized
         setTimeout(startAutoplay, 1000)
      }
   })

   onUnmounted(() => {
      stopAutoplay()
   })

   return {
      isAutoplayActive: readonly(isAutoplayActive),
      isAutoplayPaused: readonly(isAutoplayPaused),
      startAutoplay,
      stopAutoplay,
      pauseAutoplay,
      resumeAutoplay,
      restartAutoplay,
   }
}
