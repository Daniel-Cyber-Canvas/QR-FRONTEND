<template>
    <button
    class="bg-[#ffffff] rounded-[3px] border-solid border-[#d2d2d2] border pt-[7px] pb-[7px] flex flex-row pr-4 pl-4 items-center justify-between shrink-0 relative overflow-hidden hover:bg-[d2d2d2] hover-ease-in hover:duration-500"
  >
    <div class="text-[#000000] text-center font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
      {{ text }}
    </div>
  </button>
</template>

<script>
import { defineComponent } from 'vue';
    export default defineComponent({
        name: "Button",
        props: {
            text: String
        }
    });
</script>

<style scoped>

</style>