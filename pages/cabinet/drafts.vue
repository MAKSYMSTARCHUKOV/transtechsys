<template>
  <section class="company-profile r-section white-background">
    <form action="" class="profile">
      <h1>шаблоны</h1>
      <div class="edit-data mb-8">
        <div v-if="tabs.length > 1" class="tabs">
          <m-tabs
            v-model="tab"
            :tabs="tabs"
            :tab="tabs[0].value"
            @mousedown="getDirection"
          ></m-tabs>
        </div>
        <transition :name="direction" mode="out-in">
          <draft :key="tab" :draft="tab"></draft>
        </transition>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  asyncData({ app, store }) {
    const tabs = [];
    let tab = '';
    const r = app.$localstorage.get('companyRole');
    if (r.toLowerCase().includes('expeditor')) {
      tabs.push({
        title: 'Добавить груз',
        value: 'cargo'
      });
      tabs.push({
        title: 'Добавить авто',
        value: 'car'
      });
    } else {
      store.state.roleMenu
        .filter((a) => {
          if (a.for && a.name.includes('добавить') && !a.sub) {
            return a.for.includes(r);
          }
          return false;
        })
        .forEach((d, i) => {
          tabs.push({
            title: app.$capitalize(d.name),
            value: d.path
          });
        });
    }
    tab = tabs[0].value;
    return {
      tabs,
      tab
    };
  },
  data() {
    return {
      direction: 'left-tab'
    };
  },
  methods: {
    getDirection(dir) {
      this.direction = dir;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/company.scss';
.tabs {
  grid-column: 1 / -1;
}
</style>
