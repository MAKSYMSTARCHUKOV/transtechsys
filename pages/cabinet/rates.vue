<template>
  <div class="rates d-flex flex-column">
    <h1>тарифы</h1>
    <m-tabs v-model="roleTab" :tabs="rateTabs" :tab="role"></m-tabs>
  </div>
</template>

<script>
export default {
  asyncData({ app, store }) {
    const role = app.$localstorage
      .get('companyRole')
      .split('_')[2]
      .toLowerCase();
    const rateTabs = store.state.rateTabs;
    return {
      role,
      rateTabs
    };
  },
  data() {
    return {
      roleTab: this.role
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/rates.scss';
</style>
