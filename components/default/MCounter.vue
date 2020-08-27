<template>
  <div class="m-counter d-flex justify-end">
    <span class="d-flex align-center">
      <span>{{ current }}</span
      >&nbsp;/&nbsp;
      <span>{{ total }}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.m-counter {
  margin-top: 7px;
  grid-column: 1 / -1;
  span {
    font-size: rem(14);
    color: $input;
  }
}
</style>
