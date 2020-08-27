<template>
  <v-content>
    <Loading :state="loading" />
    <m-breadcrumps last="о нас"></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="section about-us">
      <div class="about-us-text d-flex flex-column justify-center">
        <h1>o transtech system</h1>
        <div class="h3">Ваша логистика в вашем кармане</div>
        <div class="article">
          <p>
            Компания <b class="brand">TransTechSystem</b> - это передовые
            технологии, команда специалистов высшего уровня, неугасаемым
            энтузиазмом и умением делать здесь и сейчас, технологии изменят мир
            к лучшему а мы являемся частью этих изменений.
          </p>
          <p>
            Наш многолетний опыт дает нам преимущество по сравнение с другими
            участниками рынка и мы не по наслышке знаем с какими трудностями
            порой сталкиваются как новички логистической отрасли так и старожили
            бизнеса.
          </p>
          <p>
            Компания разработала стратегию для многолетнего продвижение и
            усовершенствования логистической системы исходя из реалий рынка
            Украины, рынка Европы и мира в целом, мы четко пониманием что нужно
            изменить а что нужно оптимизировать.
          </p>
        </div>
      </div>
      <img :src="$imgSrc(`about${mobile ? '-mob' : ''}.png`)" alt="" />
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
    <div class="profit m-section flex-column">
      <div class="h1">наши преимущества</div>
      <client-only>
        <swiper :options="profitOptions">
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/brain.svg')" alt="" />
              <div class="h3">AI поиск</div>
              <div class="overview">
                Мы далеко шагнули в данном направление, теперь Вам не нужно
                искать, заказ находит Вас сам
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/map.svg')" alt="" />
              <div class="h3">Местоположение</div>
              <div class="overview">
                Знать где находится Ваш груз это очень важно, по этому наша
                команда сделал несколько способов отслеживания груза
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/shield.svg')" alt="" />
              <div class="h3">Надежность</div>
              <div class="overview">
                Все участники системы проходят модерацию и подтверждение, Вы
                можете быть уверены в своих контрагентах
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="profit-item d-flex flex-column w-100 align-center">
              <img :src="$imgSrc('icons/doc.svg')" alt="" />
              <div class="h3">Документооборот</div>
              <div class="overview">
                Мы постарались сделать так, чтобы бумажная работа ушла в
                забвение, не тратьте деньги и время на корреспонденцию
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </client-only>
      <div v-if="$store.state.mobile" class="swiper-pagination"></div>
    </div>
    <WriteUs></WriteUs>
  </v-content>
</template>

<script>
import WriteUs from '~/components/WriteUs.vue';
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  components: {
    WriteUs
  },
  mixins: [indexPagesUnregister],
  head() {
    return {
      title:
        'О нас: системы автоматизации логистических процессов TransTechSystem',
      meta: [
        {
          name: 'description',
          content:
            'Все о TransTechSystem - системе автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
@import '~/static/scss/index/about-us.scss';
@import '~/static/scss/index/profit.scss';
@import '~/static/scss/index/count.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';

.swiper-pagination {
  position: absolute;
  left: 0;
  width: 100%;
  margin-top: 20px;

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
