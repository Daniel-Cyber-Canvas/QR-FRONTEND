
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
                                <form @submit.prevent="generateWebsiteQRCode" class="w-full">
                                    <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative">
                                        <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                            <div class="text-sm font-medium text-gray-700 mb-2">
                                                Website QR Code - Static Mode
                                            </div>
                                            
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Website URL"
                                                placeholder="https://example.com" 
                                                v-model="formData.website_url" 
                                                type="url"
                                                required 
                                            />
                                            
                                            <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                                <button
                                                    type="submit"
                                                    class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                                    :disabled="isGenerating"
                                                >
                                                    <span v-if="isGenerating" class="flex items-center gap-2">
                                                        <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
                                                        Generating...
                                                    </span>
                                                    <span v-else>Generate Website QR Code</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- QR Codes Management Section -->
                        <div class="flex flex-col gap-4 items-start justify-start w-full shrink-0 relative">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-4 flex flex-col gap-4 items-start justify-start w-full relative">
                                <div class="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                    <div class="text-lg font-semibold text-gray-800">
                                        Static Website QR Codes
                                    </div>
                                    <button 
                                        @click="fetchQRCodes"
                                        class="bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 text-sm text-gray-700 transition-colors duration-300"
                                        :disabled="isLoading"
                                    >
                                        <span v-if="isLoading" class="flex items-center gap-2">
                                            <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
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
                                    <Icon name="ph:qr-code" class="w-12 h-12 mb-2" />
                                    <p>No static website QR codes found</p>
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
                                    
                                    <!-- Pagination Controls -->
                                    <div v-if="qrItems.length > itemsPerPage" class="flex flex-col gap-3 items-center justify-center w-full mt-4">
                                        <!-- Pagination Info -->
                                        <div class="text-gray-600 text-sm">
                                            {{ paginationInfo }}
                                        </div>
                                        
                                        <!-- Pagination Buttons -->
                                        <div class="flex flex-row gap-2 items-center justify-center">
                                            <!-- Previous Button -->
                                            <button 
                                                @click="changePage(currentPage - 1)"
                                                :disabled="currentPage === 1"
                                                :class="[
                                                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                    currentPage === 1 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                ]"
                                            >
                                                Previous
                                            </button>
                                            
                                            <!-- Page Numbers -->
                                            <template v-for="page in totalPages" :key="page">
                                                <button 
                                                    v-if="page <= 5 || Math.abs(page - currentPage) <= 2 || page > totalPages - 2"
                                                    @click="changePage(page)"
                                                    :class="[
                                                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                        page === currentPage 
                                                            ? 'bg-[#0c768a] text-white' 
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    ]"
                                                >
                                                    {{ page }}
                                                </button>
                                                <span v-else-if="page === currentPage - 3 || page === currentPage + 3" class="px-2 text-gray-500">...</span>
                                            </template>
                                            
                                            <!-- Next Button -->
                                            <button 
                                                @click="changePage(currentPage + 1)"
                                                :disabled="currentPage === totalPages"
                                                :class="[
                                                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                    currentPage === totalPages 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                ]"
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
            </div>
        </side-navigation>

        <!-- Modals -->
        <QRCodeModal
            v-if="showQRCodeModal" 
            :qr-code-content="qrCodeContent" 
            @close="closeQRCodeModal" 
        />

        <DeleteConfirmationPopup
            v-if="showDeleteConfirmation && selectedQRItem"
            :is-visible="showDeleteConfirmation"
            :item-type="selectedQRItem.analytics?.type || 'Website QR'"
            :item-code="`QR-${selectedQRItem.id}`"
            @confirm="confirmDelete"
            @cancel="closeDeleteConfirmation"
        />

        <!-- Download QR Modal -->
        <DownloadQRModal
            v-if="showDownloadModal" 
            :qr-code-content="downloadQRContent" 
            @close="closeDownloadModal" 
        />
    </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
