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
                        <form @submit.prevent="generateVirtualCardQRCode" class="w-full">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative ">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <div class="text-lg font-semibold text-gray-800 mb-2">
                                        Virtual Card QR Code - Dynamic Mode
                                    </div>
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="First Name" 
                                            placeholder="John"
                                            v-model="formData.firstName" 
                                            required 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Last Name" 
                                            placeholder="Doe"
                                            v-model="formData.lastName" 
                                            required 
                                        />
                                    </div>
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Phone" 
                                            placeholder="+260 123 456 789"
                                            v-model="formData.phone" 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Phone2" 
                                            placeholder="+260 123 456 789"
                                            v-model="formData.phone2" 
                                        />
                                    </div>
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Email Address"
                                        placeholder="JohnDoe@gmail.com" 
                                        v-model="formData.email" 
                                        type="email"
                                        required 
                                    />
                                    <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Company Name"
                                            placeholder="John Doe's Company" 
                                            v-model="formData.company" 
                                        />
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Role" 
                                            placeholder="CEO"
                                            v-model="formData.job" 
                                        />
                                    </div>
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Physical Address"
                                        placeholder="P.O Box 123" 
                                        v-model="formData.address" 
                                    />
                                    
                                    <!-- Analytics Option for Dynamic Mode -->
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                        >
                                        <label for="analytics" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            :disabled="isGenerating"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                                        >
                                            <span v-if="isGenerating" class="flex items-center gap-2">
                                                <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
                                                Generating...
                                            </span>
                                            <span v-else>Generate Virtual Card QR Code</span>
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
                                Dynamic Virtual Card QR Codes
                            </div>
                            <button 
                                @click="fetchQRCodes"
                                :disabled="isLoading"
                                class="bg-[#0c768a] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                            >
                                <span v-if="isLoading" class="flex items-center gap-2">
                                    <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
                                    Loading...
                                </span>
                                <span v-else>Refresh</span>
                            </button>
                        </div>
                        
                        <!-- Loading State -->
                        <div v-if="isLoading && qrItems.length === 0" class="flex flex-col gap-4 items-center justify-center w-full py-8">
                            <Icon name="ph:spinner" class="w-8 h-8 animate-spin text-[#0c768a]" />
                            <p class="text-gray-600">Loading virtual card QR codes...</p>
                        </div>
                        
                        <!-- Empty State -->
                        <div v-else-if="qrItems.length === 0" class="flex flex-col gap-4 items-center justify-center w-full py-8">
                            <Icon name="ph:identification-card" class="w-12 h-12 text-gray-400" />
                            <p class="text-gray-600">No dynamic virtual card QR codes found.</p>
                            <p class="text-sm text-gray-500">Create your first virtual card QR code using the form above.</p>
                        </div>
                        
                        <!-- QR Items List -->
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
            :item-type="selectedQRItem.analytics?.type || 'Virtual Card QR'"
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
    name: "VirtualCardDynamic",
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
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                phone2: '',
                company: '',
                job: '',
                address: '',
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
        async generateVirtualCardQRCode() {
            this.isGenerating = true;
            try {
                const payload = {
                    type: "dynamic",
                    service: "virtualcard",
                    title: "VirtualCardQR",
                    content: {
                        firstName: this.formData.firstName.trim(),
                        lastName: this.formData.lastName.trim(),
                        name: `${this.formData.firstName.trim()} ${this.formData.lastName.trim()}`,
                        organization: this.formData.company.trim(),
                        company: this.formData.company.trim(),
                        title: this.formData.job.trim(),
                        job: this.formData.job.trim(),
                        phone: this.formData.phone.trim(),
                        phone2: this.formData.phone2.trim(),
                        email: this.formData.email.trim(),
                        address: this.formData.address.trim()
                    },
                    analytics: this.formData.analytics,
                    active: true
                };

                console.log('🚀 Sending virtual card payload:', payload);

                const response = await axios.post('/api/qr', payload);
                
                console.log('📥 Virtual card creation response:', response.data);
                
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
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to vCard format');
                        qrContent = this.generateVCardString(this.formData);
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.resetForm();
                    
                    // Refresh QR list with a delay to ensure backend processing
                    console.log('🔄 Refreshing QR list after creation...');
                    setTimeout(async () => {
                        await this.fetchQRCodes();
                    }, 1000);
                    
                    console.log('Generated Dynamic Virtual Card QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Virtual Card QR code:', error);
                console.error('Error details:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Virtual Card QR code: ${errorMessage}`);
            } finally {
                this.isGenerating = false;
            }
        },

        resetForm() {
            this.formData = {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                phone2: '',
                company: '',
                job: '',
                address: '',
                analytics: true
            };
        },

        async fetchQRCodesSilent() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting silent fetchQRCodes for virtual cards...');
                
                // Try with both filters first
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'dynamic',
                        service: 'virtualcard',
                        page: 1,
                        limit: 100
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
                    console.log('🔍 Fetch response without service filter:', response.data);
                }

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for virtual card QRs
                    qrData = qrData.filter(qr => {
                        const isVirtualCardQR = (qr.content && (qr.content.firstName || qr.content.name || qr.content.email) && !qr.content.url) ||
                                              (qr.title && qr.title.toLowerCase().includes('virtualcard')) ||
                                              (qr.service === 'virtualcard');
                        return isVirtualCardQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        // Construct the full redirect URL for QR code display
                        let fullRedirectUrl;
                        if (qr.redirect_url) {
                            fullRedirectUrl = qr.redirect_url;
                        } else if (qr.short_url) {
                            fullRedirectUrl = `${config.apiBaseUrl}/scan/${qr.short_url}`;
                        } else {
                            fullRedirectUrl = this.generateVCardString(qr.content) || 'N/A';
                        }

                        // Create display name from content
                        const displayName = qr.content?.name || 
                                          `${qr.content?.firstName || ''} ${qr.content?.lastName || ''}`.trim() ||
                                          qr.content?.email || 
                                          'Virtual Card';

                        return {
                            id: qr.id,
                            // Show virtual card name for display
                            url: displayName,
                            // For QR code display, use the full redirect URL
                            qrCodeValue: fullRedirectUrl,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Virtual Card',
                                scans: qr.scan_count || 0,
                                uniqueScans: qr.unique_scan_count || 0
                            },
                            originalData: qr
                        };
                    });
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
                console.log('🔍 Starting fetchQRCodes for virtual cards...');
                
                // Fetch all virtual card QR codes
                let response = await axios.get('/api/qr', {
                    params: {
                        type: 'dynamic',
                        service: 'virtualcard',
                        page: 1,
                        limit: 100
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
                    console.log('🔍 Fetch response without service filter:', response.data);
                }

                if (response.data) {
                    let qrData = response.data.data || [];
                    
                    // Client-side filter for virtual card QRs
                    qrData = qrData.filter(qr => {
                        const isVirtualCardQR = (qr.content && (qr.content.firstName || qr.content.name || qr.content.email) && !qr.content.url) ||
                                              (qr.title && qr.title.toLowerCase().includes('virtualcard')) ||
                                              (qr.service === 'virtualcard');
                        return isVirtualCardQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        // Construct the full redirect URL for QR code display
                        let fullRedirectUrl;
                        if (qr.redirect_url) {
                            fullRedirectUrl = qr.redirect_url;
                        } else if (qr.short_url) {
                            fullRedirectUrl = `${config.apiBaseUrl}/scan/${qr.short_url}`;
                        } else {
                            fullRedirectUrl = this.generateVCardString(qr.content) || 'N/A';
                        }

                        // Create display name from content
                        const displayName = qr.content?.name || 
                                          `${qr.content?.firstName || ''} ${qr.content?.lastName || ''}`.trim() ||
                                          qr.content?.email || 
                                          'Virtual Card';

                        return {
                            id: qr.id,
                            url: displayName,
                            qrCodeValue: fullRedirectUrl,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Virtual Card',
                                scans: qr.scan_count || 0,
                                uniqueScans: qr.unique_scan_count || 0
                            },
                            originalData: qr
                        };
                    });

                    console.log('🔄 Final transformed Virtual Card QR Items:', this.qrItems);
                } else {
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('Error fetching Virtual Card QR codes:', error);
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

        // Event Handlers - Fixed to accept qrItem object directly
        handleEdit(qrItem) {
            console.log('🔧 Edit clicked for Virtual Card QR Item:', qrItem);
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
            console.log('📥 Download clicked for Virtual Card QR Item:', qrItem);
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
            console.log('🗑️ Delete clicked for Virtual Card QR Item:', qrItem);
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
            console.log('📊 Analytics clicked for Virtual Card QR Item:', qrItem);
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
                console.log('💾 Saving edited Virtual Card QR code:', updatedData);
                
                if (!this.selectedQRItem || !this.selectedQRItem.id) {
                    throw new Error('No QR code selected for editing');
                }

                let contentToSave;
                
                // Handle the updated virtual card content
                if (updatedData.content) {
                    // Use the updated content from the edit popup
                    contentToSave = updatedData.content;
                } else if (typeof updatedData === 'string') {
                    // Fallback for simple string updates
                    contentToSave = {
                        ...this.selectedQRItem.originalData.content,
                        name: updatedData,
                        firstName: updatedData.split(' ')[0] || '',
                        lastName: updatedData.split(' ').slice(1).join(' ') || ''
                    };
                } else {
                    // Use original content if no specific updates
                    contentToSave = this.selectedQRItem.originalData.content;
                }

                const payload = {
                    type: 'dynamic',
                    service: 'virtualcard',
                    title: 'VirtualCardQR',
                    content: contentToSave,
                    analytics: this.selectedQRItem.originalData?.analytics !== undefined ? this.selectedQRItem.originalData.analytics : true,
                    active: this.selectedQRItem.originalData?.active !== undefined ? this.selectedQRItem.originalData.active : true
                };

                console.log('💾 Sending virtual card payload:', payload);

                const response = await axios.put(`/api/qr/${this.selectedQRItem.id}`, payload);

                if (response.data) {
                    console.log('✅ Virtual Card QR code updated successfully');
                    this.closeEditPopup();
                    await this.fetchQRCodesSilent();
                    alert('Virtual Card QR code updated successfully!');
                } else {
                    throw new Error('No response data received');
                }
            } catch (error) {
                console.error('❌ Error updating Virtual Card QR code:', error);
                console.error('❌ Error response:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to update Virtual Card QR code: ${errorMessage}`);
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

                console.log('🗑️ Deleting Virtual Card QR code:', this.selectedQRItem.id);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                console.log('✅ Virtual Card QR code deleted successfully');
                this.closeDeleteConfirmation();
                
                await this.fetchQRCodesSilent();
                alert('Virtual Card QR code deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting Virtual Card QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                
                if (error.response?.status === 404) {
                    console.warn('⚠️ QR code not found (404), refreshing list');
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodesSilent();
                    alert('QR code was already deleted or does not exist. Refreshing the list.');
                } else {
                    alert(`Failed to delete Virtual Card QR code: ${errorMessage}`);
                }
            } finally {
                this.isDeleting = false;
            }
        },

        generateVCardString(data) {
            if (!data) return '';
            
            const fields = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim()}`,
                `N:${data.lastName || ''};${data.firstName || ''};;;`,
                data.phone && `TEL;TYPE=CELL:${data.phone}`,
                data.phone2 && `TEL;TYPE=WORK:${data.phone2}`,
                data.email && `EMAIL:${data.email}`,
                (data.organization || data.company) && `ORG:${data.organization || data.company}`,
                (data.title || data.job) && `TITLE:${data.title || data.job}`,
                data.address && `ADR;TYPE=WORK:;;${data.address};;;;`,
                'END:VCARD'
            ].filter(Boolean).join('\n');

            return fields;
        }
    }
};
</script>

<style scoped></style> 
 //this is a comment for a change
  //this is a comment for a change