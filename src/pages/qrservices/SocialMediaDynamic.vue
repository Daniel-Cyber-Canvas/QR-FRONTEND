<template>
    <div class="bg-gray-50 min-h-screen">
        <side-navigation>
            <div class="flex flex-col gap-6 items-start justify-start flex-1 relative">
                <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                        <!-- Header with Navigation -->
                        <div class="flex flex-row items-center justify-between self-stretch">
                            <div class="text-2xl font-bold text-gray-800">Social Media QR Code - Dynamic Mode</div>
                            <router-link 
                                to="/qrmanagement/socialmedia"
                                class="bg-[#0c768a] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-300 flex items-center gap-2"
                            >
                                <Icon name="ph:list" class="w-4 h-4" />
                                Manage QR Codes
                            </router-link>
                        </div>
                        
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                    <!-- Platform Selection -->
                                    <div class="flex flex-col gap-2 w-full">
                                        <label class="text-sm font-medium text-gray-700">Social Media Platform</label>
                                        <select 
                                            v-model="formData.platform" 
                                            @change="onPlatformChange"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c768a] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Platform</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="twitter">Twitter/X</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="snapchat">Snapchat</option>
                                            <option value="pinterest">Pinterest</option>
                                            <option value="reddit">Reddit</option>
                                            <option value="discord">Discord</option>
                                            <option value="telegram">Telegram</option>
                                            <option value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>

                                    <!-- Title Field -->
                                    <input-field-vue 
                                        class="w-full" 
                                        label="QR Code Title"
                                        placeholder="My Facebook Profile" 
                                        v-model="formData.title" 
                                        required 
                                    />

                                    <!-- Description Field -->
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Description"
                                        placeholder="Follow me on Facebook" 
                                        v-model="formData.description" 
                                        required 
                                    />

                                    <!-- URL Field -->
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Profile URL"
                                        :placeholder="getUrlPlaceholder()" 
                                        v-model="formData.url" 
                                        required 
                                        type="url"
                                    />

                                    <!-- Handle/Username Field -->
                                    <input-field-vue 
                                        class="w-full" 
                                        label="Username/Handle"
                                        :placeholder="getHandlePlaceholder()" 
                                        v-model="formData.handle" 
                                        required 
                                    />
                                    
                                    <!-- Analytics Option -->
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
                                        Dynamic Social Media QR Codes ({{ qrItems.length }} found)
                                    </div>
                                    <div class="flex gap-2">
                                        <!-- Debug Info Button -->
                                        <button 
                                            @click="showDebugInfo = !showDebugInfo"
                                            class="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors duration-300"
                                        >
                                            {{ showDebugInfo ? 'Hide' : 'Show' }} Debug
                                        </button>
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
                                </div>

                                <!-- Debug Information -->
                                <div v-if="showDebugInfo" class="bg-gray-100 p-4 rounded text-sm">
                                    <h4 class="font-bold mb-2">Debug Information:</h4>
                                    <p><strong>Total QR Items:</strong> {{ qrItems.length }}</p>
                                    <p><strong>Is Loading:</strong> {{ isLoading }}</p>
                                    <p><strong>Current Page:</strong> {{ currentPage }}</p>
                                    <p><strong>Items Per Page:</strong> {{ itemsPerPage }}</p>
                                    <p><strong>Paginated Items:</strong> {{ paginatedQRItems.length }}</p>
                                    <div v-if="qrItems.length > 0" class="mt-2">
                                        <strong>Sample QR Item:</strong>
                                        <pre class="text-xs bg-white p-2 rounded mt-1">{{ JSON.stringify(qrItems[0], null, 2) }}</pre>
                                    </div>
                                </div>

                                <!-- Loading State -->
                                <div v-if="isLoading && qrItems.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Icon name="ph:spinner" class="w-8 h-8 animate-spin text-[#0c768a]" />
                                    <p class="text-gray-600">Loading social media QR codes...</p>
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

        <!-- QR Code Generation Modal -->
        <QRCodeModal
            v-if="showQRCodeModal" 
            :qr-code-content="qrCodeContent" 
            @close="closeQRCodeModal" 
        />

        <!-- Edit QR Code Popup -->
        <SocialMediaEditPopup
            v-if="showEditPopup && selectedQRItem"
            :is-visible="showEditPopup"
            :qr-code="selectedQRItem"
            @close="closeEditPopup"
            @updated="saveEditedQRCode"
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
import SocialMediaEditPopup from '@/components/SocialMediaEditPopup.vue';
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
        SocialMediaEditPopup,
        DeleteConfirmationPopup,
        AnalyticsPopup,
        Icon
    },
    data() {
        return {
            formData: {
                platform: '',
                title: '',
                description: '',
                url: '',
                handle: '',
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
            selectedQRAnalytics: null,
            showDebugInfo: false
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
        // Platform-specific placeholder methods
        getUrlPlaceholder() {
            const placeholders = {
                facebook: 'https://facebook.com/johndoe',
                instagram: 'https://instagram.com/johndoe',
                twitter: 'https://twitter.com/johndoe',
                linkedin: 'https://linkedin.com/in/johndoe',
                tiktok: 'https://tiktok.com/@johndoe',
                youtube: 'https://youtube.com/c/johndoe',
                snapchat: 'https://snapchat.com/add/johndoe',
                pinterest: 'https://pinterest.com/johndoe',
                reddit: 'https://reddit.com/u/johndoe',
                discord: 'https://discord.gg/johndoe',
                telegram: 'https://t.me/johndoe',
                whatsapp: 'https://wa.me/1234567890'
            };
            return placeholders[this.formData.platform] || 'https://example.com/profile';
        },

        getHandlePlaceholder() {
            const placeholders = {
                facebook: 'johndoe',
                instagram: 'johndoe',
                twitter: '@johndoe',
                linkedin: 'johndoe',
                tiktok: '@johndoe',
                youtube: 'johndoe',
                snapchat: 'johndoe',
                pinterest: 'johndoe',
                reddit: 'johndoe',
                discord: 'johndoe#1234',
                telegram: '@johndoe',
                whatsapp: '+1234567890'
            };
            return placeholders[this.formData.platform] || 'username';
        },

        onPlatformChange() {
            // Auto-populate title when platform changes
            if (this.formData.platform && !this.formData.title) {
                const platformNames = {
                    facebook: 'Facebook',
                    instagram: 'Instagram',
                    twitter: 'Twitter',
                    linkedin: 'LinkedIn',
                    tiktok: 'TikTok',
                    youtube: 'YouTube',
                    snapchat: 'Snapchat',
                    pinterest: 'Pinterest',
                    reddit: 'Reddit',
                    discord: 'Discord',
                    telegram: 'Telegram',
                    whatsapp: 'WhatsApp'
                };
                this.formData.title = `My ${platformNames[this.formData.platform]} Profile`;
            }
        },

        async generateQRCode() {
            await this.generateSocialMediaQRCode();
        },
        
        async generateSocialMediaQRCode() {
            this.isGenerating = true;
            try {
                // Create payload matching your backend structure
                const payload = {
                    type: "social_media",
                    service: "social_media",
                    title: this.formData.title.trim(),
                    description: this.formData.description.trim(),
                    is_dynamic: true,
                    analytics: this.formData.analytics,
                    active: true,
                    content: {
                        platform: this.formData.platform,
                        url: this.formData.url.trim(),
                        handle: this.formData.handle.trim()
                    }
                };

                console.log('🚀 Sending social media payload:', payload);

                const response = await axios.post('/api/qr', payload);
                
                console.log('📥 Social media creation response:', response.data);
                
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
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to social media URL');
                        qrContent = this.formData.url.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.resetForm();
                    
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

        resetForm() {
            this.formData = {
                platform: '',
                title: '',
                description: '',
                url: '',
                handle: '',
                analytics: true
            };
        },

        // Pagination methods
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
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
                    
                    // Filter for social media QR codes using the new structure
                    const socialMediaQRs = qrData.filter(item => {
                        // Check for new social_media service type
                        const isSocialMediaService = item.service === 'social_media' || item.service === 'socialmedia';
                        
                        // Check for social media content structure
                        const hasSocialMediaContent = item.content && (
                            item.content.platform ||
                            (item.content.url && this.isSocialMediaUrl(item.content.url))
                        );
                        
                        // Check for legacy social media URLs
                        const hasLegacySocialUrl = item.content && item.content.social_url;
                        
                        return isSocialMediaService || hasSocialMediaContent || hasLegacySocialUrl;
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
            
            // Handle new structure with platform and handle
            const platform = content.platform || this.extractPlatformFromUrl(content.url || content.social_url || '');
            const url = content.url || content.social_url || '';
            const handle = content.handle || this.extractUsernameFromUrl(url);
            
            // Create display name
            let displayName = item.title || item.description || 'Social Media Profile';
            
            // If we have platform and handle, create a more descriptive name
            if (platform && handle) {
                const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
                displayName = `${platformName} - ${handle}`;
            } else if (platform) {
                const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
                displayName = `${platformName} Profile`;
            }

            return {
                id: item.id,
                title: item.title || displayName,
                description: item.description || content.description || '',
                platform: platform,
                platform_display: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Media',
                url: url,
                handle: handle,
                content: {
                    platform: platform,
                    url: url,
                    title: item.title || displayName,
                    description: item.description || content.description || '',
                    handle: handle
                },
                analytics: item.analytics !== undefined ? item.analytics : true,
                active: item.active !== undefined ? item.active : true,
                qr_content: item.redirect_url || item.qr_code || url,
                displayName: displayName,
                qrCodeValue: item.redirect_url || item.qr_code || url,
                analytics: {
                    type: 'Social Media',
                    scans: item.scan_count || 0,
                    lastScan: item.last_scan_at || null
                },
                originalData: item
            };
        },

        extractPlatformFromUrl(url) {
            if (!url) return null;
            
            const urlLower = url.toLowerCase();
            if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
            if (urlLower.includes('instagram.com')) return 'instagram';
            if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
            if (urlLower.includes('linkedin.com')) return 'linkedin';
            if (urlLower.includes('tiktok.com')) return 'tiktok';
            if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
            if (urlLower.includes('snapchat.com')) return 'snapchat';
            if (urlLower.includes('pinterest.com')) return 'pinterest';
            if (urlLower.includes('reddit.com')) return 'reddit';
            if (urlLower.includes('discord.com') || urlLower.includes('discord.gg')) return 'discord';
            if (urlLower.includes('telegram.org') || urlLower.includes('t.me')) return 'telegram';
            if (urlLower.includes('whatsapp.com') || urlLower.includes('wa.me')) return 'whatsapp';
            return null;
        },

        extractUsernameFromUrl(url) {
            if (!url) return null;
            
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
            try {
                console.log('✏️ Edit clicked for Social Media QR Item:', qrItem);
                
                if (qrItem && qrItem.id) {
                    // Create a clean copy with proper structure
                    this.selectedQRItem = {
                        id: qrItem.id,
                        title: qrItem.title || '',
                        description: qrItem.description || '',
                        platform: qrItem.platform || '',
                        platform_display: qrItem.platform_display || '',
                        url: qrItem.url || '',
                        handle: qrItem.handle || '',
                        analytics: qrItem.analytics !== undefined ? qrItem.analytics : true,
                        active: qrItem.active !== undefined ? qrItem.active : true,
                        qr_content: qrItem.qr_content || qrItem.qrCodeValue || '',
                        content: {
                            platform: qrItem.platform || qrItem.content?.platform || '',
                            url: qrItem.url || qrItem.content?.url || '',
                            title: qrItem.title || qrItem.content?.title || '',
                            description: qrItem.description || qrItem.content?.description || '',
                            handle: qrItem.handle || qrItem.content?.handle || ''
                        },
                        originalData: qrItem.originalData || qrItem
                    };
                    
                    console.log('📝 Prepared selectedQRItem for edit:', this.selectedQRItem);
                    
                    // Use nextTick to ensure DOM is updated
                    this.$nextTick(() => {
                        this.showEditPopup = true;
                        console.log('✅ Edit popup visibility set to:', this.showEditPopup);
                    });
                } else {
                    console.error('❌ Invalid QR item provided for editing:', qrItem);
                    alert('Unable to edit this QR code. Please try refreshing the page.');
                }
            } catch (error) {
                console.error('❌ Error in handleEdit:', error);
                alert('An error occurred while opening the edit dialog.');
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
            console.log('🔒 Closing edit popup');
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
                    description: updatedQRCode.description,
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
            if (!this.selectedQRItem || this.isDeleting) return;
            
            this.isDeleting = true;
            try {
                console.log('🗑️ Deleting Social Media QR code:', this.selectedQRItem.id);
                
                const response = await axios.delete(`/api/qr/${this.selectedQRItem.id}`);
                
                if (response.status === 200 || response.status === 204) {
                    console.log('✅ Social Media QR code deleted successfully');
                    
                    // Remove the item from local array immediately
                    const index = this.qrItems.findIndex(item => item.id === this.selectedQRItem.id);
                    if (index > -1) {
                        this.qrItems.splice(index, 1);
                    }
                    
                    // Close popup first
                    this.closeDeleteConfirmation();
                    
                    // Show success notification only once
                    setTimeout(() => {
                        alert('Social Media QR code deleted successfully!');
                    }, 100);
                } else {
                    throw new Error('Unexpected response status');
                }
            } catch (error) {
                console.error('❌ Error deleting Social Media QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                setTimeout(() => {
                    alert(`Failed to delete Social Media QR code: ${errorMessage}`);
                }, 100);
            } finally {
                this.isDeleting = false;
            }
        },
    }
};
</script>