<template>
  <v-content>
    <m-breadcrumps last="тендеры"></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="with caption d-flex flex-column align-center">
      <h1>Скоро открытие!</h1>
      <img :src="$imgSrc('soon.png')" alt="" />
    </div>
  </v-content>
</template>

<script></script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
h1 {
  margin-top: 0px;
  margin-bottom: 40px;
  color: black;
  margin-top: 60px;
}
img {
  max-width: 100vw;
  margin-bottom: 60px;
}
</style>
