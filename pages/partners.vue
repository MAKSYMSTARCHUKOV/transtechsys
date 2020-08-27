<template>
  <v-content>
    <Loading :state="loading" />
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="partners d-flex flex-column">
      <h1>наши партнёры</h1>
      <div class="our-partners">
        <a class="our-partners-item d-flex align-center justify-center">
          <img :src="$imgSrc('company-logo.jpg')" alt="" />
        </a>
      </div>
    </div>
  </v-content>
</template>

<script>
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  mixins: [indexPagesUnregister],
  head() {
    return {
      title:
        'Партнеры системы автоматизации логистических процессов TransTechSystem',
      meta: [
        {
          name: 'description',
          content:
            'Партнеры TransTechSystem - система автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
@import '~/static/scss/index/partners.scss';
</style>
