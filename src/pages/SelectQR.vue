<template>
    <div>
        <side-navigation>
            <div
                class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div
                    class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div
                    class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                    <!-- Header and Search bar -->
                    <div class="w-full flex flex-row gap-4 items-center justify-between shrink-0 relative">
                        <div
                            class="text-[#424242] text-left font-['Poppins-Regular',_sans-serif] text-sm font-normal relative flex items-center justify-start">
                            Select your QR Code Type
                        </div>
                        <div
                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#d2d2d2] border pl-[5px] flex flex-row gap-[5px] items-center justify-start shrink-0 w-[203px] h-7 relative overflow-hidden">
                            <Icon icon="ph:magnifying-glass" class="shrink-0 w-4 h-4 relative object-cover"
                                color="black" />
                            <div class="flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                <div class="bg-[#d9d9d9] shrink-0 w-px h-5 relative"></div>
                            </div>
                            <input
                                class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 w-[166px] h-[21px] font-['Roboto-Regular',_sans-serif] text-xs font-normal border-none focus:outline-none relative"
                                placeholder="Search" v-model="searchQuery" type="text" autofocus>
                            <div class="text-[rgba(0,0,0,0.40)] text-left relative">
                                Search
                            </div>
                            />
                        </div>
                    </div>
                    <div class="flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                        <div class="bg-[#ffffff] rounded-[3px] p-3 flex flex-col gap-6 items-start justify-start flex-1 relative"
                            style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                            <!-- Dynamic QR Codes -->
                            <div class="flex flex-col gap-2.5 items-start justify-start self-stretch shrink-0 relative">
                                <div
                                    class="text-[rgba(0,0,0,0.50)] text-left font-poppins text-xs font-semibold relative">
                                    Dynamic QR Codes
                                </div>
                                <div v-if="filteredDynamicCodes.length > 0"
                                    class="flex flex-row gap-4 items-start justify-start flex-wrap content-start self-stretch shrink-0 relative">
                                    <div v-for="dynamicCode in filteredDynamicCodes" :key="dynamicCode.id"
                                        class="bg-[#eef2f5] text-[#424242]  cursor-pointer pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-[23px] items-center justify-start flex-1 min-w-[300px] relative overflow-hidden hover:bg-[#0C8096] hover:text-white transition-all duration-300 ease-in-out"
                                        @click="goToForm(dynamicCode)">
                                        <Icon :icon=dynamicCode.icon class="shrink-0 w-7 h-7 relative object-cover" />
                                        <div
                                            class="text-left font-['Inter-Medium',_sans-serif] text-sm font-medium relative">
                                            {{ dynamicCode.name }}
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="text-[#0c768a] text-[14px]">No dynamic QR codes found matching your search query.</p>

                                </div>
                            </div>
                            <!-- Static QR Codes -->
                            <div class="flex flex-col gap-2.5 items-start justify-start self-stretch shrink-0 relative">
                                <div
                                    class="text-[rgba(0,0,0,0.50)] text-left font-['Poppins-SemiBold',_sans-serif] text-xs font-semibold relative">
                                    Static QR Codes
                                </div>
                                <div v-if="filteredStaticCodes.length > 0"
                                    class="flex flex-row gap-4 items-start justify-start flex-wrap content-start self-stretch shrink-0 relative">
                                    <div v-for="staticCode in filteredStaticCodes" :key="staticCode.id"
                                        class="bg-[#eef2f5] text-[#424242]  cursor-pointer pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-[23px] items-center justify-start flex-1 min-w-[300px] relative overflow-hidden hover:bg-[#0C8096] hover:text-white transition-all duration-300 ease-in-out"
                                        @click="goToForm(staticCode)">
                                        <Icon :icon=staticCode.icon class="shrink-0 w-7 h-7 relative object-cover" />
                                        <div
                                            class="text-left font-['Inter-Medium',_sans-serif] text-sm font-medium relative">
                                            {{ staticCode.name }}
                                        </div>
                                    </div>

                                </div>
                                <div v-else>
                                    <p class="text-[#0c768a] text-[14px]">No static QR codes found matching your search query.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </side-navigation>
    </div>
</template>

<script>
import SideNavigation from '@/components/SideNavigation.vue'
import { Icon } from '@iconify/vue';

export default {
    components: {
        SideNavigation,
        Icon
    },
    name: "SelectQR",
    data() {
        return {
            searchQuery: '',
            selectedType: '',
            dynamicCodes: [
                { name: "Website", icon: "ph:globe" },
                { name: "Virtual Card", icon: "ph:identification-card" },
                { name: "PDF", icon: "ph:file-pdf" },
                { name: "Social Media", icon: "ph:chat-circle-text" },
                { name: "Instagram", icon: "ph:instagram-logo" },
                { name: "Images", icon: "ph:camera" },
                { name: "App", icon: "ph:device-mobile-speaker" },
                { name: "Business Page", icon: "ph:building" },
                { name: "Event", icon: "ph:calendar-blank" },
                { name: "2D Barcode", icon: "ph:barcode" },
                { name: "Feedback", icon: "ph:star" },
                { name: "Rating", icon: "ph:thumbs-up" },
            ],
            staticCodes: [
                { name: "Website", icon: "ph:globe" },
                { name: "Virtual Card", icon: "ph:identification-card" },
                { name: "Email", icon: "ph:envelope" },
                { name: "SMS", icon: "ph:chat-circle" },
                { name: "Text", icon: "ph:notepad" },
                { name: "Wi-Fi", icon: "ph:wifi-high" },
            ],
        }
    },
    computed: {
        filteredDynamicCodes() {
            return this.dynamicCodes.filter((code) => {
                return code.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        },
        filteredStaticCodes() {
            return this.staticCodes.filter((code) => {
                return code.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        },
    },
    methods: {
        goToForm(selectedCode) {
            this.$router.push({ path: '/qr-form', query: { type: selectedCode.name } })
        }
    }
}
</script>

<style scoped></style>