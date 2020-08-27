<template>
  <form>
    <img
      id="back"
      :src="$imgSrc('icons/back.svg')"
      alt="<"
      class="pointer"
      @click="$store.commit('setOverlayMode', 'register')"
    />
    <h1>правила пользвания</h1>
    <div class="overview" style="text-align:left">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel minus
      voluptates omnis asperiores nesciunt ea ab. Fugit, accusantium
      exercitationem asperiores dignissimos alias dolorem quod autem, modi quo
      minima nulla placeat. Lorem, ipsum dolor sit amet consectetur adipisicing
      elit. Libero modi repudiandae repellat, minus quas blanditiis atque.
      Officia corrupti eligendi cumque eaque obcaecati ducimus. Illo rem dolorem
      magnam, incidunt cupiditate consequuntur!
    </div>
  </form>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
