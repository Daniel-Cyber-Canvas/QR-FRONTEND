<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">Image QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="QR Code Title"
                                        placeholder="My Image" 
                                        v-model="formData.title" 
                                        required 
                                    />
                                    
                                    <div class="flex flex-col gap-2 w-full">
                                        <label class="text-sm font-medium text-gray-700">Image File</label>
                                        <div class="relative">
                                            <input 
                                                type="file" 
                                                accept=".jpg,.jpeg,.png,.gif"
                                                @change="handleImageFileSelect"
                                                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
                                                required
                                            >
                                            <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                                                <Icon name="ph:image" class="inline w-4 h-4 mr-1" />
                                                {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
                                            </div>
                                            <div v-if="selectedFile && isImageFile(selectedFile)" class="mt-2">
                                                <img 
                                                    :src="imagePreviewUrl" 
                                                    alt="Image preview" 
                                                    class="max-w-32 max-h-32 object-cover rounded border"
                                                >
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">Supported formats: JPG, JPEG, PNG, GIF. Maximum file size: 5MB</p>
                                    </div>
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics-image" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            checked
                                        >
                                        <label for="analytics-image" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            :disabled="isUploading"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span v-if="isUploading" class="flex items-center gap-2">
                                                <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </span>
                                            <span v-else>Generate Image QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </side-navigation>
        <QRCodeModal
            v-if="showQRCodeModal" 
            :qr-code-content="qrCodeContent" 
            @close="closeQRCodeModal" 
        />
    </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
import { Icon } from '@iconify/vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "ImagesDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal,
        Icon
    },
    data() {
        return {
            formData: {
                title: '',
                analytics: true
            },
            selectedFile: null,
            imagePreviewUrl: null,
            isUploading: false,
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generateImageQRCode();
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
                
                this.selectedFile = file;
                
                // Create preview URL
                if (this.imagePreviewUrl) {
                    URL.revokeObjectURL(this.imagePreviewUrl);
                }
                this.imagePreviewUrl = URL.createObjectURL(file);
            }
        },

        isImageFile(file) {
            return file && file.type.startsWith('image/');
        },

        async generateImageQRCode() {
            if (!this.selectedFile) {
                alert('Please select an image file.');
                return;
            }

            this.isUploading = true;

            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('title', this.formData.title.trim());
                formData.append('is_dynamic', true);
                formData.append('analytics', this.formData.analytics);

                const response = await axios.post('/api/qr/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('Full Image QR Response:', response.data);

                if (response.data) {
                    let qrContent;
                    
                    // For dynamic QR codes, check the actual response structure
                    if (response.data.redirect_url && typeof response.data.redirect_url === 'string') {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url && typeof response.data.short_url === 'string') {
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else if (response.data.image_url && typeof response.data.image_url === 'string') {
                        // Backend returns image_url for dynamic images
                        qrContent = response.data.image_url;
                    } else if (response.data.qr_code && typeof response.data.qr_code === 'object' && response.data.qr_code.url) {
                        // Check if qr_code object contains a URL
                        qrContent = response.data.qr_code.url;
                    } else if (response.data.qr_code && typeof response.data.qr_code === 'string') {
                        qrContent = response.data.qr_code;
                    } else if (response.data.file_reference && typeof response.data.file_reference === 'object' && response.data.file_reference.url) {
                        // Check if file_reference object contains a URL
                        qrContent = response.data.file_reference.url;
                    } else {
                        console.error('Dynamic Image QR: No valid URL found in response:', response.data);
                        console.error('Available fields:', Object.keys(response.data));
                        alert('Error: Backend did not return a valid URL for dynamic image QR code. Check console for details.');
                        return;
                    }
                    
                    // Final validation
                    if (!qrContent || typeof qrContent !== 'string' || qrContent.trim() === '') {
                        console.error('Image QR: Final content validation failed:', qrContent);
                        alert('Error: Invalid QR code content received from backend');
                        return;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log('Generated Dynamic Image QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Image QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Image QR code: ${errorMessage}`);
            } finally {
                this.isUploading = false;
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
        }
    },
    beforeUnmount() {
        // Clean up image preview URL to prevent memory leaks
        if (this.imagePreviewUrl) {
            URL.revokeObjectURL(this.imagePreviewUrl);
        }
    }
};
</script>