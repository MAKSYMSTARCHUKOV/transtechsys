<template>
  <section class="d-flex flex-column align-center">
    <h1>Скоро открытие!</h1>
    <img :src="$imgSrc('soon.png')" alt="" />
  </section>
</template>

<style lang="scss" scoped>
h1 {
  margin-top: 60px;
  margin-bottom: 40px;
}
img {
  max-width: 100vw;
}
</style>
