<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">Business Page QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Business Name"
                                        placeholder="Brew & Bean Coffee" 
                                        v-model="formData.business_name" 
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Business Website URL"
                                        placeholder="https://brewandbean.com" 
                                        v-model="formData.business_url" 
                                        type="url"
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Description"
                                        placeholder="Visit our business page" 
                                        v-model="formData.business_description" 
                                        type="textarea"
                                        rows="3"
                                    />
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics-business" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            checked
                                        >
                                        <label for="analytics-business" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate Business Page QR Code
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
    name: "BusinessPageDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                business_name: '',
                business_url: '',
                business_description: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generateBusinessPageQRCode();
        },
        
        async generateBusinessPageQRCode() {
            try {
                const title = this.formData.business_name.trim() || 'BusinessPageQR';
                
                const payload = {
                    service: "business",
                    is_dynamic: true,
                    title: title,
                    description: this.formData.business_description.trim() || "Optional description",
                    content: {
                        name: this.formData.business_name.trim(),
                        description: this.formData.business_description.trim(),
                        url: this.formData.business_url.trim()
                    },
                    analytics: this.formData.analytics,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                console.log('📥 Backend response for business page:', response.data);
                console.log('📥 Response structure:', JSON.stringify(response.data, null, 2));
                
                if (response.data) {
                    let qrContent;
                    
                    // Check if redirect_url is actually a backend URL (not the business URL)
                const isBackendRedirectUrl = response.data.redirect_url && 
                    (response.data.redirect_url.includes(config.apiBaseUrl) || 
                     response.data.redirect_url.includes('/redirect/') ||
                     response.data.redirect_url.includes('/scan/'));
                
                if (isBackendRedirectUrl) {
                    console.log('✅ Using backend redirect_url:', response.data.redirect_url);
                    qrContent = response.data.redirect_url;
                } else if (response.data.short_url) {
                    console.log('✅ Constructing redirect URL from short_url:', response.data.short_url);
                    qrContent = `${config.apiBaseUrl}/redirect/${response.data.short_url}`;
                } else if (response.data.redirect_url && !isBackendRedirectUrl) {
                    console.warn('⚠️ redirect_url contains business URL instead of backend URL:', response.data.redirect_url);
                    console.error('❌ Backend configuration issue - redirect_url should point to backend, not business URL');
                    alert('Error: Backend configuration issue - redirect_url should be a backend URL for dynamic QR codes');
                    return;
                } else {
                    console.error('❌ Backend did not provide a proper redirect URL for dynamic QR code');
                    console.error('❌ Response data:', response.data);
                    alert('Error: Backend configuration issue - dynamic QR code requires a redirect URL');
                    return;
                }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('✅ Generated Business Page QR with redirect URL:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Business Page QR code:', error);
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