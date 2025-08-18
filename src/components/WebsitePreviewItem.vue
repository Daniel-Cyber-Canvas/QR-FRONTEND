<template>
  <div class="bg-[#ffffff] border-solid border-[#e2e8f0] border flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
    <div class="flex flex-row items-center justify-between self-stretch shrink-0 relative">
      <div class="flex flex-row gap-0 items-center justify-start flex-1 relative">
        <div class="pt-4 pr-6 pb-4 pl-6 flex flex-row gap-3 items-center justify-start shrink-0 relative">
          <img :src="imageSrc" alt="placeholder-qr" class="shrink-0 w-[77px] h-[77px] relative" style="object-fit: cover; aspect-ratio: 1" loading="lazy" />
          <div class="flex flex-col gap-[5px] items-start justify-start shrink-0 relative">
            <div class="text-gray-900 text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative">
              {{ item.analytics?.type || 'Website' }}
            </div>
            <div class="text-gray-900 text-left font-['Roboto-Medium',_sans-serif] text-sm leading-5 font-medium relative">
              {{ item.displayName || `QR-${item.id}` }}
            </div>
            <div class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative">
              <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative">
                {{ item.created || item.modified }}
              </div>
            </div>
          </div>
        </div>
        <div class="pt-4 pr-6 pb-4 pl-6 flex flex-col gap-0 items-start justify-center flex-1 relative">
          <div class="flex flex-col gap-[5px] items-start justify-start self-stretch shrink-0 relative">
            <div class="text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold relative">
              {{ item.analytics?.type || 'Website' }}
            </div>
            <a :href="item.url" target="_blank" class="text-[#0c768a] text-left font-['Roboto-Regular',_sans-serif] text-sm leading-5 font-normal relative self-stretch hover:underline truncate">
              {{ item.url }}
            </a>
            <div class="flex flex-row gap-[5px] items-center justify-center shrink-0 relative">
              <div class="text-gray-500 text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal relative">
                Modified: {{ item.modified }}
              </div>
            </div>
          </div>
        </div>
      </div>
  <div class="flex flex-row gap-[5px] items-center justify-end shrink-0 w-[429.5px] relative">
        <Button
          text="Analytics"
          :variant="analyticsActive ? 'solid' : 'outline'"
          @click="$emit('analytics', item)"
        />
    <div class="p-4 flex flex-row gap-1 items-center justify-start shrink-0 w-[160px] h-[72px] relative">
      <div class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative">
    <div class="rounded-lg p-2.5 flex flex-row gap-2 items-center justify-center shrink-0 relative overflow-hidden">
  <Icon icon="ph:download-simple" width="24" height="24" style="color: #667085" @click="$emit('download', item)" class="cursor-pointer" />
    </div>
      </div>
          <div class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative">
            <div class="rounded-lg p-2.5 flex flex-row gap-2 items-center justify-center shrink-0 relative overflow-hidden">
      <Icon icon="material-symbols:delete-outline-rounded" width="24" height="24" style="color: #667085" @click="$emit('delete', item)" class="cursor-pointer" />
            </div>
          </div>
          <div class="rounded-lg flex flex-row gap-0 items-start justify-start shrink-0 relative">
            <div class="rounded-lg p-2.5 flex flex-row gap-2 items-center justify-center shrink-0 relative overflow-hidden">
      <Icon icon="mynaui:edit" width="24" height="24" style="color: #667085" @click="$emit('edit', item)" class="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import Button from '@/components/Button.vue';

export default {
  name: 'WebsitePreviewItem',
  components: { Icon, Button },
  props: {
    item: {
      type: Object,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    analyticsActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['analytics', 'delete', 'edit', 'download'],
};
</script>

<style scoped>
</style>
