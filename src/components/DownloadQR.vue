<template>
    <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="bg-[#fbfbfb] rounded-[3px] pt-5 pr-[25px] pb-10 pl-[25px] flex flex-col gap-4 items-center justify-center shrink-0 relative overflow-hidden z-10"
            style="box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25)">
            <div class="flex flex-col gap-2.5 items-end justify-center self-stretch shrink-0 relative">
                <Icon icon="ph:x-bold" @click="closeModal" class="shrink-0 w-5 h-5 relative object-cover text-[#aaaaaa] cursor-pointer" />
                <div class="flex flex-col gap-2.5 items-center justify-start self-stretch shrink-0 relative">
                    <div class="text-[#424242] text-center font-['Poppins-Medium',_sans-serif] text-sm font-medium relative self-stretch">
                        Your QR Code Has Been Generated!
                    </div>
                    <!-- QR Code container with padding -->
                    <div class="bg-white p-4 rounded-lg">
                        <qrcode-vue 
                            :value="qrCodeContent" 
                            :size="150" 
                            level="H"
                            :margin="2"
                            class="qr-code"
                        />
                    </div>
                    <div class="flex flex-row gap-2 items-start justify-start shrink-0 relative">
                        <button @click="downloadQRCode"
                            class="bg-[#0c768a] rounded-sm pt-[7px] pr-3 pb-[7px] pl-3 flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer hover:bg-[#26666F]">
                            <Icon icon="ph:download-simple" class="shrink-0 w-4 h-4 relative object-cover" color="white" />
                            <div class="text-[#ffffff] text-left font-['Roboto-normal',_sans-serif] text-xs font-normal relative">
                                Download
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import QrcodeVue from 'qrcode.vue';

export default {
    name: "QRCodeModal",
    components: {
        Icon,
        QrcodeVue
    },
    props: {
        qrCodeContent: {
            type: String,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        downloadQRCode() {
            // Create a new canvas with padding
            const originalCanvas = document.querySelector('canvas');
            const paddedCanvas = document.createElement('canvas');
            const padding = 20; // Adjust padding size as needed

            // Set new canvas size (original size + padding)
            paddedCanvas.width = originalCanvas.width + (padding * 2);
            paddedCanvas.height = originalCanvas.height + (padding * 2);

            // Get context and fill with white background
            const ctx = paddedCanvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

            // Draw original QR code in the center
            ctx.drawImage(
                originalCanvas,
                padding,
                padding,
                originalCanvas.width,
                originalCanvas.height
            );

            // Create download link
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = paddedCanvas.toDataURL('image/png');
            link.click();
        }
    }
}
</script>

<style scoped>
.qr-code {
    display: block;
}
</style>