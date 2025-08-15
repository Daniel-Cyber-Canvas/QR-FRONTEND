<template>
  <div>
    <side-navigation>
      <div class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
        <div class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
        </div>
        <div class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden min-w-0">
          <div class="flex flex-col gap-[11px] items-start justify-center flex-1 relative w-full min-w-0">
            
            <!-- Header -->
            <div class="bg-[#ffffff] border-solid border-[#E2E8F0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-2.5 items-center justify-start w-full shrink-0 relative min-w-0">
              <div class="flex flex-row gap-[11px] items-center justify-start w-full shrink-0 relative">
                <div class="pt-[5px] pr-2.5 pb-[5px] flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                  <Icon icon="ph:chat-circle-text" class="w-6 h-6 text-[#0c768a]" />
                  <div class="text-[#000000] text-left font-['Roboto-Bold',_sans-serif] text-base font-bold relative">
                    Social Media QR Management
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Create Form -->
            <div class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-col gap-2.5 items-start justify-center shrink-0 w-full relative min-w-0">
              <div class="flex flex-row gap-2 items-start justify-start self-stretch shrink-0 relative">
                <div class="flex flex-col gap-0 items-start justify-center flex-1 relative">
                  <div class="flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative">
                    <div class="text-neutral-800 text-left font-['Roboto-SemiBold',_sans-serif] text-xl font-semibold relative flex-1 overflow-hidden" style="text-overflow: ellipsis; white-space: nowrap">
                      Quick Create Social Media QR
                    </div>
                  </div>
                  <div class="flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative">
                    <div class="text-[#64748b] text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative flex-1 overflow-hidden" style="text-overflow: ellipsis; white-space: nowrap">
                      Create a new social media QR code quickly
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                <!-- Platform Selection -->
                <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
                  <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch h-5 overflow-hidden" style="text-overflow: ellipsis">
                    Social Media Platform
                  </div>
                  <select 
                    v-model="quickCreateData.platform" 
                    @change="onPlatformChange"
                    class="rounded border-solid border-neutral-200 border p-2 flex-1 text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal focus:outline-none focus:border-[#0c768a] focus:ring-1 focus:ring-[#0c768a] w-full"
                  >
                    <option value="">Select Platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="pinterest">Pinterest</option>
                  </select>
                </div>

                <!-- URL and Generate Button -->
                <div class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
                  <input
                    v-model="quickCreateData.url"
                    type="url"
                    :placeholder="getUrlPlaceholder()"
                    class="rounded border-solid border-neutral-200 border p-2 flex-1 text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal focus:outline-none focus:border-[#0c768a] focus:ring-1 focus:ring-[#0c768a]"
                  />
                  <Button 
                    text="Generate QR Code" 
                    @click="quickGenerateQRCode"
                    :disabled="!quickCreateData.platform || !quickCreateData.url"
                  />
                </div>
              </div>
            </div>
            
            <!-- Search and Filter -->
            <div class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-4 flex flex-row gap-3 items-center justify-between w-full shrink-0 relative">
              <div class="flex flex-row gap-3 items-center">
                <div class="bg-[#ffffff] rounded-[3px] border-solid border-[#d2d2d2] border pl-[5px] flex flex-row gap-[5px] items-center justify-start shrink-0 w-[250px] h-8 relative overflow-hidden">
                  <Icon icon="ph:magnifying-glass" class="shrink-0 w-4 h-4 relative object-cover" color="black" />
                  <input
                    class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 flex-1 h-[21px] font-['Roboto-Regular',_sans-serif] text-xs font-normal border-none focus:outline-none relative"
                    placeholder="Search QR codes..." 
                    v-model="searchQuery" 
                    type="text"
                  >
                </div>
                
                <!-- Platform Filter -->
                <select 
                  v-model="filterPlatform"
                  class="rounded border-solid border-neutral-200 border p-2 text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal focus:outline-none focus:border-[#0c768a] focus:ring-1 focus:ring-[#0c768a]"
                >
                  <option value="">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="pinterest">Pinterest</option>
                </select>
              </div>
              
              <div class="text-sm text-gray-600">
                {{ filteredQRItems.length }} QR code{{ filteredQRItems.length !== 1 ? 's' : '' }} found
              </div>
            </div>
            
            <!-- Bulk Actions -->
            <div
              v-if="selectedItems.length > 0"
              class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-4 flex flex-row gap-3 items-center justify-between w-full shrink-0 relative"
            >
              <div class="flex flex-row gap-3 items-center">
                <Button 
                  :text="selectedItems.length === filteredQRItems.length ? 'Deselect All' : 'Select All'"
                  @click="selectAll"
                  class="bg-gray-100 text-gray-700 border-gray-300"
                />
                <span class="text-sm text-gray-600">
                  {{ selectedItems.length }} of {{ filteredQRItems.length }} selected
                </span>
              </div>
              <div class="flex flex-row gap-3 items-center">
                <Button 
                  text="Download Selected"
                  @click="downloadSelected"
                  class="bg-blue-500 text-white border-blue-500"
                />
                <Button 
                  text="Delete Selected"
                  @click="deleteSelected"
                  class="bg-red-500 text-white border-red-500"
                />
              </div>
            </div>
            
            <!-- No Items Message -->
            <div
              v-if="filteredQRItems.length === 0 && !isLoading"
              class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-8 flex flex-col items-center justify-center w-full shrink-0 relative"
            >
              <Icon icon="ph:chat-circle-text" class="w-16 h-16 text-gray-300 mb-4" />
              <div class="text-gray-500 text-center">
                <div class="text-lg font-medium mb-2">No social media QR codes found</div>
                <div class="text-sm">
                  {{ searchQuery || filterPlatform ? 'Try adjusting your search or filter criteria.' : 'Create your first social media QR code using the form above.' }}
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div
              v-if="isLoading"
              class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-8 flex flex-col items-center justify-center w-full shrink-0 relative"
            >
              <Icon icon="ph:spinner" class="w-8 h-8 text-[#0c768a] animate-spin mb-4" />
              <div class="text-gray-500 text-center">
                <div class="text-lg font-medium mb-2">Loading QR codes...</div>
              </div>
            </div>
            
            <!-- QR Items List -->
            <div
              v-for="item in paginatedQRItems"
              :key="item.id"
              class="bg-[#ffffff] border-solid border-[#e2e8f0] border flex flex-col gap-0 items-start justify-start w-full shrink-0 relative"
            >
              <div class="flex flex-row items-center justify-between w-full shrink-0 relative">
                <div class="flex flex-row gap-0 items-center justify-start flex-1 relative">
                  <div class="border-solid border-gray-200 border-b pt-4 pr-6 pb-4 pl-6 flex flex-row gap-3 items-center justify-start shrink-0 relative">
                    <div class="flex flex-row gap-0 items-center justify-center shrink-0 relative">
                      <input
                        type="checkbox"
                        :checked="isSelected(item.id)"
                        @change="toggleSelection(item.id)"
                        class="w-5 h-5 text-[#0c768a] bg-white border-gray-300 rounded focus:ring-[#0c768a] focus:ring-2"
                      />
                    </div>
                    <qrcode-vue 
                      :value="item.qr_content || item.url"
                      :size="77"
                      level="M"
                      render-as="svg"
                      background="white"
                      foreground="black"
                      class="shrink-0 w-[77px] h-[77px] relative"
                    />
                    <div class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative">
                      <div class="flex items-center gap-2">
                        <Icon :icon="getPlatformIcon(item.platform)" class="w-4 h-4" />
                        <div class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative">
                          {{ item.platform_display || item.platform }}
                        </div>
                      </div>
                      <div class="text-gray-900 text-left font-['Roboto-Medium',_sans-serif] text-sm leading-5 font-medium relative">
                        {{ item.title || item.code }}
                      </div>
                      <div class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative">
                        <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative">
                          Created: {{ formatDate(item.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pt-4 pr-6 pb-4 pl-6 flex flex-col gap-0 items-start justify-center shrink-0 h-[72px] relative">
                    <div class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative">
                      <div class="text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative">
                        {{ item.description || 'Social Media Profile' }}
                      </div>
                      <a
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-[#0c768a] text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative cursor-pointer hover:underline max-w-[300px] truncate"
                      >
                        {{ item.url }}
                      </a>
                      <div class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative">
                        <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative">
                          Modified: {{ formatDate(item.updated_at) }}
                        </div>
                        <div v-if="item.is_dynamic" class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Dynamic
                        </div>
                        <div v-if="item.analytics" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          Analytics
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row gap-[5px] items-center justify-end shrink-0 relative">
                  <Button 
                    text="Analytics" 
                    variant="outline" 
                    @click="openAnalyticsPopup(item)"
                    :disabled="!item.analytics"
                  />
                  <Button 
                    text="Download" 
                    variant="outline" 
                    @click="downloadQRCode(item)"
                  />
                  <div class="p-4 flex flex-row gap-1 items-center justify-start shrink-0 w-[116px] h-[72px] relative">
                    <div class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative">
                      <div
                        class="rounded-lg p-2.5 flex flex-row gap-2 items-center justify-center shrink-0 relative overflow-hidden cursor-pointer hover:bg-red-50"
                        @click="deleteItem(item.id)"
                      >
                        <Icon icon="mingcute:delete-line" width="24" height="24" color="#667085" />
                      </div>
                    </div>
                    <div class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative">
                      <div
                        class="rounded-lg p-2.5 flex flex-row gap-2 items-center justify-center shrink-0 relative overflow-hidden cursor-pointer hover:bg-blue-50"
                        @click="editItem(item)"
                      >
                        <Icon icon="mynaui:edit" width="24" height="24" color="#667085" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="totalPages > 1"
              class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-4 flex flex-row gap-3 items-center justify-center w-full shrink-0 relative"
            >
              <div class="flex flex-col gap-3 items-center justify-center">
                <!-- Pagination Info -->
                <div class="text-gray-600 text-sm">
                  Showing {{ startItem }} to {{ endItem }} of {{ filteredQRItems.length }} results
                </div>
                
                <!-- Pagination Buttons -->
                <div class="flex flex-row gap-2 items-center justify-center">
                  <!-- Previous Button -->
                  <button 
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    Previous
                  </button>
                  
                  <!-- Page Numbers -->
                  <template v-for="page in visiblePages" :key="page">
                    <button 
                      v-if="typeof page === 'number'"
                      @click="changePage(page)"
                      :class="[
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        page === currentPage 
                          ? 'bg-[#0c768a] text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-2 text-gray-500">...</span>
                  </template>
                  
                  <!-- Next Button -->
                  <button 
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    :class="[
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </side-navigation>
    
    <!-- QR Code Popup -->
    <PortalPopup 
      v-if="showQRPopup"
      :isOpen="showQRPopup" 
      placement="Centered" 
      overlayColor="rgba(0, 0, 0, 0.5)"
      :onOutsideClick="closeQRPopup"
    >
      <QRCodePopup 
        :qrData="generatedQRData"
        @close="closeQRPopup" 
      />
    </PortalPopup>
    
    <!-- Analytics Popup -->
    <PortalPopup 
      v-if="showAnalyticsPopup"
      :isOpen="showAnalyticsPopup" 
      placement="Centered" 
      overlayColor="rgba(0, 0, 0, 0.5)"
      :onOutsideClick="closeAnalyticsPopup"
    >
      <AnalyticsPopup 
        :qrItem="selectedQRItem" 
        @close="closeAnalyticsPopup" 
      />
    </PortalPopup>
    
    <!-- Social Media Edit Popup -->
    <SocialMediaEditPopup
      v-if="showEditPopup"
      :isVisible="showEditPopup"
      :qrCode="selectedQRItem"
      @close="closeEditPopup"
      @updated="handleQRUpdated"
    />
    
    <!-- Delete Confirmation Popup -->
    <DeleteConfirmationPopup 
      :isVisible="isDeletePopupOpen"
      :itemType="itemToDelete?.platform_display || 'Social Media QR Code'"
      :itemCode="itemToDelete?.title || itemToDelete?.code || ''"
      @confirm="confirmDelete" 
      @cancel="cancelDelete" 
    />
  </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import Button from "@/components/Button.vue";
import PortalPopup from "@/components/PortalPopup.vue";
import { Icon } from "@iconify/vue";
import QRCodePopup from "@/components/QRCodePopup.vue";
import AnalyticsPopup from "@/components/AnalyticsPopup.vue";
import QrcodeVue from 'qrcode.vue';
import DeleteConfirmationPopup from "@/components/DeleteConfirmationPopup.vue";
import SocialMediaEditPopup from "@/components/SocialMediaEditPopup.vue";
import axios from '@/axios.js';
import config from '@/config.js';

export default {
  components: {
    SideNavigation,
    Button,
    Icon,
    PortalPopup,
    QRCodePopup,
    AnalyticsPopup,
    QrcodeVue,
    DeleteConfirmationPopup,
    SocialMediaEditPopup,
  },
  name: "SocialMediaQRManagement",
  data() {
    return {
      // Quick create form data
      quickCreateData: {
        platform: '',
        url: '',
        title: '',
        description: '',
        analytics: true
      },
      
      // UI state
      showQRPopup: false,
      showAnalyticsPopup: false,
      showEditPopup: false,
      selectedQRItem: null,
      selectedItems: [],
      isDeletePopupOpen: false,
      itemToDelete: null,
      isLoading: false,
      isGenerating: false,
      generatedQRData: null,
      
      // Search and filter
      searchQuery: '',
      filterPlatform: '',
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      
      // QR codes data
      qrItems: []
    };
  },
  computed: {
    filteredQRItems() {
      let filtered = this.qrItems;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.url && item.url.toLowerCase().includes(query)) ||
          (item.platform && item.platform.toLowerCase().includes(query)) ||
          (item.handle && item.handle.toLowerCase().includes(query))
        );
      }
      
      // Apply platform filter
      if (this.filterPlatform) {
        filtered = filtered.filter(item => item.platform === this.filterPlatform);
      }
      
      return filtered;
    },
    
    totalPages() {
      return Math.ceil(this.filteredQRItems.length / this.itemsPerPage);
    },
    
    paginatedQRItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredQRItems.slice(start, end);
    },
    
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.filteredQRItems.length);
    },
    
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        
        if (current > 4) {
          pages.push('...');
        }
        
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        if (current < total - 3) {
          pages.push('...');
        }
        
        pages.push(total);
      }
      
      return pages;
    }
  },
  
  mounted() {
    this.fetchQRCodes();
  },
  
  methods: {
    // Platform helpers
    getUrlPlaceholder() {
      const placeholders = {
        facebook: 'https://www.facebook.com/username',
        instagram: 'https://www.instagram.com/username',
        twitter: 'https://twitter.com/username',
        linkedin: 'https://www.linkedin.com/in/username',
        tiktok: 'https://www.tiktok.com/@username',
        youtube: 'https://www.youtube.com/c/channelname',
        snapchat: 'https://www.snapchat.com/add/username',
        pinterest: 'https://www.pinterest.com/username'
      };
      return placeholders[this.quickCreateData.platform] || 'https://example.com/profile';
    },
    
    getPlatformIcon(platform) {
      const icons = {
        facebook: 'ph:facebook-logo',
        instagram: 'ph:instagram-logo',
        twitter: 'ph:twitter-logo',
        linkedin: 'ph:linkedin-logo',
        tiktok: 'ph:tiktok-logo',
        youtube: 'ph:youtube-logo',
        snapchat: 'ph:snapchat-logo',
        pinterest: 'ph:pinterest-logo'
      };
      return icons[platform] || 'ph:chat-circle-text';
    },
    
    onPlatformChange() {
      // Clear URL when platform changes
      this.quickCreateData.url = '';
      
      // Set default title and description based on platform
      if (this.quickCreateData.platform) {
        const platformName = this.quickCreateData.platform.charAt(0).toUpperCase() + this.quickCreateData.platform.slice(1);
        this.quickCreateData.title = `My ${platformName} Profile`;
        this.quickCreateData.description = `Follow me on ${platformName}`;
      }
    },
    
    // QR Code generation
    async quickGenerateQRCode() {
      if (!this.quickCreateData.platform || !this.quickCreateData.url) {
        alert('Please select a platform and enter a URL.');
        return;
      }
      
      this.isGenerating = true;
      
      try {
        const payload = {
          type: "social_media",
          title: this.quickCreateData.title || `${this.quickCreateData.platform} QR`,
          content: {
            platform: this.quickCreateData.platform,
            url: this.quickCreateData.url.trim(),
            title: this.quickCreateData.title || `My ${this.quickCreateData.platform} Profile`,
            description: this.quickCreateData.description || `Follow me on ${this.quickCreateData.platform}`,
            handle: this.extractHandle(this.quickCreateData.url)
          },
          is_dynamic: true,
          analytics: this.quickCreateData.analytics,
          active: true
        };

        const response = await axios.post('/api/qr', payload);
        
        if (response.data) {
          this.generatedQRData = response.data;
          this.showQRPopup = true;
          
          // Refresh the list
          await this.fetchQRCodes();
          
          // Reset form
          this.quickCreateData = {
            platform: '',
            url: '',
            title: '',
            description: '',
            analytics: true
          };
        }
      } catch (error) {
        console.error('Error generating Social Media QR code:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        alert(`Failed to generate QR code: ${errorMessage}`);
      } finally {
        this.isGenerating = false;
      }
    },
    
    extractHandle(url) {
      // Extract username/handle from URL
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const segments = pathname.split('/').filter(segment => segment);
        return segments[segments.length - 1] || '';
      } catch {
        return '';
      }
    },
    
    // Data fetching
    async fetchQRCodes() {
      this.isLoading = true;
      
      try {
        const response = await axios.get('/api/qr?type=social_media');
        
        if (response.data && Array.isArray(response.data)) {
          this.qrItems = response.data.map(item => ({
            ...item,
            platform_display: item.content?.platform ? 
              item.content.platform.charAt(0).toUpperCase() + item.content.platform.slice(1) : 
              'Social Media',
            platform: item.content?.platform || 'unknown',
            url: item.content?.url || '',
            handle: item.content?.handle || '',
            description: item.content?.description || item.title
          }));
        } else {
          this.qrItems = [];
        }
      } catch (error) {
        console.error('Error fetching QR codes:', error);
        this.qrItems = [];
        
        // Show user-friendly error message
        if (error.response?.status === 404) {
          // API endpoint not found - use mock data for development
          this.loadMockData();
        } else {
          alert('Failed to load QR codes. Please try again later.');
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    loadMockData() {
      // Mock data for development/testing
      this.qrItems = [
        {
          id: 'sm1',
          title: 'My Facebook Page',
          description: 'Follow our business on Facebook',
          platform: 'facebook',
          platform_display: 'Facebook',
          url: 'https://www.facebook.com/mybusiness',
          handle: 'mybusiness',
          qr_content: 'https://www.facebook.com/mybusiness',
          is_dynamic: true,
          analytics: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sm2',
          title: 'Instagram Profile',
          description: 'Check out my Instagram',
          platform: 'instagram',
          platform_display: 'Instagram',
          url: 'https://www.instagram.com/myprofile',
          handle: 'myprofile',
          qr_content: 'https://www.instagram.com/myprofile',
          is_dynamic: true,
          analytics: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    },
    
    // Selection methods
    toggleSelection(itemId) {
      const index = this.selectedItems.indexOf(itemId);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(itemId);
      }
    },
    
    isSelected(itemId) {
      return this.selectedItems.includes(itemId);
    },
    
    selectAll() {
      if (this.selectedItems.length === this.filteredQRItems.length) {
        this.selectedItems = [];
      } else {
        this.selectedItems = this.filteredQRItems.map(item => item.id);
      }
    },
    
    // Bulk actions
    async downloadSelected() {
      if (this.selectedItems.length === 0) {
        alert('Please select items to download.');
        return;
      }
      
      for (const itemId of this.selectedItems) {
        const item = this.qrItems.find(qr => qr.id === itemId);
        if (item) {
          await this.downloadQRCode(item);
        }
      }
    },
    
    async deleteSelected() {
      if (this.selectedItems.length === 0) {
        alert('Please select items to delete.');
        return;
      }
      
      const confirmed = confirm(`Are you sure you want to delete ${this.selectedItems.length} selected item(s)?`);
      if (confirmed) {
        try {
          for (const itemId of this.selectedItems) {
            await axios.delete(`/api/qr/${itemId}`);
          }
          
          this.qrItems = this.qrItems.filter(item => !this.selectedItems.includes(item.id));
          this.selectedItems = [];
          
          alert('Selected items deleted successfully.');
        } catch (error) {
          console.error('Error deleting selected items:', error);
          alert('Failed to delete some items. Please try again.');
        }
      }
    },
    
    // Individual actions
    async downloadQRCode(item) {
      try {
        const qrContent = item.qr_content || item.url;
        
        // Create QR code using qrcode library
        const QRCode = require('qrcode');
        const qrDataURL = await QRCode.toDataURL(qrContent, {
          width: 512,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        // Create download link
        const link = document.createElement('a');
        link.href = qrDataURL;
        link.download = `${item.title || item.platform}_QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading QR code:', error);
        alert('Failed to download QR code. Please try again.');
      }
    },
    
    deleteItem(itemId) {
      const item = this.qrItems.find(item => item.id === itemId);
      if (item) {
        this.itemToDelete = item;
        this.isDeletePopupOpen = true;
      }
    },
    
    async confirmDelete() {
      if (this.itemToDelete) {
        try {
          await axios.delete(`/api/qr/${this.itemToDelete.id}`);
          
          this.qrItems = this.qrItems.filter(item => item.id !== this.itemToDelete.id);
          
          // Remove from selected items if it was selected
          const selectedIndex = this.selectedItems.indexOf(this.itemToDelete.id);
          if (selectedIndex > -1) {
            this.selectedItems.splice(selectedIndex, 1);
          }
          
          alert('QR code deleted successfully.');
        } catch (error) {
          console.error('Error deleting QR code:', error);
          alert('Failed to delete QR code. Please try again.');
        }
      }
      this.isDeletePopupOpen = false;
      this.itemToDelete = null;
    },
    
    cancelDelete() {
      this.isDeletePopupOpen = false;
      this.itemToDelete = null;
    },
    
    editItem(item) {
      this.selectedQRItem = item;
      this.showEditPopup = true;
    },
    
    // Popup methods
    closeQRPopup() {
      this.showQRPopup = false;
      this.generatedQRData = null;
    },
    
    openAnalyticsPopup(item) {
      if (!item.analytics) {
        alert('Analytics is not enabled for this QR code.');
        return;
      }
      this.selectedQRItem = item;
      this.showAnalyticsPopup = true;
    },
    
    closeAnalyticsPopup() {
      this.showAnalyticsPopup = false;
      this.selectedQRItem = null;
    },
    
    closeEditPopup() {
      this.showEditPopup = false;
      this.selectedQRItem = null;
    },
    
    async handleQRUpdated(updatedQR) {
      // Update the item in the list
      const index = this.qrItems.findIndex(item => item.id === updatedQR.id);
      if (index > -1) {
        this.qrItems[index] = {
          ...this.qrItems[index],
          ...updatedQR,
          platform_display: updatedQR.content?.platform ? 
            updatedQR.content.platform.charAt(0).toUpperCase() + updatedQR.content.platform.slice(1) : 
            'Social Media',
          platform: updatedQR.content?.platform || 'unknown',
          url: updatedQR.content?.url || '',
          handle: updatedQR.content?.handle || '',
          description: updatedQR.content?.description || updatedQR.title
        };
      }
      
      this.closeEditPopup();
    },
    
    // Pagination
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    // Utility methods
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        });
      } catch {
        return 'Invalid Date';
      }
    }
  },
  
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    
    filterPlatform() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
/* Custom styles for better UX */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>