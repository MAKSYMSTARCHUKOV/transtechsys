<router>
  {
    name:'main'
  }
</router>
<template>
  <v-content>
    <Loading :state="loading" />
    <div class="head">
      <img
        v-if="!mobile"
        id="back"
        :src="$imgSrc(`back${mobile ? '-mob' : ''}.png`)"
        alt=""
      />
      <div v-if="mobile" id="back-div"></div>
      <div id="left"></div>
      <img v-if="!mobile" id="truck" :src="$imgSrc('truck.png')" alt="" />
      <article class="banner d-flex flex-column">
        <div id="top">новое поколение</div>
        <div class="h1">транспортной биржи</div>
        <h1 id="bottom">
          Система автоматизации логистических процессов
        </h1>
        <div class="buttons d-flex mt-auto w-100">
          <m-button m-style="white" @click.native="location('cargo')"
            >поиск ГРУЗа</m-button
          >
          <m-button @click.native="location('car')">поиск авто</m-button>
        </div>
      </article>
    </div>
    <div class="m-section count">
      <div class="h1">мы в цифрах</div>
      <div class="square d-flex flex-column align-center justify-center">
        <div class="h3">500</div>
        <div class="overview">Онлайн пользователей</div>
      </div>
      <div class="square d-flex flex-column align-center justify-center">
        <div class="h3">2&nbsp;000</div>
        <div class="overview">Заявок на транспорт</div>
      </div>
      <div class="square d-flex flex-column align-center justify-center">
        <div class="h3">1&nbsp;500</div>
        <div class="overview">Заявок на груз</div>
      </div>
      <div class="square d-flex flex-column align-center justify-center">
        <div class="h3">800</div>
        <div class="overview">Успешных сделок</div>
      </div>
    </div>
    <div class="information m-section">
      <div id="rect"></div>
      <div class="background">
        <div class="dim"></div>
        <div class="h1">грузоотправителям</div>
        <div class="info-text">
          В Век диджитализации и информационных технология, наша команда
          постаралась вместить в программу все нужные инструменты для достижение
          желаемого результат в кратчайшие сроки с минимальными потерями
        </div>
        <nuxt-link :to="{ name: 'sender' }" class="w-100 d-flex justify-center">
          <m-button>подробнее</m-button>
        </nuxt-link>
      </div>
      <div class="background">
        <div class="dim"></div>
        <div class="h1">экспедиторам</div>
        <div class="info-text">
          Новый инструмент позволит Вам использовать все Ваши навыки в одном
          месте, не прибегая к использованию стороннего софта или рук. Экономьте
          время и деньги
        </div>
        <nuxt-link
          :to="{ name: 'expeditor' }"
          class="w-100 d-flex justify-center"
        >
          <m-button>подробнее</m-button>
        </nuxt-link>
      </div>
      <div class="background">
        <div class="dim"></div>
        <div class="h1">грузооперевозчикам</div>
        <div class="info-text">
          Собрать проверенных заказчиков, быть уверенным в контрагенте и
          постоянно иметь работу которая позволяет не проставить авто парку,
          вести подсчеты, узнавать цены, проверять наличие дозволов, команда TTS
          сделал это возможным в одном, доступном инструменте
        </div>
        <nuxt-link
          :to="{ name: 'carrier' }"
          class="w-100 d-flex justify-center"
        >
          <m-button>подробнее</m-button>
        </nuxt-link>
      </div>
    </div>
    <div class="profit m-section flex-column">
      <div class="h1">наши преимущества</div>
      <client-only>
        <swiper :options="profitOptions">
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/shield.svg')" alt="" />
              <div class="h3">Надежность контрагента</div>
              <div class="overview">
                Проверяй и заключай сделки только с надежными автоперевозчиками
                и экспедиторами. Не нужно искать всю информацию о компании в
                интернете и через знакомых, наша 3 ступенчатая верификация
                позволит отобрать лучшего и надежного партнера для заключение
                контракта и развития долгосрочных бизнес отношений.
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/tablet.svg')" alt="" />
              <div class="h3">Управляй своими заявками</div>
              <div class="overview">
                Создавай, редактируй, сохраняй в шаблоны, добавляй водителя и
                автомобиль просматривай историю и собирай статистику, не трать
                время на ручное заполнение документов и ожидание подписи от
                бухгалтерии. Все что нужно сделать – это создать и ожидать
                самого выгодного по цене\срокам предложение, подтвердись и
                отслеживай свой груз.
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/person.svg')" alt="" />
              <div class="h3">Общайся не выходя из системы</div>
              <div class="overview">
                Мы внедрили онлайн чат прям в систему, теперь ни одни контакт не
                останется незамеченным, заключайте сделки, получайте доп
                информацию, обменивайтесь документами и все это онлайн
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/envelop.svg')" alt="" />
              <div class="h3">Уведомления и рассылки</div>
              <div class="overview">
                Вы никогда не пропустите последние новости, увидите предложение
                от контрагентов, не пропустите важные сообщения и сможете
                отследить кто и когда поднял Вашу компанию в Топ и много другое.
                Мы позаботились что бы Вы всегда были в курсе всех изменений на
                рынке
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/graf.svg')" alt="" />
              <div class="h3">
                Каталог компаний с мониторингом<br />(задолженность |
                банкротство)
              </div>
              <div class="overview">
                Не знаете что за контрагент, боитесь что оплата задержится или
                вовсе не поступит, хотите расширить круг контактов для работы,
                На каталог поможет Вам найти Проверенного контрагента,
                посмотреть его историю и оценить рейтинг который они
                зарабатывают работая в нашей системе
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/map.svg')" alt="" />
              <div class="h3">Карта поиска</div>
              <div class="overview">
                Хотите быстро оценить наличие авто\груз, Увидеть место
                расположение, прикинуть или рассчитать стоит ли Вам переехать
                для одной или другой загрузок? Карта поиска позволит Вам
                наглядно увидеть количество существующего груза в Нашей системе
                и ускорить время принятии решения
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/doc.svg')" alt="" />
              <div class="h3">Электронный документооборот</div>
              <div class="overview">
                В 21 веке очень много сил, денег и Времени тратиться на бумажную
                работу, мы внедрили Электронный документооборот который поможет
                с экономить время, ускорить передачу документов и обезопасит от
                «Потерь» не которых экземпляров, что в свою очередь ускорит срок
                оплат
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/index/tablet.svg')" alt="" />
              <div class="h3">Наличие Дозволов</div>
              <div class="overview">
                Контроль остатка, наличие и возможность купить\забронировать
                дозвол Онлайн – экономит время и дает возможность быстро
                принимать решение
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </client-only>
      <div v-if="$store.state.mobile" class="swiper-pagination"></div>
    </div>
    <div class="news m-section">
      <div class="h1">последние новости</div>
      <template v-for="(d, i) of news">
        <template v-if="$store.state.mobile">
          <div v-if="i < 2" :key="d.title" class="the-news">
            <div class="dim"></div>
            <div class="h2">{{ d.title }}</div>
            <nuxt-link
              :to="{ name: 'news-id', params: { id: d.id } }"
              class="more pointer"
              >читать ➜</nuxt-link
            >
          </div>
        </template>
        <template v-else>
          <div v-if="i < 4" :key="d.title" class="the-news">
            <div class="dim"></div>
            <div class="h2">{{ d.title }}</div>
            <template v-if="$store.state.tab">
              <nuxt-link
                :to="{ name: 'news-id', params: { id: d.id } }"
                class="more pointer"
                >читать ➜</nuxt-link
              >
            </template>
            <template v-else>
              <div v-if="i < 2" class="news-content">
                {{ aText(d.content) }}
              </div>
              <m-button
                v-if="i < 2"
                @click.native="
                  $router.push({ name: 'news-id', params: { id: d.id } })
                "
                >читать дальше</m-button
              >
              <nuxt-link
                v-if="i > 1"
                :to="{ name: 'news-id', params: { id: d.id } }"
                class="more pointer"
                >читать ➜</nuxt-link
              >
            </template>
          </div>
        </template>
      </template>
      <nuxt-link :to="{ name: 'news' }" class="all-news pointer"
        >все новости ➜</nuxt-link
      >
    </div>
    <div class="section about-us m-section">
      <div class="article">
        <div class="h1">о проекте</div>
        <div class="h3">Ваша логистика в Вашем кармане</div>
        <p class="overview">
          Ваша Логистика в Вашем кармане это инструмент который позволит в
          кратчайшие сроки, не используя длинную цепочку сторонних приложений,
          достичь желаемого результат, загрузить машину или найти исполнителя на
          Ваш груз, поставить задачу и проконтролировать ход ее выполнения,
          оценить работу сотрудника, сократить время используя электронный
          документооборот, узнать все подробности контрагента с которым
          сотрудничаете, а главное проконтролировать местоположение Вашего груза
          от места загрузки, до места выгрузки.
        </p>
        <div class="m-buttons">
          <m-button
            v-if="!$store.getters.logged"
            shade="blue"
            @click.native="register"
            >регистрация</m-button
          >
          <m-button
            shade="blue"
            m-style="white"
            @click.native="$router.push({ name: 'about-us' })"
            >о нас</m-button
          >
        </div>
      </div>
      <div class="video">
        <img
          id="tablet"
          :src="$imgSrc(`device${mobile ? '-mob' : ''}.png`)"
          alt=""
        />
      </div>
    </div>
    <div class="chart m-section">
      <div class="h1">статистика грузооборота</div>
      <div class="count d-flex flex-column align-end">
        <div v-for="i in 9" :key="i" class="chart-item">
          {{ 104 - (i - 1) * 2 }}
        </div>
      </div>
      <div class="chart-bar"></div>
      <div class="month d-flex align-center justify-space-around">
        <template v-if="$store.state.tab || $store.state.mobile">
          <div class="chart-item">{{ $store.state.month[0] }}</div>
          <div class="dec d-flex align-center">
            <div class="img"></div>
          </div>
          <div class="chart-item">{{ $store.state.month[11] }}</div>
        </template>
        <template v-else>
          <div v-for="m of $store.state.month" :key="m" class="chart-item">
            {{ m }}
          </div>
        </template>
      </div>
    </div>
  </v-content>
