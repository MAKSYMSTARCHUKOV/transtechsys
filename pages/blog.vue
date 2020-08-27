<template>
  <v-content>
    <Loading :state="loading" />
    <m-breadcrumps last="блог"></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="blog with-caption d-flex flex-column">
      <h1 class="d-flex justify-space-between">
        блог<m-select
          selected-color="#2D5EBB"
          border="transparent"
          width="max-content"
          :options="options"
          :selected="options[0]"
          :prepend="$imgSrc('icons/burger-blue.svg')"
        ></m-select>
      </h1>
      <div v-if="total > 4" class="limit d-flex align-center">
        <span>Отображать по</span>
        <div :class="{ current: limit === 5 }" @click="limit = 5">5</div>
        <div :class="{ current: limit === 10 }" @click="limit = 10">10</div>
        <div :class="{ current: limit === 25 }" @click="limit = 25">25</div>
        <div :class="{ current: limit === 50 }" @click="limit = 50">50</div>
        <div :class="{ current: limit === 100 }" @click="limit = 100">
          100
        </div>
      </div>
      <div
        v-for="b of items"
        :key="b.image"
        class="blog-item d-flex flex-column"
      >
        <div class="content">
          <div class="text-container d-flex flex-column">
            <div class="text">
              <div
                class="photo"
                :style="{
                  backgroundImage: `url(/uploads/blog/${b.image})`
                }"
              ></div>
              <div class="header d-flex">
                <div class="h1">{{ b.title }}</div>
                <span>{{ new Date(b.created_at).toLocaleDateString() }}</span>
              </div>
              <span v-html="oText(b.content) || aText(b.content)"></span>
              <div
                v-if="oText(b.content)"
                class="more d-flex pointer align-center"
                @click="showText($event, b.content)"
              >
                читать
                <img :src="$imgSrc('icons/select.svg')" alt="" />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="border"></div>
          <div class="icons d-flex justify-space-between">
            <div class="m-container" @click="showComments">
              <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
              <span>комментарии ({{ commentCount }})</span>
            </div>
            <div class="reaction d-flex">
              <div class="m-container">
                <img :src="$imgSrc('icons/like.svg')" alt="" />
                <span>4</span>
              </div>
              <div class="m-container ml-4">
                <img
                  :src="$imgSrc('icons/like.svg')"
                  alt=""
                  style="transform: rotate(180deg)"
                />
                <span>1</span>
              </div>
              <div class="m-container ml-4">
                <img :src="$imgSrc('icons/share.svg')" alt="" />
              </div>
            </div>
          </div>
          <div class="comments-container">
            <div class="comments d-flex flex-column">
              <div class="create d-flex flex-column">
                <textarea
                  name="comment"
                  placeholder="Оставить комментарий"
                ></textarea>
                <m-button shade="blue">опубликовать</m-button>
              </div>
              <div class="capt">Комментарии:</div>
              <div class="written d-flex flex-column">
                <div class="comment d-flex flex-column">
                  <div class="head d-flex align-center ">
                    <div class="avatar"></div>
                    <span>Макс фон Сюдов</span>
                  </div>
                  <div class="origin">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
                    placeat tempore ea ab perspiciatis pariatur eligendi maxime,
                    vitae, necessitatibus et sint magnam minima nobis, esse
                    incidunt aliquam sunt quidem consequatur.
                  </div>
                </div>
                <div class="comment d-flex flex-column">
                  <div class="head d-flex align-center ">
                    <div class="avatar"></div>
                    <span>омар хайям</span>
                  </div>
                  <div class="origin">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
                    placeat tempore ea ab perspiciatis pariatur eligendi maxime,
                    vitae, necessitatibus et sint magnam minima nobis, esse
                    incidunt aliquam sunt quidem consequatur.
                  </div>
                </div>
              </div>
            </div>
          </div> -->
      </div>
      <div v-show="pages > 1" class="pages d-flex">
        <m-pagination
          v-model="pageObj"
          :pages="pages"
          :page="page"
          color="#4E5357"
        ></m-pagination>
      </div>
    </div>
  </v-content>
</template>

<script>
import { mapState } from 'vuex';
import indexPages from '~/mixins/indexPages.js';

