<template>
  <v-content>
    <Loading :state="loading" />
    <div class="head one-button carrier">
      <img
        v-if="!mobile"
        id="back"
        :src="$imgSrc(`carrier/background${mobile ? '-mob' : ''}.png`)"
        alt=""
      />
      <div v-if="mobile" id="back-div"></div>
      <div id="left"></div>
      <img
        v-if="!mobile"
        id="truck"
        class="-carrier"
        :src="$imgSrc(`${route}/back.png`)"
        alt=""
      />
      <article class="banner d-flex flex-column">
        <div id="top" class="h1">система автоматизации</div>
        <div class="h1">логистических процессов<br />для грузоперевозчика</div>
        <div id="bottom">
          Комплексное решение для Вашего бизнеса у Вас в кармане
        </div>
      </article>
    </div>
    <div class="map d-flex">
      <div class="criterio d-flex flex-column">
        <div :key="goal" class="tab-form d-flex flex-column align-center">
          <div class="search-bar-container">
            <div class="h1">поиск груза</div>
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
          <img :src="$imgSrc('icons/index/shield.svg')" class="img" />
          <div class="h3">Надежность контрагента</div>
          <p>
            Проверяй и заключай сделки только с надежными автоперевозчиками и
            экспедиторами. Не нужно искать всю информацию о компании в интернете
            и через знакомых, наша 3 ступенчатая верификация позволит отобрать
            лучшего и надежного партнера для заключение контракта и развития
            долгосрочных бизнес отношений.
          </p>
        </div>
        <div class="a-item">
          <img :src="$imgSrc('icons/index/tablet.svg')" class="img" />
          <div class="h3">Управляй своими заявками</div>
          <p>
            Создавай, редактируй, сохраняй в шаблоны, добавляй водителя и
            автомобиль просматривай историю и собирай статистику, не трать время
            на ручное заполнение документов и ожидание подписи от бухгалтерии.
            Все что нужно сделать – это создать и ожидать самого выгодного по
            цене\срокам предложение, подтвердись и отслеживай свой груз.
          </p>
        </div>
        <div class="a-item">
          <img :src="$imgSrc('icons/index/person.svg')" class="img" />
          <div class="h3">Общайся<br />не выходя из системы</div>
          <p>
            Мы внедрили онлайн чат прям в систему, теперь ни одни контакт не
            останется незамеченным, заключайте сделки, получайте доп информацию,
            обменивайтесь документами и все это онлайн
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
        для грузоперевозчика
      </h1>
      <div class="article d-flex flex-column">
        <div class="article-container">
          <div class="article-text">
            <p>
              Чтобы бизнес, связанный с транспортировкой товаров, процветал и
              приносил доход, его владелец должен ежедневно решать большое число
              вопрос. Одной из самых важных проблем такого человека является
              поиск грузов для перевозки.
            </p>
            <p>
              Если пытаться самостоятельно искать клиентов и не обращаться к
              услугам специалистов, то рентабельность бизнеса может резко
              ухудшиться. Не многие заказчики знают обо всех подводных камнях,
              которые встречаются в работе владельца автотранспорта. Ведь ему
              приходится каждый раз ломать голову над тем, как найти выгодный
              груз, как разработать максимально выгодный маршрут, где найти
              попутный груз и т.д.
            </p>
            <p>
              Для того чтобы избавить себя от лишних трудностей, перевозчику
              стоит сотрудничать с эффективной службой организации перевозок.
              Сотрудники таких компаний позволяют разработать максимально
              правильную нагрузку транспорта, сократить часы простоя и снизить
              риск &laquo;холостых&raquo; поездок. Кроме того, такая служба
              решает задачу с расширением базы клиентов, создает
              заинтересованность клиентов в дальнейшем сотрудничестве. Благодаря
              такому подходу к организации перевозки грузов решается главная
              проблема автоперевозчика &minus; стабилизируется спрос на услугу.
            </p>
            <p>
              Если автоперевозчик выполнил основной заказ и отвез груз в пункт
              назначения и по дороге обратно автомобиль едет пустым, значит он
              вынужден лишить себя возможной прибыли. Если такие ситуации
              случаются не редко, вопрос прибыльности бизнеса станет под угрозу
              и, как следствие, владелец автотранспорта станет банкротом.
              Грузоперевозчики, которые не хотят лишиться дохода, должны
              серьезно подойти к решению задачи по организации поиска грузов для
              перевозок.
            </p>
            <p>
              Наш ресурс дает возможность быстро, легко и доступно найти заказы
              на грузоперевозки в Украине. Интерфейс сайта очень простой, потому
              сориентироваться на нем сможет даже новичок. База заказов от
              клиентов регулярно обновляется, поэтому каждый грузоперевозчик
              может найти для себя выгодное предложение. Каждый день ресурсом
              пользуются тысячи грузовладельцев, желающих оперативно решить
              вопрос транспортировки своего товара.
            </p>
            <h2>
              Поиск грузов для перевозки по городу, и для перевозки по стране
            </h2>
            <p>
              Чтобы грузовладелец смог быстро найти грузоперевозчика, компания
              TransTechSystem разработала эффективный международный транспортный
              портал. На ресурсе представлена доступная база с заявками, где
              представлены грузы для перевозки и предложения от
              грузоперевозчиков. Контакты обеих сторон открыты, поэтому каждый
              желающий может начать вести переговоры на прямую. Благодаря этому
              заказ на перевозку груза в пределах государства может быть быстро
              выполнен.
            </p>
            <p>
              Найти груз для перевозки на портале очень просто. Для этого
              достаточно воспользоваться одним из комфортных для
              грузоперевозчика способом. А желающие увеличить шансы на получение
              заказа могут воспользоваться всеми возможными способами.
            </p>
            <p>
              Для поиска груза в пределах государства можно воспользоваться
              одним из таких способов:
            </p>
            <ol>
              <li>
                Изучить заявку от владельца груза, размещенную на сайте. Чтобы
                это сделать, необходимо зайти в раздел &laquo;Груз по
                стране&raquo;. После перед грузоперевозчиком будут представлены
                заявки от грузоотправителей. Просмотрев все предложения, можно
                выбрать то, которое более всего подходит грузовладельцу. Чтобы
                связаться с заказчиком, необходимо открыть данные с его
                контактами.
              </li>
              <li>
                Разместить заявку на грузоперевозку в пределах страны. Когда
                среди списка существующих заявок от грузоотправителей
                автоперевозчик не нашел подходящего варианта, он может сам
                создать заявку. Для этого необходимо перейти в раздел
                &laquo;Добавить транспорт&raquo; и разместить свою личную
                заявку. В форме нужно указать вид перевозки, тип автомобиля, его
                грузоподъемность, объем грузового отсека, желаемый маршрут,
                интервал времени. Также важно не забыть указать несколько
                каналов связи, чтобы грузовладельцу было проще с вами связаться.
                После размещения заявки останется лишь немного подождать, когда
                грузовладелец с вами свяжется.
              </li>
            </ol>
            <p>
              Каждый профессиональный водитель знает, что на сегодняшний день
              спросом пользуются односторонний и сборной грузы. Чтобы услуга
              автоперевозки была достойно оплачена, автовладельцу необходимо
              заранее продумать маршрут, учесть состояние дорожного покрытия на
              выбранном участке дороги, объем перевозимой продукции, оговорить
              способ расчета. Если подход к планированию грузоперевозки для
              водителя правильный, значит шанс высокой рентабельности возрастет.
            </p>
            <p>
              Программы для поиска грузов дают возможность водителям снизить
              расходы на оплату заработной платы дополнительных сотрудников,
              которые занимаются поиском клиентов и организацией теоретических
              вопросов перевозки. Благодаря этому владелец бизнеса, связанного с
              грузоперевозками, может увеличить свой доход на 20-30 %.
              Воспользовавшись фильтром поиска заявок на сайте, можно найти
              нужный вариант гораздо быстрее. Формируя правильный график
              поездки, можно сократить свое время и расходы. Так, разместив
              заявку с предложением о грузоперевозке, автовладелец сможет
              заниматься своими делами, ожидая, когда заказчик сам свяжется с
              ним.
            </p>
            <h2>Где найти?</h2>
            <p>
              Чтобы пользователям биржи можно было быстрее и проще находить
              подходящие заявки, разработчики сайта позаботились об интуитивном
              интерфейсе и наличии удобной мобильной версии ресурса. Так, зайти
              на биржу можно с любого портативного устройства, которое имеет
              доступ к интернету. Сегодня каждый грузоперевозчик и
              грузоотправитель могут быстро ознакомиться с выгодными для себя
              предложениями и выбрать самые лучшие.
            </p>
            <p>
              В случае необходимости каждый гость биржи может воспользоваться
              профессиональной консультацией от менеджера сайта, получить ответ
              на интересующий вопрос или заказать нужную услугу. Благодаря
              нашему сайту перевозчики и экспедиторы могут организовать
              систематизированную работу, быстро предложить автотранспорт для
              выбранной заявки на транспортировку попутного или сборного груза.
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
      packages: [],
      bodyTypeValues: [],
      goal: 'cargo',
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
      const b = await this.$claim.get('packages');
      [...this.packages] = b;
    } catch (e) {
      this.$errorHandle(e);
    }
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
        'Грузы: Поиск грузов для грузоперевозки по Украине, СНГ и Европе на сайте',
      meta: [
        {
          name: 'description',
          content:
            'Поиск грузов и догрузов по Украине, всей территории СНГ и Европе 🚚 Подбор предложения для грузоперевозки онлайн - найти свободный груз для перевозки по любым внутренним и международным маршрутам ✔️ Система автоматизации логистических процессов для грузоперевозчика'
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
