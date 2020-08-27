<template>
  <div class="company-catalog with-caption d-flex flex-column">
    <m-breadcrumps last="каталог компаний" :up="true"></m-breadcrumps>
    <h1>каталог компаний</h1>
    <div class="catalog-header d-flex">
      <m-input
        class="search"
        :prepend="true"
        placeholder="Название"
        :input-value="phrase"
        @input="search"
      >
        <template #prepend>
          <img :src="$imgSrc('icons/search.svg')" alt="" />
        </template>
      </m-input>
      <div v-if="total > 5" class="limit d-flex align-center">
        <span>Отображать по</span>
        <div :class="{ current: limit === 5 }" @click="limit = 5">5</div>
        <div :class="{ current: limit === 10 }" @click="limit = 10">10</div>
        <div :class="{ current: limit === 25 }" @click="limit = 25">25</div>
        <div :class="{ current: limit === 50 }" @click="limit = 50">50</div>
        <div :class="{ current: limit === 100 }" @click="limit = 100">
          100
        </div>
      </div>
    </div>
    <div class="catalog-content d-flex flex-column">
      <Loading :absolute="true" :state="searching"></Loading>
      <nuxt-link
        v-for="c of info"
        :key="c.companyId"
        :to="{ name: 'catalog-id', params: { id: c.companyId } }"
        class="content-item d-flex"
      >
        <div
          class="_avatar"
          :style="{
            backgroundImage: `url(${c.companyLogo.value})`
          }"
        ></div>
        <div class="_info d-flex flex-column">
          <div class="_info-header d-flex flex-column">
            <div class="_info-header-title">
              {{ companyName(c) }}
            </div>
            <!-- <div class="_info-header-country">Germany</div> -->
            <div class="_info-header-rate d-flex">
              <div
                v-for="i in 5"
                :key="i"
                class="star"
                :class="{
                  active: i <= c.companyRate
                }"
              ></div>
            </div>
          </div>
          <div
            v-if="!$isEmpty(c.companyDescription)"
            class="_info-desc"
            v-html="oText(c.companyDescription)"
          ></div>
        </div>
      </nuxt-link>
      <div v-if="pages > 1" class="pages d-flex">
        <m-pagination
          v-model="pageObj"
          :pages="pages"
          :page="page"
          color="#4E5357"
        ></m-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  mixins: [indexPagesUnregister],
  async asyncData({ app, route }) {
    let p = app.$localstorage.get('position');
    const n = route.name;
    const i = [];
    let total = 0;
    let pages = 1;
    let limit = 5;
    let page = 1;
    let search = '';
    if (p !== undefined) {
      if (p[n]) {
        limit = p[n].limit;
        page = p[n].page;
        search = p[n].search;
      } else {
        p[n] = {
          limit,
          page,
          search
        };
        app.$localstorage.set('position', p, true);
      }
    } else {
      p = {
        [n]: {
          limit,
          page,
          search
        }
      };
      app.$localstorage.set('position', p, true);
    }
    try {
      const w = await app.$company.getCompany(page, limit, search);
      total = w.total;
      if (total > 0) {
        const div = total / 5;
        const abs = Math.floor(div);
        pages = div > abs ? abs + 1 : abs;
        for (const y of w.items) {
          let p = app.$imgSrc('void-company.png');
          try {
            const t = await app.$fetchImage(y.companyLogo.value);
            p = app.$isEmpty(t) ? p : t;
          } catch {}
          y.companyLogo.value = p;
          i.push(y);
        }
      }
    } catch (e) {
      app.$errorHandle(e);
    }
    return {
      info: i,
      total,
      pages,
      page,
      limit,
      phrase: search
    };
  },
  data() {
    return {
      page: 1,
      searching: false,
      pageObj: {
        page: 1
      },
      timer: undefined,
      default: true
    };
  },
  watch: {
    async limit(newV, oldV) {
      if (newV !== oldV) {
        this.$screen(true);
        const oP = this.page;
        try {
          this.page = 1;
          await this.updateList();
        } catch (e) {
          this.$errorHandle(e);
          this.limit = oldV;
          this.page = oP;
        }
        this.$screen(false);
      }
    },
    async pageObj(newV) {
      if (newV) {
        this.$screen(true);
        try {
          this.page = newV.page;
          await this.updateList();
        } catch (e) {
          this.$errorHandle(e);
        }
        document.querySelector('html, body').scrollTo({
          top: document.querySelector('.company-catalog').offsetTop,
          behavior: 'smooth'
        });
        this.$screen(false);
      }
    }
  },
  methods: {
    oText(news) {
      if (news.length > 290) {
        return (news.substr(0, 287) + '...').split(/\n/).join('<p>');
      } else {
        return news;
      }
    },
    companyName(com) {
      return com.companyName === 'dummy' ? 'Без названия' : com.companyName;
    },
    search(e) {
      const t = e.target;
      const l = t.closest('.m-input').querySelector('.loading_img');
      this.phrase = t.value;
      const v = this.phrase;
      const p = this.$localstorage.get('position');
      const n = this.$route.name;
      p[n].search = v;
      this.$localstorage.set('position', p, true);
      if (v.length > 2 || (v.length < 3 && !this.default)) {
        const n = v.length > 2 ? v : '';
        if (!this.default) {
          this.$waiting(l, true);
          this.searching = true;
        }
        this.$waiting(l, true);
        this.searching = true;
        this.$cancel();
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const i = [];
          (async () => {
            const w = await this.$company.getCompany(1, this.limit, n);
            this.$waiting(l, false);
            this.total = w.total;
            if (this.total > 0) {
              const div = this.total / 5;
              const abs = Math.floor(div);
              this.pages = div > abs ? abs + 1 : abs;
              this.page = 1;
              for (const y of w.items) {
                if (y.companyName === 'dummy') {
                  continue;
                } else {
                  let p = this.$imgSrc('void-company.png');
                  try {
                    const t = await this.$fetchImage(y.companyLogo.value);
                    p = this.$isEmpty(t) ? p : t;
                  } catch {}
                  y.companyLogo.value = p;
                  i.push(y);
                }
              }
            }
            [...this.info] = i;
            if (v.length > 2) {
              this.default = false;
            }
            if (v.length < 3) {
              this.default = true;
            }
            this.searching = false;
          })();
        }, 700);
      }
    },
    async updateList() {
      this.searching = true;
      this.$cancel();
      const i = [];
      const w = await this.$company.getCompany(
        this.page,
        this.limit,
        this.phrase
      );
      const p = this.$localstorage.get('position');
      const n = this.$route.name;
      p[n] = {
        page: this.page,
        limit: this.limit,
        search: this.phrase
      };
      this.$localstorage.set('position', p, true);
      this.total = w.total;
      if (this.total > 0) {
        const div = this.total / this.limit;
        const abs = Math.floor(div);
        this.pages = div > abs ? abs + 1 : abs;
        for (const y of w.items) {
          let p = this.$imgSrc('void-company.png');
          try {
            const t = await this.$fetchImage(y.companyLogo.value);
            p = this.$isEmpty(t) ? p : t;
          } catch {}
          y.companyLogo.value = p;
          i.push(y);
        }
      }
      [...this.info] = i;
      this.searching = false;
    }
  },
  head() {
    return {
      title:
        'Каталог компаний от системы автоматизации логистических процессов TransTechSystem',
      meta: [
        {
          name: 'description',
          content:
            'Каталог компаний от TransTechSystem - система автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
@import '~/static/scss/index/with-caption.scss';
@import '~/static/scss/index/company-catalog.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
._info-desc {
  font-size: rem(16);
}
</style>
