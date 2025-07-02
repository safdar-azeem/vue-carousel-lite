<script setup lang="ts">
interface PaginationLinesProps {
   currentIndex: number
   totalSlides: number
   visibleSlideIndices: number[]
   onGoToSlide: (index: number) => void
}

const props = defineProps<PaginationLinesProps>()

const handleLineClick = (index: number) => {
   props.onGoToSlide(index)
}
</script>

<template>
   <div class="carousel-pagination-lines carousel-pagination-items">
      <button
         v-for="index in totalSlides"
         :key="index - 1"
         :class="[
            'carousel-pagination-line',
            {
               'carousel-pagination-line--active': visibleSlideIndices.includes(index - 1),
               'carousel-pagination-line--current': currentIndex === index - 1,
            },
         ]"
         :aria-label="`Go to slide ${index}`"
         @click.stop="handleLineClick(index - 1)" />
   </div>
</template>
