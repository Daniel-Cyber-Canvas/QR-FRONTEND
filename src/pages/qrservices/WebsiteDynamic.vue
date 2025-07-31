<template>
    <div class="min-h-screen bg-gray-50">
        <side-navigation>
              <div
                class="bg-[#ffffff] flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                <div
                    class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                </div>
                <div
                    class="bg-[#ffffff] p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">
            <!-- Main content container with max width -->
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative max-w-none w-full">
                <!-- Form Section -->
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <form @submit.prevent="generateWebsiteQRCode" class="w-full ">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative ">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-sm font-medium text-gray-700 mb-2">
                                        Website QR Code - Dynamic Mode
                                    </div>
                                    
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Website URL"
                                        placeholder="https://example.com" 
                                        v-model="formData.website_url" 
                                        type="url"
                                        required 
                                    />
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics-website" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                        >
                                        <label for="analytics-website" class="text-sm text-gray-700">Enable Analytics Tracking</label>
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
                                            <span v-else>Generate Website QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- QR Codes List Section - Full Width -->
                <div class="flex flex-col gap-4 items-start justify-start w-full shrink-0 relative">
                    <div class="bg-white rounded border-solid border-[#e2e8f0] border p-4 flex flex-col gap-4 items-start justify-start w-full relative ">
                        <div class="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                            <div class="text-lg font-semibold text-gray-800">
                                Dynamic Website QR Codes
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
                            <p>No dynamic website QR codes found</p>
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
                        
                        <!-- Remove duplicate pagination section -->
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
            :item-type="selectedQRItem.analytics?.type || 'Website QR'"
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
    name: "WebsiteDynamic",
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
                website_url: '',
                analytics: true
            },
            qrCodeContent: '',
            showQRCodeModal: false,
            isGenerating: false,
            isLoading: false,
            isDeleting: false,
            qrItems: [],
            currentPage: 1,
            itemsPerPage: 5, // Changed from limit: 10 to itemsPerPage: 5
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
        async generateWebsiteQRCode() {
            this.isGenerating = true;
            try {
                const payload = {
                    type: "dynamic",
                    service: "website",
                    title: "WebsiteQR",
                    content: {
                        url: this.formData.website_url.trim()
                    },
                    analytics: this.formData.analytics,
                    active: true
                };

                console.log('🚀 Sending payload:', payload);
                console.log('🚀 Payload JSON:', JSON.stringify(payload, null, 2));

                const response = await axios.post('/api/qr', payload);
                
                console.log('📥 Full creation response:', response);
                console.log('📥 Creation response data:', response.data);
                console.log('📥 Response data JSON:', JSON.stringify(response.data, null, 2));
                
                if (response.data) {
                    // Log the exact structure of what was created
                    console.log('✅ QR Code created with structure:', {
                        id: response.data.id,
                        type: response.data.type,
                        service: response.data.service,
                        title: response.data.title,
                        content: response.data.content,
                        hasUrl: !!response.data.content?.url,
                        hasName: !!response.data.content?.name,
                        hasEmail: !!response.data.content?.email
                    });
                    
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
                    
                    // Reset form
                    this.formData.website_url = '';
                    
                    // Single refresh with a delay to ensure backend processing
                    console.log('🔄 Refreshing QR list after creation...');
                    console.log('🔄 Looking for newly created QR with ID:', response.data.id);
                    
                    setTimeout(async () => {
                        await this.fetchQRCodes();
                    }, 1000);
                    
                    console.log('Generated Dynamic Website QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Website QR code:', error);
                console.error('Error details:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Website QR code: ${errorMessage}`);
            } finally {
                this.isGenerating = false;
            }
        },

        async fetchQRCodesSilent() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting silent fetchQRCodes...');
                
                // Try with both filters first
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'dynamic',
                        service: 'website',
                        page: this.currentPage,
                        limit: this.itemsPerPage // Fixed: was this.limit
                    }
                });

                console.log('🔍 Fetch response with filters:', response.data);

                // If no results, try with just type=dynamic and filter client-side
                if (!response.data.data || response.data.data.length === 0) {
                    console.log('🔄 No results with service filter, trying type=dynamic only...');
                    
                    response = await axios.get('/api/qr', {
                        params: {
                            type: 'dynamic',
                            page: 1,
                            limit: 50
                        }
                    });
                    console.log('🔍 Fetch response without service filter (increased limit):', response.data);
                }

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for website QRs
                    qrData = qrData.filter(qr => {
                        const isWebsiteQR = (qr.content && qr.content.url && !qr.content.name && !qr.content.email) ||
                                          (qr.title && qr.title.toLowerCase().includes('websiteqr'));
                        return isWebsiteQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        // Construct the full redirect URL for QR code display
                        let fullRedirectUrl;
                        if (qr.redirect_url) {
                            fullRedirectUrl = qr.redirect_url;
                        } else if (qr.short_url) {
                            // Construct full URL from short_url identifier
                            fullRedirectUrl = `${config.apiBaseUrl}/scan/${qr.short_url}`;
                        } else {
                            fullRedirectUrl = qr.content?.url || 'N/A';
                        }

                        return {
                            id: qr.id,
                            // Show original URL from content for display
                            url: qr.content?.url || 'N/A',
                            // For QR code display, use the full redirect URL
                            qrCodeValue: fullRedirectUrl,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Website',
                                scans: qr.scan_count || 0,
                                uniqueScans: qr.unique_scan_count || 0
                            },
                            originalData: qr
                        };
                    });

                    // Remove this line as totalPages is now computed
                    // this.totalPages = Math.ceil(this.qrItems.length / this.itemsPerPage);
                } else {
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('Silent refresh error:', error);
                // Don't show alert for silent refresh
            } finally {
                this.isLoading = false;
            }
        },

        async fetchQRCodes() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting fetchQRCodes...');
                
                // Fetch all website QR codes (not paginated on backend)
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'dynamic',
                        service: 'website',
                        page: 1,
                        limit: 100 // Get more items to handle pagination client-side
                    }
                });

                console.log('🔍 Fetch response with filters:', response.data);

                // If no results, try with just type=dynamic and filter client-side
                if (!response.data.data || response.data.data.length === 0) {
                    console.log('🔄 No results with service filter, trying type=dynamic only...');
                    
                    response = await axios.get('/api/qr', {
                        params: {
                            type: 'dynamic',
                            page: 1,
                            limit: 100
                        }
                    });
                    console.log('🔍 Fetch response without service filter (increased limit):', response.data);
                }

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for website QRs
                    qrData = qrData.filter(qr => {
                        const isWebsiteQR = (qr.content && qr.content.url && !qr.content.name && !qr.content.email) ||
                                          (qr.title && qr.title.toLowerCase().includes('websiteqr'));
                        return isWebsiteQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        // Construct the full redirect URL for QR code display
                        let fullRedirectUrl;
                        if (qr.redirect_url) {
                            fullRedirectUrl = qr.redirect_url;
                        } else if (qr.short_url) {
                            fullRedirectUrl = `${config.apiBaseUrl}/scan/${qr.short_url}`;
                        } else {
                            fullRedirectUrl = qr.content?.url || 'N/A';
                        }

                        return {
                            id: qr.id,
                            url: qr.content?.url || 'N/A',
                            qrCodeValue: fullRedirectUrl,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Website',
                                scans: qr.scan_count || 0,
                                uniqueScans: qr.unique_scan_count || 0
                            },
                            originalData: qr
                        };
                    });

                    console.log('🔄 Final transformed QR Items:', this.qrItems);
                } else {
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('Error fetching QR codes:', error);
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
                // No need to fetch again since we're doing client-side pagination
            }
        },

        // Event Handlers - Fixed to accept qrItem object directly
        handleEdit(qrItem) {
            console.log('🔧 Edit clicked for QR Item:', qrItem);
            try {
                if (qrItem) {
                    this.selectedQRItem = { ...qrItem }; // Create a copy to avoid reactivity issues
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
            console.log('📥 Download clicked for QR Item:', qrItem);
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
            console.log('🗑️ Delete clicked for QR Item:', qrItem);
            console.log('🗑️ Current QR Items:', this.qrItems.map(item => ({ id: item.id, url: item.url })));
            try {
                if (qrItem) {
                    console.log('🗑️ Found QR Item:', qrItem);
                    console.log('🗑️ Original Data:', qrItem.originalData);
                    this.selectedQRItem = { ...qrItem }; // Create a copy to avoid reactivity issues
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
            console.log('📊 Analytics clicked for QR Item:', qrItem);
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

        // Modal Management - Fixed with proper cleanup
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
                console.log('💾 Saving edited QR code:', updatedData);
                
                if (!this.selectedQRItem || !this.selectedQRItem.id) {
                    throw new Error('No QR code selected for editing');
                }

                // Extract the URL properly - handle the case where updatedData might be the full object
                let urlToSave;
                if (typeof updatedData === 'string') {
                    urlToSave = updatedData;
                } else if (updatedData.url) {
                    urlToSave = updatedData.url;
                } else if (updatedData.editableUrl) {
                    urlToSave = updatedData.editableUrl;
                } else {
                    throw new Error('No URL found in updated data');
                }

                console.log('💾 URL to save:', urlToSave);

                const payload = {
                    type: 'dynamic',
                    service: 'website',
                    title: 'WebsiteQR',
                    content: {
                        url: urlToSave.trim(),
                        service: 'website'
                    },
                    analytics: this.selectedQRItem.originalData?.analytics !== undefined ? this.selectedQRItem.originalData.analytics : true,
                    active: this.selectedQRItem.originalData?.active !== undefined ? this.selectedQRItem.originalData.active : true
                };

                console.log('💾 Sending payload:', payload);

                const response = await axios.put(`/api/qr/${this.selectedQRItem.id}`, payload);

                if (response.data) {
                    console.log('✅ QR code updated successfully');
                    this.closeEditPopup();
                    // Use silent refresh to avoid double notifications
                    await this.fetchQRCodesSilent();
                    alert('QR code updated successfully!');
                } else {
                    throw new Error('No response data received');
                }
            } catch (error) {
                console.error('❌ Error updating QR code:', error);
                console.error('❌ Error response:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to update QR code: ${errorMessage}`);
            }
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

                console.log('🗑️ Deleting QR code:', this.selectedQRItem.id);
                console.log('🗑️ Selected QR Item:', this.selectedQRItem);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                console.log('✅ QR code deleted successfully');
                this.closeDeleteConfirmation();
                
                // Use silent refresh to avoid double notifications
                await this.fetchQRCodesSilent();
                
                // Show success message only once
                alert('QR code deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                
                if (error.response?.status === 404) {
                    // Handle 404 specifically - QR code doesn't exist
                    console.warn('⚠️ QR code not found (404), refreshing list');
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodesSilent();
                    alert('QR code was already deleted or does not exist. Refreshing the list.');
                } else {
                    alert(`Failed to delete QR code: ${errorMessage}`);
                }
            } finally {
                this.isDeleting = false;
            }
        },

        closeAnalytics() {
            this.showAnalytics = false;
            this.$nextTick(() => {
                this.selectedQRAnalytics = null;
            });
        }
    }
};
</script>