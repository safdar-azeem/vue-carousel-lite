import type { CarouselProps, CarouselState } from '../types'
import { ref, onMounted, onUnmounted, nextTick, Ref, ComputedRef, readonly, computed } from 'vue'

interface UseDragOptions {
   containerRef: Ref<HTMLElement | null>
   trackRef: Ref<HTMLElement | null>
   state: CarouselState
   props: CarouselProps
   slideWidth: Ref<number>
   slideHeight: Ref<number>
   goToSlide: (index: number, smooth?: boolean) => void
   canGoNext: ComputedRef<boolean>
   canGoPrev: ComputedRef<boolean>
   updateState: (updates: Partial<CarouselState>) => void
   virtualOffset: ComputedRef<number>
}

export function useDrag({
   containerRef,
   trackRef,
   state,
   props,
   slideWidth,
   slideHeight,
   goToSlide,
   canGoNext,
   canGoPrev,
   updateState,
   virtualOffset,
}: UseDragOptions) {
   const isDragging = ref(false)
   const startX = ref(0)
   const startY = ref(0)
   const currentX = ref(0)
   const currentY = ref(0)
   const deltaX = ref(0)
   const deltaY = ref(0)
   const startTime = ref(0)
   const initialTransform = ref(0)
   const hasSignificantMovement = ref(false)
   const isDragDirectionDetermined = ref(false)
   const dragDirection = ref<'horizontal' | 'vertical' | null>(null)

   // Performance optimizations
   let rafId: number | null = null
   let lastRafTime = 0
   const RAF_THROTTLE = 16 // ~60fps

   const isHorizontal = computed(() => props.direction === 'horizontal')

   // UPDATED: Calculate slide size including gap
   const slideSize = computed(() => {
      const gap = props.gap || 0
      if (isHorizontal.value) {
         return slideWidth.value + gap
      }
      return slideHeight.value + gap
   })

   const DRAG_THRESHOLD = 5
   const DIRECTION_THRESHOLD = 10

   // Optimized resistance calculation with memoization
   const getResistance = (delta: number): number => {
      const isAtStart = state.currentIndex === 0
      const isAtEnd = !canGoNext.value
      const isDraggingForward = delta < 0
      const isDraggingBackward = delta > 0

      if ((isAtStart && isDraggingBackward) || (isAtEnd && isDraggingForward)) {
         return delta * 0.3
      }
      return delta
   }

   // Use RAF for smooth DOM updates
   const updateTrackPosition = () => {
      if (!trackRef.value || !isDragging.value) return

      const now = performance.now()
      if (now - lastRafTime < RAF_THROTTLE) return

      if (rafId) {
         cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
         if (!trackRef.value || !isDragging.value) return

         const baseDelta = isHorizontal.value ? deltaX.value : deltaY.value
         const resistedDelta = getResistance(baseDelta)
         const currentTransform = initialTransform.value + resistedDelta

         // Use transform3d for GPU acceleration
         const transform = isHorizontal.value
            ? `translate3d(${currentTransform}px, 0, 0)`
            : `translate3d(0, ${currentTransform}px, 0)`

         trackRef.value!.style.transform = transform
         trackRef.value!.style.willChange = 'transform'

         lastRafTime = now
      })
   }

   const resetTrackPosition = () => {
      if (rafId) {
         cancelAnimationFrame(rafId)
         rafId = null
      }

      if (!trackRef.value) return

      trackRef.value.style.transform = ''
      trackRef.value.style.willChange = ''
      trackRef.value.style.transition = ''
      trackRef.value.removeAttribute('data-dragging')
   }

   // Optimized direction determination
   const determineDragDirection = (deltaX: number, deltaY: number): 'horizontal' | 'vertical' | null => {
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)
      const totalMovement = absDeltaX + absDeltaY // Faster than Math.sqrt

      if (totalMovement < DIRECTION_THRESHOLD) return null
      return absDeltaX > absDeltaY ? 'horizontal' : 'vertical'
   }

   // Batch state updates to prevent excessive reactivity
   const batchStateUpdate = (() => {
      let pendingUpdate: Partial<CarouselState> | null = null
      let updateScheduled = false

      return (updates: Partial<CarouselState>) => {
         if (!pendingUpdate) {
            pendingUpdate = { ...updates }
         } else {
            Object.assign(pendingUpdate, updates)
         }

         if (!updateScheduled) {
            updateScheduled = true
            nextTick(() => {
               if (pendingUpdate) {
                  updateState(pendingUpdate)
                  pendingUpdate = null
               }
               updateScheduled = false
            })
         }
      }
   })()

   const handleStart = (clientX: number, clientY: number) => {
      if (state.isTransitioning) return

      isDragging.value = true
      hasSignificantMovement.value = false
      isDragDirectionDetermined.value = false
      dragDirection.value = null

      startX.value = clientX
      startY.value = clientY
      currentX.value = clientX
      currentY.value = clientY
      deltaX.value = 0
      deltaY.value = 0
      startTime.value = performance.now()

      // UPDATED: Calculate initial transform accounting for gaps and virtual offset
      const gap = props.gap || 0
      if (isHorizontal.value) {
         const slideWithGap = slideWidth.value + gap
         const virtualOffsetPx = virtualOffset.value * slideWithGap
         const currentOffsetPx = state.currentIndex * slideWithGap
         initialTransform.value = virtualOffsetPx - currentOffsetPx
      } else {
         const slideWithGap = slideHeight.value + gap
         const virtualOffsetPx = virtualOffset.value * slideWithGap
         const currentOffsetPx = state.currentIndex * slideWithGap
         initialTransform.value = virtualOffsetPx - currentOffsetPx
      }

      // Batch the state update
      batchStateUpdate({ isDragging: true })

      // Optimize for dragging
      if (trackRef.value) {
         trackRef.value.style.pointerEvents = 'none'
         trackRef.value.setAttribute('data-dragging', 'true')
      }

      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
   }

   const handleMove = (clientX: number, clientY: number, e?: TouchEvent) => {
      if (!isDragging.value) return

      currentX.value = clientX
      currentY.value = clientY
      deltaX.value = currentX.value - startX.value
      deltaY.value = currentY.value - startY.value

      if (!isDragDirectionDetermined.value) {
         const detectedDirection = determineDragDirection(deltaX.value, deltaY.value)
         if (detectedDirection) {
            isDragDirectionDetermined.value = true
            dragDirection.value = detectedDirection
         }
      }

      const totalMovement = Math.abs(deltaX.value) + Math.abs(deltaY.value) // Faster calculation
      if (totalMovement > DRAG_THRESHOLD) {
         hasSignificantMovement.value = true
      }

      if (isDragDirectionDetermined.value && dragDirection.value === props.direction) {
         if (e) {
            e.preventDefault()
            e.stopPropagation()
         }
         updateTrackPosition()
      } else if (isDragDirectionDetermined.value && dragDirection.value !== props.direction) {
         // Clean exit for wrong direction
         handleEnd()
         return
      }
   }

   const handleEnd = () => {
      if (!isDragging.value) return

      // Cancel any pending RAF
      if (rafId) {
         cancelAnimationFrame(rafId)
         rafId = null
      }

      let targetIndex = state.currentIndex

      if (isDragDirectionDetermined.value && dragDirection.value === props.direction) {
         const delta = isHorizontal.value ? deltaX.value : deltaY.value
         const duration = performance.now() - startTime.value
         const velocity = Math.abs(delta) / Math.max(duration, 1) // Prevent division by zero

         // UPDATED: Use gap-aware slide size for threshold calculation
         const threshold = slideSize.value * 0.25 // Reduced threshold for better UX
         const velocityThreshold = 0.3

         if (Math.abs(delta) > threshold || velocity > velocityThreshold) {
            const isForward = delta < 0

            if (isForward && canGoNext.value) {
               targetIndex = state.currentIndex + 1
            } else if (!isForward && canGoPrev.value) {
               targetIndex = state.currentIndex - 1
            }
         }
      }

      // Cleanup and reset
      resetTrackPosition()
      isDragging.value = false
      isDragDirectionDetermined.value = false
      dragDirection.value = null

      if (trackRef.value) {
         trackRef.value.style.pointerEvents = ''
      }

      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''

      // Batch final state update
      batchStateUpdate({ isDragging: false })

      // Navigate to target slide
      if (targetIndex !== state.currentIndex) {
         goToSlide(targetIndex, true)
      }

      // Reset significant movement flag
      setTimeout(() => {
         hasSignificantMovement.value = false
      }, 100)
   }

   // Optimized event handlers with passive options
   const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return // Only left click
      e.preventDefault()
      handleStart(e.clientX, e.clientY)
   }

   const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
   }

   const handleMouseUp = () => {
      handleEnd()
   }

   const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return // Only single touch
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
   }

   const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY, e)
   }

   const handleTouchEnd = () => {
      handleEnd()
   }

   // Prevent click events after drag
   const handleClick = (e: Event) => {
      if (hasSignificantMovement.value) {
         e.preventDefault()
         e.stopPropagation()
         e.stopImmediatePropagation()
      }
   }

   onMounted(() => {
      const container = containerRef.value
      if (!container) return

      // Mouse events with optimized options
      container.addEventListener('mousedown', handleMouseDown, {
         passive: false,
      })
      document.addEventListener('mousemove', handleMouseMove, {
         passive: true,
      })
      document.addEventListener('mouseup', handleMouseUp, { passive: true })

      // Touch events with proper passive handling
      container.addEventListener('touchstart', handleTouchStart, {
         passive: true,
      })
      container.addEventListener('touchmove', handleTouchMove, {
         passive: false,
      })
      container.addEventListener('touchend', handleTouchEnd, {
         passive: true,
      })

      // Click prevention
      container.addEventListener('click', handleClick, { capture: true })

      // Prevent context menu during drag
      container.addEventListener(
         'contextmenu',
         (e) => {
            if (isDragging.value) e.preventDefault()
         },
         { passive: false }
      )
   })

   onUnmounted(() => {
      // Cleanup RAF
      if (rafId) {
         cancelAnimationFrame(rafId)
      }

      const container = containerRef.value

      // Remove document listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      if (container) {
         container.removeEventListener('mousedown', handleMouseDown)
         container.removeEventListener('touchstart', handleTouchStart)
         container.removeEventListener('touchmove', handleTouchMove)
         container.removeEventListener('touchend', handleTouchEnd)
         container.removeEventListener('click', handleClick, true)
      }

      // Cleanup styles
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
   })

   return {
      isDragging: readonly(isDragging),
      deltaX: readonly(deltaX),
      deltaY: readonly(deltaY),
   }
}
