<template>
  <v-app class="m-main">
    <v-snackbar
      :value="$store.state.error"
      color="#fc4848"
      :timeout="60000"
      bottom
    >
      {{ $store.state.errorMessage
      }}<img
        :src="$imgSrc('icons/close.svg')"
        alt=""
        class="mx-3 pointer"
        style="height: 20px"
        @click="$error()"
      />
    </v-snackbar>
    <v-snackbar
      id="success"
      :value="changes"
      color="#2DAD51"
      :bottom="true"
      :top="true"
      :timeout="1500"
    >
      {{ $isEmpty($store.state.message) ? 'Сохранено!' : $store.state.message }}
    </v-snackbar>
    <Menu></Menu>
    <nuxt></nuxt>
    <Aside></Aside>
    <Footer></Footer>
    <m-up></m-up>
    <screen></screen>
    <Authorization max-width="1300px" />
  </v-app>
</template>

<script>
import Menu from '~/components/role/Menu.vue';
import Aside from '~/components/role/Aside.vue';
import Footer from '~/components/menu/Footer.vue';
import Authorization from '~/components/Authorization.vue';
export default {
  components: {
    Menu,
    Aside,
    Footer,
    Authorization
  },
  data() {
    return {
      cur: 0
    };
  },
  computed: {
    changes: {
      get() {
        return this.$store.state.changes;
      },
      set(v) {
        this.$store.commit('setState', { changes: v });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const header = document.querySelector('.m-header');
      this.$store.commit('setMobile', this.$vuetify.breakpoint.smAndDown);
      this.$store.commit('setTab', this.$vuetify.breakpoint.md);
      if (!this.$store.state.tab && !this.$store.state.mobile) {
        this.$store.commit('setFullScreen', true);
      } else {
        this.$store.commit('setFullScreen', false);
      }
      this.$store.commit('setShowMobile', false);
      window.onresize = () => {
        this.$store.commit('setMobile', this.$vuetify.breakpoint.smAndDown);
        this.$store.commit('setTab', this.$vuetify.breakpoint.md);
        if (!this.$store.state.tab && !this.$store.state.mobile) {
          this.$store.commit('setFullScreen', true);
        } else {
          this.$store.commit('setFullScreen', false);
        }
      };
      document.body.addEventListener(
        'click',
        (e) => {
          if (
            e.target.closest('._input') === null &&
            e.target.closest('#screen-page') === null
          ) {
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
          if (
            e.target.closest('.make-proposition') === null &&
            e.target.closest('.m-container') === null
          ) {
            for (const y of document.querySelectorAll('.make-proposition')) {
              y.querySelector('[type="text"]').value = '';
              y.querySelector('.ok').style.width = '0';
              this.$nextTick(() => {
                y.classList.add('d-opaq');
              });
            }
          }
          if (
            e.target.closest('.cancel-proposition') === null &&
            e.target.closest('.m-container') === null
          ) {
            for (const y of document.querySelectorAll('.cancel-proposition')) {
              y.querySelector('[type="radio"]').checked = false;
              this.$nextTick(() => {
                y.classList.add('d-opaq');
              });
              y.querySelector('.ok').style.width = '0';
            }
          }
        },
        false
      );
      document.onscroll = (e) => {
        if (this.$store.state.mobile) {
          if (window.pageYOffset > 280) {
            this.$store.commit('profile/toggleUp', true);
          } else {
            this.$store.commit('profile/toggleUp', false);
          }
          for (const i of document.querySelectorAll('.spawn')) {
            i.classList.remove('spawn');
          }
          if (window.pageYOffset > this.cur) {
            this.cur = window.pageYOffset;
            if (window.pageYOffset > 60) {
              header.style.top = '-60px';
            }
          } else if (window.pageYOffset < this.cur) {
            this.cur = window.pageYOffset;
            header.style.top = '0px';
          }
        } else if (!this.$store.state.mobile) {
          if (window.pageYOffset > 460) {
            this.$store.commit('profile/toggleUp', true);
          } else {
            this.$store.commit('profile/toggleUp', false);
          }
        }
      };
      this.unwatch = this.$store.watch(
        (state, getters) => getters.mobile,
        (newV, oldV) => {
          this.$router.go();
        }
      );
      // this.unwatch1 = this.$store.watch(
      //   (state, getters) => getters.error,
      //   (newV, oldV) => {
      //     this.$router.go();
      //   }
      // );
    });
  },

  beforeDestroy() {
    try {
      this.unwatch();
    } catch {}
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role.scss';
.v-content {
  padding-top: 60px !important;
  @include tablet() {
    padding-top: 80px !important;
  }
}
</style>
