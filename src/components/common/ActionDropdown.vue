<template>
  <div class="relative inline-flex items-center justify-center text-left">
    <div ref="triggerRef" @click="toggleDropdown" class="cursor-pointer w-6 h-6 flex items-center justify-center">
      <Icon icon="ph:dots-three-circle" class="text-[#525062] w-10 h-10 hover:text-gray-900 transition-colors duration-150" />
    </div>
    <teleport to="body">
      <transition 
        enter-active-class="transition duration-100 ease-out" 
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" 
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" 
        leave-to-class="transform scale-95 opacity-0">
        <div v-if="isOpen" ref="dropdown"
          class="fixed bg-white rounded-sm flex flex-col overflow-hidden shadow-md origin-top-right font-inter font-medium z-[99999]"
          :style="dropdownStyle" @click.stop>
          <button v-for="(option, index) in options" :key="option.value" @click="handleOptionClick(option)"
            class="w-full py-1 px-3 border-none text-[#111827] text-center text-sm leading-5 transition-colors duration-150 hover:bg-gray-50 active:brightness-95 appearance-none"
            :class="{ 'bg-[#e9e9ed] hover:bg-[#dcdce1]': shouldHighlightOption(option, index), 'opacity-50 cursor-not-allowed': option.disabled }"
            :disabled="option.disabled">
            {{ option.label }}
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue';

// Global dropdown manager
const openDropdowns = new Set()

const closeAllDropdowns = (exceptId) => {
  openDropdowns.forEach(closeCallback => {
    if (closeCallback.id !== exceptId) {
      closeCallback.close()
    }
  })
}

export default {
  name: 'ActionDropdown',
  components: {
    Icon
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    item: {
      type: Object,
      default: () => ({})
    },
    highlightFirst: {
      type: Boolean,
      default: false
    }
  },
  emits: ['action-clicked'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    const dropdownStyle = ref({})
    const triggerRef = ref(null)

    // Create a unique ID for this dropdown instance
    const dropdownId = ref(`dropdown-${Math.random().toString(36).substr(2, 9)}`)

    const updateDropdownPosition = () => {
      if (triggerRef.value) {
        const rect = triggerRef.value.getBoundingClientRect()
        dropdownStyle.value = {
          top: `${rect.bottom + 2}px`,
          right: `${window.innerWidth - rect.right}px`,
          /* compact dropdown sizing */
          minWidth: '110px',
          maxWidth: '220px',
          width: '160px'
        }
      }
    }

    const toggleDropdown = () => {
      if (!isOpen.value) {
        // Close all other dropdowns before opening this one
        closeAllDropdowns(dropdownId.value)
        updateDropdownPosition()
      }
      isOpen.value = !isOpen.value
    }

    const closeDropdown = () => {
      isOpen.value = false
    }

    const handleOptionClick = (option) => {
      if (option.disabled) return

      closeDropdown()
      emit('action-clicked', {
        action: option.value,
        option: option,
        item: props.item
      })
    }

    const shouldHighlightOption = (option, index) => {
      return props.highlightFirst && index === 0
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isOpen.value && triggerRef.value && !triggerRef.value.contains(event.target)) {
        closeDropdown()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      // Register this dropdown with the global manager
      openDropdowns.add({
        id: dropdownId.value,
        close: closeDropdown
      })
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      // Unregister this dropdown from the global manager
      openDropdowns.forEach(item => {
        if (item.id === dropdownId.value) {
          openDropdowns.delete(item)
        }
      })
    })

    return {
      isOpen,
      dropdownStyle,
      triggerRef,
      toggleDropdown,
      closeDropdown,
      handleOptionClick,
      shouldHighlightOption
    }
  }
}
</script>

<style scoped>
/* Only keep essential custom styles that can't be achieved with Tailwind */
button:disabled:hover {
  background-color: transparent !important;
  transform: none !important;
}
</style>