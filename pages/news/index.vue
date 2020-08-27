<template>
  <div class="with-caption d-flex flex-column">
    <m-breadcrumps last="новости" :up="true"></m-breadcrumps>
    <h1>последние новости</h1>
    <div class="all-news">
      <div
        v-for="b of items"
        :key="b.image"
        class="the-news d-flex flex-column"
      >
        <div
          class="img"
          :style="{
            backgroundImage: `url(/uploads/blog/${b.image})`
          }"
        ></div>
        <div class="the-news-content">
          <div class="h1">{{ b.title }}</div>
          <span class="published">{{
            new Date(b.created_at).toLocaleDateString()
          }}</span>
          <div class="article">
            <p>{{ aText(b.content) }}</p>
          </div>
          <nuxt-link
            :to="{
              name: 'news-id',
              params: {
                id: b.id
              }
            }"
            class="read-more"
            >ЧИТАТЬ ДАЛЬШЕ ➜</nuxt-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  mixins: [indexPagesUnregister],
  async asyncData({ app }) {
    let items = [];
    try {
      let b = await app.$blog.get(1, 12);
      const p = b.pagination;
      const total = p.totalCount;
      if (total <= 12) {
        [...items] = b.items;
      } else if (total > 12) {
        const div = total / 12;
        const abs = Math.floor(div);
        const pages = div > abs ? abs + 1 : abs;
        b = await app.$blog.get(pages, 12);
        let i = b.items;
        [...items] = i;
        if (div > abs) {
          b = await app.$blog.get(pages - 1, 12);
          i = b.items;
          for (let y = 11; items.length < 12; y--) {
            items.unshift(i[y]);
          }
        }
      }
      items.reverse();
    } catch (e) {
      app.$errorHandle(e);
    }
    return {
      items
    };
  },
  methods: {
    aText(content) {
      if (content.length > 250) {
        return `${content.substr(0, 250)}...`;
      }
      return content;
    }
  },
  head() {
    return {
      title:
        'Новости от TransTechSystem - система автоматизации логистических процессов',
      meta: [
        {
          name: 'description',
          content:
            'Новости от TransTechSystem - система автоматизации логистических процессов 🚚 Информация для грузоперевозчиков, грузоотправителей, экспедиторов'
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
@import '~/static/scss/index/all-news.scss';
</style>
