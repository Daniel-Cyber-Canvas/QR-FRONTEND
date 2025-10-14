<template>
    <div :class="['border-solid border-[#e2e8f0] border pt-2 pr-[13px] pb-2 pl-[13px] flex flex-col gap-2.5 items-center justify-start flex-1 h-[67px] min-w-[236px] relative overflow-hidden', backgroundColor]">
        <div class="flex flex-row items-center justify-between self-stretch shrink-0 h-[51px] relative">
            <div class="flex flex-col gap-0 items-center justify-start shrink-0 relative" :class="labelWidth">
                <div class="pt-0.5 pb-0.5 flex flex-row gap-[26px] items-center justify-center self-stretch shrink-0 relative">
                    <div class="text-[#000000] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex-1">
                        {{ label }}
                    </div>
                </div>
                <div class="pt-[5px] pb-[5px] flex flex-col gap-2.5 items-center justify-center shrink-0 w-[49px] relative">
                    <div class="text-[#000000] text-left font-['Manrope-Regular',_sans-serif] text-2xl font-normal relative self-stretch">
                        {{ count }}
                    </div>
                </div>
            </div>
            <div class="p-2.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                <Icon :icon="icon" width="41" height="41" style="color: 484848" />
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: 'StatCard',
    components: {
        Icon
    },
    props: {
        label: {
            type: String,
            required: true
        },
        count: {
            type: [Number, String],
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        backgroundColor: {
            type: String,
            default: 'bg-[#f5f5f5]'
        },
        labelWidth: {
            type: String,
            default: 'w-14'
        }
    }
}
</script>
