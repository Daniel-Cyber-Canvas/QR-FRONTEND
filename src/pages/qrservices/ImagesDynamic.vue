<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">Image QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="QR Code Title"
                                        placeholder="My Image" 
                                        v-model="formData.title" 
                                        required 
                                    />
                                    
                                    <div class="flex flex-col gap-2 w-full">
                                        <label class="text-sm font-medium text-gray-700">Image File</label>
                                        <div class="relative">
                                            <input 
                                                type="file" 
                                                accept=".jpg,.jpeg,.png,.gif"
                                                @change="handleImageFileSelect"
                                                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
                                                required
                                            >
                                            <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                                                <Icon name="ph:image" class="inline w-4 h-4 mr-1" />
                                                {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
                                            </div>
                                            <div v-if="selectedFile && isImageFile(selectedFile)" class="mt-2">
                                                <img 
                                                    :src="imagePreviewUrl" 
                                                    alt="Image preview" 
                                                    class="max-w-32 max-h-32 object-cover rounded border"
                                                >
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">Supported formats: JPG, JPEG, PNG, GIF. Maximum file size: 5MB</p>
                                    </div>
                                    
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="analytics-image" 
                                            v-model="formData.analytics"
                                            class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            checked
                                        >
                                        <label for="analytics-image" class="text-sm text-gray-700">Enable Analytics Tracking</label>
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
                                            <span v-else>Generate Image QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <!-- QR Codes List Section -->
                        <div class="bg-white rounded p-6 shadow-sm self-stretch">
                            <div class="flex flex-row items-center justify-between mb-4">
                                <h2 class="text-xl font-semibold text-gray-800">Dynamic Image QR Codes</h2>
                                <button 
                                    @click="fetchQRCodes" 
                                    :disabled="isLoading"
                                    class="bg-[#0c768a] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Icon name="ph:arrow-clockwise" class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                                    Refresh
                                </button>
                            </div>

                            <!-- Loading State -->
                            <div v-if="isLoading" class="flex items-center justify-center py-8">
                                <Icon name="ph:spinner" class="w-6 h-6 animate-spin text-[#0c768a]" />
                                <span class="ml-2 text-gray-600">Loading QR codes...</span>
                            </div>

                            <!-- QR Codes List -->
                            <div v-else-if="qrItems.length > 0" class="space-y-4">
                                <div v-for="qrItem in paginatedQRItems" :key="qrItem.id">
                                    <QRCodeItem
                                        :qr-item="qrItem"
                                        @edit="handleEdit"
                                        @delete="handleDelete"
                                        @analytics="handleAnalytics"
                                        @download="handleDownload"
                                    />
                                </div>

                                <!-- Pagination -->
                                <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                    <div class="text-sm text-gray-600">
                                        {{ paginationInfo }}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button 
                                            @click="changePage(currentPage - 1)"
                                            :disabled="currentPage === 1"
                                            class="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <span class="px-3 py-1 text-sm text-gray-600">
                                            Page {{ currentPage }} of {{ totalPages }}
                                        </span>
                                        <button 
                                            @click="changePage(currentPage + 1)"
                                            :disabled="currentPage === totalPages"
                                            class="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="text-center py-8">
                                <Icon name="ph:image" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p class="text-gray-500 mb-2">No dynamic image QR codes found</p>
                                <p class="text-sm text-gray-400">Create your first image QR code using the form above</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </side-navigation>

        <!-- QR Code Generation Modal -->
        <QRCodeModal
            v-if="showQRCodeModal" 
            :qr-code-content="qrCodeContent" 
            @close="closeQRCodeModal" 
        />

        <!-- Edit QR Code Popup -->
        <EditQRCodePopup
            v-if="showEditPopup && selectedQRItem"
            :qr-code="selectedQRItem"
            @close="closeEditPopup"
            @save="saveEditedQRCode"
        />

        <!-- Delete Confirmation Popup -->
        <DeleteConfirmationPopup
            v-if="showDeleteConfirmation && selectedQRItem"
            :is-visible="showDeleteConfirmation"
            :item-type="selectedQRItem.analytics?.type || 'Image QR'"
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
    name: "ImagesDynamic",
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
            imagePreviewUrl: null,
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
            await this.generateImageQRCode();
        },
        
        handleImageFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please select a valid image file (JPG, JPEG, PNG, or GIF).');
                    return;
                }
                
                // Validate file size (5MB limit for images)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    alert('Image file size must be less than 5MB.');
                    return;
                }
                
                this.selectedFile = file;
                
                // Create preview URL
                if (this.imagePreviewUrl) {
                    URL.revokeObjectURL(this.imagePreviewUrl);
                }
                this.imagePreviewUrl = URL.createObjectURL(file);
            }
        },

        isImageFile(file) {
            return file && file.type.startsWith('image/');
        },

        async generateImageQRCode() {
            if (!this.selectedFile) {
                alert('Please select an image file.');
                return;
            }

            this.isUploading = true;

            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('title', this.formData.title.trim());
                formData.append('is_dynamic', true);
                formData.append('analytics', this.formData.analytics);

                const response = await axios.post('/api/qr/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('Full Image QR Response:', response.data);

                if (response.data) {
                    let qrContent;
                    
                    // For dynamic QR codes, check the actual response structure
                    if (response.data.redirect_url && typeof response.data.redirect_url === 'string') {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url && typeof response.data.short_url === 'string') {
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else if (response.data.image_url && typeof response.data.image_url === 'string') {
                        // Backend returns image_url for dynamic images
                        qrContent = response.data.image_url;
                    } else if (response.data.qr_code && typeof response.data.qr_code === 'object' && response.data.qr_code.url) {
                        // Check if qr_code object contains a URL
                        qrContent = response.data.qr_code.url;
                    } else if (response.data.qr_code && typeof response.data.qr_code === 'string') {
                        qrContent = response.data.qr_code;
                    } else if (response.data.file_reference && typeof response.data.file_reference === 'object' && response.data.file_reference.url) {
                        // Check if file_reference object contains a URL
                        qrContent = response.data.file_reference.url;
                    } else {
                        console.error('Dynamic Image QR: No valid URL found in response:', response.data);
                        console.error('Available fields:', Object.keys(response.data));
                        alert('Error: Backend did not return a valid URL for dynamic image QR code. Check console for details.');
                        return;
                    }
                    
                    // Final validation
                    if (!qrContent || typeof qrContent !== 'string' || qrContent.trim() === '') {
                        console.error('Image QR: Final content validation failed:', qrContent);
                        alert('Error: Invalid QR code content received from backend');
                        return;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.formData.title = '';
                    this.selectedFile = null;
                    if (this.imagePreviewUrl) {
                        URL.revokeObjectURL(this.imagePreviewUrl);
                        this.imagePreviewUrl = null;
                    }
                    
                    // Clear file input
                    const fileInput = this.$el.querySelector('input[type="file"]');
                    if (fileInput) {
                        fileInput.value = '';
                    }
                    
                    // Refresh QR list after creation
                    setTimeout(async () => {
                        await this.fetchQRCodes();
                    }, 1000);
                    
                    console.log('Generated Dynamic Image QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Image QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate Image QR code: ${errorMessage}`);
            } finally {
                this.isUploading = false;
            }
        },

        async fetchQRCodes() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting fetchQRCodes for images...');
                
                // Get all QR codes first, then filter for image QRs
                let response = await axios.get('/api/qr', {
                    params: {
                        page: 1,
                        limit: 100 // Get more items to analyze
                    }
                });
        
                console.log('🔍 All QR codes response:', response.data);
        
                if (response.data && response.data.data) {
                    let qrData = response.data.data;
                    
                    // Log all available QR types and services for debugging
                    const qrTypes = [...new Set(qrData.map(item => item.type))];
                    const serviceTypes = [...new Set(qrData.map(item => item.service))];
                    console.log('🔍 Available QR types:', qrTypes);
                    console.log('🔍 Available service types:', serviceTypes);
                    
                    // Filter STRICTLY for image QR codes only
                    // The backend CreateImageQRCode sets type="image" and content.type="image"
                    const imageQRs = qrData.filter(item => {
                        console.log('🔍 Checking item:', item.id, 'type:', item.type, 'service:', item.service, 'content:', item.content);
                        
                        // STRICT filtering: Only accept QR codes that are explicitly image QRs
                        // 1. Must have type="image" (set by backend CreateImageQRCode)
                        if (item.type !== 'image') {
                            return false;
                        }
                        
                        // 2. Must have content with type="image" and image-specific fields
                        if (item.content && typeof item.content === 'object') {
                            const hasImageType = item.content.type === 'image';
                            const hasImageFields = item.content.filename && item.content.file_ref_id;
                            
                            // Must have both image type and image-specific fields
                            return hasImageType && hasImageFields;
                        }
                        
                        return false;
                    });
                    
                    console.log('🔍 Strictly filtered Image QRs found:', imageQRs.length);
                    console.log('🔍 Image QRs:', imageQRs);
        
                    this.qrItems = imageQRs.map(item => {
                        console.log('🔍 Processing image QR item:', item);
                        
                        // Extract display name and image URL from content
                        let displayName = 'Image QR';
                        let imageUrl = '';
                        
                        if (item.content && typeof item.content === 'object') {
                            // Use filename from content or title
                            displayName = item.content.filename || item.title || 'Image QR';
                            imageUrl = item.content.url || '';
                        } else {
                            displayName = item.title || 'Image QR';
                        }
        
                        // Determine QR code value for scanning
                        let qrCodeValue = '';
                        if (item.redirect_url) {
                            qrCodeValue = item.redirect_url;
                        } else if (item.short_url) {
                            qrCodeValue = `${config.apiBaseUrl}/scan/${item.short_url}`;
                        } else {
                            qrCodeValue = imageUrl;
                        }
        
                        const processedItem = {
                            id: item.id,
                            displayName: displayName,
                            url: imageUrl,
                            qrCodeValue: qrCodeValue,
                            type: 'Image',
                            modified: new Date(item.updated_at || item.created_at).toLocaleDateString(),
                            originalData: item,
                            analytics: {
                                type: 'Image',
                                enabled: item.analytics !== false
                            }
                        };
        
                        console.log('✅ Processed image QR item:', processedItem);
                        return processedItem;
                    });
        
                    console.log('✅ Final processed image QR items:', this.qrItems);
                } else {
                    console.log('📭 No QR codes found in response');
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('❌ Error fetching image QR codes:', error);
                console.error('❌ Error response:', error.response?.data);
                this.qrItems = [];
            } finally {
                this.isLoading = false;
            }
        },

        async fetchQRCodesSilent() {
            // Silent version without loading state for refreshes
            try {
                console.log('🔍 Starting silent fetchQRCodes for images...');
                
                let response = await axios.get('/api/qr', {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage
                    }
                });

                if (response.data && response.data.data) {
                    let qrData = response.data.data;
                    
                    // STRICT filtering for image QR codes only
                    const imageQRs = qrData.filter(item => {
                        // Must have type="image" AND content.type="image" AND image-specific fields
                        return item.type === 'image' && 
                               item.content && 
                               typeof item.content === 'object' && 
                               item.content.type === 'image' &&
                               item.content.filename &&
                               item.content.file_ref_id;
                    });

                    this.qrItems = imageQRs.map(item => {
                        let displayName = 'Image QR';
                        let imageUrl = '';
                        
                        if (item.content && typeof item.content === 'object') {
                            displayName = item.content.filename || item.title || 'Image QR';
                            imageUrl = item.content.url || '';
                        } else {
                            displayName = item.title || 'Image QR';
                        }

                        let qrCodeValue = '';
                        if (item.redirect_url) {
                            qrCodeValue = item.redirect_url;
                        } else if (item.short_url) {
                            qrCodeValue = `${config.apiBaseUrl}/scan/${item.short_url}`;
                        } else {
                            qrCodeValue = imageUrl;
                        }

                        return {
                            id: item.id,
                            displayName: displayName,
                            url: imageUrl,
                            qrCodeValue: qrCodeValue,
                            type: 'Image',
                            modified: new Date(item.updated_at || item.created_at).toLocaleDateString(),
                            originalData: item,
                            analytics: {
                                type: 'Image',
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

        // Event Handlers - Accept qrItem object directly
        handleEdit(qrItem) {
            console.log('🔧 Edit clicked for Image QR Item:', qrItem);
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
            console.log('📥 Download clicked for Image QR Item:', qrItem);
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
            console.log('🗑️ Delete clicked for Image QR Item:', qrItem);
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
            console.log('📊 Analytics clicked for Image QR Item:', qrItem);
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
                console.log('💾 Saving edited Image QR code:', updatedData);
                
                if (!this.selectedQRItem || !this.selectedQRItem.id) {
                    throw new Error('No QR code selected for editing');
                }

                let response;
                
                // Check if a new file was provided
                if (updatedData.newFile) {
                    console.log('📁 New image file provided, handling file upload');
                    
                    // Get the title from the updated data
                    const title = updatedData.title || 
                                 updatedData.content?.title || 
                                 this.selectedQRItem.originalData?.content?.title || 
                                 this.selectedQRItem.originalData?.title || 
                                 'Image QR';
                    
                    // Create FormData for file upload
                    const formData = new FormData();
                    formData.append('file', updatedData.newFile);
                    formData.append('title', title);
                    formData.append('is_dynamic', 'true');
                    formData.append('analytics', 'true');
                    
                    console.log('📁 FormData prepared for new image file:', {
                        fileName: updatedData.newFile.name,
                        fileSize: updatedData.newFile.size,
                        title: title
                    });
                    
                    // First, create a new Image QR code to get the file reference
                    console.log('📁 Creating new Image QR code to get file reference');
                    const createResponse = await axios.post('/api/qr/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    console.log('📁 New Image QR code created:', createResponse.data);
                    
                    // Now update the existing QR code with the new file reference
                    const newQRCode = createResponse.data.qr_code;
                    const newFileRef = createResponse.data.file_reference;
                    
                    const updatePayload = {
                        type: 'image', // FIXED: Use 'image' instead of 'dynamic' to match filtering logic
                        title: title,
                        content: {
                            type: 'image',
                            url: newFileRef.url,
                            filename: newFileRef.filename,
                            file_size: newFileRef.size,
                            file_ref_id: newFileRef.id,
                            title: title
                        },
                        analytics: this.selectedQRItem.originalData?.analytics !== undefined ? 
                                  this.selectedQRItem.originalData.analytics : true,
                        active: this.selectedQRItem.originalData?.active !== undefined ? 
                               this.selectedQRItem.originalData.active : true
                    };
                    
                    console.log('📁 Updating existing QR code with new file reference:', updatePayload);
                    
                    response = await axios.put(`/api/qr/${this.selectedQRItem.id}`, updatePayload, {
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
                    const title = updatedData.title || 
                                 updatedData.content?.title || 
                                 this.selectedQRItem.originalData?.content?.title || 
                                 this.selectedQRItem.originalData?.title || 
                                 'Image QR';
                    
                    // Use the existing content structure but update the title
                    const existingContent = this.selectedQRItem.originalData?.content || {};
                    
                    const payload = {
                        type: 'image', // FIXED: Use 'image' instead of 'dynamic' to match filtering logic
                        title: title,
                        content: {
                            ...existingContent,
                            title: title
                        },
                        analytics: this.selectedQRItem.originalData?.analytics !== undefined ? 
                                  this.selectedQRItem.originalData.analytics : true,
                        active: this.selectedQRItem.originalData?.active !== undefined ? 
                               this.selectedQRItem.originalData.active : true
                    };
                    
                    console.log('📝 JSON payload:', payload);
                    console.log('📝 Making PUT request to:', `/api/qr/${this.selectedQRItem.id}`);
                    
                    response = await axios.put(`/api/qr/${this.selectedQRItem.id}`, payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
                
                console.log('✅ Image QR code updated successfully:', response.data);
                
                // Show success notification
                alert('Image QR code updated successfully!');
                
                // Close popup and refresh list
                this.closeEditPopup();
                await this.fetchQRCodesSilent();
                
            } catch (error) {
                console.error('❌ Error updating Image QR code:', error);
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
                alert(`Failed to update Image QR code: ${errorDetails}\n\nStatus: ${error.response?.status || 'Unknown'}\nCheck console for full details.`);
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

                console.log('🗑️ Deleting Image QR code:', this.selectedQRItem.id);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                console.log('✅ Image QR code deleted successfully');
                this.closeDeleteConfirmation();
                
                await this.fetchQRCodesSilent();
                alert('Image QR code deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting Image QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                
                if (error.response?.status === 404) {
                    console.warn('⚠️ QR code not found (404), refreshing list');
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodesSilent();
                    alert('QR code was already deleted or does not exist. Refreshing the list.');
                } else {
                    alert(`Failed to delete Image QR code: ${errorMessage}`);
                }
            } finally {
                this.isDeleting = false;
            }
        }
    },
    beforeUnmount() {
        // Clean up image preview URL to prevent memory leaks
        if (this.imagePreviewUrl) {
            URL.revokeObjectURL(this.imagePreviewUrl);
        }
    }
};
</script>