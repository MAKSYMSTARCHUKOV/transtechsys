<template>
  <v-overlay z-index="1000" opacity="0.8" :value="show">
    <div
      id="m-overlay"
      :class="{ 'm-logo': logo }"
      @mousedown="start($event)"
      @mouseup="stop($event)"
      @mousemove.stop="drag($event)"
    >
      <div id="m-image-holder">
        <img id="m-image" :src="image" alt="" @load="justify" />
      </div>
      <div id="m-header"><slot></slot></div>
      <div id="top" class="m-border m-border-top"></div>
      <div id="right" class="m-border m-border-right"></div>
      <div id="bottom" class="m-border m-border-bottom"></div>
      <div id="left" class="m-border m-border-left"></div>
      <div id="m-logo"></div>
    </div>
    <slot name="button"></slot>
    <div id="m-cancel" class="pointer"><slot name="cancel"></slot></div>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex';
export default {
  model: {
    prop: 'offset',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    logo: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: undefined
    },
    box: {
      type: Array,
      default: () => {
        return [1, 1];
      }
    },
    offset: {
      type: Array,
      default: () => {
        return [0, 0, 0, 1];
      }
    }
  },
  data() {
    return {
      dragFlag: false,
      scaleFactor: 1,
      scale: 0,
      zoomTimes: 0,
      prime: undefined
    };
  },
  computed: {
    ...mapState(['mobile'])
  },
  methods: {
    start(e) {
      e.preventDefault();
      this.dragFlag = true;
      document.querySelector('#m-overlay').style.cursor = 'grabbing';
    },
    stop(e) {
      const o = e.target.closest('#m-overlay');
      const t = document.querySelector('#m-image-holder');
      this.dragFlag = false;
      if (t.offsetLeft > 0) {
        t.style.left = '0';
        this.offset[0] = 0;
      }
      if (t.offsetTop > 0) {
        t.style.top = '0';
        this.offset[1] = 0;
      }
      if (this.logo) {
        if (this.prime === 0) {
          if (t.offsetTop <= o.offsetHeight - t.offsetHeight) {
            t.style.top = o.offsetHeight - t.offsetHeight + 'px';
            this.offset[1] = t.offsetTop - this.scale;
          }
          if (t.offsetLeft < o.offsetWidth - t.offsetWidth - 6) {
            t.style.left = o.offsetWidth - t.offsetWidth - 6 + 'px';
            this.offset[0] = t.offsetLeft - this.scale;
          }
        } else if (this.prime === 1) {
          if (t.offsetTop <= o.offsetHeight - t.offsetHeight + 6) {
            t.style.top = o.offsetHeight - t.offsetHeight + 6 + 'px';
            this.offset[1] = t.offsetTop - this.scale;
          }
          if (t.offsetLeft < o.offsetWidth - t.offsetWidth) {
            t.style.left = o.offsetWidth - t.offsetWidth + 'px';
            this.offset[0] = t.offsetLeft - this.scale;
          }
        }
      } else if (!this.logo) {
        if (t.offsetTop < o.offsetHeight - t.offsetHeight - 6) {
          t.style.top = o.offsetHeight - t.offsetHeight - 6 + 'px';
          this.offset[1] = t.offsetTop;
        }
        if (t.offsetLeft < o.offsetWidth - t.offsetWidth) {
          t.style.left = o.offsetWidth - t.offsetWidth + 'px';
          this.offset[0] = t.offsetLeft - this.scale;
        }
      }
      this.$emit('change', [
        this.offset[0],
        this.offset[1],
        this.scale,
        this.prime,
        this.scaleFactor
      ]);
      o.style.cursor = 'grab';
    },
    drag(e) {
      const t = document.querySelector('#m-image-holder');
      if (this.dragFlag) {
        const p = t.offsetLeft + e.movementX;
        const pt = t.offsetTop + e.movementY;
        t.style.left = p + 'px';
        t.style.top = pt + 'px';
        this.offset[0] = p;
        this.offset[1] = pt;
      }
    },
    justify() {
      this.scale = 0;
      const overlay = document.querySelector('#m-overlay');
      const bottom = overlay.querySelector('#bottom');
      const right = overlay.querySelector('#right');
      const left = overlay.querySelector('#left');
      let top = overlay.querySelector('#top');
      const holder = overlay.querySelector('#m-image-holder');
      const image = holder.querySelector('#m-image');
      let bW = this.mobile
        ? overlay.offsetWidth - 200
        : overlay.offsetWidth - 520;
      if (this.logo) {
        top = overlay.querySelector('#m-logo');
        bW = top.offsetWidth;
        top.style.left = (overlay.offsetWidth - top.offsetWidth) / 2 + 'px';
      }
      const bH = Math.floor((this.box[1] * bW) / this.box[0]);
      this.scaleFactor = this.box[0] / bW;
      bottom.style.top = `${bH + top.offsetTop - 3}px`;
      left.style.height = `${bH}px`;
      right.style.height = `${bH}px`;
      right.style.left = this.mobile
        ? `calc(100px + ${bW} - 3px)`
        : `calc(260px + ${bW} - 3px)`;
      if (this.logo) {
        if (image.offsetHeight > image.offsetWidth) {
          image.style.width = top.offsetWidth - 6 + 'px';
          image.style.height = 'auto';
        } else {
          this.scaleFactor = this.box[0] / bH;
          image.style.height = top.offsetHeight - 6 + 'px';
          image.style.width = 'auto';
        }
        image.style.left = top.offsetLeft + 3 + 'px';
      }
      const iH = image.offsetHeight;
      const iW = image.offsetWidth;
      this.prime = iH > iW ? 1 : 0;
      image.style.top = top.offsetTop + 3 + 'px';
      if (this.logo) {
        if (iH > bH) {
          holder.style.height =
            overlay.offsetHeight + image.offsetHeight - bH + 'px';
          holder.style.top =
            (overlay.offsetHeight - holder.offsetHeight) / 2 + 'px';
          holder.style.width = '100vw';
        } else if (iW > bW) {
          holder.style.width =
            overlay.offsetWidth + image.offsetWidth - bW + 'px';
          holder.style.left =
            (overlay.offsetWidth - holder.offsetWidth) / 2 + 'px';
          holder.style.height = '100vh';
          holder.style.top = '0px';
        }
      } else if (!this.logo) {
        if (bH > iH) {
          image.style.height = bH - 6 + 'px';
          image.style.width = 'auto';
          holder.style.height =
            overlay.offsetHeight + image.offsetHeight - bW + 'px';
          if (bW > iW) {
            image.style.width = bW + 'px';
            image.style.height = 'auto';
            holder.style.height = '100vh';
            holder.style.width =
              overlay.offsetWidth + image.offsetWidth - bW + 'px';
            holder.style.left =
              (overlay.offsetWidth - holder.offsetWidth) / 2 + 'px';
          }
        } else {
          holder.style.height =
            overlay.offsetHeight + image.offsetHeight - bH + 'px';
          holder.style.top =
            Math.floor((overlay.offsetHeight - holder.offsetHeight) / 2) + 'px';
        }
      }
      this.offset[0] = holder.offsetLeft;
      this.offset[1] = holder.offsetTop;
      this.$emit('change', [
        this.offset[0],
        this.offset[1],
        this.scale,
        this.prime,
        this.scaleFactor
      ]);
      overlay.addEventListener('wheel', (e) => {
        const zoom = e.deltaY < 0;
        const iH = image.offsetHeight;
        let hT = 0;
        if (!zoom) {
          if (this.scale > 0) {
            this.zoomTimes--;
            image.style.width = image.offsetWidth - 32 + 'px';
            image.style.height = 'auto';
            hT = Math.abs(iH - image.offsetHeight);

            holder.style.width = holder.offsetWidth - 32 + 'px';
            holder.style.height = holder.offsetHeight - hT + 'px';
            holder.style.left = holder.offsetLeft + 16 + 'px';
            holder.style.top = holder.offsetTop + Math.floor(hT / 2) + 'px';
            if (this.prime === 0) {
              this.scale -= hT;
              this.offset[0] += 16;
              this.offset[1] += 8;
            } else {
              this.scale -= 32;
              this.offset[0] += 16;
              this.offset[1] += 24;
            }
            this.$emit('change', [
              this.offset[0],
              this.offset[1],
              this.scale,
              this.prime,
              this.scaleFactor
            ]);
          }
        } else {
          this.zoomTimes++;
          image.style.width = image.offsetWidth + 32 + 'px';
          image.style.height = 'auto';
          hT = Math.abs(iH - image.offsetHeight);
          holder.style.width = holder.offsetWidth + 32 + 'px';
          holder.style.height = holder.offsetHeight + hT + 'px';
          holder.style.left = holder.offsetLeft - 16 + 'px';
          holder.style.top = holder.offsetTop - Math.floor(hT / 2) + 'px';
          if (this.prime === 0) {
            this.scale += hT;
            this.offset[0] -= 16;
            this.offset[1] -= 8;
          } else {
            this.scale += 32;
            this.offset[0] -= 16;
            this.offset[1] -= 24;
          }
          this.$emit('change', [
            this.offset[0],
            this.offset[1],
            this.scale,
            this.prime,
            this.scaleFactor
          ]);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
#m-overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  top: 0;
  @include flow(0.2);
  cursor: grab;
  #m-header {
    position: absolute;
    width: 100vw;
    top: 50px;
    z-index: 2;
    font-weight: 800;
    color: white;
    text-align: center;
    font-size: rem(18);
    text-transform: uppercase;
    @include tablet() {
      font-size: rem(20);
    }
    @include screen() {
      font-size: rem(25);
    }
  }
  .m-border {
    display: block;
    z-index: 2;
    position: absolute;
    top: 0;
    top: 30%;
    background-color: $green;
    &-top,
    &-bottom {
      height: 3px;
      width: calc(100vw - 200px);
      left: 100px;
      @include tablet() {
        width: calc(100vw - 520px);
        left: 260px;
      }
    }
    &-left,
    &-right {
      width: 3px;
      left: 100px;
      @include tablet() {
        left: 260px;
      }
    }
    &-right {
      left: calc(100vw - 100px);
      @include tablet() {
        left: calc(100vw - 260px);
      }
    }
  }
  #m-image-holder {
    z-index: 1;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    #m-image {
      position: absolute;
      width: calc(100% - 200px - 3px);
      left: 103px;
      @include tablet() {
        width: calc(100% - 520px - 3px);
        left: 263px;
      }
    }
  }
  #m-logo {
    display: none;
  }
  &.m-logo {
    .m-border {
      display: none;
    }
    #m-logo {
      z-index: 2;
      display: block;
      position: absolute;
      top: 20%;
      width: 200px;
      height: 200px;
      border: 3px solid $green;
      border-radius: 50%;
      @include tablet() {
        width: 400px;
        height: 400px;
      }
    }
  }
}
#m-cancel {
  z-index: 2;
  position: absolute;
  top: 30px;
  right: 30px;
}
.v-overlay__content {
  overflow: hidden !important;
}
</style>

<style lang="scss">
.m-button {
  position: absolute !important;
  width: 150px !important;
  bottom: 50px !important;
}
</style>
