# Vue Carousel Lite

Vue Carousel – A high-performance lightweight Vue 3 carousel with support for Touch, Mouse, Keyboard, and Wheel input, featuring GPU-accelerated transitions, virtual rendering, responsive design, and Nuxt 3 SSR support.

## Features

- **Responsive Design**: Supports breakpoints for different screen sizes.
- **Multiple Pagination Types**: Includes buttons, dots, lines, and fraction pagination.
- **Accessibility**: Keyboard navigation, ARIA attributes, and focus management.
- **Performance Optimized**: Uses GPU acceleration, memoization, and SSR-friendly rendering.
- **Customizable**: Flexible props for direction, autoplay, gap, pagination visibility, and more.
- **Touch and Mouse Support**: Drag and mousewheel interactions.
- **Nuxt 3 SSR Support**: Server-side rendering for better SEO.
- **Virtual Rendering**: Renders only visible slides + buffer for optimal performance with large datasets
- **State Synchronization**: Robust updates for dynamic content via `updateKey`.

## Demo

[Live Demo](https://vue-carousel-lite.vercel.app/)

## Used By

- [Builto](https://builto.com/template/bloom)
- [Builto Notes](https://notes.builto.com/)
- [Builto Canvas](https://canvas.builto.com/)

## Installation

```bash
# npm
npm install vue-carousel-lite

# yarn
yarn add vue-carousel-lite

# pnpm
pnpm add vue-carousel-lite
```

> Don't forget to follow me on [GitHub](https://github.com/safdar-azeem)!

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

### 4. Hover Visibility Control

Control pagination visibility with smart hover detection and directional awareness.

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
   <!-- Always visible dots, hover-activated buttons -->
   <Carousel
      :data="data"
      :pagination="['dots', 'buttons']"
      :pagination-position="['bottom-center', 'center']"
      :pagination-visibility="['always', 'hover']"
      :items-to-show="1">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>

   <!-- All pagination on hover -->
   <Carousel
      :data="data"
      :pagination="['dots', 'buttons']"
      :pagination-position="['bottom-center', 'center']"
      :pagination-visibility="['hover', 'hover']"
      :items-to-show="1">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>

   <!-- Individual button hover (left/right detection) -->
   <Carousel
      :data="data"
      :pagination="['buttons']"
      :pagination-position="['center']"
      :pagination-visibility="['hover']"
      :items-to-show="1">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>
</template>
```

### 5. Vertical Carousel with Hover Controls

A vertical carousel with hover-activated pagination.

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
      direction="vertical"
      :pagination="['dots', 'buttons']"
      :pagination-position="['center-right', 'center']"
      :pagination-visibility="['always', 'hover']"
      :paginationHoverInitialTimeout="1000"
      :paginationHoverEdgeThreshold="0.2"
      :items-to-show="1"
      style="height: 400px;">
      <template #default="{ item }">
         <img :src="item" alt="Slide" style="width: 100%; height: 100%; object-fit: cover;" />
      </template>
   </Carousel>
</template>
```

### 6. Managing Dynamic Updates (Critical)

**Important:** Because this carousel uses virtual rendering, items inside the slots are memoized for performance. If you have interactive content inside slides (like selection states, input fields, or toggles) that depends on external state, you **must** use the `updateKey` prop.

Changing the `updateKey` tells the carousel that the **content** of the slides has changed, even if the `data` array itself hasn't, forcing a refresh of the visible slides.

```vue
<script setup>
import { ref } from 'vue'

const currentSelection = ref(null)

// When currentSelection changes, passing it to update-key ensures
// the correct 'selected' class is applied immediately to the visible slides.
</script>

<template>
   <Carousel :data="items" :items-to-show="3" :update-key="currentSelection">
      <template #default="{ item }">
         <div
            class="card"
            :class="{ 'is-selected': item.id === currentSelection }"
            @click="currentSelection = item.id">
            {{ item.title }}
         </div>
      </template>
   </Carousel>
</template>
```

## Props

| Prop                 | Type    | Default        | Description                                                    |
| -------------------- | ------- | -------------- | -------------------------------------------------------------- |
| `data`               | Array   | `[]`           | Array of items to display in the carousel.                     |
| `updateKey`          | String  | Number         | `undefined`                                                    |
| `pagination`         | String  | Array          | `'dots'`                                                       |
| `paginationSize`     | String  | `'md'`         | Pagination size: `sm`, `md`, or `lg`.                          |
| `paginationPosition` | String  | Array          | `'bottom-center'`                                              |
| `direction`          | String  | `'horizontal'` | Carousel direction: `horizontal` or `vertical`.                |
| `autoPlay`           | Boolean | `false`        | Enable/disable autoplay.                                       |
| `draggable`          | Boolean | `false`        | Enable/disable dragging.                                       |
| `autoPlayInterval`   | Number  | `3000`         | Autoplay interval in milliseconds.                             |
| `itemsToShow`        | Number  | Object         | `1`                                                            |
| `gap`                | Number  | `0`            | Gap between slides in pixels.                                  |
| `speed`              | Number  | `300`          | Transition speed in milliseconds.                              |
| `easing`             | String  | `'ease'`       | Transition easing function.                                    |
| `mousewheel`         | Boolean | `true`         | Enable/disable mousewheel navigation.                          |
| `loop`               | Boolean | `false`        | Enable/disable looping of slides.                              |
| `currentItem`        | Number  | `0`            | Index of the initial slide.                                    |
| `bufferSize`         | Number  | `5`            | Number of slides to buffer on each side for virtual rendering. |
| `maxDomElements`     | Number  | `10`           | How many slide elements can exist in the DOM                   |

## Slots

| Slot        | Props             | Description                          |
| ----------- | ----------------- | ------------------------------------ |
| `default`   | `{ item, index }` | Custom content for each slide.       |
| `prev-icon` | None              | Custom icon for the previous button. |
| `next-icon` | None              | Custom icon for the next button.     |

## Exposed Methods

| Method       | Parameters                          | Description                              |
| ------------ | ----------------------------------- | ---------------------------------------- |
| `goToSlide`  | `(index: number, smooth?: boolean)` | Navigate to a specific slide.            |
| `goNext`     | `(smooth?: boolean)`                | Navigate to the next slide.              |
| `goPrev`     | `(smooth?: boolean)`                | Navigate to the previous slide.          |
| `goNextPage` | `(smooth?: boolean)`                | Navigate to the next page of slides.     |
| `goPrevPage` | `(smooth?: boolean)`                | Navigate to the previous page of slides. |

# Emits

| Event Name     | Parameters        | Description                             |
| -------------- | ----------------- | --------------------------------------- |
| `slide-change` | `(index: number)` | Emitted when the current slide changes. |

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