import DownloadQRModal from '@/components/DownloadQR.vue';
import StaticQRCodeItem from '@/components/StaticQRCodeItem.vue';
import DeleteConfirmationPopup from '@/components/DeleteConfirmationPopup.vue';
import { Icon } from '@iconify/vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "WebsiteStatic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal,
        DownloadQRModal,
        StaticQRCodeItem,
        DeleteConfirmationPopup,
        Icon
    },
    data() {
        return {
            formData: {
                website_url: ''
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
        // Sort QR items by creation date (most recent first) and paginate
        paginatedQRItems() {
            const sortedItems = [...this.qrItems].sort((a, b) => {
                const dateA = new Date(a.originalData?.created_at || a.originalData?.updated_at);
                const dateB = new Date(b.originalData?.created_at || b.originalData?.updated_at);
                return dateB - dateA; // Most recent first
            });
            
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return sortedItems.slice(startIndex, endIndex);
        },
        
        totalPages() {
            return Math.ceil(this.qrItems.length / this.itemsPerPage);
        },
        
        // Show pagination info
        paginationInfo() {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.qrItems.length);
            return `Showing ${start}-${end} of ${this.qrItems.length} QR codes`;
        }
    },
    async mounted() {
        await this.fetchQRCodes();
    },
    methods: {
        async generateWebsiteQRCode() {
            this.isGenerating = true;
            try {
                const payload = {
                    type: "static",
                    service: "website",
                    title: "WebsiteQR",
                    content: {
                        url: this.formData.website_url.trim(),
                        service: "website"
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                console.log('🚀 Sending static website QR payload:', payload);

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    // For static QR codes, use the URL directly
                    const qrContent = this.formData.website_url.trim();
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.formData.website_url = '';
                    
                    // Refresh QR list after creation
                    setTimeout(async () => {
                        await this.fetchQRCodes();
                    }, 1000);
                    
                    console.log('Generated Static Website QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Website QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Website QR code: ${errorMessage}`);
            } finally {
                this.isGenerating = false;
            }
        },

        async fetchQRCodes() {
            this.isLoading = true;
            try {
                console.log('🔍 Fetching static website QR codes...');
                
                // Fetch static website QR codes
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'static',
                        service: 'website',
                        page: 1,
                        limit: 100 // Get more items to handle pagination client-side
                    }
                });

                console.log('🔍 Fetch response with filters:', response.data);

                // If no results with service filter, try with just type=static and filter client-side
                if (!response.data.data || response.data.data.length === 0) {
                    console.log('🔄 No results with service filter, trying type=static only...');
                    
                    response = await axios.get('/api/qr', {
                        params: {
                            type: 'static',
                            page: 1,
                            limit: 100
                        }
                    });
                    console.log('🔍 Fetch response without service filter:', response.data);
                }

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for static website QRs
                    qrData = qrData.filter(qr => {
                        const isStaticWebsiteQR = qr.type === 'static' && 
                                                 qr.content && 
                                                 qr.content.url && 
                                                 !qr.content.name && 
                                                 !qr.content.email &&
                                                 !qr.content.text &&
                                                 (qr.content.service === 'website' || qr.title?.toLowerCase().includes('websiteqr'));
                        return isStaticWebsiteQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        return {
                            id: qr.id,
                            url: qr.content?.url || 'N/A',
                            qrCodeValue: qr.content?.url || 'N/A', // For static QRs, the content IS the QR value
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Website',
                                scans: 0, // Static QRs don't track scans
                                uniqueScans: 0
                            },
                            originalData: qr
                        };
                    });

                    console.log('🔄 Final transformed static QR Items:', this.qrItems);
                } else {
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('Error fetching static QR codes:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to fetch QR codes: ${errorMessage}`);
                this.qrItems = [];
            } finally {
                this.isLoading = false;
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        handleDownload(qrItem) {
            console.log('📥 Download clicked for static QR Item:', qrItem);
            try {
                if (qrItem) {
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

        closeDownloadModal() {
            this.showDownloadModal = false;
            this.downloadQRContent = '';
        },

        handleDelete(qrItem) {
            console.log('🗑️ Delete clicked for static QR Item:', qrItem);
            try {
                if (qrItem) {
                    this.selectedQRItem = { ...qrItem };
                    this.$nextTick(() => {
                        this.showDeleteConfirmation = true;
                    });
                    console.log('🗑️ Opening delete confirmation for:', qrItem);
                } else {
                    console.error('❌ QR item not provided');
                    alert('QR code not found. Please refresh the page.');
                }
            } catch (error) {
                console.error('❌ Error in handleDelete:', error);
                alert('An error occurred while opening the delete dialog.');
            }
        },

        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.$nextTick(() => {
                this.selectedQRItem = null;
            });
        },

        async confirmDelete() {
            // Prevent double execution
            if (this.isDeleting) {
                console.log('🔄 Delete already in progress, skipping...');
                return;
            }
            
            this.isDeleting = true;
            
            try {
                if (!this.selectedQRItem || !this.selectedQRItem.id) {
                    throw new Error('No QR code selected for deletion');
                }

                console.log('🗑️ Deleting static QR code:', this.selectedQRItem.id);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                console.log('✅ Static QR code deleted successfully');
                this.closeDeleteConfirmation();
                
                // Refresh the list
                await this.fetchQRCodes();
                
                alert('QR code deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting static QR code:', error);
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
};
</script>