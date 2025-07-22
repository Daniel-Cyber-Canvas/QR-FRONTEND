<template>
  <Teleport to="body">
    <div class="flex flex-col fixed inset-0 portalPopupOverlay" :style="popupStyle" @click="onOverlayClick">
      <div ref="relContainerRef" :style="relativeStyle">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script>
import { defineComponent, Teleport } from 'vue';

export default defineComponent({
  name: 'PortalPopup',
  data() {
    return {
      relContainerRef: null,
      relativeStyle: { opacity: "0", alignSelf: 'flex-start' },
    }
  },
  props: {
    isOpen: { type: Boolean, default: false },
    overlayColor: { type: String },
    placement: { type: String, default: "Centered" },
    zIndex: { type: Number, default: 100 },
    left: { type: Number, default: 0 },
    right: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    bottom: { type: Number, default: 0 },
    onOutsideClick: { type: Function },
    relativeLayerRef: { type: HTMLElement },
  },
  mounted() {
    this.setPosition();
    window.addEventListener("resize", this.setPosition);
    window.addEventListener("scroll", this.setPosition, true);
  },
  unmounted() {
    window.removeEventListener("resize", this.setPosition);
    window.removeEventListener("scroll", this.setPosition, true);
  },
  methods: {
    onOverlayClick(e) {
      const target = e.target;
      if (this.onOutsideClick && target.classList.contains("portalPopupOverlay")) {
        this.onOutsideClick();
      }
      e.stopPropagation();
    },
    setPosition() {
      const relativeItem = this.relativeLayerRef?.getBoundingClientRect();
      const el = this.$refs.relContainerRef;
      const containerItem = el.getBoundingClientRect();
      const style = {};
      if (relativeItem && containerItem) {
        const {
          x: relativeX,
          y: relativeY,
          width: relativeW,
          height: relativeH,
        } = relativeItem;
        const { width: containerW, height: containerH } = containerItem;
        style.position = "absolute";
        switch (this.placement) {
          case "Top left":
            style.top = (relativeY - containerH - this.top) + "px";
            style.left = (relativeX + this.left) + "px";
            break;
          case "Top right":
            style.top = (relativeY - containerH - this.top) + "px";
            style.left = (relativeX + relativeW - containerW - this.right) + "px";
            break;
          case "Bottom left":
            style.top = (relativeY + relativeH + this.bottom) + "px";
            style.left = (relativeX + this.left) + "px";
            break;
          case "Bottom right":
            style.top =
              (relativeY + relativeH + this.bottom) + "px";
            style.left = (relativeX + relativeW - containerW - this.right) + "px";
            break;
        }
        this.relativeStyle = style;
      } else {
        style.maxWidth = "90%";
        style.maxHeight = "90%";
        this.relativeStyle = style;
      }
    }
  },
  computed: {
    popupStyle() {
      const style = {};
      style.zIndex = 100;
      style.opacity = 1;
      if (this.overlayColor) {
        style.backgroundColor = this.overlayColor;
      }
      if (!this.relativeLayerRef) {
        switch (this.placement) {
          case "Centered":
            style.alignItems = "center";
            style.justifyContent = "center";
            break;
          case "Top left":
            style.alignItems = "flex-start";
            break;
          case "Top center":
            style.alignItems = "center";
            break;
          case "Top right":
            style.alignItems = "flex-end";
            break;
          case "Bottom left":
            style.alignItems = "flex-start";
            style.justifyContent = "flex-end";
            break;
          case "Bottom center":
            style.alignItems = "center";
            style.justifyContent = "flex-end";
            break;
          case "Bottom right":
            style.alignItems = "flex-end";
            style.justifyContent = "flex-end";
            break;
        }
      }
      return style;
    }
  }
})
</script>