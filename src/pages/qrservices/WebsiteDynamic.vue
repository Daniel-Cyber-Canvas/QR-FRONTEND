<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
            <div
                class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div
                    class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div
                    class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start w-full flex-1 relative overflow-hidden ">
                    <div class="flex flex-col gap-[11px] items-start justify-center w-full flex-1 relative">
                        <div
                            class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 relative">
                            <div
                                class="flex flex-row gap-[11px] items-center justify-start self-stretch shrink-0 relative">
                                <div
                                    class="pt-[5px] pr-2.5 pb-[5px] flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <Icon icon="mdi:web" class="w-6 h-6 text-gray-500" />
                                    <div
                                        class="text-[#000000] text-left font-['Roboto-Bold',_sans-serif] text-base font-bold relative">
                                        Website
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div
                            class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-col gap-2.5 items-start justify-center shrink-0 w-full max-w-none relative">
                            <div class="flex flex-row gap-2 items-start justify-start self-stretch shrink-0 relative">

                                <div class="flex flex-col gap-1 items-start justify-center flex-1 relative">
                                    <div
                                        class="flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative">
                                        <div class="text-neutral-800 text-left font-['Roboto-SemiBold',_sans-serif] text-xl font-semibold relative flex-1 overflow-hidden"
                                            style="text-overflow: ellipsis; white-space: nowrap">
                                            Website Information
                                        </div>
                                    </div>
                                    <div
                                        class="flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative">
                                        <div class="text-[#64748b] text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative flex-1 overflow-hidden"
                                            style="text-overflow: ellipsis; white-space: nowrap">
                                            Input the URL this QR will redirect to.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
                                <div
                                    class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch h-5 overflow-hidden"
                                        style="text-overflow: ellipsis">
                                        Website URL
                                    </div>
                                    <div
                                        class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
                                        <div
                                            class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start flex-1 relative">
                                            <input type="url" v-model="formData.website_url"
                                                placeholder="Eg. https://www.mywebsite.com/"
                                                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent"
                                                required />
                                        </div>
                                        <button @click="generateWebsiteQRCode" type="button"
                                            class="bg-[#0c768a] rounded-[3px] border-solid border-[transparent] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden hover:bg-opacity-90 transition-colors duration-300 cursor-pointer">
                                            <div
                                                class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-start justify-start shrink-0 relative">
                                                <div
                                                    class="text-[#ffffff] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    Generate QR Code
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <!-- Analytics Checkbox -->
                                    <div class="flex items-center gap-2 mt-3">
                                        <input type="checkbox" id="analytics-website" v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]">
                                        <label for="analytics-website" class="text-sm text-gray-700">Enable Analytics
                                            Tracking</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <QRCodeItem
                            v-for="qrItem in qrItems"
                            :key="qrItem.id"
                            :qr-item="qrItem"
                            @analytics="openAnalytics"
                            @delete="openDeleteConfirmation"
                            @edit="openEditPopup"
                        />
                    </div>
                </div>
            </div>
        </side-navigation>
        <QRCodeModal v-if="showQRCodeModal" :qr-code-content="qrCodeContent" @close="closeQRCodeModal" />
        <AnalyticsPopup
            v-if="showAnalyticsPopup"
            :analytics-data="selectedQRAnalytics"
            @close="closeAnalytics"
        />
        <DeleteConfirmationPopup
            :is-visible="showDeleteConfirmation"
            :item-type="'Website'"
            :item-code="selectedQRItem ? selectedQRItem.url : ''"
            @confirm="confirmDelete"
            @cancel="closeDeleteConfirmation"
        />
        <EditQRCodePopup
            v-if="showEditPopup"
            :qr-code="selectedQRItem"
            @close="closeEditPopup"
            @save="saveEditedQRCode"
        />
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
import QrcodeVue from 'qrcode.vue';
import Button from '@/components/Button.vue';
import AnalyticsPopup from '@/components/AnalyticsPopup.vue';
import DeleteConfirmationPopup from '@/components/DeleteConfirmationPopup.vue';
import EditQRCodePopup from '@/components/EditQRCodePopup.vue';
import QRCodeItem from '@/components/QRCodeItem.vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "WebsiteDynamic",
    components: {
        Icon,
        SideNavigation,
        InputFieldVue,
        QRCodeModal,
        QrcodeVue,
        Button,
        AnalyticsPopup,
        DeleteConfirmationPopup,
        EditQRCodePopup,
        QRCodeItem
    },
    data() {
        return {
            formData: {
                website_url: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: '',
            showAnalyticsPopup: false,
            showDeleteConfirmation: false,
            showEditPopup: false,
            selectedQRId: null,
            qrItems: [
                {
                     id: 1,
                     selected: false,
                     url: 'http://localhost:5173/qr-form?type=Website&mode=dynamic',
                     modified: '05 Aug 16,2023',
                     analytics: {
                         scans: 45,
                         uniqueScans: 32,
                         locations: ['New York', 'London', 'Tokyo'],
                         devices: ['Mobile', 'Desktop', 'Tablet'],
                         url: 'http://localhost:5173/qr-form?type=Website&mode=dynamic',
                         type: 'Website',
                         recentScans: [
                             {
                                 id: 1,
                                 timestamp: '2025-01-23 14:30:25',
                                 browser: 'Chrome 91.0',
                                 device: 'Desktop',
                                 ipAddress: '203.0.113.42',
                                 location: 'New York, NY, US',
                                 referrer: 'https://google.com',
                                 scanDuration: '2.3s'
                             }
                         ]
                     }
                 },
                {
                     id: 2,
                     selected: false,
                     url: 'http://localhost:5173/qr-form?type=MobileApp&mode=dynamic',
                     modified: '05 Aug 16,2023',
                     analytics: {
                         scans: 23,
                         uniqueScans: 18,
                         locations: ['Paris', 'Berlin'],
                         devices: ['Mobile', 'Desktop'],
                         url: 'http://localhost:5173/qr-form?type=MobileApp&mode=dynamic',
                         type: 'Mobile App',
                         recentScans: [
                             {
                                 id: 1,
                                 timestamp: '2025-01-23 13:45:12',
                                 browser: 'Safari 15.0',
                                 device: 'iPhone',
                                 ipAddress: '198.51.100.23',
                                 location: 'Los Angeles, CA, US',
                                 referrer: 'Direct',
                                 scanDuration: '1.8s'
                             }
                         ]
                     }
                 },
                {
                     id: 3,
                     selected: false,
                     url: 'http://localhost:5173/qr-form?type=EmailCampaign&mode=dynamic',
                     modified: '05 Aug 16,2023',
                     analytics: {
                         scans: 67,
                         uniqueScans: 54,
                         locations: ['Sydney', 'Melbourne'],
                         devices: ['Mobile', 'Tablet'],
                         url: 'http://localhost:5173/qr-form?type=EmailCampaign&mode=dynamic',
                         type: 'Email Campaign',
                         recentScans: [
                             {
                                 id: 1,
                                 timestamp: '2025-01-23 12:20:08',
                                 browser: 'Chrome 92.0',
                                 device: 'Samsung Galaxy S21',
                                 ipAddress: '192.0.2.156',
                                 location: 'Tokyo, JP',
                                 referrer: 'https://twitter.com',
                                 scanDuration: '3.1s'
                             }
                         ]
                     }
                 },
                {
                     id: 4,
                     selected: false,
                     url: 'http://localhost:5173/qr-form?type=SocialMedia&mode=dynamic',
                     modified: '05 Aug 16,2023',
                     analytics: {
                         scans: 89,
                         uniqueScans: 76,
                         locations: ['Toronto', 'Vancouver'],
                         devices: ['Mobile', 'Desktop', 'Tablet'],
                         url: 'http://localhost:5173/qr-form?type=SocialMedia&mode=dynamic',
                         type: 'Social Media',
                         recentScans: [
                             {
                                 id: 1,
                                 timestamp: '2025-01-23 11:15:30',
                                 browser: 'Firefox 95.0',
                                 device: 'Desktop',
                                 ipAddress: '172.16.0.45',
                                 location: 'Toronto, ON, CA',
                                 referrer: 'https://facebook.com',
                                 scanDuration: '2.7s'
                             }
                         ]
                     }
                 }
            ]
        };
    },
    computed: {
        selectedQRAnalytics() {
            const qrItem = this.qrItems.find(item => item.id === this.selectedQRId);
            return qrItem ? qrItem.analytics : {};
        },
        selectedQRItem() {
            return this.qrItems.find(item => item.id === this.selectedQRId);
        }
    },
    methods: {
        async generateWebsiteQRCode() {
            try {
                const payload = {
                    type: "website",
                    title: "WebsiteQR",
                    content: {
                        url: this.formData.website_url.trim()
                    },
                    is_dynamic: true,
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
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to website URL');
                        qrContent = this.formData.website_url.trim();
                    }

                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;

                    console.log('Generated Dynamic Website QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Website QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Website QR code: ${errorMessage}`);
            }
        },

        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        },

        openAnalytics(qrId) {
            this.selectedQRId = qrId;
            this.showAnalyticsPopup = true;
        },

        closeAnalytics() {
            this.showAnalyticsPopup = false;
            this.selectedQRId = null;
        },

        openDeleteConfirmation(qrId) {
            this.selectedQRId = qrId;
            this.showDeleteConfirmation = true;
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.selectedQRId = null;
        },

        async confirmDelete() {
            if (this.selectedQRId) {
                try {
                    await axios.delete(`/api/qr/${this.selectedQRId}`);
                    const index = this.qrItems.findIndex(item => item.id === this.selectedQRId);
                    if (index !== -1) {
                        this.qrItems.splice(index, 1);
                    }
                    this.closeDeleteConfirmation();
                } catch (error) {
                    console.error('Error deleting QR code:', error);
                    alert('Failed to delete QR code. Please try again.');
                }
            }
        },

        openEditPopup(qrId) {
            this.selectedQRId = qrId;
            this.showEditPopup = true;
        },

        closeEditPopup() {
            this.showEditPopup = false;
            this.selectedQRId = null;
        },

        async saveEditedQRCode(editedQR) {
            try {
                await axios.put(`/api/qr/${editedQR.id}`, editedQR);
                const index = this.qrItems.findIndex(item => item.id === editedQR.id);
                if (index !== -1) {
                    this.qrItems.splice(index, 1, editedQR);
                }
                this.closeEditPopup();
            } catch (error) {
                console.error('Error updating QR code:', error);
                alert('Failed to update QR code. Please try again.');
            }
        }
    }
};
</script>