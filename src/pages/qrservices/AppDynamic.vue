<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">App QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="App Name"
                                        placeholder="MyAwesome App" 
                                        v-model="formData.app_name" 
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="App Store URL"
                                        placeholder="https://apps.apple.com/app/myawesome-app/id123456789" 
                                        v-model="formData.app_url" 
                                        type="url"
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Description"
                                        placeholder="Get our app from the App Store" 
                                        v-model="formData.app_description" 
                                        type="textarea"
                                        rows="3"
                                    />
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics-app" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            checked
                                        >
                                        <label for="analytics-app" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate App QR Code
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
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "AppDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                app_name: '',
                app_url: '',
                app_description: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generateAppQRCode();
        },
        
        async generateAppQRCode() {
            try {
                const title = 'AppQR';
                
                const payload = {
                    type: "app",
                    title: title,
                    content: {
                        name: this.formData.app_name.trim(),
                        url: this.formData.app_url.trim(),
                        description: this.formData.app_description.trim()
                    },
                    is_dynamic: true, // App QR codes are always dynamic
                    analytics: this.formData.analytics,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
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
                    
                    // If backend doesn't provide proper URL, create a fallback
                    if (!qrContent || typeof qrContent === 'object') {
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to app URL');
                        qrContent = this.formData.app_url.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated App QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating App QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
        }
    }
};
</script>