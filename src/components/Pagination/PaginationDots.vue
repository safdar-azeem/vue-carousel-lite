<script setup lang="ts">
interface PaginationDotsProps {
   currentIndex: number
   totalSlides: number
   visibleSlideIndices: number[]
   onGoToSlide: (index: number) => void
}

const props = defineProps<PaginationDotsProps>()

const handleDotClick = (index: number) => {
   props.onGoToSlide(index)
}
</script>

<template>
   <div class="carousel-pagination-dots carousel-pagination-items">
      <button
         v-for="index in totalSlides"
         :key="index - 1"
         :class="[
            'carousel-pagination-dot',
            {
               'carousel-pagination-dot--active': visibleSlideIndices.includes(index - 1),
               'carousel-pagination-dot--current': currentIndex === index - 1,
            },
         ]"
         :aria-label="`Go to slide ${index}`"
         @click.stop="handleDotClick(index - 1)" />
   </div>
</template>
