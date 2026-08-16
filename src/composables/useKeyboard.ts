import { onMounted, onUnmounted, type ComputedRef, type Ref } from 'vue'
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
      const container = containerRef.value
      if (!container) return

      // Only handle when container or its children are focused
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
            if (e.key === ' ' && document.activeElement === container) {
               e.preventDefault()
            }
            break
      }
   }

   const handleContainerClick = () => {
      const container = containerRef.value
      if (!container) return

      if (document.activeElement !== container) {
         container.focus()
      }
   }

   onMounted(() => {
      const container = containerRef.value
      if (!container) return

      if (!container.hasAttribute('tabindex')) {
         container.setAttribute('tabindex', '0')
      }

      container.addEventListener('keydown', handleKeyDown)
      container.addEventListener('click', handleContainerClick)

      // Respect autoFocus prop contract
      if (props?.autoFocus) {
         container.focus({ preventScroll: true })
      }
   })

   onUnmounted(() => {
      const container = containerRef.value
      if (container) {
         container.removeEventListener('keydown', handleKeyDown)
         container.removeEventListener('click', handleContainerClick)
      }
   })

   return {
      focus: () => {
         const container = containerRef.value
         if (container) {
            container.focus()
         }
      },
   }
}
