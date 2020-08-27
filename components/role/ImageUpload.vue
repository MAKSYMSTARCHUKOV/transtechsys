<template>
  <div class="m-image-upload d-flex flex-column">
    <div
      class="d-flex align-center mb-2"
      :class="{ 'justify-center': type === 'avatar' }"
    >
      <h3><slot></slot></h3>
      <img
        :src="$imgSrc('icons/download.svg')"
        alt=""
        class="ml-3  pointer"
        @click="$refs[reference].click()"
      />
    </div>
    <div
      class="img pointer"
      :style="{
        backgroundImage: background,
        backgroundPosition: position
          ? `${position[0]}px ${position[1]}px`
          : 'center',
        backgroundSize: size
      }"
      @click="$refs[reference].click()"
    ></div>
    <input
      :ref="reference"
      type="file"
      hidden
      accept=".png,.jpg,.jpeg,.gif,.bmp"
      v-on="$listeners"
    />
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'logo'
    },
    image: {
      type: String,
      default: ''
    },
    position: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      reference: Math.floor(Math.random() * (10000 - 1) + 1)
    };
  },
  computed: {
    background() {
      let i = this.image;
      if (!this.image) {
        if (this.type === 'logo') {
          i = '/images/company-logo.png';
        } else if (this.type === 'background') {
          i = `/images/${this.roler}-${this.type}.png`;
        } else if (this.type === 'avatar') {
          i = '/images/void-img.png';
        }
      }
      return `url(${i})`;
    },
    roler() {
      switch (this.$localstorage.get('companyRole')) {
        case 'ROLE_COMPANY_SENDER':
          return 'sender';
        case 'ROLE_COMPANY_CARRIER':
          return 'carrier';
        case 'ROLE_COMPANY_EXPEDITOR':
          return 'expeditor';
      }
      return false;
    },
    size() {
      if (this.type === 'avatar') {
        if (this.position[2] !== 0) {
          return this.position[3] === 0
            ? `auto calc(100% + ${this.position[2]}px)`
            : `calc(100% + ${this.position[2]}px)`;
        }
      }
      return 'cover';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
h3 {
  font-weight: normal;
  font-size: rem(18);
  color: $brand;
  text-transform: uppercase;
  & ~ img {
    height: 16px;
  }
}
.img {
  height: 300px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  @include tablet() {
    height: 350px;
  }
  @include screen() {
    height: 390px;
  }
}
#avatar {
  .img {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    align-self: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    @include tablet() {
      height: 124px;
      width: 124px;
    }
  }
}
</style>
