<template>
  <transition name="loading">
    <div
      v-if="loading"
      :key="loading"
      class="loading-page"
      :style="{
        position: absolute ? 'absolute' : 'fixed',
        opacity,
        zIndex,
        maxWidth
      }"
    >
      <img :src="$imgSrc('loading.gif')" alt="" />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    state: {
      type: Boolean,
      default: undefined
    },
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
    },
    maxWidth: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      loading: this.state
    };
  },
  watch: {
    state(newV) {
      this.loading = newV;
    }
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_mix.scss';
* {
  user-select: none;
}
.loading-page {
  cursor: wait;
  z-index: 9999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f2;
  img {
    width: 30%;
    height: auto;
    @include tablet() {
      width: 10%;
    }
  }
}
.loading-enter,
.loading-leave-to {
  opacity: 0;
}
.loading-enter-active {
  transition: opacity 0.15s;
}
.loading-leave-active {
  transition: opacity 0.2s 0.2s;
}
</style>
