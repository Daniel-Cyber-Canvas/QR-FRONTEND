<template>
    <div>
        <side-navigation>
            <div
                class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div
                    class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div
                    class="bg-[#ffffff] p-2.5 flex flex-col gap-4 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                    <div class="bg-[#ffffff] rounded-[3px] pt-6 pr-4 pb-6 pl-4 flex flex-col gap-5 items-start justify-start self-stretch shrink-0 relative overflow-hidden"
                        style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                        <div class="flex flex-row items-start justify-between self-stretch shrink-0 relative">
                            <div class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative">
                                <div
                                    class="text-[#424242] text-left font-['Poppins-SemiBold',_sans-serif] text-base font-semibold relative">
                                    Maimo QR Code
                                </div>
                                <div class="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div
                                        class="bg-[rgba(117,183,196,0.57)] rounded-[32px] pt-[3px] pr-2.5 pb-[3px] pl-2.5 flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                        <div
                                            class="text-[#424242] text-left font-['Poppins-Regular',_sans-serif] text-xs font-normal relative">
                                            Virtual Card
                                        </div>
                                    </div>
                                    <div
                                        class="text-[#26666f] text-left font-['Poppins-Regular',_sans-serif] text-xs font-normal relative">
                                        Expires in 367 days
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row gap-4 items-center justify-start shrink-0 relative">
                                <div
                                    class=" pt-[7px] pr-3 pb-[7px] pl-3 flex flex-row gap-2.5 shrink-0 w-[97px] h-[31px] relative">
                                    <Icon icon="ph:pen-edit" class="shrink-0 w-[58px] h-[60px] relative object-cover" />

                                </div>
                                <button
                                    class="bg-[#0c768a] gap-1.5 rounded-[3px] border-solid border-[#d2d2d2] border pt-[7px] pb-[7px] flex flex-row pr-4 pl-4 items-center justify-between shrink-0 relative overflow-hidden hover:bg-[d2d2d2] hover-ease-in hover:duration-500">
                                    <Icon icon="ph:note-pencil" class="shrink-0 w-4 h-4 relative object-cover"
                                        color="white" />
                                    <div
                                        class="text-[#ffffff] text-center font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                        Edit
                                    </div>
                                </button>
                                <ButtonVue class="w-[97px]" @click="goToDetails" text="Delete"></ButtonVue>
                            </div>
                        </div>
                        <div class="flex flex-row gap-4 items-center justify-start self-stretch shrink-0 relative">
                            <div class="bg-[#fbfbfb] p-2 flex flex-col gap-0 items-start justify-start flex-1 relative overflow-hidden"
                                style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                                <div
                                    class="text-[rgba(0,0,0,0.40)] text-left font-['Poppins-Regular',_sans-serif] text-xs font-normal relative self-stretch">
                                    Total Scans
                                </div>
                                <div
                                    class="text-[#424242] text-left font-['Poppins-Medium',_sans-serif] text-base font-medium relative self-stretch">
                                    216
                                </div>
                            </div>
                            <div class="bg-[#fbfbfb] p-2 flex flex-col gap-0 items-start justify-start flex-1 relative overflow-hidden"
                                style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                                <div
                                    class="text-[rgba(0,0,0,0.40)] text-left font-['Poppins-Regular',_sans-serif] text-xs font-normal relative">
                                    Top Country
                                </div>
                                <div
                                    class="text-[#424242] text-left font-['Poppins-Medium',_sans-serif] text-base font-medium relative self-stretch">
                                    Zambia
                                </div>
                            </div>
                            <div class="bg-[#fbfbfb] p-2 flex flex-col gap-0 items-start justify-start flex-1 relative overflow-hidden"
                                style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                                <div
                                    class="text-[rgba(0,0,0,0.40)] text-left font-['Poppins-Regular',_sans-serif] text-xs font-normal relative">
                                    Top City
                                </div>
                                <div
                                    class="text-[#424242] text-left font-['Poppins-Medium',_sans-serif] text-base font-medium relative self-stretch">
                                    Lusaka
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-[#ffffff] rounded-[3px] pt-6 pr-4 pb-6 pl-4 flex flex-col gap-2.5 items-center justify-center shrink-0 w-[266px] h-[358px] relative overflow-hidden"
                        style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                        <div
                            class="text-[#424242] text-left font-['Poppins-SemiBold',_sans-serif] text-base font-semibold relative">
                            Scan QR Code
                        </div>
                        <img class="shrink-0 w-[185px] h-[185px] relative" alt="" src="" />
                        <div
                            class="text-[#424242] text-left font-['Poppins-Regular',_sans-serif] text-base font-normal relative">
                            or
                        </div>
                        <button
                            class="bg-[#0c768a] gap-1.5 rounded-[3px] border-solid border-[#d2d2d2] border pt-[7px] pb-[7px] flex flex-row pr-4 pl-4 items-center justify-between shrink-0 relative overflow-hidden hover:bg-[d2d2d2] hover-ease-in hover:duration-500">
                            <Icon icon="ph:download-simple" class="shrink-0 w-4 h-4 relative object-cover"
                                color="white" />
                            <div
                                class="text-[#ffffff] text-center font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                Download
                            </div>
                        </button>
                    </div>
                </div>
            </div>

        </side-navigation>
    </div>
</template>

<script>
import SideNavigation from '@/components/SideNavigation.vue'
import ButtonVue from '@/components/Button.vue'
import { Icon } from "@iconify/vue";
import axios from '@/axios.js';

export default {
    components: { SideNavigation, ButtonVue, Icon },
    data() {
        return {
            qrDetails: null,
            loading: true,
            error: null
        };
    },
    async created() {
        try {
            const id = this.$route.params.id;
            const response = await axios.get(`/api/qr/${id}`);
            this.qrDetails = response.data;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching QR details:', error);
            this.error = error.response?.data?.message || 'Failed to load QR code details';
            this.loading = false;
        }
    },
    methods: {
        editDetails() {
            const id = this.$route.params.id;
            this.$router.push(`/qr-management?edit=${id}`);
        }
    }
}
</script>

<style scoped></style>