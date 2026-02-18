import type { CarouselProps } from './types'

// Example configurations
interface Example {
   title: string
   config: Partial<CarouselProps>
   code: string
   customData?: any[]
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
   {
      title: 'Scrollable Content (Notes)',
      config: {
         pagination: 'fraction',
         itemsToShow: { 640: 1, 1024: 2 },
         gap: 20,
         mousewheel: true,
         draggable: true,
      },
      customData: [
         {
            title: 'Project Architecture',
            content: '1. Frontend: Vue 3\n2. State: Pinia\n3. Styling: CSS Modules\n4. Build: Vite\n\nArchitecture Rules:\n- Keep components small\n- Use composables for logic\n- Strict TypeScript\n\nTesting Strategy:\n- Unit tests with Vitest\n- E2E with Cypress\n- Component testing with VTU\n\nDeployment:\n- CI/CD via GitHub Actions\n- Hosting on Vercel\n- Edge functions for API\n\nPerformance:\n- Lazy loading routes\n- Image optimization\n- Tree shaking\n- Chunk splitting\n\nSecurity:\n- Content Security Policy\n- XSS Prevention\n- CSRF Tokens\n- Strict-Transport-Security'
         },
         {
            title: 'Meeting Minutes',
            content: 'Date: Oct 24th\nAttendees: Core Team\n\nAgenda:\n1. Q4 Roadmap Review\n2. Resource Allocation\n3. Technical Debt\n\nAction Items:\n- Alice to draft API spec by Friday\n- Bob to review PR #442\n- Charlie to setup staging env\n\nNotes:\n- We need to prioritize the new dashboard.\n- Customer feedback indicates performance issues on mobile.\n- Let us schedule a follow-up on Thursday.\n\nDecisions Made:\n- Migrate to Vue 3.4 next sprint\n- Deprecate legacy auth endpoints\n- Increase test coverage requirement to 85%\n\nNext Meeting: Nov 2nd'
         },
         {
            title: 'Release Notes v2.0',
            content: 'Exciting new features in v2.0!\n\n- Completely rewritten rendering engine\n- 50% performance improvement\n- New plugin system\n- Dark mode support\n\nBug Fixes:\n- Fixed memory leak in list view\n- Resolved race condition in auth flow\n- UI glitches on Safari fixed\n\nBreaking Changes:\n- Deprecated API v1 endpoints removed\n- Node 18 now required\n\nUpgrade Guide:\n1. Update package.json dependencies\n2. Run migration script\n3. Update deprecated method calls\n4. Rebuild and test'
         },
         {
            title: 'Daily Journal',
            content: 'Morning:\n- Reviewed PRs\n- Standup meeting\n- Answered community issues\n\nAfternoon:\n- Deep work on the new Carousel feature\n- Fixed touch/drag interaction bugs\n- Added vertical scroll resistance\n\nEvening:\n- Documentation updates\n- Planning for tomorrow\n- Read an article on Vue performance\n\nObservations:\n- The new wheel event logic handles trackpads much better now.\n- Need to write more tests for edge cases.\n- Consider adding a plugin architecture for future extensions.\n\nFeeling productive today!'
         }
      ],
      code: `
<script setup>
import { ref } from 'vue'
import Carousel from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'

const notes = [
   {
      title: 'Project Architecture',
      content: '1. Frontend: Vue 3\\n2. State: Pinia\\n3. Styling: CSS Modules\\n4. Build: Vite\\n\\nArchitecture Rules:\\n- Keep components small\\n- Use composables for logic\\n- Strict TypeScript\\n\\nTesting Strategy:\\n- Unit tests with Vitest\\n- E2E with Cypress\\n- Component testing with VTU\\n\\nDeployment:\\n- CI/CD via GitHub Actions\\n- Hosting on Vercel\\n- Edge functions for API\\n\\nPerformance:\\n- Lazy loading routes\\n- Image optimization\\n- Tree shaking\\n- Chunk splitting\\n\\nSecurity:\\n- Content Security Policy\\n- XSS Prevention\\n- CSRF Tokens\\n- Strict-Transport-Security'
   },
   {
      title: 'Meeting Minutes',
      content: 'Date: Oct 24th\\nAttendees: Core Team\\n\\nAgenda:\\n1. Q4 Roadmap Review\\n2. Resource Allocation\\n3. Technical Debt\\n\\nAction Items:\\n- Alice to draft API spec by Friday\\n- Bob to review PR #442\\n- Charlie to setup staging env\\n\\nNotes:\\n- We need to prioritize the new dashboard.\\n- Customer feedback indicates performance issues on mobile.\\n- Let us schedule a follow-up on Thursday.\\n\\nDecisions Made:\\n- Migrate to Vue 3.4 next sprint\\n- Deprecate legacy auth endpoints\\n- Increase test coverage requirement to 85%\\n\\nNext Meeting: Nov 2nd'
   },
   {
      title: 'Release Notes v2.0',
      content: 'Exciting new features in v2.0!\\n\\n- Completely rewritten rendering engine\\n- 50% performance improvement\\n- New plugin system\\n- Dark mode support\\n\\nBug Fixes:\\n- Fixed memory leak in list view\\n- Resolved race condition in auth flow\\n- UI glitches on Safari fixed\\n\\nBreaking Changes:\\n- Deprecated API v1 endpoints removed\\n- Node 18 now required\\n\\nUpgrade Guide:\\n1. Update package.json dependencies\\n2. Run migration script\\n3. Update deprecated method calls\\n4. Rebuild and test'
   }
]

const itemsToShow = {
   640: 1,
   1024: 2
}
</script>

<template>
   <Carousel
      :data="notes"
      pagination="fraction"
      :items-to-show="itemsToShow"
      :gap="20"
      :mousewheel="true"
      :draggable="true">
      <template #default="{ item }">
         <div class="note-card" style="height: 350px; overflow-y: auto; padding: 1.5rem; background: white; border-radius: 1rem; color: #2d3748; width: 100%; text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; overscroll-behavior: contain;">
            <h3 style="margin: 0 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; font-size: 1.25rem; color: #1a202c; position: sticky; top: 0; background: white; z-index: 10;">{{ item.title }}</h3>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 0.95rem; color: #4a5568;">{{ item.content }}</p>
         </div>
      </template>
   </Carousel>
</template>
      `.trim(),
   }
]
