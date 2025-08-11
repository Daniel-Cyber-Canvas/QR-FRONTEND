<template>
    <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
        <!-- QR Code Preview -->
        <div class="flex justify-center mb-4">
            <div class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <canvas ref="qrCanvas" class="w-20 h-20"></canvas>
            </div>
        </div>
        
        <!-- QR Code Info -->
        <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email QR</span>
                <span class="text-xs text-gray-400">{{ formatDate(qrItem.updated_at) }}</span>
            </div>
            
            <h3 class="font-medium text-gray-900 truncate" :title="qrItem.title">
                {{ qrItem.title }}
            </h3>
            
            <!-- Email Details -->
            <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                    <span class="font-medium">To:</span>
                    <span class="truncate" :title="qrItem.recipient">{{ qrItem.recipient }}</span>
                </div>
                <div v-if="qrItem.subject" class="flex items-center gap-2">
                    <span class="font-medium">Subject:</span>
                    <span class="truncate" :title="qrItem.subject">{{ qrItem.subject }}</span>
                </div>
                <div v-if="qrItem.body" class="flex items-center gap-2">
                    <span class="font-medium">Message:</span>
                    <span class="truncate" :title="qrItem.body">{{ qrItem.body }}</span>
                </div>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2">
            <Button
                text="Download"
                variant="outline"
                @click="$emit('download', qrItem)"
                class="flex-1 text-sm"
            />
            <Button
                text="Delete"
                variant="error"
                @click="$emit('delete', qrItem)"
                class="flex-1 text-sm"
            />
        </div>
    </div>
</template>

<script>
import Button from './Button.vue';
import QRCode from 'qrcode';

export default {
    name: 'StaticEmailQRItem',
    components: {
        Button
    },
    props: {
        qrItem: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.generateQRCode();
    },
    watch: {
        'qrItem.mailto_url': {
            handler() {
                this.generateQRCode();
            },
            immediate: true
        }
    },
    methods: {
        async generateQRCode() {
            if (!this.qrItem.mailto_url || !this.$refs.qrCanvas) return;
            
            try {
                await QRCode.toCanvas(this.$refs.qrCanvas, this.qrItem.mailto_url, {
                    width: 80,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
            } catch (error) {
                console.error('Error generating QR code preview:', error);
            }
        },
        
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }
};
</script>