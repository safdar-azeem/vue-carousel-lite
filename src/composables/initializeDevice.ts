import { onMounted } from 'vue'
import { useWindowWidth } from './useWindowWidth'

export const initializeDevice = (nuxtApp: any) => {
   const agent = nuxtApp?.ssrContext?.event?.context?.userAgent
   const windowWidth = useWindowWidth

   const getDeviceType = (agent: any) => {
      if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(agent)) {
         if (/ipad|android(?!.*mobile)|tablet/i.test(agent)) {
            return 'tablet'
         }
         return 'mobile'
      }
      return 'desktop'
   }

   const deviceType = getDeviceType(agent)

   windowWidth.value = deviceType === 'mobile' ? 300 : 1024

   onMounted(() => {
      windowWidth.value = window.innerWidth
   })
}
