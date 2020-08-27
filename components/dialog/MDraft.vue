<template>
  <v-overlay :value="mDraft.show" opacity="0.8" z-index="1000">
    <div class="v-auth">
      <form>
        <img
          id="close"
          :src="$imgSrc('icons/cancel.svg')"
          alt="x"
          class="pointer"
          @click="$store.commit('profile/hideDraft')"
        />
        <h1>
          шаблоны | <br v-if="mobile" /><span>{{ mDraft.draft.title }}</span>
        </h1>
        <draft :popup="true"></draft>
      </form>
    </div>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['mobile']),
    ...mapState('profile', ['mDraft'])
  },
  mounted() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.drafts,
      (newV, oldV) => {
        if (newV) {
          document.querySelector('html').style.overflowY = 'hidden';
        } else {
          document.querySelector('html').style.overflowY = 'auto';
        }
      }
    );
    // this.unwatch1 = this.$store.watch(
    //   (state, getters) => getters.dialog,
    //   (newV, oldV) => {
    //     if (newV) {
    //       document.querySelector('html').style.overflowY = 'hidden';
    //     } else {
    //       document.querySelector('html').style.overflowY = 'auto';
    //     }
    //   }
    // );
  },
  beforeDestroy() {
    this.unwatch();
    // this.unwatch1();
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/dialog.scss';
.v-auth {
  max-width: 1060px;
}
h1 {
  span {
    color: $brand;
  }
}
</style>
