import type { CarouselProps } from '../types';
declare var __VLS_1: {
    item: any;
    index: number;
}, __VLS_6: {}, __VLS_8: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
} & {
    'prev-icon'?: (props: typeof __VLS_6) => any;
} & {
    'next-icon'?: (props: typeof __VLS_8) => any;
};
declare const __VLS_component: import("vue").DefineComponent<CarouselProps, {
    goToSlide: (index: number, smooth?: boolean) => void;
    goNext: (smooth?: boolean) => void;
    goPrev: (smooth?: boolean) => void;
    state: {
        readonly currentIndex: number;
        readonly isTransitioning: boolean;
        readonly isDragging: boolean;
        readonly isHovered: boolean;
        readonly isWheeling: boolean;
    };
    canGoNext: import("vue").ComputedRef<boolean>;
    canGoPrev: import("vue").ComputedRef<boolean>;
    focus: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "slide-change": (index: number) => any;
}, string, import("vue").PublicProps, Readonly<CarouselProps> & Readonly<{
    "onSlide-change"?: ((index: number) => any) | undefined;
}>, {
    gap: number;
    loop: boolean;
    speed: number;
    easing: string;
    autoPlay: boolean;
    draggable: boolean;
    mousewheel: boolean;
    currentItem: number;
    autoPlayInterval: number;
    paginationSize: "sm" | "md" | "lg";
    itemsToShow: number | import("../types").SlidesPerView;
    direction: "horizontal" | "vertical";
    pagination: import("../types").PaginationType | import("../types").PaginationType[];
    paginationVisibility: import("../types").PaginationVisibility | import("../types").PaginationVisibility[];
    paginationHoverEdgeThreshold: number;
    paginationHoverInitialTimeout: number;
    wheelOptions: import("../types").WheelOptions;
    bufferSize: number;
    maxDomElements: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
