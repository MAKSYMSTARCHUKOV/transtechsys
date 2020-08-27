<template>
  <v-overlay :value="overlay.visible" opacity="0.8" z-index="999">
    <div class="v-auth" :style="{ maxWidth }">
      <transition :name="transitionName" mode="out-in">
        <keep-alive>
          <component :is="currentComponent" v-bind="$attrs"></component>
        </keep-alive>
      </transition>
    </div>
  </v-overlay>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    maxWidth: {
      type: String,
      default: '580px'
    }
  },
  data() {
    return {
      overlay: this.$store.state.overlay
    };
  },
  computed: {
    currentComponent() {
      return this.$store.state.overlay.mode;
    },
    transitionName() {
      if (this.overlay.mode === 'signin') {
        return 'right';
      }
      if (
        this.overlay.mode === 'forgot' ||
        this.overlay.mode === 'terms' ||
        this.overlay.mode === 'register' ||
        this.overlay.mode === 'user-register' ||
        this.overlay.mode === 'success' ||
        this.overlay.mode === 'success-register' ||
        this.overlay.mode === 'success-forgot' ||
        this.overlay.mode === 'success-reset'
      ) {
        return 'left';
      }
      return 'right';
    }
  },
  mounted() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.overlay,
      (newV, oldV) => {
        if (newV) {
          const a = document.querySelector('.v-auth');
          const ov = document.querySelector('.v-overlay__content');
          const w = window.innerHeight;
          document.querySelector('html').style.overflowY = 'hidden';
          if (a.offsetHeight > w) {
            ov.style.alignItems = 'flex-start';
            a.style.marginTop = '80px';
          }
        } else {
          document.querySelector('html').style.overflowY = 'auto';
        }
      }
    );
  },
  beforeDestroy() {
    this.unwatch();
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
