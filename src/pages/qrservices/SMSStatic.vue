<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <form @submit.prevent="generateSMSQRCode" class="w-full">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        SMS QR Code - Static Mode
                                    </div>
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Phone Number"
                                        placeholder="+1234567890" 
                                        v-model="formData.sms_phone" 
                                        type="tel"
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Message"
                                        placeholder="Hello from QR Code!" 
                                        v-model="formData.sms_message" 
                                        type="textarea"
                                        rows="4"
                                    />
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate SMS QR Code
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
    name: "SMSStatic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                sms_phone: '',
                sms_message: ''
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateSMSQRCode() {
            try {
                const payload = {
                    type: "sms",
                    title: "SMSQR",
                    content: {
                        phone: this.formData.sms_phone.trim(),
                        message: this.formData.sms_message.trim()
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    // For static QR codes, create SMS URL
                    const phone = this.formData.sms_phone.trim();
                    const message = this.formData.sms_message.trim();
                    
                    let qrContent = `sms:${phone}`;
                    if (message) {
                        qrContent += `?body=${encodeURIComponent(message)}`;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log('Generated Static SMS QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating SMS QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate SMS QR code: ${errorMessage}`);
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        }
    }
};
</script>