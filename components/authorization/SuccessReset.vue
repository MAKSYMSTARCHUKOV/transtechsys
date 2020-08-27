<template>
  <form>
    <img
      v-if="!extreme"
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="$store.commit('setOverlayMode', 'signin')"
    />
    <h1>Успешно!</h1>
    <img
      :src="$imgSrc('icons/password.svg')"
      alt=""
      style="grid-column: 1 / -1; height: 50px; justify-self: center"
    />
    <div class="overview h">
      Пароль изменен. Теперь Вы можете войти в систему используя новый пароль.
    </div>
  </form>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
