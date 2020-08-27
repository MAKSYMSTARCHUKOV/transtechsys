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
      Письмо отправленно на адрес электронной почты указанный при регистрации.
      Пожалуйста, перейдите по ссылке в письме, чтоб закончить регистрацию.
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
