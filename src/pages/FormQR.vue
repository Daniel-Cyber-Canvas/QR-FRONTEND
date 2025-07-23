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

                            <template v-else>
                                <p class="text-[#0c768a] text-lg text-center">Coming Soon.</p>
                            </template>
                        </form>
                    </div>
                </div>
            </div>
        </side-navigation>
        <QRCodeModal
            v-if="showQRCodeModal" 
            :qr-code-content="qrCodeContent" 
            @close="closeQRCodeModal" 
        />
    </div>
</template>

<script>
import SideNavigation from "@/components/SideNavigation.vue";
import InputFieldVue from '@/components/InputField.vue';
import ButtonVue from '@/components/Button.vue';
import QRCodeModal from '@/components/DownloadQR.vue';
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
                business_description: ''
            },
            showQRCodeModal: false,
            qrCodeContent: '',
            // PDF upload fields
            selectedFile: null,
            isUploading: false,
            imagePreviewUrl: null
        };
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
                const title = this.qrCodeName || 'BusinessPageQR';
                
                const payload = {
                    type: "business_page",
                    title: title,
                    content: {
                        name: this.formData.business_name.trim(),
                        url: this.formData.business_url.trim(),
                        description: this.formData.business_description.trim()
                    },
                    is_dynamic: true, // Business Page QR codes are always dynamic
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
                        console.warn('Dynamic QR: Backend should return redirect_url or short_url, falling back to business URL');
                        qrContent = this.formData.business_url.trim();
                    }
                    
                    this.qrCodeContent = qrContent;
                    this.showQRCodeModal = true;
                    
                    // Log for debugging
                    console.log('Generated Business Page QR:', qrContent);
                } else {
                    alert('Error generating QR code: No data received');
                }
            } catch (error) {
                console.error('Error generating Business Page QR code:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert(`Failed to generate QR code: ${errorMessage}`);
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