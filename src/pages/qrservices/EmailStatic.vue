
<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
              <div
                class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div
                    class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div
                    class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">
            <!-- Main content container with max width -->
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative max-w-none w-full">
                <!-- Form Section -->
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <form @submit.prevent="generateEmailQRCode" class="w-full">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        Email QR Code - Static Mode
                                    </div>
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Recipient Email"
                                        placeholder="john@example.com" 
                                        v-model="formData.email_recipient" 
                                        type="email"
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Subject"
                                        placeholder="Hello from QR Code" 
                                        v-model="formData.email_subject" 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Message"
                                        placeholder="This email was sent via QR code" 
                                        v-model="formData.email_body" 
                                        type="textarea"
                                        rows="4"
                                    />
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate Email QR Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    </div>
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
    name: "EmailStatic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                email_recipient: '',
                email_subject: '',
                email_body: ''
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateEmailQRCode() {
            try {
                const payload = {
                    type: "email",
                    title: "EmailQR",
                    content: {
                        recipient: this.formData.email_recipient.trim(),
                        subject: this.formData.email_subject.trim(),
                        body: this.formData.email_body.trim()
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    // For static QR codes, create mailto URL
                    const recipient = this.formData.email_recipient.trim();
                    const subject = this.formData.email_subject.trim();
                    const body = this.formData.email_body.trim();
                    
                    let qrContent = `mailto:${recipient}`;
                    const params = [];
                    
                    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
                    if (body) params.push(`body=${encodeURIComponent(body)}`);
                    
                    if (params.length > 0) {
                        qrContent += `?${params.join('&')}`;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log('Generated Static Email QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Email QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Email QR code: ${errorMessage}`);
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        }
    }
};
</script>