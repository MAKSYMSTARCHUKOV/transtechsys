<template>
  <section
    class="company-profile r-section white-background car-park"
    @click="unspawn($event)"
  >
    <client-only>
      <cool-lightbox
        :items="album"
        :index="index"
        :slideshow="false"
        :loop="false"
        @close="index = null"
      ></cool-lightbox>
    </client-only>
    <transition name="right">
      <form class="profile add-car">
        <h1>{{ add ? 'добавить в автопарк' : 'редактировать информацию' }}</h1>
        <div class="edit-data mb-8">
          <div class="edit-tabs">
            <div v-show="add" class="edit-tabs-tabs">
              <m-tabs
                v-model="currentTabAdd"
                :tabs="carPark"
                @mousedown="getDirection"
              ></m-tabs>
            </div>
            <transition
              class="edit-tabs-forms"
              mode="out-in"
              :name="direction"
              appear
            >
              <div
                :key="currentTabAdd"
                class="edit-tabs-forms-form d-flex flex-column"
              >
                <div
                  class="edit-tabs-forms-form-inputs"
                  :class="{
                    'first-vehicle': firstVehicle,
                    'second-vehicle': !firstVehicle
                  }"
                >
                  <div class="role-input d-flex">
                    <m-input
                      name="number"
                      class="w-100"
                      placeholder="Гос номер"
                      :input-value="vehicle.number"
                      :required="true"
                      @input="findCar"
                    ></m-input>
                  </div>
                  <div class="role-input d-flex">
                    <m-select
                      placeholder="Марка"
                      :required="true"
                      :options="brands"
                      :disabled="disabled"
                      name="brand"
                      value-mode="object"
                      :selected="vehicleSelected('brand')"
                      @change="brandSelected"
                    ></m-select>
                  </div>
                  <div class="role-input d-flex">
                    <m-select
                      placeholder="Модель"
                      :required="true"
                      :options="models"
                      value-mode="object"
                      name="model"
                      :disabled="modelDisabled"
                      :selected="selectedBrand"
                      @change="(e, val) => (vehicle.model = val.title)"
                    ></m-select>
                  </div>
                  <div v-if="firstVehicle" class="role-input d-flex">
                    <m-select
                      placeholder="Euro"
                      :required="true"
                      name="euro"
                      :options="euro"
                      value-mode="object"
                      :selected="vehicleSelected('euro')"
                      @change="(e, val) => (vehicle.euro = val.value)"
                    ></m-select>
                  </div>
                  <div class="role-input d-flex">
                    <m-input
                      class="w-100"
                      placeholder="Год выпуска"
                      data-validate="year"
                      name="year"
                      :disabled="disabled"
                      :input-value="vehicle.year"
                      @input="vehicle.year = $event.target.value"
                    ></m-input>
                  </div>
                  <div class="role-input d-flex">
                    <m-input
                      class="w-100"
                      placeholder="VIN"
                      data-validate="vin"
                      name="vin"
                      :disabled="disabled"
                      :input-value="vehicle.vin"
                      @input="vehicle.vin = $event.target.value.toUpperCase()"
                    ></m-input>
                  </div>
                </div>
                <div class="edit-tabs-forms-form-checks mt-2 mb-2">
                  <label class="m-checkbox d-flex pointer align-center">
                    <input
                      v-if="vehicle.rental"
                      name="leased"
                      type="checkbox"
                      hidden
                      checked
                      @change="vehicle.rental = $event.target.checked"
                    />
                    <input
                      v-else
                      name="leased"
                      type="checkbox"
                      hidden
                      @change="vehicle.rental = $event.target.checked"
                    />
                    <div class="square"></div>
                    <div class="m-checkbox-content">
                      Привлечённое/арендованное ТС
                    </div>
                  </label>
                </div>
                <div class="edit-tabs-forms-form-media">
                  <div
                    id="passport"
                    class="edit-tabs-forms-form-media-item d-flex flex-column"
                  >
                    <div
                      v-if="!$isEmpty(passport)"
                      class="uploaded d-flex flex-column"
                    >
                      <h3>скан тех.паспорта/пластик</h3>
                      <div id="doc" class="d-flex">
                        <img class="vehicle" :src="passport.value" alt="" /><img
                          :src="$imgSrc('icons/cancel.svg')"
                          alt=""
                          class="pointer cancel"
                          @click="removeFile('passport')"
                        />
                      </div>
                    </div>
                    <div
                      v-else
                      class="pointer m-container d-flex align-center"
                      @click="$refs[passportRef].click()"
                    >
                      <img :src="$imgSrc('icons/download.svg')" alt="" />
                      <span>загрузить скан тех.паспорта или пластик</span>
                    </div>
                  </div>
                  <div
                    id="photo"
                    class="edit-tabs-forms-form-media-item d-flex flex-column"
                  >
                    <div
                      v-if="!$isEmpty(photo)"
                      class="uploaded d-flex flex-column"
                    >
                      <h3>{{ `фотография${firstVehicle ? ' тс' : ''}` }}</h3>
                      <div id="pho" class="d-flex">
                        <img class="vehicle" :src="photo.value" alt="" /><img
                          :src="$imgSrc('icons/cancel.svg')"
                          alt=""
                          class="pointer cancel"
                          @click="removeFile('photo')"
                        />
                      </div>
                    </div>
                    <div
                      v-else
                      class="pointer m-container d-flex align-center"
                      @click="$refs[photoRef].click()"
                    >
                      <img :src="$imgSrc('icons/download.svg')" alt="" />
                      <span>{{
                        `загрузить фотографию${firstVehicle ? ' тс' : ''}`
                      }}</span>
                    </div>
                  </div>
                  <!-- <div
                    v-if="firstVehicle && !$isEmpty(drivers)"
                    id="driver"
                    class="edit-tabs-forms-form-media-item d-flex flex-column"
                  >
                    <div
                      v-if="!$isEmpty(driver)"
                      class="uploaded d-flex flex-column"
                    >
                      <h3>водитель</h3>
                      <div id="dri" class="d-flex">
                        <span>{{ driverName }}</span
                        ><img
                          :src="$imgSrc('icons/cancel.svg')"
                          alt=""
                          class="pointer cancel"
                          @click="removeFile('driver')"
                        />
                      </div>
                    </div>
                    <div
                      v-else
                      class="pointer m-container d-flex align-center"
                      @click="showChoose('selectDriver')"
                    >
                      <img :src="$imgSrc('icons/people.svg')" alt="" />
                      <span>закрепить водителя</span>
                    </div>
                    <m-select
                      ref="selectDriver"
                      placeholder="Выберите водителя"
                      :options="drivers"
                      class="choose d-none temp"
                      value-mode="object"
                      :temp="true"
                      @change="selectDriver"
                    ></m-select>
                  </div> -->
                  <!-- <div
                    v-if="hasTrailers"
                    id="bind"
                    class="edit-tabs-forms-form-media-item d-flex flex-column"
                  >
                    <div
                      v-if="!isEmptyTrailer"
                      class="uploaded d-flex flex-column"
                    >
                      <h3>{{ bindedWith }}</h3>
                      <div id="bin" class="d-flex">
                        <span>{{ bindName }}</span
                        ><img
                          v-if="canDelete"
                          :src="$imgSrc('icons/cancel.svg')"
                          alt=""
                          class="pointer cancel"
                          @click="removeFile(trailerType)"
                        />
                      </div>
                    </div>
                    <div
                      v-else-if="isEmptyTrailer && firstVehicle"
                      class="pointer m-container d-flex align-center"
                      @click="showChoose('selectBind')"
                    >
                      <img :src="$imgSrc('icons/add.svg')" alt="" />
                      <span>{{ bindWith }}</span>
                    </div>
                    <m-select
                      ref="selectBind"
                      :placeholder="trailerPlaceholder"
                      :options="trailerObj"
                      class="choose d-none temp"
                      value-mode="object"
                      :temp="true"
                      @change="selectBind"
                    ></m-select>
                  </div> -->
                </div>
              </div>
            </transition>
          </div>
          <div id="buttons" class="role-input d-flex justify-center">
            <div class="b-container">
              <m-button
                :disabled="bDisabled"
                shade="blue"
                :style="{
                  left: mobile ? '50%' : add ? '50%' : '80% !important'
                }"
                @click.native="submit"
                >{{ add ? 'добавить' : 'сохранить' }}</m-button
              >
            </div>
            <div v-if="!add" class="b-container">
              <m-button
                :style="{ left: mobile ? '50%' : '20% !important' }"
                :disabled="bDisabled"
                shade="blue"
                @click.native="cancel"
                >отменить</m-button
              >
            </div>
          </div>
          <input
            id="file-passport"
            :ref="passportRef"
            type="file"
            hidden
            accept=".jpg,.png,.gif,.bmp,.png"
            @change="uploadFile($event, 'passport')"
          />
          <input
            id="file-photo"
            :ref="photoRef"
            type="file"
            hidden
            accept=".jpg,.png,.gif,.bmp"
            @change="uploadFile($event, 'photo')"
          />
        </div>
      </form>
    </transition>
    <form
      v-if="!$isEmpty(storeCarPark)"
      class="profile all-cars"
      style="position:relative"
    >
      <div class="store-tabs-veil" :class="{ 'd-opaq': add }"></div>
      <div class="all-cars-header d-flex">
        <h1>добавленное в автопарк</h1>
        <div class="limit d-flex align-center">
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
      <div class="edit-data mb-8">
        <div class="store-tabs">
          <div class="store-tabs-tabs">
            <m-tabs
              :key="storeCarPark.length"
              v-model="currentTabEdit"
              :tabs="storeCarPark"
              :tab="currentTabEdit"
              @mousedown="getPageName"
            ></m-tabs>
          </div>
          <transition :name="obj.direction" mode="out-in">
            <div
              :key="currentTabEdit"
              class="store-tabs-items d-flex flex-column w-100"
            >
              <Loading :state="!opaq" :absolute="true"></Loading>
              <!-- <transition-group name="right-tab" mode="out-in"> -->
              <div
                v-for="d of storedVehicles"
                :key="d.id"
                class="store-tabs-items-item w-100 d-flex"
              >
                <div class="car-image">
                  <div :key="add" class="blured" :style="imgStyle(d)"></div>
                </div>
                <div
                  v-if="!$isEmpty(d.photos)"
                  :key="add"
                  class="car-image-img  d-flex justify-center"
                >
                  <img :key="add" :src="d.photos[0].value.default" alt="" />
                </div>
                <div class="car-info d-flex flex-column">
                  <div
                    class="car-info-header d-flex align-center w-100"
                    :class="{ 'justify-space-between': !noWarnings(d) }"
                  >
                    <div
                      v-if="!noWarnings(d)"
                      class="car-info-header-warning d-flex align-center"
                    >
                      <v-tooltip top>
                        <template #activator="{on}">
                          <div
                            v-if="!d.active"
                            class="img d-flex justify-center align-center"
                            v-on="on"
                          >
                            <img
                              :src="$imgSrc('icons/warning-orange.svg')"
                              alt=""
                            />
                          </div>
                        </template>
                        <span>ТС не активно</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template #activator="{on}">
                          <div
                            v-if="d.wait"
                            class="img d-flex justify-center align-center"
                            v-on="on"
                          >
                            <img :src="$imgSrc('icons/wait.svg')" alt="" />
                          </div>
                        </template>
                        <span>ТС на проверке у администратора системы</span>
                      </v-tooltip>
                    </div>
                    <div
                      class="car-info-header-edit d-flex align-center ml-auto"
                      :class="{ 'mr-auto': mobile && noWarnings(d) }"
                    >
                      <img
                        class="pointer"
                        :src="$imgSrc('icons/remove.svg')"
                        alt=""
                        @click="removeItem(d.id)"
                      />
                      <img
                        class="pointer"
                        :src="$imgSrc('icons/edit.svg')"
                        alt=""
                        @click="editItem(d.id)"
                      />
                    </div>
                  </div>
                  <div
                    class="car-info-content d-flex w-100 justify-space-between"
                  >
                    <div class="car-info-content-item d-flex">
                      <span class="title">Марка</span>
                      <span class="value">{{
                        d.brand === 'other' ? 'Другое' : d.brand
                      }}</span>
                    </div>
                    <div class="car-info-content-item d-flex">
                      <span class="title">Модель</span>
                      <span class="value">{{
                        d.model === 'other' ? 'Другое' : d.model
                      }}</span>
                    </div>
                    <div class="car-info-content-item d-flex">
                      <span class="title">Год выпуска</span>
                      <span class="value">{{ d.year }}</span>
                    </div>
                    <div v-if="d.euro" class="car-info-content-item d-flex">
                      <span class="title">Euro</span>
                      <span class="value">{{ d.euro }}</span>
                    </div>
                    <div class="car-info-content-item d-flex">
                      <span class="title">Гос номер</span>
                      <span class="value">{{ d.number }}</span>
                    </div>
                    <div class="car-info-content-item d-flex">
                      <span class="title">VIN</span>
                      <span class="value">{{ d.vin }}</span>
                    </div>
                  </div>
                  <div
                    v-if="!$isEmpty(d.passports)"
                    class="car-info-media d-flex w-100"
                  >
                    <div
                      class="car-info-media-item d-flex justify-space-between align-center pointer"
                      @click="spawn($event)"
                    >
                      <span>скан тех.паспорта/пластик</span
                      ><img id="eye" :src="$imgSrc('icons/eye.svg')" alt="" />
                      <div class="view d-flex justify-center align-center">
                        <div class="layer d-flex justify-center align-center">
                          <img
                            id="doc"
                            :src="d.passports[0].value.default"
                            alt=""
                            @click="showDoc(d.passports[0].value.default)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="pages > 1"
                :key="currentTabEdit"
                class="store-tabs-items-pagination d-flex"
              >
                <m-pagination
                  v-model="obj"
                  :pages="pages"
                  :page="page"
                ></m-pagination>
              </div>
              <!-- </transition-group> -->
            </div>
          </transition>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import redirectRole from '~/mixins/redirectRole.js';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import dialog from '~/mixins/dialog.js';
