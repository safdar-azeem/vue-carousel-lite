import { ComputedRef } from 'vue'

export interface SlidesPerView {
   [key: number]: number
}

export type PaginationType = 'buttons' | 'dots' | 'lines' | 'fraction' | false
export type PaginationPosition =
   | 'center'
   | 'bottom-center'
   | 'bottom-left'
   | 'bottom-right'
   | 'center-right'
   | 'bottom'

export interface CarouselProps {
   data: any[]
   pagination?: PaginationType | PaginationType[]
   paginationSize?: 'sm' | 'md' | 'lg'
   paginationPosition?: PaginationPosition | PaginationPosition[]
   paginationBackground?: boolean
   direction?: 'horizontal' | 'vertical'
   autoPlay?: boolean
   autoPlayInterval?: number
   itemsToShow?: number | SlidesPerView
   mousewheel?: boolean
   gap?: number

   loop?: boolean
   speed?: number
   easing?: string
   currentItem?: number
}

export interface CarouselState {
   currentIndex: number
   isTransitioning: boolean
   isDragging: boolean
   isHovered: boolean
   isWheeling: boolean
}

export interface CarouselMethods {
   goToSlide: (index: number, smooth?: boolean) => void
   goNext: (smooth?: boolean) => void
   goPrev: (smooth?: boolean) => void
   goNextPage: (smooth?: boolean) => void
   goPrevPage: (smooth?: boolean) => void
}

export interface CarouselExposedMethods extends CarouselMethods {
   state: Readonly<CarouselState>
   canGoNext: ComputedRef<boolean>
   canGoPrev: ComputedRef<boolean>
}

export interface DragState {
   isDragging: boolean
   startX: number
   startY: number
   currentX: number
   currentY: number
   deltaX: number
   deltaY: number
   startTime: number
}

export interface WheelOptions {
   preventDefault?: boolean
   stopPropagation?: boolean
   threshold?: number
   velocityThreshold?: number
}

export interface AutoplayOptions {
   interval?: number
   pauseOnHover?: boolean
   pauseOnInteraction?: boolean
   stopOnEnd?: boolean
}

// Event interfaces
export interface CarouselChangeEvent {
   currentIndex: number
   previousIndex: number
   direction: 'next' | 'prev'
}

export interface CarouselDragEvent {
   deltaX: number
   deltaY: number
   velocity: number
   direction: 'horizontal' | 'vertical'
}

// Configuration interfaces
export interface CarouselBreakpoint {
   width: number
   settings: Partial<CarouselProps>
}

export interface CarouselResponsive {
   breakpoints: CarouselBreakpoint[]
}
