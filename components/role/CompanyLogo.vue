<template>
  <div class="company-logo flex-column align-center">
    <div
      class="img-holder"
      :style="{
        backgroundImage: `url(${image})`,
        backgroundPosition: position
          ? `${position[0]}px ${position[1]}px`
          : 'center',
        backgroundSize: position
          ? position[2] === 0
            ? 'cover'
            : position[3] === 0
            ? `auto calc(100% + ${position[2]}px)`
            : `calc(100% + ${position[2]}px)`
          : 'cover'
      }"
    ></div>
    <div class="rating d-flex justify-space-between">
      <div
        v-for="i in 5"
        :key="i"
        class="star"
        :class="{
          active: i <= rate
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: ''
    },
    position: {
      type: Array,
      default: undefined
    },
    rate: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
.company-logo {
  display: flex;
  padding-top: 14px;
  .img-holder {
    width: 174px;
    height: 174px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 15px rgba(#000000, 0.25);
    margin-bottom: 0;
    order: 2;
    @include tablet() {
      order: 1;
      margin-bottom: 25px;
    }
  }
  .rating {
    width: 120px;
    margin-bottom: 20px;
    order: 1;
    @include tablet() {
      margin-bottom: 0;
      order: 2;
    }
  }
  .star {
    background-image: url(/images/icons/rate.svg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 20px;
    height: 20px;
    &.active {
      background-image: url(/images/icons/rate-active.svg);
    }
  }
}
</style>
