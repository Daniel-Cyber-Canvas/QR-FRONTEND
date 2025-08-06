<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <div class="text-2xl font-bold text-gray-800">Social Media QR Code - Dynamic Mode</div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Social Media URL"
                                        placeholder="https://facebook.com/yourpage or https://instagram.com/yourusername" 
                                        v-model="formData.social_url" 
                                        required 
                                        type="url"
                                    />
                                    
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
                                            :disabled="isGenerating"
                                            class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                                        >
                                            <span v-if="isGenerating">Generating...</span>
                                            <span v-else>Generate Social Media QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <!-- QR Codes List Section - Full Width -->
                        <div class="flex flex-col gap-4 items-start justify-start w-full shrink-0 relative">
                            <div class="bg-white rounded border-solid border-[#e2e8f0] border p-4 flex flex-col gap-4 items-start justify-start w-full relative">
                                <div class="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                    <div class="text-lg font-semibold text-gray-800">
                                        Dynamic Social Media QR Codes
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        {{ paginationInfo }}
                                    </div>
                                </div>

                                <!-- Loading State -->
                                <div v-if="isLoading" class="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c768a] mb-2"></div>
                                    <div class="text-sm">
                                        Loading QR codes...
                                    </div>
                                </div>

                                <!-- Empty State -->
                                <div v-else-if="!isLoading && qrItems.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Icon name="ph:share-network" class="w-12 h-12 mb-2" />
                                    <p>No dynamic social media QR codes found</p>
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
                                            @edit="handleEdit"
                                            @delete="handleDelete"
                                            @analytics="handleAnalytics"
                                            @download="handleDownload"
                                        />
                                    </div>

                                    <!-- Pagination -->
                                    <div v-if="totalPages > 1" class="flex flex-row items-center justify-center gap-2 self-stretch shrink-0 relative mt-4">
                                        <button
                                            @click="currentPage = Math.max(1, currentPage - 1)"
                                            :disabled="currentPage === 1"
                                            class="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        
                                        <span class="px-3 py-1 text-sm text-gray-600">
                                            Page {{ currentPage }} of {{ totalPages }}
                                        </span>
                                        
                                        <button
                                            @click="currentPage = Math.min(totalPages, currentPage + 1)"
                                            :disabled="currentPage === totalPages"
                                            class="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <DeleteConfirmationPopup
            v-if="showDeleteConfirmation && selectedQRItem"
            :is-visible="showDeleteConfirmation"
            :item-type="selectedQRItem.analytics?.type || 'Social Media QR'"
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
    name: "SocialMediaDynamic",
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
                social_url: '',
                analytics: true
            },
            showQRCodeModal: false,
            qrCodeContent: '',
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
        async generateQRCode() {
            await this.generateSocialMediaQRCode();
        },
        
        async generateSocialMediaQRCode() {
            this.isGenerating = true;
            try {
                // Extract platform from URL for better title
                const platform = this.extractPlatformFromUrl(this.formData.social_url);
                const title = platform ? `${platform}SocialQR` : 'SocialMediaQR';
                
                const payload = {
                    type: "dynamic",
                    service: "socialmedia",
                    title: title,
                    content: {
                        url: this.formData.social_url.trim(),
                        platform: platform
                    },
                    analytics: this.formData.analytics,
                    active: true
                };

                console.log('🚀 Sending social media payload:', payload);

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (response.data.redirect_url) {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url) {
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else {
                        qrContent = response.data.qr_code;
                    }
                    
                    if (!qrContent || typeof qrContent === 'object') {
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to social media URL');
                        qrContent = this.formData.social_url.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.formData.social_url = '';
                    
                    // Refresh QR list
                    setTimeout(async () => {
                        await this.fetchQRCodes();
                    }, 1000);
                    
                    console.log('Generated Dynamic Social Media QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Social Media QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            } finally {
                this.isGenerating = false;
            }
        },

        extractPlatformFromUrl(url) {
            const urlLower = url.toLowerCase();
            if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'Facebook';
            if (urlLower.includes('instagram.com')) return 'Instagram';
            if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'Twitter';
            if (urlLower.includes('linkedin.com')) return 'LinkedIn';
            if (urlLower.includes('tiktok.com')) return 'TikTok';
            if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'YouTube';
            if (urlLower.includes('snapchat.com')) return 'Snapchat';
            if (urlLower.includes('pinterest.com')) return 'Pinterest';
            if (urlLower.includes('reddit.com')) return 'Reddit';
            if (urlLower.includes('discord.com') || urlLower.includes('discord.gg')) return 'Discord';
            if (urlLower.includes('telegram.org') || urlLower.includes('t.me')) return 'Telegram';
            if (urlLower.includes('whatsapp.com') || urlLower.includes('wa.me')) return 'WhatsApp';
            return 'Social';
        },

        async fetchQRCodes() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting fetchQRCodes for social media...');
                
                // Fetch all QR codes and filter client-side for better pagination
                let response = await axios.get('/api/qr', {
                    params: {
                        limit: 100 // Get more items to filter client-side
                    }
                });

                console.log('🔍 Fetch response:', response.data);

                if (response.data && response.data.data) {
                    const qrData = response.data.data;
                    console.log('📊 Total QR codes fetched:', qrData.length);
                    
                    // Filter for social media QR codes
                    const socialMediaQRs = qrData.filter(item => {
                        const isSocialMediaService = item.service === 'socialmedia';
                        const hasSocialMediaContent = item.content && (
                            item.content.url && this.isSocialMediaUrl(item.content.url) ||
                            item.content.platform
                        );
                        
                        return isSocialMediaService || hasSocialMediaContent;
                    });

                    console.log('🎯 Filtered social media QR codes:', socialMediaQRs.length);
                    
                    // Transform the data for display
                    this.qrItems = socialMediaQRs.map(item => this.transformQRItem(item));
                    
                    console.log('✅ Transformed social media QR items:', this.qrItems.length);
                } else {
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('Error fetching Social Media QR codes:', error);
                this.qrItems = [];
            } finally {
                this.isLoading = false;
            }
        },

        isSocialMediaUrl(url) {
            const socialPlatforms = [
                'facebook.com', 'fb.com', 'instagram.com', 'twitter.com', 'x.com',
                'linkedin.com', 'tiktok.com', 'youtube.com', 'youtu.be',
                'snapchat.com', 'pinterest.com', 'reddit.com', 'discord.com',
                'discord.gg', 'telegram.org', 't.me', 'whatsapp.com', 'wa.me'
            ];
            
            return socialPlatforms.some(platform => url.toLowerCase().includes(platform));
        },

        transformQRItem(item) {
            const content = item.content || {};
            const url = content.url || '';
            const platform = content.platform || this.extractPlatformFromUrl(url);
            
            let displayName = platform ? `${platform} Profile` : 'Social Media Profile';
            
            // Try to extract username or page name from URL
            const username = this.extractUsernameFromUrl(url);
            if (username) {
                displayName += ` - ${username}`;
            }

            return {
                id: item.id,
                displayName: displayName,
                qrCodeValue: item.redirect_url || item.qr_code || '',
                analytics: {
                    type: 'Social Media',
                    scans: item.scan_count || 0,
                    lastScan: item.last_scan_at || null
                },
                originalData: item
            };
        },

        extractUsernameFromUrl(url) {
            try {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                
                // Remove leading slash and get the first segment
                const segments = pathname.split('/').filter(segment => segment.length > 0);
                if (segments.length > 0) {
                    // Return the first segment as username/page name
                    return segments[0];
                }
            } catch (error) {
                console.warn('Could not extract username from URL:', url);
            }
            return null;
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
        },

        // Event Handlers
        handleEdit(qrItem) {
            console.log('🔧 Edit clicked for Social Media QR Item:', qrItem);
            try {
                if (qrItem) {
                    this.selectedQRItem = { ...qrItem };
                    this.$nextTick(() => {
                        this.showEditPopup = true;
                    });
                } else {
                    console.error('❌ No QR item provided for editing');
                }
            } catch (error) {
                console.error('❌ Error in handleEdit:', error);
            }
        },

        handleDelete(qrItem) {
            console.log('🗑️ Delete clicked for Social Media QR Item:', qrItem);
            this.selectedQRItem = qrItem;
            this.showDeleteConfirmation = true;
        },

        handleAnalytics(qrItem) {
            console.log('📊 Analytics clicked for Social Media QR Item:', qrItem);
            this.selectedQRItem = qrItem;
            this.showAnalytics = true;
        },

        handleDownload(qrItem) {
            console.log('💾 Download clicked for Social Media QR Item:', qrItem);
            this.downloadQRContent = qrItem.qrCodeValue;
            this.showDownloadModal = true;
        },

        // Popup Management
        closeEditPopup() {
            this.showEditPopup = false;
            this.selectedQRItem = null;
        },

        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.selectedQRItem = null;
        },

        closeAnalytics() {
            this.showAnalytics = false;
            this.selectedQRItem = null;
        },

        closeDownloadModal() {
            this.showDownloadModal = false;
            this.downloadQRContent = '';
        },

        async saveEditedQRCode(updatedQRCode) {
            try {
                console.log('💾 Saving edited Social Media QR code:', updatedQRCode);
                
                const response = await axios.put(`/api/qr/${updatedQRCode.id}`, {
                    title: updatedQRCode.title,
                    content: updatedQRCode.content,
                    analytics: updatedQRCode.analytics,
                    active: updatedQRCode.active
                });

                if (response.data) {
                    console.log('✅ Social Media QR code updated successfully');
                    this.closeEditPopup();
                    await this.fetchQRCodes(); // Refresh the list
                } else {
                    throw new Error('No response data received');
                }
            } catch (error) {
                console.error('❌ Error updating Social Media QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to update Social Media QR code: ${errorMessage}`);
            }
        },

        async confirmDelete() {
            if (!this.selectedQRItem) return;
            
            this.isDeleting = true;
            try {
                console.log('🗑️ Deleting Social Media QR code:', this.selectedQRItem.id);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                if (response.status === 200 || response.status === 204) {
                    console.log('✅ Social Media QR code deleted successfully');
                    this.closeDeleteConfirmation();
                    await this.fetchQRCodes(); // Refresh the list
                } else {
                    throw new Error('Unexpected response status');
                }
            } catch (error) {
                console.error('❌ Error deleting Social Media QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to delete Social Media QR code: ${errorMessage}`);
            } finally {
                this.isDeleting = false;
            }
        }
    }
};
</script>