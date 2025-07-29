<script setup lang="ts">
import { ref, computed } from 'vue'
import Carousel from './components/Carousel.vue'
import { type PaginationPosition, type PaginationType } from './types'
import { examples } from './examples'

const data: string[] = [
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop',
   'https://plus.unsplash.com/premium_photo-1672115681150-cce7a518bba1?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1568206222579-3d32da70596b?w=800&h=450&fit=crop',
   'https://images.unsplash.com/photo-1477840539360-4a1d23071046?w=800&h=450&fit=crop',
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
                  :pagination="['dots', 'buttons']"
                  :pagination-visibility="['always', 'hover']"
                  :pagination-position="['bottom-center', 'center']"
                  :pagination-size="paginationSize"
                  :direction="direction"
                  :auto-play="autoPlay"
                  :auto-play-interval="autoPlayInterval"
                  :items-to-show="itemsToShow"
                  :gap="gap"
                  :speed="speed"
                  :easing="easing"
                  :mousewheel="mousewheel"
                  :loop="loop">
                  <template #default="{ item, index }">
                     <div class="carousel-slide">
                        {{ index }}
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
      <a href="https://github.com/safdar-azeem/vue-carousel-lite" target="_blank">
         <img
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            alt="Stars"
            class="github-link" />
      </a>
   </div>
</template>

<style>
* {
   box-sizing: border-box;
}

html {
   background: #677be5;
}

body {
   margin: 0;
   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   min-height: 100vh;
}

.container {
   display: flex;
   flex-direction: column;
   gap: 2rem;
   padding: 2rem;
   max-width: 1400px;
   margin: 0 auto;
   min-height: 100vh;
}

/* Header */
.header {
   text-align: center;
   color: white;
   margin-bottom: 1rem;
}

.header h1 {
   font-size: 3rem;
   font-weight: 700;
   margin: 0;
   text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
   background: linear-gradient(45deg, #fff, #f0f0f0);
   background-clip: text;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
}

.subtitle {
   font-size: 1.2rem;
   margin: 0.5rem 0 0 0;
   opacity: 0.9;
   text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

/* Tabs */
.tabs {
   display: flex;
   gap: 0.5rem;
   background: rgba(255, 255, 255, 0.1);
   backdrop-filter: blur(10px);
   border-radius: 1rem;
   padding: 0.5rem;
   margin: 0 auto;
   max-width: 500px;
   width: 100%;
   border: 1px solid rgba(255, 255, 255, 0.2);
}

.tabs button {
   flex: 1;
   padding: 1rem 2rem;
   font-size: 1.1rem;
   font-weight: 600;
   background: transparent;
   border: none;
   cursor: pointer;
   color: rgba(255, 255, 255, 0.7);
   transition: all 0.3s ease;
   border-radius: 0.75rem;
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 0.5rem;
}

.tabs button.active {
   background: rgba(255, 255, 255, 0.2);
   color: white;
   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
   backdrop-filter: blur(20px);
}

.tabs button:hover:not(.active) {
   background: rgba(255, 255, 255, 0.1);
   color: rgba(255, 255, 255, 0.9);
}

/* Playground Tab */
.playground-tab {
   display: flex;
   gap: 2rem;
   flex: 1;
}

/* Controls Section */
.controls {
   background: rgba(255, 255, 255, 0.95);
   backdrop-filter: blur(20px);
   padding: 1.5rem;
   border-radius: 1.5rem;
   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
   width: 400px;
   max-height: 600px;
   overflow: auto;
   height: fit-content;
}

.controls-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 1rem;
}

.controls-header h2 {
   font-size: 1.7rem;
   margin: 0;
   color: #2d3748;
   font-weight: 700;
}

.reset-btn:hover {
   transform: translateY(-2px);
   box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
}

.controls-grid {
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.control-section {
   background: rgba(255, 255, 255, 0.5);
   padding: 1rem;
   border-radius: 1rem;
   border: 1px solid rgba(255, 255, 255, 0.3);
}

.control-section h3 {
   font-size: 1.2rem;
   margin: 0 0 1rem 0;
   color: #2d3748;
   font-weight: 600;
   display: flex;
   align-items: center;
   gap: 0.5rem;
}

.control-group {
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
   margin-bottom: 0.5rem;
}

.control-group:last-child {
   margin-bottom: 0;
}

.control-group label {
   font-weight: 600;
   color: #4a5568;
   font-size: 0.9rem;
}

.control-group select {
   padding: 0.5rem;
   border: 2px solid #e2e8f0;
   border-radius: 0.5rem;
   background: white;
   font-size: 0.9rem;
   transition: all 0.3s ease;
   color: #2d3748;
}

.control-group select:focus {
   outline: none;
   border-color: #667eea;
   box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-label {
   display: flex;
   align-items: center;
   gap: 0.7rem;
   cursor: pointer;
   user-select: none;
   position: relative;
}

.checkbox-label input[type='checkbox'] {
   position: absolute;
   opacity: 0;
   cursor: pointer;
}

.checkmark {
   width: 20px;
   height: 20px;
   background: white;
   border: 2px solid #e2e8f0;
   border-radius: 4px;
   position: relative;
   transition: all 0.3s ease;
}

.checkbox-label input[type='checkbox']:checked + .checkmark {
   background: linear-gradient(135deg, #667eea, #764ba2);
   border-color: #667eea;
}

.checkbox-label input[type='checkbox']:checked + .checkmark::after {
   content: '✓';
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   color: white;
   font-size: 12px;
   font-weight: bold;
}

/* Preview Section */
.carousel-preview {
   flex: 1;
   background: rgba(255, 255, 255, 0.95);
   backdrop-filter: blur(20px);
   padding: 2rem;
   border-radius: 1.5rem;
   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2rem;
}

.preview-header h2 {
   font-size: 1.8rem;
   margin: 0;
   color: #2d3748;
   font-weight: 700;
}

.preview-stats {
   display: flex;
   gap: 1rem;
}

.stat {
   background: rgba(102, 126, 234, 0.1);
   color: #667eea;
   padding: 0.4rem 0.8rem;
   border-radius: 0.5rem;
   font-size: 0.8rem;
   font-weight: 600;
   border: 1px solid rgba(102, 126, 234, 0.2);
}

.slide-overlay {
   position: absolute;
   bottom: 0;
   left: 0;
   right: 0;
   background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
   color: white;
   padding: 1.5rem;
   transform: translateY(100%);
   transition: transform 0.3s ease;
}

.carousel-slide {
   max-height: 550px !important;
   height: 550px !important;
   background-color: rgb(218, 218, 218);
}

.carousel-slide:hover .slide-overlay {
   transform: translateY(0);
}

.slide-overlay h4 {
   margin: 0 0 0.5rem 0;
   font-size: 1.1rem;
   font-weight: 600;
}

.slide-overlay p {
   margin: 0;
   font-size: 0.9rem;
   opacity: 0.9;
}

/* Examples Tab */
.examples-tab {
   flex: 1;
}

.examples-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2rem;
   background: rgba(255, 255, 255, 0.95);
   backdrop-filter: blur(20px);
   padding: 2rem;
   border-radius: 1.5rem;
   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
}

.examples-header h2 {
   font-size: 1.8rem;
   margin: 0;
   color: #2d3748;
   font-weight: 700;
}

.toggle-all-btn {
   background: linear-gradient(135deg, #667eea, #764ba2);
   color: white;
   border: none;
   padding: 0.7rem 1.2rem;
   border-radius: 0.5rem;
   font-weight: 600;
   cursor: pointer;
   transition: all 0.3s ease;
   font-size: 0.9rem;
}

.toggle-all-btn:hover {
   transform: translateY(-2px);
   box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.examples-container {
   display: flex;
   flex-direction: column;
   gap: 2rem;
}

.example-item {
   background: rgba(255, 255, 255, 0.95);
   backdrop-filter: blur(20px);
   border-radius: 1.5rem;
   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
   overflow: hidden;
}

.example-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 2rem;
   border-bottom: 1px solid #e2e8f0;
}

.example-title {
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
}

.example-title h3 {
   font-size: 1.3rem;
   margin: 0;
   color: #2d3748;
   font-weight: 600;
}

.example-badges {
   display: flex;
   gap: 0.5rem;
   flex-wrap: wrap;
}

.badge {
   background: linear-gradient(135deg, #667eea, #764ba2);
   color: white;
   padding: 0.3rem 0.7rem;
   border-radius: 1rem;
   font-size: 0.7rem;
   font-weight: 600;
   letter-spacing: 0.5px;
}

.code-toggle {
   background: linear-gradient(135deg, #10b981, #059669);
   color: white;
   border: none;
   padding: 0.7rem 1.2rem;
   border-radius: 0.5rem;
   font-weight: 600;
   cursor: pointer;
   transition: all 0.3s ease;
   font-size: 0.9rem;
}

.code-toggle:hover {
   transform: translateY(-2px);
   box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.code-block {
   background: #1a202c;
   margin: 0;
}

.code-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 1rem 2rem;
   background: #2d3748;
   color: white;
   font-size: 0.9rem;
   font-weight: 600;
}

.copy-btn {
   background: rgba(255, 255, 255, 0.1);
   color: white;
   border: 1px solid rgba(255, 255, 255, 0.2);
   padding: 0.4rem 0.8rem;
   border-radius: 0.3rem;
   font-size: 0.8rem;
   cursor: pointer;
   transition: all 0.3s ease;
}

.copy-btn:hover {
   background: rgba(255, 255, 255, 0.2);
}

.code-block pre {
   margin: 0;
   padding: 2rem;
   overflow-x: auto;
   background: #1a202c;
   color: #e2e8f0;
   font-size: 0.9rem;
   line-height: 1.6;
   font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
}

.code-block code {
   color: inherit;
   background: none;
   padding: 0;
   border-radius: 0;
   font-size: inherit;
}

.example-preview {
   background: #f7fafc;
   position: relative;
   padding: 20px;
}

.carousel-image {
   width: 100%;
   object-fit: cover;
}

/* Responsive Design */
@media (max-width: 1200px) {
   .playground-tab {
      flex-direction: column;
   }

   .controls {
      min-width: auto;
   }
}

@media (max-width: 768px) {
   .container {
      padding: 1rem;
      gap: 1rem;
   }

   .header h1 {
      font-size: 2rem;
   }

   .subtitle {
      font-size: 1rem;
   }

   .tabs button {
      padding: 0.8rem 1rem;
      font-size: 1rem;
   }

   .controls,
   .carousel-preview,
   .examples-header {
      padding: 1.5rem;
   }

   .controls-header,
   .preview-header,
   .example-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
   }

   .preview-stats {
      flex-wrap: wrap;
      gap: 0.5rem;
   }

   .carousel-container {
      height: 300px;
      padding: 1rem;
   }

   .example-title {
      gap: 0.75rem;
   }

   .example-badges {
      gap: 0.3rem;
   }
}

@media (max-width: 480px) {
   .container {
      padding: 0.5rem;
   }

   .header h1 {
      font-size: 1.5rem;
   }

   .tabs {
      flex-direction: column;
      gap: 0.25rem;
   }

   .tabs button {
      padding: 0.7rem;
   }

   .carousel-container {
      height: 250px;
   }

   .controls-grid {
      gap: 1rem;
   }

   .control-section {
      padding: 1rem;
   }
}

.github-link {
   position: fixed;
   bottom: 1rem;
   right: 1rem;
   width: 40px;
   height: 40px;
   border-radius: 50%;
   background: rgba(255, 255, 255, 0.1);
   backdrop-filter: blur(10px);
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: all 0.3s ease;
}
</style>
