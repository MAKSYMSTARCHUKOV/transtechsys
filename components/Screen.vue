<template>
  <div
    v-if="$store.getters.screen"
    id="screen-page"
    :key="$store.getters.screen"
    :style="{
      position: absolute ? 'absolute' : 'fixed',
      opacity,
      zIndex: zIndex
    }"
  ></div>
</template>

<script>
export default {
  props: {
    absolute: {
      type: Boolean,
      default: false
    },
    opacity: {
      type: String,
      default: '1'
    },
    zIndex: {
      type: Number,
      default: 9999
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  user-select: none;
}
#screen-page {
  z-index: 9999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: wait;
}
</style>
