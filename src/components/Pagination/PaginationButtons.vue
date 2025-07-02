<script setup lang="ts">
interface PaginationButtonsProps {
   canGoNext: boolean
   canGoPrev: boolean
   onGoNext: () => void
   onGoPrev: () => void
}

const props = defineProps<PaginationButtonsProps>()

const handleButtonClick = (direction: 'prev' | 'next') => {
   if (direction === 'prev') {
      props.onGoPrev()
   } else {
      props.onGoNext()
   }
}
</script>

<template>
   <!-- Buttons Pagination -->
   <div class="carousel-pagination-buttons carousel-pagination-items">
      <button
         :class="[
            'carousel-pagination-button',
            'carousel-pagination-button--prev',
            { 'carousel-pagination-button--disabled': !canGoPrev },
         ]"
         :disabled="!canGoPrev"
         :aria-label="'Previous slide'"
         @click.stop="handleButtonClick('prev')">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M15 18L9 12L15 6"
               stroke="currentColor"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round" />
         </svg>
      </button>

      <button
         :class="[
            'carousel-pagination-button',
            'carousel-pagination-button--next',
            { 'carousel-pagination-button--disabled': !canGoNext },
         ]"
         :disabled="!canGoNext"
         :aria-label="'Next slide'"
         @click.stop="handleButtonClick('next')">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M9 18L15 12L9 6"
               stroke="currentColor"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round" />
         </svg>
      </button>
   </div>
</template>
