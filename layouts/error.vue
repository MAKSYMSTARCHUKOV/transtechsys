<template>
  <v-content style="{padding: 80px}">
    <m-breadcrumps
      :last="error.statusCode"
      m-style="white"
      :up="true"
      style="top: -60px"
    ></m-breadcrumps>
    <div class="cont">
      <img :src="$imgSrc('error-truck.png')" alt="" />
      <h1>
        {{ error.statusCode }}
        <h3>
          {{ error.statusCode === 404 ? 'Страница не найдена' : error.message }}
        </h3>
      </h1>
    </div>
  </v-content>
</template>

<script>
export default {
  layout: 'default',
  props: ['error']
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.v-content {
  position: relative;
  background-color: $brand;
  padding: 150px 25px !important;
  @include tablet() {
    padding: 150px !important;
  }
  .cont {
    grid-column: 1 / -1;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 10px 10px;
    @include tablet() {
      padding: 30px 60px;
    }
    h1 {
      color: #ff9d35;
      z-index: 1;
      font-size: 1.7rem;
      @include tablet() {
        font-size: 4rem;
      }
    }
    h3 {
      color: #353535;
      text-transform: none;
      font-size: 1rem;
      z-index: 1;
      margin-top: 8px !important;
      width: 200px;
      @include tablet() {
        max-width: 500px;
        font-size: 2rem;
        width: 100%;
        margin-top: 20px !important;
      }
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      z-index: 0;
    }
  }
}
</style>

<style lang="scss">
.v-content__wrap {
  justify-content: center;
}
</style>