export default {
  mixins: [indexPages],
  beforeRouteEnter(to, from, next) {
    if (to.query.reload) {
      next((vm) => {
        const q = {};
        for (const qq in to.query) {
          if (qq !== 'reload') {
            q[qq] = to.query[qq];
          }
        }
        vm.$router.replace({ query: q }, () => {
          vm.$router.go();
        });
      });
    } else {
      next((vm) => {});
    }
  },
  async asyncData({ store, route, app }) {
    const p = app.$localstorage.get('position');
    const e = app.$localstorage.get('email');
    const n = route.name;
    let items = [];
    let limit = 5;
    let pages = 1;
    let total = 0;
    const page = 1;
    if (p !== undefined) {
      if (p[e]) {
        if (p[e][n]) {
          limit = p[e][n].limit;
        } else {
          p[e][n] = {
            limit
          };
          app.$localstorage.set('position', p, true);
        }
      } else {
        p[e] = {
          [n]: {
            limit
          }
        };
        app.$localstorage.set('position', p, true);
      }
    } else {
      const o = {
        [e]: {}
      };
      o[e][n] = {
        limit
      };
      app.$localstorage.set('position', o, true);
    }
    try {
      const r = await app.$blog.get(page, limit);
      if (!app.$isEmpty(r.items)) {
        [...items] = r.items;
      }
      const p = r.pagination;
      total = p.totalCount;
      const div = total / limit;
      const abs = Math.floor(div);
      pages = div > abs ? abs + 1 : abs;
    } catch (e) {
      console.log(e);
      app.$errorHandle(e);
    }
    return {
      pages,
      page,
      limit,
      total,
      items
    };
  },
  data() {
    return {
      pageObj: {
        page: this.page
      },
      options: [
        {
          title: 'ПОСЛЕДНИЕ',
          value: 'last'
        }
      ],
      news: '',
      commentCount: 2
    };
  },
  computed: {
    ...mapState(['mobile'])
  },
  watch: {
    async limit(newV, oldV) {
      if (newV !== oldV) {
        this.$screen(true);
        const oP = this.page;
        try {
          this.page = 1;
          const i = await this.$blog.get(this.page, newV);
          [...this.items] = i.items;
          const pg = i.pagination;
          const div = pg.totalCount / newV;
          const abs = Math.floor(div);
          this.pages = div > abs ? abs + 1 : abs;
          const t = this.mobile
            ? document.querySelector('.company-profile').offsetTop
            : document.querySelector('.m-background').offsetHeight;
          this.$nextTick(() => {
            document.querySelector('html,body').scrollTo({
              top: t,
              behavior: 'smooth'
            });
            const p = this.$localstorage.get('position');
            const e = this.$localstorage.get('email');
            const n = this.$route.name;
            p[e][n].limit = this.limit;
            this.$localstorage.set('position', p, true);
          });
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
          const i = await this.$blog.get(newV.page, this.limit);
          [...this.items] = i.items;
          this.$nextTick(() => {
            const t = this.mobile
              ? document.querySelector('.company-profile').offsetTop
              : document.querySelector('.m-background').offsetHeight;
            document.querySelector('html,body').scrollTo({
              top: t,
              behavior: 'smooth'
            });
          });
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
      }
    }
  },
  methods: {
    oText(news) {
      if (this.mobile) {
        if (news.length > 100) {
          return (news.substr(0, 97) + '...').split(/\n/).join('<p>');
        } else {
          return false;
        }
      } else if (!this.mobile) {
        if (news.length > 808) {
          return (news.substr(0, 805) + '...').split(/\n/).join('<p>');
        } else {
          return false;
        }
      }
      return false;
    },
    aText(content) {
      return content.split(/\n/).join('<p>');
    },
    showText(e, news) {
      const c = e.target.closest('.text-container');
      const t = c.querySelector('.text');
      const p = c.querySelector('.photo');
      const h = c.querySelector('.header');
      const tN = news.split(/\n/);
      t.innerHTML = '';
      t.appendChild(p);
      t.appendChild(h);
      for (const a of tN) {
        const q = document.createTextNode(a);
        t.appendChild(q);
        const b = document.createElement('p');
        t.appendChild(b);
      }
      t.removeChild(t.querySelector('p:last-child'));
    },
    showComments(e) {
      const b = e.target.closest('.blog-item');
      const cc = b.querySelector('.comments-container');
      const c = cc.children[0];
      if (cc.offsetHeight === 0) {
        cc.style.height = c.clientHeight + 'px';
        return false;
      } else {
        cc.style.height = '0px';
      }
    }
  },
  head() {
    return {
      title:
        'Блог TransTechSystem - система автоматизации логистических процессов',
      meta: [
        {
          name: 'description',
          content:
            'Статьи о грузоперевозках 🚚 Полезная информация о поиске грузов для перевозки и поиске транспорта для перевозок ✔️ Информация для экспедиторов 👍🏼 Блог TransTechSystem - система автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/blog.scss';
</style>
