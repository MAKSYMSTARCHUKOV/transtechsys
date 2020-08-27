<template>
  <form>
    <img
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="close"
    />
    <h1>Успешно!</h1>
    <img
      :src="$imgSrc('icons/success.svg')"
      alt=""
      style="grid-column: 1 / -1; height: 50px; justify-self: center"
    />
    <div class="overview h">
      Вы успешно зарегестрировались в системе.<br />Теперь вы можете войти в
      систему используя свой e-mail и пароль.
    </div>
  </form>
</template>

<script>
export default {
  methods: {
    close() {
      if (this.$route.query.userSignin) {
        this.$store.commit('setOverlayMode', 'signin');
      } else {
        this.$store.commit('setOverlayVisible', false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
