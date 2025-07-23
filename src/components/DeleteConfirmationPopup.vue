<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-xl border-solid border-[#e2e8f0] border p-6 flex flex-col gap-8 items-center justify-start relative overflow-hidden max-w-md mx-4"
    >
      <div
        class="flex flex-col gap-5 items-start justify-start self-stretch shrink-0 relative"
      >
        <div
          class="bg-error-100 rounded-[28px] border-solid border-error-50 border-8 shrink-0 w-12 h-12 relative flex items-center justify-center"
        >
          <Icon icon="material-symbols:warning-outline" width="24" height="24" color="#dc2626" />
        </div>
        <div
          class="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative"
        >
          <div
            class="text-gray-900 text-left font-text-lg-medium-font-family text-text-lg-medium-font-size leading-text-lg-medium-line-height font-text-lg-medium-font-weight relative self-stretch"
          >
            Delete QR Code
          </div>
          <div
            class="text-gray-500 text-left font-text-sm-normal-font-family text-text-sm-normal-font-size leading-text-sm-normal-line-height font-text-sm-normal-font-weight relative self-stretch"
          >
            Are you sure you want to delete "{{ itemType }}" ({{ itemCode }})? This action cannot be undone.
          </div>
        </div>
      </div>
      <div
        class="flex flex-row gap-3 items-start justify-start self-stretch shrink-0 relative"
      >
        <Button
          text="Cancel"
          variant="outline"
          @click="onCancel"
          class="flex-1"
        />
        <Button
          text="Delete"
          variant="error"
          @click="onConfirm"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';
import Button from './Button.vue';

export default defineComponent({
  name: 'DeleteConfirmationPopup',
  components: {
    Icon,
    Button
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    itemType: {
      type: String,
      default: 'QR Code'
    },
    itemCode: {
      type: String,
      default: ''
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    onConfirm() {
      this.$emit('confirm');
    },
    onCancel() {
      this.$emit('cancel');
    }
  }
});
</script>

<style scoped>
.font-text-lg-medium-font-family {
  font-family: 'Inter', sans-serif;
}

.text-text-lg-medium-font-size {
  font-size: 18px;
}

.leading-text-lg-medium-line-height {
  line-height: 28px;
}

.font-text-lg-medium-font-weight {
  font-weight: 600;
}

.font-text-sm-normal-font-family {
  font-family: 'Inter', sans-serif;
}

.text-text-sm-normal-font-size {
  font-size: 14px;
}

.leading-text-sm-normal-line-height {
  line-height: 20px;
}

.font-text-sm-normal-font-weight {
  font-weight: 400;
}

.bg-error-100 {
  background-color: #fee2e2;
}

.border-error-50 {
  border-color: #fef2f2;
}

.bg-error-600 {
  background-color: #dc2626;
}

.border-error-600 {
  border-color: #dc2626;
}

.hover\:bg-error-700:hover {
  background-color: #b91c1c;
}
</style>