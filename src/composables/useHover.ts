import { ref, onMounted, onUnmounted, Ref, readonly } from 'vue'
import type { CarouselState } from '../types'

interface UseHoverOptions {
   containerRef: Ref<HTMLElement | null>
   state: CarouselState
}

export function useHover({ containerRef, state }: UseHoverOptions) {
   const isHovered = ref(false)

   const handleMouseEnter = () => {
      isHovered.value = true
      state.isHovered = true
   }

   const handleMouseLeave = () => {
      isHovered.value = false
      state.isHovered = false
   }

   onMounted(() => {
      const container = containerRef.value
      if (!container) return

      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
   })

   onUnmounted(() => {
      const container = containerRef.value
      if (!container) return

      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
   })

   return {
      isHovered: readonly(isHovered),
   }
}
