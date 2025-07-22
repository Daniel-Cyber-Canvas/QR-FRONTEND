<template>
  <div v-if="hasLabel" class="self-stretch flex flex-col items-start justify-start gap-1 text-left text-xs text-neutral-800 font-roboto">
    <div class="flex-1 flex flex-row items-start justify-start">
      <div class="relative text-[#424242] text-left font-['Roboto-Medium',_sans-serif] text-xs font-medium">{{ label }}</div>
    </div>
    <input v-if="type !== 'textarea'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      class="bg-[#ffffff] drop-shadow-sm self-stretch rounded-[3px] border-solid border-[#d2d2d2] border [outline:none] font-roboto text-xs bg-shades-white box-border h-7 overflow-hidden shrink-0 flex flex-row items-start justify-start py-[7px] px-2.5 text-neutral-800 focus:border-darkorange focus:outline-none focus:ring-1 focus:ring-inset focus:ring-darkorange sm:leading-4"
      :placeholder="placeholder" :type="type" />
    <textarea v-else :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      class="bg-[#ffffff] drop-shadow-sm self-stretch rounded-[3px] border-solid border-[#d2d2d2] border [outline:none] font-roboto text-xs bg-shades-white box-border overflow-hidden shrink-0 py-[7px] px-2.5 text-neutral-800 focus:border-darkorange focus:outline-none focus:ring-1 focus:ring-inset focus:ring-darkorange sm:leading-4"
      :placeholder="placeholder" :rows="rows"></textarea>
  </div>
  <div v-else class="self-stretch flex flex-col items-start justify-start gap-1.5 text-left text-xs text-neutral-800 font-roboto">
    <input v-if="type !== 'textarea'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      class="drop-shadow-sm self-stretch rounded-10xs border-lightgray-200 border-[1px] border-solid [outline:none] font-roboto text-xs bg-shades-white box-border h-7 overflow-hidden shrink-0 flex flex-row items-start justify-center py-[7px] px-1.5 text-[rgba(0,0,0,0.40)] focus:border-darkorange focus:outline-none focus:ring-1 focus:ring-inset focus:ring-darkorange sm:leading-4"
      :placeholder="placeholder" :type="type" />
    <textarea v-else :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      class="drop-shadow-sm self-stretch rounded-10xs border-lightgray-200 border-[1px] border-solid [outline:none] font-roboto text-xs bg-shades-white box-border overflow-hidden shrink-0 py-[7px] px-1.5 text-[rgba(0,0,0,0.40)] focus:border-darkorange focus:outline-none focus:ring-1 focus:ring-inset focus:ring-darkorange sm:leading-4"
      :placeholder="placeholder" :rows="rows"></textarea>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "InputField",
  props: {
    id: String,
    modelValue: String,
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    hasLabel: {
      type: Boolean,
      default: true
    },
    rows: {
      type: Number,
      default: 4
    }
  },
  emits: ['update:modelValue']
});
</script>