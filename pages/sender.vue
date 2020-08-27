<template>
  <v-content>
    <Loading :state="loading" />
    <div class="head one-button">
      <img
        v-if="!mobile"
        id="back"
        :src="$imgSrc(`sender/background${mobile ? '-mob' : ''}.png`)"
        alt=""
      />
      <div v-if="mobile" id="back-div"></div>
      <div id="left"></div>
      <img
        v-if="!mobile"
        id="truck"
        class="-sender"
        :src="$imgSrc(`${route}/back.png`)"
        alt=""
      />
      <article class="banner d-flex flex-column">
        <div id="top" class="h1">система автоматизации</div>
        <div class="h1">логистических процессов<br />для грузоотправителя</div>
        <div id="bottom">
          Комплексное решение для Вашего бизнеса у Вас в кармане
        </div>
      </article>
    </div>
    <div class="map d-flex">
      <div class="criterio d-flex flex-column">
        <div class="h1">поиск перевозчика</div>
        <div :key="goal" class="tab-form d-flex flex-column align-center">
          <div class="search-bar-container">
            <m-input
              ref="load"
              :prepend="true"
              placeholder="Загрузка/Откуда"
              :autocomplete="true"
              :result="addressesLoad"
              :input-value="
                $isEmpty(obj.routes.from) ? '' : obj.routes.from[0].title
              "
              @input="startAutocomplete($event, 'load')"
              @click="(val) => chooseRoute('load', val)"
            >
              <template #prepend>
                <img :src="$imgSrc('icons/pin.svg')" alt="" />
              </template>
            </m-input>
            <m-input
              ref="unload"
              :prepend="true"
              placeholder="Выгрузка/Куда"
              :autocomplete="true"
              :result="addressesUnload"
              :input-value="
                $isEmpty(obj.routes.to) ? '' : obj.routes.to[0].title
              "
              @input="startAutocomplete($event, 'unload')"
              @click="(val) => chooseRoute('unload', val)"
            >
              <template #prepend>
                <img :src="$imgSrc('icons/pin.svg')" alt="" />
              </template>
            </m-input>
            <div id="carrying" class="bordered d-flex align-center">
              <span>Масса, т</span>
              <div class="inputs d-flex align-center ml-auto">
                <span>от</span>
                <m-input
                  :digit="true"
                  :flat="true"
                  border="transparent"
                  name="gte"
                  :input-value="obj.carrying.gte"
                  input-style="padding-left:3px"
                  @input="($event) => (obj.carrying.gte = $event.target.value)"
                ></m-input>
                <span>до</span>
                <m-input
                  :digit="true"
                  :flat="true"
                  name="lte"
                  border="transparent"
                  input-style="padding-left:3px"
                  :input-value="obj.carrying.lte"
                  @input="($event) => (obj.carrying.lte = $event.target.value)"
                ></m-input>
              </div>
            </div>
            <div id="carVolume" class="bordered d-flex align-center">
              <span>Объём, м³</span>
              <div class="inputs d-flex align-center ml-auto">
                <span>от</span>
                <m-input
                  :digit="true"
                  :flat="true"
                  border="transparent"
                  input-style="padding-left:3px"
                  name="gte"
                  :input-value="obj.carVolume.gte"
                  @input="($event) => (obj.carVolume.gte = $event.target.value)"
                ></m-input>
                <span>до</span>
                <m-input
                  :digit="true"
                  :flat="true"
                  name="lte"
                  input-style="padding-left:3px"
                  border="transparent"
                  :input-value="obj.carVolume.lte"
                  @input="($event) => (obj.carVolume.lte = $event.target.value)"
                ></m-input>
              </div>
            </div>
            <m-select
              placeholder="Тип кузова"
              options-mode="multi"
              :options="sorted(bodyTypeValues)"
              name="bodyTypes"
              @change="multiselect"
            ></m-select>
            <div class="datepickers">
              <datepicker
                id="dateFrom"
                v-model="calendarFrom"
                :lang="lang"
                :editable="false"
                :clearable="true"
                placeholder="Дата с"
                format="DD.MM.YYYY"
                title-format="DD.MM.YYYY"
                input-class="c-input"
                @clear="clearDate('dateFrom')"
              >
              </datepicker>
              <datepicker
                v-model="calendarBy"
                :lang="lang"
                :editable="false"
                :clearable="true"
                placeholder="Дата по"
                format="DD.MM.YYYY"
                title-format="DD.MM.YYYY"
                input-class="c-input"
                @clear="clearDate('dateBy')"
              >
              </datepicker>
            </div>
            <div class="find-button d-flex justify-center">
              <m-button
                class="button"
                shade="blue"
                :disabled="disabled"
                @click.native="search"
                >найти</m-button
              >
            </div>
          </div>
        </div>
      </div>
      <div id="find-back"></div>
      <div class="map-frame">
        <Loading
          :state="mapLoading"
          :absolute="true"
          :max-width="`${mobile ? '100%' : '60%'}`"
          :z-index="1"
        />
        <div class="google-map"></div>
      </div>
    </div>
    <div class="profit simple m-section flex-column">
      <div class="h1">наши преимущества</div>
      <div class="items">
        <div class="a-item">
          <img :src="$imgSrc('icons/index/map.svg')" class="img" alt="" />
          <div class="h3">Карта поиска</div>
          <p>
            Хотите быстро оценить наличие авто\груз, Увидеть место расположение,
            прикинуть или рассчитать стоит ли Вам переехать для одной или другой
            загрузок? Карта поиска позволит Вам наглядно увидеть количество
            существующего груза в Нашей системе и ускорить время принятии
            решения
          </p>
        </div>
        <div class="a-item">
          <img :src="$imgSrc('icons/index/doc.svg')" class="img" alt="" />
          <div class="h3">Электронный документооборот</div>
          <p>
            В 21 веке очень много сил, денег и Времени тратиться на бумажную
            работу, мы внедрили Электронный документооборот который поможет с
            экономить время, ускорить передачу документов и обезопасит от
            «Потерь» не которых экземпляров, что в свою очередь ускорит срок
            оплат
          </p>
        </div>
        <div class="a-item">
          <img :src="$imgSrc('icons/index/tablet.svg')" class="img" alt="" />
          <div class="h3">Наличие Дозволов</div>
          <p>
            Контроль остатка, наличие и возможность купить\забронировать дозвол
            Онлайн – экономит время и дает возможность быстро принимать решение
          </p>
        </div>
      </div>
    </div>
    <div class="cabinet-profit d-flex">
      <img :src="$imgSrc(`back-pic${mobile ? '-mob' : ''}.png`)" alt="" />
      <div class="cabinet-profit-content d-flex flex-column">
        <div class="h1">ПЕРСОНАЛИЗАЦИЯ ВАШЕГО ЛИЧНОГО КАБИНЕТА</div>
        <p>
          Используя систему в работе, Вы можете персонализировать и
          верифицировать свою компанию, добавить сотрудников которые смогут
          искать и добавлять заявке, Вы сможете проконтролировать и даже
          поставить задачу, в какой срок и что нужно сделать, так же для
          удобства не нужно перепрыгивать в сторонние мессенджеры, а общайтесь
          здесь, получайте предложение, торгуйтесь, общайтесь с новыми или
          постоянными клиентам. Это и много другое позволит качественно, удобно
          и быстро выполнять поставленные цели.
        </p>
        <div class="swiper-area d-flex">
          <client-only>
            <swiper :options="cabinetOptions">
              <swiper-slide>
                <img
                  class="slider-img"
                  :src="$imgSrc(`slide-4${mobile ? '-mob' : ''}.png`)"
                  alt=""
                />
              </swiper-slide>
              <swiper-slide>
                <img
                  class="slider-img"
                  :src="$imgSrc(`slide-1${mobile ? '-mob' : ''}.png`)"
                  alt=""
                />
              </swiper-slide>
              <swiper-slide>
                <img
                  class="slider-img"
                  :src="$imgSrc(`slide-3${mobile ? '-mob' : ''}.png`)"
                  alt=""
                />
              </swiper-slide>
              <swiper-slide>
                <img
                  class="slider-img"
                  :src="$imgSrc(`slide-2${mobile ? '-mob' : ''}.png`)"
                  alt=""
                />
              </swiper-slide>
            </swiper>
          </client-only>
          <div class="swiper-pagination-cabinet"></div>
        </div>
      </div>
    </div>
    <div class="easy m-section d-flex flex-column">
      <div class="h1">с transtech system все просто</div>
      <div class="islands">
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-9.svg')" class="img" alt="" />
          <p>Зарегистрируй<br />копанию в дав клика</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-8.svg')" class="img" alt="" />
          <p>Верифицируй<br />аккаунт</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-7.svg')" class="img" alt="" />
          <p>Добавь<br />сотрудника</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-6.svg')" class="img" alt="" />
          <p>Создай заявку,<br />сохрани в шаблон</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-5.svg')" class="img" alt="" />
          <p>Получи предложение<br />по цене</p>
        </div>
        <template v-if="mobile">
          <div class="island d-flex flex-column align-center">
            <img :src="$imgSrc('icons/easy/icon-4.svg')" class="img" alt="" />
            <p>Выбери<br />наилучшие условия</p>
          </div>
          <div class="island d-flex flex-column align-center">
            <img :src="$imgSrc('icons/easy/icon-3.svg')" class="img" alt="" />
            <p>Подтверди<br />сделку</p>
          </div>
          <div class="island d-flex flex-column align-center">
            <img :src="$imgSrc('icons/easy/icon-2.svg')" class="img" alt="" />
            <p>Контролируй<br />перемещение груза</p>
          </div>
          <div class="island d-flex flex-column align-center">
            <img :src="$imgSrc('icons/easy/icon-1.svg')" class="img" alt="" />
            <p>Закрой сделку и<br />получи\оставь отзыв</p>
          </div>
          <div class="island d-flex flex-column align-center">
            <img :src="$imgSrc('icons/easy/icon.svg')" class="img" alt="" />
            <p>Повысь рейтинг и<br />доверие к компании</p>
          </div>
        </template>
      </div>
      <div v-if="!mobile" class="islands">
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-4.svg')" class="img" alt="" />
          <p>Выбери<br />наилучшие условия</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-3.svg')" class="img" alt="" />
          <p>Подтверди<br />сделку</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-2.svg')" class="img" alt="" />
          <p>Контролируй<br />перемещение груза</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon-1.svg')" class="img" alt="" />
          <p>Закрой сделку и<br />получи\оставь отзыв</p>
        </div>
        <div class="island d-flex flex-column align-center">
          <img :src="$imgSrc('icons/easy/icon.svg')" class="img" alt="" />
          <p>Повысь рейтинг и<br />доверие к компании</p>
        </div>
      </div>
    </div>
    <div class="about-us section m-section">
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
      </div>
      <div class="video">
        <img
          id="tablet"
          :src="$imgSrc(`device${mobile ? '-mob' : ''}.png`)"
          alt=""
        />
      </div>
    </div>
    <div class="m-section information-section d-flex flex-column">
      <h1>
        система контроля<br v-if="mobile" />
        для грузовладельца
      </h1>
      <div class="article d-flex flex-column">
        <div class="article-container">
          <div class="article-text">
            <p>
              Ежедневно может возникнуть необходимость перевозить груз с одной
              точки в другую. Доставка груза внутри страны &nbsp;могут быть
              выполнены своими силами или воспользовавшись услугами
              специалистов.
            </p>
            <p>
              Поиск перевозчика довольно хлопотное дело, которое требует затрат
              времени и сил. К тому же цена такого рода услуг обычно не радует
              своей доступностью. Воспользовавшись нашим сервисом, каждый
              грузовладелец может существенно не только сэкономить свои деньги,
              но и время.
            </p>
            <h2>Где найти перевозчика груза?</h2>
            <p>
              TransTechSystem &mdash; это сервис, с помощью которого можно
              быстро выполнить поиск перевозчика груза, указав требования к виду
              транспорта и стоимости услуги. Платформа также предлагает найти
              грузоперевозчика, который предоставляет услугу доставки сборного
              груза. Воспользовавшись функционалом сервиса, можно организовать
              перевозку как крупногабаритного, так и небольшого груза по
              территории нашей страны.
            </p>
            <p>
              Благодаря качественному отлаженному комплексу услуг, которые
              касаются грузоперевозок, крупные и мелкие компании могут улучшить
              эффективность своей работы. Доставки осуществляются четко в срок,
              поэтому производство может рассчитывать на непрерывную работу.
            </p>
            <p>
              Важным нюансом является то, что сервисом могут воспользоваться не
              только предприниматели, но и частные лица, которым нужно
              организовать транспортировку своего груза. В огромном списке
              предложений на сервисе можно найти наиболее приемлемый для себя
              вариант услуги. Выполнить поиск груза или транспорта можно,
              воспользовавшись фильтром. Также можно получить информативную
              поддержку от онлайн-специалиста.
            </p>
            <p>
              Чтобы перевозка была выполнена с учетом требований владельца
              груза, следует заранее обговорить дату транспортировки, пункт
              загрузки и выгрузки, объем и вес груза.
            </p>
            <p>
              Сайт поиска перевозчиков предоставляет автовладельцам возможность
              хорошо заработать. Для этого достаточно разместить заявку на
              ресурсе. Для этого, прежде всего, необходимо зарегистрироваться,
              указав анкетные данные, которые затребует форма регистрации.
              Особенно важно указать подробную информацию о транспортном
              средстве, которое будет использовано для перевозки груза. Так,
              можно заинтересовать грузовладельца, воспользоваться услугами
              именно вашего автомобиля.
            </p>
            <p>
              После прохождения этапа регистрации нужно заполнить анкету. Для
              этого необходимо указать:
            </p>
            <ul>
              <li>фамилию, имя и отчество водителя транспортного средства;</li>
              <li>
                марку автомобиля, на котором будет осуществляться
                транспортировка груза;
              </li>
              <li>грузоподъемность авто.</li>
            </ul>
            <p>
              Такая информация позволит заказчику ознакомиться с данными о
              грузоперевозчике и выбрать наиболее подходящий для себя вариант
              заявки. А автовладелец, проводя поиск перевозчиков, сможет намного
              быстрее найти заказ и приступить к его выполнению. Стоимость
              перевозки обсуждается непосредственно с заказчиком.
            </p>
            <p>
              Распределяя груз, важно учитывать его вес и объем. Большие и
              тяжелые изделия ставят на низ, а сверху них размещают
              малогабаритные, легкие и хрупкие. Для безопасности груз следует
              фиксировать специальными ремнями. На сервисе можно оставлять
              отзывы о работе грузоперевозчиков.
            </p>
          </div>
        </div>
        <div
          class="article-header d-flex align-center pointer"
          @click="showMore"
        >
          <b>читать далее</b
          ><img :src="$imgSrc('icons/select-white.svg')" alt="" />
        </div>
      </div>
    </div>
  </v-content>
