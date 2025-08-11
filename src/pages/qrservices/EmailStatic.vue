
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
                                <form @submit.prevent="generateEmailQRCode" class="w-full">
                                    <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative">
                                        <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                            <div class="text-sm font-medium text-gray-700 mb-2">
                                                Email QR Code - Static Mode
                                            </div>
                                            
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Recipient Email"
                                                placeholder="recipient@example.com" 
                                                v-model="formData.email_recipient" 
                                                type="email"
                                                required 
                                            />
                                            
                                            <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                                <input-field-vue 
                                                    class="w-full" 
                                                    label="Email Subject" 
                                                    placeholder="Enter email subject"
                                                    v-model="formData.email_subject" 
                                                />
                                                <input-field-vue 
                                                    class="w-full" 
                                                    label="Email Body" 
                                                    placeholder="Enter email message"
                                                    v-model="formData.email_body" 
                                                />
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
                                                    <span v-else>Generate Email QR Code</span>
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
                                        Static Email QR Codes
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
                                    <Icon name="ph:envelope" class="w-12 h-12 mb-2" />
                                    <p>No static email QR codes found</p>
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
            :item-type="selectedQRItem.analytics?.type || 'Email QR'"
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
    name: "EmailStatic",
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
                email_recipient: '',
                email_subject: '',
                email_body: ''
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
        async generateEmailQRCode() {
            this.isGenerating = true;
            try {
                const payload = {
                    type: "static",
                    service: "email",
                    title: `Email QR - ${this.formData.email_recipient}`,
                    content: {
                        service: "email",
                        recipient: this.formData.email_recipient.trim(),
                        subject: this.formData.email_subject.trim(),
                        body: this.formData.email_body.trim()
                    },
                    is_dynamic: false,
                    analytics: false,
                    active: true
                };

                console.log('🚀 Sending static email QR payload:', payload);

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    // For static QR codes, create mailto URL
                    const qrContent = this.generateMailtoURL(
                        this.formData.email_recipient.trim(),
                        this.formData.email_subject.trim(),
                        this.formData.email_body.trim()
                    );
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Clear form
                    this.formData = {
                        email_recipient: '',
                        email_subject: '',
                        email_body: ''
                    };
                    
                    // Refresh QR codes list
                    await this.fetchQRCodesSilent();
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Email QR code:', error);
                alert('Failed to generate QR code. Please try again.');
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
                    
                    // Client-side filter for static email QRs
                    qrData = qrData.filter(qr => {
                        const isStaticEmailQR = qr.type === 'static' && 
                                               qr.content && 
                                               qr.content.service === 'email';
                        return isStaticEmailQR;
                    });

                    console.log('📧 Filtered static email QRs:', qrData);

                    this.qrItems = qrData.map(qr => {
                        const mailtoUrl = this.generateMailtoURL(
                            qr.content.recipient || '',
                            qr.content.subject || '',
                            qr.content.body || ''
                        );

                        return {
                            id: qr.id,
                            url: mailtoUrl,
                            qrCodeValue: mailtoUrl,
                            displayName: qr.title || `Email QR - ${qr.content.recipient}`,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Email',
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
                    
                    // Client-side filter for static email QRs
                    qrData = qrData.filter(qr => {
                        const isStaticEmailQR = qr.type === 'static' && 
                                               qr.content && 
                                               qr.content.service === 'email';
                        return isStaticEmailQR;
                    });

                    this.qrItems = qrData.map(qr => {
                        const mailtoUrl = this.generateMailtoURL(
                            qr.content.recipient || '',
                            qr.content.subject || '',
                            qr.content.body || ''
                        );

                        return {
                            id: qr.id,
                            url: mailtoUrl,
                            qrCodeValue: mailtoUrl,
                            displayName: qr.title || `Email QR - ${qr.content.recipient}`,
                            selected: false,
                            modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                            analytics: {
                                type: 'Email',
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

        generateMailtoURL(recipient, subject, body) {
            let url = `mailto:${recipient}`;
            const params = [];
            
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            
            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }
            
            return url;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        handleDownload(qrItem) {
            this.downloadQRContent = qrItem.qrCodeValue || qrItem.url;
            this.showDownloadModal = true;
        },

        handleDelete(qrItem) {
            this.selectedQRItem = qrItem;
            this.showDeleteConfirmation = true;
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
                    alert('QR code was already deleted or does not exist. List refreshed.');
                } else {
                    alert(`Failed to delete QR code: ${errorMessage}`);
                }
            } finally {
                this.isDeleting = false;
            }
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.selectedQRItem = null;
            this.isDeleting = false; // Reset deleting state
        },

        closeQRCodeModal() {
            this.showQRCodeModal = false;
            this.qrCodeContent = '';
        },

        closeDownloadModal() {
            this.showDownloadModal = false;
            this.downloadQRContent = '';
        }
    }
};
</script>