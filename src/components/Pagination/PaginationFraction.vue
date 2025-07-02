<script setup lang="ts">
interface PaginationFractionProps {
   currentIndex: number
   totalSlides: number
}

defineProps<PaginationFractionProps>()
</script>

<template>
   <div class="carousel-pagination-fraction carousel-pagination-items">
      <span class="carousel-pagination-fraction-current">{{ currentIndex + 1 }}</span>
      <span class="carousel-pagination-fraction-separator">/</span>
      <span class="carousel-pagination-fraction-total">{{ totalSlides }}</span>
   </div>
</template>
