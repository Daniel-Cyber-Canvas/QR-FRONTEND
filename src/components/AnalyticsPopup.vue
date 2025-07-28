<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closePopup"
  >
    <div
      class="bg-[#ffffff] rounded-[3px] flex flex-row gap-0 items-start justify-end relative overflow-hidden w-[700px] max-h-[80vh] overflow-y-auto"
    >
      <div
        class="bg-[#fafafa] rounded-[3px] flex flex-col gap-0 items-start justify-start flex-1 relative overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-center justify-between self-stretch shrink-0 h-[43px] relative"
        >
          <div
            class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start"
          >
            QR Code Analytics - QR-{{ qrId }}
          </div>
          <div v-if="isLoading" class="text-sm text-gray-600">Loading...</div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-8">
          <div class="text-gray-600">Loading analytics data...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center p-8">
          <div class="text-red-600">{{ error }}</div>
        </div>

        <!-- Analytics Content -->
        <div v-else class="flex flex-col items-start justify-start self-stretch shrink-0 relative">
          <!-- Summary Statistics -->
          <div class="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
            <div class="p-2.5 flex flex-row gap-2.5 items-start justify-center flex-1 relative">
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
                  class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-[21px] leading-8 font-bold relative"
                >
                  {{ analyticsData.total_scans || 0 }}
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
                  {{ analyticsData.unique_visitors || 0 }}
                </div>
              </div>
              
              <div
                class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[15px] pr-2.5 pb-[15px] pl-2.5 flex flex-col gap-[11px] items-start justify-start flex-1 relative"
              >
                <div
                  class="text-gray-500 text-left font-['Roboto-Medium',_sans-serif] text-[11px] leading-[18px] font-medium uppercase relative self-stretch"
                  style="letter-spacing: 1px"
                >
                  Latest Scan
                </div>
                <div
                  class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-[14px] leading-6 font-bold relative"
                >
                  {{ latestScanTime }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
            <div class="p-2.5 flex flex-row gap-2.5 items-start justify-center flex-1 relative">
              <div class="flex flex-row gap-[9px] items-start justify-start flex-1 relative">
                <div
                  class="bg-[#eef0f2] rounded-[3px] pt-1 pr-3 pb-1 pl-3 flex flex-col gap-0 items-center justify-center flex-1 relative overflow-hidden cursor-pointer hover:bg-gray-200"
                  @click="downloadQR"
                >
                  <div
                    class="text-dark-gray-dark-gray-2 text-center font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex items-center justify-center"
                  >
                    Download QR
                  </div>
                </div>
                <div
                  class="bg-[#eef0f2] rounded-[3px] pt-1 pr-3 pb-1 pl-3 flex flex-col gap-0 items-center justify-center flex-1 relative overflow-hidden cursor-pointer hover:bg-gray-200"
                  @click="exportAnalytics"
                >
                  <div
                    class="text-dark-gray-dark-gray-2 text-center font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex items-center justify-center"
                  >
                    Export Data
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Scans List -->
          <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
              <div class="p-2.5 flex flex-col gap-2.5 items-center justify-start flex-1 relative">
                <!-- Header for scan records -->
                <div class="bg-white rounded-[3px] border-solid border-[#e2e8f0] border p-4 flex flex-row gap-3 items-center justify-start self-stretch shrink-0 relative">
                  <Icon icon="lucide:scan-line" width="24" height="24" />
                  <div class="text-dark-gray-dark-gray-2 text-left font-['Roboto-Bold',_sans-serif] text-sm leading-5 font-bold relative flex-1">
                    Recent Scans ({{ (analyticsData.records || []).length }} records)
                  </div>
                </div>

                <!-- Individual scan records -->
                <div
                  v-for="record in (analyticsData.records || [])"
                  :key="record.id"
                  class="bg-white rounded-[3px] border-solid border-[#e2e8f0] border p-4 flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative overflow-hidden"
                >
                  <!-- Device and Time -->
                  <div class="flex flex-row gap-2.5 items-center justify-between self-stretch shrink-0 relative">
                    <div class="text-dark-gray-dark-gray-2 text-left font-['Roboto-Bold',_sans-serif] text-sm leading-5 font-bold relative flex-1">
                      {{ getDeviceInfo(record.user_agent) }} • {{ record.device || 'Unknown Device' }}
                    </div>
                    <div class="text-gray-400 text-right font-['Roboto-Regular',_sans-serif] text-xs leading-4 font-normal relative">
                      {{ formatTimestamp(record.scanned_at) }}
                    </div>
                  </div>

                  <!-- IP and Location -->
                  <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-row gap-[3px] items-center justify-start flex-1 relative">
                      <Icon icon="lucide:laptop" width="18" height="18" />
                      <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative">
                        {{ record.ip_address }}
                      </div>
                    </div>
                    <div class="flex flex-row gap-[3px] items-center justify-start flex-1 relative">
                      <Icon icon="lucide:map-pin" width="18" height="18" />
                      <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative">
                        {{ record.location || 'Unknown Location' }}
                      </div>
                    </div>
                  </div>

                  <!-- User Agent (truncated) -->
                  <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-row gap-[3px] items-center justify-start flex-1 relative">
                      <Icon icon="lucide:monitor" width="18" height="18" />
                      <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-4 font-normal relative truncate">
                        {{ record.user_agent }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No records message -->
                <div v-if="!analyticsData.records || analyticsData.records.length === 0" 
                     class="bg-white rounded-[3px] border-solid border-[#e2e8f0] border p-8 flex flex-col items-center justify-center self-stretch shrink-0 relative">
                  <Icon icon="lucide:scan-line" width="48" height="48" class="text-gray-300 mb-2" />
                  <div class="text-gray-500 text-center font-['Roboto-Regular',_sans-serif] text-sm">
                    No scans recorded yet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden QR Code for Download - with unique ID -->
        <div class="hidden">
          <qrcode-vue
            v-if="qrCodeUrl"
            :id="`qr-download-${qrId}`"
            ref="downloadQRCode"
            :value="qrCodeUrl"
            :size="200"
            level="M"
            render-as="canvas"
          />
        </div>

        <!-- Close Button -->
        <div class="pr-3.5 pb-3 pl-3.5 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0 relative">
          <div class="flex flex-row gap-0 items-start justify-start shrink-0 relative">
            <div
              class="bg-[#e7eaee] rounded-sm pt-[7px] pr-[38px] pb-[7px] pl-[38px] flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer hover:bg-gray-300"
              @click="closePopup"
            >
              <div class="text-[#424242] text-left font-['Roboto-Bold',_sans-serif] text-xs font-bold relative">
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
import axios from '../axios';

export default {
  name: "AnalyticsPopup",
  components: {
    Icon,
    QrcodeVue,
  },
  props: {
    qrId: {
      type: [String, Number],
      required: true,
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      analyticsData: {},
      isLoading: false,
      error: null,
    };
  },
  computed: {
    latestScanTime() {
      if (!this.analyticsData.records || this.analyticsData.records.length === 0) {
        return 'Never';
      }
      const latestRecord = this.analyticsData.records[0]; // Records are ordered by newest first
      return this.formatTimestamp(latestRecord.scanned_at);
    },
  },
  async mounted() {
    await this.fetchAnalytics();
  },
  methods: {
    async fetchAnalytics() {
      this.isLoading = true;
      this.error = null;
      
      try {
        console.log('🔍 Fetching analytics for QR ID:', this.qrId);
        const response = await axios.get(`/api/qr/${this.qrId}/analytics`);
        
        console.log('📊 Analytics response:', response.data);
        this.analyticsData = response.data;
      } catch (error) {
        console.error('Error fetching analytics:', error);
        this.error = error.response?.data?.message || 'Failed to load analytics data';
      } finally {
        this.isLoading = false;
      }
    },
    
    formatTimestamp(timestamp) {
      if (!timestamp) return 'Unknown';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    },
    
    getDeviceInfo(userAgent) {
      if (!userAgent) return 'Unknown Browser';
      
      // Simple browser detection
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
      if (userAgent.includes('Opera')) return 'Opera';
      
      return 'Unknown Browser';
    },
    
    closePopup() {
      this.$emit("close");
    },
    
    downloadQR() {
      if (!this.qrCodeUrl) {
        this.showNotification("No QR data available for download", "error");
        return;
      }

      console.log('🔽 Downloading QR for ID:', this.qrId, 'URL:', this.qrCodeUrl);

      this.$nextTick(() => {
        // Look for the specific QR code canvas using the unique ID
        const qrCanvas = document.getElementById(`qr-download-${this.qrId}`)?.querySelector('canvas');
        
        if (qrCanvas) {
          console.log('✅ Found QR canvas for download:', qrCanvas);
          
          const paddedCanvas = document.createElement('canvas');
          const padding = 20;
          
          // Set canvas size with padding
          paddedCanvas.width = qrCanvas.width + (padding * 2);
          paddedCanvas.height = qrCanvas.height + (padding * 2);
          
          const ctx = paddedCanvas.getContext('2d');
          
          // Fill with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
          
          // Draw the QR code in the center
          ctx.drawImage(qrCanvas, padding, padding, qrCanvas.width, qrCanvas.height);
          
          // Create and trigger download
          const link = document.createElement('a');
          link.download = `qr-code-${this.qrId}.png`;
          link.href = paddedCanvas.toDataURL('image/png');
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.showNotification("QR code downloaded successfully!", "success");
        } else {
          console.error('❌ QR canvas not found for ID:', this.qrId);
          // Try alternative method using ref
          this.downloadQRUsingRef();
        }
      });
    },

    downloadQRUsingRef() {
      const qrComponent = this.$refs.downloadQRCode;
      
      if (qrComponent) {
        // Wait a bit more for the component to fully render
        setTimeout(() => {
          const qrCanvas = qrComponent.$el?.querySelector('canvas');
          
          if (qrCanvas) {
            console.log('✅ Found QR canvas using ref:', qrCanvas);
            
            const paddedCanvas = document.createElement('canvas');
            const padding = 20;
            
            paddedCanvas.width = qrCanvas.width + (padding * 2);
            paddedCanvas.height = qrCanvas.height + (padding * 2);
            
            const ctx = paddedCanvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            
            ctx.drawImage(qrCanvas, padding, padding, qrCanvas.width, qrCanvas.height);
            
            const link = document.createElement('a');
            link.download = `qr-code-${this.qrId}.png`;
            link.href = paddedCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification("QR code downloaded successfully!", "success");
          } else {
            console.error('❌ QR canvas still not found using ref');
            this.showNotification("QR code not ready. Please wait a moment and try again.", "error");
          }
        }, 100);
      } else {
        console.error('❌ QR component ref not found');
        this.showNotification("QR code component not ready. Please try again.", "error");
      }
    },
    
    exportAnalytics() {
      if (!this.analyticsData.records || this.analyticsData.records.length === 0) {
        this.showNotification("No analytics data to export", "error");
        return;
      }
      
      // Create CSV content
      const headers = ['ID', 'IP Address', 'Device', 'Location', 'Scanned At', 'User Agent'];
      const csvContent = [
        headers.join(','),
        ...this.analyticsData.records.map(record => [
          record.id,
          `"${record.ip_address}"`,
          `"${record.device || 'Unknown'}"`,
          `"${record.location || 'Unknown'}"`,
          `"${record.scanned_at}"`,
          `"${record.user_agent.replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `qr-analytics-${this.qrId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showNotification("Analytics data exported successfully!", "success");
    },
    
    showNotification(message, type = 'info') {
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