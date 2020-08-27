<template>
  <v-content class="r-main">
    <m-dialog></m-dialog>
    <m-draft></m-draft>
    <v-snackbar
      id="success"
      :value="changes"
      color="#2DAD51"
      :bottom="true"
      :top="true"
      :timeout="1500"
    >
      {{ $isEmpty($store.state.message) ? 'Сохранено!' : $store.state.message }}
    </v-snackbar>
    <FrameImage
      v-model="offset"
      :box="box"
      :image="editImage"
      :show="showEditor"
      :logo="isLogo"
      ><template #default>{{ editorTitle }}</template
      ><template #button
        ><m-button @click.native="saveImage(imageCollection, editImage, offset)"
          >применить</m-button
        ></template
      ><template #cancel>
        <img
          :src="$imgSrc('icons/close.svg')"
          style="height: 30px"
          alt=""
          @click="showEditor = !showEditor"
        /> </template
    ></FrameImage>
    <aside
      class="r-aside"
      :class="{ shrink: isSearch }"
      @mouseenter="unshrink"
      @mouseleave="shrink"
    >
      <c-logo
        v-if="!isSearch"
        :key="data.companyLogo.value"
        :image="companyLogo"
        :position="offsetLogo"
        :rate="data.companyRate"
      ></c-logo>
      <section class="nav-menu d-flex flex-column">
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
                  current: $route.name.includes(r.path)
                },
                'nav-item'
              ]"
            >
              <img :src="$imgSrc(`icons/menu/${r.id}.svg`)" alt="" />
              <nuxt-link
                class="menu-link"
                :class="{
                  soon: [
                    'задачи',
                    'документы',
                    'статистика',
                    'расчет'
                  ].includes(r.name)
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
              <div class="d-flex align-center w-100">
                <img :src="$imgSrc(`icons/menu/${r.id}.svg`)" alt="" />
                <a
                  class="menu-link d-flex align-center justify-space-between w-100"
                  >{{ r.name
                  }}<img class="arrow" :src="$imgSrc('icons/select-white.svg')"
                /></a>
              </div>
              <div class="flex-break"></div>
              <div
                class="w-50 sub-menus d-flex flex-column"
                :class="{ shrink: isSearch }"
              >
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
    </aside>
    <main class="m-main d-flex flex-column">
      <section
        v-if="!isSearch"
        :key="`${showEditor}=${data.companyPhoto.value}`"
        ref="background"
        class="m-background r-section"
        :style="{
          backgroundImage: `url(${companyPhoto})`,
          backgroundPosition: backPosition,
          backgroundSize: backSize
        }"
      >
        <div class="m-background-dim"></div>
        <c-logo
          v-if="!!(tab || mobile) && !isSearch"
          :key="data.companyLogo.value"
          :image="companyLogo"
          class="-mob"
          :position="offsetLogo"
          :rate="data.companyRate"
        ></c-logo>
      </section>
      <div class="m-board">
        <nuxt-child></nuxt-child>
        <Chat v-show="$route.name !== 'cabinet-messages'"></Chat>
      </div>
    </main>
  </v-content>
</template>

<script>
import { mapState } from 'vuex';
import chatSocket from '~/mixins/chatSocket.js';
import FrameImage from '~/components/FrameImage.vue';
import Chat from '~/components/Chat.vue';
const pack = require('~/package.json');

