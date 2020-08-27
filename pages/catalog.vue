<template>
  <v-content>
    <Loading :state="loading"> </Loading>
    <div class="head tiny" :class="{ [$route.name]: $route.name }">
      <img
        v-if="!mobile && $route.name !== 'catalog-id'"
        id="back"
        :src="$imgSrc(`back-tiny.png`)"
        alt=""
      />
      <div v-if="$route.name !== 'catalog-id'" id="left"></div>
    </div>
    <nuxt-child></nuxt-child>
  </v-content>
</template>

<script>
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  mixins: [indexPagesUnregister]
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
</style>
