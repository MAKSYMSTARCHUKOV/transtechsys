const pack = require('~/package.json');
export default {
  loading: false,
  data() {
    return {
      auctionSocket: undefined
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const ver = vm.$localstorage.get('version');
      const pVer = pack.version;
      let cur = true;
      if (ver !== undefined) {
        if (ver !== pVer) {
          cur = false;
        }
      } else {
        cur = false;
      }
      if (!cur) {
        vm.$localstorage.remove('keep-sign-in');
        vm.$localstorage.remove('companyRole');
        vm.$localstorage.remove('plan');
        vm.$localstorage.remove('userRole');
        vm.$localstorage.remove('email');
        vm.$localstorage.remove('token');
        vm.$localstorage.remove('refresh_token');
        vm.$localstorage.remove('position');
        vm.$localstorage.set('version', pVer, true);
        vm.$localstorage.set('fresh', 'true', true);
        vm.$store.commit('setState', { logged: false });
        vm.$router.push({
          name: 'main',
          query: { status: 'unauthorized', from: vm.$route.path, reload: true }
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$loading.start();
    next();
  },
  beforeCreate() {
    this.$store.commit('setShowMobile', false);
  },
  mounted() {
    if (this.$localstorage.get('fresh') === 'true') {
      this.$localstorage.remove('fresh');
      location.reload(true);
    }
    this.auctionSocket = this.$nuxtSocket({
      name: 'auction',
      path: '/auction',
      forceNew: true
    });
    const h = document.querySelector('html');
    const b = document.body;
    h.removeAttribute('style');
    b.removeAttribute('style');
    this.$nextTick(() => {
      const vC = document.querySelector('.v-content__wrap');
      if (this.isSearch) {
        vC.classList.add('shrink');
      } else {
        vC.classList.remove('shrink');
      }
      this.$zIndexing();
      const mB = document.querySelector('.m-background');
      if (mB !== null) {
        document.querySelector('html,body').scrollTo({
          top: mB.offsetHeight,
          behavior: 'smooth'
        });
      }
      for (const f of document.querySelectorAll('[type="file"]')) {
        f.value = '';
      }
    });
  },
  computed: {
    isSearch() {
      return this.$route.name.includes('find-');
    },
    changes: {
      get() {
        return this.$store.state.changes;
      },
      set(v) {
        this.$store.commit('setState', { changes: v });
      }
    },
    message: {
      get() {
        return this.$store.state.message;
      },
      set(v) {
        this.$store.commit('setMessage', v);
        this.changes = true;
      }
    }
  }
};
