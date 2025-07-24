<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">Event QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Event Name"
                                        placeholder="My Event" 
                                        v-model="formData.event_name" 
                                        required 
                                    />
                                    
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Start Date & Time"
                                            placeholder="Select start date and time" 
                                            v-model="formData.start_date" 
                                            type="datetime-local"
                                            required 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="End Date & Time"
                                            placeholder="Select end date and time" 
                                            v-model="formData.end_date" 
                                            type="datetime-local"
                                            required 
                                        />
                                    </div>
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Location"
                                        placeholder="Event Location" 
                                        v-model="formData.location" 
                                        required 
                                    />
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Description"
                                        placeholder="Event Description" 
                                        v-model="formData.description" 
                                        type="textarea"
                                        rows="4"
                                        required 
                                    />
                                    
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
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                        >
                                            Generate Event QR Code
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
    name: "EventDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal
    },
    data() {
        return {
            formData: {
                event_name: '',
                start_date: '',
                end_date: '',
                location: '',
                description: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: ''
        };
    },
    methods: {
        async generateQRCode() {
            await this.generateEventQRCode();
        },
        
        async generateEventQRCode() {
            try {
                const title = `DynamicEventQR`;
                
                const payload = {
                    is_dynamic: true,
                    title: title,
                    content: {
                        name: this.formData.event_name.trim(),
                        date: this.formData.start_date,
                        end_date: this.formData.end_date,
                        location: this.formData.location.trim(),
                        description: this.formData.description.trim()
                    },
                    analytics: true,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (response.data.redirect_url) {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url) {
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else {
                        qrContent = response.data.qr_code;
                    }
                    
                    if (!qrContent || typeof qrContent === 'object') {
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to event format');
                        qrContent = this.generateEventString(this.formData);
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log('Generated Dynamic Event QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Event QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },

        generateEventString(data) {
            const startDate = new Date(data.date || data.start_date);
            const endDate = new Date(data.end_date);
            
            const fields = [
                'BEGIN:VEVENT',
                `SUMMARY:${data.name || data.event_name}`,
                `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
                `DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
                `LOCATION:${data.location}`,
                `DESCRIPTION:${data.description}`,
                'END:VEVENT'
            ].join('\n');

            return fields;
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
        }
    }
};
</script>