<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">PDF QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="QR Code Title"
                                        placeholder="My PDF Document" 
                                        v-model="formData.title" 
                                        required 
                                    />
                                    
                                    <div class="flex flex-col gap-2 w-full">
                                        <label class="text-sm font-medium text-gray-700">PDF File</label>
                                        <div class="relative">
                                            <input 
                                                type="file" 
                                                accept=".pdf"
                                                @change="handleFileSelect"
                                                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
                                                required
                                            >
                                            <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                                                <Icon name="ph:file-pdf" class="inline w-4 h-4 mr-1" />
                                                {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">Maximum file size: 10MB</p>
                                    </div>
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            checked
                                        >
                                        <label for="analytics" class="text-sm text-gray-700">Enable Analytics Tracking</label>
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
                                            <span v-else>Generate PDF QR Code</span>
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
    name: "PDFDynamic",
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
            isUploading: false,
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generatePDFQRCode();
        },
        
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (file.type !== 'application/pdf') {
                    alert('Please select a valid PDF file.');
                    return;
                }
                
                // Validate file size (10MB limit)
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (file.size > maxSize) {
                    alert('PDF file size must be less than 10MB.');
                    return;
                }
                
                this.selectedFile = file;
            }
        },
        
        async generatePDFQRCode() {
            if (!this.selectedFile) {
                alert('Please select a PDF file.');
                return;
            }

            this.isUploading = true;

            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('title', this.formData.title.trim());
                formData.append('is_dynamic', true);
                formData.append('analytics', this.formData.analytics);

                const response = await axios.post('/api/qr/pdf', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data) {
                    let qrContent;
                    
                    // For dynamic QR codes, use the redirect URL from backend
                    if (response.data.redirect_url) {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url) {
                        // Construct full URL from short_url identifier
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else {
                        qrContent = response.data.qr_code;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated Dynamic PDF QR:', qrContent);
                    console.log('Response data:', response.data);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating PDF QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate PDF QR code: ${errorMessage}`);
            } finally {
                this.isUploading = false;
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
        }
    }
};
</script>