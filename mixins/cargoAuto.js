import GoogleMapsApiLoader from 'google-maps-api-loader';
import Vue from 'vue';
import Loading from '~/components/Loading.vue';
import 'vue2-datepicker/locale/ru';

export default {
  components: {
    Loading
  },
  data() {
    return {
      docRef: this.$random([]),
      saved: false,
      addresses: [],
      mapLoading: true,
      map: undefined,
      marker: undefined,
      google: undefined,
      geocoder: undefined,
      selectedAddress: undefined,
      selectedAddressObj: {},
      load: [],
      unload: [],
      loadObj: [],
      unloadObj: [],
      quantityInput: true,
      equipmentFlag: true,
      lang: {
        formatLocale: {
          firstDayOfWeek: 1
        }
      },
      prepay: '*',
      prepayPlaceholder: '',
      disabledSubmit: false,
      templateValue: '',
      disabledTemplate: true,
      templateRequired: false,
      vehicles: {
        tractors: [],
        trucks: [],
        trailers: [],
        semitrailers: []
      },
      sVehicles: []
    };
  },
  computed: {
    claimId() {
      return `claim${this.$capitalize(this.collection)}Id`;
    }
  },
  async mounted() {
    this.$el.addEventListener(
      'click',
      (e) => {
        if (e.target.closest('.equipment-add') === null) {
          this.hideAddEquipment();
        }
        if (e.target.closest('.map-section') === null) {
          this.hideRouteInput();
        }
      },
      false
    );
    // let apiReq;
    const apiKey = `${process.env.API_KEY}`;
    // try {
    //   apiReq = await this.$google.getKey();
    //   apiKey = apiReq.key;
    // } catch (e) {
    //   try {
    //     apiReq = await this.$google.getKey();
    //     apiKey = apiReq.key;
    //     console.log(e);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    try {
      this.google = await GoogleMapsApiLoader({
        apiKey
      });
    } catch (e) {
      try {
        this.google = await GoogleMapsApiLoader({
          apiKey
        });
        console.log(e);
      } catch (e) {
        console.log(e);
      }
    }
  },
  methods: {
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
    makeCorrectSection(e) {
      const s = e.target.closest('.role-input');
      for (const i of s.querySelectorAll('.incorrect')) {
        this.$reject({ target: i });
      }
    },
    radioChange(e) {
      const el = e.target;
      this.makeCorrectSection(e);
      for (const y in this) {
        if (y.endsWith('Disabled')) {
          if (!y.includes(el.value)) {
            this[y] = true;
          }
        }
      }
      this.alwaysValue = {};
      this.readyUnloadValue = {};
      this[`${el.value}Disabled`] = false;
      if (el.value === 'calendar') {
        this.dateFrom = new Date();
        this.dateBy = new Date();
        this.dateFrom.setHours(3, 0, 0);
        this.dateBy.setHours(3, 0, 0);
      } else {
        this.dateFrom = '';
        this.dateBy = '';
      }
    },
    controlDate() {
      const ob = this.obj.loading_time.by_calendar;
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
    templateChange(e) {
      const el = e.target.checked;
      if (el) {
        this.disabledTemplate = false;
        this.templateRequired = true;
        this.templateValue = `${this.companyName}${
          this.$isEmpty(this.companyName) ? '' : '_'
        }${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}`;
      } else {
        this.disabledTemplate = true;
        this.templateRequired = false;
        this.templateValue = '';
      }
    },
    async removeRoute(collection, index) {
      const dir = collection === 'load' ? 'from' : 'to';
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        let id;
        if (collection === 'load') {
          id = this.obj.routes[dir].find((a) => a.order === index + 1).id;
        } else {
          id = this.obj.routes[dir].find((a) => {
            const i = index === this[collection].length - 1 ? 1 : index + 2;
            if (a.order === i) {
              return true;
            }
          }).id;
        }
        await this.$claim.deleteAttr(this.collection, 'route', {
          [this.claimId]: this.id,
          id
        });
        this[collection].splice(index, 1);
        if (collection === 'load') {
          this.obj.routes[dir].splice(
            this.obj.routes[dir].findIndex((a) => a.order === index + 1),
            1
          );
        } else {
          this.obj.routes[dir].splice(
            this.obj.routes[dir].findIndex((a) => a.id === id),
            1
          );
          await this.orderRoute(collection);
        }
        if (this.$isEmpty(this[collection])) {
          try {
            this.hasChanges();
          } catch (e) {
            this.$errorHandle(e);
          }
        } else {
          await this.orderRoute(collection);
        }
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    async orderRoute(collection) {
      const dir = collection === 'load' ? 'from' : 'to';
      const y = [];
      let c = 0;
      for (const i of this[collection]) {
        const ar = JSON.parse(
          JSON.stringify(this.obj.routes[dir].find((a) => a.title === i))
        );
        if (collection === 'load') {
          ar.order = y.length + 1;
        } else if (collection === 'unload') {
          if (c < this[collection].length - 1) {
            ar.order = c + 2;
          } else {
            ar.order = 1;
          }
        }
        y.push(ar);
        ++c;
      }
      const q = [];
      for (const i of y) {
        q.push(
          new Promise((resolve, reject) => {
            (async () => {
              try {
                await this.$claim.routeOrder(this.collection, {
                  [this.claimId]: this.id,
                  id: i.id,
                  order: i.order
                });
                resolve();
              } catch (e) {
                reject(e);
              }
            })();
          })
        );
      }
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await Promise.all(q);
        for (const i of y) {
          this.obj.routes[dir].find((a) => a.title === i.title).order = i.order;
        }
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    showRouteInput(e) {
      this.$cancel();
      const t = e.target.closest('.m-container');
      const mS = t.parentElement;
      const i = t.nextElementSibling;
      this.$reject({ target: t.closest('.sub-input') });
      for (const r of document.querySelectorAll('.map-section')) {
        if (r !== mS) {
          r.querySelector('.map-section-map').classList.add('d-opaq');
          r.querySelector('.m-input').classList.add('d-opaq');
          r.querySelector('.m-container').classList.remove('d-opaq');
        }
      }
      this.mapLoading = true;
      [...this.addresses] = [];
      document.querySelector('html,body').scrollTo({
        behavior: 'smooth',
        top: mS.offsetTop
      });
      t.classList.add('d-opaq');
      i.classList.remove('d-opaq');
      this.$nextTick(() => {
        setTimeout(() => {
          i.querySelector('input').focus();
          i.querySelector('input').value = '';
        }, 200);
      });
    },
    hideRouteInput() {
      for (const r of document.querySelectorAll('.map-section')) {
        r.querySelector('.map-section-map').classList.add('d-opaq');
        this.$nextTick(() => {
          r.querySelector('.m-input').classList.add('d-opaq');
          r.querySelector('.m-container').classList.remove('d-opaq');
        });
      }
    },
    startAutocomplete(e) {
      const t = e.target;
      const m = t.closest('.m-input');
      const l = m.querySelector('.loading_img');
      const v = t.value;
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
              [...this.addresses] = y.map((a) => ({ title: a, value: a }));
            } else if (ob.status.includes('ZERO')) {
              this.$waiting(l, false);
              if (!this.$isEmpty(this.addresses)) {
                [...this.addresses] = [];
              }
            }
          })
          .catch((e) => {
            [...this.addresses] = [];
            this.$errorHandle(e);
            this.$waiting(l, false);
          });
      } else if (v.length < 3) {
        this.$waiting(l, false);
        if (!this.$isEmpty(this.addresses)) {
          [...this.addresses] = [];
        }
      }
    },
    chooseRoute(collection, route) {
      if (route.title) {
        const mS = this.$refs[collection];
        const i = mS.querySelector('.m-input');
        const m = mS.querySelector('.map-section-map');
        const ok = m.querySelector('.ok');
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
        i.classList.add('d-opaq');
        m.classList.remove('d-opaq');
        i.querySelector('input').value = '';
        const vm = this;
        this.$google
          .address(route.title)
          .then((r) => {
            this.geocoder = new this.google.maps.Geocoder();
            const ob = r;
            const geo = ob.results[0].geometry.location;
            const address = ob.results[0].address_components;
            const city = address.find((a) => a.types.includes('locality'));
            const city1 = address.find((a) =>
              a.types.includes('administrative_area_level_1')
            );
            const country = address.find((a) => a.types.includes('country'));
            const street = address.find((a) => a.types.includes('route'));
            const home = address.find((a) => a.types.includes('street_number'));
            this.selectedAddressObj.iso = country.short_name;
            const point = (obj) => {
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
                  }
                }
              );
            };
            point({
              address: country.long_name,
              title: 'country',
              value: country.long_name
            });
            if (!vm.$isEmpty(city)) {
              point({
                address: city.long_name + ', ' + country.long_name,
                title: 'city',
                value: city.long_name
              });
            }
            if (vm.$isEmpty(city) && !vm.$isEmpty(city1)) {
              point({
                address: city1.long_name + ', ' + country.long_name,
                title: 'city',
                value: city1.long_name
              });
            }
            if (!vm.$isEmpty(street)) {
              point({
                address:
                  street.long_name +
                  ', ' +
                  city.long_name +
                  ', ' +
                  country.long_name,
                title: 'street',
                value: street.long_name
              });
            }
            if (!vm.$isEmpty(home)) {
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
              });
            }
            this.map = new this.google.maps.Map(
              this.$refs[collection].querySelector('.map'),
              {
                center: { lat: geo.lat, lng: geo.lng },
                zoom: 17,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
              }
            );
            this.marker = new this.google.maps.Marker({
              position: { lat: geo.lat, lng: geo.lng },
              map: this.map,
              title: `Пункт ${collection === 'load' ? 'загрузки' : 'выгрузки'}`,
              draggable: true
            });
            this.google.maps.event.addListenerOnce(
              this.map,
              'tilesloaded',
              () => {
                this.mapLoading = false;
                ok.classList.remove('d-opaq');
              }
            );
            this.google.maps.event.addListener(this.marker, 'dragend', (e) => {
              if (this.marker) {
                this.marker.setPosition(e.latLng);
              } else {
                this.marker = new this.google.maps.Marker({
                  position: e.latLng,
                  map: this.map
                });
              }
              this.geocoder.geocode(
                { latLng: e.latLng, language: 'ru' },
                function(results, status) {
                  if (status === this.google.maps.GeocoderStatus.OK) {
                    const address = results[0].address_components;
                    const add = [];
                    const city = address.find((a) =>
                      a.types.includes('locality')
                    );
                    const city1 = address.find((a) =>
                      a.types.includes('administrative_area_level_1')
                    );
                    const country = address.find((a) =>
                      a.types.includes('country')
                    );
                    const street = address.find((a) =>
                      a.types.includes('route')
                    );
                    const home = address.find((a) =>
                      a.types.includes('street_number')
                    );
                    vm.selectedAddressObj.iso = country.short_name;
                    add.push(country.long_name);
                    point({
                      address: country.long_name,
                      title: 'country',
                      value: country.long_name
                    });
                    if (!vm.$isEmpty(city)) {
                      add.unshift(city.long_name);
                    }
                    if (vm.$isEmpty(city) && !vm.$isEmpty(city1)) {
                      add.unshift(city1.long_name);
                    }
                    if (!vm.$isEmpty(street)) {
                      add.unshift(street.long_name);
                      if (!vm.$isEmpty(home)) {
                        add[0] = street.long_name + ' ' + home.long_name;
                      }
                    }
                    vm.selectedAddress = add.join(', ');
                    vm.selectedAddressObj.title = vm.selectedAddress;
                    if (!vm.$isEmpty(city)) {
                      point({
                        address: city.long_name + ', ' + country.long_name,
                        title: 'city',
                        value: city.long_name
                      });
                    }
                    if (vm.$isEmpty(city) && !vm.$isEmpty(city1)) {
                      point({
                        address: city1.long_name + ', ' + country.long_name,
                        title: 'city',
                        value: city1.long_name
                      });
                    }
                    if (!vm.$isEmpty(street)) {
                      point({
                        address:
                          street.long_name +
                          ', ' +
                          city.long_name +
                          ', ' +
                          country.long_name,
                        title: 'street',
                        value: street.long_name
                      });
                    }
                    if (!vm.$isEmpty(home)) {
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
                      });
                    }
                  }
                }
              );
            });
          })
          .catch((e) => {
            this.$errorHandle(e);
            [...this.addresses] = [];
          });
      }
    },
    async saveRoute(collection) {
      const mS = this.$refs[collection];
      const c = mS.querySelector('.m-container');
      const m = mS.querySelector('.map-section-map');
      const ok = m.querySelector('.ok');
      const dir = collection === 'load' ? 'from' : 'to';
      m.classList.add('d-opaq');
      c.classList.remove('d-opaq');
      if (
        this.$isEmpty(
          this.obj.routes[dir].find((a) => a.title === this.selectedAddress)
        )
      ) {
        if (collection === 'load') {
          this[collection].push(this.selectedAddress);
        } else if (collection === 'unload') {
          if (this.$isEmpty(this[collection])) {
            this[collection].push(this.selectedAddress);
          } else {
            this[collection].splice(
              this[collection].length - 1,
              0,
              this.selectedAddress
            );
          }
        }
        this.obj.routes[dir].push(this.selectedAddressObj);
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          await this.hasChanges();
          try {
            const y = JSON.parse(JSON.stringify(this.selectedAddressObj));
            delete y.title;
            y[this.claimId] = this.id;
            const r = await this.$claim.putAttr(this.collection, 'route', y);
            Vue.set(
              this.obj.routes[dir][this.obj.routes[dir].length - 1],
              'id',
              r.id
            );
            if (collection === 'unload') {
              if (this[collection].length > 1) {
                await this.orderRoute(collection);
              }
            }
          } catch (e) {
            this.$errorHandle(e);
            this[collection].splice(this[collection].length - 1, 1);
            this.obj.routes[dir].splice(
              this.obj.routes[dir][this.obj.routes[dir].length - 1]
            );
          }
        } catch (e) {
          this.$errorHandle(e);
          this[collection].splice(this[collection].length - 1, 1);
          this.obj.routes[dir].splice(
            this.obj.routes[dir][this.obj.routes[dir].length - 1]
          );
        }
      }
      this.$nextTick(() => {
        this.selectedAddress = '';
        ({ ...this.selectedAddressObj } = {});
        ok.classList.add('d-opaq');
      });
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    async removeEquipment(index) {
      const equipment = this[this.collection].equipment;
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        const p = {
          title: this.$capitalize(equipment[index].title),
          value: equipment[index].title
        };
        await this.$claim.deleteAttr(this.collection, 'equipment', {
          [this.claimId]: this.id,
          id: equipment[index].id
        });
        this.equipmentValues.push(p);
        [...this.equipmentValues] = this.sorted(this.equipmentValues);
        this.equipmentFlag = !this.equipmentFlag;
        equipment.splice(index, 1);
        await this.hasChanges();
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
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
      const equipment = this[this.collection].equipment;
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
      const e = this.$el.querySelector('.equipment-add');
      const c = e.querySelector('.m-container');
      const d = e.querySelector('.d-element');
      const i = d.querySelector('.m-input input');
      const a = d.querySelector('img');
      i.value = '';
      a.classList.add('d-opaq');
      this.quantityInput = true;
      d.classList.add('d-opaq');
      c.classList.remove('d-opaq');
      this.equipmentFlag = !this.equipmentFlag;
      const equipment = this[this.collection].equipment;
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
    async addEquipment(e) {
      const t = e.target;
      const p = t.previousElementSibling.querySelector('input');
      const equipment = this[this.collection].equipment;
      const title = equipment[equipment.length - 1].title;
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.hasChanges();
        const r = await this.$claim.putAttr(this.collection, 'equipment', {
          [this.claimId]: this.id,
          name: title,
          value: p.value
        });
        this.equipmentValues.splice(
          this.equipmentValues.findIndex((a) => a.value === title),
          1
        );
        equipment[equipment.length - 1].quantity = p.value;
        equipment[equipment.length - 1].id = r.id;
        this.quantityInput = true;
        this.equipmentFlag = !this.equipmentFlag;
        if (this.$isEmpty(this.equipmentValues)) {
          this.hideAddEquipment();
        }
        this.keep();
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    keep() {
      this.$el
        .querySelector('.equipment-add .d-element')
        .classList.remove('d-opaq');
    }
  }
};
