<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-[#ffffff] rounded-[3px] flex flex-col gap-0 items-start justify-start relative overflow-hidden w-[600px] max-h-[90vh] overflow-y-auto">
      <div class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[43px] relative">
        <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start">
          Edit {{ qrCodeType }} QR Code - {{ qrCode.id }}
        </div>
      </div>
      
      <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative p-4">
        <!-- Website QR Code Edit Form -->
        <div v-if="isWebsiteQR" class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch">
            Website URL
          </div>
          <div class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start flex-1 relative">
              <input 
                type="url" 
                v-model="editableUrl" 
                placeholder="Eg. https://www.mywebsite.com/" 
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>
        </div>

        <!-- Virtual Card QR Code Edit Form -->
        <div v-else-if="isVirtualCardQR" class="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative self-stretch mb-2">
            Virtual Card Information
          </div>
          
          <!-- Name Fields -->
          <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                First Name
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.firstName" 
                  placeholder="John"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Last Name
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.lastName" 
                  placeholder="Doe"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
          </div>

          <!-- Phone Fields -->
          <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Phone
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="tel" 
                  v-model="virtualCardData.phone" 
                  placeholder="+260 123 456 789"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Phone2
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="tel" 
                  v-model="virtualCardData.phone2" 
                  placeholder="+260 123 456 789"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
          </div>

          <!-- Email Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Email Address
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="email" 
                v-model="virtualCardData.email" 
                placeholder="Andrew@aczambia.com"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>

          <!-- Company and Job Fields -->
          <div class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative">
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Company
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.company" 
                  placeholder="John Doe's Company"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start justify-start flex-1 relative">
              <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
                Job
              </label>
              <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
                <input 
                  type="text" 
                  v-model="virtualCardData.job" 
                  placeholder="CEO"
                  class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
                />
              </div>
            </div>
          </div>

          <!-- Address Field -->
          <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
            <label class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal">
              Physical Address
            </label>
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start self-stretch relative">
              <input 
                type="text" 
                v-model="virtualCardData.address" 
                placeholder="P.O Box 123"
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>
        </div>

        <!-- Fallback for other QR types -->
        <div v-else class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch">
            Content
          </div>
          <div class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start flex-1 relative">
              <input 
                type="text" 
                v-model="editableUrl" 
                placeholder="Enter content..." 
                class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" 
              />
            </div>
          </div>
        </div>
      </div>

      <div class="pr-3.5 pb-3 pl-3.5 flex flex-row gap-[18px] items-start justify-end self-stretch shrink-0 relative">
        <div class="flex flex-row gap-0 items-start justify-start shrink-0 relative">
          <div @click="$emit('close')" class="bg-[#e7eaee] rounded-sm pt-[7px] pr-[38px] pb-[7px] pl-[38px] flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer">
            <div class="text-[#424242] text-left font-['Roboto-Bold',_sans-serif] text-xs font-bold relative">
              Close
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-0 items-start justify-start shrink-0 relative">
          <div @click="save" class="bg-[#0c768a] rounded-sm pt-[7px] pr-3 pb-[7px] pl-3 flex flex-row gap-2.5 items-center justify-center shrink-0 w-[97px] h-[31px] relative overflow-hidden cursor-pointer">
            <div class="text-[#ffffff] text-left font-['Roboto-Bold',_sans-serif] text-xs font-bold relative">
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditQRCodePopup',
  props: {
    qrCode: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editableUrl: this.qrCode.url,
      virtualCardData: {
        firstName: '',
        lastName: '',
        phone: '',
        phone2: '',
        email: '',
        company: '',
        job: '',
        address: ''
      }
    };
  },
  computed: {
    isWebsiteQR() {
      return this.qrCode.analytics?.type === 'Website' || 
             (this.qrCode.originalData?.content?.url && !this.qrCode.originalData?.content?.firstName);
    },
    isVirtualCardQR() {
      return this.qrCode.analytics?.type === 'Virtual Card' || 
             this.qrCode.originalData?.content?.firstName ||
             this.qrCode.originalData?.content?.name ||
             (this.qrCode.originalData?.content?.email && !this.qrCode.originalData?.content?.url);
    },
    qrCodeType() {
      if (this.isVirtualCardQR) return 'Virtual Card';
      if (this.isWebsiteQR) return 'Website';
      return 'QR';
    }
  },
  watch: {
    qrCode: {
      handler(newVal) {
        this.editableUrl = newVal.url;
        this.loadVirtualCardData();
      },
      immediate: true
    }
  },
  mounted() {
    this.loadVirtualCardData();
  },
  methods: {
    loadVirtualCardData() {
      if (this.isVirtualCardQR && this.qrCode.originalData?.content) {
        const content = this.qrCode.originalData.content;
        this.virtualCardData = {
          firstName: content.firstName || '',
          lastName: content.lastName || '',
          phone: content.phone || '',
          phone2: content.phone2 || '',
          email: content.email || '',
          company: content.company || content.organization || '',
          job: content.job || content.title || '',
          address: content.address || ''
        };
      }
    },
    save() {
      if (this.isVirtualCardQR) {
        // For virtual cards, emit the virtual card data
        this.$emit('save', {
          ...this.qrCode,
          content: {
            ...this.qrCode.originalData.content,
            firstName: this.virtualCardData.firstName.trim(),
            lastName: this.virtualCardData.lastName.trim(),
            name: `${this.virtualCardData.firstName.trim()} ${this.virtualCardData.lastName.trim()}`.trim(),
            phone: this.virtualCardData.phone.trim(),
            phone2: this.virtualCardData.phone2.trim(),
            email: this.virtualCardData.email.trim(),
            company: this.virtualCardData.company.trim(),
            organization: this.virtualCardData.company.trim(),
            job: this.virtualCardData.job.trim(),
            title: this.virtualCardData.job.trim(),
            address: this.virtualCardData.address.trim()
          }
        });
      } else {
        // For websites and other types, emit the URL
        this.$emit('save', {
          ...this.qrCode,
          url: this.editableUrl,
        });
      }
    },
  },
};
</script>
