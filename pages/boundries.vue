<template>
  <v-content>
    <Loading :state="loading"> </Loading>
    <m-breadcrumps last="пограничные переходы"></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="dpsu with-caption d-flex flex-column">
      <div class="h3">пограничные переходы</div>
      <h1>загруженность пунктов пропуска</h1>
      <div class="dpsu-container">
        <div class="dpsu-info d-flex flex-column">
          <div class="dpsu-info-filter d-flex flex-column">
            <!-- <label class="m-checkbox mr-5">
              <input
                type="checkbox"
                hidden
                @change="($event) => filter($event, undefined, 'camera')"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">
                Есть камера
              </div>
            </label> -->
            <div class="m-labeled">
              <div class="m-label">Страна перехода</div>
              <m-select
                placeholder="Страна перехода"
                :selected="chosen.country"
                :options="country"
                @change="($event, val) => filter($event, val, 'country')"
              >
              </m-select>
            </div>
            <div class="m-labeled">
              <div class="m-label">Тип пропуска</div>
              <m-select
                placeholder="Тип пропуска"
                :selected="chosen.type"
                :options="type"
                @change="($event, val) => filter($event, val, 'type')"
              ></m-select>
            </div>
            <div class="m-labeled">
              <div class="m-label">Название пункта</div>
              <m-select
                placeholder="Название пункта"
                :selected="chosen.location"
                :options="location"
                @change="($event, val) => filter($event, val, 'location')"
              >
              </m-select>
            </div>
          </div>
          <div class="dpsu-info-history d-flex flex-column">
            <div class="h3">обозначения</div>
            <div class="sub">
              <span class="h">Загруженность пунктов пропуска</span>
              <div class="dansity">
                <div class="dansity-info">
                  <div id="red" class="dot"></div>
                  <span>Высокая</span>
                </div>
                <div class="dansity-info">
                  <div id="green" class="dot"></div>
                  <span>Средняя</span>
                </div>
                <div class="dansity-info">
                  <div id="blue" class="dot"></div>
                  <span>Низкая</span>
                </div>
              </div>
            </div>
            <div class="sub">
              <span class="h">Типы пунктов пропуска</span>
              <div class="types">
                <div class="types-item">
                  <img :src="$imgSrc('dpsu/car.png')" alt="" />
                  <span>Автомобильный</span>
                </div>
                <div class="types-item">
                  <img :src="$imgSrc('dpsu/train.png')" alt="" />
                  <span>Железнодорожный</span>
                </div>
                <div class="types-item">
                  <img :src="$imgSrc('dpsu/plane.png')" alt="" />
                  <span>Воздушный</span>
                </div>
                <div class="types-item">
                  <img :src="$imgSrc('dpsu/anchor.png')" alt="" />
                  <span>Речной</span>
                </div>
                <div class="types-item">
                  <img :src="$imgSrc('dpsu/person.png')" alt="" />
                  <span>Пешеходный</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="mobile" class="footer-img">
          <div class="right"></div>
          <div class="left"></div>
        </div>
        <div class="dpsu-map d-flex">
          <div class="g-map"></div>
          <div
            class="details d-flex align-center justify-center"
            :class="{ 'd-opaq': $isEmpty(info) }"
          >
            <div class="g-info d-flex flex-column">
              <img
                id="close"
                :src="$imgSrc('icons/cancel.svg')"
                alt=""
                class="pointer ml-auto"
                @click="close"
              />
              <span class="h">{{ info.name }}</span>
              <div v-for="(v, k) in info" :key="k">
                <template v-if="!/[A-z]+/.test(k)">
                  <b>{{ k }}</b
                  ><span v-html="v"></span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-content>
</template>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';

