import { ref, onMounted, onUnmounted, computed, Ref, watch } from 'vue'
import type { CarouselProps } from '../types'
import { debounce } from '../utils/debounce'

interface UsePaginationVisibilityOptions {
   containerRef: Ref<HTMLElement | null>
   pagination: CarouselProps['pagination']
   paginationVisibility: CarouselProps['paginationVisibility']
   paginationPosition: CarouselProps['paginationPosition']
   direction: CarouselProps['direction']
   paginationHoverEdgeThreshold?: number
   paginationHoverInitialTimeout?: number
}

interface PaginationVisibilityReturn {
   isPaginationVisible: Ref<Record<string, boolean>>
   isMouseNearEdge: Ref<{ prev: boolean; next: boolean }>
}

export function usePaginationVisibility({
   containerRef,
   pagination,
   paginationVisibility,
   paginationPosition,
   direction,
   paginationHoverEdgeThreshold = 0.2,
   paginationHoverInitialTimeout = 1000,
}: UsePaginationVisibilityOptions): PaginationVisibilityReturn {
   const isPaginationVisible = ref<Record<string, boolean>>({})
   const isMouseNearEdge = ref<{ prev: boolean; next: boolean }>({ prev: false, next: false })
   const mousePosition = ref({ x: 0, y: 0 })

   // Normalize pagination and visibility props
   const paginationTypes = computed(() => {
      return Array.isArray(pagination) ? pagination : [pagination]
   })

   const visibilityMap = computed(() => {
      const map: Record<string, string> = {}
      const visibilities = Array.isArray(paginationVisibility)
         ? paginationVisibility
         : [paginationVisibility || 'always']
      paginationTypes.value.forEach((type, index) => {
         map[type as string] = visibilities[index] || visibilities[0] || 'always'
      })
      return map
   })

   // Initialize visibility state
   const initializeVisibility = () => {
      paginationTypes.value.forEach((type) => {
         isPaginationVisible.value[type as string] = visibilityMap.value[type as string] === 'always'
      })
   }

   // Handle initial show/hide for hover visibility
   onMounted(() => {
      initializeVisibility()
      Object.keys(visibilityMap.value).forEach((type) => {
         if (visibilityMap.value[type] === 'hover') {
            isPaginationVisible.value[type] = true
            setTimeout(() => {
               isPaginationVisible.value[type] = false
            }, paginationHoverInitialTimeout)
         }
      })
   })

   // Debounced mouse move handler
   const handleMouseMove = debounce((e: MouseEvent) => {
      if (!containerRef.value) return

      const rect = containerRef.value.getBoundingClientRect()
      mousePosition.value = {
         x: e.clientX - rect.left,
         y: e.clientY - rect.top,
      }

      const threshold =
         direction === 'horizontal'
            ? rect.width * paginationHoverEdgeThreshold
            : rect.height * paginationHoverEdgeThreshold
      const isHorizontal = direction === 'horizontal'

      // Reset edge flags
      isMouseNearEdge.value.prev = false
      isMouseNearEdge.value.next = false

      // Check if mouse is within container bounds
      const isOutsideContainer =
         mousePosition.value.x < 0 ||
         mousePosition.value.x > rect.width ||
         mousePosition.value.y < 0 ||
         mousePosition.value.y > rect.height

      // Update edge flags if mouse is within container
      if (!isOutsideContainer) {
         if (isHorizontal) {
            if (mousePosition.value.x <= threshold) {
               isMouseNearEdge.value.prev = true
            } else if (mousePosition.value.x >= rect.width - threshold) {
               isMouseNearEdge.value.next = true
            }
         } else {
            if (mousePosition.value.y <= threshold) {
               isMouseNearEdge.value.prev = true
            } else if (mousePosition.value.y >= rect.height - threshold) {
               isMouseNearEdge.value.next = true
            }
         }
      }

      // Update visibility for hover types
      Object.keys(visibilityMap.value).forEach((type) => {
         if (visibilityMap.value[type] === 'hover') {
            if (type === 'buttons') {
               const position = Array.isArray(paginationPosition)
                  ? paginationPosition[paginationTypes.value.indexOf(type)] || paginationPosition[0]
                  : paginationPosition
               if (position === 'center') {
                  isPaginationVisible.value[type] =
                     isMouseNearEdge.value.prev || isMouseNearEdge.value.next
               } else {
                  isPaginationVisible.value[type] = !isOutsideContainer
               }
            } else {
               isPaginationVisible.value[type] = !isOutsideContainer
            }
         }
      })
   }, 50)

   // Handle mouse enter
   const handleMouseEnter = () => {
      Object.keys(visibilityMap.value).forEach((type) => {
         if (visibilityMap.value[type] === 'hover') {
            isPaginationVisible.value[type] = type === 'buttons' ? false : true
         }
      })
   }

   // Handle mouse leave
   const handleMouseLeave = () => {
      Object.keys(visibilityMap.value).forEach((type) => {
         if (visibilityMap.value[type] === 'hover') {
            isPaginationVisible.value[type] = false
         }
      })
      isMouseNearEdge.value.prev = false
      isMouseNearEdge.value.next = false
   }

   // Watch for prop changes
   watch([pagination, paginationVisibility], initializeVisibility)

   // Event listeners
   onMounted(() => {
      const container = containerRef.value
      if (container) {
         container.addEventListener('mousemove', handleMouseMove)
         container.addEventListener('mouseenter', handleMouseEnter)
         container.addEventListener('mouseleave', handleMouseLeave)
      }
   })

   onUnmounted(() => {
      const container = containerRef.value
      if (container) {
         container.removeEventListener('mousemove', handleMouseMove)
         container.removeEventListener('mouseenter', handleMouseEnter)
         container.removeEventListener('mouseleave', handleMouseLeave)
      }
   })

   return {
      isPaginationVisible,
      isMouseNearEdge,
   }
}
