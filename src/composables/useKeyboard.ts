import { ComputedRef, onMounted, onUnmounted, Ref } from 'vue'
import type { CarouselProps } from '../types'

interface UseKeyboardOptions {
   containerRef: Ref<HTMLElement | null>
   props: CarouselProps
   goNext: () => void
   goPrev: () => void
   goNextPage: () => void
   goPrevPage: () => void
   goToSlide: (index: number, smooth?: boolean) => void
   totalSlides: ComputedRef<number>
}

export function useKeyboard({
   containerRef,
   props,
   goNext,
   goPrev,
   goNextPage,
   goPrevPage,
   goToSlide,
   totalSlides,
}: UseKeyboardOptions) {
   const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle when carousel container or its children are focused
      const container = containerRef.value
      if (!container) return

      // Check if the focused element is the container or a child of the container
      const isCarouselFocused =
         document.activeElement === container || container.contains(document.activeElement)

      if (!isCarouselFocused) return

      const isHorizontal = props.direction === 'horizontal'
      const isPageNavigation = e.ctrlKey || e.metaKey || e.shiftKey

      switch (e.key) {
         case 'ArrowLeft':
            if (isHorizontal) {
               e.preventDefault()
               e.stopPropagation()
               if (isPageNavigation) {
                  goPrevPage()
               } else {
                  goPrev()
               }
            }
            break

         case 'ArrowRight':
            if (isHorizontal) {
               e.preventDefault()
               e.stopPropagation()
               if (isPageNavigation) {
                  goNextPage()
               } else {
                  goNext()
               }
            }
            break

         case 'ArrowUp':
            if (!isHorizontal) {
               e.preventDefault()
               e.stopPropagation()
               if (isPageNavigation) {
                  goPrevPage()
               } else {
                  goPrev()
               }
            }
            break

         case 'ArrowDown':
            if (!isHorizontal) {
               e.preventDefault()
               e.stopPropagation()
               if (isPageNavigation) {
                  goNextPage()
               } else {
                  goNext()
               }
            }
            break

         case 'Home':
            e.preventDefault()
            e.stopPropagation()
            goToSlide(0, true)
            break

         case 'End':
            e.preventDefault()
            e.stopPropagation()
            goToSlide(totalSlides.value - 1, true)
            break

         case ' ': // Spacebar
         case 'Enter':
            // Allow spacebar and enter to work for pagination buttons, but prevent page scroll for space
            if (e.key === ' ') {
               // Only prevent default if the focused element is the container itself
               if (document.activeElement === container) {
                  e.preventDefault()
               }
            }
            break
      }
   }

   const handleContainerFocus = () => {
      const container = containerRef.value
      if (!container) return

      // Add visual focus indicator
      container.style.outline = '2px solid rgba(59, 130, 246, 0.5)'
      container.style.outlineOffset = '2px'
   }

   const handleContainerBlur = () => {
      const container = containerRef.value
      if (!container) return

      // Remove visual focus indicator
      container.style.outline = 'none'
      container.style.outlineOffset = '0'
   }

   const handleContainerClick = () => {
      const container = containerRef.value
      if (!container) return

      // Focus the container when clicked to enable keyboard navigation
      if (document.activeElement !== container) {
         container.focus()
      }
   }

   onMounted(() => {
      const container = containerRef.value
      if (!container) return

      // Ensure container is focusable
      if (!container.hasAttribute('tabindex')) {
         container.setAttribute('tabindex', '0')
      }

      // Add keyboard event listener to document for global capture
      document.addEventListener('keydown', handleKeyDown, { capture: true })

      // Add focus/blur handlers for visual feedback
      container.addEventListener('focus', handleContainerFocus)
      container.addEventListener('blur', handleContainerBlur)

      // Add click handler to focus container
      container.addEventListener('click', handleContainerClick)

      // Set initial focus styles
      container.style.outline = 'none'
      container.style.cursor = 'pointer'
   })

   onUnmounted(() => {
      const container = containerRef.value

      // Remove document event listener
      document.removeEventListener('keydown', handleKeyDown, {
         capture: true,
      })

      if (container) {
         container.removeEventListener('focus', handleContainerFocus)
         container.removeEventListener('blur', handleContainerBlur)
         container.removeEventListener('click', handleContainerClick)
      }
   })

   return {
      // Expose method to manually focus the carousel for external control
      focus: () => {
         const container = containerRef.value
         if (container) {
            container.focus()
         }
      },
   }
}
