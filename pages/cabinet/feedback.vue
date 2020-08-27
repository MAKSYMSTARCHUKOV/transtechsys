<template>
  <section class="company-profile r-section white-background">
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <form class="feedback d-flex flex-column profile">
      <h1>отзывы компаний</h1>
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
      <m-tabs
        v-model="currentTab"
        :tabs="tabs"
        @mousedown="getDirection"
      ></m-tabs>
      <transition-group
        mode="out-in"
        :name="direction"
        class="review-tab d-flex flex-column"
      >
        <template v-if="!$isEmpty(items)">
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
          <div v-for="(r, ind) of items" :key="ind" class="review-item d-flex">
            <div
              class="item-avatar"
              :style="{
                backgroundImage: `url(${r.avatar.value})`
              }"
            ></div>
            <div class="item-container d-flex flex-column">
              <div
                class="item-header d-flex justify-space-between align-center"
              >
                <div class="company-name d-flex flex-column">
                  <div class="h3">{{ r.name }}</div>
                  <div class="rate d-flex">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="star"
                      :class="{
                        active: i <= r.rate
                      }"
                    ></div>
                  </div>
                </div>
                <div class="reaction d-flex align-center">
                  <div class="liked" :class="{ true: r.reviews[0].like }"></div>
                  <div
                    class="not-liked"
                    :class="{ true: !r.reviews[0].like }"
                  ></div>
                </div>
              </div>
              <div
                v-if="!$isEmpty(r.description)"
                class="item-description"
                v-html="oText(r.description)"
              ></div>
              <div class="item-review d-flex flex-column mt-auto">
                <div
                  v-for="f of r.reviews"
                  :key="f.name"
                  class="feedback-item d-flex"
                >
                  <div
                    class="review-avatar"
                    :style="{
                      backgroundImage: `url(${f.avatar.value})`,
                      backgroundSize: size(f.avatar.position)[2],
                      backgroundPosition: `${size(f.avatar.position)[0]} ${
                        size(f.avatar.position)[1]
                      }`
                    }"
                  ></div>
                  <div class="review-content d-flex">
                    <div class="content-info d-flex flex-column">
                      <div class="info-name">{{ f.name }}</div>
                      <div class="info-text">{{ f.description }}</div>
                    </div>
                    <div class="content-date">{{ f.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="pages > 1" class="pages d-flex">
            <m-pagination
              v-model="pageObj"
              :pages="pages"
              :page="page"
              color="#4E5357"
            ></m-pagination>
          </div>
        </template>
      </transition-group>
    </form>
  </section>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import Loading from '~/components/Loading.vue';
export default {
  components: {
    Loading
  },
  mixins: [hideMobileMenu],
  async asyncData({ app }) {
    let pages = 1;
    const limit = 10;
    const page = 1;
    let items = [];
    const func = 'getAll';
    let total = 0;
    const phrase = '';
    try {
      const r = await app.$review[func](page, limit, phrase);
      total = r.total;
      if (r.total > 0) {
        const a = [];
        if (!app.$isEmpty(r.items)) {
          for (const i of r.items) {
            const q = {
              name: i.companyName === 'dummy' ? 'Без названия' : i.companyName,
              description: i.companyDescription,
              rate: i.companyRate,
              avatar: {
                value: app.$imgSrc('void-company.png')
              }
            };
            if (!app.$isEmpty(i.companyLogo.value)) {
              try {
                const t = await app.$fetchImage(i.companyLogo.value);
                if (!app.$isEmpty(t)) {
                  q.avatar.value = t;
                }
              } catch (e) {}
            }
            const reviews = [];
            for (const r of i.reviews) {
              const c = r.creator.member;
              const d = new Date(r.date);
              const date = `${d.getDate()}.${(d.getMonth() + 1)
                .toString()
                .padStart(2, '0')}.${d.getFullYear()}`;
              const rev = {
                description: r.description.default,
                like: r.like,
                date,
                name: c.name.default,
                avatar: {
                  value: app.$imgSrc('void-img.png'),
                  position: c.photo.position
                }
              };
              if (!app.$isEmpty(c.photo.value)) {
                try {
                  const t = await app.$fetchImage(c.photo.value);
                  if (!app.$isEmpty(t)) {
                    rev.avatar.value = t;
                  }
                } catch (e) {}
              }
              reviews.push(rev);
            }
            [...q.reviews] = reviews;
            a.push(q);
          }
        }
        [...items] = a;
        const div = r.total / limit;
        const abs = Math.floor(div);
        pages = div > abs ? abs + 1 : abs;
      }
    } catch (e) {
      app.$errorHandle(e);
    }
    return {
      phrase,
      items,
      pages,
      page,
      limit,
      total,
      func
    };
  },
  data() {
    return {
      mobLoading: false,
      direction: 'right-tab',
      pageObj: {
        page: this.page
      },
      currentTab: 'all',
      tabs: [
        {
          value: 'all',
          title: 'Все'
        },
        {
          value: 'like',
          title: 'Положительные'
        },
        {
          value: 'notLike',
          title: 'Отрицательные'
        }
      ],
      searching: false,
      timer: undefined,
      default: true,
      fake:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita, deserunt dolor accusantium repudiandae optio consectetur fugit eum voluptatibus, eligendi mollitia hic dolorum. Blanditiis amet neque quam odio magni eos! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium voluptatibus quasi nesciunt quod dolorem illum dolore modi aperiam, laborum accusantium ipsum doloremque? Esse iusto quasi dolorem eaque nam quas asperiores.'
    };
  },
  computed: {
    ...mapState(['mobile'])
  },
  watch: {
    async pageObj(newV) {
      if (newV && newV.page > 0) {
        this.mobLoading = true;
        [...this.items] = [];
        try {
          const r = await this.$review[this.func](
            this.page,
            this.limit,
            this.phrase
          );
          this.total = r.total;
          if (r.total > 0) {
            [...this.items] = JSON.parse(
              JSON.stringify(await this.prettifyItems(r.items))
            );
            const div = r.total / this.limit;
            const abs = Math.floor(div);
            this.pages = div > abs ? abs + 1 : abs;
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        this.mobLoading = false;
      }
    },
    limit(newV) {
      if (newV) {
        Vue.set(this, 'pageObj', { page: -1 });
        this.$nextTick(() => {
          this.page = 1;
          this.phrase = '';
          Vue.set(this, 'pageObj', { page: this.page });
        });
      }
    },
    currentTab(newV) {
      if (newV) {
        this.func = `get${this.$capitalize(newV)}`;
        Vue.set(this, 'pageObj', { page: -1 });
        this.$nextTick(() => {
          this.page = 1;
          this.phrase = '';
          this.limit = 10;
          Vue.set(this, 'pageObj', { page: this.page });
        });
      }
    }
  },
  mounted() {
    console.log(this.items);
    this.$nextTick(() => {
      this.$nuxt.$loading.finish();
    });
  },
  methods: {
    async prettifyItems(arr) {
      const a = [];
      if (!this.$isEmpty(arr)) {
        for (const i of arr) {
          const q = {
            name: i.companyName === 'dummy' ? 'Без названия' : i.companyName,
            description: i.companyDescription,
            rate: i.companyRate,
            avatar: {
              value: this.$imgSrc('void-company.png')
            }
          };
          if (!this.$isEmpty(i.companyLogo.value)) {
            try {
              const t = await this.$fetchImage(i.companyLogo.value);
              if (!this.$isEmpty(t)) {
                q.avatar.value = t;
              }
            } catch (e) {}
          }
          const reviews = [];
          for (const r of i.reviews) {
            const c = r.creator.member;
            const d = new Date(r.date);
            const date = `${d.getDate()}.${(d.getMonth() + 1)
              .toString()
              .padStart(2, '0')}.${d.getFullYear()}`;
            const rev = {
              description: r.description.default,
              like: r.like,
              date,
              name: c.name.default,
              avatar: {
                value: this.$imgSrc('void-img.png'),
                position: c.photo.position
              }
            };
            if (!this.$isEmpty(c.photo.value)) {
              try {
                const t = await this.$fetchImage(c.photo.value);
                if (!this.$isEmpty(t)) {
                  rev.avatar.value = t;
                }
              } catch (e) {}
            }
            reviews.push(rev);
          }
          [...q.reviews] = reviews;
          a.push(q);
        }
      }
      return a;
    },
    oText(str) {
      if (str.length > 290) {
        return (str.substr(0, 287) + '...').split(/\n/).join('<p>');
      } else {
        return str;
      }
    },
    size(pos) {
      const sF = 43 / 124;
      const p = pos;
      const c = p.map((d, i) => {
        if (i !== 2 && i !== 3) {
          return d * sF + 'px';
        } else if (i === 2) {
          return d === 0
            ? 'cover'
            : p[3] === 0
            ? `auto calc(100% + ${d * sF}px)`
            : `calc(100% + ${d * sF}px)`;
        }
      });
      return c;
    },
    getDirection(dir) {
      this.direction = dir;
    },
    search(e) {
      const t = e.target;
      const l = t.closest('.m-input').querySelector('.loading_img');
      this.phrase = t.value;
      const v = this.phrase;
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
          (async () => {
            [...this.items] = [];
            const w = await this.$review[this.func](1, this.limit, n);
            this.$waiting(l, false);
            this.total = w.total;
            if (this.total > 0) {
              const div = this.total / this.limit;
              const abs = Math.floor(div);
              this.pages = div > abs ? abs + 1 : abs;
              this.page = 1;
            }
            [...this.items] = JSON.parse(
              JSON.stringify(await this.prettifyItems(w.items))
            );
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
    }
  },
  head() {
    return {
      title: '| Отзывы'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/feedback.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
.info-text {
  font-size: rem(16);
}
</style>
