<template>
    <div>
        <side-navigation>
            <div class="flex flex-col items-center justify-start self-stretch flex-1 relative">
                <div
                    class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                    <div
                        class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                    </div>
                    <div
                        class="bg-[#ffffff] p-2.5 flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                        <div
                            class="flex flex-row gap-10 items-center justify-start flex-wrap content-center self-stretch shrink-0 relative">
                            <div class="bg-[#ffffff] pt-[5px] pr-[11px] pb-[5px] pl-[11px] flex flex-row items-center justify-between flex-1 min-w-[150px] relative overflow-hidden"
                                style="box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25)">
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-2xl font-normal relative">
                                        2
                                    </div>
                                </div>
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#26666f] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium relative">
                                        Domains
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#ffffff] pt-[5px] pr-[11px] pb-[5px] pl-[11px] flex flex-row items-center justify-between flex-1 min-w-[150px] relative overflow-hidden"
                                style="box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25)">
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-2xl font-normal relative">
                                        3
                                    </div>
                                </div>
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#26666f] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium relative">
                                        Hosting
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#ffffff] pt-[5px] pr-[11px] pb-[5px] pl-[11px] flex flex-row items-center justify-between flex-1 min-w-[150px] relative overflow-hidden"
                                style="box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25)">
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-2xl font-normal relative">
                                        3
                                    </div>
                                </div>
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#26666f] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium relative">
                                        Websites
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#eef2f5] pt-[5px] pr-[11px] pb-[5px] pl-[11px] flex flex-row items-center justify-between flex-1 min-w-[150px] relative overflow-hidden"
                                style="box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25)">
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-2xl font-normal relative">
                                        3
                                    </div>
                                </div>
                                <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                    <div
                                        class="text-[#26666f] text-left font-['Inter-Medium',_sans-serif] text-sm font-medium relative">
                                        Unpaid Invoices
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full flex flex-col gap-2">
                            <div v-for="(section, index) in sections" :key="index" class="-mb-px last:mb-0"
                                style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                                <div @click="toggleSection(index)"
                                    class="bg-[#eef2f5] p-2.5 gap-2.5 flex flex-row items-center justify-between cursor-pointer">
                                    <div
                                        :class="['text-[#424242] text-sm', section.expanded ? 'font-semibold' : 'font-normal']">
                                        {{ section.title }}
                                    </div>
                                    <Icon :icon="section.expanded ? 'ph:caret-up' : 'ph:caret-down'"
                                        class="w-[19px] h-[19px]" />
                                </div>
                                <div v-if="section.expanded" class="bg-white">
                                    <div v-for="(qrCode, qrIndex) in qrCodes" :key="qrIndex"
                                        class="border-b border-gray-200 last:border-b-0 flex flex-row justify-between">
                                        <div class="p-2.5">
                                            <div class="text-black font-semibold text-[13px]">{{ qrCode.title }}</div>
                                            <div class="flex flex-row gap-2.5 mt-2">
                                                <div class="text-black text-xs font-normal">ID Protection</div>
                                                <div class="text-black text-xs font-normal">{{ qrCode.protection }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-row justify-between items-center p-2.5 gap-5">
                                            <div class="text-[#0c768a] text-xs font-normal">{{ qrCode.expiryText }}
                                            </div>
                                            <button @click="goToDetails"
                                                class="bg-white text-black border border-[#d2d2d2] rounded px-4 py-1 text-xs">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                    <div class="bg-white p-2.5 flex justify-end">
                                        <button @click="goToSelectQR"
                                            class="bg-[#0c768a] text-white rounded px-4 py-2 flex items-center hover:bg-[#d2d2d2] transition-colors duration-500 ease-in">
                                            <Icon icon="ph:plus" class="w-4 h-4 mr-1.5" />
                                            <span class="text-xs">New QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PortalPopup v-if="isImageDownloadPopupOpen" overlayColor="rgba(0, 0, 0, 0.2)" placement="Centered"
                :onOutsideClick="closeImageDownloadPopup">
                <DownloadQRVue @close="closeImageDownloadPopup" />
                <!-- <SingleFileUpload :onClose="closeImageUploadPopup" @file-uploaded="closeImageUploadPopup" /> -->
            </PortalPopup>
        </side-navigation>


    </div>
</template>

<script>
import SideNavigation from '@/components/SideNavigation.vue'
import ButtonVue from '@/components/Button.vue';
import PortalPopup from '@/components/PortalPopup.vue';
import { Icon } from "@iconify/vue";
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DownloadQRVue from '@/components/DownloadQR.vue';
export default {
    name: 'Home',
    components: {
        SideNavigation,
        ButtonVue,
        Icon,
        PortalPopup,
        DownloadQRVue,
        onMounted,
        watch,
        useRoute
    },
    
    methods: {
        openImageDownloadPopup() {
            this.isImageDownloadPopupOpen = true;
        },
        closeImageDownloadPopup() {
            this.isImageDownloadPopupOpen = false;
        }
    },
    data() {
        return {
            isImageDownloadPopupOpen: false,
            sections: [
                { title: 'Domains', expanded: false },
                { title: 'Website', expanded: false },
                { title: 'Web Hosting', expanded: false },
                { title: 'QR Codes', expanded: true },
            ],

            qrCodes: [
                {
                    title: 'Maimo QR code',
                    protection: 'Enabled',
                    expiryText: 'Expires in 367 Days'
                },
                {
                    title: 'Cyber Canvas Website QR code',
                    protection: 'Enabled',
                    expiryText: 'Expires in 367 Days'
                }
            ]
        };
    },
    mounted() {
    const route = this.$route;
    if (route.query.isPopupOpen === 'true') {
      this.isImageDownloadPopupOpen = true;
    }
  },
  watch: {
    '$route.query.isPopupOpen': function(newValue) {
      if (newValue === 'true') {
        this.isImageDownloadPopupOpen = true;
      }
    }
  },
    methods: {
        goToDetails() {
            this.$router.push({ name: 'qr-detail' });
        },
        goToSelectQR() {
            this.$router.push({ name: 'qr-select' });
        },
        toggleSection(index) {
            this.sections[index].expanded = !this.sections[index].expanded;
        }
    },
};
</script>

<style s SideNavigationcoped></style>