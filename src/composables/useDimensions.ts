import { debounce } from '../utils/debounce'
import type { SlidesPerView } from '../types'
import { useWindowWidth } from './useWindowWidth'
import { ref, onMounted, onUnmounted, nextTick, Ref, ComputedRef, computed, readonly, unref } from 'vue'

interface DimensionsOptions {
   direction?: 'horizontal' | 'vertical'
   containerRef: Ref<HTMLElement | null> | ComputedRef<HTMLElement | null>
   itemsToShow: number | SlidesPerView
   gap?: number
}

export function useDimensions(options: DimensionsOptions) {
   const isInitialized = ref(false)
   const windowWidth = useWindowWidth

   const containerWidth = ref<number | string>('100%')
   const slideHeight = ref<number | string>('auto')
   const slideWidth = ref<number>(0)

   // Simple debounced initialization
   const stopInitializing = debounce(() => {
      isInitialized.value = true
   }, 200)

   const updateDimensions = () => {
      const containerElement = unref(options.containerRef)
      if (!containerElement) return

      slideHeight.value = 'auto'
      containerWidth.value = '100%'

      if (options?.direction === 'vertical') {
         setTimeout(() => {
            const slide = containerElement.querySelector('.carousel-slide')
            if (slide) {
               slideHeight.value = slide.clientHeight + 'px'
            }
            stopInitializing()
         }, 50)
      }

      if (options?.direction === 'horizontal') {
         setTimeout(() => {
            const actualWidth = containerElement.clientWidth
            if (actualWidth > 0) {
               // UPDATED: Calculate slide width accounting for gaps
               const gap = itemsToShow.value > 1 ? options?.gap || 0 : 0
               const slides = itemsToShow.value
               const totalGapSpace = gap * (slides - 1) // Total space taken by gaps
               const availableWidth = actualWidth - totalGapSpace
               slideWidth.value = availableWidth / slides
               containerWidth.value = actualWidth + 'px'
            }
            stopInitializing()
         }, 10)
      }
   }

   const itemsToShow = computed(() => {
      if (typeof options.itemsToShow === 'number') {
         return options.itemsToShow
      }

      if (typeof options.itemsToShow === 'object') {
         if (windowWidth.value === 0) {
            const breakpoints = Object.keys(options.itemsToShow)
               .map(Number)
               .sort((a, b) => a - b)
            return options.itemsToShow[breakpoints[0]] || 1
         }

         const breakpoints = Object.keys(options.itemsToShow)
            .map(Number)
            .sort((a, b) => b - a)

         for (const breakpoint of breakpoints) {
            if (windowWidth.value >= breakpoint) {
               return options.itemsToShow[breakpoint]
            }
         }

         const smallestBreakpoint = Math.min(...breakpoints)
         return options.itemsToShow[smallestBreakpoint] || 1
      }

      return 1
   })

   const containerCSSVars = computed(() => {
      const slides = itemsToShow.value
      const gap = itemsToShow.value > 1 ? options?.gap || 0 : 0

      const width = Number(containerWidth?.value?.toString()?.replace('px', ''))

      // UPDATED: Calculate slide width properly accounting for gaps
      const totalGapSpace = gap * (slides - 1)
      const availableWidth = width - totalGapSpace
      const slideWidthValue = availableWidth / slides

      return {
         '--slides-count': slides,
         '--carousel-slide-width': slideWidthValue
            ? `${slideWidthValue}px`
            : `calc(${containerWidth?.value} / ${slides} - ${gap * 0.75}px)`,
         '--container-width': containerWidth?.value,
         '--container-height': slideHeight?.value,
         '--carousel-gap': `${gap}px`,
      }
   })

   const containerClass = computed(() => {
      const classes = ['carousel']

      if (options.direction === 'vertical') {
         classes.push('carousel--vertical')
      } else {
         classes.push('carousel--horizontal')
      }

      if (isInitialized.value) {
         classes.push('carousel--initialized')
      }

      return classes
   })

   const updateWindowWidth = () => {
      windowWidth.value = window.innerWidth
   }

   // FIXED: Properly working resize handler
   const debouncedResize = debounce(() => {
      // updateWindowWidth()
      isInitialized.value = false
      updateWindowWidth()
      updateDimensions()
   }, 100)

   onMounted(() => {
      updateWindowWidth()

      nextTick(() => {
         updateDimensions()
      })

      if (typeof window !== 'undefined') {
         // Use both resize event and ResizeObserver for maximum compatibility
         window.addEventListener('resize', debouncedResize, {
            passive: true,
         })
      }
   })

   onUnmounted(() => {
      if (typeof window !== 'undefined') {
         window.removeEventListener('resize', debouncedResize)
      }
   })

   const slideHeightInNumber = computed(() => Number(slideHeight.value.toString().replace('px', '')))

   // Force update function that actually works
   const forceUpdate = () => {
      isInitialized.value = false
      nextTick(() => {
         updateDimensions()
      })
   }

   return {
      containerWidth: readonly(containerWidth),
      slideHeight: slideHeightInNumber,
      isInitialized: isInitialized,
      updateDimensions: forceUpdate,
      itemsToShow,
      containerCSSVars,
      containerClass,
      slideWidth,
   }
}
