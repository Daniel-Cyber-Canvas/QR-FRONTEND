<template>
  <div class="bg-[#ffffff] border-solid border-[#e2e8f0] border flex flex-col gap-0 items-stretch justify-start w-full shrink-0 relative">
    <div class="flex flex-row items-center justify-between w-full shrink-0 relative px-2">
      <div class="flex flex-row gap-0 items-center justify-start flex-1 relative min-w-0">
        <div class="border-solid border-gray-200 border-b pt-4 pr-6 pb-4 pl-6 flex flex-row gap-3 items-center justify-start shrink-0 relative">
          <div class="flex flex-row gap-0 items-center justify-center shrink-0 relative">
            <input type="checkbox" v-model="qrItem.selected" class="bg-white rounded-md border-solid border-gray-300 border shrink-0 w-5 h-5 relative">
          </div>
          <div class="bg-white p-2 rounded-md border border-gray-300">
            <qrcode-vue :value="qrItem.qrCodeValue || qrItem.url" :size="40" level="H" />
          </div>
          <div class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative">
            <div class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative">
              {{ qrItem.analytics.type }}
            </div>
            <div class="text-gray-900 text-left font-['Roboto-Medium',_sans-serif] text-sm leading-5 font-medium relative">
              QR-{{ qrItem.id }}
            </div>
            <div class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative">
              <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative">
                {{ qrItem.modified }}
              </div>
            </div>
          </div>
        </div>
        <div class="pt-4 pr-6 pb-4 pl-6 flex flex-col gap-0 items-start justify-center flex-1 h-[72px] relative min-w-0">
          <div class="flex flex-col gap-[5px] items-start justify-start w-full relative">
            <div class="text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative">
              {{ qrItem.analytics.type }}
            </div>
            <a :href="qrItem.url" target="_blank" class="text-[#0c768a] text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative hover:underline truncate w-full">
              {{ qrItem.url }}
            </a>
            <div class="flex flex-row gap-[5px] items-center justify-start shrink-0 relative">
              <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative">
                Modified: {{ qrItem.modified }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-[5px] items-center justify-end shrink-0 pr-6 relative">
        <Button text="Analytics" variant="outline" @click="$emit('analytics', qrItem.id)" />
        <div class="flex flex-row gap-1 items-center justify-center shrink-0 relative">
          <div class="rounded-lg flex flex-row gap-0 items-center justify-center shrink-0 relative p-2">
            <Icon icon="ph:download-simple" width="24" height="24" @click="$emit('download', qrItem.id)" class="cursor-pointer text-green-500 hover:text-green-700" />
          </div>
          <div class="rounded-lg flex flex-row gap-0 items-center justify-center shrink-0 relative p-2">
            <Icon icon="iconamoon:edit" width="24" height="24" @click="$emit('edit', qrItem.id)" class="cursor-pointer text-blue-500 hover:text-blue-700" />
          </div>
          <div class="rounded-lg flex flex-row gap-0 items-center justify-center shrink-0 relative p-2">
            <Icon icon="mingcute:delete-line" width="24" height="24" @click="$emit('delete', qrItem.id)" class="cursor-pointer text-red-500 hover:text-red-700" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import QrcodeVue from 'qrcode.vue';
import Button from './Button.vue';

export default {
  name: 'QRCodeItem',
  components: {
    Icon,
    QrcodeVue,
    Button,
  },
  props: {
    qrItem: {
      type: Object,
      required: true,
    },
  },
  emits: ['analytics', 'delete', 'edit', 'download'],
};
</script>