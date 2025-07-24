<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closePopup"
  >
    <div
      class="bg-[#ffffff] rounded-[3px] flex flex-row gap-0 items-start justify-end relative overflow-hidden w-[600px] max-h-[80vh] overflow-y-auto"
    >
      <div
        class="bg-[#fafafa] rounded-[3px] flex flex-col gap-0 items-start justify-start flex-1 relative overflow-hidden"
      >
        <div
          class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[43px] relative"
        >
          <div
            class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start"
          >
            QR Code Analytics
          </div>
        </div>
        <div
          class="flex flex-col items-start justify-start self-stretch shrink-0 relative"
        >
          <div
            class="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative"
          >
            <div
              class="p-2.5 flex flex-row gap-2.5 items-start justify-center flex-1 relative"
            >
              <div
                class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[15px] pr-2.5 pb-[15px] pl-2.5 flex flex-col gap-[11px] items-start justify-start flex-1 relative"
              >
                <div
                  class="text-gray-500 text-left font-['Roboto-Medium',_sans-serif] text-[11px] leading-[18px] font-medium uppercase relative self-stretch"
                  style="letter-spacing: 1px"
                >
                  Total Scans
                </div>
                <div
                  class="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative"
                >
                  <div
                    class="flex flex-row gap-2.5 items-end justify-start shrink-0 relative"
                  >
                    <div
                      class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-[21px] leading-8 font-bold relative flex items-end justify-start"
                    >
                      {{ analyticsData.scans || 0 }}
                    </div>
                  </div>
                </div>
              </div>
               <div
                class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[15px] pr-2.5 pb-[15px] pl-2.5 flex flex-col gap-[11px] items-start justify-start flex-1 relative"
              >
                <div
                  class="text-gray-500 text-left font-['Roboto-Medium',_sans-serif] text-[11px] leading-[18px] font-medium uppercase relative self-stretch"
                  style="letter-spacing: 1px"
                >
                  Unique Visitors
                </div>
                <div
                  class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-[21px] leading-8 font-bold relative"
                >
                  {{ analyticsData.uniqueScans || 0 }}
                </div>
              </div>
              <div
                class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[15px] pr-2.5 pb-[15px] pl-2.5 flex flex-col gap-[11px] items-start justify-start flex-1 relative"
              >
                <div
                  class="text-gray-500 text-left font-['Roboto-Medium',_sans-serif] text-[11px] leading-[18px] font-medium uppercase relative self-stretch"
                  style="letter-spacing: 1px"
                >
                  Avg Duration
                </div>
                <div
                  class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-[21px] leading-8 font-bold relative"
                >
                  {{ analyticsData.averageScanDuration || '0s' }}
                </div>
              </div>
       



            </div>
          </div>
        </div>
        <div
          class="flex flex-col items-start justify-start self-stretch shrink-0 relative"
        >
          <div
            class="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative"
          >
            <div
              class="p-2.5 flex flex-row gap-2.5 items-start justify-center flex-1 relative"
            >
              <div
                class="flex flex-row gap-[9px] items-start justify-start flex-1 relative"
              >
              
                <div
                  class="bg-[#eef0f2] rounded-[3px] pt-1 pr-3 pb-1 pl-3 flex flex-col gap-0 items-center justify-center flex-1 relative overflow-hidden cursor-pointer hover:bg-gray-200"
                  @click="downloadQR"
                >
                  <div
                    class="text-dark-gray-dark-gray-2 text-center font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex items-center justify-center"
                  >
                    Download
                  </div>
                </div>
                <div
                  class="bg-[#eef0f2] rounded-[3px] pt-1 pr-3 pb-1 pl-3 flex flex-col gap-0 items-center justify-center flex-1 relative overflow-hidden cursor-pointer hover:bg-gray-200"
                  @click="shareQR"
                >
                  <div
                    class="text-dark-gray-dark-gray-2 text-center font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex items-center justify-center"
                  >
                    Share
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col items-start justify-start self-stretch shrink-0 relative"
        >
          <div
            class="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative"
          >
            <div
              class="p-2.5 flex flex-col gap-2.5 items-center justify-start flex-1 relative"
            >
              <div
                v-for="(scan, index) in (analyticsData.recentScans || [])"
                :key="index"
                class="bg-white rounded-[3px] border-solid border-[#e2e8f0] border p-4 flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative overflow-hidden"
              >
                <div
                  class="flex flex-row gap-3 items-center justify-start self-stretch shrink-0 relative"
                >
                  <div
                    class="flex flex-row gap-2.5 items-center justify-center flex-1 relative"
                  >
                    <Icon icon="lucide:scan-line" width="24" height="24" />
                    <div
                      class="flex flex-row gap-2.5 items-center justify-center flex-1 relative"
                    >
                      <div
                        class="text-dark-gray-dark-gray-2 text-left font-['Roboto-Bold',_sans-serif] text-sm leading-5 font-bold relative flex-1"
                        style="letter-spacing: -0.006em"
                      >
                        Recent Scans
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-row gap-2.5 items-center justify-between self-stretch shrink-0 relative"
                >
                  <div
                    class="text-dark-gray-dark-gray-2 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative flex-1"
                    style="letter-spacing: -0.006em"
                  >
                    {{ scan.browser }} on {{ scan.device }}
                  </div>
                  <div
                    class="text-gray-400 text-right font-['Roboto-Regular',_sans-serif] text-xs leading-4 font-normal relative"
                  >
                    {{ scan.timestamp }}
                  </div>
                </div>
                <div
                  class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative"
                >
                  <div
                    class="flex flex-row gap-[3px] items-center justify-start flex-1 relative"
                  >
                    <Icon icon="lucide:laptop" width="18" height="18" />
                    <div
                      class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative"
                    >
                      {{ scan.ipAddress }}
                    </div>
                  </div>
                  <div
                    class="flex flex-row gap-[3px] items-center justify-start flex-1 relative"
                  >
                    <Icon icon="lucide:map-pin" width="18" height="18" />
                    <div
                      class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative"
                    >
                      {{ scan.location }}
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative"
                >
                  <div
                    class="flex flex-row gap-[3px] items-center justify-start flex-1 relative"
                  >
                    <Icon icon="lucide:external-link" width="18" height="18" />
                    <div
                      class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative"
                    >
                      {{ scan.referrer }}
                    </div>
                  </div>
                  <div
                    class="flex flex-row gap-[3px] items-center justify-start flex-1 relative"
                  >
                    <Icon icon="lucide:clock" width="18" height="18" />
                    <div
                      class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative"
                    >
                      {{ scan.scanDuration }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Summary Statistics -->
      
        <!-- Hidden QR Code for Download Functionality -->
        <div class="hidden">
          <qrcode-vue
            v-if="analyticsData && analyticsData.url"
            :value="analyticsData.url"
            :size="200"
            level="M"
            render-as="canvas"
          />
        </div>
        <div
          class="pr-3.5 pb-3 pl-3.5 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0 relative"
        >
          <div
            class="flex flex-row gap-0 items-start justify-start shrink-0 relative"
          >
            <div
              class="bg-[#e7eaee] rounded-sm pt-[7px] pr-[38px] pb-[7px] pl-[38px] flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer hover:bg-gray-300"
              @click="closePopup"
            >
              <div
                class="text-[#424242] text-left font-['Roboto-Bold',_sans-serif] text-xs font-bold relative"
              >
                Close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import QrcodeVue from 'qrcode.vue';

export default {
  name: "AnalyticsPopup",
  components: {
    Icon,
    QrcodeVue,
  },
  props: {
    analyticsData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // Component state data only
    };
  },
  computed: {
    totalScans() {
      return this.analyticsData.scans || 0;
    },
  },
  mounted() {
    // Component mounted - analytics data comes from props
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    copyLink() {
      if (this.analyticsData && this.analyticsData.url) {
        navigator.clipboard.writeText(this.analyticsData.url).then(() => {
          this.showNotification("Link copied to clipboard!", "success");
        }).catch(() => {
          this.showNotification("Failed to copy link", "error");
        });
      } else {
        this.showNotification("No URL available to copy", "error");
      }
    },
    downloadQR() {
      if (this.analyticsData && this.analyticsData.url) {
        // Wait for next tick to ensure QR code is rendered
        this.$nextTick(() => {
          // Find the QR code canvas in the popup
          const qrCanvas = this.$el.querySelector('canvas');
          
          if (qrCanvas) {
            // Create a new canvas with padding for better appearance
            const paddedCanvas = document.createElement('canvas');
            const padding = 20;
            
            // Set new canvas size (original size + padding)
            paddedCanvas.width = qrCanvas.width + (padding * 2);
            paddedCanvas.height = qrCanvas.height + (padding * 2);
            
            // Get context and fill with white background
            const ctx = paddedCanvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            
            // Draw original QR code in the center
            ctx.drawImage(
              qrCanvas,
              padding,
              padding,
              qrCanvas.width,
              qrCanvas.height
            );
            
            // Create download link
            const link = document.createElement('a');
            link.download = `qr-code-${this.analyticsData.type || 'download'}.png`;
            link.href = paddedCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification("QR code downloaded successfully!", "success");
          } else {
            this.showNotification("QR code not found. Please wait for it to load.", "error");
          }
        });
      } else {
        this.showNotification("No QR data available for download", "error");
      }
    },
    shareQR() {
      if (this.analyticsData && this.analyticsData.url) {
        if (navigator.share) {
          // Use native Web Share API if available
          navigator.share({
            title: `QR Code - ${this.analyticsData.type || 'Website'}`,
            text: `Check out this QR code for ${this.analyticsData.type || 'Website'}`,
            url: this.analyticsData.url
          }).then(() => {
            this.showNotification("Shared successfully!", "success");
          }).catch((error) => {
            if (error.name !== 'AbortError') {
              this.fallbackShare();
            }
          });
        } else {
          this.fallbackShare();
        }
      } else {
        this.showNotification("No URL available to share", "error");
      }
    },
    fallbackShare() {
      // Fallback sharing options
      const url = encodeURIComponent(this.analyticsData.url);
      const text = encodeURIComponent(`Check out this QR code for ${this.analyticsData.type || 'Website'}`);
      
      const shareOptions = [
        { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
        { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
        { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
        { name: 'Email', url: `mailto:?subject=QR Code&body=${text} ${this.analyticsData.url}` }
      ];
      
      const choice = prompt(`Choose sharing option:\n${shareOptions.map((opt, i) => `${i + 1}. ${opt.name}`).join('\n')}\n\nEnter number (1-${shareOptions.length}):`);
      
      if (choice && choice >= 1 && choice <= shareOptions.length) {
        window.open(shareOptions[choice - 1].url, '_blank');
        this.showNotification("Opening share window...", "success");
      }
    },
    showNotification(message, type = 'info') {
      // Simple notification system - you can replace with a proper toast library
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        ${type === 'success' ? 'background-color: #10b981;' : ''}
        ${type === 'error' ? 'background-color: #ef4444;' : ''}
        ${type === 'info' ? 'background-color: #3b82f6;' : ''}
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    },
  },
};
</script>

<style scoped>
/* Custom styles if needed */
</style>