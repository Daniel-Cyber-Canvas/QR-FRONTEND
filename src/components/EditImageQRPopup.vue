<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-[#ffffff] rounded-[3px] flex flex-col gap-0 items-start justify-start relative overflow-hidden w-[600px] max-h-[90vh] overflow-y-auto">
      <div class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[43px] relative">
        <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start">
          Edit Image QR Code - {{ qrCode.id }}
        </div>
      </div>
      
      <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative p-4">
        <!-- Image QR Code Edit Form -->
        <div class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
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

          <!-- Current Image File -->
          <div v-if="currentImageInfo" class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Current Image File
            </label>
            <div class="bg-gray-50 rounded border border-gray-200 p-3 flex items-center gap-2 self-stretch">
              <Icon name="ph:image" class="w-5 h-5 text-blue-500" />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-700">{{ currentImageInfo.filename }}</div>
                <div class="text-xs text-gray-500">{{ currentImageInfo.size }}</div>
              </div>
            </div>
          </div>

          <!-- New Image File Upload -->
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Upload New Image (Optional)
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
              <div v-if="selectedImageFile && imagePreviewUrl" class="mt-2">
                <img 
                  :src="imagePreviewUrl" 
                  alt="New image preview" 
                  class="max-w-32 max-h-32 object-cover rounded border"
                >
              </div>
              <div v-else-if="!selectedImageFile" class="mt-2 text-sm text-gray-600">
                <Icon name="ph:image" class="inline w-4 h-4 mr-1" />
                No new file chosen
              </div>
            </div>
            <p class="text-xs text-gray-500">Supported formats: JPG, JPEG, PNG, GIF. Maximum file size: 5MB</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-row gap-3 items-center justify-end self-stretch shrink-0 relative mt-6 pt-4 border-t border-gray-200">
          <button 
            @click="$emit('close')" 
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
          >
            Cancel
          </button>
          <button 
            @click="saveChanges" 
            :disabled="isSaving"
            class="bg-[#0c768a] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving" class="flex items-center gap-2">
              <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'EditImageQRPopup',
  components: {
    Icon
  },
  props: {
    qrCode: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageData: {
        title: ''
      },
      selectedImageFile: null,
      imagePreviewUrl: null,
      currentImageInfo: null,
      currentImageUrl: null,
      isSaving: false
    };
  },
  created() {
    // Initialize data immediately when component is created
    this.initializeImageData();
  },
  mounted() {
    this.initializeImageData();
  },
  beforeUnmount() {
    // Clean up preview URL
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  },
  methods: {
    initializeImageData() {
      console.log('🔧 EditImageQRPopup - Initializing image data:', this.qrCode);
      
      // Extract title from various possible locations with priority order
      const content = this.qrCode.originalData?.content || this.qrCode.content || {};
      
      // Priority: content.title > originalData.title > qrCode.title > displayName > fallback
      this.imageData.title = content.title || 
                            this.qrCode.originalData?.title || 
                            this.qrCode.title ||
                            this.qrCode.displayName ||
                            'Untitled Image';

      // Extract current image info with better fallbacks
      const filename = content.filename || 
                      content.file_name || 
                      content.name ||
                      this.qrCode.originalData?.filename ||
                      this.qrCode.filename ||
                      'Unknown filename';

      const fileSize = content.file_size || 
                      content.size ||
                      this.qrCode.originalData?.file_size ||
                      'Unknown size';

      this.currentImageInfo = {
        filename: filename,
        size: typeof fileSize === 'number' ? `${(fileSize / 1024 / 1024).toFixed(2)} MB` : fileSize
      };

      this.currentImageUrl = content.url || 
                            content.image_url ||
                            this.qrCode.url;
      
      console.log('🔧 EditImageQRPopup - Initialized title:', this.imageData.title);
      console.log('🔧 EditImageQRPopup - Current image info:', this.currentImageInfo);
    },

    handleImageFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          alert('Please select a valid image file (JPG, JPEG, PNG, or GIF).');
          return;
        }
        
        // Validate file size (5MB limit for images)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          alert('Image file size must be less than 5MB.');
          return;
        }
        
        this.selectedImageFile = file;
        
        // Create preview URL
        if (this.imagePreviewUrl) {
          URL.revokeObjectURL(this.imagePreviewUrl);
        }
        this.imagePreviewUrl = URL.createObjectURL(file);
        
        console.log('🖼️ EditImageQRPopup - Image file selected:', file.name, `${(file.size / 1024 / 1024).toFixed(2)} MB`);
      }
    },

    clearSelectedImageFile() {
      this.selectedImageFile = null;
      if (this.imagePreviewUrl) {
        URL.revokeObjectURL(this.imagePreviewUrl);
        this.imagePreviewUrl = null;
      }
      console.log('🖼️ EditImageQRPopup - Image file selection cleared');
    },

    handleImageError() {
      console.warn('🖼️ EditImageQRPopup - Failed to load current image:', this.currentImageUrl);
    },

    saveChanges() {
      this.isSaving = true;
      
      console.log('💾 EditImageQRPopup - Save changes called');
      console.log('💾 EditImageQRPopup - Title:', this.imageData.title);
      console.log('💾 EditImageQRPopup - Selected file:', this.selectedImageFile);
      
      try {
        // Prepare the update data to emit to parent
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
          console.log('💾 EditImageQRPopup - Including new file in update data');
        }
        
        console.log('💾 EditImageQRPopup - Emitting save event with data:', updateData);
        
        // Emit save event to parent component (ImagesDynamic.vue)
        this.$emit('save', updateData);
        
      } catch (error) {
        console.error('❌ EditImageQRPopup - Error preparing save data:', error);
        alert('Failed to prepare update data. Please try again.');
      } finally {
        this.isSaving = false;
      }
    }
  },
  emits: ['close', 'save']
};
</script>