<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-[#ffffff] rounded-[3px] flex flex-col gap-0 items-start justify-start relative overflow-hidden w-[600px] max-h-[90vh] overflow-y-auto">
      <div class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[43px] relative">
        <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start">
          Edit {{ qrCodeType }} QR Code - {{ qrCode.id }}
        </div>
      </div>
      
      <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative p-4">

        <!-- App QR Code Edit Form -->
        <div v-if="isAppQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative self-stretch mb-2">
            App Information
          </div>
          
          <!-- App Name Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              App Name
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="appData.name" 
                placeholder="MyAwesome App"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- App Store URL Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              App Store URL
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="url" 
                v-model="appData.url" 
                placeholder="https://apps.apple.com/app/myawesome-app/id123456789"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- App Description Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Description
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <textarea 
                v-model="appData.description" 
                placeholder="Download our awesome app from the App Store"
                rows="3"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 border-none outline-none bg-transparent resize-none" 
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Image QR Code Edit Form -->
        <div v-if="isImageQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative self-stretch mb-2">
            Image Information
          </div>
          
          <!-- Title Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              QR Code Title
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="imageData.title" 
                placeholder="My Image"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- Current Image Info -->
          <div v-if="currentImageInfo" class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Current Image File
            </label>
            <div class="bg-gray-50 rounded border border-gray-200 p-3 flex items-center gap-2 self-stretch">
              <Icon name="ph:image" class="w-5 h-5 text-red-500" />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">{{ currentImageInfo.name }}</div>
                <div class="text-xs text-gray-500">{{ currentImageInfo.size }}</div>
              </div>
            </div>
          </div>

          <!-- New Image File Upload -->
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Image File
            </label>
            <div class="relative self-stretch">
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png,.gif"
                @change="handleImageFileSelect"
                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
              >
              <div v-if="selectedImageFile" class="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                <Icon name="ph:image" class="w-4 h-4 text-green-600" />
                <div class="flex-1">
                  <div class="text-sm font-medium text-green-700">{{ selectedImageFile.name }}</div>
                  <div class="text-xs text-green-600">{{ (selectedImageFile.size / 1024 / 1024).toFixed(2) }} MB</div>
                </div>
                <button 
                  @click="clearSelectedImageFile" 
                  class="text-green-600 hover:text-green-800"
                  type="button"
                >
                  <Icon name="ph:x" class="w-4 h-4" />
                </button>
              </div>
              <div v-else-if="!selectedImageFile" class="mt-2 text-sm text-gray-600">
                <Icon name="ph:image" class="inline w-4 h-4 mr-1" />
                Select a new image file to replace the current one
              </div>
            </div>
            <p class="text-xs text-gray-500">Supported formats: JPG, JPEG, PNG, GIF. Maximum file size: 5MB. Leave empty to keep current file.</p>
          </div>
        </div>

        <!-- Business Page QR Code Edit Form -->
        <div v-else-if="isBusinessPageQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative self-stretch mb-2">
            Business Page Information
          </div>
          
          <!-- Business Name Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Business Name
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="businessPageData.name" 
                placeholder="My Business"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- Business URL Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Business Website URL
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="url" 
                v-model="businessPageData.url" 
                placeholder="https://www.mybusiness.com"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- Business Description Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Business Description
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <textarea 
                v-model="businessPageData.description" 
                placeholder="Visit our business page"
                rows="3"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 border-none outline-none bg-transparent resize-none" 
              ></textarea>
            </div>
          </div>
        </div>

        <!-- PDF QR Code Edit Form (Check first) -->
        <div v-else-if="isPDFQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative self-stretch mb-2">
            PDF Document Information
          </div>
          
          <!-- Title Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              QR Code Title
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="pdfData.title" 
                placeholder="My PDF Document"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- Current PDF Info -->
          <div v-if="currentPDFInfo" class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Current PDF
            </div>
            <div class="bg-gray-50 rounded p-3 self-stretch">
              <div class="text-sm text-gray-600">{{ currentPDFInfo.filename }}</div>
              <div class="text-xs text-gray-500">{{ currentPDFInfo.size }}</div>
            </div>
          </div>
          
          <!-- New PDF Upload -->
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Upload New PDF (Optional)
            </div>
            <input 
              type="file" 
              accept=".pdf"
              @change="handlePDFFileSelect"
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
            />
            <div v-if="selectedPDFFile" class="text-sm text-green-600">
              New file selected: {{ selectedPDFFile.name }}
            </div>
          </div>
        </div>

        <!-- 2D Barcode QR Code Edit Form -->
        <div v-if="isBarcodeQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Barcode Title
            </div>
            <input 
              v-model="barcodeData.title" 
              type="text" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter barcode title"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Barcode Data
            </div>
            <textarea 
              v-model="barcodeData.data" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 relative overflow-hidden resize-none"
              rows="4"
              placeholder="Enter barcode data"
            ></textarea>
          </div>
        </div>

        <!-- Virtual Card QR Code Edit Form -->
        <div v-if="isVirtualCardQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              First Name
            </div>
            <input 
              v-model="virtualCardData.firstName" 
              type="text" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter first name"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Last Name
            </div>
            <input 
              v-model="virtualCardData.lastName" 
              type="text" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter last name"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Phone
            </div>
            <input 
              v-model="virtualCardData.phone" 
              type="tel" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter phone number"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Email
            </div>
            <input 
              v-model="virtualCardData.email" 
              type="email" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter email address"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Company
            </div>
            <input 
              v-model="virtualCardData.company" 
              type="text" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter company name"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Job Title
            </div>
            <input 
              v-model="virtualCardData.job" 
              type="text" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter job title"
            />
          </div>
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Address
            </div>
            <input 
              v-model="virtualCardData.address" 
              type="text" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter address"
            />
          </div>
        </div>

        <!-- Website QR Code Edit Form -->
        <div v-if="isWebsiteQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative">
              Website URL
            </div>
            <input 
              v-model="editableUrl" 
              type="url" 
              class="bg-[#ffffff] rounded border-solid border-[#d1d5db] border pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 h-10 relative overflow-hidden"
              placeholder="Enter website URL"
            />
          </div>
        </div>

        <div class="flex flex-row gap-0 items-start justify-start shrink-0 relative">
          <div @click="save" class="bg-[#0c768a] rounded-sm pt-[7px] pr-3 pb-[7px] pl-3 flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer">
            <div class="text-[#ffffff] text-left font-['Roboto-Bold',_sans-serif] text-xs font-bold relative">
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'EditQRCodePopup',
  components: {
    Icon
  },
  props: {
    qrCode: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editableUrl: this.qrCode.url,
      eventData: {
        name: '',
        start_date: '',
        end_date: '',
        location: '',
        description: ''
      },
      virtualCardData: {
        firstName: '',
        lastName: '',
        phone: '',
        phone2: '',
        email: '',
        company: '',
        job: '',
        address: ''
      },
      pdfData: {
        title: ''
      },
      businessPageData: {
        name: '',
        url: '',
        description: ''
      },
      imageData: {
        title: ''
      },
      appData: {
        name: '',
        url: '',
        description: ''
      },
      barcodeData: {
        title: '',
        data: ''
      },
      selectedPDFFile: null,
      currentPDFInfo: null,
      selectedImageFile: null,
      currentImageInfo: null
    };
  },
  computed: {
    // Check Event QR codes first
    isEventQR() {
      console.log('📅 EditQRCodePopup - Checking if Event QR for:', this.qrCode);
      
      const isEvent = 
        // Direct type check for Event QR codes
        this.qrCode.type === 'event' ||
        // Analytics type check
        this.qrCode.analytics?.type === 'Event' ||
        // Service type check for EventDynamic.vue created events
        this.qrCode.service === 'event' ||
        this.qrCode.originalData?.service === 'event' ||
        // Check if it's a dynamic QR with event service
        (this.qrCode.type === 'dynamic' && this.qrCode.service === 'event') ||
        (this.qrCode.originalData?.type === 'dynamic' && this.qrCode.originalData?.service === 'event') ||
        // Content structure check (has name, start_date, end_date, location, description for event)
        (this.qrCode.content?.name && this.qrCode.content?.start_date && this.qrCode.content?.end_date && 
         this.qrCode.content?.location && this.qrCode.content?.description) ||
        (this.qrCode.originalData?.content?.name && this.qrCode.originalData?.content?.start_date && 
         this.qrCode.originalData?.content?.end_date && this.qrCode.originalData?.content?.location && 
         this.qrCode.originalData?.content?.description);
      
      console.log('📅 EditQRCodePopup - Is Event QR:', isEvent);
      return isEvent;
    },
    // Check App QR codes second
    isAppQR() {
      // Don't classify as app if it's already identified as Event
      if (this.isEventQR) return false;
      
      console.log('📱 EditQRCodePopup - Checking if App QR for:', this.qrCode);
      
      const isApp = 
        // Direct type check for FormQR.vue created apps
        this.qrCode.type === 'app' ||
        // Analytics type check
        this.qrCode.analytics?.type === 'App' ||
        // Service type check for AppDynamic.vue created apps
        this.qrCode.service === 'app' ||
        this.qrCode.originalData?.service === 'app' ||
        // Check if it's a dynamic QR with app service
        (this.qrCode.type === 'dynamic' && this.qrCode.service === 'app') ||
        (this.qrCode.originalData?.type === 'dynamic' && this.qrCode.originalData?.service === 'app') ||
        // Content structure check (has name, url, description for app)
        (this.qrCode.content?.name && this.qrCode.content?.url && this.qrCode.content?.description && 
         !this.qrCode.content?.firstName && !this.qrCode.content?.filename) ||
        (this.qrCode.originalData?.content?.name && this.qrCode.originalData?.content?.url && 
         this.qrCode.originalData?.content?.description && !this.qrCode.originalData?.content?.firstName && 
         !this.qrCode.originalData?.content?.filename);
      
      console.log('📱 EditQRCodePopup - Is App QR:', isApp);
      return isApp;
    },
    // Check Business Page third
    isBusinessPageQR() {
      // Don't classify as business page if it's already identified as Event or App
      if (this.isEventQR || this.isAppQR) return false;
      
      console.log('🏢 EditQRCodePopup - Checking if Business Page QR for:', this.qrCode);
      
      const isBusinessPage = 
        // Analytics type check
        this.qrCode.analytics?.type === 'Business Page' ||
        // Service type
        this.qrCode.service === 'business' ||
        this.qrCode.originalData?.service === 'business' ||
        // Content structure check (has name, url but not description like app)
        (this.qrCode.content?.name && this.qrCode.content?.url && !this.qrCode.content?.description) ||
        (this.qrCode.originalData?.content?.name && this.qrCode.originalData?.content?.url && 
         !this.qrCode.originalData?.content?.description);
      
      console.log('🏢 EditQRCodePopup - Is Business Page QR:', isBusinessPage);
      return isBusinessPage;
    },
    // Check 2D Barcode QR codes
    isBarcodeQR() {
      // Don't classify as barcode if it's already identified as Event, App or Business Page
      if (this.isEventQR || this.isAppQR || this.isBusinessPageQR) return false;
      
      console.log('📊 EditQRCodePopup - Checking if Barcode QR for:', this.qrCode);
      
      // Check for explicit barcode service
      if (this.qrCode.service === 'barcode') return true;
      if (this.qrCode.content?.service === 'barcode') return true;
      if (this.qrCode.analytics?.type === '2D Barcode') return true;
      if (this.qrCode.originalData?.type === 'barcode') return true;
      if (this.qrCode.originalData?.service === 'barcode') return true;
      //
      // Check for barcode-specific structure: must have 'data' field AND be explicitly barcode
      // Exclude PDF QR codes that might have 'data' fields
      const hasData = this.qrCode.content?.data || this.qrCode.originalData?.content?.data;
      const isPDFService = this.qrCode.service === 'pdf' || 
                      this.qrCode.content?.service === 'pdf' ||
                      this.qrCode.originalData?.content?.service === 'pdf' ||
                      this.qrCode.content?.type === 'pdf' ||
                      this.qrCode.originalData?.content?.type === 'pdf' ||
                      this.qrCode.content?.filename ||
                      this.qrCode.originalData?.content?.filename ||
                      this.qrCode.content?.file_ref_id ||
                      this.qrCode.originalData?.content?.file_ref_id;
      
      // Only consider it a barcode if it has data field AND is not a PDF
      const isBarcode = hasData && !isPDFService;
      
      console.log('📊 EditQRCodePopup - Is Barcode QR:', isBarcode);
      return isBarcode;
    },
    // Check Image QR codes - MUST be checked AFTER PDF to prevent conflicts
    isImageQR() {
      // Don't classify as image if it's already identified as Event, App, Business Page, or Barcode
      if (this.isEventQR || this.isAppQR || this.isBusinessPageQR || this.isBarcodeQR) return false;
      
      console.log('🖼️ EditQRCodePopup - Checking if Image QR for:', this.qrCode);
      
      const isImage = 
        // Direct type check
        this.qrCode.type === 'image' ||
        // Content type check - EXPLICIT image type
        this.qrCode.content?.type === 'image' ||
        // Analytics type check
        this.qrCode.analytics?.type === 'Image' ||
        // Original data checks - EXPLICIT image type
        (this.qrCode.originalData?.type === 'image') ||
        (this.qrCode.originalData?.content?.type === 'image');
      
      // EXCLUDE if it's explicitly a PDF or Barcode
      const isPDF = this.qrCode.service === 'pdf' ||
                   this.qrCode.content?.type === 'pdf' ||
                   this.qrCode.analytics?.type === 'PDF' ||
                   this.qrCode.originalData?.service === 'pdf' ||
                   this.qrCode.originalData?.content?.type === 'pdf' ||
                   (this.qrCode.redirect_url && this.qrCode.redirect_url.includes('.pdf'));
      
      const isBarcode = this.qrCode.service === 'barcode' ||
                       this.qrCode.analytics?.type === '2D Barcode' ||
                       this.qrCode.originalData?.service === 'barcode';
      
      const finalResult = isImage && !isPDF && !isBarcode;
      console.log('🖼️ EditQRCodePopup - Is Image QR:', finalResult, '(isImage:', isImage, ', isPDF:', isPDF, ', isBarcode:', isBarcode, ')');
      return finalResult;
    },
    // Check PDF - now with explicit exclusion of images and barcodes
    isPDFQR() {
      // Don't classify as PDF if it's already identified as Event, App, Business Page, Barcode, or Image
      if (this.isEventQR || this.isAppQR || this.isBusinessPageQR || this.isBarcodeQR || this.isImageQR) return false;
      
      console.log('🔍 EditQRCodePopup - Checking if PDF QR for:', this.qrCode);
      
      // STRICT PDF detection - must be explicitly PDF
      const isPDF = 
        // Analytics type check (most reliable)
        this.qrCode.analytics?.type === 'PDF' ||
        // Direct content type check
        this.qrCode.content?.type === 'pdf' || 
        // Service type (reliable indicator)
        this.qrCode.service === 'pdf' ||
        // URL contains PDF extension
        (this.qrCode.redirect_url && this.qrCode.redirect_url.includes('.pdf')) ||
        // Original data checks - same reliable indicators
        (this.qrCode.originalData?.content?.type === 'pdf') ||
        (this.qrCode.originalData?.service === 'pdf');
      
      // EXCLUDE if it's explicitly an image or barcode
      const isImage = this.qrCode.content?.type === 'image' ||
                     this.qrCode.analytics?.type === 'Image' ||
                     this.qrCode.type === 'image' ||
                     this.qrCode.originalData?.content?.type === 'image' ||
                     this.qrCode.originalData?.type === 'image';
      
      const isBarcode = this.qrCode.service === 'barcode' ||
                       this.qrCode.analytics?.type === '2D Barcode' ||
                       this.qrCode.originalData?.service === 'barcode' ||
                       // Check for barcode data fields
                       (this.qrCode.content?.data !== undefined) ||
                       (this.qrCode.content?.barcode_data !== undefined) ||
                       (this.qrCode.originalData?.content?.data !== undefined) ||
                       (this.qrCode.originalData?.content?.barcode_data !== undefined);
      
      const finalResult = isPDF && !isImage && !isBarcode;
      console.log('📄 EditQRCodePopup - Is PDF QR:', finalResult, '(isPDF:', isPDF, ', isImage:', isImage, ', isBarcode:', isBarcode, ')');
      return finalResult;
    },
    isVirtualCardQR() {
      // Don't classify as virtual card if it's already identified as Event, App, Business Page, Barcode, Image, or PDF
      if (this.isEventQR || this.isAppQR || this.isBusinessPageQR || this.isBarcodeQR || this.isImageQR || this.isPDFQR) return false;
      
      return this.qrCode.analytics?.type === 'Virtual Card' || 
             this.qrCode.originalData?.content?.firstName ||
             this.qrCode.originalData?.content?.name ||
             (this.qrCode.originalData?.content?.email && !this.qrCode.originalData?.content?.url);
    },
    isWebsiteQR() {
      // Don't classify as website if it's already identified as Event, App, Business Page, Barcode, Image, PDF or Virtual Card
      if (this.isEventQR || this.isAppQR || this.isBusinessPageQR || this.isBarcodeQR || this.isImageQR || this.isPDFQR || this.isVirtualCardQR) return false;
      
      return this.qrCode.analytics?.type === 'Website' || 
             (this.qrCode.originalData?.content?.url && !this.qrCode.originalData?.content?.firstName);
    },
    qrCodeType() {
      if (this.isEventQR) return 'Event';
      if (this.isAppQR) return 'App';
      if (this.isBusinessPageQR) return 'Business Page';
      if (this.isBarcodeQR) return '2D Barcode';
      if (this.isImageQR) return 'Image';
      if (this.isPDFQR) return 'PDF';
      if (this.isVirtualCardQR) return 'Virtual Card';
      if (this.isWebsiteQR) return 'Website';
      return 'Unknown';
    }
  },
  watch: {
    qrCode: {
      handler(newVal) {
        this.editableUrl = newVal.url;
        this.loadVirtualCardData();
        this.loadPDFData();
        this.loadBusinessPageData();
        this.loadImageData();
        this.loadAppData();
        this.loadBarcodeData();
      },
      immediate: true
    }
  },
  mounted() {
    this.loadVirtualCardData();
    this.loadPDFData();
    this.loadBusinessPageData();
    this.loadImageData();
    this.loadAppData();
    this.loadBarcodeData();
  },
  methods: {
    loadAppData() {
      if (this.qrCode.originalData?.content) {
        const content = this.qrCode.originalData.content;
        if (typeof content === 'string') {
          try {
            const parsedContent = JSON.parse(content);
            this.appData.name = parsedContent.name || '';
            this.appData.url = parsedContent.url || '';
            this.appData.description = parsedContent.description || '';
          } catch (e) {
            console.warn('Failed to parse app content:', e);
          }
        } else if (typeof content === 'object') {
          this.appData.name = content.name || '';
          this.appData.url = content.url || '';
          this.appData.description = content.description || '';
        }
      }
    },

    loadBusinessPageData() {
      if (this.isBusinessPageQR && this.qrCode.originalData?.content) {
        const content = this.qrCode.originalData.content;
        if (typeof content === 'string') {
          try {
            const parsedContent = JSON.parse(content);
            this.businessPageData.name = parsedContent.name || '';
            this.businessPageData.url = parsedContent.url || '';
            this.businessPageData.description = parsedContent.description || '';
          } catch (e) {
            console.warn('Failed to parse business page content:', e);
          }
        } else if (typeof content === 'object') {
          this.businessPageData.name = content.name || '';
          this.businessPageData.url = content.url || '';
          this.businessPageData.description = content.description || '';
        }
      }
    },

    loadImageData() {
      if (this.isImageQR) {
        // Try to get content from different possible locations
        const content = this.qrCode.content || this.qrCode.originalData?.content || {};
        const title = content.title || this.qrCode.title || '';
        
        this.imageData = {
          title: title
        };
        
        // Set current image info for display
        const fileName = content.filename || content.file_name || title || 'Image File';
        const fileSize = content.file_size ? `${(content.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
        
        this.currentImageInfo = {
          name: fileName,
          size: fileSize
        };
        
        console.log('🖼️ EditQRCodePopup - Loaded Image data:', {
          imageData: this.imageData,
          currentImageInfo: this.currentImageInfo
        });
      } else {
        console.log('🖼️ EditQRCodePopup - Not an Image QR, skipping image data load');
      }
    },

    loadBarcodeData() {
      if (this.qrCode.originalData?.content) {
        const content = this.qrCode.originalData.content;
        if (typeof content === 'string') {
          try {
            const parsedContent = JSON.parse(content);
            this.barcodeData.title = parsedContent.title || this.qrCode.originalData.title || '';
            this.barcodeData.data = parsedContent.data || parsedContent.barcode_data || '';
          } catch (e) {
            console.warn('Failed to parse barcode content:', e);
            this.barcodeData.title = this.qrCode.originalData.title || '';
            this.barcodeData.data = content;
          }
        } else if (typeof content === 'object') {
          this.barcodeData.title = content.title || this.qrCode.originalData.title || '';
          this.barcodeData.data = content.data || content.barcode_data || '';
        }
      } else {
        this.barcodeData.title = this.qrCode.originalData?.title || '';
        this.barcodeData.data = this.qrCode.url || '';
      }
    },

    loadVirtualCardData() {
      if (this.isVirtualCardQR && this.qrCode.originalData?.content) {
        const content = this.qrCode.originalData.content;
        this.virtualCardData = {
          firstName: content.firstName || '',
          lastName: content.lastName || '',
          phone: content.phone || '',
          phone2: content.phone2 || '',
          email: content.email || '',
          company: content.company || content.organization || '',
          job: content.job || content.title || '',
          address: content.address || ''
        };
      }
    },
    loadPDFData() {
      if (this.isPDFQR) {
        // Try to get content from different possible locations
        const content = this.qrCode.content || this.qrCode.originalData?.content || {};
        const title = content.title || this.qrCode.title || '';
        
        this.pdfData = {
          title: title
        };
        
        // Set current PDF info for display
        const fileName = content.filename || content.file_name || title || 'PDF Document';
        const fileSize = content.file_size ? `${(content.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
        
        this.currentPDFInfo = {
          name: fileName,
          size: fileSize
        };
        
        console.log('📄 EditQRCodePopup - Loaded PDF data:', {
          pdfData: this.pdfData,
          currentPDFInfo: this.currentPDFInfo
        });
      } else {
        console.log('📄 EditQRCodePopup - Not a PDF QR, skipping PDF data load');
      }
    },
    handleImageFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          alert('Please select a valid image file (JPG, JPEG, PNG, GIF).');
          event.target.value = '';
          return;
        }
        
        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          alert('Image file size must be less than 5MB.');
          event.target.value = '';
          return;
        }
        
        this.selectedImageFile = file;
        console.log('🖼️ EditQRCodePopup - Image file selected:', file.name, `${(file.size / 1024 / 1024).toFixed(2)} MB`);
      }
    },
    clearSelectedImageFile() {
      this.selectedImageFile = null;
      // Clear the file input
      const fileInput = this.$el.querySelector('input[type="file"][accept*="image"]');
      if (fileInput) {
        fileInput.value = '';
      }
      console.log('🖼️ EditQRCodePopup - Image file selection cleared');
    },
    handlePDFFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (file.type !== 'application/pdf') {
          alert('Please select a valid PDF file.');
          event.target.value = ''; // Clear the input
          return;
        }
        
        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          alert('PDF file size must be less than 10MB.');
          event.target.value = ''; // Clear the input
          return;
        }
        
        this.selectedPDFFile = file;
        console.log('📄 EditQRCodePopup - PDF file selected:', file.name, `${(file.size / 1024 / 1024).toFixed(2)} MB`);
      }
    },
    clearSelectedFile() {
      this.selectedPDFFile = null;
      // Clear the file input
      const fileInput = this.$el.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      console.log('📄 EditQRCodePopup - PDF file selection cleared');
    },
    save() {
      console.log('🔄 EditQRCodePopup - Save method called');
      console.log('🔄 EditQRCodePopup - QR Code Type Detection:', {
        isAppQR: this.isAppQR,
        isBusinessPageQR: this.isBusinessPageQR,
        isBarcodeQR: this.isBarcodeQR,
        isImageQR: this.isImageQR,
        isVirtualCardQR: this.isVirtualCardQR,
        isPDFQR: this.isPDFQR,
        isWebsiteQR: this.isWebsiteQR,
        qrCodeType: this.qrCodeType
      });
      
      if (this.isAppQR) {
        console.log('📱 EditQRCodePopup - Processing App save');
        // For app QR codes, emit the app data
        this.$emit('save', {
          ...this.qrCode,
          content: {
            name: this.appData.name.trim(),
            url: this.appData.url.trim(),
            description: this.appData.description.trim()
          }
        });
      } else if (this.isBusinessPageQR) {
        console.log('🏢 EditQRCodePopup - Processing Business Page save');
        // For business pages, emit the business page data
        this.$emit('save', {
          ...this.qrCode,
          content: {
            name: this.businessPageData.name.trim(),
            url: this.businessPageData.url.trim(),
            description: this.businessPageData.description.trim()
          }
        });
      } else if (this.isBarcodeQR) {
        console.log('📊 EditQRCodePopup - Processing Barcode save');
        console.log('📊 EditQRCodePopup - Barcode Data:', this.barcodeData);
        
        // For barcode QR codes, emit the barcode data
        this.$emit('save', {
          ...this.qrCode,
          title: this.barcodeData.title.trim(),
          content: {
            service: 'barcode',
            title: this.barcodeData.title.trim(),
            data: this.barcodeData.data.trim()
          }
        });
      } else if (this.isImageQR) {
        console.log('🖼️ EditQRCodePopup - Processing Image save');
        console.log('🖼️ EditQRCodePopup - Image Data:', this.imageData);
        console.log('🖼️ EditQRCodePopup - Selected File:', this.selectedImageFile);
        
        // For Image QR codes, emit the image data with optional new file
        const updateData = {
          ...this.qrCode,
          title: this.imageData.title.trim(),
          content: {
            ...this.qrCode.originalData?.content,
            title: this.imageData.title.trim()
          }
        };
        
        // If a new file was selected, include it
        if (this.selectedImageFile) {
          updateData.newFile = this.selectedImageFile;
          console.log('🖼️ EditQRCodePopup - Saving with new image file:', this.selectedImageFile.name);
        } else {
          console.log('🖼️ EditQRCodePopup - Saving without new image file (keeping existing)');
        }
        
        console.log('🖼️ EditQRCodePopup - Emitting save event with data:', updateData);
        this.$emit('save', updateData);
      } else if (this.isVirtualCardQR) {
        console.log('💳 EditQRCodePopup - Processing Virtual Card save');
        // For virtual cards, emit the virtual card data
        this.$emit('save', {
          ...this.qrCode,
          content: {
            ...this.qrCode.originalData.content,
            firstName: this.virtualCardData.firstName.trim(),
            lastName: this.virtualCardData.lastName.trim(),
            name: `${this.virtualCardData.firstName.trim()} ${this.virtualCardData.lastName.trim()}`.trim(),
            phone: this.virtualCardData.phone.trim(),
            phone2: this.virtualCardData.phone2.trim(),
            email: this.virtualCardData.email.trim(),
            company: this.virtualCardData.company.trim(),
            organization: this.virtualCardData.company.trim(),
            job: this.virtualCardData.job.trim(),
            title: this.virtualCardData.job.trim(),
            address: this.virtualCardData.address.trim()
          }
        });
      } else if (this.isPDFQR) {
        console.log('📄 EditQRCodePopup - Processing PDF save');
        console.log('📄 EditQRCodePopup - PDF Data:', this.pdfData);
        console.log('📄 EditQRCodePopup - Selected File:', this.selectedPDFFile);
        
        // For PDF QR codes, emit the PDF data with optional new file
        const updateData = {
          ...this.qrCode,
          title: this.pdfData.title.trim(),
          content: {
            ...this.qrCode.originalData?.content,
            title: this.pdfData.title.trim()
          }
        };
        
        // If a new file was selected, include it
        if (this.selectedPDFFile) {
          updateData.newFile = this.selectedPDFFile;
          console.log('📄 EditQRCodePopup - Saving with new PDF file:', this.selectedPDFFile.name);
        } else {
          console.log('📄 EditQRCodePopup - Saving without new PDF file (keeping existing)');
        }
        
        console.log('📄 EditQRCodePopup - Emitting save event with data:', updateData);
        this.$emit('save', updateData);
      } else {
        console.log('🌐 EditQRCodePopup - Processing Website/Other save');
        // For websites and other types, emit the URL
        this.$emit('save', {
          ...this.qrCode,
          url: this.editableUrl,
        });
      }
    },
  },
};
</script>
