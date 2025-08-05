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
                                <form @submit.prevent="generate2DBarcodeQRCode" class="w-full">
                                    <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative">
                                        <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                            <div class="text-sm font-medium text-gray-700 mb-2">
                                                2D Barcode QR Code - Dynamic Mode
                                            </div>
                                            
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Title"
                                                placeholder="My Data Matrix" 
                                                v-model="formData.barcode_title" 
                                                required 
                                            />
                                            
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Data"
                                                placeholder="Hello World 123" 
                                                v-model="formData.barcode_data" 
                                                type="textarea"
                                                rows="4"
                                                required 
                                            />
                                            
                                            <div class="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="analytics-barcode" 
                                                    v-model="formData.analytics"
                                                    class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                                >
                                                <label for="analytics-barcode" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                            </div>
                                            
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
                                                    <span v-else>Generate 2D Barcode QR Code</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- QR Codes List Section - Full Width -->
                        <div class="flex flex-col gap-4 items-start justify-start w-full shrink-0 relative">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-4 flex flex-col gap-4 items-start justify-start w-full relative">
                                <div class="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                    <div class="text-lg font-semibold text-gray-800">
                                        Dynamic 2D Barcode QR Codes
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
                                    <Icon name="ph:barcode" class="w-12 h-12 mb-2" />
                                    <p>No dynamic 2D barcode QR codes found</p>
                                    <p class="text-sm">Create your first QR code using the form above</p>
                                </div>

                                <!-- QR Codes List -->
                                <div v-else class="flex flex-col gap-4 items-start justify-start w-full shrink-0 relative">
                                    <!-- QR Items -->
                                    <div class="flex flex-col gap-2 items-start justify-start w-full shrink-0 relative">
                                        <QRCodeItem 
                                            v-for="qrItem in paginatedQRItems" 
                                            :key="qrItem.id" 
                                            :qr-item="qrItem" 
                                            @analytics="handleAnalytics"
                                            @delete="handleDelete"
                                            @edit="handleEdit"
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

        <EditQRCodePopup
            v-if="showEditPopup && selectedQRItem"
            :qr-code="selectedQRItem"
            @close="closeEditPopup"
            @save="saveEditedQRCode"
        />

        <DeleteConfirmationPopup
            v-if="showDeleteConfirmation && selectedQRItem"
            :is-visible="showDeleteConfirmation"
            :item-type="selectedQRItem.analytics?.type || '2D Barcode QR'"
            :item-code="`QR-${selectedQRItem.id}`"
            @confirm="confirmDelete"
            @cancel="closeDeleteConfirmation"
        />

        <!-- Analytics Popup -->
        <AnalyticsPopup
            v-if="showAnalytics"
            :qr-id="selectedQRItem?.id"
            :qr-code-url="selectedQRItem?.qrCodeValue"
            @close="closeAnalytics"
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
import QRCodeItem from '@/components/QRCodeItem.vue';
import EditQRCodePopup from '@/components/EditQRCodePopup.vue';
import DeleteConfirmationPopup from '@/components/DeleteConfirmationPopup.vue';
import AnalyticsPopup from '@/components/AnalyticsPopup.vue';
import { Icon } from '@iconify/vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "Barcode2DDynamic",
    components: {
        SideNavigation,
        InputFieldVue,
        QRCodeModal,
        DownloadQRModal,
        QRCodeItem,
        EditQRCodePopup,
        DeleteConfirmationPopup,
        AnalyticsPopup,
        Icon
    },
    data() {
        return {
            formData: {
                barcode_title: '',
                barcode_data: '',
                analytics: true
            },
            qrCodeContent: '',
            showQRCodeModal: false,
            isGenerating: false,
            isLoading: false,
            isDeleting: false,
            qrItems: [],
            currentPage: 1,
            itemsPerPage: 5,
            showEditPopup: false,
            showDeleteConfirmation: false,
            showAnalytics: false,
            showDownloadModal: false,
            downloadQRContent: '',
            selectedQRItem: null,
            selectedQRAnalytics: null
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
        async generate2DBarcodeQRCode() {
            this.isGenerating = true;
            try {
                const title = this.formData.barcode_title.trim() || '2DBarcodeQR';
                
                const payload = {
                    title: title,
                    data: this.formData.barcode_data.trim(),
                    is_dynamic: true,
                    analytics: this.formData.analytics,
                    service: 'barcode' // Explicitly set service
                };

                console.log('🚀 Sending 2D barcode payload:', payload);

                const response = await axios.post('/api/qr/barcode', payload);
                
                console.log('📥 Full creation response:', response);
                console.log('📥 Creation response data:', response.data);
                
                if (response.data) {
                    let qrContent;
                    
                    // For dynamic QR codes, use the redirect URL from backend
                    if (response.data.redirect_url) {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url) {
                        // Construct full URL from short_url identifier
                        qrContent = `${config.apiBaseUrl}/redirect/${response.data.short_url}`;
                    } else {
                        qrContent = response.data.qr_code;
                    }
                    
                    // If backend doesn't provide proper URL, create a fallback
                    if (!qrContent || typeof qrContent === 'object') {
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to barcode data');
                        qrContent = this.formData.barcode_data.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Clear form and refresh list
                    this.formData.barcode_title = '';
                    this.formData.barcode_data = '';
                    await this.fetchQRCodesSilent();
                    
                    console.log('Generated Dynamic 2D Barcode QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating 2D Barcode QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate 2D Barcode QR code: ${errorMessage}`);
            } finally {
                this.isGenerating = false;
            }
        },

        async fetchQRCodes() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting fetchQRCodes for 2D barcodes...');
                
                // Get all dynamic QR codes since backend doesn't filter barcode service properly
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'dynamic',
                        page: 1,
                        limit: 100 // Get all items for client-side pagination
                    }
                });

                console.log('🔍 Fetch response:', response.data);

                if (response.data && response.data.data) {
                    let qrData = response.data.data;
                    
                    // Apply client-side filtering for barcode QR codes
                    console.log('🔍 Filtering for barcode service...');
                    qrData = qrData.filter(item => {
                        console.log('🔍 Checking item:', item);
                        
                        // Check if service is explicitly set to barcode
                        if (item.service === 'barcode') {
                            console.log('✅ Found barcode by service field');
                            return true;
                        }
                        
                        // Check content for barcode indicators
                        if (item.content) {
                            let content = item.content;
                            
                            // Parse string content if needed
                            if (typeof content === 'string') {
                                try {
                                    content = JSON.parse(content);
                                } catch (e) {
                                    console.log('⚠️ Failed to parse content:', e);
                                    return false;
                                }
                            }
                            
                            // Check for barcode service in content
                            if (content.service === 'barcode') {
                                console.log('✅ Found barcode by content.service');
                                return true;
                            }
                            
                            // Check for barcode data fields
                            if (content.data !== undefined || content.barcode_data !== undefined) {
                                console.log('✅ Found barcode by data fields');
                                return true;
                            }
                            
                            // Check if title suggests it's a barcode and has data-like content
                            if (item.title && item.title.toLowerCase().includes('barcode') && content.data) {
                                console.log('✅ Found barcode by title and data');
                                return true;
                            }
                        }
                        
                        // Check if redirect_url was created by barcode endpoint
                        if (item.redirect_url && item.redirect_url.includes('/redirect/') && 
                            item.title && (item.title.toLowerCase().includes('barcode') || item.title.toLowerCase().includes('2d'))) {
                            console.log('✅ Found barcode by redirect pattern');
                            return true;
                        }
                        
                        return false;
                    });
                    console.log('🔍 Filtered barcode QRs:', qrData.length);

                    console.log('📊 Processing', qrData.length, 'barcode QR codes');

                    this.qrItems = qrData.map(item => {
                        console.log('🔍 Processing QR item:', item);
                        
                        // Determine display name and data
                        let displayName = '2D Barcode QR';
                        let barcodeData = '';
                        
                        if (item.content) {
                            let content = item.content;
                            
                            // Parse string content if needed
                            if (typeof content === 'string') {
                                try {
                                    content = JSON.parse(content);
                                } catch (e) {
                                    displayName = item.title || '2D Barcode QR';
                                    barcodeData = item.content;
                                    content = {};
                                }
                            }
                            
                            if (typeof content === 'object') {
                                displayName = item.title || content.title || '2D Barcode QR';
                                barcodeData = content.data || content.barcode_data || '';
                            }
                        } else {
                            displayName = item.title || '2D Barcode QR';
                        }

                        // Determine QR code value for scanning
                        let qrCodeValue = '';
                        if (item.redirect_url) {
                            qrCodeValue = item.redirect_url;
                        } else if (item.short_url) {
                            qrCodeValue = `${config.apiBaseUrl}/redirect/${item.short_url}`;
                        } else {
                            qrCodeValue = barcodeData;
                        }

                        const processedItem = {
                            id: item.id,
                            displayName: displayName,
                            url: barcodeData,
                            qrCodeValue: qrCodeValue,
                            type: '2D Barcode',
                            modified: new Date(item.updated_at || item.created_at).toLocaleDateString(),
                            originalData: item,
                            analytics: {
                                type: '2D Barcode',
                                enabled: item.analytics !== false
                            }
                        };

                        console.log('✅ Processed barcode QR item:', processedItem);
                        return processedItem;
                    });

                    console.log('✅ Final processed barcode QR items:', this.qrItems);
                } else {
                    console.log('📭 No barcode QR codes found');
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('❌ Error fetching barcode QR codes:', error);
                console.error('❌ Error response:', error.response?.data);
                this.qrItems = [];
            } finally {
                this.isLoading = false;
            }
        },

        async fetchQRCodesSilent() {
            // Silent version without loading state for refreshes
            try {
                console.log('🔍 Starting silent fetchQRCodes for 2D barcodes...');
                
                // Get all dynamic QR codes since backend doesn't filter barcode service properly
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'dynamic',
                        page: 1,
                        limit: 100 // Get all items for client-side pagination
                    }
                });

                if (response.data && response.data.data) {
                    let qrData = response.data.data;
                    
                    // Apply client-side filtering for barcode QR codes
                    qrData = qrData.filter(item => {
                        // Check if service is explicitly set to barcode
                        if (item.service === 'barcode') {
                            return true;
                        }
                        
                        // Check content for barcode indicators
                        if (item.content) {
                            let content = item.content;
                            
                            // Parse string content if needed
                            if (typeof content === 'string') {
                                try {
                                    content = JSON.parse(content);
                                } catch (e) {
                                    return false;
                                }
                            }
                            
                            // Check for barcode service in content
                            if (content.service === 'barcode') {
                                return true;
                            }
                            
                            // Check for barcode data fields
                            if (content.data !== undefined || content.barcode_data !== undefined) {
                                return true;
                            }
                            
                            // Check if title suggests it's a barcode and has data-like content
                            if (item.title && item.title.toLowerCase().includes('barcode') && content.data) {
                                return true;
                            }
                        }
                        
                        // Check if redirect_url was created by barcode endpoint
                        if (item.redirect_url && item.redirect_url.includes('/redirect/') && 
                            item.title && (item.title.toLowerCase().includes('barcode') || item.title.toLowerCase().includes('2d'))) {
                            return true;
                        }
                        
                        return false;
                    });

                    this.qrItems = qrData.map(item => {
                        let displayName = '2D Barcode QR';
                        let barcodeData = '';
                        
                        if (item.content) {
                            let content = item.content;
                            
                            // Parse string content if needed
                            if (typeof content === 'string') {
                                try {
                                    content = JSON.parse(content);
                                } catch (e) {
                                    displayName = item.title || '2D Barcode QR';
                                    barcodeData = item.content;
                                    content = {};
                                }
                            }
                            
                            if (typeof content === 'object') {
                                displayName = item.title || content.title || '2D Barcode QR';
                                barcodeData = content.data || content.barcode_data || '';
                            }
                        } else {
                            displayName = item.title || '2D Barcode QR';
                        }

                        let qrCodeValue = '';
                        if (item.redirect_url) {
                            qrCodeValue = item.redirect_url;
                        } else if (item.short_url) {
                            qrCodeValue = `${config.apiBaseUrl}/redirect/${item.short_url}`;
                        } else {
                            qrCodeValue = barcodeData;
                        }

                        return {
                            id: item.id,
                            displayName: displayName,
                            url: barcodeData,
                            qrCodeValue: qrCodeValue,
                            type: '2D Barcode',
                            modified: new Date(item.updated_at || item.created_at).toLocaleDateString(),
                            originalData: item,
                            analytics: {
                                type: '2D Barcode',
                                enabled: item.analytics !== false
                            }
                        };
                    });
                } else {
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('❌ Error in silent fetch:', error);
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        // Event Handlers
        handleEdit(qrItem) {
            console.log('🔧 Edit clicked for 2D Barcode QR Item:', qrItem);
            try {
                if (qrItem) {
                    this.selectedQRItem = { ...qrItem };
                    this.$nextTick(() => {
                        this.showEditPopup = true;
                    });
                    console.log('📝 Opening edit popup for:', qrItem);
                } else {
                    console.error('❌ QR item not provided');
                    alert('QR code not found. Please refresh the page.');
                }
            } catch (error) {
                console.error('❌ Error in handleEdit:', error);
                alert('An error occurred while opening the edit dialog.');
            }
        },

        handleDownload(qrItem) {
            console.log('📥 Download clicked for 2D Barcode QR Item:', qrItem);
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
            console.log('🗑️ Delete clicked for 2D Barcode QR Item:', qrItem);
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

        handleAnalytics(qrItem) {
            console.log('📊 Analytics clicked for 2D Barcode QR Item:', qrItem);
            try {
                if (qrItem) {
                    this.selectedQRItem = qrItem;
                    this.showAnalytics = true;
                    console.log('📊 Opening analytics for:', qrItem);
                } else {
                    console.error('QR item not provided for analytics');
                    alert('QR code not found');
                }
            } catch (error) {
                console.error('Error opening analytics:', error);
                alert('Failed to open analytics');
            }
        },

        closeAnalytics() {
            this.showAnalytics = false;
            this.selectedQRItem = null;
        },

        // Modal Management
        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        },

        closeEditPopup() {
            this.showEditPopup = false;
            this.$nextTick(() => {
                this.selectedQRItem = null;
            });
        },

        async saveEditedQRCode(updatedData) {
            try {
                console.log('💾 Saving edited 2D Barcode QR code:', updatedData);
                
                if (!this.selectedQRItem || !this.selectedQRItem.id) {
                    throw new Error('No QR code selected for editing');
                }

                let contentToSave;
                
                // Handle the updated barcode content
                if (updatedData.content) {
                    contentToSave = updatedData.content;
                } else if (typeof updatedData === 'string') {
                    // Fallback for simple string updates
                    contentToSave = {
                        ...this.selectedQRItem.originalData.content,
                        data: updatedData
                    };
                } else {
                    contentToSave = this.selectedQRItem.originalData.content;
                }

                const payload = {
                    type: 'dynamic',
                    service: 'barcode',
                    title: contentToSave.title || updatedData.title || '2DBarcodeQR',
                    content: contentToSave,
                    analytics: this.selectedQRItem.originalData?.analytics !== undefined ? this.selectedQRItem.originalData.analytics : true,
                    active: this.selectedQRItem.originalData?.active !== undefined ? this.selectedQRItem.originalData.active : true
                };

                console.log('💾 Sending 2D barcode payload:', payload);

                const response = await axios.put(`/api/qr/${this.selectedQRItem.id}`, payload);

                if (response.data) {
                    console.log('✅ 2D Barcode QR code updated successfully');
                    this.closeEditPopup();
                    await this.fetchQRCodesSilent();
                    alert('2D Barcode QR code updated successfully!');
                } else {
                    throw new Error('No response data received');
                }
            } catch (error) {
                console.error('❌ Error updating 2D Barcode QR code:', error);
                console.error('❌ Error response:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to update 2D Barcode QR code: ${errorMessage}`);
            }
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.$nextTick(() => {
                this.selectedQRItem = null;
            });
        },

        async confirmDelete() {
            if (this.isDeleting) {
                console.log('🔄 Delete already in progress, skipping...');
                return;
            }
            
            this.isDeleting = true;
            
            try {
                if (!this.selectedQRItem || !this.selectedQRItem.id) {
                    throw new Error('No QR code selected for deletion');
                }

                console.log('🗑️ Deleting 2D Barcode QR code:', this.selectedQRItem.id);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                console.log('✅ 2D Barcode QR code deleted successfully');
                this.closeDeleteConfirmation();
                
                await this.fetchQRCodesSilent();
                alert('2D Barcode QR code deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting 2D Barcode QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                
                if (error.response?.status === 404) {
                    console.warn('⚠️ QR code not found (404), refreshing list');
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodesSilent();
                    alert('QR code was already deleted or does not exist. Refreshing the list.');
                } else {
                    alert(`Failed to delete 2D Barcode QR code: ${errorMessage}`);
                }
            } finally {
                this.isDeleting = false;
            }
        }
    }
};
</script>