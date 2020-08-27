import { mapState } from 'vuex';
import Vue from 'vue';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import 'vue2-datepicker/locale/ru';

export default {
  data() {
    return {
      direction: 'right-tab',
      mapLoading: true,
      map: undefined,
      markers: undefined,
      google: undefined,
      geocoder: undefined,
      markerCluster: undefined,
      disabledButton: false,
      addressesLoad: [],
      addressesUnload: [],
      load: [],
      unload: [],
      selectedAddress: undefined,
      selectedAddressObj: {},
      equipmentFlag: false,
      quantityInput: false,
      total: 0,
      loadObj: [],
      unloadObj: [],
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        }
      },
      permission_documents: [
        {
          title: 'TIR',
          value: 'TIR'
        },
        {
          title: 'CMR',
          value: 'CMR'
        },
        {
          title: 'T1',
          value: 'T1'
        },
        {
          title: 'Медкнижка',
          value: 'Медкнижка'
        }
      ],
      tabsMobile: [
        {
          title: 'Отобразить списком',
          value: 'list'
        },
        {
          title: 'Отобразить на карте',
          value: 'map'
        }
      ],
      tab: 'list',
      onMap: null
    };
  },
  computed: {
    ...mapState(['mobile']),
    obj() {
      return this[this.collection];
    },
    hasEquipment() {
      try {
        return !this.$isEmpty(
          this.obj.equipments.filter((a) => a !== undefined && a.quantity != 0)
        );
      } catch {
        return false;
      }
    },
    equipment() {
      return this.obj.equipments.filter((a) => a.quantity != 0);
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
    if (this.$route.name !== 'find-car' && this.$route.name !== 'find-cargo') {
      await this.createGoogle();
    }
    this.$nextTick(() => {
      this.onMap = document.querySelector('.on-map');
      const f = this.$store.getters.found;
      if (!this.$isEmpty(f)) {
        this.total = f.total;
        this.showFound(f.items);
      }
      if (
        !this.mobile &&
        this.$route.name !== 'find-car' &&
        this.$route.name !== 'find-cargo'
      ) {
        const wH = window.innerHeight;
        this.onMap.style.height = wH + 'px';
        this.showAll({
          target: document.querySelector('.show-all')
        });
      }
      if (this.$route.name.includes('cabinet-')) {
        this.auctionSocket.on('auction', (res) => {
          if (res.type === 'cancelled') {
            if (
              res.description === 'finished' ||
              res.description === 'deleted'
            ) {
              const i = this.found.find((a) => a.id === res.claimId);
              if (i !== null) {
                if (this.pages === 1) {
                  this.found.splice(i, 1);
                  --this.total;
                } else if (this.pages > 1) {
                  if (this.pages === this.page) {
                    if (this.found > 1) {
                      this.found.splice(i, 1);
                      --this.total;
                    } else {
                      Vue.set(this, 'pageObj', { page: 0 });
                      this.$nextTick(() => {
                        Vue.set(this, 'pageObj', { page: --this.page });
                      });
                    }
                  } else {
                    Vue.set(this, 'pageObj', { page: 0 });
                    this.$nextTick(() => {
                      Vue.set(this, 'pageObj', { page: this.page });
                    });
                  }
                }
                this.markers
                  .find((a) => a.id === res.claimId)
                  .setVisible(false);
                this.markerCluster.repaint();
              } else if (i === null) {
                const left = this.total - this.pages * this.limit;
                if (left === 1) {
                  --this.pages;
                  --this.total;
                }
              }
            } else if (res.description !== 'new') {
              const i = this.found.findIndex((a) => a.id === res.claimId);
              if (i !== -1) {
                const f = this.found[i];
                if (f.auctions) {
                  const w =
                    res.memberFromId === this.$store.getters.member_id ||
                    res.memberToId === this.$store.getters.member_id;
                  if (w) {
                    Vue.delete(f, 'auctions');
                  }
                }
              }
            }
          } else if (res.type === 'accepted') {
            const i = this.found.find((a) => a.id === res.claimId);
            if (i !== null) {
              if (this.pages === 1) {
                this.found.splice(i, 1);
                --this.total;
              } else if (this.pages > 1) {
                if (this.pages === this.page) {
                  if (this.found > 1) {
                    this.found.splice(i, 1);
                    --this.total;
                  } else {
                    Vue.set(this, 'pageObj', { page: 0 });
                    this.$nextTick(() => {
                      Vue.set(this, 'pageObj', { page: --this.page });
                    });
                  }
                } else {
                  Vue.set(this, 'pageObj', { page: 0 });
                  this.$nextTick(() => {
                    Vue.set(this, 'pageObj', { page: this.page });
                  });
                }
              }
              this.markers.find((a) => a.id === res.claimId).setVisible(false);
              this.markerCluster.repaint();
            } else if (i === null) {
              const left = this.total - this.pages * this.limit;
              if (left === 1) {
                --this.pages;
                --this.total;
              }
            }
          }
        });
      }
    });
  },

  watch: {
    tab(newV) {
      if (newV === 'map') {
        this.$nextTick(() => {
          this.createMap();
          this.$nextTick(() => {
            this.showOnMap(this.found);
          });
        });
      } else {
        setTimeout(() => {
          this.ready = !this.ready;
        }, 160);
      }
    }
  },

  methods: {
    getDirection(dir) {
      if (dir) {
        this.direction = dir;
      }
    },
    madeAuction(req, memberId) {
      if (req.auctions === undefined) {
        return false;
      } else if (req.auctions) {
        const i = req.auctions.findIndex(
          (a) => a.from.member_id === memberId || a.to.member_id === memberId
        );
        return i !== -1;
      }
      return false;
    },
    removeEquipment(index) {
      const equipment = this.obj.equipments;
      const p = {
        title: this.$capitalize(equipment[index].title),
        value: equipment[index].title
      };
      this.equipmentValues.push(p);
      [...this.equipmentValues] = this.sorted(this.equipmentValues);
      this.equipmentFlag = !this.equipmentFlag;
      equipment.splice(index, 1);
      const d = this.$el.querySelector('.d-element');
      d.classList.add('d-flex');
      d.classList.remove('d-none');
    },
    showAddEquipment(e) {
      const t = e.target;
      const c = t.closest('.m-container');
      const el = c.nextElementSibling;
      document.querySelector('html,body').scrollTo({
        behavior: 'smooth',
        top: c.parentElement.offsetTop
      });
      c.classList.add('d-opaq');
      el.classList.remove('d-opaq');
      // this.$nextTick(() => {
      //   this.equipmentFlag = !this.equipmentFlag;
      // });
    },
    selectEquipment(e, title) {
      const equipment = this.obj.equipments;
      if (
        this.$isEmpty(
          equipment.find((a) => a !== undefined && a.title === title)
        )
      ) {
        if (!this.$isEmpty(equipment)) {
          if (equipment[equipment.length - 1].quantity != 0) {
            equipment.push({
              title,
              quantity: 0
            });
          } else {
            Vue.set(equipment, equipment.length - 1, {
              title,
              quantity: 0
            });
          }
        } else {
          equipment.push({
            title,
            quantity: 0
          });
        }
      }
      this.quantityInput = false;
      setTimeout(() => {
        e.target
          .closest('.m-select')
          .nextElementSibling.querySelector('input')
          .focus();
        this.keep();
      }, 100);
    },
    enterQuantity(e) {
      const t = e.target;
      const v = t.value;
      const m = t.closest('.m-input');
      const a = m.nextElementSibling;
      if (v.length > 0) {
        a.classList.remove('d-opaq');
      } else {
        a.classList.add('d-opaq');
      }
    },
    hideAddEquipment() {
      const d = this.$el.querySelector('.d-element');
      const i = d.querySelector('.m-input input');
      i.value = '';
      this.quantityInput = true;
      d.classList.add('d-none');
      d.classList.remove('d-flex');
      this.equipmentFlag = !this.equipmentFlag;
      const equipment = this.obj.equipments;
      if (
        !this.$isEmpty(
          equipment.find((a) => a !== undefined && a.quantity == 0)
        )
      ) {
        equipment.splice(
          equipment.findIndex((a) => a !== undefined && a.quantity == 0),
          1
        );
      }
    },
    addEquipment(e) {
      const t = e.target;
      const p = t.previousElementSibling.querySelector('input');
      const equipment = this.obj.equipments;
      const title = equipment[equipment.length - 1].title;
      this.equipmentValues.splice(
        this.equipmentValues.findIndex((a) => a.value === title),
        1
      );
      equipment[equipment.length - 1].quantity = p.value;
      this.quantityInput = true;
      this.equipmentFlag = !this.equipmentFlag;
      if (this.$isEmpty(this.equipmentValues)) {
        this.hideAddEquipment();
      }
      this.keep();
    },
    keep() {
      this.$el.querySelector('.d-element').classList.remove('d-opaq');
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
    clearDate(collection) {
      Vue.set(this.obj.loadingTimeByCalendar, collection, '');
    },
    async createGoogle() {
      const apiKey = `${process.env.API_KEY}`;
      try {
        this.google = await GoogleMapsApiLoader({
          apiKey
        });
        if (!this.mobile) {
          this.createMap();
        }
      } catch (e) {
        try {
          this.google = await GoogleMapsApiLoader({
            apiKey
          });
          if (!this.mobile) {
            this.createMap();
          }
          console.log(e);
        } catch (e) {
          console.log(e);
          // this.$nuxt.$loading.finish();
        }
      }
    },
    createMap() {
      this.map = new this.google.maps.Map(
        document.querySelector('.on-map .map'),
        {
          center: { lat: 49.3012083, lng: 26.1084683 },
          zoom: this.mobile ? 5 : 6,
          zoomControl: true,
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
        try {
          this.loading = undefined;
        } catch {}
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
    selected(name, sub = undefined) {
      if (sub) {
        try {
          return this.obj[name][sub];
        } catch {
          return '';
        }
      }
      return this.obj[name];
    },
    multiselect(e, val) {
      const n = e.target
        .closest('.m-select')
        .querySelector('input')
        .getAttribute('name');
      [...this.obj[n]] = val;
    },
    select(e, val) {
      const n = e.target
        .closest('.m-select')
        .querySelector('input')
        .getAttribute('name');
      this.obj[n] = val;
    },
    orderRoute(collection) {
      const dir = collection === 'load' ? 'from' : 'to';
      const y = [];
      for (const i of this[collection]) {
        const ar = JSON.parse(
          JSON.stringify(this.obj.routes[dir].find((a) => a.title === i))
        );
        ar.order = y.length + 1;
        y.push(ar);
      }
      for (const i of y) {
        this.obj.routes[dir].find((a) => a.title === i.title).order = i.order;
      }
    },
    removeRoute(collection, index) {
      const dir = collection === 'load' ? 'from' : 'to';
      this[collection].splice(index, 1);
      this.obj.routes[dir].splice(
        this.obj.routes[dir].findIndex((a) => a.order === index + 1),
        1
      );
      this.$nextTick(() => {
        const mS = this.$refs[collection];
        mS.classList.remove('d-none');
        mS.classList.add('d-flex');
      });
    },
    showRouteInput(e) {
      const t = e.target.closest('.m-container');
      const mS = t.parentElement;
      const i = t.nextElementSibling;
      this.$reject({ target: t.closest('.sub-input') });
      for (const r of document.querySelectorAll('.map-section')) {
        if (r !== mS) {
          r.querySelector('.m-input').classList.add('d-opaq');
          r.querySelector('.m-container').classList.remove('d-opaq');
        }
      }
      [...this.addresses] = [];
      t.classList.add('d-opaq');
      i.classList.remove('d-opaq');
      this.$nextTick(() => {
        setTimeout(() => {
          i.querySelector('input').focus();
          i.querySelector('input').value = '';
        }, 100);
      });
    },
    hideRouteInput() {
      for (const r of document.querySelectorAll('.map-section')) {
        this.$nextTick(() => {
          r.querySelector('.m-input').classList.add('d-opaq');
          r.querySelector('.m-container').classList.remove('d-opaq');
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
    showExtended(e) {
      if (e.target.textContent.includes('простой')) {
        this.hideExtended(e);
      } else {
        const sB = this.$el.querySelector('.search-bar');
        const h = sB.querySelector('.hidden-options');
        const o = h.children[0];
        const oH = o.offsetHeight;
        h.style.height = `${oH}px`;
        setTimeout(() => {
          h.style.overflow = 'visible';
          h.style.height = `auto`;
          e.target.textContent = 'простой поиск';
          // this.$zIndexing();
        }, 160);
      }
    },
    hideExtended(e) {
      const sB = this.$el.querySelector('.search-bar');
      const h = sB.querySelector('.hidden-options');
      const d = h.querySelector('.d-element');
      const o = h.children[0];
      const oH = o.offsetHeight;
      h.style.overflow = 'hidden';
      h.style.height = `${oH}px`;
      setTimeout(() => {
        h.style.height = '0';
        setTimeout(() => {
          this.obj.equipments.map((a) => {
            if (a.quantity != 0) {
              this.equipmentValues.push(a);
            }
          });
          [...this.obj.equipments] = [];
          this.quantityInput = true;
          d.classList.add('d-flex');
          d.classList.remove('d-none');
          e.target.textContent = 'расширеный поиск';
        }, 160);
      }, 50);
    },
    showAll(e) {
      const t = e.target.closest('.m-container');
      const tt = t.querySelector('span');
      if (tt.textContent.includes('поиск')) {
        const f = t.parentElement;
        const ex = f.children[0];
        const c = ex.children[0];
        const cH = c.offsetHeight;
        ex.style.height = `${cH}px`;
        setTimeout(() => {
          ex.style.height = `auto`;
          ex.style.overflow = `visible`;
          tt.textContent = 'свернуть';
        }, 160);
      } else {
        this.hideAll(e);
      }
    },
    hideAll(e) {
      const t = e.target.closest('.m-container');
      const tt = t.querySelector('span');
      const f = t.parentElement;
      const ex = f.children[0];
      const c = ex.children[0];
      const fE = c.querySelector('.find-expand');
      const cH = c.offsetHeight;
      if (fE.textContent.includes('простой')) {
        this.hideExtended({ target: fE });
      }
      ex.style.height = `${cH}px`;
      setTimeout(() => {
        ex.style.height = `0`;
        ex.style.overflow = `hidden`;
        setTimeout(() => {
          tt.textContent = 'поиск авто';
        }, 160);
      }, 50);
    },
    async sendForm(q) {
      const unReg = !this.$route.name.includes('cabinet-');
      if (!unReg) {
        this.$store.commit('search/clear');
      }
      try {
        const r = await this.$request.find(this.collection, q, unReg);
        [...this.found] = [];
        this.total = r.total;
        this.tab = 'list';
        if (this.markers !== undefined) {
          this.markers.map((a) => {
            a.setVisible(false);
          });
          this.markerCluster.repaint();
        }
        if (r.total > 0) {
          if (unReg) {
            this.$store.commit('search/setCollection', {
              [this.collection]: this.obj
            });
            this.$store.commit('search/setFound', r);
          }
          const div = r.total / this.limit;
          const abs = Math.floor(div);
          this.pages = div > abs ? abs + 1 : abs;
          this.showFound(r.items);
        } else {
          this.map.setZoom(this.mobile ? 5 : 6);
          this.map.setCenter({ lat: 49.3012083, lng: 26.1084683 });
          const wH = window.innerHeight;
          const n =
            this.$route.name === 'find-car' || this.$route.name === 'find-cargo'
              ? 80
              : 0;
          this.onMap.style.height = wH - n + 'px';
        }
      } catch (e) {
        this.$errorHandle(e);
      }
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
          if (!this.$isEmpty(this.obj.equipments)) {
            q.equipments = [];
            this.obj.equipments.map((a) => {
              q.equipments.push({
                name: a.title,
                value: Number.parseInt(a.quantity)
              });
            });
          }
          if (!this.$isEmpty(this.obj.permissionDocuments)) {
            q.permissionDocuments = [];
            this.obj.permissionDocuments.map((a) => {
              q.permissionDocuments.push({
                value: a.value
              });
            });
          }
          if (!this.$isEmpty(this.obj.adrs)) {
            q.adrs = [];
            this.obj.adrs.map((a) => {
              q.adrs.push({
                value: a.value
              });
            });
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
              ({ ...q.sorting } = this.sorting);
              q.page = this.page;
              q.perPage = this.limit;
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
    register() {
      this.$store.commit('setOverlayMode', 'register');
      this.$store.commit('setOverlayVisible', true);
    },
    signin() {
      this.$router.push({
        query: {
          from: `cabinet/find-${this.collection}`
        }
      });
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setOverlayMode', 'signin');
          this.$store.commit('setOverlayVisible', true);
        }, 50);
      });
    }
  }
};
