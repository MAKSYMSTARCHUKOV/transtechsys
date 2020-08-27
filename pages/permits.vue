<template>
  <v-content>
    <Loading :state="loading" />
    <m-breadcrumps last="разрешения"></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="d-flex with-caption flex-column">
      <h1>разрешения</h1>
      <iframe
        name="permits"
        src="https://opendata.e-transport.gov.ua/PermitsRests/"
        height="1420px"
        class="w-100"
        @load="loading = undefined"
      ></iframe>
    </div>
  </v-content>
</template>

<script>
import Loading from '~/components/Loading.vue';

export default {
  loading: false,
  components: {
    Loading
  },
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.$route.query.reload) {
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
        }
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.reload) {
      next((vm) => {
        const q = {};
        for (const qq in to.query) {
          if (qq !== 'reload') {
            q[qq] = to.query[qq];
          }
        }
        vm.$router.replace({ query: q }, () => {
          vm.$router.go();
        });
      });
    } else {
      next((vm) => {});
    }
  },
  head() {
    return {
      title:
        'Разрешения от системы автоматизации логистических процессов TransTechSystem',
      meta: [
        {
          name: 'description',
          content:
            'Разрешения от TransTechSystem - система автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
@import '~/static/scss/index/with-caption.scss';
</style>
<style lang="scss">
.navbar-fixed-top {
  display: none;
}
</style>
