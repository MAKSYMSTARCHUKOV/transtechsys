<template>
  <div class="footer m-section">
    <nuxt-link to="/" class="icon">
      <img class="logo" :src="$imgSrc('logo.png')" alt="logo" />
    </nuxt-link>
    <div class="links">
      <a
        v-for="l of $store.state.footerMenu"
        :key="l.name"
        :href="l.path"
        class="menu-link"
        :class="{
          soon: l.name === 'тендеры'
        }"
        >{{ l.name }}</a
      >
    </div>
    <div class="icons">
      <div class="menu-icon pointer d-flex align-center" @click="$feedback">
        <img :src="$imgSrc('icons/message.svg')" alt="" />
      </div>
      <a
        id="call"
        class="menu-icon pointer ml-4 d-flex align-center"
        :href="`tel:${$store.getters.a_phone_number}`"
      >
        <img :src="$imgSrc('icons/phone.svg')" alt="" />
      </a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.footer {
  background-color: #222c34;
  z-index: 1;
  align-items: center;
  @include py(23);
  display: grid;
  row-gap: 12px;
  column-gap: 12px;
  grid-template-columns: 1fr;
  @include screen() {
    grid-template-columns: repeat(3, auto);
  }
  .logo {
    margin-right: 0;
  }
  .menu-link {
    font-size: rem(14);
    color: white;
    text-align: center;
    font-weight: 600;
    position: relative;
    &.soon::after {
      text-transform: uppercase;
      font-size: rem(10);
      color: white;
      content: 'скоро';
      top: 0px;
      right: 3px;
      position: absolute;
      background-color: $brand;
      padding: 0 3px;
      border-radius: 3px;
      font-weight: 700;
    }
  }
  .icon,
  .links,
  .icons {
    display: flex;
    align-items: center;
    grid-column-end: span 1;
  }
  .icon {
    margin: 0;
    justify-content: center;
    @include screen() {
      justify-content: flex-start;
    }
  }
  .links {
    flex-direction: column;
    justify-content: space-between;
    @include tablet() {
      flex-direction: row;
    }
  }
  .icons {
    justify-content: center;
    @include screen() {
      justify-content: flex-end;
      grid-column-end: span 1;
    }
  }
}
</style>
