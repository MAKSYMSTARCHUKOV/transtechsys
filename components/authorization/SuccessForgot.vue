<template>
  <form>
    <img
      v-if="!extreme"
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="$store.commit('setOverlayVisible', false)"
    />
    <h1>Успешно!</h1>
    <img
      :src="$imgSrc('icons/sent.svg')"
      alt=""
      style="grid-column: 1 / -1; height: 50px; justify-self: center"
    />
    <div class="overview h">
      Письмо отправленно на адрес электронной почты указанный при регистрации.
      Пожалуйста, перейдите по ссылке в письме, чтоб сбросить пароль.
    </div>
  </form>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
