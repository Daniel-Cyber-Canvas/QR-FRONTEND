<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <form @submit.prevent="generateWiFiQRCode" class="w-full">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        Wi-Fi QR Code - Static Mode
                                    </div>
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Network Name (SSID)"
                                        placeholder="MyWiFiNetwork" 
                                        v-model="formData.wifi_ssid" 
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Password"
                                        placeholder="mypassword123" 
                                        v-model="formData.wifi_password" 
                                        type="password"
                                    />
                                    
                                    <div class="flex flex-col gap-2">
                                        <label class="text-sm font-medium text-gray-700">Security Type</label>
                                        <select 
                                            v-model="formData.wifi_security" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c768a] focus:border-transparent"
                                        >
                                            <option value="WPA2">WPA2</option>
                                            <option value="WPA">WPA</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">No Password</option>
                                        </select>
                                    </div>
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="hidden-network" 
                                            v-model="formData.wifi_hidden"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                        >
                                        <label for="hidden-network" class="text-sm text-gray-700">Hidden Network</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate WiFi QR Code
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
    name: "WiFiStatic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                wifi_ssid: '',
                wifi_password: '',
                wifi_security: 'WPA2',
                wifi_hidden: false
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateWiFiQRCode() {
            try {
                const payload = {
                    type: "wifi",
                    title: "WiFiQR",
                    content: {
                        ssid: this.formData.wifi_ssid.trim(),
                        password: this.formData.wifi_password.trim(),
                        security: this.formData.wifi_security,
                        hidden: this.formData.wifi_hidden
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    // For static QR codes, create WiFi string
                    const ssid = this.formData.wifi_ssid.trim();
                    const password = this.formData.wifi_password.trim();
                    const security = this.formData.wifi_security;
                    const hidden = this.formData.wifi_hidden;
                    
                    let qrContent = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log('Generated Static WiFi QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating WiFi QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate WiFi QR code: ${errorMessage}`);
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        }
    }
};
</script>