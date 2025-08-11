
<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
            <div class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                    <!-- Main content container with max width -->
                    <div class="flex flex-col gap-6 items-start justify-start flex-1 relative max-w-none w-full">
                        <!-- Form Section -->
                        <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                            <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                                <!-- Text Static Form -->
                                <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                                    <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative">
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
                                                    :disabled="isGenerating"
                                                    class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                                                >
                                                    <span v-if="isGenerating">
                                                        <Icon name="ph:spinner" class="w-4 h-4 animate-spin inline mr-2" />
                                                        Generating...
                                                    </span>
                                                    <span v-else>Generate Text QR Code</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- QR Code Management Section -->
                        <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                            <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                                <!-- Header with Refresh Button -->
                                <div class="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                    <div class="text-lg font-semibold text-gray-800">
                                        Static Text QR Codes
                                    </div>
                                    <button
                                        @click="fetchQRCodes"
                                        :disabled="isLoading"
                                        class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                                    >
                                        <span v-if="isLoading">
                                            <Icon name="ph:spinner" class="w-4 h-4 animate-spin inline mr-2" />
                                            Loading...
                                        </span>
                                        <span v-else>Refresh</span>
                                    </button>
                                </div>

                                <!-- Loading State -->
                                <div v-if="isLoading && qrItems.length === 0" class="flex items-center justify-center py-8">
                                    <div class="flex items-center gap-2 text-gray-500">
                                        <Icon name="ph:spinner" class="w-5 h-5 animate-spin" />
                                        Loading QR codes...
                                    </div>
                                </div>

                                <!-- Empty State -->
                                <div v-else-if="!isLoading && qrItems.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Icon name="ph:text-aa" class="w-12 h-12 mb-2" />
                                    <p>No static text QR codes found</p>
                                    <p class="text-sm">Create your first QR code using the form above</p>
                                </div>

                                <!-- QR Codes List -->
                                <div v-else class="flex flex-col gap-4 items-start justify-start w-full shrink-0 relative">
                                    <!-- QR Items -->
                                    <div class="flex flex-col gap-2 items-start justify-start w-full shrink-0 relative">
                                        <StaticQRCodeItem 
                                            v-for="qrItem in paginatedQRItems" 
                                            :key="qrItem.id" 
                                            :qr-item="qrItem" 
                                            @delete="handleDelete"
                                            @download="handleDownload"
                                        />
                                    </div>

                                    <!-- Pagination -->
                                    <div v-if="totalPages > 1" class="flex flex-row gap-2 items-center justify-center self-stretch shrink-0 relative mt-4">
                                        <button
                                            @click="changePage(currentPage - 1)"
                                            :disabled="currentPage === 1"
                                            class="bg-gray-200 rounded px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        
                                        <span class="text-gray-600 px-4">
                                            Page {{ currentPage }} of {{ totalPages }}
                                        </span>
                                        
                                        <button
                                            @click="changePage(currentPage + 1)"
                                            :disabled="currentPage === totalPages"
                                            class="bg-gray-200 rounded px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </side-navigation>

        <!-- QR Code Generation Modal -->
        <q-r-code-modal 
            v-if="showQRCodeModal" 
            :qr-content="qrCodeContent"
            @close="showQRCodeModal = false"
        />

        <!-- Download Modal -->
        <download-q-r 
            v-if="showDownloadModal" 
            :qr-content="downloadQRContent"
            @close="showDownloadModal = false"
        />

        <!-- Delete Confirmation Modal -->
        <delete-confirmation-popup 
            v-if="showDeleteConfirmation" 
            :is-deleting="isDeleting"
            @confirm="confirmDelete"
            @cancel="closeDeleteConfirmation"
        />
    </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
