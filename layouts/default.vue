<template>
  <v-app>
    <v-snackbar :value="$store.state.error" color="#fc4848" :timeout="0" bottom>
      {{ $store.state.errorMessage
      }}<img
        :src="$imgSrc('icons/close.svg')"
        alt=""
        class="mx-3 pointer"
        style="height: 20px"
        @click="$error()"
      />
    </v-snackbar>
    <app-bar></app-bar>
    <nuxt />
    <Footer></Footer>
    <mobile-app-bar></mobile-app-bar>
    <Authorization />
    <m-up></m-up>
    <!-- <screen></screen> -->
  </v-app>
</template>

<script>
import AppBar from '~/components/menu/AppBar.vue';
import MobileAppBar from '~/components/menu/MobileAppBar.vue';
import Footer from '~/components/menu/Footer.vue';
import Authorization from '~/components/Authorization.vue';
const pack = require('~/package.json');

export default {
  components: {
    AppBar,
    MobileAppBar,
    Footer,
    Authorization
  },
  data() {
    return {
      cur: 0
    };
  },
  beforeCreate() {
    const ver = this.$localstorage.get('version');
    let cur = true;
    if (ver !== undefined) {
      if (ver !== pack.version) {
        cur = false;
      }
    } else {
      cur = false;
    }
    if (!cur) {
      this.$localstorage.remove('keep-sign-in');
      this.$localstorage.remove('companyRole');
      this.$localstorage.remove('plan');
      this.$localstorage.remove('userRole');
      this.$localstorage.remove('email');
      this.$localstorage.remove('token');
      this.$localstorage.remove('refresh_token');
      this.$localstorage.remove('position');
      this.$localstorage.set('version', pack.version, true);
      this.$localstorage.set('fresh', 'true', true);
      this.$store.commit('setState', { logged: false });
      // this.loading = undefined;
    }
  },
  async mounted() {
    if (this.$localstorage.get('fresh') === 'true') {
      this.$localstorage.remove('fresh');
      location.reload(true);
    }
    this.$store.commit('setMobile', this.$vuetify.breakpoint.smAndDown);
    this.$store.commit('setTab', this.$vuetify.breakpoint.md);
    window.onresize = () => {
      this.$store.commit('setMobile', this.$vuetify.breakpoint.smAndDown);
      this.$store.commit('setTab', this.$vuetify.breakpoint.md);
    };
    document.body.onclick = (e) => {
      if (e.target.closest('._input') === null) {
        for (const s of document.querySelectorAll('.m-select')) {
          const t = s.querySelector('._input');
          const m = t.closest('.m-select');
          const l = m.querySelector('.m-select-list');
          if (e.target.closest('.m-select-list')) {
            if (s.classList.contains('multi')) {
              return false;
            }
          }
          if (t.classList.contains('activated')) {
            if (m.classList.contains('temp')) {
              if (m.classList.contains('opaq')) m.classList.add('d-opaq');
            }
            l.style.overflow = 'hidden';
            l.style.height = '0';
            t.classList.remove('activated');
            setTimeout(() => {
              l.style.visibility = 'hidden';
            }, 151);
            // this.$reject({ target: t });
          }
        }
      }
    };
    this.unwatch = this.$store.watch(
      (state, getters) => getters.mobile,
      (newV, oldV) => {
        this.$router.go();
      }
    );
    document.onscroll = (e) => {
      if (this.$store.state.mobile) {
        if (window.pageYOffset > 280) {
          this.$store.commit('profile/toggleUp', true);
        } else {
          this.$store.commit('profile/toggleUp', false);
        }
      } else if (!this.$store.state.mobile) {
        if (window.pageYOffset > 460) {
          this.$store.commit('profile/toggleUp', true);
        } else {
          this.$store.commit('profile/toggleUp', false);
        }
      }
    };
    // document.onscroll = (e) => {
    //   if (this.$store.state.mobile) {
    //     if (window.pageYOffset > this.cur) {
    //       this.cur = window.pageYOffset;
    //       if (window.pageYOffset > 60) {
    //         header.style.top = '-60px';
    //       }
    //     } else if (window.pageYOffset < this.cur) {
    //       this.cur = window.pageYOffset;
    //       header.style.top = '0px';
    //     }
    //   }
    // };
    if (this.$localstorage.get('email')) {
      try {
        const r = await this.$user.getUser(this.$localstorage.get('email'));
        const t = await this.$fetchImage(r.member.photo.value);
        this.$store.commit('setField', {
          field: 'memberPhoto',
          value: {
            value: t,
            position: r.member.photo.position
          }
        });
        this.$store.commit('setField', {
          field: 'name',
          value: r.member.name
        });
        this.$store.commit('setState', {
          logged: true,
          member_id: r.member.id.value,
          company_id: r.company.id.value
        });
      } catch (e) {
        if (e.status !== 401) {
          this.$errorHandle(e);
        } else {
          this.$store.commit('setState', { logged: false });
        }
      }
    } else {
      this.$store.commit('setState', { logged: false });
      this.$store.commit('setData', {});
    }
  },
  beforeDestroy() {
    this.unwatch();
  }
};
</script>

<style lang="scss">
@import '~/static/scss/default.scss';
.v-overlay__content {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  // padding-top: 20px;
  overflow: auto;
  @include tablet() {
    // padding-top: 40px;
  }
}
</style>
