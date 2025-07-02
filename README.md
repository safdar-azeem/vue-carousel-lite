# Vue Carousel Lite

Vue Carousel – A high-performance lightweight Vue 3 carousel with support for Touch, Mouse, Keyboard, and Wheel input, featuring GPU-accelerated transitions, responsive design, and Nuxt 3 SSR support.

## Features

-  **Responsive Design**: Supports breakpoints for different screen sizes.
-  **Multiple Pagination Types**: Includes buttons, dots, lines, and fraction pagination.
-  **Accessibility**: Keyboard navigation, ARIA attributes, and focus management.
-  **Performance Optimized**: Uses GPU acceleration, memoization, and SSR-friendly rendering.
-  **Customizable**: Flexible props for direction, autoplay, gap, and more.
-  **Touch and Mouse Support**: Drag and mousewheel interactions.
-  **Nuxt 3 SSR Support**: Server-side rendering for better SEO.

## Demo

[Live Demo](https://vue-carousel-lite.vercel.app/)

## Installation

```bash
# npm
npm install vue-carousel-lite

# yarn
yarn add vue-carousel-lite

# pnpm
pnpm add vue-carousel-lite
```

## Usage

Below are examples demonstrating different configurations of the Vue Carousel component.

### 1. Basic Carousel

A simple horizontal carousel with dots pagination.

```vue
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
   <Carousel :data="data" pagination="dots" :items-to-show="1">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>
</template>
```

### 2. Responsive Breakpoints

A carousel with responsive breakpoints for different screen sizes.

```vue
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'

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
      :gap="10">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>
</template>
```

### 3. Multi Pagination Types

A carousel with multiple pagination types (dots and buttons).

```vue
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'

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
      :gap="10">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>
</template>
```

# 4. Nuxt 3 SSR Setup

To enable server-side rendering (SSR) with Nuxt 3, follow these steps to ensure proper device detection and responsive behavior:

1. **Add the device initialization plugin**:

   Create or update the `plugins/index.ts` file to include the `initializeDevice` composable:

   ```ts
   // File Path: plugins/index.ts
   import { initializeDevice } from 'vue-carousel-lite'

   export default defineNuxtPlugin((nuxtApp) => {
      initializeDevice(nuxtApp)
   })
   ```

2. **Then Add user-agent middleware**:

   Create or update the `server/middleware/index.ts` file to attach the user-agent to the event context:

   ```ts
   // File Path: server/middleware/index.ts
   export default defineEventHandler((event) => {
      event.context.userAgent = event?.node?.req?.headers?.['user-agent']
   })
   ```

## Props

| Prop                 | Type             | Default           | Description                                                                 |
| -------------------- | ---------------- | ----------------- | --------------------------------------------------------------------------- |
| `data`               | Array            | `[]`              | Array of items to display in the carousel.                                  |
| `pagination`         | String \| Array  | `'dots'`          | Pagination type(s): `buttons`, `dots`, `lines`, `fraction`, or `false`.     |
| `paginationSize`     | String           | `'md'`            | Pagination size: `sm`, `md`, or `lg`.                                       |
| `paginationPosition` | String \| Array  | `'bottom-center'` | Pagination position(s): `center`, `bottom-center`, `bottom-left`, etc.      |
| `direction`          | String           | `'horizontal'`    | Carousel direction: `horizontal` or `vertical`.                             |
| `autoPlay`           | Boolean          | `false`           | Enable/disable autoplay.                                                    |
| `autoPlayInterval`   | Number           | `3000`            | Autoplay interval in milliseconds.                                          |
| `itemsToShow`        | Number \| Object | `1`               | Number of items to show or an object with breakpoints (e.g., `{ 640: 1 }`). |
| `gap`                | Number           | `0`               | Gap between slides in pixels.                                               |
| `speed`              | Number           | `300`             | Transition speed in milliseconds.                                           |
| `easing`             | String           | `'ease'`          | Transition easing function.                                                 |
| `mousewheel`         | Boolean          | `true`            | Enable/disable mousewheel navigation.                                       |
| `loop`               | Boolean          | `false`           | Enable/disable looping of slides.                                           |
| `currentItem`        | Number           | `0`               | Index of the initial slide.                                                 |

## Slots

| Slot      | Props             | Description                    |
| --------- | ----------------- | ------------------------------ |
| `default` | `{ item, index }` | Custom content for each slide. |

## Exposed Methods

| Method       | Parameters                          | Description                                 |
| ------------ | ----------------------------------- | ------------------------------------------- |
| `goToSlide`  | `(index: number, smooth?: boolean)` | Navigate to a specific slide.               |
| `goNext`     | `(smooth?: boolean)`                | Navigate to the next slide.                 |
| `goPrev`     | `(smooth?: boolean)`                | Navigate to the previous slide.             |
| `goNextPage` | `(smooth?: boolean)`                | Navigate to the next page of slides.        |
| `goPrevPage` | `(smooth?: boolean)`                | Navigate to the previous page of slides.    |
| `focus`      | `()`                                | Focus the carousel for keyboard navigation. |

## Styling

The carousel can be customized using CSS variables defined in `carousel.css` and `pagination.css`. Example:

```css
.carousel {
   --carousel-slide-width: 100%;
   --carousel-gap: 10px;
   --container-height: 300px;
}

.carousel-pagination {
   --carousel-pagination-primary-color: #007bff;
   --carousel-pagination-button-size: 3rem;
}
```

## Author

[safdar-azeem](https://github.com/safdar-azeem)

## License

MIT
