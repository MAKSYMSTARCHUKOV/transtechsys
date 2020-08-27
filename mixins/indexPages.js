import { mapState } from 'vuex';
import Loading from '~/components/Loading.vue';

export default {
  loading: false,
  components: {
    Loading
  },
  data() {
    return {
      loading: true,
      offset: [0, 0],
      tab0: null,
      tab1: null,
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium enim dolores at, totam natus blanditiis provident laborum earum aliquam atque delectus nisi corporis, maiores facere reiciendis minima vel hic? Neque.`,
      profitOptions: {
        slidesPerView: 3,
        slidesPerColumn: 1,
        spaceBetween: 10,
        speed: 500,
        autoplay: {
          delay: 2000
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets'
        },
        breakpoints: {
          540: {
            slidesPerView: 1,
            spaceBetween: 0,
            slidesPerColumn: 1
          },
          960: {
            slidesPerView: 2,
            slidesPerColumnFill: 'row',
            slidesPerColumn: 2,
            spaceBetween: 30
          }
        }
      },
      cabinetOptions: {
        slidesPerView: 1,
        slidesPerColumn: 1,
        spaceBetween: 10,
        direction: 'vertical',
        speed: 300,
        autoplay: {
          delay: 1500
        },
        pagination: {
          el: '.swiper-pagination-cabinet',
          type: 'bullets'
        },
        breakpoints: {
          540: {
            direction: 'horizontal'
          }
        }
      }
    };
  },
  computed: {
    ...mapState(['logged', 'mobile'])
  },
  methods: {
    register() {
      this.$store.commit('setOverlayMode', 'register');
      this.$store.commit('setOverlayVisible', true);
    }
  },
  beforeCreate() {
    // const ver = this.$localstorage.get('version');
    // let cur = true;
    // if (ver !== undefined) {
    //   if (ver !== pack.version) {
    //     cur = false;
    //   }
    // } else {
    //   cur = false;
    // }
    // if (!cur) {
    //   this.$localstorage.remove('keep-sign-in');
    //   this.$localstorage.remove('companyRole');
    //   this.$localstorage.remove('userRole');
    //   this.$localstorage.remove('email');
    //   this.$localstorage.remove('token');
    //   this.$localstorage.remove('refresh_token');
    //   this.$localstorage.remove('position');
    //   this.$localstorage.set('version', pack.version, true);
    //   this.$store.commit('setState', { logged: false });
    // // this.loading = undefined;
    // }
  },
  created() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.logged,
      (newV, oldV) => {
        this.loading = undefined;
      }
    );
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.$route.query.reload) {
        if (this.logged !== undefined) {
          this.loading = undefined;
        }
        this.$nuxt.$loading.finish();
        if (this.$route.query.status || this.$route.query.signUpConfirm) {
          this.$store.commit('setData', {});
          this.$store.commit('setState', { logged: false });
          this.$store.commit('setOverlayMode', 'signin');
          this.$store.commit('setOverlayVisible', true);
        } else if (this.$route.query.passwordResetToken) {
          this.$store.commit('setData', {});
          this.$store.commit('setState', { logged: false });
          this.$store.commit('setOverlayMode', 'reset');
          this.$store.commit('setOverlayVisible', true);
        } else if (this.$route.query.inviteKey) {
          this.$store.commit('setData', {});
          this.$store.commit('setState', { logged: false });
          this.$store.commit('setOverlayMode', 'user-register');
          this.$store.commit('setOverlayVisible', true);
        } else if (this.$route.query.register) {
          this.$store.commit('setData', {});
          this.$store.commit('setState', { logged: false });
          this.$store.commit('setOverlayMode', 'register');
          this.$store.commit('setOverlayVisible', true);
        } else {
          this.$router.push({ query: {} });
        }
      }
    });
  },
  beforeDestroy() {
    try {
      this.unwatch();
    } catch (e) {}
  }
};
