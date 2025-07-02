import type { CarouselProps } from 'vue-carousel-lite'

// Example configurations
interface Example {
   title: string
   config: Partial<CarouselProps>
   code: string
}

export const examples: Example[] = [
   {
      title: 'Basic Carousel',
      config: {
         pagination: 'dots',
         itemsToShow: 1,
         gap: 0,
         loop: true,
      },
      code: `
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'

const data = [
   'https://example.com/image1.jpg',
   'https://example.com/image2.jpg',
   'https://example.com/image3.jpg',
]
</script>

<template>
   <Carousel :data="data" pagination="dots" :items-to-show="1"  :loop="true">
      <template #default="{ item }">
         <div class="image-container">
            <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
            <div class="image-overlay">
               <span>Slide {{ data.indexOf(item) + 1 }}</span>
            </div>
         </div>
      </template>
   </Carousel>
</template>
      `.trim(),
   },
   {
      title: 'Responsive Breakpoints',
      config: {
         itemsToShow: { 640: 1, 768: 2, 1024: 3 },
         pagination: 'dots',
         gap: 10,
         paginationPosition: 'bottom-center',
         loop: true,
         speed: 500,
      },
      code: `
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'

const data = [
   'https://example.com/image1.jpg',
   'https://example.com/image2.jpg',
   'https://example.com/image3.jpg',
   'https://example.com/image4.jpg',
]
const itemsToShow = {
   640: 1,
   768: 2,
   1024: 3,
}
</script>

<template>
   <Carousel
      :data="data"
      :items-to-show="itemsToShow"
      pagination="dots"
      pagination-position="bottom-center"
      :gap="10"
      :loop="true"
      :speed="500">
      <template #default="{ item }">
         <div class="image-container">
            <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
            <div class="image-overlay">
               <span>Slide {{ data.indexOf(item) + 1 }}</span>
            </div>
         </div>
      </template>
   </Carousel>
</template>
      `.trim(),
   },
   {
      title: 'Multi Pagination',
      config: {
         pagination: ['dots', 'buttons'],
         paginationPosition: ['bottom-center', 'center'],
         itemsToShow: 1,
         gap: 0,
         loop: true,
         mousewheel: true,
      },
      code: `
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'

const data = [
   'https://example.com/image1.jpg',
   'https://example.com/image2.jpg',
   'https://example.com/image3.jpg',
]
</script>

<template>
   <Carousel
      :data="data"
      :pagination="['dots', 'buttons']"
      :pagination-position="['bottom-center', 'center']"
      :items-to-show="1"
      :loop="true"
      :mousewheel="true">
      <template #default="{ item }">
         <div class="image-container">
            <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
            <div class="image-overlay">
               <span>Slide {{ data.indexOf(item) + 1 }}</span>
            </div>
         </div>
      </template>
   </Carousel>
</template>
      `.trim(),
   },
   {
      title: 'Vertical Carousel',
      config: {
         direction: 'vertical',
         pagination: 'lines',
         paginationPosition: 'center-right',
         itemsToShow: 1,
         loop: true,
         autoPlay: true,
         autoPlayInterval: 4000,
      },
      code: `
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'

const data = [
   'https://example.com/image1.jpg',
   'https://example.com/image2.jpg',
   'https://example.com/image3.jpg',
]
</script>

<template>
   <Carousel
      :data="data"
      direction="vertical"
      pagination="lines"
      paginationPosition="center-right"
      :items-to-show="1"
      :loop="true"
      :auto-play="true"
      :auto-play-interval="4000">
      <template #default="{ item }">
         <div class="image-container">
            <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
            <div class="image-overlay">
               <span>Slide {{ data.indexOf(item) + 1 }}</span>
            </div>
         </div>
      </template>
   </Carousel>
</template>
      `.trim(),
   },
   {
      title: 'Autoplay with Custom Easing',
      config: {
         pagination: 'fraction',
         itemsToShow: 2,
         gap: 20,
         autoPlay: true,
         autoPlayInterval: 3000,
         easing: 'ease-in-out',
         loop: true,
      },
      code: `
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'

const data = [
   'https://example.com/image1.jpg',
   'https://example.com/image2.jpg',
   'https://example.com/image3.jpg',
   'https://example.com/image4.jpg',
]
</script>

<template>
   <Carousel
      :data="data"
      pagination="fraction"
      :items-to-show="2"
      :gap="20"
      :auto-play="true"
      :auto-play-interval="3000"
      :easing="ease-in-out"
      :loop="true">
      <template #default="{ item }">
         <div class="image-container">
            <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
            <div class="image-overlay">
               <span>Slide {{ data.indexOf(item) + 1 }}</span>
            </div>
         </div>
      </template>
   </Carousel>
</template>
      `.trim(),
   },
]
