
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
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-2 flex flex-col gap-4 items-start justify-start flex-1 relative ">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                     <div class="text-sm font-medium text-gray-700 mb-2">
                                        PDF QR Code - Dynamic Mode
                                    </div>
                                    <input-field-vue 
                                        class="w-full" 
                                        label="QR Code Title"
                                        placeholder="My PDF Document" 
                                        v-model="formData.title" 
                                        required 
                                    />
                                    
                                    <div class="flex flex-col gap-2 w-full">
                                        <label class="text-sm font-medium text-gray-700">PDF File</label>
                                        <div class="relative">
                                            <input 
                                                type="file" 
                                                accept=".pdf"
                                                @change="handleFileSelect"
                                                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
                                                required
                                            >
                                            <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                                                <Icon name="ph:file-pdf" class="inline w-4 h-4 mr-1" />
                                                {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">Maximum file size: 10MB</p>
                                    </div>
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            checked
                                        >
                                        <label for="analytics" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                    </div>
                                    
                                    <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                        <button
                                            type="submit"
                                            :disabled="isUploading"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span v-if="isUploading" class="flex items-center gap-2">
                                                <Icon name="ph:spinner" class="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </span>
                                            <span v-else>Generate PDF QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <!-- QR Management Section -->
                        <div class="pr-[30px] self-stretch shrink-0 relative">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-6 ">
                                <div class="flex flex-row items-center justify-between mb-4">
                                    <h3 class="text-lg font-semibold text-gray-800">Your PDF QR Codes</h3>
                                    <button 
                                        @click="fetchQRCodes" 
                                        :disabled="isLoading"
                                        class="bg-[#0c768a] text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 disabled:opacity-50"
                                    >
                                        <Icon v-if="isLoading" name="ph:spinner" class="w-4 h-4 animate-spin inline mr-1" />
                                        Refresh
                                    </button>
                                </div>

                                <!-- Loading State -->
                                <div v-if="isLoading" class="flex items-center justify-center py-8">
                                    <Icon name="ph:spinner" class="w-6 h-6 animate-spin text-[#0c768a] mr-2" />
                                    <span class="text-gray-600">Loading PDF QR codes...</span>
                                </div>

                                <!-- QR Items List -->
                                <div v-else-if="qrItems.length > 0" class="space-y-4">
                                    <div v-for="qrItem in paginatedQRItems" :key="qrItem.id">
                                        <QRCodeItem
                                            :qr-item="qrItem"
                                            @edit="openEditPopup"
                                            @delete="openDeleteConfirmation"
                                            @analytics="openAnalytics"
                                            @download="downloadQR"
                                        />
                                    </div>

                                    <!-- Pagination -->
                                    <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                        <div class="text-sm text-gray-600">
                                            {{ paginationInfo }}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <button 
                                                @click="currentPage = Math.max(1, currentPage - 1)"
                                                :disabled="currentPage === 1"
                                                :class="[
                                                    'px-3 py-1 rounded text-sm transition-colors',
                                                    currentPage === 1 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                ]"
                                            >
                                                Previous
                                            </button>
                                            
                                            <span class="px-3 py-1 text-sm text-gray-600">
                                                Page {{ currentPage }} of {{ totalPages }}
                                            </span>
                                            
                                            <button 
                                                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                                                :disabled="currentPage === totalPages"
                                                :class="[
                                                    'px-3 py-1 rounded text-sm transition-colors',
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

                                <!-- Empty State -->
                                <div v-else class="text-center py-8">
                                    <Icon name="ph:file-pdf" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p class="text-gray-600 mb-2">No PDF QR codes found</p>
                                    <p class="text-sm text-gray-500">Create your first PDF QR code using the form above</p>
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
            :item-type="selectedQRItem.analytics?.type || 'PDF QR'"
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
    name: "PDFDynamic",
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
                title: '',
                analytics: true
            },
            selectedFile: null,
            isUploading: false,
            isLoading: false,
            isDeleting: false,
            showQRCodeModal: false,
            qrCodeContent: '',
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
        async generateQRCode() {
            await this.generatePDFQRCode();
        },
        
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (file.type !== 'application/pdf') {
                    alert('Please select a valid PDF file.');
                    return;
                }
                
                // Validate file size (10MB limit)
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (file.size > maxSize) {
                    alert('PDF file size must be less than 10MB.');
                    return;
                }
                
                this.selectedFile = file;
            }
        },
        
        async generatePDFQRCode() {
            if (!this.selectedFile) {
                alert('Please select a PDF file.');
                return;
            }

            this.isUploading = true;

            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('title', this.formData.title.trim());
                formData.append('is_dynamic', true);
                formData.append('analytics', this.formData.analytics);

                const response = await axios.post('/api/qr/pdf', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

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
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.resetForm();
                    
                    // Refresh QR list with a delay to ensure backend processing
                    setTimeout(async () => {
                        await this.fetchQRCodes();
                    }, 1000);
                    
                    console.log('Generated Dynamic PDF QR:', qrContent);
                    console.log('Response data:', response.data);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating PDF QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate PDF QR code: ${errorMessage}`);
            } finally {
                this.isUploading = false;
            }
        },

        resetForm() {
            this.formData.title = '';
            this.selectedFile = null;
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }
        },

        // QR Management Methods
        async fetchQRCodes() {
            this.isLoading = true;
            try {
                const response = await axios.get('/api/qr');
                console.log('📥 Fetched QR codes:', response.data);
                
                // Handle the new response format with data, filters, and pagination
                const qrData = response.data?.data || response.data;
                
                if (qrData && Array.isArray(qrData)) {
                    // Log all QR codes to see their structure
                    console.log('🔍 All QR codes before filtering:', qrData);
                    
                    // Filter for PDF QR codes and transform data
                    this.qrItems = qrData
                        .filter(qr => {
                            // Log each QR code to understand the structure
                            console.log('🔍 Checking QR code:', qr);
                            
                            // Check if it's a PDF QR code based on content structure
                            const isPDF = qr.content?.type === 'pdf' || 
                                         qr.content?.filename || 
                                         qr.content?.file_ref_id ||
                                         (qr.service === 'pdf') ||
                                         (qr.redirect_url && qr.redirect_url.includes('.pdf')) ||
                                         (qr.title && qr.redirect_url && !qr.content?.url && !qr.content?.firstName);
                            
                            console.log(`🔍 QR ${qr.id} is PDF:`, isPDF);
                            return isPDF;
                        })
                        .map(qr => {
                            console.log('📄 Processing PDF QR:', qr);
                            
                            // For PDF QR codes, the QR code should contain the scan URL, not the direct PDF URL
                            let scanUrl;
                            if (qr.short_url) {
                                // Use the short URL to create the scan URL
                                scanUrl = `${config.apiBaseUrl}/scan/${qr.short_url}`;
                            } else if (qr.qr_code && !qr.qr_code.includes('/uploads/')) {
                                // If qr_code doesn't contain uploads path, use it directly
                                scanUrl = qr.qr_code;
                            } else {
                                // Fallback: construct scan URL from ID
                                scanUrl = `${config.apiBaseUrl}/scan/${qr.id}`;
                            }
                            
                            // Better display name logic - prioritize document title
                            let displayName = 'PDF Document';
                            if (qr.title && qr.title.trim()) {
                                displayName = qr.title.trim();
                            } else if (qr.content?.filename) {
                                displayName = qr.content.filename;
                            } else if (qr.content?.title) {
                                displayName = qr.content.title;
                            }
                            
                            const processedItem = {
                                id: qr.id,
                                // For QR code display, use the scan URL
                                url: displayName, // This will show as the main content URL
                                qrCodeValue: scanUrl,
                                downloadQRContent: scanUrl,
                                selected: false,
                                modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                                analytics: {
                                    type: 'PDF',
                                    scans: qr.scan_count || 0,
                                    uniqueScans: qr.unique_scan_count || 0
                                },
                                originalData: qr,
                                displayName: `QR-${qr.id}`,
                                displayDate: qr.created_at || qr.updated_at
                            };
                            
                            console.log('📄 Processed PDF item:', processedItem);
                            return processedItem;
                        });
                    
                    console.log('🎯 Final filtered PDF QR codes:', this.qrItems);
                } else {
                    console.warn('⚠️ Unexpected response format:', response.data);
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('❌ Error fetching QR codes:', error);
                this.qrItems = [];
            } finally {
                this.isLoading = false;
            }
        },

        async fetchQRCodesSilent() {
            try {
                const response = await axios.get('/api/qr');
                
                // Handle the new response format with data, filters, and pagination
                const qrData = response.data?.data || response.data;
                
                if (qrData && Array.isArray(qrData)) {
                    this.qrItems = qrData
                        .filter(qr => {
                            // Check if it's a PDF QR code based on content structure
                            const isPDF = qr.content?.type === 'pdf' || 
                                         qr.content?.filename || 
                                         qr.content?.file_ref_id ||
                                         (qr.service === 'pdf') ||
                                         (qr.redirect_url && qr.redirect_url.includes('.pdf')) ||
                                         (qr.title && qr.redirect_url && !qr.content?.url && !qr.content?.firstName);
                            return isPDF;
                        })
                        .map(qr => {
                            // For PDF QR codes, the QR code should contain the scan URL, not the direct PDF URL
                            let scanUrl;
                            if (qr.short_url) {
                                // Use the short URL to create the scan URL
                                scanUrl = `${config.apiBaseUrl}/scan/${qr.short_url}`;
                            } else if (qr.qr_code && !qr.qr_code.includes('/uploads/')) {
                                // If qr_code doesn't contain uploads path, use it directly
                                scanUrl = qr.qr_code;
                            } else {
                                // Fallback: construct scan URL from ID
                                scanUrl = `${config.apiBaseUrl}/scan/${qr.id}`;
                            }
                            
                            // Better display name logic
                            let displayName = 'PDF Document';
                            if (qr.title && qr.title.trim()) {
                                displayName = qr.title.trim();
                            } else if (qr.content?.filename) {
                                displayName = qr.content.filename;
                            } else if (qr.content?.title) {
                                displayName = qr.content.title;
                            }
                            
                            return {
                                id: qr.id,
                                // For QR code display, use the document title as the main content
                                url: displayName, // This will show as the main content URL
                                qrCodeValue: scanUrl,
                                downloadQRContent: scanUrl,
                                selected: false,
                                modified: new Date(qr.updated_at || qr.created_at).toLocaleDateString(),
                                analytics: {
                                    type: 'PDF',
                                    scans: qr.scan_count || 0,
                                    uniqueScans: qr.unique_scan_count || 0
                                },
                                originalData: qr,
                                displayName: `QR-${qr.id}`,
                                displayDate: qr.created_at || qr.updated_at
                            };
                        });
                }
            } catch (error) {
                console.error('Error silently fetching QR codes:', error);
            }
        },

        // Modal and popup handlers
        openEditPopup(qrItem) {
            console.log('🔧 Opening edit popup for:', qrItem);
            this.selectedQRItem = qrItem;
            this.showEditPopup = true;
        },

        closeEditPopup() {
            this.showEditPopup = false;
            this.selectedQRItem = null;
        },

        async saveEditedQRCode(updatedQRCode) {
            try {
                console.log('💾 Saving edited PDF QR code:', updatedQRCode);
                console.log('💾 Original data structure:', updatedQRCode.originalData);
                console.log('💾 QR Code ID:', updatedQRCode.id);
                console.log('💾 Has new file?:', !!updatedQRCode.newFile);
                console.log('💾 New file details:', updatedQRCode.newFile);
                
                let response;
                
                // Check if there's actually a new file to upload
                if (updatedQRCode.newFile && updatedQRCode.newFile instanceof File) {
                    // If a new file was uploaded, we need to create a new PDF QR code
                    // and then update the existing one with the new file reference
                    console.log('📁 New file detected, uploading new PDF file');
                    
                    const formData = new FormData();
                    formData.append('file', updatedQRCode.newFile);
                    
                    // Get the title from the correct location
                    const title = updatedQRCode.title || 
                                 updatedQRCode.content?.title || 
                                 updatedQRCode.originalData?.content?.title || 
                                 updatedQRCode.originalData?.title || 
                                 '';
                    
                    formData.append('title', title);
                    formData.append('is_dynamic', 'true');
                    formData.append('analytics', 'true');
                    
                    console.log('📁 FormData contents:', {
                        file: updatedQRCode.newFile.name,
                        title: title,
                        is_dynamic: 'true',
                        analytics: 'true'
                    });
                    
                    // First, create a new PDF QR code to get the file reference
                    console.log('📁 Creating new PDF QR code to get file reference');
                    const createResponse = await axios.post('/api/qr/pdf', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    console.log('📁 New PDF QR code created:', createResponse.data);
                    
                    // Now update the existing QR code with the new file reference
                    const newQRCode = createResponse.data.qr_code;
                    const newFileRef = createResponse.data.file_reference;
                    
                    const updatePayload = {
                        type: 'dynamic',
                        service: 'pdf',
                        title: title,
                        content: {
                            type: 'pdf',
                            url: newFileRef.url,
                            filename: newFileRef.filename,
                            file_size: newFileRef.size,
                            file_ref_id: newFileRef.id,
                            service: 'pdf'
                        },
                        analytics: true,
                        active: true
                    };
                    
                    console.log('📁 Updating existing QR code with new file reference:', updatePayload);
                    
                    response = await axios.put(`/api/qr/${updatedQRCode.id}`, updatePayload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    // Delete the temporary QR code we created
                    console.log('📁 Cleaning up temporary QR code:', newQRCode.id);
                    try {
                        await axios.delete(`/api/qr/${newQRCode.id}`);
                    } catch (cleanupError) {
                        console.warn('⚠️ Failed to cleanup temporary QR code:', cleanupError);
                    }
                    
                } else {
                    // If only title was changed, use regular JSON payload with proper structure
                    console.log('📝 Title-only update, using JSON approach');
                    
                    // Get the title from the correct location
                    const title = updatedQRCode.title || 
                                 updatedQRCode.content?.title || 
                                 updatedQRCode.originalData?.content?.title || 
                                 updatedQRCode.originalData?.title || 
                                 '';
                    
                    // Use the existing content structure but update the title
                    const existingContent = updatedQRCode.originalData?.content || {};
                    
                    const payload = {
                        type: updatedQRCode.originalData?.type || 'dynamic',
                        service: 'pdf',
                        title: title,
                        content: {
                            ...existingContent,
                            title: title,
                            service: 'pdf'
                        },
                        analytics: updatedQRCode.originalData?.analytics !== undefined ? 
                                  updatedQRCode.originalData.analytics : true,
                        active: updatedQRCode.originalData?.active !== undefined ? 
                               updatedQRCode.originalData.active : true
                    };
                    
                    console.log('📝 JSON payload:', payload);
                    console.log('📝 Making PUT request to:', `/api/qr/${updatedQRCode.id}`);
                    
                    response = await axios.put(`/api/qr/${updatedQRCode.id}`, payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
                
                console.log('✅ PDF QR code updated successfully:', response.data);
                
                // Show success notification
                alert('PDF QR code updated successfully!');
                
                // Close popup and refresh list
                this.closeEditPopup();
                await this.fetchQRCodesSilent();
                
            } catch (error) {
                console.error('❌ Error updating PDF QR code:', error);
                console.error('❌ Error response data:', error.response?.data);
                console.error('❌ Error response status:', error.response?.status);
                console.error('❌ Error response headers:', error.response?.headers);
                console.error('❌ Error config:', error.config);
                console.error('❌ Full error object:', JSON.stringify(error, null, 2));
                
                // Try to get more specific error information
                let errorDetails = 'Unknown error';
                if (error.response?.data) {
                    if (typeof error.response.data === 'string') {
                        errorDetails = error.response.data;
                    } else if (error.response.data.message) {
                        errorDetails = error.response.data.message;
                    } else if (error.response.data.error) {
                        errorDetails = error.response.data.error;
                    } else {
                        errorDetails = JSON.stringify(error.response.data);
                    }
                } else if (error.message) {
                    errorDetails = error.message;
                }
                
                console.error('❌ Processed error details:', errorDetails);
                alert(`Failed to update PDF QR code: ${errorDetails}\n\nStatus: ${error.response?.status || 'Unknown'}\nCheck console for full details.`);
            }
        },

        openDeleteConfirmation(qrItem) {
            this.selectedQRItem = qrItem;
            this.showDeleteConfirmation = true;
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.selectedQRItem = null;
        },

        async confirmDelete() {
            if (!this.selectedQRItem || this.isDeleting) return; // Prevent duplicate calls
            
            this.isDeleting = true;
            try {
                console.log('🗑️ Deleting PDF QR code:', this.selectedQRItem.id);
                await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                console.log('✅ PDF QR code deleted successfully');
                
                // Show success notification
                alert('PDF QR code deleted successfully!');
                
                // Close popup first
                this.closeDeleteConfirmation();
                
                // Then refresh list
                await this.fetchQRCodesSilent();
                
            } catch (error) {
                console.error('❌ Error deleting PDF QR code:', error);
                
                // Only show error if it's not a 404 (already deleted)
                if (error.response?.status !== 404) {
                    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                    alert(`Failed to delete PDF QR code: ${errorMessage}`);
                } else {
                    console.log('ℹ️ QR code was already deleted (404), refreshing list...');
                    // Close popup and refresh list even on 404
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodesSilent();
                }
            } finally {
                this.isDeleting = false;
            }
        },

        openAnalytics(qrItem) {
            this.selectedQRItem = qrItem;
            this.selectedQRAnalytics = qrItem.analytics;
            this.showAnalytics = true;
        },

        closeAnalytics() {
            this.showAnalytics = false;
            this.selectedQRItem = null;
            this.selectedQRAnalytics = null;
        },

        downloadQR(qrItem) {
            console.log('📥 Downloading QR for item:', qrItem);
            console.log('📥 Download content will be:', qrItem.downloadQRContent);
            this.downloadQRContent = qrItem.downloadQRContent;
            this.showDownloadModal = true;
        },

        closeDownloadModal() {
            this.showDownloadModal = false;
            this.downloadQRContent = '';
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
        }
    }
};
</script>