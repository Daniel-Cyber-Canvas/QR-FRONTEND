<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    @click.self="$emit('close')"
  >
    <div class="bg-[#ffffff] rounded-[3px] flex flex-col gap-0 items-start justify-start relative overflow-hidden w-[600px] max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-center justify-between self-stretch shrink-0 h-[43px] relative">
        <div class="flex items-center gap-2">
          <Icon :icon="getPlatformIcon(qrCode?.platform)" class="w-5 h-5" />
          <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start">
            Edit {{ qrCode?.platform_display || 'Social Media' }} QR Code
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon icon="ph:x" class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative p-6">
        <form @submit.prevent="updateQRCode" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          
          <!-- QR Code Preview -->
          <div class="flex flex-col gap-2 items-center justify-center self-stretch shrink-0 relative bg-gray-50 p-4 rounded">
            <div class="text-sm font-medium text-gray-700 mb-2">Current QR Code</div>
            <qrcode-vue 
              :value="qrCode?.qr_content || qrCode?.url || ''"
              :size="120"
              level="M"
              render-as="svg"
              background="white"
              foreground="black"
              class="border border-gray-200 rounded"
            />
            <div class="text-xs text-gray-500 text-center mt-2">
              ID: {{ qrCode?.id }}
            </div>
          </div>

          <!-- Platform Selection -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Social Media Platform
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <select 
                v-model="formData.platform" 
                @change="onPlatformChange"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent"
                required
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
                <option value="reddit">Reddit</option>
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>

          <!-- Title Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              QR Code Title
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="formData.title" 
                placeholder="My Social Media Profile"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                required
              />
            </div>
          </div>

          <!-- Description Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Description
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <textarea 
                v-model="formData.description" 
                placeholder="Follow me on social media"
                rows="2"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 border-none outline-none bg-transparent resize-none" 
                required
              ></textarea>
            </div>
          </div>

          <!-- Profile URL Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Profile URL
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="url" 
                v-model="formData.url" 
                :placeholder="getUrlPlaceholder()"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                required
              />
            </div>
          </div>

          <!-- Username/Handle Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Username/Handle
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="formData.handle" 
                :placeholder="getHandlePlaceholder()"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                required
              />
            </div>
          </div>

          <!-- Analytics Option -->
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="analytics" 
                v-model="formData.analytics"
                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
              >
              <label for="analytics" class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Enable Analytics Tracking
              </label>
            </div>
            <div class="text-xs text-gray-500">
              Track scans, locations, and device information for this QR code
            </div>
          </div>

          <!-- Active Status -->
          <div class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="active" 
                v-model="formData.active"
                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
              >
              <label for="active" class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                QR Code Active
              </label>
            </div>
            <div class="text-xs text-gray-500">
              Inactive QR codes will show an error message when scanned
            </div>
          </div>

          <!-- QR Code Information -->
          <div class="bg-gray-50 rounded p-3 self-stretch">
            <div class="text-sm font-medium text-gray-700 mb-2">QR Code Information</div>
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span class="font-medium">Created:</span> {{ formatDate(qrCode?.created_at) }}
              </div>
              <div>
                <span class="font-medium">Modified:</span> {{ formatDate(qrCode?.updated_at) }}
              </div>
              <div>
                <span class="font-medium">Type:</span> {{ qrCode?.is_dynamic ? 'Dynamic' : 'Static' }}
              </div>
              <div>
                <span class="font-medium">Scans:</span> {{ qrCode?.scan_count || 0 }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-row gap-3 items-center justify-end self-stretch shrink-0 relative pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-100 text-gray-700 rounded px-4 py-2 hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="previewQRCode"
              class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
            >
              Preview
            </button>
            <button
              type="submit"
              :disabled="isUpdating"
              class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
            >
              <span v-if="isUpdating" class="flex items-center gap-2">
                <Icon icon="ph:spinner" class="w-4 h-4 animate-spin" />
                Updating...
              </span>
              <span v-else>Update QR Code</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Preview Modal -->
    <div 
      v-if="showPreview" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60"
      @click.self="closePreview"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">QR Code Preview</h3>
          <button @click="closePreview" class="text-gray-500 hover:text-gray-700">
            <Icon icon="ph:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="flex flex-col items-center gap-4">
          <qrcode-vue 
            :value="previewContent"
            :size="200"
            level="M"
            render-as="svg"
            background="white"
            foreground="black"
            class="border border-gray-200 rounded"
          />
          
          <div class="text-center">
            <div class="font-medium text-gray-800">{{ formData.title }}</div>
            <div class="text-sm text-gray-600">{{ formData.description }}</div>
            <div class="text-xs text-blue-600 mt-2 break-all">{{ formData.url }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import QrcodeVue from 'qrcode.vue';
import axios from '@/axios.js';

export default {
  name: "SocialMediaEditPopup",
  components: {
    Icon,
    QrcodeVue
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    qrCode: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'updated'],
  data() {
    return {
      formData: {
        platform: '',
        title: '',
        description: '',
        url: '',
        handle: '',
        analytics: true,
        active: true
      },
      isUpdating: false,
      showPreview: false,
      previewContent: ''
    };
  },
  watch: {
    qrCode: {
      handler(newQRCode) {
        if (newQRCode && newQRCode.id) {
          this.initializeFormData();
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initializeFormData() {
      if (!this.qrCode || !this.qrCode.id) return;
      
      const content = this.qrCode.content || {};
      
      this.formData = {
        platform: content.platform || this.qrCode.platform || '',
        title: this.qrCode.title || content.title || '',
        description: content.description || this.qrCode.description || '',
        url: content.url || this.qrCode.url || '',
        handle: content.handle || this.qrCode.handle || '',
        analytics: this.qrCode.analytics !== undefined ? this.qrCode.analytics : true,
        active: this.qrCode.active !== undefined ? this.qrCode.active : true
      };
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
        pinterest: 'ph:pinterest-logo',
        reddit: 'ph:reddit-logo',
        discord: 'ph:discord-logo',
        telegram: 'ph:telegram-logo',
        whatsapp: 'ph:whatsapp-logo'
      };
      return icons[platform] || 'ph:chat-circle-text';
    },
    
    getUrlPlaceholder() {
      const placeholders = {
        facebook: 'https://www.facebook.com/username',
        instagram: 'https://www.instagram.com/username',
        twitter: 'https://twitter.com/username',
        linkedin: 'https://www.linkedin.com/in/username',
        tiktok: 'https://www.tiktok.com/@username',
        youtube: 'https://www.youtube.com/c/channelname',
        snapchat: 'https://www.snapchat.com/add/username',
        pinterest: 'https://www.pinterest.com/username',
        reddit: 'https://www.reddit.com/user/username',
        discord: 'https://discord.gg/serverinvite',
        telegram: 'https://t.me/username',
        whatsapp: 'https://wa.me/1234567890'
      };
      return placeholders[this.formData.platform] || 'https://example.com/profile';
    },
    
    getHandlePlaceholder() {
      const placeholders = {
        facebook: 'username',
        instagram: 'username',
        twitter: '@username',
        linkedin: 'username',
        tiktok: '@username',
        youtube: 'channelname',
        snapchat: 'username',
        pinterest: 'username',
        reddit: 'username',
        discord: 'username#1234',
        telegram: '@username',
        whatsapp: '+1234567890'
      };
      return placeholders[this.formData.platform] || 'username';
    },
    
    onPlatformChange() {
      // Update placeholders and potentially clear URL if platform changed significantly
      if (this.formData.platform) {
        const platformName = this.formData.platform.charAt(0).toUpperCase() + this.formData.platform.slice(1);
        
        // Only update title if it's still the default or empty
        if (!this.formData.title || this.formData.title.includes('Social Media')) {
          this.formData.title = `My ${platformName} Profile`;
        }
        
        // Only update description if it's still the default or empty
        if (!this.formData.description || this.formData.description.includes('social media')) {
          this.formData.description = `Follow me on ${platformName}`;
        }
      }
    },
    
    previewQRCode() {
      this.previewContent = this.formData.url;
      this.showPreview = true;
    },
    
    closePreview() {
      this.showPreview = false;
      this.previewContent = '';
    },
    
    async updateQRCode() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isUpdating = true;
      
      try {
        const payload = {
          title: this.formData.title.trim(),
          content: {
            platform: this.formData.platform,
            url: this.formData.url.trim(),
            title: this.formData.title.trim(),
            description: this.formData.description.trim(),
            handle: this.formData.handle.trim()
          },
          analytics: this.formData.analytics,
          active: this.formData.active
        };

        const response = await axios.put(`/api/qr/${this.qrCode.id}`, payload);
        
        if (response.data) {
          this.$emit('updated', response.data);
          alert('QR code updated successfully!');
        } else {
          throw new Error('No data received from server');
        }
      } catch (error) {
        console.error('Error updating Social Media QR code:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        alert(`Failed to update QR code: ${errorMessage}`);
      } finally {
        this.isUpdating = false;
      }
    },
    
    validateForm() {
      if (!this.formData.platform) {
        alert('Please select a social media platform.');
        return false;
      }
      
      if (!this.formData.title.trim()) {
        alert('Please enter a title for the QR code.');
        return false;
      }
      
      if (!this.formData.url.trim()) {
        alert('Please enter a profile URL.');
        return false;
      }
      
      if (!this.formData.description.trim()) {
        alert('Please enter a description.');
        return false;
      }
      
      // Validate URL format
      try {
        new URL(this.formData.url);
      } catch {
        alert('Please enter a valid URL.');
        return false;
      }
      
      return true;
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return 'Invalid Date';
      }
    }
  }
};
</script>

<style scoped>
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

/* Additional styles for better UX */
.transition-colors {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Custom scrollbar for better appearance */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Form input focus styles */
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(12, 118, 138, 0.1);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Platform icon styling */
.platform-icon {
  transition: transform 0.2s ease;
}

.platform-icon:hover {
  transform: scale(1.1);
}

/* QR code preview styling */
.qr-preview {
  transition: transform 0.3s ease;
}

.qr-preview:hover {
  transform: scale(1.05);
}

/* Modal backdrop blur effect */
.modal-backdrop {
  backdrop-filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .button-group button {
    width: 100%;
  }
}

/* Loading state styles */
.loading-overlay {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
}

/* Success/Error message styles */
.success-message {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Platform-specific color accents */
.platform-facebook { accent-color: #1877f2; }
.platform-instagram { accent-color: #e4405f; }
.platform-twitter { accent-color: #1da1f2; }
.platform-linkedin { accent-color: #0077b5; }
.platform-tiktok { accent-color: #000000; }
.platform-youtube { accent-color: #ff0000; }
.platform-snapchat { accent-color: #fffc00; }
.platform-pinterest { accent-color: #bd081c; }
.platform-reddit { accent-color: #ff4500; }
.platform-discord { accent-color: #5865f2; }
.platform-telegram { accent-color: #0088cc; }
.platform-whatsapp { accent-color: #25d366; }
</style>