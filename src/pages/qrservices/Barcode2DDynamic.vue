<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <form @submit.prevent="generate2DBarcodeQRCode" class="w-full">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        2D Barcode - Dynamic Mode
                                    </div>
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Title"
                                        placeholder="My Data Matrix" 
                                        v-model="formData.barcode_title" 
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Data"
                                        placeholder="Hello World 123" 
                                        v-model="formData.barcode_data" 
                                        type="textarea"
                                        rows="4"
                                        required 
                                    />
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics-barcode" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                        >
                                        <label for="analytics-barcode" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate 2D Barcode
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
    name: "Barcode2DDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                barcode_title: '',
                barcode_data: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generate2DBarcodeQRCode() {
            try {
                const payload = {
                    title: this.formData.barcode_title.trim(),
                    data: this.formData.barcode_data.trim(),
                    is_dynamic: true,
                    analytics: this.formData.analytics
                };

                const response = await axios.post('/api/qr/barcode', payload);
                
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
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to barcode data');
                        qrContent = this.formData.barcode_data.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log('Generated Dynamic 2D Barcode QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating 2D Barcode QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate 2D Barcode QR code: ${errorMessage}`);
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        }
    }
};
</script>