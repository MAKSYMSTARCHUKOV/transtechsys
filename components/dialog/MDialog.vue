<template>
  <v-overlay :value="dialog.show" opacity="0.8" z-index="1001">
    <div class="v-auth">
      <transition name="right" mode="out-in">
        <form>
          <img
            v-if="dialog.ok && !dialog.extreme"
            id="close"
            :src="$imgSrc('icons/cancel.svg')"
            alt="x"
            class="pointer"
            @click="close"
          />
          <img
            :src="dialog.image"
            alt=""
            style="grid-column: 1 / -1; height: 50px; justify-self: center"
          />
          <div class="overview h" v-html="dialog.text"></div>
          <div class="buttons d-flex mt-7 mb-7 justify-center w-100">
            <div class="button w-100">
              <m-button
                :disabled="disabled"
                shade="blue"
                @click.native="action"
                >{{ dialog.buttons[0] }}</m-button
              >
            </div>
            <div
              v-if="!dialog.ok"
              :disabled="dialog.action"
              class="button w-100"
            >
              <m-button
                shade="blue"
                :disabled="disabled"
                @click.native="close"
                >{{ dialog.buttons[1] }}</m-button
              >
            </div>
          </div>
        </form>
      </transition>
    </div>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex';
export default {
  inheritAttrs: false,
  computed: {
    ...mapState('profile', ['dialog']),
    disabled() {
      if (this.dialog.action === false && this.dialog.close === false) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.dialog,
      (newV, oldV) => {
        if (newV) {
          document.querySelector('html').style.overflowY = 'hidden';
        } else {
          document.querySelector('html').style.overflowY = 'auto';
        }
      }
    );
  },
  beforeDestroy() {
    this.unwatch();
  },
  methods: {
    close(e) {
      const b = e.target.closest('.m-button');
      this.$toggle(b);
      this.$nextTick(() => {
        this.$store.commit('profile/closeDialog', true);
      });
    },
    action(e) {
      const b = e.target.closest('.m-button');
      this.$toggle(b);
      this.$nextTick(() => {
        this.$store.commit('profile/actionDialog', true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/dialog.scss';
.buttons {
  height: 20px;
  grid-column: 1 / -1;
  .button {
    position: relative;

    .m-button {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .m-button {
    top: 0;
  }
}
</style>
