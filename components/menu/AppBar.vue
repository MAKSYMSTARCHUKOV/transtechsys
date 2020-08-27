<template>
  <v-app-bar :height="mobile ? 56 : 80" flat absolute :class="$route.name">
    <template v-if="mobile">
      <transition name="menu" mode="out-in">
        <div
          v-if="!showMobile"
          :key="showMobile"
          class="menu-icon pointer"
          @click="toggleMobile"
        >
          <img :src="$imgSrc('icons/burger.svg')" alt="" />
        </div>
        <div
          v-if="showMobile"
          :key="showMobile"
          class="menu-icon pointer"
          @click="toggleMobile"
        >
          <img :src="$imgSrc('icons/close.svg')" alt="" />
        </div>
      </transition>
    </template>
    <a href="/" class="ml-auto ml-lg-0 d-flex align-center">
      <img class="logo" :src="$imgSrc('logo.png')" alt="logo" />
    </a>
    <template v-if="!mobile">
      <a v-for="l of topMenu" :key="l.name" class="top-menu" :href="l.path">
        {{ l.name }}
      </a>
    </template>
    <v-spacer class="d-none d-md-block"></v-spacer>
    <div class="right-section d-flex align-center">
      <button
        v-if="logged === false"
        id="login"
        class="menu-link d-none d-md-block"
        @click="showModal('signin')"
      >
        Вход
      </button>
      &nbsp;<span v-if="logged === false" id="pipe" class="d-none d-md-block"
        >|</span
      >&nbsp;<button
        v-if="logged === false"
        id="register"
        class="menu-link d-none d-md-block"
        @click="showModal('register')"
      >
        Регистрация
      </button>
      <div
        v-else-if="logged === true"
        :key="logged"
        class="cabinet align-center d-none d-md-flex pointer"
      >
        <div
          id="avatar"
          :style="{
            backgroundImage: loginPhoto,
            backgroundSize: loginSize,
            backgroundPosition: loginPosition
          }"
        ></div>
        <span id="name">{{ data.name ? data.name.default : '' }}</span>
        <div
          class="panel d-flex justify-center pointer align-center flex-column"
        >
          <nuxt-link class="panel-menu" :to="{ name: 'cabinet-profile' }">
            <img :src="$imgSrc('icons/network.svg')" alt="" />
            <span>Личный кабинет</span>
          </nuxt-link>
          <div class="panel-menu" @click="unplug">
            <img :src="$imgSrc('icons/logout.svg')" alt="" />
            <span>Выйти из системы</span>
          </div>
        </div>
      </div>
      <div
        class="menu-icon pointer d-flex align-center ml-4"
        @click="$feedback"
      >
        <img :src="$imgSrc('icons/message.svg')" alt="" />
      </div>
      <a
        :href="`tel:${$store.getters.a_phone_number}`"
        class="menu-icon pointer ml-4 d-flex align-center"
      >
        <img :src="$imgSrc('icons/phone.svg')" alt="" />
      </a>
    </div>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  // data() {
  //   return {
  //     loginPhoto: `url(${this.$imgSrc('void-img.png')})`,
  //     loginPosition: 'center',
  //     loginSize:'cover'
  //   }
  // },
  computed: {
    ...mapState(['data', 'mobile', 'tab', 'showMobile', 'topMenu', 'logged']),
    photo() {
      return this.data.memberPhoto;
    },
    loginPhoto() {
      if (this.photo) {
        return `url(${
          this.$isEmpty(this.photo.value)
            ? this.$imgSrc('void-img.png')
            : this.photo.value
        })`;
      }
      return `url(${this.$imgSrc('void-img.png')})`;
    },
    loginPosition() {
      if (this.photo) {
        const p = this.photo.position;
        if (p[0] === 0 && p[1] === 0) {
          return 'center';
        }
        const sF = 30 / 124;
        return `${p[0] * sF}px ${p[1] * sF}px`;
      }
      return 'center';
    },
    loginSize() {
      if (this.photo) {
        const p = this.photo.position;
        if (p[2] === 0) {
          return 'cover';
        }
        const sF = 30 / 124;
        return p[3] === 0
          ? `auto calc(100% + ${p[2] * sF}px)`
          : `calc(100% + ${p[2] * sF}px)`;
      }
      return 'cover';
    }
  },
  methods: {
    toggleMobile() {
      const h = document.querySelector('html');
      const b = document.body;
      this.$store.commit('toggleMobile');
      this.$nextTick(() => {
        if (this.$store.state.showMobile) {
          h.style.overflow = 'hidden';
          b.style.overflow = 'hidden';
        } else {
          h.removeAttribute('style');
          b.removeAttribute('style');
        }
      });
    },
    showModal(mode) {
      this.$store.commit('setOverlayMode', mode);
      this.$store.commit('setOverlayVisible', true);
    },
    unplug() {
      this.$store.commit('setState', { logged: false });
      this.$store.commit('setData', {});
      this.$localstorage.remove('keep-sign-in');
      this.$localstorage.remove('token');
      this.$localstorage.remove('refresh_token');
      this.$localstorage.remove('email');
      this.$localstorage.remove('userRole');
      this.$localstorage.remove('companyRole');
      this.$localstorage.remove('plan');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default-layout.scss';
</style>

<style lang="scss">
@import '~/static/scss/default.scss';
.v-app-bar {
  z-index: 13 !important;
}
.v-toolbar__content {
  padding: 0 50px !important;
  justify-content: space-between;
  @include tablet() {
    padding: 0 130px !important;
    justify-content: flex-start;
  }
}
.v-toolbar {
  background-color: transparent !important;
}
</style>
