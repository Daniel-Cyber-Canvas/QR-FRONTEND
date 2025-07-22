<template>
    <div>
       <side-navigation>
         <div class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
           <div class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">
             <!-- Main Content -->
             <div class="flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
               <div class="bg-[#ffffff] rounded-[3px] p-3 flex flex-col gap-6 items-start justify-start flex-1 relative"
                 style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                 <!-- Profile Section -->
                 <div class="flex flex-col items-center justify-center w-full gap-4 mb-6">
                   <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-[#0C8096]">
                     <img
                       src="@/assets/images/Mukwa-Logo.png"
                       alt="Profile"
                       class="w-full h-full object-cover"
                     />
                   </div>
                   <h2 class="text-xl font-semibold text-[#424242]">Mukwa Travel</h2>
                 </div>
                 <!-- QR Code Options -->
                 <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative w-full max-w-2xl mx-auto">
                   <div class="flex flex-col gap-4 w-full">
                     <div v-for="option in qrOptions" :key="option.name"
                       class="bg-[#eef2f5] text-[#424242] cursor-pointer p-4 flex items-center justify-between relative overflow-hidden hover:bg-[#0C8096] hover:text-white transition-all duration-300 ease-in-out rounded-lg group">
                       <div class="flex flex-row gap-[23px] items-center" @click="handleClick(option)">
                         <Icon :icon="option.icon" class="shrink-0 w-7 h-7 relative object-cover" />
                         <div class="text-left font-['Inter-Medium',_sans-serif] text-lg font-medium relative">
                           {{ option.name }}
                         </div>
                       </div>
                       <button 
                         @click.stop="shareOption(option)"
                         class="p-2 rounded-full hover:bg-[#0C8096] hover:text-white transition-all duration-300 ease-in-out"
                         :title="`Share ${option.name}`"
                       >
                         <Icon 
                           icon="ph:share-network" 
                           class="w-5 h-5"
                         />
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </side-navigation>
     </div>
   </template>
   
   <script setup>
   import { ref } from 'vue'
   import { useRouter } from 'vue-router'
   import { useShare } from '@vueuse/core'
   import SideNavigation from '@/components/SideNavigation.vue'
   import { Icon } from '@iconify/vue'
   
   const router = useRouter()
   const { share, isSupported } = useShare()
   
   const qrOptions = ref([
     { 
       name: "Website", 
       icon: "ph:globe",
       url: "https://mukwatravel.com",
       shareText: "Check out Mukwa Travel's website!"
     },
     { 
       name: "PDF", 
       icon: "ph:file-pdf",
       shareText: "View Mukwa Travel's PDF brochure"
     },
     { 
       name: "Powerpoint", 
       icon: "ph:microsoft-powerpoint-logo",
       shareText: "View Mukwa Travel's presentation"
     },
     { 
       name: "Whatsapp", 
       icon: "ph:whatsapp-logo",
       url: "https://api.whatsapp.com/send/?phone=260954128231&text&type=phone_number&app_absent=0",
       shareText: "Contact Mukwa Travel on WhatsApp"
     },
     { 
       name: "Facebook", 
       icon: "ph:facebook-logo",
       url: "https://www.facebook.com/MukwaTravelToursLtd/?ref=br_rs",
       shareText: "Follow Mukwa Travel on Facebook"
     },
     { 
       name: "Instagram", 
       icon: "ph:instagram-logo",
       url: "https://www.instagram.com/mukwa_travel/",
       shareText: "Follow Mukwa Travel on Instagram"
     }
   ])
   
   const handleClick = (option) => {
     if (option.url) {
       window.open(option.url, '_blank')
     } else {
       alert('URL not found')
     }
   }
   
   const fallbackShare = (option) => {
     // Create a temporary input element to copy the URL
     const tempInput = document.createElement('input')
     tempInput.value = option.url || 'https://mukwatravel.com'
     document.body.appendChild(tempInput)
     tempInput.select()
     document.execCommand('copy')
     document.body.removeChild(tempInput)
     
     // Alert the user that the URL has been copied
     alert(`URL copied to clipboard! You can now share ${option.name}`)
   }
   
   const shareOption = async (option) => {
     const shareData = {
       title: 'Mukwa Travel',
       text: option.shareText,
       url: option.url || 'https://mukwatravel.com'
     }
   
     if (isSupported.value) {
       try {
         await share(shareData)
         console.log('Shared successfully')
       } catch (err) {
         console.error('Share failed:', err)
         fallbackShare(option)
       }
     } else {
       fallbackShare(option)
     }
   }
   </script>
   
   <style scoped>
   /* Add any additional custom styles here if needed */
   </style>