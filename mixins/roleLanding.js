import { mapState } from 'vuex';
import Vue from 'vue';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import MarkerClusterer from '@google/markerclustererplus';
import Loading from '~/components/Loading.vue';
import 'vue2-datepicker/locale/ru';

export default {
  loading: false,
  components: {
    Loading
  },
  data() {
    return {
      loading: true,
      mapLoading: true,
      map: undefined,
      markers: undefined,
      markerCluster: undefined,
      google: undefined,
      disabledButton: false,
      addressesLoad: [],
      addressesUnload: [],
      load: [],
      unload: [],
      selectedAddress: undefined,
      selectedAddressObj: {},
      currency: {
        title: 'UAH',
        value: 'UAH'
      },
      tabs: [
        {
          title: 'ПОИСК ГРУЗА',
          value: 'cargo'
        },
        {
          title: 'ПОИСК АВТО',
          value: 'car'
        }
      ],
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        }
      },
      profitOptions: {
        slidesPerView: 3,
        slidesPerColumn: 1,
        spaceBetween: 10,
        speed: 500,
        autoplay: {
          delay: 2000
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets'
        },
        breakpoints: {
          540: {
            slidesPerView: 1,
            spaceBetween: 0,
            slidesPerColumn: 1
          }
        }
      }
    };
  },
  computed: {
    ...mapState(['mobile', 'readySelect', 'alwaysSelect']),
    route() {
      return this.$route.name;
    },
    allAllowed() {
      return true;
    },
    obj() {
      return this[this.goal];
    },
    disabled() {
      if (
        this.$isEmpty(this.obj.routes.from) ||
        this.$isEmpty(this.obj.routes.to) ||
        this.disabledButton
      ) {
        return true;
      } else {
        return false;
      }
    },
    calendarFrom: {
      get() {
        const d = this.obj.loadingTimeByCalendar.dateFrom;
        return typeof d === 'string' ? new Date(d) : d;
      },
      set(val) {
        const ob = this.obj.loadingTimeByCalendar;
        Vue.set(ob, 'dateFrom', val);
        this.controlDate();
        for (const i of this.$el.querySelectorAll('.c-input')) {
          this.$reject({ target: i });
        }
      }
    },
    calendarBy: {
      get() {
        const d = this.obj.loadingTimeByCalendar.dateBy;
        return typeof d === 'string' ? new Date(d) : d;
      },
      set(val) {
        const ob = this.obj.loadingTimeByCalendar;
        Vue.set(ob, 'dateBy', val);
        this.controlDate();
        for (const i of this.$el.querySelectorAll('.c-input')) {
          this.$reject({ target: i });
        }
      }
    }
  },
  async mounted() {
    // let apiReq;
    const apiKey = `${process.env.API_KEY}`;
    // try {
    //   // apiReq = await this.$google.getKey();
    //   // apiKey = apiReq.key;
    //   apiKey = 'AIzaSyAFxrTlEnVkMCULRHh3heTR6t3ZX8Xf78Q';
    // } catch (e) {
    //   try {
    //     // apiReq = await this.$google.getKey();
    //     // apiKey = apiReq.key;
    //     console.log(e);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
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
      }
    }
    this.$nextTick(() => {
      this.$store.commit('search/clear');
      this.loading = undefined;
      this.$nuxt.$loading.finish();
    });
  },
  watch: {
    goal(newV) {
      this.$nextTick(() => {
        this.collection = newV;
        this.createMap();
        ({ ...this.car } = {
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
        });
        ({ ...this.cargo } = {
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
        });
        this.$zIndexing();
      });
    }
  },
  methods: {
    clear(dir) {
      switch (dir) {
        case 'from': {
          this.dateFrom = '';
          break;
        }
        case 'to': {
          this.dateBy = '';
          break;
        }
      }
    },
    createMap() {
      if (!this.$isEmpty(this.markers)) {
        this.markers.map((m) => m.setVisible(false));
        this.$nextTick(() => {
          Vue.set(this, 'markers', undefined);
        });
      }
      this.map = new this.google.maps.Map(
        this.$el.querySelector('.map-frame .google-map'),
        {
          center: { lat: 49.0445326, lng: 31.9644786 },
          zoom: 5,
          zoomControl: this.mobile,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        }
      );
      this.google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
        this.mapLoading = false;
        this.$nuxt.$loading.finish();
      });
    },
    controlDate() {
      const ob = this.obj.loadingTimeByCalendar;
      if (this.$isEmpty(ob.dateBy)) {
        ob.dateBy = new Date();
      }
      if (this.$isEmpty(ob.dateFrom)) {
        ob.dateFrom = new Date();
      }
      const fr =
        typeof ob.dateFrom === 'string' ? new Date(ob.dateFrom) : ob.dateFrom;
      const by =
        typeof ob.dateBy === 'string' ? new Date(ob.dateBy) : ob.dateBy;
      fr.setHours(3, 0, 0, 0);
      by.setHours(3, 0, 0, 0);
      const f = fr.getTime();
      const t = by.getTime();
      if (f > t) {
        ob.dateBy = ob.dateFrom;
      }
    },
    chooseRoute(collection, route) {
      if (route.title) {
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        const dir = collection === 'load' ? 'from' : 'to';
        const l = this.obj.routes[dir].length;
        this.selectedAddress = route.title;
        this.selectedAddressObj = {
          title: route.title,
          type: dir,
          order: l + 1,
          home: {},
          street: {},
          city: {},
          country: {}
        };
        const vm = this;
        this.$google
          .address(route.title)
          .then((r) => {
            if (!this.google) {
              (async () => {
                await this.createGoogle();
              })();
            }
            this.geocoder = new this.google.maps.Geocoder();
            const ob = r;
            const address = ob.results[0].address_components;
            const city = address.find((a) => a.types.includes('locality'));
            const city1 = address.find((a) =>
              a.types.includes('administrative_area_level_1')
            );
            const country = address.find((a) => a.types.includes('country'));
            const street = address.find((a) => a.types.includes('route'));
            const home = address.find((a) => a.types.includes('street_number'));
            vm.selectedAddressObj.iso = country.short_name;
            const p = [];
            const point = (obj) => {
              return new Promise((resolve, reject) => {
                this.geocoder.geocode(
                  { address: obj.address, language: 'ru' },
                  function(results, status) {
                    if (status === this.google.maps.GeocoderStatus.OK) {
                      const r = results[0].geometry;
                      const latArr = r.location
                        .lat()
                        .toString()
                        .split('.');
                      const lngArr = r.location
                        .lng()
                        .toString()
                        .split('.');
                      let lat = latArr[0];
                      let lng = lngArr[0];
                      if (!vm.$isEmpty(latArr[1])) {
                        let f = latArr[1];
                        if (f.length > 5) {
                          f = f.substr(0, 5);
                        }
                        lat += '.' + f;
                      }
                      if (!vm.$isEmpty(lngArr[1])) {
                        let f = lngArr[1];
                        if (f.length > 5) {
                          f = f.substr(0, 5);
                        }
                        lng += '.' + f;
                      }
                      vm.selectedAddressObj[obj.title] = {
                        default: obj.value,
                        latitude: Number.parseFloat(lat),
                        longitude: Number.parseFloat(lng)
                      };
                      resolve();
                    }
                  }
                );
              });
            };
            p.push(
              point({
                address: country.long_name,
                title: 'country',
                value: country.long_name
              })
            );
            if (!vm.$isEmpty(city)) {
              p.push(
                point({
                  address: city.long_name + ', ' + country.long_name,
                  title: 'city',
                  value: city.long_name
                })
              );
            }
            if (vm.$isEmpty(city) && !vm.$isEmpty(city1)) {
              p.push(
                point({
                  address: city1.long_name + ', ' + country.long_name,
                  title: 'city',
                  value: city1.long_name
                })
              );
            }
            if (!vm.$isEmpty(street)) {
              p.push(
                point({
                  address:
                    street.long_name +
                    ', ' +
                    city.long_name +
                    ', ' +
                    country.long_name,
                  title: 'street',
                  value: street.long_name
                })
              );
            }
            if (!vm.$isEmpty(home)) {
              p.push(
                point({
                  address:
                    street.long_name +
                    ', ' +
                    home.long_name +
                    ', ' +
                    city.long_name +
                    ', ' +
                    country.long_name,
                  title: 'home',
                  value: home.long_name
                })
              );
            }
            (async () => {
              await Promise.all(p);
              vm.saveRoute(collection);
            })();
          })
          .catch((e) => {
            this.$errorHandle(e);
            [...this.addressesLoad] = [];
            [...this.addressesUnload] = [];
            if (this.mobile) {
              this.mobLoading = false;
            } else {
              this.$screen(false);
            }
          });
      }
    },
    startAutocomplete(e, collection) {
      const t = e.target;
      const m = t.closest('.m-input');
      const l = m.querySelector('.loading_img');
      const v = t.value;
      const dir = collection === 'load' ? 'from' : 'to';
      if (
        !this.$isEmpty(
          this[
            `addresses${this.$capitalize(
              collection === 'load' ? 'unload' : 'load'
            )}`
          ]
        )
      ) {
        [
          ...this[
            `addresses${this.$capitalize(
              collection === 'load' ? 'unload' : 'load'
            )}`
          ]
        ] = [];
      }
      if (!this.$isEmpty(this.obj.routes[dir])) {
        [...this.obj.routes[dir]] = [];
      }
      this.$cancel();
      if (v.length > 2) {
        this.$waiting(l, true);
        this.$google
          .autocomplete(v)
          .then((r) => {
            const ob = r;
            if (ob.status === 'OK') {
              const y = [];
              for (const a of ob.predictions) {
                y.push(a.description);
              }
              [
                ...this[`addresses${this.$capitalize(collection)}`]
              ] = y.map((a) => ({ title: a, value: a }));
            } else if (ob.status.includes('ZERO')) {
              this.$waiting(l, false);
              if (
                !this.$isEmpty(this[`addresses${this.$capitalize(collection)}`])
              ) {
                [...this[`addresses${this.$capitalize(collection)}`]] = [];
              }
            }
          })
          .catch((e) => {
            [...this[`addresses${this.$capitalize(collection)}`]] = [];
            this.$errorHandle(e);
            this.$waiting(l, false);
          });
      } else if (v.length < 3) {
        this.$waiting(l, false);
        if (!this.$isEmpty(this[`addresses${this.$capitalize(collection)}`])) {
          [...this[`addresses${this.$capitalize(collection)}`]] = [];
        }
      }
    },
    saveRoute(collection) {
      const dir = collection === 'load' ? 'from' : 'to';
      Vue.set(this[collection], 0, this.selectedAddress);
      Vue.set(
        this.obj.routes[dir],
        0,
        JSON.parse(JSON.stringify(this.selectedAddressObj))
      );
      this.$nextTick(() => {
        this.selectedAddress = '';
        ({ ...this.selectedAddressObj } = {});
        [...this.addressesLoad] = [];
        [...this.addressesUnload] = [];
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      });
    },
    sorted(arr) {
      const [...y] = arr;
      y.sort((a, b) => {
        const a1 = a.title.toLowerCase();
        const b1 = b.title.toLowerCase();
        if (a1 > b1) {
          return 1;
        } else if (a1 < b1) {
          return -1;
        } else {
          return 0;
        }
      });
      return y;
    },
    select(e, val) {
      const n = e.target
        .closest('.m-select')
        .querySelector('input')
        .getAttribute('name');
      this.obj[n] = val;
    },
    multiselect(e, val) {
      const n = e.target
        .closest('.m-select')
        .querySelector('input')
        .getAttribute('name');
      [...this.obj[n]] = val;
    },
    clearDate(collection) {
      Vue.set(this.obj.loadingTimeByCalendar, collection, '');
    },
    async search(e) {
      if (!this.disabled) {
        const b = e.target.closest('.m-button');
        let correct = true;
        const errors = [];
        const q = {};
        const weight = this.collection === 'car' ? 'carrying' : 'cargoWeight';
        const volume = this.collection === 'car' ? 'carVolume' : 'cargoVolume';
        if (
          this.$isEmpty(this.obj[weight].gte) &&
          this.$isEmpty(this.obj[weight].lte)
        ) {
        } else {
          for (const i in this.obj[weight]) {
            if (this.$isEmpty(this.obj[weight][i])) {
              errors.push('Заполните все поля или ни одного в поле Масса');
              correct = false;
            }
          }
        }

        if (
          this.$isEmpty(this.obj[volume].gte) &&
          this.$isEmpty(this.obj[volume].lte)
        ) {
        } else {
          for (const i in this.obj[volume]) {
            if (this.$isEmpty(this.obj[volume][i])) {
              errors.push('Заполните все поля или ни одного в поле Объём');
              correct = false;
            }
          }
        }
        if (
          this.$isEmpty(this.obj.loadingTimeByCalendar.dateFrom) &&
          this.$isEmpty(this.obj.loadingTimeByCalendar.dateBy)
        ) {
        } else {
          for (const i in this.obj.loadingTimeByCalendar) {
            if (this.$isEmpty(this.obj.loadingTimeByCalendar[i])) {
              errors.push('Заполните все поля или ни одного в поле Дата');
              correct = false;
            }
          }
        }
        if (
          !this.$isEmpty(this.obj[weight].gte) &&
          !this.$isEmpty(this.obj[weight].lte)
        ) {
          if (
            Number.parseFloat(this.obj[weight].lte) <
            Number.parseFloat(this.obj[weight].gte)
          ) {
            errors.push('"от" не должно быть больше "до" в поле Масса');
            correct = false;
          }
        }
        if (
          !this.$isEmpty(this.obj[volume].gte) &&
          !this.$isEmpty(this.obj[volume].lte)
        ) {
          if (
            Number.parseFloat(this.obj[volume].lte) <
            Number.parseFloat(this.obj[volume].gte)
          ) {
            errors.push('"от" не должно быть больше "до" в поле Объём');
            correct = false;
          }
        }
        if (!this.$isEmpty(errors)) {
          this.$error(undefined, errors.join(' *** '));
        }
        if (correct) {
          this.disabledButton = true;
          this.$toggle(b);
          if (this.mobile) {
            this.mobLoading = true;
          } else {
            this.$screen(true);
          }
          if (!this.$isEmpty(this.obj.bodyTypes)) {
            q.bodyTypes = [];
            this.obj.bodyTypes.map((a) => {
              q.bodyTypes.push({
                value: a.value
              });
            });
          }
          if (this.collection === 'cargo') {
            if (!this.$isEmpty(this.obj.cargoName)) {
              q.cargoName = {
                value: this.obj.cargoName
              };
            }
            if (!this.$isEmpty(this.obj.cargoPackage)) {
              q.cargoPackage = {
                value: this.obj.cargoPackage
              };
            }
          }
          q.routes = [{}, {}];
          const { ...f } = this.obj.routes.from[0];
          const { ...t } = this.obj.routes.to[0];
          // delete f.title;
          // delete t.title;
          // ({ ...q.routes[0] } = f);
          // ({ ...q.routes[1] } = t);
          if (!this.$isEmpty(f.home)) {
            ({ ...q.routes[0].home } = f.home);
          } else if (this.$isEmpty(f.home)) {
            if (!this.$isEmpty(f.street)) {
              ({ ...q.routes[0].street } = f.street);
            } else if (this.$isEmpty(f.street)) {
              if (!this.$isEmpty(f.city)) {
                ({ ...q.routes[0].city } = f.city);
              } else {
                ({ ...q.routes[0].country } = f.country);
              }
            }
          }
          q.routes[0].type = f.type;
          q.routes[0].order = 1;
          if (!this.$isEmpty(t.home)) {
            ({ ...q.routes[1].home } = t.home);
          } else if (this.$isEmpty(t.home)) {
            if (!this.$isEmpty(t.street)) {
              ({ ...q.routes[1].street } = t.street);
            } else if (this.$isEmpty(t.street)) {
              if (!this.$isEmpty(t.city)) {
                ({ ...q.routes[1].city } = t.city);
              } else {
                ({ ...q.routes[1].country } = t.country);
              }
            }
          }
          q.routes[1].type = t.type;
          q.routes[1].order = 1;
          if (
            !this.$isEmpty(this.obj.loadingTimeByCalendar.dateFrom) &&
            !this.$isEmpty(this.obj.loadingTimeByCalendar.dateBy)
          ) {
            q.loadingTimeByCalendar = {
              dateFrom: this.$toISOString(
                this.obj.loadingTimeByCalendar.dateFrom
              ),
              dateBy: this.$toISOString(this.obj.loadingTimeByCalendar.dateBy)
            };
          }
          if (
            !this.$isEmpty(this.obj[volume].gte) &&
            !this.$isEmpty(this.obj[volume].lte)
          ) {
            q[volume] = {
              gte: Number.parseFloat(this.obj[volume].gte),
              lte: Number.parseFloat(this.obj[volume].lte)
            };
          }
          if (
            !this.$isEmpty(this.obj[weight].gte) &&
            !this.$isEmpty(this.obj[weight].lte)
          ) {
            q[weight] = {
              gte: Number.parseFloat(this.obj[weight].gte),
              lte: Number.parseFloat(this.obj[weight].lte)
            };
          }
          if (!this.$isEmpty(q)) {
            try {
              ({ ...this.requestObj } = q);
              q.sorting = {
                date: 'ASC',
                payment: 'DESC',
                weight: 'DESC'
              };
              q.page = 1;
              q.perPage = 10;
              await this.sendForm(q);
            } catch (e) {
              this.$errorHandle(e);
            }
          }
          if (this.mobile) {
            this.mobLoading = false;
          } else {
            this.$screen(false);
          }
          this.disabledButton = false;
          this.$toggle(b);
        }
      }
    },
    async sendForm(q) {
      try {
        const r = await this.$request.find(this.collection, q, true);
        // [...this.found] = [];
        // this.total = r.total;
        // this.tab = 'list';
        if (this.markers !== undefined) {
          this.markers.map((a) => {
            a.setVisible(false);
          });
          this.markerCluster.repaint();
        }
        if (r.total > 0) {
          // this.showFound(r.items);
          this.$store.commit('search/setCollection', {
            [this.goal]: this.obj
          });
          this.$store.commit('search/setFound', r);
          switch (this.$store.getters.logged) {
            case true:
              this.$router.push({ name: `cabinet-find-${this.goal}` });
              break;
            default:
              this.$router.push({ name: `find-${this.goal}` });
              break;
          }
        } else {
          this.map.setZoom(5);
          this.map.setCenter({ lat: 49.3012083, lng: 31.6361787 });
        }
      } catch (e) {
        this.$errorHandle(e);
      }
    },
    showFound(obj, col = undefined) {
      for (const i of obj) {
        if (col) {
          if (i.claimCar) {
            ({ ...i.claim } = i.claimCar);
          } else {
            ({ ...i.claim } = i.claimCargo);
          }
        }
        const found = {};
        found.id = i.claim.id.value;
        found.routes = {
          from: [],
          to: []
        };
        let counter = 1;
        let flag = true;
        while (flag) {
          const f = i.routes.find((a) => {
            if (a.type.default === 'from' && a.order.default === counter) {
              return true;
            }
          });
          const t = i.routes.find((a) => {
            if (a.type.default === 'to' && a.order.default === counter) {
              return true;
            }
          });
          if (!this.$isEmpty(f)) {
            const r = {
              iso: f.iso.default,
              order: counter
            };
            ({ ...r.country } = f.country);
            if (f.city) {
              ({ ...r.city } = f.city);
            }
            if (f.street) {
              ({ ...r.street } = f.street);
            }
            if (f.home) {
              ({ ...r.home } = f.home);
            }
            found.routes.from.push(r);
          }
          if (!this.$isEmpty(t)) {
            const r = {
              iso: t.iso.default,
              order: counter
            };
            ({ ...r.country } = t.country);
            if (t.city) {
              ({ ...r.city } = t.city);
            }
            if (t.street) {
              ({ ...r.street } = t.street);
            }
            if (t.home) {
              ({ ...r.home } = t.home);
            }
            found.routes.to.push(r);
          }
          if (this.$isEmpty(f) && this.$isEmpty(t)) {
            flag = false;
          } else {
            ++counter;
          }
        }
        found.loadingTime = {
          always:
            i.claim.loadingTimeAlways.default === 0
              ? ''
              : this.alwaysSelect.find(
                  (a) => a.value === i.claim.loadingTimeAlways.default
                ).title,
          ready:
            i.claim.loadingTimeReady.default === 0
              ? ''
              : this.readySelect.find(
                  (a) => a.value === i.claim.loadingTimeReady.default
                ).title,
          calendar: {
            dateFrom: i.claim.loadingTimeByCalendar.time
              ? new Date(i.claim.loadingTimeByCalendar.dateFrom)
                  .toLocaleDateString()
                  .substr(0, 5)
              : '',
            dateBy: i.claim.loadingTimeByCalendar.time
              ? new Date(i.claim.loadingTimeByCalendar.dateBy)
                  .toLocaleDateString()
                  .substr(0, 5)
              : ''
          }
        };
        if (!this.$isEmpty(i.bodyTypes)) {
          found.bodyTypes = [];
          i.bodyTypes.map((a) => {
            found.bodyTypes.push(a.value.default);
          });
          found.bodyTypes.sort((a, b) => this.sortBy(a, b));
        }
        this.found.push(found);
        this.$nextTick(() => {
          // if (this.mobile) {
          //   setTimeout(() => {
          //     document.querySelector('html,body').scrollTo({
          //       top: this.$el.querySelector('.tabs').offsetTop,
          //       behavior: 'smooth'
          //     });
          //   }, 100);
          // }
          if (!this.mobile) {
            if (!col) {
              this.showOnMap(this.found);
            }
          }
          setTimeout(() => {
            this.ready = !this.ready;
          }, 160);
        });
      }
    },
    sortBy(a, b, param = undefined) {
      let a1 = a;
      let b1 = b;
      if (param) {
        a1 = isNaN(a[param]) ? a[param].toLowerCase() : a[param];
        b1 = isNaN(b[param]) ? b[param].toLowerCase() : b[param];
      } else if (!param) {
        if (isNaN(a)) {
          a1 = a.toLowerCase();
          b1 = b.toLowerCase();
        }
      }
      if (a1 > b1) {
        return 1;
      } else if (a1 < b1) {
        return -1;
      } else {
        return 0;
      }
    },
    showOnMap(items) {
      if (this.markers !== undefined) {
        this.markers.map((a) => {
          a.setVisible(false);
        });
        this.markerCluster.repaint();
      }
      const from = items[0].routes.from.find((a) => a.order === 1);
      this.markers = items.map((a) => {
        const to = a.routes.to.find((a) => a.order === 1);
        const from = a.routes.from.find((a) => a.order === 1);
        const date = (obj) => {
          if (
            this.$isEmpty(obj.loadingTime.always) &&
            this.$isEmpty(obj.loadingTime.ready)
          ) {
            return `${obj.loadingTime.calendar.dateFrom}-${obj.loadingTime.calendar.dateBy}`;
          } else if (this.$isEmpty(obj.loadingTime.always)) {
            return obj.loadingTime.ready;
          }
          return obj.loadingTime.always;
        };
        const fArr = [];
        const tArr = [];
        if (!this.$isEmpty(from.street.default)) {
          fArr.push(from.street.default);
        }
        if (!this.$isEmpty(from.home.default)) {
          fArr.push(from.home.default);
        }
        if (!this.$isEmpty(from.city.default)) {
          fArr.push(from.city.default);
        }
        fArr.push(from.country.default);
        if (!this.$isEmpty(to.street.default)) {
          tArr.push(to.street.default);
        }
        if (!this.$isEmpty(to.home.default)) {
          tArr.push(to.home.default);
        }
        if (!this.$isEmpty(to.city.default)) {
          tArr.push(to.city.default);
        }
        tArr.push(to.country.default);
        let lat, lng;
        if (!this.$isEmpty(from.home.default)) {
          lat = from.home.latitude;
          lng = from.home.longitude;
        } else if (this.$isEmpty(from.home.default)) {
          if (!this.$isEmpty(from.street.default)) {
            lat = from.street.latitude;
            lng = from.street.longitude;
          } else if (this.$isEmpty(from.street.default)) {
            if (!this.$isEmpty(from.city.default)) {
              lat = from.city.latitude;
              lng = from.city.longitude;
            } else if (this.$isEmpty(from.city.default)) {
              lat = from.country.latitude;
              lng = from.country.longitude;
            }
          }
        }

        return new this.google.maps.Marker({
          position: {
            lat,
            lng
          },
          title: `${fArr.join(', ')} -> ${tArr.join(', ')}
          ${a.bodyTypes.join('\\')}
          ${date(a)}`,
          // fromLat: from.latitude,
          // fromLng: from.longitude,
          // date:
          icon: '/images/marker.png'
        });
      });
      this.markerCluster = new MarkerClusterer(this.map, this.markers, {
        ignoreHidden: true,
        imagePath:
          'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
      this.map.setZoom(this.mobile ? 5 : 6);
      this.map.setCenter({
        lat: from.country.latitude,
        lng: from.country.longitude
      });
    },
    showMore(e) {
      const t = e.target.closest('.article-header');
      const c = t.previousElementSibling;
      const tx = c.children[0];
      c.style.height = tx.offsetHeight + 'px';
      setTimeout(() => {
        t.remove();
      }, 100);
    }
  }
};