export default {
  mixins: [indexPagesUnregister],
  async asyncData({ app, env }) {
    let data = [];
    const location = [
      {
        value: '-1',
        title: 'Все'
      }
    ];
    const all = {
      value: '-1',
      title: 'Все'
    };
    const chosen = {
      country: all,
      type: all,
      location: all,
      camera: false
    };
    const countryList = [
      {
        value: '-1',
        title: 'Все'
      },
      {
        value: 'ukraina',
        title: 'Украина'
      },
      {
        value: 'belorussia',
        title: 'Белорусь'
      },
      {
        value: 'moldova',
        title: 'Молдова'
      },
      {
        value: 'romania',
        title: 'Румыния'
      },
      {
        value: 'hungary',
        title: 'Венгрия'
      },
      {
        value: 'slovakia',
        title: 'Словакия'
      },
      {
        value: 'poland',
        title: 'Польша'
      },
      {
        value: 'crimea',
        title: 'Временно оккупированная территория Украины — Крым'
      },
      {
        value: 'russia',
        title: 'Россия'
      }
    ];
    const typeList = [
      {
        value: '-1',
        title: 'Все'
      },
      {
        value: 'car',
        title: 'Автомобильный'
      },
      {
        value: 'plane',
        title: 'Воздушный'
      },
      {
        value: 'person',
        title: 'Пешеходный'
      },
      {
        value: 'anchor',
        title: 'Речной'
      },
      {
        value: 'train',
        title: 'Железнодорожный'
      }
    ];
    const [...country] = countryList;
    const [...type] = typeList;
    try {
      const d = await app.$dpsu.get();
      const a = d.indexOf('[');
      const z = d.lastIndexOf(']');
      [...data] = JSON.parse(d.substring(a, z + 1));
      data.map((a) => {
        a.coordinates.lat = Number.parseFloat(a.coordinates.lat);
        a.coordinates.lng = Number.parseFloat(a.coordinates.lng);
      });
    } catch (e) {
      console.log(e);
      try {
        const d = app.$dpsu.get();
        const a = d.indexOf('[');
        const z = d.lastIndexOf(']');
        [...data] = JSON.parse(d.substring(a, z + 1));
        data.map((a) => {
          a.coordinates.lat = Number.parseFloat(a.coordinates.lat);
          a.coordinates.lng = Number.parseFloat(a.coordinates.lng);
        });
      } catch (e) {
        console.log(e);
        app.$errorHandle(e);
      }
    }
    data.forEach((d, i) => {
      if (location.findIndex((a) => a.value === d.filters.name) === -1) {
        location.push({
          value: d.filters.name,
          title: d.filters.name
        });
      }
    });
    return {
      data,
      location,
      all,
      chosen,
      countryList,
      typeList,
      country,
      type
    };
  },
  data() {
    return {
      map: undefined,
      markers: [],
      google: undefined,
      loading: true,
      info: {}
    };
  },
  computed: {
    ...mapState(['mobile'])
  },
  mounted() {
    this.$nextTick(() => {
      this.$zIndexing();
    });
    (async () => {
      const apiKey = `${process.env.API_KEY}`;
      try {
        this.google = await GoogleMapsApiLoader({
          apiKey
        });
        this.createMap();
      } catch (e) {
        try {
          this.google = await GoogleMapsApiLoader({
            apiKey
          });
          this.createMap();
          console.log(e);
        } catch (e) {
          console.log(e);
          this.loading = undefined;
        }
      }
    })();
  },
  methods: {
    createMap() {
      const vm = this;
      this.map = new this.google.maps.Map(
        this.$el.querySelector('.dpsu-map .g-map'),
        {
          center: { lat: 49.1191732, lng: 31.1079547 },
          zoom: this.mobile ? 5 : 6,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }
      );
      this.data.map((a) => {
        const marker = new this.google.maps.Marker({
          position: a.coordinates,
          map: this.map,
          id: a.data.id,
          icon: this.$imgSrc(
            `dpsu/${a.data.type.concat(
              a.data.color === 'blue' ? '' : '-' + a.data.color
            )}.png`
          )
        });
        marker.addListener('click', () => {
          (async () => {
            try {
              const d = await vm.$dpsu.get(a.data.id);
              ({ ...this.info } = d.data);
            } catch (e) {
              console.log(e);
            }
          })();
        });
        vm.markers.push(marker);
      });
      this.google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
        this.$nuxt.$loading.finish();
        this.loading = undefined;
      });
      // this.marker = new this.google.maps.Marker({
      //   position: { lat: 50.4391481, lng: 30.6166916 },
      //   map: this.map,
      //   title: 'Transtech System',
      //   icon: '/images/icon.png'
      // });
    },
    close() {
      ({ ...this.info } = {});
    },
    filter(e, val, item) {
      const id = [];
      if (item === 'country') {
        if (val == -1) {
          Vue.set(this.chosen, 'country', this.all);
          this.markers.map((m) => m.setVisible(true));
          [...this.type] = this.typeList;
          this.markers.map((m) => {
            m.setVisible(true);
          });
          [...this.location] = [this.all];
          this.data.map((d) => {
            if (
              this.location.findIndex((a) => a.value === d.filters.name) === -1
            ) {
              this.location.push({
                value: d.filters.name,
                title: d.filters.name
              });
            }
          });
        } else {
          Vue.set(
            this.chosen,
            'country',
            this.countryList.find((a) => a.value === val)
          );
          this.data.map((d) => {
            if (d.filters.country === val) {
              id.push(d.data.id);
            }
          });
          this.markers.map((m) => {
            if (id.includes(m.id)) {
              m.setVisible(true);
            } else {
              m.setVisible(false);
            }
          });
          [...this.location] = [this.all];
          this.data.map((d) => {
            if (d.filters.country === val) {
              if (
                this.location.findIndex((a) => a.value === d.filters.name) ===
                -1
              ) {
                this.location.push({
                  value: d.filters.name,
                  title: d.filters.name
                });
              }
            }
          });
          [...this.type] = [this.all];
          this.data.map((d) => {
            if (d.filters.country === val) {
              if (
                this.type.findIndex((a) => a.value === d.filters.type) === -1
              ) {
                this.type.push(
                  this.typeList.find((t) => t.value === d.filters.type)
                );
              }
            }
          });
        }
        Vue.set(this.chosen, 'location', this.all);
        Vue.set(this.chosen, 'type', this.all);
      } else if (item === 'type') {
        if (val == -1) {
          Vue.set(this.chosen, 'type', this.all);
          if (
            this.chosen.country.value == -1 &&
            this.chosen.location.value == -1
          ) {
            this.markers.map((m) => m.setVisible(true));
          } else {
            this.data.map((d) => {
              if (this.chosen.location.value != -1) {
                if (d.filters.name === this.chosen.location.value) {
                  id.push(d.data.id);
                }
              } else if (this.chosen.location.value == -1) {
                if (this.chosen.country.value == -1) {
                  id.push(d.data.id);
                } else if (this.chosen.country.value != -1) {
                  if (d.filters.country === this.chosen.country.value) {
                    id.push(d.data.id);
                  }
                }
              }
            });
            this.markers.map((m) => {
              if (id.includes(m.id)) {
                m.setVisible(true);
              } else {
                m.setVisible(false);
              }
            });
          }
          [...this.location] = [this.all];
          this.data.map((d) => {
            if (this.chosen.country.value == -1) {
              if (
                this.location.findIndex((a) => a.value === d.filters.name) ===
                -1
              ) {
                this.location.push({
                  value: d.filters.name,
                  title: d.filters.name
                });
              }
            } else if (this.chosen.country.value != -1) {
              if (d.filters.country === this.chosen.country.value) {
                if (
                  this.location.findIndex((a) => a.value === d.filters.name) ===
                  -1
                ) {
                  this.location.push({
                    value: d.filters.name,
                    title: d.filters.name
                  });
                }
              }
            }
          });
        } else {
          Vue.set(
            this.chosen,
            'type',
            this.typeList.find((a) => a.value === val)
          );
          this.data.map((d) => {
            if (d.filters.type === val) {
              if (this.chosen.location.value != -1) {
                if (d.filters.name === this.chosen.location.value) {
                  id.push(d.data.id);
                }
              } else if (this.chosen.location.value == -1) {
                if (this.chosen.country.value == -1) {
                  id.push(d.data.id);
                } else if (this.chosen.country.value != -1) {
                  if (d.filters.country === this.chosen.country.value) {
                    id.push(d.data.id);
                  }
                }
              }
            }
          });
          this.markers.map((m) => {
            if (id.includes(m.id)) {
              m.setVisible(true);
            } else {
              m.setVisible(false);
            }
          });
          [...this.location] = [this.all];
          this.data.map((d) => {
            if (this.chosen.country.value == -1) {
              if (d.filters.type === val) {
                if (
                  this.location.findIndex((a) => a.value === d.filters.name) ===
                  -1
                ) {
                  this.location.push({
                    value: d.filters.name,
                    title: d.filters.name
                  });
                }
              }
            } else if (this.chosen.country.value != -1) {
              if (
                d.filters.country === this.chosen.country.value &&
                d.filters.type === val
              ) {
                if (
                  this.location.findIndex((a) => a.value === d.filters.name) ===
                  -1
                ) {
                  this.location.push({
                    value: d.filters.name,
                    title: d.filters.name
                  });
                }
              }
            }
          });
        }
        Vue.set(this.chosen, 'location', this.all);
      } else if (item === 'location') {
        if (val == -1) {
          Vue.set(this.chosen, 'location', this.all);
          if (this.chosen.country.value == -1 && this.chosen.type.value == -1) {
            this.markers.map((m) => m.setVisible(true));
          } else {
            this.data.map((d) => {
              if (this.chosen.country.value != -1) {
                if (this.chosen.type.value == -1) {
                  if (d.filters.country === this.chosen.country.value) {
                    id.push(d.data.id);
                  }
                } else if (this.chosen.type.value != -1) {
                  if (
                    d.filters.country === this.chosen.country.value &&
                    d.filters.type === this.chosen.type.value
                  ) {
                    id.push(d.data.id);
                  }
                }
              } else if (this.chosen.country.value == -1) {
                if (this.chosen.type.value != -1) {
                  if (d.filters.type === this.chosen.type.value) {
                    id.push(d.data.id);
                  }
                }
              }
            });
            this.markers.map((m) => {
              if (id.includes(m.id)) {
                m.setVisible(true);
              } else {
                m.setVisible(false);
              }
            });
          }
        } else {
          Vue.set(this.chosen, 'location', {
            value: val,
            title: val
          });
          this.data.map((d) => {
            if (d.filters.name === val) {
              if (this.chosen.country.value != -1) {
                if (this.chosen.type.value == -1) {
                  if (d.filters.country === this.chosen.country.value) {
                    id.push(d.data.id);
                  }
                } else if (this.chosen.type.value != -1) {
                  if (
                    d.filters.country === this.chosen.country.value &&
                    d.filters.type === this.chosen.type.value
                  ) {
                    id.push(d.data.id);
                  }
                }
              } else if (this.chosen.country.value == -1) {
                if (this.chosen.type.value != -1) {
                  if (d.filters.type === this.chosen.type.value) {
                    id.push(d.data.id);
                  }
                } else {
                  id.push(d.data.id);
                }
              }
            }
          });
          this.markers.map((m) => {
            if (id.includes(m.id)) {
              m.setVisible(true);
            } else {
              m.setVisible(false);
            }
          });
        }
      } else if (item === 'camera') {
        const t = e.target;
        Vue.set(this.chosen, item, t.checked);
        if (!t.checked) {
          const { ...temp } = JSON.parse(JSON.stringify(this.chosen));
          this.filter(undefined, temp.country.value, 'country');
          this.filter(undefined, temp.type.value, 'type');
          this.filter(undefined, temp.location.value, 'location');
        } else {
          this.data.map((d) => {
            if (d.camera) {
              id.push(d.data.id);
            }
          });
          this.markers.map((m) => {
            if (!id.includes(m.id)) {
              m.setVisible(false);
            }
          });
        }
      }
    }
  },
  head() {
    return {
      title:
        'Пограничные переходы от системы автоматизации логистических процессов TransTechSystem',
      meta: [
        {
          name: 'description',
          content:
            'Информация о пограничных переходах от TransTechSystem - система автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
@import '~/static/scss/index/with-caption.scss';
@import '~/static/scss/index/dpsu.scss';
</style>
