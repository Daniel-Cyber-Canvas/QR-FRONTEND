<template>
    <div>
        <side-navigation>
            <div class="flex flex-col items-center justify-start self-stretch flex-1 relative">
                <div class="bg-white flex flex-col gap-2.5 items-start justify-start self-stretch flex-1 relative overflow-hidden">
                    <div class="bg-[#fbfbfb] p-2.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[55px] relative overflow-hidden">
                    </div>
                    <div class="bg-white p-2.5 flex flex-col gap-3 items-start justify-start self-stretch flex-1 relative overflow-hidden">

                        <!-- Dynamic Form -->
                        <form @submit.prevent="generateQRCode" class="pr-[30px] flex flex-row gap-[30px] items-start justify-start self-stretch shrink-0 relative">
                            <template v-if="selectedType === 'Virtual Card'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Virtual Card QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
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
                                            placeholder="Andrew@aczambia.com" 
                                            v-model="formData.email" 
                                            type="email"
                                            required 
                                        />
                                        <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Company"
                                                placeholder="John Doe's Company" 
                                                v-model="formData.company" 
                                            />
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Job" 
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
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Virtual Card QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Website'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Website QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
                                        </div>
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Website URL"
                                            placeholder="https://example.com" 
                                            v-model="formData.website" 
                                            type="url"
                                            required 
                                        />
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Website QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Text'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Text QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
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
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Text QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Wi-Fi'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            WiFi QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Network Name (SSID)"
                                            placeholder="MyWiFiNetwork" 
                                            v-model="formData.ssid" 
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Password"
                                            placeholder="Enter WiFi password" 
                                            v-model="formData.password" 
                                            type="password"
                                            required 
                                        />
                                        
                                        <div class="flex flex-col gap-2 w-full">
                                            <label class="text-sm font-medium text-gray-700">Security Type</label>
                                            <select 
                                                v-model="formData.encryption"
                                                class="bg-white px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-[#0c768a]"
                                            >
                                                <option value="WPA2">WPA2</option>
                                                <option value="WPA">WPA</option>
                                                <option value="WEP">WEP</option>
                                                <option value="nopass">No Password</option>
                                            </select>
                                        </div>
                                        
                                        <div class="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id="hidden" 
                                                v-model="formData.hidden"
                                                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                            >
                                            <label for="hidden" class="text-sm text-gray-700">Hidden Network</label>
                                        </div>
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate WiFi QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'SMS'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            SMS QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Phone Number"
                                            placeholder="+1234567890" 
                                            v-model="formData.phone_number" 
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Message"
                                            placeholder="Enter your message" 
                                            v-model="formData.message" 
                                            type="textarea"
                                            rows="4"
                                            required 
                                        />
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate SMS QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Email'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Email QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Recipient Email"
                                            placeholder="recipient@example.com" 
                                            v-model="formData.recipient" 
                                            type="email"
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Subject"
                                            placeholder="Enter email subject" 
                                            v-model="formData.subject" 
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Message"
                                            placeholder="Enter email message" 
                                            v-model="formData.body" 
                                            type="textarea"
                                            rows="4"
                                            required 
                                        />
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Email QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Event'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Event QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Event Name"
                                            placeholder="My Event" 
                                            v-model="formData.event_name" 
                                            required 
                                        />
                                        
                                        <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0">
                                            <input-field-vue 
                                                class="w-full" 
                                                label="Start Date & Time"
                                                placeholder="Select start date and time" 
                                                v-model="formData.start_date" 
                                                type="datetime-local"
                                                required 
                                            />
                                            <input-field-vue 
                                                class="w-full" 
                                                label="End Date & Time"
                                                placeholder="Select end date and time" 
                                                v-model="formData.end_date" 
                                                type="datetime-local"
                                                required 
                                            />
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Location"
                                            placeholder="Event Location" 
                                            v-model="formData.location" 
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Description"
                                            placeholder="Event Description" 
                                            v-model="formData.description" 
                                            type="textarea"
                                            rows="4"
                                            required 
                                        />
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Event QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'PDF'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            PDF QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
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
                                        
                                        <div v-if="selectedMode === 'dynamic'" class="flex items-center gap-2">
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
                            </template>

                            <template v-else-if="selectedType === 'Images'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Image QR Code - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
                                        </div>
                                        
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
                                        
                                        <div v-if="selectedMode === 'dynamic'" class="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id="analytics-image" 
                                                v-model="formData.analytics"
                                                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
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
                            </template>

                            <template v-else-if="selectedType === '2D Barcode'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            2D Barcode - {{ selectedMode === 'dynamic' ? 'Dynamic' : 'Static' }} Mode
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
                                        
                                        <div v-if="selectedMode === 'dynamic'" class="flex items-center gap-2">
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
                                            >
                                                Generate 2D Barcode
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'App'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            App QR Code - Dynamic Mode
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="App Name"
                                            placeholder="MyAwesome App" 
                                            v-model="formData.app_name" 
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="App Store URL"
                                            placeholder="https://apps.apple.com/app/myawesome-app/id123456789" 
                                            v-model="formData.app_url" 
                                            type="url"
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Description"
                                            placeholder="Get our app from the App Store" 
                                            v-model="formData.app_description" 
                                            type="textarea"
                                            rows="3"
                                        />
                                        
                                        <div class="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id="analytics-app" 
                                                v-model="formData.analytics"
                                                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                                checked
                                            >
                                            <label for="analytics-app" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                        </div>
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate App QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Business Page'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Business Page QR Code - Dynamic Mode
                                        </div>
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Business Name"
                                            placeholder="Brew & Bean Coffee" 
                                            v-model="formData.business_name" 
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Business Website URL"
                                            placeholder="https://brewandbean.com" 
                                            v-model="formData.business_url" 
                                            type="url"
                                            required 
                                        />
                                        
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Description"
                                            placeholder="Visit our business page" 
                                            v-model="formData.business_description" 
                                            type="textarea"
                                            rows="3"
                                        />
                                        
                                        <div class="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id="analytics-business" 
                                                v-model="formData.analytics"
                                                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                                checked
                                            >
                                            <label for="analytics-business" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                        </div>
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Business Page QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="selectedType === 'Social Media'">
                                <div class="bg-white rounded p-2 flex flex-col gap-4 items-start justify-start flex-1 relative shadow-sm">
                                    <div class="flex flex-col gap-3 items-start justify-start self-stretch shrink-0">
                                        <div class="text-sm font-medium text-gray-700 mb-2">
                                            Social Media QR Code - Dynamic Mode
                                        </div>
                                        
                                        <!-- Platform Selection -->
                                        <div class="flex flex-col gap-2 w-full">
                                            <label class="text-sm font-medium text-gray-700">Social Media Platform</label>
                                            <select 
                                                v-model="formData.social_platform" 
                                                @change="onSocialPlatformChange"
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
                                            v-model="formData.social_title" 
                                            required 
                                        />

                                        <!-- Description Field -->
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Description"
                                            placeholder="Follow me on Facebook" 
                                            v-model="formData.social_description" 
                                            required 
                                        />

                                        <!-- URL Field -->
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Profile URL"
                                            :placeholder="getSocialUrlPlaceholder()" 
                                            v-model="formData.social_url" 
                                            required 
                                            type="url"
                                        />

                                        <!-- Handle/Username Field -->
                                        <input-field-vue 
                                            class="w-full" 
                                            label="Username/Handle"
                                            :placeholder="getSocialHandlePlaceholder()" 
                                            v-model="formData.social_handle" 
                                            required 
                                        />
                                        
                                        <!-- Analytics Option -->
                                        <div class="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id="analytics-social" 
                                                v-model="formData.analytics"
                                                class="w-4 h-4 text-[#0c768a] border-gray-300 rounded focus:ring-[#0c768a]"
                                                checked
                                            >
                                            <label for="analytics-social" class="text-sm text-gray-700">Enable Analytics Tracking</label>
                                        </div>
                                        
                                        <div class="px-3.5 pb-3 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0">
                                            <button
                                                type="submit"
                                                class="bg-[#0c768a] rounded px-4 py-2 text-white hover:bg-opacity-90 transition-colors duration-300"
                                            >
                                                Generate Social Media QR Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-else>
                                <p class="text-[#0c768a] text-lg text-center">Coming Soon.</p>
                            </template>
                        </form>

                        <!-- Social Media QR Codes List Section -->
                        <div v-if="selectedType === 'Social Media'" class="w-full mt-8">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <!-- Header -->
                                <div class="flex items-center justify-between mb-6">
                                    <h2 class="text-xl font-semibold text-gray-800">
                                        Dynamic Social Media QR Codes ({{ qrItems.length }} found)
                                    </h2>
                                    <button
                                        @click="fetchQRCodes"
                                        class="flex items-center gap-2 px-4 py-2 bg-[#0c768a] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                        :disabled="isLoading"
                                    >
                                        <Icon icon="mdi:refresh" class="w-4 h-4" />
                                        Refresh
                                    </button>
                                </div>

                                <!-- Loading State -->
                                <div v-if="isLoading && qrItems.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Icon icon="mdi:loading" class="w-8 h-8 animate-spin mb-2" />
                                    <p>Loading QR codes...</p>
                                </div>

                                <!-- Empty State -->
                                <div v-else-if="!isLoading && qrItems.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Icon icon="mdi:qrcode" class="w-16 h-16 mb-4 text-gray-300" />
                                    <p>No social media QR codes found. Create your first one above!</p>
                                </div>

                                <!-- QR Codes List -->
                                <div v-else class="space-y-4">
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

                                <!-- Pagination -->
                                <div v-if="qrItems.length > itemsPerPage" class="flex flex-col gap-3 items-center justify-center w-full mt-6">
                                    <div class="flex items-center gap-2">
                                        <button
                                            @click="currentPage = Math.max(1, currentPage - 1)"
                                            :disabled="currentPage === 1"
                                            class="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span class="px-3 py-1 text-sm text-gray-600">
                                            Page {{ currentPage }} of {{ totalPages }}
                                        </span>
                                        <button
                                            @click="currentPage = Math.min(totalPages, currentPage + 1)"
                                            :disabled="currentPage === totalPages"
                                            class="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <p class="text-sm text-gray-500">{{ paginationInfo }}</p>
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
        
        <!-- Social Media Edit Popup -->
        <SocialMediaEditPopup
            v-if="showSocialMediaEditPopup"
            :qr-code="editingQRCode"
            @close="closeSocialMediaEditPopup"
            @updated="saveEditedQRCode"
        />

        <!-- Delete Confirmation Popup -->
        <DeleteConfirmationPopup
            v-if="showDeleteConfirmation"
            :is-visible="showDeleteConfirmation"
            :item-type="qrToDelete?.title || 'QR Code'"
            :item-code="qrToDelete?.id || ''"
            @confirm="confirmDelete"
            @cancel="closeDeleteConfirmation"
        />

        <!-- Analytics Popup -->
        <AnalyticsPopup
            v-if="showAnalytics"
            :qr-id="analyticsQRCode?.id"
            :qr-code-url="analyticsQRCode?.redirect_url || analyticsQRCode?.qr_code"
            @close="closeAnalytics"
        />

        <!-- Download Modal -->
        <DownloadQR
            v-if="showDownloadModal"
            :qr-code-content="downloadQRContent"
            @close="closeDownloadModal"
        />
    </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import ButtonVue from '@/components/Button.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
