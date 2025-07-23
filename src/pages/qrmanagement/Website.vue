<template>
  <div>
    <side-navigation>
          <div
                class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div
                    class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div
            class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden min-w-0">
      <div
        class="flex flex-col gap-[11px] items-start justify-center flex-1 relative w-full min-w-0"
      >
        <div
          class="bg-[#ffffff] border-solid border-[#E2E8F0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-2.5 items-center justify-start w-full shrink-0 relative min-w-0"
        >
          <div
            class="flex flex-row gap-[11px] items-center justify-start w-full shrink-0 relative"
          >
            <div
              class="pt-[5px] pr-2.5 pb-[5px] flex flex-row gap-2.5 items-center justify-center shrink-0 relative"
            >
              <div
                class="text-[#000000] text-left font-['Roboto-Bold',_sans-serif] text-base font-bold relative"
              >
                Website
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-col gap-2.5 items-start justify-center shrink-0 w-full relative min-w-0"
        >
          <div
            class="flex flex-row gap-2 items-start justify-start self-stretch shrink-0 relative"
          >
            <div
              class="flex flex-col gap-0 items-start justify-center flex-1 relative"
            >
              <div
                class="flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative"
              >
                <div
                  class="text-neutral-800 text-left font-['Roboto-SemiBold',_sans-serif] text-xl font-semibold relative flex-1 overflow-hidden"
                  style="text-overflow: ellipsis; white-space: nowrap"
                >
                  Website Information
                </div>
              </div>
              <div
                class="flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative"
              >
                <div
                  class="text-[#64748b] text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative flex-1 overflow-hidden"
                  style="text-overflow: ellipsis; white-space: nowrap"
                >
                  Input the URL this QR will redirect to.
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative"
          >
            <div
              class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative"
            >
              <div
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch h-5 overflow-hidden"
                style="text-overflow: ellipsis"
              >
                Website URL
              </div>
              <div
                class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative"
              >
                <input
                  v-model="websiteUrl"
                  type="url"
                  placeholder="Eg. https://www.mywebsite.com/"
                  class="rounded border-solid border-neutral-200 border p-2 flex-1 text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal focus:outline-none focus:border-[#0c768a] focus:ring-1 focus:ring-[#0c768a]"
                />
                <Button text="Generate QR Code" @click="generateQRCode" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bulk Actions -->
        <div
          v-if="selectedItems.length > 0"
          class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-4 flex flex-row gap-3 items-center justify-between w-full shrink-0 relative"
        >
          <div class="flex flex-row gap-3 items-center">
            <Button 
              :text="selectedItems.length === qrItems.length ? 'Deselect All' : 'Select All'"
              @click="selectAll"
              class="bg-gray-100 text-gray-700 border-gray-300"
            />
            <span class="text-sm text-gray-600">
              {{ selectedItems.length }} of {{ qrItems.length }} selected
            </span>
          </div>
          <div class="flex flex-row gap-3 items-center">
            <Button 
              text="Delete Selected"
              @click="deleteSelected"
              class="bg-red-500 text-white border-red-500"
            />
          </div>
        </div>
        
        <!-- No Items Message -->
        <div
          v-if="qrItems.length === 0"
          class="bg-[#ffffff] border-solid border-[#e2e8f0] border p-8 flex flex-col items-center justify-center w-full shrink-0 relative"
        >
          <div class="text-gray-500 text-center">
            <div class="text-lg font-medium mb-2">No QR codes found</div>
            <div class="text-sm">Create your first QR code using the form above.</div>
          </div>
        </div>
        
        <!-- QR Items List -->
        <div
          v-for="item in qrItems"
          :key="item.id"
          class="bg-[#ffffff] border-solid border-[#e2e8f0] border flex flex-col gap-0 items-start justify-start w-full shrink-0 relative"
        >
          <div
            class="flex flex-row items-center justify-between w-full shrink-0 relative"
          >
            <div
              class="flex flex-row gap-0 items-center justify-start flex-1 relative"
            >
              <div
                class="border-solid border-gray-200 border-b pt-4 pr-6 pb-4 pl-6 flex flex-row gap-3 items-center justify-start shrink-0 relative"
              >
                <div
                  class="flex flex-row gap-0 items-center justify-center shrink-0 relative"
                >
                  <input
                    type="checkbox"
                    :checked="isSelected(item.id)"
                    @change="toggleSelection(item.id)"
                    class="w-5 h-5 text-[#0c768a] bg-white border-gray-300 rounded focus:ring-[#0c768a] focus:ring-2"
                  />
                </div>
                <qrcode-vue 
                  :value="item.url"
                  :size="77"
                  level="M"
                  render-as="svg"
                  background="white"
                  foreground="black"
                  class="shrink-0 w-[77px] h-[77px] relative"
                />
                <div
                  class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative"
                >
                  <div
                    class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative"
                  >
                    {{ item.type }}
                  </div>
                  <div
                    class="text-gray-900 text-left font-['Roboto-Medium',_sans-serif] text-sm leading-5 font-medium relative"
                  >
                    {{ item.code }}
                  </div>
                  <div
                    class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative"
                  >
                    <div
                      class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative"
                    >
                      {{ item.date }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pt-4 pr-6 pb-4 pl-6 flex flex-col gap-0 items-start justify-center shrink-0 h-[72px] relative"
              >
                <div
                  class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative"
                >
                  <div
                    class="text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative"
                  >
                    {{ item.label || item.type }}
                  </div>
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#0c768a] text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative cursor-pointer hover:underline"
                  >
                    {{ item.url }}
                  </a>
                  <div
                    class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative"
                  >
                    <div
                      class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative"
                    >
                      Modified: {{ item.modified }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex flex-row gap-[5px] items-center justify-end shrink-0 flex-1 relative"
            >
              <Button text="Analytics" variant="outline" @click="openAnalyticsPopup(item)" />
              <div
                class="p-4 flex flex-row gap-1 items-center justify-start shrink-0 w-[116px] h-[72px] relative"
              >
                <div
                  class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative"
                >
                  <div
                    class="rounded-lg p-2.5 flex flex-row gap-2 items-center justify-center shrink-0 relative overflow-hidden cursor-pointer hover:bg-red-50"
                    @click="deleteItem(item.id)"
                  >
                  <Icon icon="mingcute:delete-line" width="24" height="24" color="#667085" />
                </div>
                </div>
                <div
                  class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative"
                >
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
        :websiteUrl="websiteUrl" 
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
    
    <!-- Delete Confirmation Popup -->
    <DeleteConfirmationPopup 
      :isVisible="isDeletePopupOpen"
      :itemType="itemToDelete?.type || 'QR Code'"
      :itemCode="itemToDelete?.code || ''"
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
  },
  name: "WebsiteQR",
  data() {
    return {
      websiteUrl: '',
      showQRPopup: false,
      showAnalyticsPopup: false,
      selectedQRItem: null,
      selectedItems: [],
      isDeletePopupOpen: false,
      itemToDelete: null,
      qrItems: [
        {
          id: 'website',
          type: 'Website',
          code: 'QR-2025-1',
          date: 'Mar 09,2023',
          url: 'http://localhost:5173/qr-form?type=Website&mode=dynamic',
          modified: '02 Aug 13,2023'
        },
        {
          id: 'mobileapp',
          type: 'Mobile App',
          code: 'QR-2025-2',
          date: 'Mar 10,2023',
          url: 'http://localhost:5173/qr-form?type=MobileApp&mode=dynamic',
          modified: '03 Aug 14,2023',
          label: 'App Store'
        },
        {
          id: 'email',
          type: 'Email Campaign',
          code: 'QR-2025-3',
          date: 'Mar 11,2023',
          url: 'http://localhost:5173/qr-form?type=EmailCampaign&mode=dynamic',
          modified: '04 Aug 15,2023',
          label: 'Email'
        },
        {
          id: 'social',
          type: 'Social Media',
          code: 'QR-2025-4',
          date: 'Mar 12,2023',
          url: 'http://localhost:5173/qr-form?type=SocialMedia&mode=dynamic',
          modified: '05 Aug 16,2023',
          label: 'Social'
        }
      ]
    };
  },
  methods: {
     generateQRCode() {
       if (this.websiteUrl.trim()) {
         this.showQRPopup = true;
       } else {
         alert('Please enter a website URL before generating QR code.');
       }
     },
    closeQRPopup() {
      this.showQRPopup = false;
    },
    openAnalyticsPopup(item) {
      this.selectedQRItem = item;
      this.showAnalyticsPopup = true;
    },
    closeAnalyticsPopup() {
      this.showAnalyticsPopup = false;
      this.selectedQRItem = null;
    },
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
      if (this.selectedItems.length === this.qrItems.length) {
        this.selectedItems = [];
      } else {
        this.selectedItems = this.qrItems.map(item => item.id);
      }
    },
    deleteSelected() {
      if (this.selectedItems.length > 0) {
        const confirmed = confirm(`Are you sure you want to delete ${this.selectedItems.length} selected item(s)?`);
        if (confirmed) {
          this.qrItems = this.qrItems.filter(item => !this.selectedItems.includes(item.id));
          this.selectedItems = [];
        }
      } else {
        alert('Please select items to delete.');
      }
    },
    deleteItem(itemId) {
      const item = this.qrItems.find(item => item.id === itemId);
      if (item) {
        this.itemToDelete = item;
        this.isDeletePopupOpen = true;
      }
    },
    confirmDelete() {
      if (this.itemToDelete) {
        this.qrItems = this.qrItems.filter(item => item.id !== this.itemToDelete.id);
        // Remove from selected items if it was selected
        const selectedIndex = this.selectedItems.indexOf(this.itemToDelete.id);
        if (selectedIndex > -1) {
          this.selectedItems.splice(selectedIndex, 1);
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
      // For now, we'll populate the URL field with the item's URL for editing
      // In a real application, you might want to open an edit modal or navigate to an edit page
      this.websiteUrl = item.url;
      
      // Scroll to the top to show the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Optional: Show a message to indicate edit mode
      alert(`Editing "${item.type}" (${item.code}). The URL has been loaded into the form above.`);
    }
  },
};
</script>

<style scoped></style>
