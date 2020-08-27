<template>
  <div
    class="m-up d-flex align-center justify-center pointer"
    :class="{ visible: $store.state.profile.showUp }"
    @click="up"
  >
    <img :src="$imgSrc('icons/up.svg')" alt="" />
  </div>
</template>

<script>
export default {
  methods: {
    up(e) {
      document.querySelector('html').scrollTo({ behavior: 'smooth', top: '0' });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.m-up {
  z-index: 999;
  position: fixed;
  bottom: 15px;
  right: 15px;
  background-color: $brand;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 2px 2px 15px rgba(#000000, 0.1);
  opacity: 0;
  visibility: hidden;
  @include flow(0.2);
  &.visible {
    opacity: 1;
    visibility: visible;
    @include flow(0.2);
  }
  img {
    width: 15px;
  }
}
</style>
