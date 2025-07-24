<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-[#ffffff] rounded-[3px] flex flex-col gap-0 items-start justify-start relative overflow-hidden w-[600px]">
      <div class="bg-[rgba(119,177,188,0.32)] p-3.5 flex flex-row gap-2.5 items-start justify-start self-stretch shrink-0 h-[43px] relative">
        <div class="text-[#000000] text-left font-['Roboto-Medium',_sans-serif] text-[15px] font-medium relative flex items-center justify-start">
          QR Code - {{ qrCode.id }}
        </div>
      </div>
      <div class="flex flex-col items-start justify-start self-stretch shrink-0 relative p-4">
        <div class="flex flex-col gap-1 items-start justify-start self-stretch shrink-0 relative">
          <div class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-[15px] font-normal relative self-stretch">
            Website URL
          </div>
          <div class="flex flex-row gap-1 items-center justify-start self-stretch shrink-0 relative">
            <div class="rounded border-solid border-neutral-200 border p-2 flex flex-row gap-2 items-center justify-start flex-1 relative">
              <input type="url" v-model="editableUrl" placeholder="Eg. https://www.mywebsite.com/" class="text-neutral-800 text-left font-['Roboto-Regular',_sans-serif] text-sm font-normal relative flex-1 h-[19px] border-none outline-none bg-transparent" />
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
    };
  },
  watch: {
    qrCode(newVal) {
      this.editableUrl = newVal.url;
    },
  },
  methods: {
    save() {
      this.$emit('save', {
        ...this.qrCode,
        url: this.editableUrl,
      });
    },
  },
};
</script>
