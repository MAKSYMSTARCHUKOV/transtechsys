<template>
  <div class="with-caption d-flex flex-column">
    <m-breadcrumps
      :last="
        item.title.length > 50
          ? item.title.substring(0, 47) + '...'
          : item.title
      "
      :middle="[{ name: 'news', title: 'новости' }]"
      :up="true"
    ></m-breadcrumps>
    <div v-if="!$isEmpty(item)" class="direct-news d-flex flex-column">
      <div
        class="img"
        :style="{
          backgroundImage: `url(/uploads/blog/${item.image})`
        }"
      ></div>
      <div class="news-content">
        <div class="news-content-header d-flex">
          <h1>{{ item.title }}</h1>
          <span class="published">{{
            new Date(item.created_at).toLocaleDateString()
          }}</span>
        </div>
        <div class="article" v-html="aText(item.content)"></div>
        <nuxt-link :to="{ name: 'news' }" class="read-more"
          >← НАЗАД К СТАТЬЯМ</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import indexPages from '~/mixins/indexPages.js';

export default {
  mixins: [indexPages],
  async asyncData({ app, route }) {
    let item = {};
    try {
      const i = await app.$blog.get(null, null, route.params.id);
      ({ ...item } = i);
    } catch (e) {
      app.$errorHandle(e);
    }
    return { item };
  },
  methods: {
    aText(content) {
      return `<p>${content.split(/\n\s*/).join('</p><p>')}</p>`;
    }
  },
  head() {
    return {
      title: `| ${this.$isEmpty(this.item) ? 'Статья' : this.item.title}`
    };
  }
};
</script>
<style lang="scss" scoped>
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
@import '~/static/scss/index/with-caption.scss';
@import '~/static/scss/index/direct-news.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
article {
  p {
    font-size: rem(16);
  }
}
</style>
