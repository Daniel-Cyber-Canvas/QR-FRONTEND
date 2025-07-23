<template>
  <div 
    class="bg-white rounded-lg shadow-lg pt-8 pr-8 pb-8 pl-8 flex flex-col gap-6 items-center justify-start relative min-w-[400px]" 
  > 
    <!-- Close Button -->
    <div 
      class="rounded   p-2 flex flex-row gap-2.5 items-center justify-center shrink-0 w-8 h-8 absolute right-4 top-4 cursor-pointer hover:bg-gray-100 transition-colors" 
      @click="closePopup"
    >
      <Icon icon="mdi:close" class="w-4 h-4 text-gray-500" />
    </div>
    
    <!-- Title -->
    <div 
      class="text-gray-700 text-center font-['Roboto-Regular',_sans-serif] text-lg font-medium mb-4" 
    > 
      Scan QR Code 
    </div>
    
    <!-- QR Code Display Area -->
    <div 
      class="bg-white border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center w-64 h-64 mb-6"
    >
      <!-- Dynamic QR Code using qrcode.vue library -->
      <qrcode-vue 
        :value="websiteUrl" 
        :size="200" 
        level="M" 
        render-as="svg"
        background="white"
        foreground="black"
      />
    </div>
    
    <!-- Action Buttons -->
    <div 
      class="flex flex-row gap-3 items-center justify-center w-full" 
    > 
      <div 
        class="bg-[#0c768a] rounded-md pt-3 pr-6 pb-3 pl-6 flex flex-row gap-2 items-center justify-center cursor-pointer hover:bg-[#0a5f6f] transition-colors" 
        @click="saveQRCode"
      > 
        <Icon icon="mdi:download" class="w-4 h-4 text-white" />
        <div 
          class="text-white text-center font-['Roboto-Regular',_sans-serif] text-sm font-medium" 
        > 
          Save JPG 
        </div> 
      </div>
      
      <div 
        class="bg-gray-100 rounded-md pt-3 pr-6 pb-3 pl-6 flex flex-row gap-2 items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" 
        @click="copyToClipboard"
      > 
        <Icon icon="mdi:content-copy" class="w-4 h-4 text-gray-600" />
        <div 
          class="text-gray-600 text-center font-['Roboto-Regular',_sans-serif] text-sm font-medium" 
        > 
          Copy Link 
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import QrcodeVue from 'qrcode.vue';

export default {
  name: "QRCodePopup",
  components: {
    Icon,
    QrcodeVue,
  },
  props: {
    websiteUrl: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    closePopup() {
      this.$emit('close');
    },
    saveQRCode() {
      // TODO: Implement QR code generation and save functionality
      console.log('Saving QR code for URL:', this.websiteUrl);
      // For now, just close the popup
      this.closePopup();
    },
    copyToClipboard() {
      // Copy the website URL to clipboard
      navigator.clipboard.writeText(this.websiteUrl).then(() => {
        console.log('URL copied to clipboard:', this.websiteUrl);
        // You could add a toast notification here
      }).catch(err => {
        console.error('Failed to copy URL:', err);
      });
    }
  }
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>