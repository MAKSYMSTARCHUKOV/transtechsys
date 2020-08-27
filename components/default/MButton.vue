<template>
  <div class="m-button" :data-disabled="disabled">
    <div class="b pointer d-flex justify-center align-center" :style="bckg">
      <slot></slot><img :src="$imgSrc('icons/loading.gif')" alt="" />
    </div>
    <div class="contur" :style="contur"></div>
  </div>
</template>

<script>
export default {
  props: {
    'm-style': {
      type: String,
      default: ''
    },
    shade: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bckg() {
      let s = {
        backgroundColor: '#2D5EBB',
        color: 'white'
      };
      if (this.mStyle === 'white') {
        ({ ...s } = { backgroundColor: '#FFFFFF', color: 'black' });
      } else if (this.mStyle === 'error') {
        ({ ...s } = {
          backgroundColor: '#fc4848',
          color: 'white',
          borderColor: '#fc4848'
        });
      }
      if (this.shade === 'blue') {
        s.borderColor = '#2D5EBB';
      }
      if (this.disabled) {
        s.backgroundColor = '#4E5357';
        s.borderColor = '#4E5357';
      }
      return s;
    },
    contur() {
      if (this.shade === 'blue') {
        return { borderColor: '#2D5EBB' };
      } else if (this.shade === 'error') {
        return { borderColor: '#fc4848' };
      }
      if (this.disabled) {
        return { borderColor: '#4E5357' };
      }
      return {
        borderColor: '#FFFFFF'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_mix.scss';
.m-button {
  position: relative;
  height: calc(47px + 8px);
  width: calc(100%);
  z-index: 9;
  &.loading {
    .b {
      img {
        display: block;
      }
    }
  }
  .b {
    user-select: none;
    position: absolute;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    top: 0;
    left: 0;
    border: 2px solid #ffffff;
    text-transform: uppercase;
    z-index: 11;
    @include flow(0.1);
    @include button;
    img {
      height: 20px;
      margin-left: 8px;
      display: none;
    }
  }
  .contur {
    @include flow(0.1);
    border: 1px solid white;
    position: absolute;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    // top: 8px;
    // left: 8px;
    bottom: 0;
    right: 0;
    z-index: 10;
  }
  &:hover:not([data-disabled='disabled']) {
    .b {
      top: 4px;
      left: 0px;
      width: 100%;
      @include flow(0.1);
    }
    .contur {
      bottom: 4px;
      right: 4px;
      @include flow(0.1);
    }
  }
}
</style>
