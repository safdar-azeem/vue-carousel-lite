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

export type PaginationVisibility = 'always' | 'hover'

export interface CarouselProps {
   data: any[]
   gap?: number
   loop?: boolean
   speed?: number
   easing?: string
   autoPlay?: boolean
   mousewheel?: boolean
   currentItem?: number
   autoPlayInterval?: number
   paginationBackground?: boolean
   paginationSize?: 'sm' | 'md' | 'lg'
   itemsToShow?: number | SlidesPerView
   direction?: 'horizontal' | 'vertical'
   pagination?: PaginationType | PaginationType[]
   paginationPosition?: PaginationPosition | PaginationPosition[]
   paginationVisibility?: PaginationVisibility | PaginationVisibility[]
   paginationEdgeThreshold?: number
   paginationInitialTimeout?: number
}

export interface CarouselState {
   currentIndex: number
   isTransitioning: boolean
   isDragging: boolean
   isHovered: boolean
   isWheeling: boolean
}

export interface CarouselMethods {
   goNext: (smooth?: boolean) => void
   goPrev: (smooth?: boolean) => void
   goNextPage: (smooth?: boolean) => void
   goPrevPage: (smooth?: boolean) => void
   goToSlide: (index: number, smooth?: boolean) => void
}

export interface CarouselExposedMethods extends CarouselMethods {
   state: Readonly<CarouselState>
   canGoNext: ComputedRef<boolean>
   canGoPrev: ComputedRef<boolean>
}

export interface DragState {
   startX: number
   startY: number
   deltaX: number
   deltaY: number
   isDragging: boolean
   currentX: number
   currentY: number
   startTime: number
}

export interface WheelOptions {
   threshold?: number
   preventDefault?: boolean
   stopPropagation?: boolean
   velocityThreshold?: number
}

export interface AutoplayOptions {
   interval?: number
   stopOnEnd?: boolean
   pauseOnHover?: boolean
   pauseOnInteraction?: boolean
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
