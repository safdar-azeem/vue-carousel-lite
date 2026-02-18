import { Ref, ComputedRef } from 'vue';
import type { CarouselProps, CarouselState } from '../types';
interface UseWheelOptions {
    goNext: () => void;
    goPrev: () => void;
    goNextPage: () => void;
    goPrevPage: () => void;
    state: CarouselState;
    props: CarouselProps;
    canGoNext: ComputedRef;
    canGoPrev: ComputedRef;
    containerRef: Ref;
}
export declare function useWheel({ containerRef, state, props, goNext, goPrev, goNextPage, goPrevPage, canGoNext, canGoPrev, }: UseWheelOptions): {
    isWheeling: Readonly<Ref<boolean, boolean>>;
};
export {};
