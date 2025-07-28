<template>
    <div>
        <side-navigation>
            <div class="flex flex-col items-center justify-start self-stretch flex-1 relative">
                <div class="bg-white flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                    <div class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                    </div>
                    <div class="bg-white p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">

                        <!-- Virtual Card Dynamic Form -->
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        Virtual Card QR Code - Dynamic Mode
                                    </div>
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="First Name" 
                                            placeholder="John"
                                            v-model="formData.firstName" 
                                            required 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Last Name" 
                                            placeholder="Doe"
                                            v-model="formData.lastName" 
                                            required 
                                        />
                                    </div>
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Phone" 
                                            placeholder="+260 123 456 789"
                                            v-model="formData.phone" 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Phone2" 
                                            placeholder="+260 123 456 789"
                                            v-model="formData.phone2" 
                                        />
                                    </div>
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Email Address"
                                        placeholder="Andrew@aczambia.com" 
                                        v-model="formData.email" 
                                        type="email"
                                        required 
                                    />
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Company"
                                            placeholder="John Doe's Company" 
                                            v-model="formData.company" 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Job" 
                                            placeholder="CEO"
                                            v-model="formData.job" 
                                        />
                                    </div>
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Physical Address"
                                        placeholder="P.O Box 123" 
                                        v-model="formData.address" 
                                    />
                                    
                                    <!-- Analytics Option for Dynamic Mode -->
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                        >
                                        <label for="analytics" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate Virtual Card QR Code
                                        </button>
                                    </div>
                                </div>
                            </div>

                            
                        </form>

                        <!-- QR Code Modal -->
                        <q-r-code-modal 
                            v-if="showQRCodeModal" 
                            :qrCodeContent="qrCodeContent"
                            @close="showQRCodeModal = false"
                        />
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
    name: "VirtualCardDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                phone2: '',
                company: '',
                job: '',
                address: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generateVCardQRCode();
        },

        async generateVCardQRCode() {
            try {
                const title = `DynamicVCardQR`;
                
                const payload = {
                    is_dynamic: true,
                    title: title,
                    service: 'virtualcard',
                    content: {
                        firstName: this.formData.firstName.trim(),
                        lastName: this.formData.lastName.trim(),
                        name: `${this.formData.firstName.trim()} ${this.formData.lastName.trim()}`,
                        organization: this.formData.company.trim(),
                        company: this.formData.company.trim(),
                        title: this.formData.job.trim(),
                        job: this.formData.job.trim(),
                        phone: this.formData.phone.trim(),
                        phone2: this.formData.phone2.trim(),
                        email: this.formData.email.trim(),
                        address: this.formData.address.trim()
                    },
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
                        // Fallback: if backend doesn't provide redirect URL, use vCard format directly
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to vCard format');
                        qrContent = this.generateVCardString(this.formData);
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated Dynamic vCard QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating vCard QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },

        generateVCardString(data) {
            const fields = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${data.name || `${data.firstName} ${data.lastName}`}`,
                `N:${data.lastName || ''};${data.firstName || ''};;;`,
                data.phone && `TEL;TYPE=CELL:${data.phone}`,
                data.email && `EMAIL:${data.email}`,
                data.organization && `ORG:${data.organization}`,
                data.title && `TITLE:${data.title}`,
                data.address && `ADR;TYPE=WORK:;;${data.address};;;;`,
                'END:VCARD'
            ].filter(Boolean).join('\n');

            return fields;
        }
    }
}
</script>

<style scoped></style>