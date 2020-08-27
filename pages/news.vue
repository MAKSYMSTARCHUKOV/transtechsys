<template>
  <v-content>
    <Loading :state="loading" />
    <section class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </section>
    <nuxt-child></nuxt-child>
  </v-content>
</template>

<script>
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  mixins: [indexPagesUnregister],
  beforeRouteEnter(to, from, next) {
    if (to.query.reload) {
      next((vm) => {
        const q = {};
        for (const qq in to.query) {
          if (qq !== 'reload') {
            q[qq] = to.query[qq];
          }
        }
        vm.$router.replace({ query: q }, () => {
          vm.$router.go();
        });
      });
    } else {
      next((vm) => {});
    }
  },
  head() {
    return {
      title: '| Новости'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
</style>