import Loading from '~/components/Loading.vue';

function* turn(times) {
  for (let i = 0; i < times - 1; i++) {
    yield;
  }
}

export default {
  components: {
    Loading
  },
  mixins: [redirectRole, hideMobileMenu, dialog],
  async asyncData({ app, redirect, route }) {
    const p = app.$localstorage.get('position');
    const e = app.$localstorage.get('email');
    const n = route.name;
    let limit = 5;
    let pages = 1;
    let obj = {
      page: 1
    };
    let currentTabEdit = 'tractor';
    if (p !== undefined) {
      if (p[e]) {
        if (p[e][n]) {
          currentTabEdit = p[e][n].currentTabEdit;
          limit = p[e][n].limit;
          ({ ...obj } = p[e][n][currentTabEdit]);
        } else {
          p[e][n] = {
            currentTabEdit,
            limit,
            tractor: obj,
            semitrailer: obj,
            truck: obj,
            trailer: obj
          };
          app.$localstorage.set('position', p, true);
        }
      } else {
        p[e] = {
          [n]: {
            currentTabEdit,
            limit,
            tractor: obj,
            semitrailer: obj,
            truck: obj,
            trailer: obj
          }
        };
        app.$localstorage.set('position', p, true);
      }
    } else {
      const o = {
        [e]: {}
      };
      o[e][n] = {
        currentTabEdit,
        limit,
        tractor: obj,
        semitrailer: obj,
        truck: obj,
        trailer: obj
      };
      app.$localstorage.set('position', o, true);
    }
    try {
      const r = await app.$car.allVehicleTypes();
      try {
        const r1 = await app.$car.getCarParkTotals();
        const storeCarPark = [];
        for (let i = 0; i < r1.length; i++) {
          if (r1[i].total > 0) {
            switch (i) {
              case 0:
                storeCarPark.push({
                  title: 'Тягач',
                  value: 'tractor',
                  total: r1[i].total
                });
                break;
              case 1:
                storeCarPark.push({
                  title: 'Полуприцеп',
                  value: 'semitrailer',
                  total: r1[i].total
                });
                break;
              case 2:
                storeCarPark.push({
                  title: 'Грузовик',
                  value: 'truck',
                  total: r1[i].total
                });
                break;
              case 3:
                storeCarPark.push({
                  title: 'Прицеп',
                  value: 'trailer',
                  total: r1[i].total
                });
                break;
            }
          }
        }
        if (storeCarPark.length > 0) {
          if (
            storeCarPark.findIndex(
              (a) => a.value === p[e][n].currentTabEdit
            ) !== -1
          ) {
            currentTabEdit = p[e][n].currentTabEdit;
            limit = p[e][n].limit;
            ({ ...obj } = p[e][n][currentTabEdit]);
          } else {
            currentTabEdit = storeCarPark[0].value;
            p[e][n].currentTabEdit = currentTabEdit;
            app.$localstorage.set('position', p, true);
          }
          const div =
            storeCarPark.find((a) => a.value === currentTabEdit).total / limit;
          const rou = Math.floor(div);
          pages = div - rou === 0 ? rou : rou + 1;
          const req = {
            page: obj.page,
            limit,
            type: `CAR_TYPE_${currentTabEdit.toUpperCase()}`
          };
          try {
            const r2 = await app.$car.getCarPark(req);
            const s = [];
            for (const i of r2) {
              const vehicle = {
                id: i.id.value,
                number: i.number.default,
                brand: i.brand.default,
                model: i.model.default,
                year: i.year.default,
                vin: i.vin.default,
                rental: i.rental.default,
                wait: i.wait,
                active: i.active,
                euro: i.euro.default
              };
              for (const p of i.photos) {
                const t = await app.$fetchImage(p.value.default);
                p.value.default = t;
              }
              for (const p of i.passports) {
                const t = await app.$fetchImage(p.value.default);
                p.value.default = t;
              }
              vehicle.photos = i.photos;
              vehicle.passports = i.passports;
              s.push(vehicle);
            }
            return {
              storeCarPark,
              storedVehicles: s,
              total: storeCarPark.find((a) => a.value === currentTabEdit).total,
              tractor: r[0],
              semitrailer: r[1],
              truck: r[2],
              trailer: r[3],
              page: obj.page,
              limit,
              currentTabEdit,
              pages
            };
          } catch (e) {
            app.$errorHandle(e);
          }
        } else {
          return {
            storeCarPark: [],
            storedVehicles: [],
            total: 0,
            tractor: r[0],
            semitrailer: r[1],
            truck: r[2],
            trailer: r[3],
            page: obj.page,
            limit,
            currentTabEdit,
            pages: 1
          };
        }
      } catch (e) {
        app.$errorHandle(e);
      }
    } catch (e) {
      app.$errorHandle(e);
    }
  },
  data() {
    return {
      index: null,
      album: [],
      opaq: true,
      currentTabAdd: 'tractor',
      direction: 'right-tab',
      obj: { page: this.page, direction: 'right-tab' },
      passportRef: this.$random([]),
      photoRef: this.$random([this.passportRef]),
      add: true,
      bDisabled: false,
      disabled: false,
      brandSelect: false,
      brandElse: false,
      models: [],
      vehicle: {
        number: '',
        year: '',
        brand: '',
        model: '',
        vin: '',
        rental: false,
        euro: '',
        id: undefined
      },
      euro: [
        {
          title: 'Euro 0',
          value: '0'
        },
        {
          title: 'Euro 1',
          value: '1'
        },
        {
          title: 'Euro 2',
          value: '2'
        },
        {
          title: 'Euro 3',
          value: '3'
        },
        {
          title: 'Euro 4',
          value: '4'
        },
        {
          title: 'Euro 5',
          value: '5'
        },
        {
          title: 'Euro 6',
          value: '6'
        }
      ],
      passport: {},
      photo: {}
      // ,
      // driver: {},
      // trailers: [
      //   {
      //     title: 'AX1665OP',
      //     value: 'AX1665OP'
      //   },
      //   {
      //     title: 'AP5020HE',
      //     value: 'AP5020HE'
      //   }
      // ],
      // trailer: {},
      // semitrailers: [
      //   {
      //     title: 'OM1441MO',
      //     value: 'OM1441MO'
      //   },
      //   {
      //     title: 'AY1020ME',
      //     value: 'AY1020ME'
      //   }
      // ],
      // semitrailer: {}
    };
  },
  computed: {
    ...mapState(['carPark', 'mobile']),
    firstVehicle() {
      const v = this.currentTabAdd;
      return v === 'tractor' || v === 'truck';
    },
    canDelete() {
      if (!this.add) {
        const v = this.currentTabEdit;
        if (v === 'semitrailer' || v === 'trailer') {
          return false;
        }
      }
      return true;
    },
    modelDisabled() {
      if (!this.disabled) {
        if (this.brandSelect) {
          return this.brandElse;
        }
      }
      return true;
    },
    chosenBrand() {
      return {};
    },
    selectedBrand() {
      if (this.brandElse) {
        return { title: 'Другое', value: 'other' };
      } else if (!this.brandElse) {
        if (this.$isEmpty(this.vehicle.model)) {
          return {};
        } else {
          return { title: this.vehicle.model, value: this.vehicle.model };
        }
      }
      return {};
    },
    brands() {
      const b = [];
      let y = this[this.add ? this.currentTabAdd : this.currentTabEdit];
      if (y) {
        y = y.map((a) => {
          return { title: a.brand.default, value: a.brand.default };
        });
        for (const i of y) {
          let inc = false;
          for (const u of b) {
            if (u.title === i.title) {
              inc = true;
              break;
            }
          }
          if (!inc) {
            b.push(i);
          }
        }
        b.sort((a, b) => {
          const a1 = (a + '').toLowerCase();
          const b1 = (b + '').toLowerCase();
          if (a1 > b1) {
            return 1;
          } else if (a1 < b1) {
            return -1;
          } else if (a1 === b1) {
            return 0;
          }
        });
        b.push({
          title: 'Другое',
          value: 'other'
        });
      }
      return b;
    }
    // ,
    // hasTrailers() {
    //   const v = this.currentTabAdd;
    //   if (v === 'tractor') {
    //     return !this.$isEmpty(this.semitrailers);
    //   } else {
    //     return !this.$isEmpty(this.trailers);
    //   }
    // },
    // driverName() {
    //   return this.driver.title;
    // },
    // isEmptyTrailer() {
    //   const v = this.currentTabAdd;
    //   if (v === 'tractor') {
    //     return this.$isEmpty(this.semitrailer);
    //   } else {
    //     return this.$isEmpty(this.trailer);
    //   }
    // },
    // bindWith() {
    //   const v = this.currentTabAdd;
    //   let s = 'связать с ';
    //   if (v === 'tractor') {
    //     s += 'полуприцепом';
    //   } else {
    //     s += 'прицепом';
    //   }
    //   return s;
    // },
    // bindedWith() {
    //   const v = this.add ? this.currentTabAdd : this.currentTabEdit;
    //   let s = 'связан с ';
    //   if (v === 'tractor') {
    //     s += 'полуприцепом';
    //   } else if (v === 'truck') {
    //     s += 'прицепом';
    //   } else if (v === 'semitrailer') {
    //     s += 'тягачом';
    //   } else if (v === 'trailer') {
    //     s += 'грузовиком';
    //   }
    //   return s;
    // },
    // bindName() {
    //   const v = this.currentTabAdd;
    //   if (v === 'tractor') {
    //     return this.semitrailer.title;
    //   } else {
    //     return this.trailer.title;
    //   }
    // },
    // trailerType() {
    //   const v = this.currentTabAdd;
    //   if (v === 'tractor') {
    //     return 'semitrailer';
    //   } else {
    //     return 'trailer';
    //   }
    // },
    // trailerObj() {
    //   const v = this.currentTabAdd;
    //   if (v === 'tractor') {
    //     return this.semitrailers;
    //   } else {
    //     return this.trailers;
    //   }
    // },
    // trailerPlaceholder() {
    //   const v = this.currentTabAdd;
    //   let s = 'Выберите ';
    //   if (v === 'tractor') {
    //     s += 'полуприцеп';
    //   } else {
    //     s += 'прицеп';
    //   }
    //   return s;
    // }
  },
  watch: {
    add(newV) {
      for (const i of document.querySelectorAll('.incorrect')) {
        this.$reject({ target: i });
      }
    },
    obj(newV) {
      this.page = newV.page;
    },
    async page(newV) {
      if (newV !== 0) {
        const p = this.$localstorage.get('position');
        const e = this.$localstorage.get('email');
        const n = this.$route.name;
        p[e][n][this.currentTabEdit].page = newV;
        this.$localstorage.set('position', p, true, { sameSite: true });
        this.opaq = false;
        try {
          const r = await this.$car.getCarParkTotal({
            type: `CAR_TYPE_${this.currentTabEdit.toUpperCase()}`
          });
          const div = r.total / this.limit;
          const fl = Math.floor(div);
          this.pages = div - fl === 0 ? fl : fl + 1;
          if (this.pages < newV) {
            this.page = 1;
          } else {
            try {
              const r = await this.$car.getCarPark({
                page: newV,
                limit: p[e][n].limit,
                type: `CAR_TYPE_${this.currentTabEdit.toUpperCase()}`
              });
              this.storedVehicles = [];
              for (const i of r) {
                const vehicle = {
                  id: i.id.value,
                  number: i.number.default,
                  brand: i.brand.default,
                  model: i.model.default,
                  year: i.year.default,
                  vin: i.vin.default,
                  rental: i.rental.default,
                  wait: i.wait,
                  active: i.active,
                  euro: i.euro.default
                };
                for (const p of i.photos) {
                  const t = await this.$fetchImage(p.value.default);
                  p.value.default = t;
                }
                for (const p of i.passports) {
                  const t = await this.$fetchImage(p.value.default);
                  p.value.default = t;
                }
                vehicle.photos = i.photos;
                vehicle.passports = i.passports;
                this.storedVehicles.push(vehicle);
              }
              this.$nextTick(() => {
                window.scrollTo({
                  top: document.querySelector('.profile.all-cars').offsetTop,
                  behavior: 'smooth'
                });
                this.opaq = true;
              });
            } catch (e) {
              this.$errorHandle(e);
              this.opaq = true;
            }
          }
        } catch (e) {
          this.$errorHandle(e);
          this.opaq = true;
        }
      }
    },
    currentTabAdd(newV) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$zIndexing();
        }, 2100);
      });
    },

    currentTabEdit(newV) {
      const p = this.$localstorage.get('position');
      const e = this.$localstorage.get('email');
      const n = this.$route.name;
      p[e][n].currentTabEdit = newV;
      this.$localstorage.set('position', p, true, { sameSite: true });
      this.opaq = false;
      this.page = 0;
      this.$nextTick(() => {
        this.$cancel();
        this.page = p[e][n][newV].page;
      });
    },
    limit(newV) {
      const p = this.$localstorage.get('position');
      const e = this.$localstorage.get('email');
      const n = this.$route.name;
      p[e][n].limit = newV;
      this.$localstorage.set('position', p, true, { sameSite: true });
      this.opaq = false;
      this.page = 0;
      this.$nextTick(() => {
        this.$cancel();
        this.page = 1;
      });
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.finish();
    });
  },
  methods: {
    getDirection(dir) {
      if (dir) {
        ({ ...this.passport } = {});
        ({ ...this.photo } = {});
        this.cleanCarInfo(true);
        this.direction = dir;
      }
    },
    getPageName(dir) {
      if (dir) {
        // this.currentTabEdit = '';
        this.obj.direction = dir;
      }
    },
    docName(name) {
      return name.substr(0, name.lastIndexOf('.'));
    },
    noWarnings(obj) {
      return !obj.wait && obj.active;
    },
    uploadFile(e, collection) {
      const t = e.target;
      const f = t.files[0];
      this.$nuxt.$loading.start();
      const r = new FileReader();
      r.onload = (e) => {
        const res = e.target.result;
        ({ ...this[collection] } = {
          name: f.name,
          value: res
        });
        t.value = '';
        this.$nuxt.$loading.finish();
      };
      r.readAsDataURL(f);
    },
    removeFile(collection) {
      ({ ...this[collection] } = {});
    },
    imgStyle(obj) {
      const i = obj.photos;
      const style = {
        backgroundImage: `url(${this.$imgSrc('no-image.jpg')})`
      };
      if (!this.$isEmpty(i)) {
        style.backgroundImage = `linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255,255,255,0.2) 100%), url(${i[0].value.default})`;
        style.filter = 'blur(5px)';
      }
      return style;
    },
    showDoc(val) {
      [...this.album] = [
        {
          src: val
        }
      ];
      this.index = 0;
    },
    vehicleSelected(field) {
      if (this.add) {
        switch (field) {
          case 'brand': {
            if (this.$isEmpty(this.vehicle.brand)) {
              return {};
            } else {
              return { title: this.vehicle.brand, value: this.vehicle.brand };
            }
          }
          case 'euro': {
            if (this.$isEmpty(this.vehicle.euro)) {
              return {};
            } else {
              return this.euro.find((a) => a.value === this.vehicle.euro);
            }
          }
          default:
            return {};
        }
      } else {
        switch (field) {
          case 'euro': {
            const e = this.euro.find((a) => a.value === this.vehicle.euro);
            return e;
          }
          case 'brand': {
            if (this.$isEmpty(this.vehicle.brand)) {
              return {};
            } else {
              return { title: this.vehicle.brand, value: this.vehicle.brand };
            }
          }
          default:
            return {};
        }
      }
    },
    unspawn(e) {
      for (const i of e.target.querySelectorAll('.spawn')) {
        i.classList.remove('spawn');
      }
    },
    spawn(e) {
      if (this.mobile) {
        e.target.closest('.car-info-media-item').classList.add('spawn');
      }
    },
    // showChoose(ref) {
    //   const el = this.$refs[ref].$el;
    //   el.classList.remove('d-none');
    //   setTimeout(() => {
    //     el.querySelector('._input').click();
    //   }, 10);
    // },
    // selectDriver(e, val) {
    //   e.target.closest('.m-select').classList.add('d-none');
    //   ({ ...this.driver } = val);
    // },
    // selectBind(e, val) {
    //   e.target.closest('.m-select').classList.add('d-none');
    //   if (this.currentTabAdd === 'tractor') {
    //     ({ ...this.semitrailer } = val);
    //   } else {
    //     ({ ...this.trailer } = val);
    //   }
    // },
    findCar(e) {
      if (this.disabled) {
        this.disabled = false;
        this.cleanCarInfo();
      }
      const t = e.target;
      const i = t.parentElement.querySelector('.loading_img');
      t.value = t.value.toUpperCase();
      const v = t.value;
      this.vehicle.number = v;
      this.$waiting(i);
      if (this.$isEmpty(this.$validate({ carNumber: v }))) {
        if (!v.includes('-')) {
          this.disabled = true;
          this.$waiting(i, true);
          this.$getCarInfo(v)
            .then((r) => {
              for (const i in r) {
                this.vehicle[i] = r[i];
                const el = this.$el.querySelector(`[name="${i}"]`);
                this.$reject({
                  target:
                    el.getAttribute('type') === 'hidden'
                      ? el.nextElementSibling
                      : el
                });
              }
              if (this.brandElse) {
                this.brandElse = false;
              }
            })
            .catch((e) => {
              this.disabled = false;
            })
            .finally(() => {
              this.$waiting(i);
            });
        }
      }
    },
    brandSelected(e, val) {
      this.brandSelect = true;
      this.brandElse = val === 'other';
      this.vehicle.model = '';
      if (!this.brandElse) {
        let b = this[
          this.add ? this.currentTabAdd : this.currentTabEdit
        ].filter(
          (a) => a.brand.default === val.value && a.model.default !== 'other'
        );
        if (!this.$isEmpty(b)) {
          b = b.map((a) => {
            return { title: a.model.default, value: a.model.default };
          });
          b.sort((a, b) => {
            const a1 = (a + '').toLowerCase();
            const b1 = (b + '').toLowerCase();
            if (a1 > b1) {
              return 1;
            } else if (a1 < b1) {
              return -1;
            } else if (a1 === b1) {
              return 0;
            }
          });
        }
        b.push({
          title: 'Другое',
          value: 'other'
        });
        [...this.models] = b;
        this.brandElse = true;
        if (b.length > 1) {
          this.brandElse = false;
        } else {
          this.vehicle.model = 'other';
        }
      }
      this.vehicle.brand = val.title;
    },
    cleanCarInfo(all = undefined) {
      this.vehicle.vin = '';
      this.vehicle.year = '';
      this.vehicle.brand = '';
      this.vehicle.model = '';
      this.vehicle.euro = '';
      this.vehicle.rental = false;
      this.brandSelect = false;
      this.brandElse = false;
      if (all) {
        this.vehicle.id = undefined;
        this.vehicle.number = '';
      }
    },
    removeItem(id) {
      this.callback = () => {
        const veh = this.storedVehicles;
        const i = veh.findIndex((a) => a.id === id);
        this.$erase
          .car(id)
          .then((r) => {
            if (this.pages > 1) {
              if (this.pages === this.page) {
                veh.splice(i, 1);
              } else {
                const p = this.page;
                this.page = 0;
                this.$nextTick(() => {
                  this.$cancel();
                  this.page = p;
                });
              }
            } else {
              veh.splice(i, 1);
            }
            if (veh.length === 0) {
              if (this.pages === 1) {
                const i = this.storeCarPark.findIndex(
                  (a) => a.value === this.currentTabEdit
                );
                if (this.storeCarPark.length > 1) {
                  this.currentTabEdit = this.storeCarPark[
                    i === 0 ? 1 : 0
                  ].value;
                  this.$nextTick(() => {
                    this.storeCarPark.splice(i, 1);
                  });
                } else {
                  this.storeCarPark.splice(i, 1);
                }
              } else {
                --this.page;
                this.obj.direction = 'left-tab';
              }
            }
            this.$store.commit('showMessage', 'Успешно');
          })
          .catch((e) => {
            this.$errorHandle(e);
          })
          .finally(() => {
            this.$hideDialog();
          });
      };
      this.$dialog({
        text: 'Удалить выбранное транспортное средство?'
      });
    },
    editItem(id) {
      this.$nuxt.$loading.start();
      this.$nextTick(() => {
        const veh = this.storedVehicles;
        const v = veh.find((a) => a.id === id);
        const num = v.number;
        this.vehicle.id = v.id;
        const fill = () => {
          for (const i in this.vehicle) {
            this.vehicle[i] = !isNaN(v[i]) ? v[i] + '' : v[i];
          }
        };
        const thenDo = () => {
          if (v.photos.length > 0) {
            ({ ...this.photo } = {
              id: v.photos[0].id.value,
              value: v.photos[0].value.default
            });
          }
          if (v.passports.length > 0) {
            ({ ...this.passport } = {
              id: v.passports[0].id.value,
              value: v.passports[0].value.default
            });
          }
          this.brandSelect = true;
          if (this.vehicle.brand === 'other') {
            this.brandElse = true;
          }
          this.brandSelected(null, {
            title: this.vehicle.brand,
            value: this.vehicle.brand
          });
          this.vehicle.model = v.model;
          this.add = false;
          this.$nextTick(() => {
            this.$nuxt.$loading.finish();
            window.scrollTo({
              top: document.querySelector('.m-background').offsetHeight,
              behavior: 'smooth'
            });
          });
        };
        this.vehicle.number = num;
        this.vehicle.euro = v.euro;
        if (num.length === 8) {
          if (!num.includes('-')) {
            this.$getCarInfo(v.number)
              .then((r) => {
                for (const i in r) {
                  this.vehicle[i] = !isNaN(r[i]) ? r[i] + '' : r[i];
                }
                thenDo();
              })
              .catch((e) => {
                fill();
                this.$nextTick(() => {
                  thenDo();
                });
              });
          } else {
            fill();
            this.$nextTick(() => {
              thenDo();
            });
          }
        } else if (num.length !== 8 || num.includes('-')) {
          fill();
          this.$nextTick(() => {
            thenDo();
          });
        }
      });
    },
    submit(e) {
      let correct = true;
      const b = e.target.closest('.m-button');
      const f = b.closest('form');
      const i = f.querySelectorAll('[data-required],[data-validate]');
      for (const y of i) {
        const v = y.value;
        const el =
          y.getAttribute('type') === 'hidden' ? y.nextElementSibling : y;
        if (y.hasAttribute('data-required')) {
          if (this.$isEmpty(v)) {
            this.$incorrect({
              target: el
            });
            correct = false;
          }
        } else if (y.hasAttribute('data-validate')) {
          const attr = y.getAttribute('data-validate');
          const validate = this.$validate({ [attr]: v });
          if (!this.$isEmpty(validate)) {
            this.$incorrect({
              target: el,
              error: validate[attr]
            });
            correct = false;
          }
        }
      }
      if (correct) {
        let m = '';
        if (this.$isEmpty(this.passport)) {
          m += 'Без документа, ТС не будет активно в системе';
        }
        this.callback = () => {
          if (this.$isEmpty(m)) {
            this.$toggle(b);
            this.bDisabled = true;
          }
          if (this.add) {
            const obj = {
              type: `CAR_TYPE_${this.currentTabAdd.toUpperCase()}`,
              brand: this.vehicle.brand,
              model: this.vehicle.model,
              number: this.vehicle.number,
              year: this.vehicle.year,
              vin: this.vehicle.vin,
              euro: this.$isEmpty(this.vehicle.euro) ? '0' : this.vehicle.euro
            };

            const ending = () => {
              const car = {
                id: this.vehicle.id,
                year: this.vehicle.year,
                number: this.vehicle.number,
                brand: this.vehicle.brand,
                model: this.vehicle.model,
                euro: this.vehicle.euro,
                vin: this.vehicle.vin,
                rental: this.vehicle.rental,
                photos: [],
                passports: [],
                wait: true,
                active: false
              };
              if (!this.$isEmpty(this.photo)) {
                [...car.photos] = [
                  {
                    id: {
                      value: this.photo.id
                    },
                    value: {
                      default: this.photo.value
                    }
                  }
                ];
              }
              if (!this.$isEmpty(this.passport)) {
                [...car.passports] = [
                  {
                    id: {
                      value: this.passport.id
                    },
                    value: {
                      default: this.passport.value
                    }
                  }
                ];
              }

              if (this.currentTabAdd === this.currentTabEdit) {
                const sV = this.storedVehicles;
                if (sV.length < this.limit) {
                  sV.push(car);
                } else {
                  ++this.page;
                  this.obj.direction = 'right-tab';
                }
              }
              const y = new Array(4);
              if (
                this.storeCarPark.findIndex(
                  (a) => a !== undefined && a.value === 'tractor'
                ) !== -1
              ) {
                y[0] = this.storeCarPark.find((a) => a.value === 'tractor');
              }
              if (
                this.storeCarPark.findIndex(
                  (a) => a !== undefined && a.value === 'semitrailer'
                ) !== -1
              ) {
                y[1] = this.storeCarPark.find((a) => a.value === 'semitrailer');
              }
              if (
                this.storeCarPark.findIndex(
                  (a) => a !== undefined && a.value === 'truck'
                ) !== -1
              ) {
                y[2] = this.storeCarPark.find((a) => a.value === 'truck');
              }
              if (
                this.storeCarPark.findIndex(
                  (a) => a !== undefined && a.value === 'trailer'
                ) !== -1
              ) {
                y[3] = this.storeCarPark.find((a) => a.value === 'trailer');
              }

              if (
                y.findIndex(
                  (a) => a !== undefined && a.value === this.currentTabAdd
                ) === -1
              ) {
                switch (this.currentTabAdd) {
                  case 'tractor': {
                    y[0] = { title: 'Тягач', value: 'tractor' };
                    break;
                  }
                  case 'semitrailer': {
                    y[1] = { title: 'Полуприцеп', value: 'semitrailer' };
                    break;
                  }
                  case 'truck': {
                    y[2] = { title: 'Грузовик', value: 'truck' };
                    break;
                  }
                  case 'trailer': {
                    y[3] = { title: 'Прицеп', value: 'trailer' };
                    break;
                  }
                }
              }
              [...this.storeCarPark] = y.filter((a) => a !== undefined);
              this.$store.commit('showMessage', 'Добавлено');
              this.$hideDialog();
              if (this.$isEmpty(m)) {
                this.bDisabled = false;
                this.$toggle(b);
              }
              this.$nextTick(() => {
                const cur = this.currentTabAdd;
                const dir = this.direction;
                this.getDirection(dir);
                this.currentTabAdd = 'cur';
                this.$nextTick(() => {
                  this.currentTabAdd = cur;
                });
              });
            };
            this.$car
              .create(obj)
              .then((r) => {
                this.vehicle.id = r.id;
                let times = 1;
                if (!this.$isEmpty(this.photo)) {
                  times++;
                }
                if (!this.$isEmpty(this.passport)) {
                  times++;
                }
                const gen = turn(times);
                let done;

                if (!this.$isEmpty(this.photo)) {
                  this.$car
                    .photo(r.id, this.photo.value)
                    .then((r) => {
                      this.photo.id = r.id;
                      done = gen.next();
                      if (done.done) {
                        ending();
                      }
                    })
                    .catch((e) => {
                      this.$hideDialog();
                      if (this.$isEmpty(m)) {
                        this.bDisabled = false;
                        this.$toggle(b);
                      }
                      this.$error(e);
                    });
                }
                if (!this.$isEmpty(this.passport)) {
                  this.$car
                    .passport(r.id, this.passport.value)
                    .then((r) => {
                      this.passport.id = r.id;
                      done = gen.next();
                      if (done.done) {
                        ending();
                      }
                    })
                    .catch((e) => {
                      this.$hideDialog();
                      if (this.$isEmpty(m)) {
                        this.bDisabled = false;
                        this.$toggle(b);
                      }
                      this.$error(e);
                    });
                }
                this.$car
                  .rental(r.id, this.vehicle.rental)
                  .then((r) => {
                    done = gen.next();
                    if (done.done) {
                      ending();
                    }
                  })
                  .catch((e) => {
                    this.$hideDialog();
                    if (this.$isEmpty(m)) {
                      this.bDisabled = false;
                      this.$toggle(b);
                    }
                    this.$error(e);
                  });
              })
              .catch((e) => {
                this.$hideDialog();
                if (this.$isEmpty(m)) {
                  this.bDisabled = false;
                  this.$toggle(b);
                }
                this.$errorHandle(e);
              });
          } else {
            const { ...obj } = this.vehicle;
            const car = this.storedVehicles.find(
              (a) => a.id === this.vehicle.id
            );
            const nextStep = () => {
              let times = 0;
              if (!this.$isEmpty(this.photo) && !this.photo.id) {
                times++;
              }
              if (!this.$isEmpty(this.passport) && !this.passport.id) {
                times++;
              }
              const gen = turn(times);
              let done;
              const finish = () => {
                done = gen.next();
                if (done.done) {
                  ending();
                }
              };
              if (times === 0) {
                ending();
              } else {
                if (!this.$isEmpty(this.photo) && !this.photo.id) {
                  this.$car
                    .photo(car.id, this.photo.value)
                    .then((r) => {
                      car.photos.push({
                        id: {
                          value: r.id
                        },
                        value: { default: this.photo.value }
                      });
                      finish();
                    })
                    .catch((e) => {
                      this.$error(e);
                      this.$hideDialog();
                      if (this.$isEmpty(m)) {
                        this.bDisabled = false;
                        this.$toggle(b);
                      }
                    });
                }
                if (!this.$isEmpty(this.passport) && !this.passport.id) {
                  this.$car
                    .passport(car.id, this.passport.value)
                    .then((r) => {
                      car.passports.push({
                        id: {
                          value: r.id
                        },
                        value: { default: this.passport.value }
                      });
                      finish();
                    })
                    .catch((e) => {
                      this.$error(e);
                      this.$hideDialog();
                      if (this.$isEmpty(m)) {
                        this.bDisabled = false;
                        this.$toggle(b);
                      }
                    });
                }
              }
            };
            const ending = () => {
              for (const i in this.vehicle) {
                car[i] = this.vehicle[i];
              }
              this.$store.commit('showMessage', 'Изменено');
              this.$hideDialog();
              if (this.$isEmpty(m)) {
                this.bDisabled = false;
                this.$toggle(b);
              }
              this.$nextTick(() => {
                const cur = this.currentTabAdd;
                const dir = this.direction;
                this.getDirection(dir);
                this.$nextTick(() => {
                  this.currentTabAdd = cur;
                  this.add = true;
                });
              });
            };
            this.$car
              .editCar(obj)
              .then((r) => {
                let times = 0;
                if (this.$isEmpty(this.photo) || !this.photo.id) {
                  times++;
                }
                if (this.$isEmpty(this.passport) || !this.passport.id) {
                  times++;
                }
                const gen = turn(times);
                let done;
                const add = () => {
                  done = gen.next();
                  if (done.done) {
                    nextStep();
                  }
                };

                if (times === 0) {
                  add();
                } else {
                  if (this.$isEmpty(this.photo) || !this.photo.id) {
                    if (this.$isEmpty(car.photos)) {
                      add();
                    } else {
                      this.$erase
                        .carPhoto(car.id, car.photos[0].id.value)
                        .then((r) => {
                          car.photos.splice(0, 1);
                          add();
                        })
                        .catch((e) => {
                          this.$error(e);
                          this.$hideDialog();
                          if (this.$isEmpty(m)) {
                            this.bDisabled = false;
                            this.$toggle(b);
                          }
                        });
                    }
                  }
                  if (this.$isEmpty(this.passport) || !this.passport.id) {
                    if (this.$isEmpty(car.passports)) {
                      add();
                    } else {
                      this.$erase
                        .carPassport(car.id, car.passports[0].id.value)
                        .then((r) => {
                          car.passports.splice(0, 1);
                          add();
                        })
                        .catch((e) => {
                          this.$error(e);
                          this.$hideDialog();
                          if (this.$isEmpty(m)) {
                            this.bDisabled = false;
                            this.$toggle(b);
                          }
                        });
                    }
                  }
                }
              })
              .catch((e) => {
                this.$hideDialog();
                if (this.$isEmpty(m)) {
                  this.bDisabled = false;
                  this.$toggle(b);
                }
                this.$errorHandle(e);
              });
          }
        };
        this.$nextTick(() => {
          if (!this.$isEmpty(m)) {
            this.$dialog({
              image: this.$imgSrc('icons/warning.svg'),
              text: m,
              ok: true,
              buttons: ['хорошо']
            });
          } else {
            this.callback();
          }
        });
      }
    },
    cancel() {
      this.$cancel();
      const cur = this.currentTabAdd;
      const dir = this.direction;
      this.cleanCarInfo(true);
      this.add = true;
      this.getDirection(dir);
      this.$nextTick(() => {
        this.currentTabAdd = cur;
      });
    },
    saveChanges(e) {}
  },
  head() {
    return {
      title: '| Автопарк'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/car-park.scss';
</style>
