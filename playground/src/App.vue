<script setup lang="ts">
import { ref, computed } from 'vue'
import 'vue-carousel-lite/style.css'
import Carousel from 'vue-carousel-lite'
import { type PaginationPosition, type PaginationType } from 'vue-carousel-lite'
import { examples } from './examples'

const data: string[] = [
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
]

// Reactive carousel properties
const pagination = ref<PaginationType>('dots')
const paginationSize = ref<'sm' | 'md' | 'lg'>('md')
const paginationPosition = ref<PaginationPosition | PaginationPosition[]>('bottom-center')
const direction = ref<'horizontal' | 'vertical'>('horizontal')
const autoPlay = ref<boolean>(false)
const itemsToShow = ref<number>(1)
const gap = ref<number>(0)
const speed = ref<number>(400)
const easing = ref<string>('ease')
const mousewheel = ref<boolean>(true)
const loop = ref<boolean>(false)
const autoPlayInterval = ref<number>(3000)

const paginationOptions: (PaginationType | 'false')[] = ['buttons', 'dots', 'lines', 'fraction', 'false']
const paginationSizeOptions = ['sm', 'md', 'lg']
const paginationPositionOptions: PaginationPosition[] = [
   'bottom',
   'bottom-center',
   'bottom-left',
   'bottom-right',
   'center',
   'center-right',
]
const directionOptions = ['horizontal', 'vertical']
const itemsToShowOptions = [1, 2, 3, 4, 5]
const gapOptions = [0, 5, 10, 15, 20, 25, 30]
const speedOptions = [150, 200, 300, 500, 800, 1000]
const easingOptions = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']
const autoPlayIntervalOptions = [1000, 2000, 3000, 4000, 5000]

const activeTab = ref<'playground' | 'examples'>('playground')

const showCode = ref<{ [key: number]: boolean }>({})

const carouselKey = computed(() => {
   return [
      pagination.value,
      paginationSize.value,
      paginationPosition.value,
      direction.value,
      autoPlay.value,
      itemsToShow.value,
      gap.value,
      speed.value,
      easing.value,
      mousewheel.value,
      loop.value,
      autoPlayInterval.value,
   ].join('-')
})

const toggleAllCode = () => {
   const allShowing = Object.values(showCode.value).every(Boolean)
   examples.forEach((_, index) => {
      showCode.value[index] = !allShowing
   })
}
</script>

