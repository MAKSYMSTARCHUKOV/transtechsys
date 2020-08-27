<template>
  <header class="m-header d-flex align-center">
    <transition name="menu" mode="out-in">
      <div
        v-if="!showMobile && !fullScreen"
        :key="showMobile"
        class="menu-icon pointer d-flex align-center"
        @click="toggleMobile"
      >
        <img :src="$imgSrc('icons/burger.svg')" alt="" />
      </div>
      <div
        v-if="showMobile && !fullScreen"
        :key="showMobile"
        class="menu-icon pointer d-flex align-center"
        @click="toggleMobile"
      >
        <img :src="$imgSrc('icons/close.svg')" alt="" />
      </div>
    </transition>
    <a href="/" class="logo"
      ><img class="logo" :src="$imgSrc('logo.png')" alt=""
    /></a>
    <div
      id="whole_menu"
      class="align-center ml-auto"
      :class="{ shrink: isSearch }"
    >
      <b>
        <a class="menu-link" href="/">главная</a>
      </b>
      <template v-for="l of firstMenu">
        <a
          :key="`${l.name}-${l.path}`"
          :data-id="l.name"
          class="menu-link first_menu"
          :href="l.path"
          :class="{ soon: l.name.includes('уведом') }"
          >{{ l.name }}</a
        >
      </template>
      <a
        v-for="l of menu"
        :key="`${l.name}-${l.path}`"
        class="menu-link soon"
        :href="l.path"
        >{{ l.name }}</a
      >
    </div>
    <div class="d-flex align-center">
      <template v-if="isMain">
        <nuxt-link to="/" class="d-flex align-center" @click="$feedback">
          <img :src="$imgSrc('icons/message.svg')" alt="" class="menu-icon" />
        </nuxt-link>
        <nuxt-link class="ml-4 d-flex align-center" to="/">
          <img :src="$imgSrc('icons/phone.svg')" alt="" class="menu-icon" />
        </nuxt-link>
      </template>
      <nuxt-link v-else id="chat" to="/" class="align-center">
        <img :src="$imgSrc('icons/chat.svg')" alt="" class="menu-icon" />
      </nuxt-link>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      firstMenu: 'roleTopMenuFirst',
      menu: 'roleTopMenu',
      showMobile: 'showMobile',
      fullScreen: 'fullScreen'
    }),
    isMain() {
      return this.$route.name === 'main';
    },
    isSearch() {
      return this.$route.name.includes('find-');
    }
  },
  methods: {
    toggleMobile() {
      const h = document.querySelector('html');
      const b = document.body;
      this.$store.commit('toggleMobile');
      if (this.showMobile) {
        h.style.overflow = 'hidden';
        b.style.overflow = 'hidden';
      } else {
        h.removeAttribute('style');
        b.removeAttribute('style');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/menu.scss';
</style>