</template>

<script>
import roleLanding from '~/mixins/roleLanding.js';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import indexPages from '~/mixins/indexPages.js';

export default {
  mixins: [roleLanding, hideMobileMenu, indexPages],
  data() {
    return {
      bodyTypeValues: [],
      collection: 'car',
      goal: 'car',
      car: {
        bodyTypes: [],
        routes: {
          from: [],
          to: []
        },
        carrying: {
          gte: '',
          lte: ''
        },
        carVolume: {
          gte: '',
          lte: ''
        },
        loadingTimeByCalendar: {
          dateFrom: '',
          dateBy: ''
        },
        sorting: {
          date: 'ASC',
          payment: 'DESC',
          body: 'DESC'
        }
      }
    };
  },
  async mounted() {
    try {
      const b = await this.$claim.get('body_types');
      [...this.bodyTypeValues] = b;
    } catch (e) {
      this.$errorHandle(e);
    }
  },
  head() {
    return {
      title:
        'Грузоперевозки: Поиск транспорта для перевозки груза, найти машину для перевозки',
      meta: [
        {
          name: 'description',
          content:
            'Быстрый поиск перевозчиков грузов 🚚 Поиск транспорта для перевозки грузов онлайн ✔️ Грузоперевозки по Украине и международные 👍🏼 Система автоматизации логистических процессов для грузоотправителя TransTechSystem'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/index-role.scss';
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
