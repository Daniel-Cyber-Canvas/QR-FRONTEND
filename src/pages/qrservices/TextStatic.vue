
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

                        <!-- Text Static Form -->
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative ">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        Text QR Code - Static Mode
                                    </div>
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Text Content"
                                        placeholder="Hello World! This is a static text QR code." 
                                        v-model="formData.text" 
                                        type="textarea"
                                        rows="4"
                                        required 
                                    />
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate Text QR Code
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- QR Code Display Section -->
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-center justify-start w-[400px] relative shadow-sm">
                                <div class="text-sm font-medium text-gray-700 mb-2">
                                    QR Code Preview
                                </div>
                                <div class="w-full h-[300px] border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                    <span class="text-gray-500">QR Code will appear here</span>
                                </div>
                            </div>
                        </form>

                        <!-- QR Code Modal -->
                        <q-r-code-modal 
                            v-if="showQRCodeModal" 
                            :qr-content="qrCodeContent"
                            @close="showQRCodeModal = false"
                        />
                    </div>
                </div>
                </div>
                </div>
            </div>
        </side-navigation>
    </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "TextStatic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                text: ''
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generateTextQRCode();
        },

        async generateTextQRCode() {
            try {
                const title = `StaticTextQR`;
                
                const payload = {
                    type: "text",
                    title: title,
                    content: {
                        text: this.formData.text.trim()
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    // For static QR codes, use the text content directly
                    qrContent = response.data.qr_code || response.data.content;
                    
                    // If the content is an object, extract the text
                    if (typeof qrContent === 'object') {
                        qrContent = qrContent.text || this.formData.text.trim();
                    }
                    
                    // If it's still not a string or empty, use the form data
                    if (!qrContent || typeof qrContent !== 'string') {
                        qrContent = this.formData.text.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated Static Text QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Text QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        }
    }
}
</script>

<style scoped></style>