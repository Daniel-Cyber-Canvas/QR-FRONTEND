<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-[#ffffff] rounded-[3px] flex flex-col gap-0 items-start justify-start relative overflow-hidden w-[600px] max-h-[90vh] overflow-y-auto">
      <div class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[43px] relative">
        <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start">
          Edit {{ qrCodeType }} QR Code - {{ qrCode.id }}
        </div>
      </div>
      
      <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative p-4">


        <!-- PDF QR Code Edit Form (Check first) -->
        <div v-if="isPDFQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
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
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Current PDF File
            </label>
            <div class="bg-gray-50 rounded border border-gray-200 p-3 flex items-center gap-2 self-stretch">
              <Icon name="ph:file-pdf" class="w-5 h-5 text-red-500" />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">{{ currentPDFInfo.name }}</div>
                <div class="text-xs text-gray-500">{{ currentPDFInfo.size }}</div>
              </div>
            </div>
          </div>

          <!-- New PDF File Upload -->
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              PDF File
            </label>
            <div class="relative self-stretch">
              <input 
                type="file" 
                accept=".pdf"
                @change="handlePDFFileSelect"
                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
              >
              <div v-if="selectedPDFFile" class="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                <Icon name="ph:file-pdf" class="w-4 h-4 text-green-600" />
                <div class="flex-1">
                  <div class="text-sm font-medium text-green-700">{{ selectedPDFFile.name }}</div>
                  <div class="text-xs text-green-600">{{ (selectedPDFFile.size / 1024 / 1024).toFixed(2) }} MB</div>
                </div>
                <button 
                  @click="clearSelectedFile" 
                  class="text-green-600 hover:text-green-800"
                  type="button"
                >
                  <Icon name="ph:x" class="w-4 h-4" />
                </button>
              </div>
              <div v-else-if="!selectedPDFFile" class="mt-2 text-sm text-gray-600">
                <Icon name="ph:file-pdf" class="inline w-4 h-4 mr-1" />
                Select a new PDF file to replace the current one
              </div>
            </div>
            <p class="text-xs text-gray-500">Maximum file size: 10MB. Leave empty to keep current file.</p>
          </div>
        </div>

        <!-- Virtual Card QR Code Edit Form -->
        <div v-else-if="isVirtualCardQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative self-stretch mb-2">
            Virtual Card Information
          </div>
          
          <!-- Name Fields -->
          <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                First Name
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.firstName" 
                  placeholder="John"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Last Name
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.lastName" 
                  placeholder="Doe"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
          </div>

          <!-- Phone Fields -->
          <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Phone
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="tel" 
                  v-model="virtualCardData.phone" 
                  placeholder="+260 123 456 789"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Phone2
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="tel" 
                  v-model="virtualCardData.phone2" 
                  placeholder="+260 123 456 789"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
          </div>

          <!-- Email Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Email Address
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="email" 
                v-model="virtualCardData.email" 
                placeholder="Andrew@aczambia.com"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- Company and Job Fields -->
          <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Company
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.company" 
                  placeholder="John Doe's Company"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Job
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.job" 
                  placeholder="CEO"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
          </div>

          <!-- Address Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Physical Address
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="virtualCardData.address" 
                placeholder="P.O Box 123"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>
        </div>

        <!-- Website QR Code Edit Form -->
        <div v-else-if="isWebsiteQR" class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch">
            Website URL
          </div>
          <div class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start flex-1 relative">
              <input 
                type="url" 
                v-model="editableUrl" 
                placeholder="Eg. https://www.mywebsite.com/" 
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>
        </div>

        <!-- Fallback for other QR types -->
        <div v-else class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch">
            Content
          </div>
          <div class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start flex-1 relative">
              <input 
                type="text" 
                v-model="editableUrl" 
                placeholder="Enter content..." 
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>
        </div>
      </div>

      <div class="pr-3.5 pb-3 pl-3.5 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0 relative">
        <div class="flex flex-row gap-0 items-start justify-start shrink-0 relative">
          <div @click="$emit('close')" class="bg-[#e7eaee] rounded-sm pt-[7px] pr-[38px] pb-[7px] pl-[38px] flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer">
            <div class="text-[#424242] text-left font-['Roboto-Bold',_sans-serif] text-xs font-bold relative">
              Close
            </div>
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
      selectedPDFFile: null,
      currentPDFInfo: null
    };
  },
  computed: {
    // Check PDF first to prevent misclassification
    isPDFQR() {
      console.log('🔍 EditQRCodePopup - Checking if PDF QR for:', this.qrCode);
      
      // Enhanced PDF detection with more comprehensive checks
      const isPDF = 
        // Analytics type check
        this.qrCode.analytics?.type === 'PDF' ||
        // Direct content type check
        this.qrCode.content?.type === 'pdf' || 
        // Filename indicators
        this.qrCode.content?.filename || 
        this.qrCode.content?.file_name ||
        // File reference ID
        this.qrCode.content?.file_ref_id ||
        // Service type
        this.qrCode.service === 'pdf' ||
        // URL contains PDF
        (this.qrCode.redirect_url && this.qrCode.redirect_url.includes('.pdf')) ||
        // Original data checks
        (this.qrCode.originalData?.content?.type === 'pdf') ||
        (this.qrCode.originalData?.content?.filename) ||
        (this.qrCode.originalData?.content?.file_name) ||
        (this.qrCode.originalData?.content?.file_ref_id) ||
        // Check if originalData service is pdf
        (this.qrCode.originalData?.service === 'pdf') ||
        // Heuristic: has title and redirect_url but no website/virtual card indicators
        (this.qrCode.title && 
         this.qrCode.redirect_url && 
         !this.qrCode.content?.url && 
         !this.qrCode.content?.firstName &&
         !this.qrCode.originalData?.content?.url &&
         !this.qrCode.originalData?.content?.firstName) ||
        // Check if URL pattern suggests PDF QR (common pattern: /qr/scan/{id})
        (this.qrCode.redirect_url && this.qrCode.redirect_url.includes('/qr/scan/')) ||
        // Check if qrCodeValue suggests PDF QR
        (this.qrCode.qrCodeValue && this.qrCode.qrCodeValue.includes('/qr/scan/'));
      
      console.log('📄 EditQRCodePopup - Is PDF QR:', isPDF);
      console.log('📄 EditQRCodePopup - QR Code details:', {
        title: this.qrCode.title,
        redirect_url: this.qrCode.redirect_url,
        qrCodeValue: this.qrCode.qrCodeValue,
        content: this.qrCode.content,
        originalData: this.qrCode.originalData,
        service: this.qrCode.service,
        analytics: this.qrCode.analytics
      });
      
      return isPDF;
    },
    isVirtualCardQR() {
      // Don't classify as virtual card if it's already identified as PDF
      if (this.isPDFQR) return false;
      
      return this.qrCode.analytics?.type === 'Virtual Card' || 
             this.qrCode.originalData?.content?.firstName ||
             this.qrCode.originalData?.content?.name ||
             (this.qrCode.originalData?.content?.email && !this.qrCode.originalData?.content?.url);
    },
    isWebsiteQR() {
      // Don't classify as website if it's already identified as PDF or Virtual Card
      if (this.isPDFQR || this.isVirtualCardQR) return false;
      
      return this.qrCode.analytics?.type === 'Website' || 
             (this.qrCode.originalData?.content?.url && !this.qrCode.originalData?.content?.firstName);
    },
    qrCodeType() {
      if (this.isPDFQR) return 'PDF';
      if (this.isVirtualCardQR) return 'Virtual Card';
      if (this.isWebsiteQR) return 'Website';
      return 'QR';
    }
  },
  watch: {
    qrCode: {
      handler(newVal) {
        this.editableUrl = newVal.url;
        this.loadVirtualCardData();
        this.loadPDFData();
      },
      immediate: true
    }
  },
  mounted() {
    this.loadVirtualCardData();
    this.loadPDFData();
  },
  methods: {
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
      console.log('📄 EditQRCodePopup - Loading PDF data for:', this.qrCode);
      
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
        isVirtualCardQR: this.isVirtualCardQR,
        isPDFQR: this.isPDFQR,
        isWebsiteQR: this.isWebsiteQR,
        qrCodeType: this.qrCodeType
      });
      
      if (this.isVirtualCardQR) {
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
