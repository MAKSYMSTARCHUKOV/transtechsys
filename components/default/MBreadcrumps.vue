<template>
  <div
    class="m-breadcrumps d-flex align-center"
    :class="{
      [mStyle]: true,
      up
    }"
  >
    <img :src="$imgSrc(`icons/home-${mStyle}.svg`)" alt="" />
    <div class="crump">
      <nuxt-link :to="{ name: 'main' }">Главная</nuxt-link>
    </div>
    <div v-for="(c, i) of middle" :key="i" class="crump">
      <img :src="$imgSrc(`icons/left-chevron-${mStyle}.svg`)" alt="" />
      <nuxt-link :to="{ name: c.name }">{{ $capitalize(c.title) }}</nuxt-link>
    </div>
    <div class="crump">
      <img :src="$imgSrc(`icons/left-chevron-${mStyle}.svg`)" alt="" />
      <span>{{ $capitalize(last) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mStyle: {
      type: String,
      default: 'brand'
    },
    middle: {
      type: Array,
      default: () => []
    },
    last: {
      type: [String, Number],
      default: undefined
    },
    up: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
@import '~/static/scss/mbreadcrumps.scss';
</style>