export default {
  layout: 'role',
  loading: false,
  rAsideWidth: '',
  components: {
    FrameImage,
    Chat
  },
  mixins: [chatSocket],
  async asyncData({ app, store, redirect, route, env }) {
    if (app.$localstorage.get('email')) {
      try {
        const r = await app.$user.getUser(app.$localstorage.get('email'));
        const m = await app.$getMemberInfo();
        let t = await app.$fetchImage(r.company.logo.value);
        store.commit('setField', {
          field: 'companyLogo',
          value: {
            position: r.company.logo.position,
            value: t
          }
        });
        t = await app.$fetchImage(r.company.photo.value);
        store.commit('setField', {
          field: 'companyPhoto',
          value: {
            position: r.company.photo.position,
            value: t
          }
        });
        t = await app.$fetchImage(m.memberPhoto.value);
        store.commit('setField', {
          field: 'memberPhoto',
          value: {
            position: m.memberPhoto.position,
            value: t
          }
        });
        store.commit('setField', {
          field: 'memberName',
          value: m.memberName
        });
        store.commit('setField', {
          field: 'companyRate',
          value: r.company.rate.default
        });
        store.commit('setState', {
          logged: true,
          member_id: r.member.id.value,
          company_id: r.company.id.value
        });
      } catch (e) {
        app.$errorHandle(e);
      }
      try {
        const u = {};
        const m = await app.$io.getUnreadMessages();
        for (const a of m.items) {
          let p = app.$imgSrc('void-img.png');
          if (!u.hasOwnProperty(a.member_from.id)) {
            if (!app.$isEmpty(a.member_from.memberPhoto.value)) {
              try {
                p = await app.$fetchImage(a.member_from.memberPhoto.value);
              } catch (e) {}
            }
            u[a.member_from.id] = {
              ids: [a.id],
              memberPhoto: {
                value: p,
                position: a.member_from.memberPhoto.position
              },
              memberName: a.member_from.memberName
            };
          } else {
            u[a.member_from.id].ids.push(a.id);
          }
        }
        store.commit('messaging/setUnread', u);
      } catch (e) {
        app.$errorHandle(e);
      }
      return {};
    } else {
      store.commit('setState', { logged: false, member_id: undefined });
      redirect({
        name: 'main',
        query: { status: 'unauthorized', from: route.path, reload: true }
      });
    }
  },
  data() {
    return {
      isMobile: false,
      offset: [0, 0, 0, 1]
    };
  },
  computed: {
    ...mapState(['tab', 'mobile', 'roleMenu', 'data']),
    ...mapState('profile', ['changes']),
    ...mapState('messaging', ['chat']),
    isSearch() {
      return this.$route.name.includes('find-');
    },
    editorTitle() {
      if (this.imageCollection.includes('Logo')) {
        return 'Область логотипа';
      } else if (this.imageCollection === 'memberPhoto') {
        return 'Область аватара';
      } else if (this.imageCollection.includes('Photo')) {
        return 'Область обложки';
      }
      return '';
    },
    isLogo() {
      if (
        this.imageCollection.includes('Logo') ||
        this.imageCollection === 'memberPhoto'
      ) {
        return true;
      } else if (this.imageCollection.includes('Photo')) {
        return false;
      }
      return false;
    },
    roler() {
      switch (this.$localstorage.get('companyRole')) {
        case 'ROLE_COMPANY_SENDER':
          return 'sender';
        case 'ROLE_COMPANY_CARRIER':
          return 'carrier';
        case 'ROLE_COMPANY_EXPEDITOR':
          return 'expeditor';
      }
      return false;
    },
    editImage: {
      get() {
        return this.$store.state.profile.editImage;
      },
      set(v) {
        this.$store.commit('profile/setState', { editImage: v });
      }
    },
    imageCollection: {
      get() {
        return this.$store.state.profile.imageCollection;
      },
      set(v) {
        this.$store.commit('profile/setState', { imageCollection: v });
      }
    },
    showEditor: {
      get() {
        return this.$store.state.profile.showEditor;
      },
      set(v) {
        this.$store.commit('profile/setState', { showEditor: v });
      }
    },
    offsetLogo: {
      get() {
        return this.$store.state.data.companyLogo
          ? this.$store.state.data.companyLogo.position
          : [0, 0, 0];
      },
      set(v) {}
    },
    companyPhoto: {
      get() {
        return this.$store.state.data.companyPhoto
          ? this.$isEmpty(this.$store.state.data.companyPhoto.value)
            ? `/images/${this.roler}-background.png`
            : this.$store.state.data.companyPhoto.value
          : `/images/${this.roler}-background.png`;
      },
      set(v) {
        this.$store.commit('setImage', { companyPhoto: v });
      }
    },
    companyLogo: {
      get() {
        return this.$store.state.data.companyLogo
          ? this.$isEmpty(this.$store.state.data.companyLogo.value)
            ? `/images/company-logo.png`
            : this.$store.state.data.companyLogo.value
          : `/images/company-logo.png`;
      },
      set(v) {
        this.$store.commit('setImage', { companyLogo: v });
      }
    },
    backPosition() {
      if (this.$store.state.mobile) {
        return this.data.companyPhoto
          ? `${this.data.companyPhoto.position[0] * 0.11}px ${this.data
              .companyPhoto.position[1] * 0.11}px`
          : 'center';
      } else {
        return this.data.companyPhoto
          ? `${this.data.companyPhoto.position[0]}px ${this.data.companyPhoto.position[1]}px`
          : 'center';
      }
    },
    backSize() {
      if (this.$store.state.mobile) {
        return this.data.companyPhoto
          ? this.data.companyPhoto.position[2] === 0
            ? 'cover'
            : `calc(100% + ${this.data.companyPhoto.position[2] * 0.11}px)`
          : 'cover';
      } else {
        return this.data.companyPhoto
          ? this.data.companyPhoto.position[2] === 0
            ? 'cover'
            : `calc(100% + ${this.data.companyPhoto.position[2]}px)`
          : 'cover';
      }
    },
    memberPhoto: {
      get() {
        return this.$store.state.data.memberPhoto
          ? this.$store.state.data.memberPhoto.value
          : `/images/void-img.png`;
      },
      set(v) {
        this.$store.commit('setImage', { memberPhoto: v });
      }
    },
    box: {
      get() {
        if (this.imageCollection.includes('Logo')) {
          return [174, 174];
        } else if (this.imageCollection === 'memberPhoto') {
          const c = document.querySelector('#avatar').querySelector('.img');
          const s = window.getComputedStyle(c, null);
          return [
            s.getPropertyValue('width').split('px')[0],
            s.getPropertyValue('height').split('px')[0]
          ];
        } else if (this.imageCollection.includes('Photo')) {
          const c = document.querySelector('.m-background');
          const s = window.getComputedStyle(c, null);
          return [
            s.getPropertyValue('width').split('px')[0],
            s.getPropertyValue('height').split('px')[0]
          ];
        }
        return [1, 1];
      },
      set(v) {}
    }
  },
  created() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.changes,
      (newV, oldV) => {
        if (newV) {
          setTimeout(() => {
            this.$store.commit('setState', { changes: false });
            this.$store.commit('setMessage', '');
          }, 1500);
        }
      }
    );
  },
  mounted() {
    if (this.$localstorage.get('fresh') === 'true') {
      this.$localstorage.remove('fresh');
      location.reload(true);
    }
    this.isMobile = !!(this.tab || this.mobile);
    const h = document.querySelector('html');
    const b = document.body;
    h.removeAttribute('style');
    b.removeAttribute('style');
    this.$nextTick(() => {
      const vC = document.querySelector('.v-content__wrap');
      if (this.isSearch) {
        vC.classList.add('shrink');
      } else {
        vC.classList.remove('shrink');
      }
      this.$zIndexing();
      const mB = document.querySelector('.m-background');
      if (mB !== null) {
        document.querySelector('html,body').scrollTo({
          top: mB.offsetHeight,
          behavior: 'smooth'
        });
      }
      for (const f of document.querySelectorAll('[type="file"]')) {
        f.value = '';
      }
    });
  },
  updated() {
    this.isMobile = !!(this.tab || this.mobile);
    if (this.$store.state.showMobile) {
      this.$store.commit('setShowMobile', false);
      const h = document.querySelector('html');
      const b = document.body;
      h.removeAttribute('style');
      b.removeAttribute('style');
    }
  },
  beforeDestroy() {
    try {
      this.unwatch();
    } catch {}
    if (!this.$localstorage.get('keep-sign-in')) {
      this.$localstorage.remove('companyRole');
      this.$localstorage.remove('plan');
      this.$localstorage.remove('userRole');
      this.$localstorage.remove('email');
      this.$localstorage.remove('token');
      this.$localstorage.remove('refresh_token');
      this.$store.commit('setState', { logged: false });
    }
  },
  beforeCreate() {
    this.$store.commit('setShowMobile', false);
  },
  methods: {
    saveImage(collection, data, position) {
      this.$screen(true);
      const pos = [
        position[0] * position[4],
        position[1] * position[4],
        position[2] * position[4],
        position[3]
      ];
      this.$images[collection]({
        value: data,
        position: pos
      })
        .then((r) => {
          this[collection] = data;
          this.$store.commit('setImagePosition', {
            [collection]: pos
          });
          this.changes = true;
        })
        .catch((e) => {
          this.$error(e);
        })
        .finally(() => {
          this.showEditor = false;
          this.imageCollection = '';
          this.$screen(false);
        });
    },
    combineMenu(id) {
      return this.roleMenu[id].sub;
    },
    allowed(id) {
      const r = this.$localstorage.get('companyRole');
      return !this.roleMenu[id].for || this.roleMenu[id].for.includes(r);
    },
    shrink(e) {
      if (this.isSearch) {
        const t = e.target.closest('.r-aside');
        const sM = t.querySelectorAll('.sub-menus');
        const nI = t.querySelectorAll('.nav-item.combine [class="menu-link"]');
        const vC = document.querySelector('.v-content__wrap');
        t.classList.add('shrink');
        vC.classList.add('shrink');
        for (const s of sM) {
          s.classList.add('shrink');
        }
        for (const s of nI) {
          s.classList.add('shrink');
        }
      }
    },
    unshrink(e) {
      if (this.isSearch) {
        const t = e.target.closest('.r-aside');
        const sM = t.querySelectorAll('.sub-menus');
        const nI = t.querySelectorAll('.nav-item.combine [class="menu-link"]');
        const vC = document.querySelector('.v-content__wrap');
        t.classList.remove('shrink');
        vC.classList.remove('shrink');
        for (const s of sM) {
          s.classList.remove('shrink');
        }
        setTimeout(() => {
          for (const s of nI) {
            s.classList.remove('shrink');
          }
        }, 210);
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const ver = vm.$localstorage.get('version');
      const pVer = pack.version;
      let cur = true;
      if (ver !== undefined) {
        if (ver !== pVer) {
          cur = false;
        }
      } else {
        cur = false;
      }
      if (!cur) {
        vm.$localstorage.remove('keep-sign-in');
        vm.$localstorage.remove('companyRole');
        vm.$localstorage.remove('plan');
        vm.$localstorage.remove('userRole');
        vm.$localstorage.remove('email');
        vm.$localstorage.remove('token');
        vm.$localstorage.remove('refresh_token');
        vm.$localstorage.remove('position');
        vm.$localstorage.set('version', pVer, true);
        vm.$localstorage.set('fresh', 'true', true);
        vm.$store.commit('setState', { logged: false });
        vm.$router.push({
          name: 'main',
          query: { status: 'unauthorized', from: vm.$route.path, reload: true }
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$loading.start();
    next();
  },
  head() {
    return {
      titleTemplate: 'TransTechSys %s'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/company.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.v-content__wrap {
  display: flex;
  width: 100%;
}
// .v-content__wrap {
//   display: grid;
//   grid-template-columns: 1fr;
//   width: 100%;
//   @include screen() {
//     &.shrink {
//       grid-template-columns: 176px 1fr;
//     }
//     grid-template-columns: 335px 1fr;
//   }
// }
.v-tooltip__content {
  background-color: $brand !important;
  max-width: 300px;
  padding: 8px !important;
}
#success {
  .v-snack__content {
    justify-content: center;
  }
}
</style>
