<template>
  <v-navigation-drawer
    v-model="showMobile"
    :right="false"
    :hide-overlay="true"
    fixed
    class="mobile__nav d-lg-none"
    app
  >
    <div
      v-if="logged === true"
      :key="logged"
      class="cabinet align-center d-flex flex-column"
      @click="togglePanel"
    >
      <div class="d-flex align-center w-100 justify-center">
        <div
          id="avatar"
          :style="{
            backgroundImage: loginPhoto,
            backgroundSize: loginSize,
            backgroundPosition: loginPosition
          }"
        ></div>
        <span id="name">{{ data.name ? data.name.default : '' }}</span>
      </div>
      <div class="panel d-flex justify-center pointer align-center flex-column">
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
    <v-list>
      <v-list-item v-for="l of topMenu" :key="l.name" class="justify-center">
        <a class="top-menu mobile" :href="l.path">
          {{ l.name }}
        </a>
      </v-list-item>
    </v-list>
    <div v-if="logged === false" class="buttons d-flex w-100 flex-column">
      <m-button class="mb-7" @click.native="signin">вход</m-button>
      <m-button m-style="white" @click.native="register">регистрация</m-button>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['topMenu', 'data', 'logged']),
    showMobile: {
      get() {
        return this.$store.state.showMobile;
      },
      set(flag) {
        this.$store.commit('setShowMobile', flag);
      }
    },
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
    togglePanel() {
      this.$el.querySelector('.panel').classList.toggle('act');
    },
    signin() {
      this.$store.commit('setOverlayMode', 'signin');
      this.$store.commit('setOverlayVisible', true);
    },
    register() {
      this.$store.commit('setOverlayMode', 'register');
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

.mobile__nav {
  width: 100vw !important;
  padding-top: 56px;
  z-index: 12 !important;
}
</style>
