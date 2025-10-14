<template>
  <div class="bg-[#ffffff] flex flex-col gap-[8.33px] items-start justify-start self-stretch relative w-full min-w-0 flex-1">
  <!-- Batch Action Bar - Only show when items are selected (hidden in paginationOnly) -->
  <div v-if="!paginationOnly && showBatchActions && selectedItems.length > 0"
      class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row items-center justify-between self-stretch shrink-0 relative">
      <div class="flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
        <div class="text-[#1e1d26] text-left font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal relative flex items-center justify-start"
          style="letter-spacing: 0.1px">
          <span>
            <span class="batch-action-0-selected-span">Batch Action</span>
            <span class="batch-action-0-selected-span2">({{ selectedItems.length }} Selected)</span>
          </span>
        </div>
      </div>
      <div class="flex flex-row gap-2 items-center justify-start shrink-0 relative">
        <slot name="batch-actions" :selectedItems="selectedItems" :clearSelection="clearSelection">
          <!-- Default batch actions if no slot provided -->
        </slot>
      </div>
    </div>
    
    <!-- Loading indicator -->
  <div v-if="!paginationOnly && loading" class="flex justify-center items-center p-4 w-full border-solid border-[#e2e8f0] border">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-livestock-green"></div>
    </div>

    <!-- No results message -->
  <div v-else-if="!paginationOnly && data.length === 0"
      class="border-solid border-[#e2e8f0] border p-8 pr-8 text-center bg-gray-50 w-full">
      <div class="flex flex-col items-center justify-center gap-3 w-full">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div class="text-gray-600 text-center font-['Montserrat-Medium',_sans-serif] text-sm leading-5 font-medium">
          {{ noDataMessage || 'No data available' }}
        </div>
        <div v-if="hasActiveFilters" class="text-gray-500 text-center font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal">
          Try adjusting your search or filter criteria
        </div>
      </div>
    </div>

    <!-- Table with vertical dividers (HTML table structure) -->
  <div v-else-if="!paginationOnly && showVerticalDividers" class="w-full min-w-0 overflow-x-auto">
      <table class="w-full border-collapse border border-[#e2e8f0]">
        <!-- Table Header -->
        <thead>
          <tr class="bg-[#DCEBED]" :style="{ backgroundColor: headerBackgroundColor }">
            <th 
              v-for="(column, columnIndex) in columns" 
              :key="column.key"
              :style="column.width && column.width !== 'auto' ? { width: column.width } : {}"
                :class="[
                  `pt-1.5 pb-1.5 pl-5 pr-2.5 border-[#e2e8f0] text-black font-['Montserrat-Bold',_sans-serif] text-xs leading-4 font-bold`,
                column.align === 'right' ? 'text-right' : 
                column.align === 'center' ? 'text-center' : 
                'text-left',
                column.width === 'auto' ? 'whitespace-nowrap' : ''
              ]"
              style="letter-spacing: 0.1px">
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr v-for="(item, index) in safeData" :key="getItemKey(item, index)"
            @click="onRowClick(item, index, $event)"
            :class="[
              hoverable ? 'transition-colors duration-200' : '',
              clickableRows ? 'cursor-pointer' : '',
              hoverable && index % 2 === 0 ? 'bg-white hover:bg-[#e2e5e0]' : hoverable ? 'bg-gray-50/30 hover:bg-[#e2e5e0]' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
            ]">
            <td 
              v-for="(column, columnIndex) in columns" 
              :key="column.key"
              :style="column.width && column.width !== 'auto' ? { width: column.width } : {}"
              :class="[
                'py-0 pl-5 pr-2.5 border-[#e2e8f0] border-t',
                column.width === 'auto' ? 'whitespace-nowrap' : ''
              ]">
              <div :class="[
                'flex items-center w-full',
                column.align === 'right' ? 'justify-end' : 
                column.align === 'center' ? 'justify-center' : 
                'justify-start'
              ]">
                <!-- Checkbox integrated into first column -->
                <div v-if="showCheckboxes && columnIndex === 0" class="flex items-center mr-2" @click.stop>
                  <input
                    type="checkbox"
                    :value="getItemValue(item)"
                    v-model="selectedItems"
                  />
                </div>
                
                <!-- Custom slot content -->
                <slot 
                  v-if="column.slot" 
                  :name="column.slot" 
                  :item="item" 
                  :value="getNestedValue(item, column.key)"
                  :index="index"
                >
                  {{ getNestedValue(item, column.key) }}
                </slot>
                <!-- Default content -->
                <span 
                  v-else
                  class="text-[#1e1d26] font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal"
                  style="letter-spacing: 0.1px">
                  {{ formatValue(getNestedValue(item, column.key), column, item) }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table without vertical dividers (flexbox structure) -->
  <div v-else-if="!paginationOnly" class="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
      <!-- Table Header -->
      <div
        class="border-solid border-[#e2e8f0] border-t-[0.83px] border-r border-b-[0.83px] border-l flex flex-col gap-[6.66px] items-start justify-center self-stretch shrink-0 relative"
        :style="{ backgroundColor: headerBackgroundColor }">
        <div
          class="flex flex-row items-center justify-start self-stretch shrink-0 relative">
          <div 
            v-for="(column, columnIndex) in columns" 
            :key="column.key"
            :style="column.width ? { width: column.width } : {}"
            :class="[
              'pt-1.5 pb-2.5 px-2.5',
              column.width ? 'flex flex-row gap-0 items-center justify-start relative' : 'flex flex-row gap-0 items-center justify-start flex-1 relative'
            ]">
            <div class="flex flex-row gap-0 items-center justify-start w-full relative">
              <div class="flex flex-row gap-[6.66px] items-center justify-start w-full relative">
                <div 
                  :class="[
                    `text-black font-['Montserrat-Bold',_sans-serif] text-xs leading-4 font-bold relative w-full flex items-center`,
                    column.align === 'right' ? 'text-right justify-end' : 
                    column.align === 'center' ? 'text-center justify-left' : 
                    'text-left justify-start'
                  ]"
                  style="letter-spacing: 0.1px">
                  {{ column.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Rows -->
      <div v-for="(item, index) in safeData" :key="getItemKey(item, index)"
        @click="onRowClick(item, index, $event)"
        :class="[
          'border-solid border-[#e2e8f0] border flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative overflow-hidden',
          hoverable ? 'transition-colors duration-200' : '',
          clickableRows ? 'cursor-pointer' : '',
          hoverable && index % 2 === 0 ? 'bg-white hover:bg-[#e2e5e0]' : hoverable ? 'bg-gray-50/30 hover:bg-[#e2e5e0]' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
        ]">
        <div class="flex flex-row items-center justify-start self-stretch shrink-0 relative">
          <div 
            v-for="(column, columnIndex) in columns" 
            :key="column.key"
            :style="column.width ? { width: column.width } : {}"
            :class="[
              'py-0 px-2.5',
              column.width ? 'flex flex-row gap-0 items-center justify-start relative' : 'flex flex-row gap-0 items-center justify-start flex-1 relative'
            ]">
            <div class="flex flex-row gap-0 items-center justify-start w-full relative">
              <!-- Checkbox integrated into first column -->
              <div v-if="showCheckboxes && columnIndex === 0" class="flex items-center mr-2" @click.stop>
                <input
                  type="checkbox"
                  :value="getItemValue(item)"
                  v-model="selectedItems"
                />
              </div>
              
              <!-- Custom slot content -->
              <slot 
                v-if="column.slot" 
                :name="column.slot" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
                :index="index"
              >
                {{ getNestedValue(item, column.key) }}
              </slot>
              <!-- Default content -->
              <div 
                v-else
                :class="[
                    `text-[#1e1d26] font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal relative w-full flex items-center`,
                  column.align === 'right' ? 'text-right justify-end' : 
                  column.align === 'center' ? 'text-center justify-center' : 
                  'text-left justify-start'
                ]"
                style="letter-spacing: 0.1px">
                {{ formatValue(getNestedValue(item, column.key), column, item) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
  <div v-if="showPagination && (!loading || paginationOnly) && ((paginationOnly && total > 0) || (!paginationOnly && safeData.length > 0))"
      class="bg-[#ffffff] border-solid border-[#e2e8f0] border pt-[4px] pr-[15px] pb-[4px] pl-[15px] flex flex-row gap-2 items-center justify-center self-stretch shrink-0 relative">
      <div class="flex flex-row gap-2.5 items-center justify-start flex-1 relative">
        <div class="text-[#1e1d26] text-left font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal relative flex-1 flex items-center justify-start"
          style="letter-spacing: 0.1px">
          Showing {{ (currentPage - 1) * limit + 1 }}-{{ Math.min(currentPage * limit, total) }}
          of {{ total }} items
        </div>
      </div>
      <div class="flex flex-row gap-2 items-center justify-start shrink-0 relative">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          :class="[currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-livestock-hover']"
          class="bg-[#ffffff] rounded border-solid border-[#dfe3e8] border shrink-0 w-8 h-8 relative flex items-center justify-center">
          <Icon 
            icon="ph:caret-left-bold" 
            :class="currentPage === 1 ? 'text-gray-300' : 'text-gray-500'" 
            width="20" 
            height="20" 
          />
        </button>

        <!-- Page numbers -->
        <template v-for="page in getPageNumbers()" :key="page">
          <button v-if="page !== '...'" @click="changePage(page)" :class="[
            page === currentPage ? 'bg-livestock-green text-white' : 'bg-[#ffffff] text-[#878788] hover:bg-flat-green-80',
            'rounded border-solid border-[#dfe3e8] border shrink-0 w-8 h-8 relative flex items-center justify-center'
          ]">
            <div :class="[
              'text-center font-[\'Montserrat-',
              page === currentPage ? 'Medium' : 'SemiBold',
              '\',_sans-serif] text-xs leading-4',
              page === currentPage ? 'font-medium' : 'font-semibold'
            ]">
              {{ page }}
            </div>
          </button>
          <div v-else class="shrink-0 w-8 h-8 relative flex items-center justify-center">
            <span class="text-[#878788] text-center text-xs">...</span>
          </div>
        </template>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          :class="[currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-livestock-hover']"
          class="bg-[#ffffff] rounded border-solid border-[#dfe3e8] border shrink-0 w-8 h-8 relative flex items-center justify-center">
          <Icon 
            icon="ph:caret-right-bold" 
            :class="currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'" 
            width="20" 
            height="20" 
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "DataTable",
  components: {
    Icon
  },
  props: {
    columns: {
      type: Array,
      required: true,
      // Expected format: [{ key: 'name', label: 'Name', slot: 'name-slot' }]
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    noDataMessage: {
      type: String,
      default: ''
    },
    hasActiveFilters: {
      type: Boolean,
      default: false
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    clickableRows: {
      type: Boolean,
      default: false
    },
    // Render only the pagination controls (hide table content)
    paginationOnly: {
      type: Boolean,
      default: false
    },
    // If true, bypass the interactive element guard and allow row-click to fire from any child
    allowRowClickThrough: {
      type: Boolean,
      default: false
    },
    showCheckboxes: {
      type: Boolean,
      default: false
    },
    showBatchActions: {
      type: Boolean,
      default: false
    },
    showVerticalDividers: {
      type: Boolean,
      default: false
    },
    headerBackgroundColor: {
      type: String,
      default: '#f9f9f9'
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['page-change', 'row-click', 'update:modelValue', 'selection-change'],
  computed: {
    safeData() {
      return Array.isArray(this.data) ? this.data.filter(item => item != null) : [];
    },
    selectedItems: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
        this.$emit('selection-change', value);
      }
    }
  },
  methods: {
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.$emit('page-change', page);
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
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    formatValue(value, column, item) {
      if (column.formatter && typeof column.formatter === 'function') {
        return column.formatter(value, item);
      }
      return value || 'N/A';
    },
    getItemKey(item, index) {
      return this.getNestedValue(item, this.itemKey) || index;
    },
    getItemValue(item) {
      return this.getNestedValue(item, this.itemKey) || item;
    },
    clearSelection() {
      this.selectedItems = [];
    },
    onRowClick(item, index, event) {
      // Check if the clicked element is an interactive element that should not trigger row selection
      const clickedElement = event.target;
      const isInteractiveElement = this.isInteractiveElement(clickedElement);

      // Debug logging
      console.log('Row clicked:', {
        element: clickedElement,
        tagName: clickedElement.tagName,
        className: clickedElement.className,
        isInteractive: isInteractiveElement,
        parentElement: clickedElement.parentElement
      });

  // If an interactive element was clicked, don't trigger row click unless explicitly allowed
  if (isInteractiveElement && !this.allowRowClickThrough) {
        console.log('Interactive element detected, preventing row selection');
        return;
      }

      // If checkboxes are enabled, clicking the row should toggle the checkbox.
      if (this.showCheckboxes) {
        const itemValue = this.getItemValue(item);
        const selectedIndex = this.selectedItems.indexOf(itemValue);

        if (selectedIndex > -1) {
          // Item is already selected, so unselect it.
          const newSelection = [...this.selectedItems];
          newSelection.splice(selectedIndex, 1);
          this.selectedItems = newSelection;
        } else {
          // Item is not selected, so select it.
          this.selectedItems = [...this.selectedItems, itemValue];
        }
      }

      // If rows are generally clickable, emit the row-click event.
      if (this.clickableRows) {
        this.$emit('row-click', item, index);
      }
    },

    isInteractiveElement(element) {
      // List of interactive elements and classes that should not trigger row selection
      const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SVG', 'PATH'];
      const interactiveClasses = ['btn', 'button', 'clickable', 'dropdown', 'action', 'iconify'];
      const interactiveRoles = ['button', 'link', 'menuitem'];
      const interactiveSelectors = [
        'button',
        'a',
        'input',
        'select',
        'textarea',
        '.btn',
        '.button',
        '.clickable',
        '.dropdown',
        '.action',
        '.iconify',
        '[role="button"]',
        '[role="link"]',
        '[role="menuitem"]',
        '[data-action]',
        '[onclick]'
      ];

      // Check if the element itself is interactive
      if (interactiveTags.includes(element.tagName)) {
        return true;
      }

      // Check if element has interactive classes
      if (interactiveClasses.some(cls => element.classList.contains(cls))) {
        return true;
      }

      // Check if element has interactive role
      if (interactiveRoles.includes(element.getAttribute('role'))) {
        return true;
      }

      // Check if element is inside an interactive element using comprehensive selector
      const closestInteractive = element.closest(interactiveSelectors.join(', '));
      if (closestInteractive) {
        return true;
      }

      // Check for elements with click handlers (they likely are interactive)
      if (element.onclick || element.getAttribute('onclick')) {
        return true;
      }

      // Check for Vue event listeners (look for data attributes that suggest interactivity)
      const hasVueClickHandler = Array.from(element.attributes).some(attr => 
        attr.name.includes('click') || attr.name.includes('@click')
      );

      if (hasVueClickHandler) {
        return true;
      }

      return false;
    }
  }
};
</script>

<style scoped>
/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background-color: white;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  background-color: #0C768A;
  border-color: #0C768A;
}

input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(12, 118, 138, 0.2);
}

input[type="checkbox"]:not(:checked) {
  border-color: #d1d5db;
  background-color: white;
}

input[type="checkbox"]:hover:not(:checked) {
  border-color: #0C768A;
}

/* Table styles for proper grid layout */
table {
  border-spacing: 0;
}

th {
  border-bottom: 1px solid #e2e8f0;
}

/* Ensure consistent border styling */
th:not(:last-child), 
td:not(:last-child) {
  border-right: 1px solid #e2e8f0;
}
</style>