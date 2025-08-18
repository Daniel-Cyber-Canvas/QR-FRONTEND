<template>
  <div
    class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-[4px] pr-[15px] pb-[4px] pl-[15px] flex flex-row gap-2 items-center justify-center self-stretch shrink-0 relative"
  >
    <div class="flex flex-row gap-2.5 items-center justify-start flex-1 relative" v-if="showInfo">
      <div
        class="text-[#1e1d26] text-left font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal relative flex-1 flex items-center justify-start"
        style="letter-spacing: 0.1px"
      >
        Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
      </div>
    </div>
    <div class="flex flex-row gap-2 items-center justify-start shrink-0 relative">
      <button
        @click="emitChange(currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-livestock-hover']"
        class="bg-[#ffffff] rounded border-solid border-[#dfe3e8] border shrink-0 w-8 h-8 relative flex items-center justify-center"
      >
        <Icon
          icon="ph:caret-left-bold"
          :class="currentPage === 1 ? 'text-gray-300' : 'text-gray-500'"
          width="20"
          height="20"
        />
      </button>

      <!-- Page numbers -->
      <template v-for="page in getPageNumbers()" :key="page + '-' + currentPage">
        <button
          v-if="page !== '...'"
          @click="emitChange(page)"
          :class="[
            page === currentPage ? 'bg-livestock-green text-white' : 'bg-[#ffffff] text-[#878788] hover:bg-flat-green-80',
            'rounded border-solid border-[#dfe3e8] border shrink-0 w-8 h-8 relative flex items-center justify-center'
          ]"
        >
          <div
            :class="[
              'text-center font-[\'Montserrat-',
              page === currentPage ? 'Medium' : 'SemiBold',
              '\',_sans-serif] text-xs leading-4',
              page === currentPage ? 'font-medium' : 'font-semibold'
            ]"
          >
            {{ page }}
          </div>
        </button>
        <div v-else class="shrink-0 w-8 h-8 relative flex items-center justify-center">
          <span class="text-[#878788] text-center text-xs">...</span>
        </div>
      </template>

      <button
        @click="emitChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        :class="[currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-livestock-hover']"
        class="bg-[#ffffff] rounded border-solid border-[#dfe3e8] border shrink-0 w-8 h-8 relative flex items-center justify-center"
      >
        <Icon
          icon="ph:caret-right-bold"
          :class="currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'"
          width="20"
          height="20"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'Pagination',
  components: { Icon },
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    pageSize: { type: Number, default: 10 },
    showInfo: { type: Boolean, default: true },
  },
  emits: ['page-change'],
  computed: {
    startItem() {
      return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.pageSize, this.totalItems);
    },
  },
  methods: {
    emitChange(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit('page-change', page);
      }
    },
    getPageNumbers() {
      const pages = [];
      const maxPagesToShow = 5;

      if (this.totalPages <= maxPagesToShow) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        let startPage = Math.max(2, this.currentPage - 1);
        let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

        if (this.currentPage <= 2) {
          endPage = 3;
        }

        if (this.currentPage >= this.totalPages - 1) {
          startPage = this.totalPages - 2;
        }

        if (startPage > 2) {
          pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < this.totalPages - 1) {
          pages.push('...');
        }

        pages.push(this.totalPages);
      }

      return pages;
    },
  },
};
</script>

<style scoped>
/* Provide fallbacks for project-specific utility classes used in the original pagination */
.bg-livestock-green { background-color: #335214; }
.hover\:bg-livestock-hover:hover { background-color: #e2e5e0; }
.hover\:bg-flat-green-80:hover { background-color: #e2e5e0; }
</style>
