<template>
  <v-navigation-drawer
    app
    class="m-aside"
    color="#2D5EBB"
    :floating="true"
    :value="showAside"
  >
    <section class="bar-menu w-100 d-flex flex-column">
      <b v-if="mobile" class="menu-link">
        <a class="menu-link" href="/">главная</a>
      </b>
      <template v-if="tab || mobile">
        <template v-for="l of roleTopMenuFirst">
          <a
            :key="l.name"
            :data-id="l.name"
            class="menu-link"
            :class="{ soon: l.name.includes('уведом') }"
            :href="l.path"
            >{{ l.name }}</a
          >
        </template>
      </template>
      <template v-if="mobile">
        <a
          v-for="l of roleTopMenu"
          :key="l.name"
          class="menu-link"
          :class="{
            soon: ['курс валют', 'цены на гсм'].includes(l.name)
          }"
          :href="l.path"
          >{{ l.name }}</a
        >
      </template>
    </section>
    <section class="nav-menu w-100 d-flex flex-column">
      <div :class="[{ current: $route.name === 'cabinet' }, 'nav-item']">
        <img :src="$imgSrc(`icons/menu/${roleMenu[0].id}.svg`)" alt="" />
        <nuxt-link class="menu-link" to="/cabinet">{{
          roleMenu[0].name
        }}</nuxt-link>
      </div>
      <template v-for="(r, index) of roleMenu">
        <template v-if="allowed(index) && index > 0">
          <div
            v-if="!combineMenu(index)"
            :key="r.id"
            :class="[
              {
                current: $route.name.includes(r.path),
                soon: ['задачи', 'документы', 'статистика', 'расчет'].includes(
                  r.name
                )
              },
              'nav-item'
            ]"
          >
            <img :src="$imgSrc(`icons/menu/${r.id}.svg`)" alt="" />
            <nuxt-link
              class="menu-link"
              :class="{
                soon: ['задачи', 'документы', 'статистика', 'расчет'].includes(
                  r.name
                )
              }"
              :to="'/cabinet/' + r.path"
              >{{ r.name }}</nuxt-link
            >
          </div>
          <div
            v-else
            :key="r.id"
            :class="[
              {
                current:
                  $route.name.endsWith(r.id + '-car') ||
                  $route.name.endsWith(r.id + '-cargo')
              },
              'nav-item',
              'combine'
            ]"
          >
            <img :src="$imgSrc(`icons/menu/${r.id}.svg`)" alt="" />
            <a class="menu-link d-flex align-center justify-space-between"
              >{{ r.name }}<img :src="$imgSrc('icons/select-white.svg')"
            /></a>
            <div class="flex-break"></div>
            <div class="w-50 sub-menus d-flex ml-7 flex-column">
              <nuxt-link
                v-for="p of r.sub"
                :key="`${p.id}-${p.path}`"
                :class="{
                  current: $route.name.endsWith(p.path)
                }"
                class="sub-menu menu-link d-flex align-center"
                :to="'/cabinet/' + p.path"
                ><img :src="$imgSrc(`icons/menu/${p.ico}.svg`)" alt="" />{{
                  p.name
                }}</nuxt-link
              >
            </div>
          </div>
        </template>
      </template>
    </section>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState([
      'tab',
      'mobile',
      'fullScreen',
      'showMobile',
      'roleMenu',
      'roleTopMenu',
      'roleTopMenuFirst'
    ]),
    showAside: {
      get() {
        return this.showMobile;
      },
      set(v) {}
    }
  },
  methods: {
    combineMenu(id) {
      return this.roleMenu[id].sub;
    },
    allowed(id) {
      const r = this.$localstorage.get('companyRole');
      return !this.roleMenu[id].for || this.roleMenu[id].for.includes(r);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/aside.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
.v-navigation-drawer__content {
  // display: flex;
  // flex-direction: column;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  @include screen() {
    overflow-y: visible;
  }
}
</style>