import DownloadQR from '@/components/DownloadQR.vue';
import DeleteConfirmationPopup from '@/components/DeleteConfirmationPopup.vue';
import StaticQRCodeItem from '@/components/StaticQRCodeItem.vue';
import { Icon } from '@iconify/vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "TextStatic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal,
        DownloadQR,
        DeleteConfirmationPopup,
        StaticQRCodeItem,
        Icon
    },
    data() {
        return {
            formData: {
                text: ''
            },
            showQRCodeModal: false,
            qrCodeContent: '',
            isGenerating: false,
            isLoading: false,
            isDeleting: false,
            qrItems: [],
            currentPage: 1,
            itemsPerPage: 5,
            showDeleteConfirmation: false,
            showDownloadModal: false,
            downloadQRContent: '',
            selectedQRItem: null
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.qrItems.length / this.itemsPerPage);
        },
        paginatedQRItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.qrItems.slice(start, end);
        }
    },
    async mounted() {
        await this.fetchQRCodes();
    },
    methods: {
        async generateQRCode() {
            await this.generateTextQRCode();
        },

        async generateTextQRCode() {
            this.isGenerating = true;
            try {
                const title = `StaticTextQR_${Date.now()}`;
                
                const payload = {
                    type: "static",
                    title: title,
                    content: {
                        service: "text",
                        text: this.formData.text.trim()
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                console.log('🚀 Sending static text QR payload:', payload);

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    // For static text QR codes, use the text content directly
                    const qrContent = this.formData.text.trim();
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Clear form
                    this.formData = {
                        text: ''
                    };
                    
                    // Refresh QR codes list
                    await this.fetchQRCodesSilent();
                    
                    console.log('✅ Generated Static Text QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Text QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            } finally {
                this.isGenerating = false;
            }
        },

        async fetchQRCodes() {
            this.isLoading = true;
            try {
                const response = await axios.get('/api/qr', {
                    params: {
                        type: 'static',
                        page: 1,
                        limit: 100
                    }
                });

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for static text QRs
                    qrData = qrData.filter(qr => {
                        const isStaticTextQR = qr.type === 'static' && 
                                              qr.content && 
                                              qr.content.service === 'text';
                        return isStaticTextQR;
                    });

                    console.log('📝 Filtered static text QRs:', qrData);

                    this.qrItems = qrData.map(qr => {
                        const textContent = qr.content.text || '';

                        return {
                            id: qr.id,
                            url: textContent,
                            qrCodeValue: textContent,
                            displayName: qr.title || `Text QR - ${textContent.substring(0, 30)}${textContent.length > 30 ? '...' : ''}`,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Text',
                                scans: 0, // Static QRs don't track scans
                                uniqueScans: 0
                            },
                            originalData: qr
                        };
                    });
                }
            } catch (error) {
                console.error('Error fetching QR codes:', error);
                alert('Failed to fetch QR codes. Please try again.');
            } finally {
                this.isLoading = false;
            }
        },

        async fetchQRCodesSilent() {
            try {
                const response = await axios.get('/api/qr', {
                    params: {
                        type: 'static',
                        page: 1,
                        limit: 100
                    }
                });

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for static text QRs
                    qrData = qrData.filter(qr => {
                        const isStaticTextQR = qr.type === 'static' && 
                                              qr.content && 
                                              qr.content.service === 'text';
                        return isStaticTextQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        const textContent = qr.content.text || '';

                        return {
                            id: qr.id,
                            url: textContent,
                            qrCodeValue: textContent,
                            displayName: qr.title || `Text QR - ${textContent.substring(0, 30)}${textContent.length > 30 ? '...' : ''}`,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Text',
                                scans: 0, // Static QRs don't track scans
                                uniqueScans: 0
                            },
                            originalData: qr
                        };
                    });
                }
            } catch (error) {
                console.error('Error fetching QR codes silently:', error);
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        handleDownload(qrItem) {
            try {
                console.log('📥 Preparing download for text QR:', qrItem);
                if (qrItem && (qrItem.qrCodeValue || qrItem.url)) {
                    this.downloadQRContent = qrItem.qrCodeValue || qrItem.url;
                    this.showDownloadModal = true;
                    console.log('📥 Opening download modal for:', qrItem);
                } else {
                    console.error('❌ QR item not provided');
                    alert('QR code not found. Please refresh the page.');
                }
            } catch (error) {
                console.error('❌ Error in handleDownload:', error);
                alert('An error occurred while preparing the download.');
            }
        },

        handleDelete(qrItem) {
            this.selectedQRItem = qrItem;
            this.showDeleteConfirmation = true;
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.selectedQRItem = null;
        },

        async confirmDelete() {
            // Prevent double deletion
            if (!this.selectedQRItem || this.isDeleting) return;

            this.isDeleting = true;
            const qrItemToDelete = this.selectedQRItem;
            
            try {
                console.log(`🗑️ Deleting QR code with ID: ${qrItemToDelete.id}`);
                
                await axios.delete(`/api/qr/${qrItemToDelete.id}`);
                
                console.log('✅ QR code deleted successfully');
                
                // Remove from local array immediately
                this.qrItems = this.qrItems.filter(item => item.id !== qrItemToDelete.id);
                
                // Adjust current page if necessary
                if (this.paginatedQRItems.length === 0 && this.currentPage > 1) {
                    this.currentPage--;
                }
                
                // Close modal and show success message
                this.closeDeleteConfirmation();
                alert('QR code deleted successfully!');
                
            } catch (error) {
                console.error('❌ Error deleting QR code:', error);
                
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                
                if (error.response?.status === 404) {
                    console.warn('⚠️ QR code not found (404), refreshing list');
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodes();
                    alert('QR code was already deleted or does not exist. Refreshing the list.');
                } else {
                    alert(`Failed to delete QR code: ${errorMessage}`);
                }
            } finally {
                this.isDeleting = false;
            }
        }
    }
}
</script>

<style scoped></style>