import QRCodeItem from '@/components/QRCodeItem.vue';
import SocialMediaEditPopup from '@/components/SocialMediaEditPopup.vue';
import DeleteConfirmationPopup from '@/components/DeleteConfirmationPopup.vue';
import AnalyticsPopup from '@/components/AnalyticsPopup.vue';
import DownloadQR from '@/components/DownloadQR.vue';
import { Icon } from '@iconify/vue';
import axios from '@/axios.js';
import config from '@/config.js';

export default {
    name: "FormQR",
    components: {
        SideNavigation,
        InputFieldVue,
        ButtonVue,
        QRCodeModal,
        QRCodeItem,
        SocialMediaEditPopup,
        DeleteConfirmationPopup,
        AnalyticsPopup,
        DownloadQR,
        Icon
    },
    data() {
        return {
            selectedType: this.$route.query.type,
            selectedMode: this.$route.query.mode || this.determineDefaultMode(this.$route.query.type),
            qrCodeName: '',
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                phone2: '',
                company: '',
                job: '',
                address: '',
                website: '',
                text: '', // Add text field for Text QR codes
                // WiFi fields
                ssid: '',
                password: '',
                encryption: 'WPA2',
                hidden: false,
                // SMS fields
                phone_number: '',
                message: '',
                // Email fields
                recipient: '',
                subject: '',
                body: '',
                // Event fields
                event_name: '',
                start_date: '',
                end_date: '',
                location: '',
                description: '',
                // PDF fields
                title: '',
                analytics: true, // Default to true for dynamic QR codes
                // 2D Barcode fields
                barcode_title: '',
                barcode_data: '',
                // App fields
                app_name: '',
                app_url: '',
                app_description: '',
                // Business Page fields
                business_name: '',
                business_url: '',
                business_description: '',
                // Social Media fields
                social_platform: '',
                social_title: '',
                social_description: '',
                social_url: '',
                social_handle: '',
                // Menu fields
                menu_name: '',
                menu_description: '',
                menu_restaurant_name: '',
                menu_cuisine_type: '',
                menu_contact_info: '',
                menu_address: '',
                menu_hours: '',
                menu_website: ''
            },
            showQRCodeModal: false,
            qrCodeContent: '',
            // PDF upload fields
            selectedFile: null,
            isUploading: false,
            imagePreviewUrl: null,
            // QR List management for Social Media
            qrItems: [],
            isLoading: false,
            currentPage: 1,
            itemsPerPage: 5,
            // Popup states
            showSocialMediaEditPopup: false,
            editingQRCode: null,
            showDeleteConfirmation: false,
            qrToDelete: null,
            showAnalytics: false,
            analyticsQRCode: null,
            showDownloadModal: false,
            downloadQRContent: ''

        };
    },
    computed: {
        paginatedQRItems() {
            const sortedItems = [...this.qrItems].sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return sortedItems.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.qrItems.length / this.itemsPerPage);
        },
        paginationInfo() {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.qrItems.length);
            return `Showing ${start}-${end} of ${this.qrItems.length} QR codes`;
        }
    },
    async mounted() {
        // Fetch QR codes if we're on the Social Media page
        if (this.selectedType === 'Social Media' && this.selectedMode === 'dynamic') {
            await this.fetchQRCodes();
        }
    },
    methods: {
        determineDefaultMode(type) {
            // Static-only QR codes
            const staticOnlyTypes = ['Email', 'SMS', 'Text', 'Wi-Fi'];
            if (staticOnlyTypes.includes(type)) {
                return 'static';
            }

            // Dynamic-only QR codes
            const dynamicOnlyTypes = ['PDF', 'Social Media', 'Instagram', 'Images', 'App', 'Business Page', '2D Barcode', 'Feedback', 'Rating'];
            if (dynamicOnlyTypes.includes(type)) {
                return 'dynamic';
            }

            // Default to static for types that support both modes if no mode is specified
            return 'static';
        },
        async generateQRCode() {
            if (this.selectedType === 'SMS') {
                await this.generateSMSQRCode();
            } else if (this.selectedType === 'Virtual Card') {
                await this.generateVCardQRCode();
            } else if (this.selectedType === 'Website') {
                await this.generateWebsiteQRCode();
            } else if (this.selectedType === 'Wi-Fi') {
                await this.generateWiFiQRCode();
            } else if (this.selectedType === 'Email') {
                await this.generateEmailQRCode();
            } else if (this.selectedType === 'Event') {
                await this.generateEventQRCode();
            } else if (this.selectedType === 'PDF') {
                await this.generatePDFQRCode();
            } else if (this.selectedType === 'Images') {
                await this.generateImageQRCode();
            } else if (this.selectedType === '2D Barcode') {
                await this.generate2DBarcodeQRCode();
            } else if (this.selectedType === 'Text') {
                await this.generateTextQRCode();
            } else if (this.selectedType === 'App') {
                await this.generateAppQRCode();
            } else if (this.selectedType === 'Business Page') {
                await this.generateBusinessPageQRCode();
            } else if (this.selectedType === 'Social Media') {
                await this.generateSocialMediaQRCode();
            }

        },

        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (file.type !== 'application/pdf') {
                    alert('Please select a PDF file.');
                    return;
                }
                
                // Validate file size (10MB limit)
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (file.size > maxSize) {
                    alert('File size must be less than 10MB.');
                    return;
                }
                
                this.selectedFile = file;
            }
        },

        async generateWebsiteQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}WebsiteQR`;
                
                const payload = {
                    type: "website",
                    title: title,
                    content: {
                        url: this.formData.website.trim()
                    },
                    is_dynamic: isDynamic,
                    analytics: isDynamic,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                            qrContent = this.formData.website.trim();
                        }
                    } else {
                        // For static QR codes, always use the website URL
                        qrContent = response.data.qr_code || response.data.content;
                        
                        // If the content is an object, extract the URL
                        if (typeof qrContent === 'object') {
                            qrContent = qrContent.url || this.formData.website.trim();
                        }
                        
                        // If it's still not a string or empty, use the form data
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = this.formData.website.trim();
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} Website QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Website QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
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
                formData.append('is_dynamic', this.selectedMode === 'dynamic');
                formData.append('analytics', this.formData.analytics);

                const response = await axios.post('/api/qr/pdf', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data) {
                    let qrContent;
                    
                    if (this.selectedMode === 'dynamic') {
                        // For dynamic QR codes, use the redirect URL from backend
                        if (response.data.redirect_url) {
                            qrContent = response.data.redirect_url;
                        } else if (response.data.short_url) {
                            // Construct full URL from short_url identifier
                            qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                        } else {
                            qrContent = response.data.qr_code;
                        }
                    } else {
                        // For static QR codes, use the direct file URL
                        qrContent = response.data.qr_code || response.data.file_url;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${this.selectedMode === 'dynamic' ? 'Dynamic' : 'Static'} PDF QR:`, qrContent);
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
        async generateVCardQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}VCardQR`;
                
                const payload = {
                    is_dynamic: isDynamic,
                    title: title,
                    content: {
                        name: `${this.formData.firstName.trim()} ${this.formData.lastName.trim()}`,
                        organization: this.formData.company.trim(),
                        title: this.formData.job.trim(),
                        phone: this.formData.phone.trim(),
                        email: this.formData.email.trim(),
                        address: this.formData.address.trim()
                    },
                    analytics: isDynamic,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                    } else {
                        // For static QR codes, always use vCard format
                        qrContent = response.data.qr_code || response.data.content;
                        
                        // If the content is an object, format it as vCard string
                        if (typeof qrContent === 'object') {
                            qrContent = this.generateVCardString(qrContent);
                        }
                        
                        // If it's still not a string or empty, create vCard format from form data
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = this.generateVCardString(this.formData);
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} vCard QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating vCard QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },

        generateVCardString(data) {
            const fields = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${data.name || `${data.firstName} ${data.lastName}`}`,
                `N:${data.lastName || ''};${data.firstName || ''};;;`,
                data.phone && `TEL;TYPE=CELL:${data.phone}`,
                data.email && `EMAIL:${data.email}`,
                data.organization && `ORG:${data.organization}`,
                data.title && `TITLE:${data.title}`,
                data.address && `ADR;TYPE=WORK:;;${data.address};;;;`,
                'END:VCARD'
            ].filter(Boolean).join('\n');

            return fields;
        },
        async generateEmailQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}EmailQR`;
                
                const payload = {
                    is_dynamic: isDynamic,
                    title: title,
                    content: {
                        recipient: this.formData.recipient.trim(),
                        subject: this.formData.subject.trim(),
                        body: this.formData.body.trim()
                    },
                    analytics: isDynamic,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                            console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to mailto format');
                            qrContent = `mailto:${this.formData.recipient}?subject=${encodeURIComponent(this.formData.subject)}&body=${encodeURIComponent(this.formData.body)}`;
                        }
                    } else {
                        // For static QR codes, always use mailto format
                        qrContent = response.data.qr_code || response.data.content;
                        
                        // If the content is an object, format it as mailto string
                        if (typeof qrContent === 'object') {
                            const { recipient, subject, body } = qrContent;
                            qrContent = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        }
                        
                        // If it's still not a string or empty, create mailto format from form data
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = `mailto:${this.formData.recipient}?subject=${encodeURIComponent(this.formData.subject)}&body=${encodeURIComponent(this.formData.body)}`;
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} Email QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Email QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        async generateSMSQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}SMSQR`;
                
                const payload = {
                    is_dynamic: isDynamic,
                    title: title,
                    content: {
                        phone_number: this.formData.phone_number.trim(),
                        message: this.formData.message.trim()
                    },
                    analytics: isDynamic,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                            console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to SMS format');
                            qrContent = `sms:${this.formData.phone_number}?body=${encodeURIComponent(this.formData.message)}`;
                        }
                    } else {
                        // For static QR codes, always use SMS format
                        qrContent = response.data.qr_code || response.data.content;
                        
                        // If the content is an object, format it as SMS QR string
                        if (typeof qrContent === 'object') {
                            const { phone_number, message } = qrContent;
                            qrContent = `sms:${phone_number}?body=${encodeURIComponent(message)}`;
                        }
                        
                        // If it's still not a string or empty, create SMS QR format from form data
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = `sms:${this.formData.phone_number}?body=${encodeURIComponent(this.formData.message)}`;
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} SMS QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating SMS QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        async generateWiFiQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}WiFiQR${this.formData.ssid}`;
                
                const payload = {
                    is_dynamic: isDynamic,
                    title: title,
                    content: {
                        ssid: this.formData.ssid,
                        password: this.formData.password,
                        encryption: this.formData.encryption,
                        hidden: this.formData.hidden
                    },
                    analytics: isDynamic, // Enable analytics for dynamic QR codes
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                            console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to WiFi format');
                            qrContent = `WIFI:T:${this.formData.encryption};S:${this.formData.ssid};P:${this.formData.password};H:${this.formData.hidden ? 'true' : 'false'};`;
                        }
                    } else {
                        // For static QR codes, always use WiFi format
                        qrContent = response.data.qr_code || response.data.content;
                        
                        // If the content is an object, format it as WiFi QR string
                        if (typeof qrContent === 'object') {
                            const { ssid, password, encryption, hidden } = qrContent;
                            qrContent = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
                        }
                        
                        // If it's still not a string or empty, create WiFi QR format from form data
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = `WIFI:T:${this.formData.encryption};S:${this.formData.ssid};P:${this.formData.password};H:${this.formData.hidden ? 'true' : 'false'};;`;
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating WiFi QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        async generateEventQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}EventQR`;
                
                const payload = {
                    is_dynamic: isDynamic,
                    title: title,
                    content: {
                        name: this.formData.event_name.trim(),
                        date: this.formData.start_date,
                        end_date: this.formData.end_date,
                        location: this.formData.location.trim(),
                        description: this.formData.description.trim()
                    },
                    analytics: isDynamic,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
                        if (response.data.redirect_url) {
                            qrContent = response.data.redirect_url;
                        } else if (response.data.short_url) {
                            qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                        } else {
                            qrContent = response.data.qr_code;
                        }
                        
                        if (!qrContent || typeof qrContent === 'object') {
                            console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to event format');
                            qrContent = this.generateEventString(this.formData);
                        }
                    } else {
                        qrContent = response.data.qr_code || response.data.content;
                        
                        if (typeof qrContent === 'object') {
                            qrContent = this.generateEventString(qrContent);
                        }
                        
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = this.generateEventString(this.formData);
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} Event QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Event QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },

        generateEventString(data) {
            const startDate = new Date(data.date || data.start_date);
            const endDate = new Date(data.end_date);
            
            const fields = [
                'BEGIN:VEVENT',
                `SUMMARY:${data.name || data.event_name}`,
                `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
                `DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
                `LOCATION:${data.location}`,
                `DESCRIPTION:${data.description}`,
                'END:VEVENT'
            ].join('\n');

            return fields;
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
                formData.append('is_dynamic', this.selectedMode === 'dynamic');
                formData.append('analytics', this.formData.analytics);

                const response = await axios.post('/api/qr/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('Full Image QR Response:', response.data);

                if (response.data) {
                    let qrContent;
                    
                    if (this.selectedMode === 'dynamic') {
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
                    } else {
                        // For static QR codes, use image_url or other available fields
                        if (response.data.image_url && typeof response.data.image_url === 'string') {
                            qrContent = response.data.image_url;
                        } else if (response.data.file_url && typeof response.data.file_url === 'string') {
                            qrContent = response.data.file_url;
                        } else if (response.data.qr_code && typeof response.data.qr_code === 'string') {
                            qrContent = response.data.qr_code;
                        } else if (response.data.qr_code && typeof response.data.qr_code === 'object' && response.data.qr_code.url) {
                            qrContent = response.data.qr_code.url;
                        } else {
                            console.error('Static Image QR: No valid URL found in response:', response.data);
                            alert('Error: Backend did not return a valid file URL for static image QR code.');
                            return;
                        }
                    }
                    
                    // Final validation
                    if (!qrContent || typeof qrContent !== 'string' || qrContent.trim() === '') {
                        console.error('Image QR: Final content validation failed:', qrContent);
                        alert('Error: Invalid QR code content received from backend');
                        return;
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log(`Generated ${this.selectedMode === 'dynamic' ? 'Dynamic' : 'Static'} Image QR:`, qrContent);
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
        
        async generate2DBarcodeQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                
                const payload = {
                    title: this.formData.barcode_title.trim(),
                    data: this.formData.barcode_data.trim(),
                    is_dynamic: isDynamic,
                    analytics: isDynamic ? this.formData.analytics : false
                };

                const response = await axios.post('/api/qr/barcode', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                            console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to barcode data');
                            qrContent = this.formData.barcode_data.trim();
                        }
                    } else {
                        // For static QR codes, use the barcode data directly
                        qrContent = response.data.qr_code || response.data.content || this.formData.barcode_data.trim();
                        
                        // If the content is an object, extract the data
                        if (typeof qrContent === 'object') {
                            qrContent = qrContent.data || this.formData.barcode_data.trim();
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} 2D Barcode QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating 2D Barcode QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate 2D Barcode QR code: ${errorMessage}`);
            }
        },
        
        async generateTextQRCode() {
            try {
                const isDynamic = this.selectedMode === 'dynamic';
                const title = this.qrCodeName || `${isDynamic ? 'Dynamic' : 'Static'}TextQR`;
                
                const payload = {
                    type: "text",
                    title: title,
                    content: {
                        text: this.formData.text.trim()
                    },
                    is_dynamic: isDynamic,
                    analytics: isDynamic,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    if (isDynamic) {
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
                            console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to text content');
                            qrContent = this.formData.text.trim();
                        }
                    } else {
                        // For static QR codes, always use the text content
                        qrContent = response.data.qr_code || response.data.content;
                        
                        // If the content is an object, extract the text
                        if (typeof qrContent === 'object') {
                            qrContent = qrContent.text || this.formData.text.trim();
                        }
                        
                        // If it's still not a string or empty, use the form data
                        if (!qrContent || typeof qrContent !== 'string') {
                            qrContent = this.formData.text.trim();
                        }
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log(`Generated ${isDynamic ? 'Dynamic' : 'Static'} Text QR:`, qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Text QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        
        async generateAppQRCode() {
            try {
                const title = this.qrCodeName || 'AppQR';
                
                const payload = {
                    type: "app",
                    title: title,
                    content: {
                        name: this.formData.app_name.trim(),
                        url: this.formData.app_url.trim(),
                        description: this.formData.app_description.trim()
                    },
                    is_dynamic: true, // App QR codes are always dynamic
                    analytics: this.formData.analytics,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
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
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to app URL');
                        qrContent = this.formData.app_url.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated App QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating App QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        
        async generateBusinessPageQRCode() {
            try {
                const title = this.formData.business_name.trim() || this.qrCodeName || 'BusinessPageQR';
                
                const payload = {
                    service: "business",
                    is_dynamic: true,
                    title: title,
                    description: this.formData.business_description.trim() || "Optional description",
                    content: {
                        name: this.formData.business_name.trim(),
                        description: this.formData.business_description.trim(),
                        url: this.formData.business_url.trim()
                    },
                    analytics: this.formData.analytics,
                    active: true
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    // For dynamic QR codes, we MUST get a redirect URL from backend
                    if (response.data.redirect_url) {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url) {
                        // Construct full URL from short_url identifier
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else if (response.data.qr_code && typeof response.data.qr_code === 'string' && response.data.qr_code.startsWith('http')) {
                        // Use qr_code if it's a valid URL (redirect URL)
                        qrContent = response.data.qr_code;
                    } else {
                        // If backend doesn't provide proper redirect URL, this is a backend issue
                        console.error('Backend Error: Dynamic QR codes must return redirect_url or short_url for proper tracking');
                        console.error('Response received:', response.data);
                        throw new Error('Backend did not return a proper redirect URL for dynamic QR code. Please check backend implementation.');
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated Business Page QR with redirect URL:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Business Page QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        
        onSocialPlatformChange() {
            // Clear URL and handle when platform changes
            this.formData.social_url = '';
            this.formData.social_handle = '';
        },
        
        getSocialUrlPlaceholder() {
            const placeholders = {
                facebook: 'https://facebook.com/username',
                instagram: 'https://instagram.com/username',
                twitter: 'https://twitter.com/username',
                linkedin: 'https://linkedin.com/in/username',
                tiktok: 'https://tiktok.com/@username',
                youtube: 'https://youtube.com/c/channelname',
                snapchat: 'https://snapchat.com/add/username',
                pinterest: 'https://pinterest.com/username',
                reddit: 'https://reddit.com/user/username',
                discord: 'https://discord.gg/serverinvite',
                telegram: 'https://t.me/username',
                whatsapp: 'https://wa.me/1234567890'
            };
            return placeholders[this.formData.social_platform] || 'Enter your profile URL';
        },
        
        getSocialHandlePlaceholder() {
            const placeholders = {
                facebook: '@username',
                instagram: '@username',
                twitter: '@username',
                linkedin: 'username',
                tiktok: '@username',
                youtube: 'channelname',
                snapchat: 'username',
                pinterest: '@username',
                reddit: 'u/username',
                discord: 'username#1234',
                telegram: '@username',
                whatsapp: '+1234567890'
            };
            return placeholders[this.formData.social_platform] || 'Enter your username/handle';
        },
        
        async generateSocialMediaQRCode() {
            try {
                const title = this.formData.social_title.trim() || this.qrCodeName || 'SocialMediaQR';
                
                const payload = {
                    type: "dynamic",
                    service: "social_media",
                    title: title,
                    description: this.formData.social_description.trim() || "Social Media Profile",
                    is_dynamic: true,
                    analytics: this.formData.analytics,
                    active: true,
                    content: {
                        platform: this.formData.social_platform,
                        url: this.formData.social_url.trim(),
                        handle: this.formData.social_handle.trim()
                    }
                };

                const response = await axios.post('/api/qr', payload);
                
                if (response.data) {
                    let qrContent;
                    
                    // For dynamic QR codes, we MUST get a redirect URL from backend
                    if (response.data.redirect_url) {
                        qrContent = response.data.redirect_url;
                    } else if (response.data.short_url) {
                        // Construct full URL from short_url identifier
                        qrContent = `${config.apiBaseUrl}/scan/${response.data.short_url}`;
                    } else if (response.data.qr_code && typeof response.data.qr_code === 'string' && response.data.qr_code.startsWith('http')) {
                        // Use qr_code if it's a valid URL (redirect URL)
                        qrContent = response.data.qr_code;
                    } else {
                        // If backend doesn't provide proper redirect URL, this is a backend issue
                        console.error('Backend Error: Dynamic QR codes must return redirect_url or short_url for proper tracking');
                        console.error('Response received:', response.data);
                        throw new Error('Backend did not return a proper redirect URL for dynamic QR code. Please check backend implementation.');
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Reset form
                    this.resetSocialMediaForm();
                    
                    // Refresh QR list
                    await this.fetchQRCodes();
                    
                    // Log for debugging
                    console.log('Generated Social Media QR with redirect URL:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Social Media QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
            }
        },
        
        resetSocialMediaForm() {
            this.formData.social_platform = '';
            this.formData.social_title = '';
            this.formData.social_description = '';
            this.formData.social_url = '';
            this.formData.social_handle = '';
        },
        
        async fetchQRCodes() {
            this.isLoading = true;
            try {
                console.log('🔍 Starting fetchQRCodes for social media...');
                
                const response = await axios.get('/api/qr', {
                    params: { limit: 100 }
                });
                
                // Fix: Access the data array correctly
                const qrData = response.data.data || response.data || [];
                
                if (Array.isArray(qrData)) {
                    console.log('📦 Raw QR data received:', qrData.length, 'items');
                    
                    // Improved filtering for social media QR codes
                    const socialMediaQRs = qrData.filter(qr => {
                        // Primary check: service field must be 'social_media'
                        if (qr.service === 'social_media') {
                            return true;
                        }
                        
                        // Secondary check: content structure for social media indicators
                        if (qr.content && typeof qr.content === 'object') {
                            // Must have both platform and service fields indicating social media
                            if (qr.content.platform && qr.content.service === 'social_media') {
                                return true;
                            }
                        }
                        
                        // Exclude other services even if they have social media-like URLs
                        return false;
                    });
                    
                    console.log('🎯 Filtered social media QRs:', socialMediaQRs.length);
                    console.log('🔍 Social media QR IDs:', socialMediaQRs.map(qr => qr.id));
                    
                    this.qrItems = socialMediaQRs.map(item => this.transformQRItem(item));
                    
                    console.log('✅ Transformed social media QR items:', this.qrItems.length);
                } else {
                    console.warn('⚠️ API response data is not an array:', qrData);
                    this.qrItems = [];
                }
            } catch (error) {
                console.error('❌ Error fetching QR codes:', error);
                this.qrItems = [];
            } finally {
                this.isLoading = false;
            }
        },
        
        isSocialMediaUrl(url) {
            const socialDomains = [
                'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
                'linkedin.com', 'tiktok.com', 'youtube.com', 'snapchat.com',
                'pinterest.com', 'reddit.com', 'discord.gg', 't.me', 'wa.me'
            ];
            
            try {
                const urlObj = new URL(url);
                return socialDomains.some(domain => urlObj.hostname.includes(domain));
            } catch {
                return false;
            }
        },
        
        transformQRItem(item) {
            let platform = 'unknown';
            let url = '';
            let handle = '';
            
            if (item.content && typeof item.content === 'object') {
                platform = item.content.platform || this.extractPlatformFromUrl(item.content.url) || 'unknown';
                url = item.content.url || '';
                handle = item.content.handle || this.extractUsernameFromUrl(item.content.url) || '';
            } else if (item.social_url) {
                url = item.social_url;
                platform = this.extractPlatformFromUrl(url);
                handle = this.extractUsernameFromUrl(url);
            }
            
            return {
                id: item.id,
                title: item.title || `${platform} Profile`,
                description: item.description || '',
                platform: platform,
                url: url,
                handle: handle,
                analytics: item.analytics || false,
                created_at: item.created_at,
                updated_at: item.updated_at,
                qr_code: item.qr_code,
                redirect_url: item.redirect_url,
                short_url: item.short_url,
                active: item.active
            };
        },
        
        extractPlatformFromUrl(url) {
            if (!url) return 'unknown';
            
            const platformMap = {
                'facebook.com': 'facebook',
                'instagram.com': 'instagram',
                'twitter.com': 'twitter',
                'x.com': 'twitter',
                'linkedin.com': 'linkedin',
                'tiktok.com': 'tiktok',
                'youtube.com': 'youtube',
                'snapchat.com': 'snapchat',
                'pinterest.com': 'pinterest',
                'reddit.com': 'reddit',
                'discord.gg': 'discord',
                't.me': 'telegram',
                'wa.me': 'whatsapp'
            };
            
            try {
                const urlObj = new URL(url);
                for (const [domain, platform] of Object.entries(platformMap)) {
                    if (urlObj.hostname.includes(domain)) {
                        return platform;
                    }
                }
            } catch {
                // Invalid URL
            }
            
            return 'unknown';
        },
        
        extractUsernameFromUrl(url) {
            if (!url) return '';
            
            try {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                
                // Extract username from common social media URL patterns
                if (pathname.startsWith('/')) {
                    const parts = pathname.split('/').filter(part => part.length > 0);
                    if (parts.length > 0) {
                        return parts[0].replace('@', '');
                    }
                }
            } catch {
                // Invalid URL
            }
            
            return '';
        },
        
        // Event handlers for QR list actions
        handleEdit(qrItem) {
            this.editingQRCode = qrItem;
            this.showSocialMediaEditPopup = true;
        },
        
        handleDelete(qrItem) {
            this.qrToDelete = qrItem;
            this.showDeleteConfirmation = true;
        },
        
        handleAnalytics(qrItem) {
            this.analyticsQRCode = qrItem;
            this.showAnalytics = true;
        },
        
        handleDownload(qrItem) {
            // For dynamic QR codes, prioritize redirect_url for proper tracking
            if (qrItem.redirect_url) {
                this.downloadQRContent = qrItem.redirect_url;
            } else if (qrItem.short_url) {
                // Construct full URL from short_url identifier
                this.downloadQRContent = `${config.apiBaseUrl}/scan/${qrItem.short_url}`;
            } else {
                // Fallback to qr_code content
                this.downloadQRContent = qrItem.qr_code || '';
            }
            this.showDownloadModal = true;
        },
        
        // Popup management methods
        closeSocialMediaEditPopup() {
            this.showSocialMediaEditPopup = false;
            this.editingQRCode = null;
        },
        
        closeDeleteConfirmation() {
            this.showDeleteConfirmation = false;
            this.qrToDelete = null;
        },
        
        closeAnalytics() {
            this.showAnalytics = false;
            this.analyticsQRCode = null;
        },
        
        closeDownloadModal() {
            this.showDownloadModal = false;
            this.downloadQRContent = '';
        },
        
        async saveEditedQRCode(updatedQRCode) {
            try {
                // Update the item in the list
                const index = this.qrItems.findIndex(item => item.id === updatedQRCode.id);
                if (index !== -1) {
                    this.qrItems[index] = {
                        ...this.qrItems[index],
                        ...updatedQRCode,
                        updated_at: new Date().toISOString()
                    };
                }
                
                this.closeSocialMediaEditPopup();
                // SocialMediaEditPopup already shows success message
            } catch (error) {
                console.error('Error updating QR code:', error);
                alert('Failed to update QR code');
            }
        },
        
        async confirmDelete() {
            try {
                await axios.delete(`/api/qr/${this.qrToDelete.id}`);
                
                // Remove from list
                this.qrItems = this.qrItems.filter(item => item.id !== this.qrToDelete.id);
                
                this.closeDeleteConfirmation();
                alert('QR code deleted successfully!');
            } catch (error) {
                console.error('Error deleting QR code:', error);
                alert('Failed to delete QR code');
            }
        },
        
        closeQRCodeModal() {
            this.showQRCodeModal = false;
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