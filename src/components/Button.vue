<template>
    <button
    :class="buttonClasses"
  >
    <div :class="textClasses">
      {{ text }}
    </div>
  </button>
</template>

<script>
import { defineComponent } from 'vue';
    export default defineComponent({
        name: "Button",
        props: {
            text: String,
            variant: {
                type: String,
                default: 'solid',
                validator: (value) => ['solid', 'outline', 'error'].includes(value)
            }
        },
        computed: {
            buttonClasses() {
                const baseClasses = 'rounded-[3px] border-solid border pt-[7px] pb-[7px] flex flex-row pr-4 pl-4 items-center justify-center shrink-0 relative overflow-hidden hover-ease-in hover:duration-500';
                
                if (this.variant === 'outline') {
                    return `${baseClasses} bg-white border-[#0C768A] hover:bg-gray-50`;
                }
                
                if (this.variant === 'error') {
                    return `${baseClasses} bg-[#dc2626] border-[#dc2626] hover:bg-[#b91c1c]`;
                }
                
                return `${baseClasses} bg-[#0C768A] border-[#d2d2d2] hover:bg-[#0a5f6f]`;
            },
            textClasses() {
                const baseClasses = 'text-center font-[\'Roboto-Regular\',_sans-serif] text-xs font-normal relative';
                
                if (this.variant === 'outline') {
                    return `${baseClasses} text-[#0C768A]`;
                }
                
                return `${baseClasses} text-[#ffffff]`;
            }
        }
    });
</script>

<style scoped>

</style>