</template>

<script>
import indexPages from '~/mixins/indexPages.js';

export default {
  mixins: [indexPages],
  async asyncData({ app, route, store }) {
    const deleteKey = route.query.deleteKey;
    let success = false;
    if (deleteKey) {
      try {
        await app.$company.delete(deleteKey);
        store.commit('setState', { logged: false });
        success = true;
      } catch (e) {
        app.$errorHandle(e);
      }
    }
    return {
      success
    };
  },
  data() {
    return {
      news: []
    };
  },
  beforeCreate() {
    const { ...q } = JSON.parse(JSON.stringify(this.$route.query));
    if (q.deleteKey) {
      delete q.deleteKey;
      if (this.success) {
        this.$localstorage.remove('keep-sign-in');
        this.$localstorage.remove('companyRole');
        this.$localstorage.remove('plan');
        this.$localstorage.remove('userRole');
        this.$localstorage.remove('email');
        this.$localstorage.remove('token');
        this.$localstorage.remove('refresh_token');
        this.$localstorage.remove('position');
      }
    }
    this.$router.push({ query: q });
  },
  async mounted() {
    let news = [];
    try {
      let b = await this.$blog.get(1, 4);
      const p = b.pagination;
      const total = p.totalCount;
      if (total <= 4) {
        [...news] = b.items;
      } else if (total > 4) {
        const div = total / 4;
        const abs = Math.floor(div);
        const pages = div > abs ? abs + 1 : abs;
        b = await this.$blog.get(pages, 4);
        let i = b.items;
        [...news] = i;
        if (div > abs) {
          b = await this.$blog.get(pages - 1, 4);
          i = b.news;
          for (let y = 3; news.length < 4; y--) {
            news.unshift(i[y]);
          }
        }
      }
      news.reverse();
    } catch (e) {
      this.$errorHandle(e);
    }
    [...this.news] = news;
  },
  methods: {
    toApp(route = undefined) {
      if (!this.logged) {
        if (route) {
          this.$router.replace({ query: { from: route } });
        }
        this.$nextTick(() => {
          this.loading = undefined;
          this.$store.commit('setOverlayMode', 'signin');
          this.$store.commit('setOverlayVisible', true);
        });
      } else if (this.logged) {
        this.$nuxt.$loading.start();
        this.$nextTick(() => {
          if (route) {
            this.$router.push(route);
          } else {
            this.$router.push('/cabinet');
          }
        });
      }
    },
    aText(content) {
      if (content.length > 125) {
        return `${content.substr(0, 125)}...`;
      }
      return content;
    },
    location(loc) {
      this.$nuxt.$loading.start();
      this.$router.push({
        name: `${this.$store.getters.logged ? 'cabinet-' : ''}find-${loc}`
      });
    }
  },
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
  head() {
    return {
      title:
        'Грузоперевозки по Украине, СНГ, Европе - онлайн сервис поиска перевозчиков и доставки грузов',
      meta: [
        {
          name: 'description',
          content:
            'Сервис поиска перевозчиков и грузов 🚚 Подбор транспорта для автоперевозок по Украине ✔️ Международные грузоперевозки, возможен догруз 👍🏼 Система автоматизации логистических процессов TransTechSystem'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/index.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';

.background,
.the-news {
  .m-button {
    .b {
      @include flow(0.1);
    }
  }
  &:hover {
    .m-button {
      .b {
        @include flow(0.1);
        background-color: $white !important;
        color: $black !important;
      }
    }
  }
}

.swiper-pagination {
  position: absolute;
  left: 0;
  width: 100%;
  @include my(20);
  &-cabinet {
    width: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 7px 7px 0 0;
    .swiper-pagination-bullet {
      background-color: $brand;
      opacity: 0.7;
      width: 7px;
      height: 7px;
      &-active {
        background-color: $brand;
        opacity: 1;
      }
      &:not(:last-child) {
        margin: 0 2px 0 0;
      }
    }
    @include tablet() {
      flex-direction: column;
      justify-content: center;
      margin: 0;
      .swiper-pagination-bullet {
        width: 15px;
        height: 15px;
        &:not(:last-child) {
          margin: 0 0 5px 0;
        }
      }
    }
  }
  .swiper-pagination-bullet {
    background-color: $white;
    opacity: 0.7;
    width: 15px;
    height: 15px;
    &-active {
      background-color: $white;
      opacity: 1;
    }
    &:not(:last-child) {
      margin-right: 5px;
    }
  }
}
</style>
