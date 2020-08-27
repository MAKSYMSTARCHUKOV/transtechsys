<template>
  <v-content>
    <Loading :state="loading" />
    <div class="head one-button">
      <img
        v-if="!mobile"
        id="back"
        :src="$imgSrc(`expeditor/background${mobile ? '-mob' : ''}.png`)"
        alt=""
      />
      <div v-if="mobile" id="back-div"></div>
      <div id="left"></div>
      <article class="banner d-flex flex-column">
        <div id="top" class="h1">система автоматизации</div>
        <div class="h1">логистических процессов<br />для экспедиторов</div>
        <div id="bottom">
          Комплексное решение для Вашего бизнеса у Вас в кармане
        </div>
      </article>
    </div>
    <div class="map d-flex">
      <div class="criterio d-flex flex-column">
        <div class="tabs">
          <m-tabs
            v-model="goal"
            :tabs="tabs"
            @click="(dir) => (goal = dir)"
          ></m-tabs>
        </div>
        <div
          v-if="goal === 'cargo'"
          :key="goal"
          class="tab-form d-flex flex-column align-center"
        >
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
                  :input-value="obj.cargoWeight.gte"
                  input-style="padding-left:3px"
                  @input="
                    ($event) => (obj.cargoWeight.gte = $event.target.value)
                  "
                ></m-input>
                <span>до</span>
                <m-input
                  :digit="true"
                  :flat="true"
                  name="lte"
                  border="transparent"
                  input-style="padding-left:3px"
                  :input-value="obj.cargoWeight.lte"
                  @input="
                    ($event) => (obj.cargoWeight.lte = $event.target.value)
                  "
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
                  :input-value="obj.cargoVolume.gte"
                  @input="
                    ($event) => (obj.cargoVolume.gte = $event.target.value)
                  "
                ></m-input>
                <span>до</span>
                <m-input
                  :digit="true"
                  :flat="true"
                  name="lte"
                  input-style="padding-left:3px"
                  border="transparent"
                  :input-value="obj.cargoVolume.lte"
                  @input="
                    ($event) => (obj.cargoVolume.lte = $event.target.value)
                  "
                ></m-input>
              </div>
            </div>
            <m-select
              placeholder="Упаковка"
              :options="sorted(packages)"
              name="cargoPackage"
              @change="select"
            ></m-select>
            <m-select
              placeholder="Тип транспорта"
              options-mode="multi"
              :options="sorted(bodyTypeValues)"
              name="bodyTypes"
              @change="multiselect"
            ></m-select>
            <div class="datepickers" style="grid-column: 1 / -1">
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
        <div
          v-if="goal === 'car'"
          :key="goal"
          class="tab-form d-flex flex-column align-center"
        >
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
          <img :src="$imgSrc('icons/index/person.svg')" class="img" alt="" />
          <div class="h3">Онлайн торг</div>
          <p>
            Наш продукт позволяет участвовать в реальных торгах, вы с легкостью
            можете отслеживать предложенные ставка от заинтересованных
            контрагентов и торговаться не тратя время на ожидание и долгие
            переговоры
          </p>
        </div>
        <div class="a-item">
          <img :src="$imgSrc('icons/index/envelop.svg')" class="img" alt="" />
          <div class="h3">Уведомления и рассылки</div>
          <p>
            Вы никогда не пропустите последние новости, увидите предложение от
            контрагентов, не пропустите важные сообщения и сможете отследить кто
            и когда поднял Вашу компанию в Топ и много другое. Мы позаботились
            что бы Вы всегда были в курсе всех изменений на рынке
          </p>
        </div>
        <div class="a-item">
          <img :src="$imgSrc('icons/index/graf.svg')" class="img" alt="" />
          <div class="h3">
            Каталог компаний с мониторингом<br />(задолженность | банкротство)
          </div>
          <p>
            Не знаете что за контрагент, боитесь что оплата задержится или вовсе
            не поступит, хотите расширить круг контактов для работы, На каталог
            поможет Вам найти Проверенного контрагента, посмотреть его историю и
            оценить рейтинг который они зарабатывают работая в нашей системе
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
        для <br v-if="!mobile" />транспортно<br v-if="mobile" />
        экспедиторской компании
      </h1>
      <div class="article d-flex flex-column">
        <div class="article-container">
          <div class="article-text">
            <p>
              Экспедитор собирает товарные отправления разных клиентов в одну
              партию и организует ее транспортировку силам единого перевозчика
              по воздуху или наземным путем. Затем он снова перераспределяет
              грузы и координирует доставку заказов клиентам-получателям.
            </p>
            <p>
              Чтобы точно все рассчитать и нигде не ошибиться, экспедитор
              затрачивает много личного времени и усилий. Тем не менее, никто не
              застрахован от случайностей и ошибок. Универсальная программа для
              экспедиторов помогает систематизировать учет, устранить недочеты и
              снизить всевозможные риски. Она значительно облегчает труд
              координатора, экономит время и повышает эффективность работы.
            </p>
            <p>
              Логистическая система управляет материальными потоками и
              информацией, чтобы наилучшим образом удовлетворять запросы
              клиентов и при этом минимизировать затраты. Специальная программа
              для экспедиторских компаний помогает соответствовать всем этим
              критериям. Программа от TransTechSystem отлично себя
              зарекомендовала и не обнаружила каких-либо слабых сторон. Без
              опаски можете использовать ее в вашем бизнесе &ndash; очень скоро
              вы убедитесь, что координация перевозок может быть гораздо более
              легкой и эффективной.
            </p>
            <h2>Возможности экспедиторского контроля и управления</h2>
            <p>
              Представляем краткий обзор возможностей экспедиторской системы
              учета. Они могут изменяться в зависимости от совокупности настроек
              программного продукта.
            </p>
            <ol>
              <li>
                Экспедиторская программа формирует единую базу клиентов и
                партнеров, составляет каталог перевозчиков и экспедиторов.
              </li>
              <li>
                Заявки на грузоперевозки создаются в автоматическом режиме,
                контроль их выполнения также автоматизирован.
              </li>
              <li>
                В экспедиторской программе можно вести учет работы со всеми
                контрагентами.
              </li>
              <li>
                Система классифицирует заявки согласно статусу и географическому
                положению (в программе предусмотрен актуальный справочник стран
                мира и населенных пунктов).
              </li>
              <li>
                Система координации и управления грузами может учитывать и
                обрабатывать неограниченный объем заявок.
              </li>
              <li>
                Программа предусматривает различия в политике перевозок и нюансы
                их осуществления.
              </li>
              <li>
                Система для составления и сдачи отчетности повышает не только
                эффективность работы, но и имидж компании. Кроме того, снижаются
                издержки на само ведение отчетности.
              </li>
              <li>
                Новые технологии оптимизируют функцию управления и помогают
                увеличить прибыль компании.
              </li>
              <li>
                Благодаря автоматизированным процессам улучшается организация на
                производстве, упрощается работа многих задействованных
                сотрудников.
              </li>
              <li>
                Появляются возможности повышения эффективности компании путем
                составления грамотных планов и мотивации сотрудников.
              </li>
              <li>
                Программа ведет и предоставляет экспедитору статистические
                данные по грузоперевозкам, включая воздушные и железнодорожные
                виды транспорта.
              </li>
            </ol>
            <h2>Как заказать экспедиторскую программу учета?</h2>
            <p>
              Чтобы заказать экспедиторскую программу от TransTechSystem,
              позвоните нам по номерам телефонов, которые указаны в контактных
              данных на сайте. При желании вы можете связаться с нами по
              электронной почте. Наши менеджеры ответят на все ваши вопросы по
              поводу экспедиторской программы, согласуют подходящую
              конфигурацию, предоставят все документы для подписания договора и
              оплаты.
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
      packages: [],
      goal: 'cargo',
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
      },
      cargo: {
        bodyTypes: [],
        cargoPackage: '',
        routes: {
          from: [],
          to: []
        },
        cargoWeight: {
          gte: '',
          lte: ''
        },
        cargoVolume: {
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
      },
      collection: 'cargo'
    };
  },
  async mounted() {
    try {
      const b = await this.$claim.get('body_types');
      [...this.bodyTypeValues] = b;
    } catch (e) {
      this.$errorHandle(e);
    }
    try {
      const b = await this.$claim.get('packages');
      [...this.packages] = b;
    } catch (e) {
      this.$errorHandle(e);
    }
  },
  head() {
    return {
      title: 'Система автоматизации логистических процессов для экспедиторов',
      meta: [
        {
          name: 'description',
          content:
            'Система автоматизации логистических процессов для экспедиторов transtechsys.eu 🚚 Онлайн заявки через сайт TransTechSystem'
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