<template>
   <div class="container">
      <!-- Header -->
      <div class="header">
         <h1>Vue Carousel Lite</h1>
         <p class="subtitle">
            High-performance lightweight Vue 3 carousel with touch, mouse, keyboard support
         </p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
         <button :class="{ active: activeTab === 'playground' }" @click="activeTab = 'playground'">
            🎮 Playground
         </button>
         <button :class="{ active: activeTab === 'examples' }" @click="activeTab = 'examples'">
            📚 Examples
         </button>
      </div>

      <!-- Playground Tab -->
      <div v-if="activeTab === 'playground'" class="playground-tab">
         <div class="controls">
            <div class="controls-header">
               <h2>Configuration</h2>
            </div>

            <div class="controls-grid">
               <!-- Basic Settings -->
               <div class="control-section">
                  <h3>📐 Layout</h3>
                  <div class="control-group">
                     <label for="direction">Direction:</label>
                     <select id="direction" v-model="direction">
                        <option v-for="dir in directionOptions" :key="dir" :value="dir">
                           {{ dir }}
                        </option>
                     </select>
                  </div>
                  <div class="control-group">
                     <label for="itemsToShow">Items to Show:</label>
                     <select id="itemsToShow" v-model="itemsToShow">
                        <option v-for="num in itemsToShowOptions" :key="num" :value="num">
                           {{ num }}
                        </option>
                     </select>
                  </div>
                  <div class="control-group">
                     <label for="gap">Gap (px):</label>
                     <select id="gap" v-model="gap">
                        <option v-for="g in gapOptions" :key="g" :value="g">
                           {{ g }}
                        </option>
                     </select>
                  </div>
               </div>

               <!-- Pagination Settings -->
               <div class="control-section">
                  <h3>🔘 Pagination</h3>
                  <div class="control-group">
                     <label for="paginationType">Type:</label>
                     <select id="paginationType" v-model="pagination">
                        <option v-for="option in paginationOptions" :key="option as any" :value="option">
                           {{ option === 'false' ? 'None' : option }}
                        </option>
                     </select>
                  </div>
                  <div class="control-group" v-if="pagination !== false">
                     <label for="paginationSize">Size:</label>
                     <select id="paginationSize" v-model="paginationSize">
                        <option v-for="size in paginationSizeOptions" :key="size" :value="size">
                           {{ size.toUpperCase() }}
                        </option>
                     </select>
                  </div>
                  <div class="control-group" v-if="pagination !== false">
                     <label for="paginationPosition">Position:</label>
                     <select id="paginationPosition" v-model="paginationPosition">
                        <option v-for="pos in paginationPositionOptions" :key="pos" :value="pos">
                           {{ pos }}
                        </option>
                     </select>
                  </div>
               </div>

               <!-- Animation Settings -->
               <div class="control-section">
                  <h3>⚡ Animation</h3>
                  <div class="control-group">
                     <label for="speed">Speed (ms):</label>
                     <select id="speed" v-model="speed">
                        <option v-for="s in speedOptions" :key="s" :value="s">
                           {{ s }}
                        </option>
                     </select>
                  </div>
                  <div class="control-group">
                     <label for="easing">Easing:</label>
                     <select id="easing" v-model="easing">
                        <option v-for="e in easingOptions" :key="e" :value="e">
                           {{ e }}
                        </option>
                     </select>
                  </div>
               </div>

               <!-- Behavior Settings -->
               <div class="control-section">
                  <h3>⚙️ Behavior</h3>
                  <div class="control-group">
                     <label class="checkbox-label">
                        <input type="checkbox" v-model="autoPlay" />
                        <span class="checkmark"></span>
                        AutoPlay
                     </label>
                  </div>
                  <div class="control-group" v-if="autoPlay">
                     <label for="autoPlayInterval">Interval (ms):</label>
                     <select id="autoPlayInterval" v-model="autoPlayInterval">
                        <option
                           v-for="interval in autoPlayIntervalOptions"
                           :key="interval"
                           :value="interval">
                           {{ interval }}
                        </option>
                     </select>
                  </div>
                  <div class="control-group">
                     <label class="checkbox-label">
                        <input type="checkbox" v-model="mousewheel" />
                        <span class="checkmark"></span>
                        Mousewheel Navigation
                     </label>
                  </div>
                  <div class="control-group">
                     <label class="checkbox-label">
                        <input type="checkbox" v-model="loop" />
                        <span class="checkmark"></span>
                        Loop
                     </label>
                  </div>
               </div>
            </div>
         </div>

         <div class="carousel-preview">
            <div class="preview-header">
               <h2>Live Preview</h2>
               <div class="preview-stats">
                  <span class="stat">Direction: {{ direction }}</span>
                  <span class="stat">Items: {{ itemsToShow }}</span>
                  <span class="stat">Gap: {{ gap }}px</span>
               </div>
            </div>
            <div class="carousel-containr">
               <Carousel
                  :key="carouselKey"
                  :data="data"
                  :pagination="pagination"
                  :pagination-size="paginationSize"
                  :pagination-position="paginationPosition"
                  :direction="direction"
                  :auto-play="autoPlay"
                  :auto-play-interval="autoPlayInterval"
                  :items-to-show="itemsToShow"
                  :gap="gap"
                  :speed="speed"
                  :easing="easing"
                  :mousewheel="mousewheel"
                  :loop="loop">
                  <template #default="{ item }">
                     <div class="carousel-slide">
                        <img :src="item" class="carousel-image" />
                        <div class="slide-overlay">
                           <h4>Beautiful Landscape</h4>
                           <p>High quality nature photography</p>
                        </div>
                     </div>
                  </template>
               </Carousel>
            </div>
         </div>
      </div>

      <!-- Examples Tab -->
      <div v-if="activeTab === 'examples'" class="examples-tab">
         <div class="examples-header">
            <h2>Usage Examples</h2>
            <button class="toggle-all-btn" @click="toggleAllCode">
               {{ Object.values(showCode).every(Boolean) ? '🙈 Hide All Code' : '👁️ Show All Code' }}
            </button>
         </div>
         <div class="examples-container">
            <div v-for="(example, index) in examples" :key="index" class="example-item">
               <div class="example-header">
                  <div class="example-title">
                     <h3>{{ example.title }}</h3>
                     <div class="example-badges">
                        <span v-if="example.config.autoPlay" class="badge">AutoPlay</span>
                        <span v-if="example.config.loop" class="badge">Loop</span>
                        <span v-if="example.config.direction === 'vertical'" class="badge"
                           >Vertical</span
                        >
                        <span v-if="typeof example.config.itemsToShow === 'object'" class="badge"
                           >Responsive</span
                        >
                     </div>
                  </div>
                  <button class="code-toggle" @click="showCode[index] = !showCode[index]">
                     {{ showCode[index] ? '👁️ Hide Code' : '💻 Show Code' }}
                  </button>
               </div>
               <div v-if="showCode[index]" class="code-block">
                  <pre><code>{{ example.code }}</code></pre>
               </div>
               <div v-else class="example-preview">
                  <Carousel :data="data" v-bind="example.config">
                     <template #default="{ item }">
                        <div class="carousel-slide">
                           <img :src="item" class="carousel-image" />
                           <div class="slide-overlay">
                              <h4>{{ example.title }}</h4>
                              <p>Example demonstration</p>
                           </div>
                        </div>
                     </template>
                  </Carousel>
               </div>
            </div>
         </div>
      </div>

      <!-- Github Link -->
      <a href="https://github.com/safdar-azeem/vue-carousel-lite" target="_blank">
         <img
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            alt="Stars"
            class="github-link" />
      </a>
   </div>
</template>
