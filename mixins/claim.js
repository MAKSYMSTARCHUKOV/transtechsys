import Vue from 'vue';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      timer: undefined,
      mobLoading: false
    };
  },
  created() {
    // if (this.$route.query) {
    //   if (this.$route.query.template) {
    //     this.$router.push({ query: {} });
    //   }
    // }
    this.unwatch = this.$store.watch(
      (state, getters) => getters.template,
      (newV, oldV) => {
        if (!this.$isEmpty(newV) && this.$store.getters.drafts) {
          (async () => {
            try {
              await this.reset();
              this.createDraft(newV);
              this.$nextTick(() => {
                Vue.set(this, this.collection, this.draft);
                this.$nextTick(() => {
                  this.$el.querySelector(
                    'textarea[name="description"'
                  ).value = this.obj.description;
                });
                this.$zIndexing();
              });
            } catch (e) {
              this.$errorHandle(e);
            }
            this.$store.commit('profile/hideDraft');
            if (this.mobile) {
              this.mobLoading = false;
            } else {
              this.$screen(false);
            }
          })();
        }
      }
    );
  },
  mounted() {
    this.$nextTick(() => {
      const t = this.$store.getters.template;
      if (!this.$isEmpty(this.draft)) {
        this.callback = () => {
          this.createDraft(this.draft);
          this.$nextTick(() => {
            Vue.set(this, this.collection, this.draft);
            this.$nextTick(() => {
              this.$hideDialog();
              this.$el.querySelector(
                'textarea[name="description"'
              ).value = this.obj.description;
              this.$zIndexing();
              if (!this.$isEmpty(t)) {
                this.$store.commit('profile/hideDraft');
              }
              this.$nuxt.$loading.finish();
              if (this.mobile) {
                this.mobLoading = false;
              } else {
                this.$screen(false);
              }
            });
          });
        };
        this.close = () => {
          this.$claim
            .deleteDraft(this.collection, this.draft.id.value)
            .then((r) => {
              Vue.set(this, 'draft', {});
              this.$hideDialog();
            })
            .catch((e) => {
              this.$hideDialog();
              this.$errorHandle(e);
            });
        };
        if (this.$isEmpty(t)) {
          this.$dialog({
            image: this.$imgSrc('icons/form.svg'),
            text: 'Продолжить с не сохраненной заявки?'
          });
        } else {
          this.callback();
        }
      }
      this.$zIndexing();
      if (this.collection === 'car') {
        (async () => {
          await this.createDrivers();
          await this.createVehicles();
        })();
      }
      this.$nuxt.$loading.finish();
    });
  },
  computed: {
    ...mapState(['readySelect', 'alwaysSelect']),
    obj() {
      return this[this.collection];
    },
    hasEquipment() {
      try {
        return !this.$isEmpty(
          this.obj.equipment.filter((a) => a !== undefined && a.quantity != 0)
        );
      } catch {
        return false;
      }
    },
    equipment() {
      return this.obj.equipment.filter((a) => a.quantity != 0);
    },
    changes: {
      get() {
        return this.$store.state.changes;
      },
      set(v) {
        this.$store.commit('setState', { changes: v });
      }
    },
    message: {
      get() {
        return this.$store.state.message;
      },
      set(v) {
        this.$store.commit('setMessage', v);
        this.changes = true;
      }
    },
    calendarFrom: {
      get() {
        const d = this.obj.loading_time.by_calendar.dateFrom;
        return typeof d === 'string' ? new Date(d) : d;
      },
      async set(val) {
        const ob = this.obj.loading_time.by_calendar;
        const fr = this.obj.loading_time.by_calendar.dateFrom;
        const by = this.obj.loading_time.by_calendar.dateBy;
        Vue.set(ob, 'dateFrom', val);
        this.controlDate();
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          this.hasChanges();
          if (!this.$isEmpty(this.id)) {
            try {
              await this.$claim.putAttr(
                this.collection,
                'loading_time_by_calendar',
                {
                  [this.claimId]: this.id,
                  dateFrom:
                    typeof this.obj.loading_time.by_calendar.dateFrom ===
                    'string'
                      ? this.obj.loading_time.by_calendar.dateFrom
                      : this.$toISOString(
                          this.obj.loading_time.by_calendar.dateFrom
                        ),
                  dateBy:
                    typeof this.obj.loading_time.by_calendar.dateBy === 'string'
                      ? this.obj.loading_time.by_calendar.dateBy
                      : this.$toISOString(
                          this.obj.loading_time.by_calendar.dateBy
                        )
                }
              );
            } catch (e) {
              this.$errorHandle(e);
              Vue.set(ob, 'dateFrom', fr);
              Vue.set(ob, 'dateBy', by);
            }
          }
        } catch (e) {
          this.$errorHandle(e);
          Vue.set(ob, 'dateFrom', fr);
          Vue.set(ob, 'dateBy', by);
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }
    },
    calendarBy: {
      get() {
        const d = this.obj.loading_time.by_calendar.dateBy;
        return typeof d === 'string' ? new Date(d) : d;
      },
      async set(val) {
        const ob = this.obj.loading_time.by_calendar;
        const fr = this.obj.loading_time.by_calendar.dateFrom;
        const by = this.obj.loading_time.by_calendar.dateBy;
        Vue.set(ob, 'dateBy', val);
        this.controlDate();
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          this.hasChanges();
          if (!this.$isEmpty(this.id)) {
            try {
              await this.$claim.putAttr(
                this.collection,
                'loading_time_by_calendar',
                {
                  [this.claimId]: this.id,
                  dateFrom:
                    typeof this.obj.loading_time.by_calendar.dateFrom ===
                    'string'
                      ? this.obj.loading_time.by_calendar.dateFrom
                      : this.$toISOString(
                          this.obj.loading_time.by_calendar.dateFrom
                        ),
                  dateBy:
                    typeof this.obj.loading_time.by_calendar.dateBy === 'string'
                      ? this.obj.loading_time.by_calendar.dateBy
                      : this.$toISOString(
                          this.obj.loading_time.by_calendar.dateBy
                        )
                }
              );
            } catch (e) {
              this.$errorHandle(e);
              Vue.set(ob, 'dateFrom', fr);
              Vue.set(ob, 'dateBy', by);
            }
          }
        } catch (e) {
          this.$errorHandle(e);
          Vue.set(ob, 'dateFrom', fr);
          Vue.set(ob, 'dateBy', by);
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }
    }
  },
  methods: {
    async createVehicles() {
      try {
        ({ ...this.vehicles } = {
          tractors: [],
          trucks: [],
          semitrailers: [],
          trailers: []
        });
        const res = await this.$car.getTotals();
        if (res[0].total !== 0) {
          try {
            const r = await this.$car.getVehicles({
              type: 'CAR_TYPE_TRACTOR',
              page: 1,
              limit: res[0].total + 1
            });
            for (const v of r) {
              const ve = {
                id: v.id.value
              };
              ve.type = 'tractor';
              this.vehicles.tractors.push({
                value: ve,
                title: `${v.number.default} (${
                  v.brand.default === 'other' ? 'Другое' : v.brand.default
                }, ${v.model.default === 'other' ? 'Другое' : v.model.default})`
              });
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        }
        if (res[2].total !== 0) {
          try {
            const r = await this.$car.getVehicles({
              type: 'CAR_TYPE_TRUCK',
              page: 1,
              limit: res[2].total + 1
            });
            for (const v of r) {
              const ve = {
                id: v.id.value
              };
              ve.type = 'truck';
              this.vehicles.trucks.push({
                value: ve,
                title: `${v.number.default} (${
                  v.brand.default === 'other' ? 'Другое' : v.brand.default
                }, ${v.model.default === 'other' ? 'Другое' : v.model.default})`
              });
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        }
        if (res[1].total !== 0) {
          try {
            const r = await this.$car.getVehicles({
              type: 'CAR_TYPE_SEMITRAILER',
              page: 1,
              limit: res[1].total + 1
            });
            for (const v of r) {
              const ve = {
                id: v.id.value
              };
              ve.type = 'semitrailer';
              this.vehicles.semitrailers.push({
                value: ve,
                title: `${v.number.default} (${
                  v.brand.default === 'other' ? 'Другое' : v.brand.default
                }, ${v.model.default === 'other' ? 'Другое' : v.model.default})`
              });
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        }
        if (res[3].total !== 0) {
          try {
            const r = await this.$car.getVehicles({
              type: 'CAR_TYPE_TRAILER',
              page: 1,
              limit: res[3].total + 1
            });
            for (const v of r) {
              const ve = {
                id: v.id.value
              };
              ve.type = 'trailer';
              this.vehicles.trailers.push({
                value: ve,
                title: `${v.number.default} (${
                  v.brand.default === 'other' ? 'Другое' : v.brand.default
                }, ${v.model.default === 'other' ? 'Другое' : v.model.default})`
              });
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        }
      } catch (e) {
        this.$errorHandle(e);
      }
    },
    async createDrivers() {
      Vue.set(this, 'drivers', []);
      try {
        const r = await this.$user.getDrivers();
        for (const d of r) {
          this.drivers.push({
            title: d.user.member.name.default,
            value: {
              id: d.user.id.value,
              icon: d.busy
                ? this.$imgSrc('busy.png')
                : this.$imgSrc('pixel.png')
            }
          });
        }
      } catch (e) {}
    },
    createDraft(draft) {
      let d = {};
      if (this.collection === 'cargo') {
        ({ ...d } = {
          cargo_name: draft.cargoName.default,
          cargo_package: draft.cargoPackage.default,
          adr: this.$isEmpty(draft.adrs)
            ? []
            : draft.adrs.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                title: a.value.default
              })),
          contact: {
            title: draft.contact.member.name.default,
            value: draft.contact.id.value
          },
          cargo_weight:
            draft.cargoWeight.default === 0
              ? ''
              : draft.cargoWeight.default + '',
          cargo_volume:
            draft.cargoVolume.default === 0
              ? ''
              : draft.cargoVolume.default + '',
          cargo_dimensions: {
            length:
              draft.cargoDimensions.length === 0
                ? ''
                : draft.cargoDimensions.length + '',
            width:
              draft.cargoDimensions.width === 0
                ? ''
                : draft.cargoDimensions.width + '',
            height:
              draft.cargoDimensions.height === 0
                ? ''
                : draft.cargoDimensions.height + ''
          },
          partial_load: draft.partialLoad.default,
          equipment: this.$isEmpty(draft.equipments)
            ? []
            : draft.equipments.map((a) => ({
                id: a.id.value,
                title: a.name.default,
                quantity: a.value.default + ''
              })),
          routes: {
            from: [],
            to: []
          },
          body_type: this.$isEmpty(draft.bodyTypes)
            ? []
            : draft.bodyTypes.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                title: a.value.default
              })),
          loading_type: this.$isEmpty(draft.loadingTypes)
            ? []
            : draft.loadingTypes.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                title: a.value.default
              })),
          permission_document: this.$isEmpty(draft.permissionDocuments)
            ? []
            : draft.permissionDocuments.map((a) => ({
                id: a.id.value,
                value: a.value.default
              })),
          cars_count:
            draft.cargoCarsCount.default === 0
              ? ''
              : draft.cargoCarsCount.default + '',
          loading_time: {
            ready:
              draft.loadingTimeReady.default === 0
                ? ''
                : draft.loadingTimeReady.default + '',
            by_calendar: {
              dateFrom:
                draft.loadingTimeByCalendar.time === false
                  ? ''
                  : new Date(draft.loadingTimeByCalendar.dateFrom),
              dateBy:
                draft.loadingTimeByCalendar.time === false
                  ? ''
                  : new Date(draft.loadingTimeByCalendar.dateBy)
            },
            always:
              draft.loadingTimeAlways.default === 0
                ? ''
                : draft.loadingTimeAlways.default + ''
          },
          payment: {
            rate_request: draft.paymentRateRequest.default,
            type: this.$isEmpty(draft.paymentTypes)
              ? []
              : draft.paymentTypes.map((a) => ({
                  id: a.id.value,
                  value: a.value.default,
                  title: a.value.default
                })),
            pay: {
              currency:
                draft.paymentPay.currency === ''
                  ? 'UAH'
                  : draft.paymentPay.currency + '',
              value:
                draft.paymentPay.value === 0 ? '' : draft.paymentPay.value + ''
            },
            bargain: draft.paymentBargain.default,
            show_proposition: draft.paymentShowProposition.default,
            prepay: {
              currency:
                draft.paymentPrepay.currency === ''
                  ? 'UAH'
                  : draft.paymentPrepay.currency + '',
              value:
                draft.paymentPrepay.value === 0
                  ? ''
                  : draft.paymentPrepay.value + ''
            },
            at_unloading: draft.paymentAtUnloading.default
          },
          documents: this.$isEmpty(draft.documents)
            ? []
            : draft.documents.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                name: a.name.default
              })),
          description: draft.description.default
        });
        this.prepay = draft.paymentPrepay.value.default === 0 ? '*' : '';
      } else {
        ({ ...d } = {
          adr: this.$isEmpty(draft.adrs)
            ? []
            : draft.adrs.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                title: a.value.default
              })),
          contact: {
            title: draft.contact.member.name.default,
            value: draft.contact.id.value
          },
          car_volume:
            draft.carVolume.default === 0 ? '' : draft.carVolume.default + '',
          carrying:
            draft.carrying.default === 0 ? '' : draft.carrying.default + '',
          car_dimensions: {
            length:
              draft.carDimensions.length === 0
                ? ''
                : draft.carDimensions.length + '',
            width:
              draft.carDimensions.width === 0
                ? ''
                : draft.carDimensions.width + '',
            height:
              draft.carDimensions.height === 0
                ? ''
                : draft.carDimensions.height + ''
          },
          partial_load: draft.partialLoad.default,
          equipment: this.$isEmpty(draft.equipments)
            ? []
            : draft.equipments.map((a) => ({
                id: a.id.value,
                title: a.name.default,
                quantity: a.value.default + ''
              })),
          routes: {
            from: [],
            to: []
          },
          body_type: this.$isEmpty(draft.bodyTypes)
            ? []
            : draft.bodyTypes.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                title: a.value.default
              })),
          loading_type: this.$isEmpty(draft.loadingTypes)
            ? []
            : draft.loadingTypes.map((a) => ({
                id: a.id.value,
                value: a.value.default,
                title: a.value.default
              })),
          permission_document: this.$isEmpty(draft.permissionDocuments)
            ? []
            : draft.permissionDocuments.map((a) => ({
                id: a.id.value,
                value: a.value.default
              })),
          cars_count:
            draft.carCarsCount.default === 0
              ? ''
              : draft.carCarsCount.default + '',
          loading_time: {
            ready:
              draft.loadingTimeReady.default === 0
                ? ''
                : draft.loadingTimeReady.default + '',
            by_calendar: {
              dateFrom:
                draft.loadingTimeByCalendar.time === false
                  ? ''
                  : new Date(draft.loadingTimeByCalendar.dateFrom),
              dateBy:
                draft.loadingTimeByCalendar.time === false
                  ? ''
                  : new Date(draft.loadingTimeByCalendar.dateBy)
            },
            always:
              draft.loadingTimeAlways.default === 0
                ? ''
                : draft.loadingTimeAlways.default + ''
          },
          payment: {
            rate_request: draft.paymentRateRequest.default,
            type: this.$isEmpty(draft.paymentTypes)
              ? []
              : draft.paymentTypes.map((a) => ({
                  id: a.id.value,
                  value: a.value.default,
                  title: a.value.default
                })),
            pay: {
              currency:
                draft.paymentPay.currency === ''
                  ? 'UAH'
                  : draft.paymentPay.currency + '',
              value:
                draft.paymentPay.value === 0 ? '' : draft.paymentPay.value + ''
            },
            bargain: draft.paymentBargain.default,
            show_proposition: draft.paymentShowProposition.default
          },
          description: draft.description.default,
          driver: this.$isEmpty(draft.driver)
            ? {}
            : JSON.parse(JSON.stringify(draft.driver)),
          tractor: this.$isEmpty(draft.tractor)
            ? {}
            : JSON.parse(JSON.stringify(draft.tractor)),
          trailer: this.$isEmpty(draft.trailer)
            ? {}
            : JSON.parse(JSON.stringify(draft.trailer))
        });
        if (!this.$isEmpty(this.drivers)) {
          if (!this.$isEmpty(d.driver)) {
            this.drivers.splice(
              this.drivers.findIndex((a) => a.value === d.driver.value),
              1
            );
          }
        }
        if (!this.$isEmpty(d.tractor)) {
          this.vehicles[d.tractor.value.type + 's'].splice(
            this.vehicles[d.tractor.value.type + 's'].findIndex(
              (a) => a.value.id === d.tractor.value.id
            ),
            1
          );
          Vue.set(
            this,
            'sVehicles',
            JSON.parse(
              JSON.stringify(
                d.tractor.value.type === 'tractor'
                  ? this.vehicles.semitrailers
                  : this.vehicles.trailers
              )
            )
          );
        }
        if (!this.$isEmpty(d.trailer)) {
          this.sVehicles.splice(
            this.sVehicles.findIndex((a) => a.value.id === d.trailer.value.id),
            1
          );
        }
      }
      const from = draft.routes.filter((a) => a.type.default === 'from');
      const to = draft.routes.filter((a) => a.type.default === 'to');
      if (!this.$isEmpty(from)) {
        from.sort((a, b) => {
          if (a.order.default > b.order.default) {
            return 1;
          } else if (a.order.default < b.order.default) {
            return -1;
          } else if (a.order.default === b.order.default) {
            return 0;
          }
        });
        [...d.routes.from] = from.map((a) => {
          const { ...y } = a;
          y.id = a.id.value;
          y.type = a.type.default;
          y.order = a.order.default;
          return y;
        });
        for (let y = 0; y < from.length; y++) {
          const i = from[y];
          const title = [];
          if (!this.$isEmpty(i.street.default)) {
            title.push(i.street.default);
            if (!this.$isEmpty(i.home.default)) {
              title[0] = i.street.default + ' ' + i.home.default;
            }
          }
          if (!this.$isEmpty(i.city.default)) {
            title.push(i.city.default);
          }
          title.push(i.country.default);

          d.routes.from[y].title = title.join(', ');
          this.load.push(d.routes.from[y].title);
        }
      }
      if (!this.$isEmpty(to)) {
        to.sort((a, b) => {
          if (a.order.default > b.order.default) {
            return 1;
          } else if (a.order.default < b.order.default) {
            return -1;
          } else if (a.order.default === b.order.default) {
            return 0;
          }
        });
        [...d.routes.to] = to.map((a) => {
          const { ...y } = a;
          y.id = a.id.value;
          y.type = a.type.default;
          y.order = a.order.default;
          return y;
        });
        for (let y = 0; y < to.length; y++) {
          const i = to[y];
          const title = [];
          if (!this.$isEmpty(i.street.default)) {
            title.push(i.street.default);
            if (!this.$isEmpty(i.home.default)) {
              title[0] = i.street.default + ' ' + i.home.default;
            }
          }
          if (!this.$isEmpty(i.city.default)) {
            title.push(i.city.default);
          }
          title.push(i.country.default);
          d.routes.to[y].title = title.join(', ');
          this.unload.push(d.routes.to[y].title);
        }
      }
      if (!this.$isEmpty(d.equipment)) {
        const y = [];
        for (const i of this.equipmentValues) {
          if (
            this.$isEmpty(
              d.equipment.find(
                (a) => a.title.toLowerCase() === i.title.toLowerCase()
              )
            )
          ) {
            y.push(i);
          }
        }
        [...this.equipmentValues] = y;
      }
      this.id = draft.id.value;
      ({ ...this.draft } = JSON.parse(JSON.stringify(d)));
    },
    async hasChanges() {
      if (this.$isEmpty(this.id)) {
        if (!this.$isEqual(this.defaultObj[this.collection], this.obj)) {
          this.$cancel();
          try {
            const i = await this.$claim.create(this.collection);
            this.id = i.id;
          } catch (e) {
            this.$errorHandle(e);
          }
        }
      } else if (!this.$isEmpty(this.id)) {
        if (this.$isEqual(this.defaultObj[this.collection], this.obj)) {
          this.$cancel();
          try {
            await this.$claim.deleteDraft(this.collection, this.id);
            this.id = '';
          } catch (e) {
            this.$errorHandle(e);
          }
        }
      }
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
    inputDimensions(e, sub) {
      const t = e.target;
      const v = t.value;
      const ob = `${this.collection}_dimensions`;
      Vue.set(this.obj[ob], sub, v);
      if (
        !this.$isEmpty(this.obj[ob].length) &&
        !this.$isEmpty(this.obj[ob].width) &&
        !this.$isEmpty(this.obj[ob].height)
      ) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          (async () => {
            try {
              await this.hasChanges();
              if (!this.$isEmpty(this.id)) {
                try {
                  await this.$claim.putAttr(this.collection, ob, {
                    [this.claimId]: this.id,
                    length: Number.parseFloat(this.obj[ob].length),
                    width: Number.parseFloat(this.obj[ob].width),
                    height: Number.parseFloat(this.obj[ob].height)
                  });
                } catch (e) {
                  this.$errorHandle(e);
                }
              }
            } catch (e) {
              this.$errorHandle(e);
            }
          })();
        }, 500);
      }
    },
    async inputPay(e) {
      const t = e.target;
      const v = t.value;
      const oldV = this.obj.payment.pay.value;
      this.prepayPlaceholder = '';
      Vue.set(this.obj.payment.pay, 'value', v);
      if (v > 101) {
        this.prepayPlaceholder = `101-${v}`;
      } else if (v == 101) {
        this.prepayPlaceholder = `101`;
      }
      if (v > 100) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          (async () => {
            try {
              await this.hasChanges();
              if (!this.$isEmpty(this.id)) {
                try {
                  await this.$claim.putAttr(this.collection, 'payment_pay', {
                    [this.claimId]: this.id,
                    value: this.obj.payment.pay.value,
                    currency: this.obj.payment.pay.currency
                  });
                } catch (e) {
                  this.$errorHandle(e);
                }
              }
            } catch (e) {
              this.$errorHandle(e);
            }
          })();
        }, 500);
      } else if (v < 101) {
        if (oldV > 100) {
          clearTimeout(this.timer);
          try {
            await this.$claim.zeroPayment(this.collection, this.id, 'pay');
            try {
              this.hasChanges();
            } catch (e) {
              this.$errorHandle(e);
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        }
      }
    },
    async inputPrepay(e) {
      const t = e.target;
      const v = t.value;
      const oldV = this.obj.payment.prepay.value;
      Vue.set(this.obj.payment.prepay, 'value', v);
      if (v > 100) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          (async () => {
            try {
              await this.hasChanges();
              if (!this.$isEmpty(this.id)) {
                try {
                  await this.$claim.putAttr(this.collection, 'payment_prepay', {
                    [this.claimId]: this.id,
                    value: this.obj.payment.prepay.value,
                    currency: this.obj.payment.prepay.currency
                  });
                } catch (e) {
                  this.$errorHandle(e);
                }
              }
            } catch (e) {
              this.$errorHandle(e);
            }
          })();
        }, 500);
      } else if (v < 101) {
        if (oldV > 100) {
          clearTimeout(this.timer);
          try {
            await this.$claim.zeroPayment(this.collection, this.id, 'prepay');
            try {
              this.hasChanges();
            } catch (e) {
              this.$errorHandle(e);
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        }
      }
    },
    easyInput(e, name, sub = undefined) {
      const t = e.target;
      if (sub) {
        Vue.set(this.obj[name], sub, t.value);
      } else {
        const n = t
          .closest('.m-input')
          .querySelector('input')
          .getAttribute('name');
        Vue.set(this.obj, n, t.value);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.hasChanges()
            .then((r) => {
              if (!this.$isEmpty(this.id)) {
                if (!t.hasAttribute('data-required')) {
                  this.$claim
                    .putAttr(this.collection, n, {
                      [this.claimId]: this.id,
                      [name]: this.$isEmpty(t.value)
                        ? 0
                        : isNaN(t.value)
                        ? t.value
                        : Number.parseFloat(t.value)
                    })
                    .catch((e) => {
                      this.$errorHandle(e);
                    });
                } else if (t.hasAttribute('data-required')) {
                  if (!this.$isEmpty(t.value)) {
                    this.$claim
                      .putAttr(this.collection, n, {
                        [this.claimId]: this.id,
                        [name]: isNaN(t.value)
                          ? t.value
                          : Number.parseFloat(t.value)
                      })
                      .catch((e) => {
                        this.$errorHandle(e);
                      });
                  } else if (this.mobile) {
                    this.mobLoading = false;
                  } else {
                    this.$screen(false);
                  }
                }
              }
            })
            .catch((e) => {
              this.$errorHandle(e);
            });
        }, 500);
      }
    },
    payInput(e) {
      const t = e.target;
      const v = t.value;
      const n = t.getAttribute('name');
      const oldV = this.obj.payment[n].value;
      clearTimeout(this.timer);
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
      this.timer = setTimeout(() => {
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        if (this.$isEmpty(v)) {
          (async () => {
            try {
              await this.$claim.zeroPayment(this.collection, this.id, n);
              Vue.set(this.obj.payment[n], 'value', v);
            } catch (e) {
              this.$errorHandle();
              try {
                await this.$claim.putAttr(this.collection, `payment_${n}`, {
                  [this.claimId]: this.id,
                  currency: this.obj.payment[n].currency,
                  value: oldV
                });
                Vue.set(this.obj.payment[n], 'value', oldV);
                try {
                  this.hasChanges();
                } catch (e) {
                  this.$errorHandle(e);
                }
              } catch (e) {
                this.$errorHandle(e);
              }
            }
          })();
        } else {
          (async () => {
            Vue.set(this.obj.payment[n], 'value', v);
            try {
              this.hasChanges();
              if (!this.$isEmpty(this.id)) {
                try {
                  await this.$claim.putAttr(this.collection, `payment_${n}`, {
                    [this.claimId]: this.id,
                    currency: this.obj.payment[n].currency,
                    value: v
                  });
                } catch (e) {
                  this.$errorHandle(e);
                  if (this.$isEmpty(oldV)) {
                    try {
                      await this.$claim.zeroPayment(
                        this.collection,
                        this.id,
                        n
                      );
                      Vue.set(this.obj.payment[n], 'value', oldV);
                      try {
                        this.hasChanges();
                      } catch (e) {
                        this.$errorHandle(e);
                      }
                    } catch (e) {
                      this.$errorHandle(e);
                    }
                  } else {
                    try {
                      await this.$claim.putAttr(
                        this.collection,
                        `payment_${n}`,
                        {
                          [this.claimId]: this.id,
                          currency: this.obj.payment[n].currency,
                          value: v
                        }
                      );
                      Vue.set(this.obj.payment[n], 'value', oldV);
                    } catch (e) {
                      this.$errorHandle(e);
                    }
                  }
                }
              }
            } catch (e) {
              this.$errorHandle(e);
              Vue.set(this.obj.payment[n], 'value', oldV);
            }
          })();
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }, 500);
    },
    loadingTimeDisabled(sub) {
      const ob = this.obj.loading_time[sub];
      if (typeof ob === 'number') {
        return !(ob > 0);
      }
      if (typeof ob === 'string') {
        return this.$isEmpty(ob);
      } else {
        return this.$isEmpty(ob.dateFrom);
      }
    },
    loadingTimeSelected(sub) {
      const list = this[`${sub}Select`];
      const ob = this.obj.loading_time[sub];
      return list.find((a) => a.value == ob);
    },
    async selectLoadingTime(e, val, sub) {
      const a = val.value;
      const url = `loading_time_${sub}`;
      Vue.set(this.obj.loading_time, sub, a);
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.hasChanges();
        if (!this.$isEmpty(this.id)) {
          try {
            await this.$claim.putAttr(this.collection, url, {
              [this.claimId]: this.id,
              [sub]: a
            });
          } catch (e) {
            Vue.set(this.obj.loading_time, sub, '');
            this.$errorHandle(e);
          }
        }
      } catch (e) {
        Vue.set(this.obj.loading_time, sub, '');
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    async chooseLoadingTime(e, sub) {
      const t = e.target;
      let url = 'loading_time_';
      const obj = {};
      this.$reject({ target: t.closest('.when') });
      switch (sub) {
        case 'always':
          Vue.set(this.obj.loading_time, sub, 1);
          Vue.set(this.obj.loading_time, 'ready', '');
          Vue.set(this.obj.loading_time, 'by_calendar', {
            dateFrom: '',
            dateBy: ''
          });
          url += 'always';
          obj.always = this.obj.loading_time.always;
          break;
        case 'by_calendar':
          Vue.set(this.obj.loading_time, sub, {
            dateBy: new Date(),
            dateFrom: new Date()
          });
          Vue.set(this.obj.loading_time, 'ready', '');
          Vue.set(this.obj.loading_time, 'always', '');
          url += 'by_calendar';
          obj.dateFrom = this.$toISOString(
            this.obj.loading_time.by_calendar.dateFrom
          );
          obj.dateBy = this.$toISOString(
            this.obj.loading_time.by_calendar.dateBy
          );
          break;
        case 'ready':
          Vue.set(this.obj.loading_time, sub, 1);
          Vue.set(this.obj.loading_time, 'always', '');
          Vue.set(this.obj.loading_time, 'by_calendar', {
            dateFrom: '',
            dateBy: ''
          });
          url += 'ready';
          obj.ready = this.obj.loading_time.ready;
          break;
      }
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.hasChanges();
        obj[this.claimId] = this.id;
        if (!this.$isEmpty(this.id)) {
          try {
            await this.$claim.putAttr(this.collection, url, obj);
          } catch (e) {
            t.checked = false;
            Vue.set(this.obj.loading_time, 'always', '');
            Vue.set(this.obj.loading_time, 'ready', '');
            Vue.set(this.obj.loading_time, 'by_calendar', {
              dateFrom: '',
              dateBy: ''
            });
            try {
              await this.hasChanges();
            } catch (e) {
              this.$errorHandle(e);
            }
            this.$errorHandle(e);
          }
          try {
            await this.$claim.chooseLoadingTime(this.collection, sub, this.id);
          } catch (e) {
            t.checked = false;
            Vue.set(this.obj.loading_time, 'always', '');
            Vue.set(this.obj.loading_time, 'ready', '');
            Vue.set(this.obj.loading_time, 'by_calendar', {
              dateFrom: '',
              dateBy: ''
            });
            try {
              await this.hasChanges();
            } catch (e) {
              this.$errorHandle(e);
            }
            this.$errorHandle(e);
          }
        }
      } catch (e) {
        t.checked = false;
        Vue.set(this.obj[name], 'always', '');
        Vue.set(this.obj[name], 'ready', '');
        Vue.set(this.obj[name], 'by_calendar', {
          dateFrom: '',
          dateBy: ''
        });
        try {
          await this.hasChanges();
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    async choosePayment(name) {
      let p;
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      switch (name) {
        case 'bid':
          Vue.set(this.obj.payment, 'rate_request', false);
          try {
            await this.hasChanges();
            if (!this.$isEmpty(this.id)) {
              try {
                await this.$claim.putAttr(
                  this.collection,
                  'payment_rate_request',
                  {
                    [this.claimId]: this.id,
                    rateRequest: false
                  }
                );
              } catch (e) {
                this.$errorHandle(e);
                Vue.set(this.obj.payment, 'rate_request', true);
              }
            }
          } catch (e) {
            this.$errorHandle(e);
            Vue.set(this.obj.payment, 'rate_request', true);
          }
          break;
        case 'req':
          p = JSON.stringify(this.obj.payment);
          Vue.set(this.obj.payment, 'rate_request', true);
          Vue.set(this.obj.payment, 'pay', { currency: 'UAH', value: '' });
          Vue.set(this.obj.payment, 'prepay', { currency: 'UAH', value: '' });
          Vue.set(this.obj.payment, 'bargain', false);
          Vue.set(this.obj.payment, 'payment_show_proposition', false);
          Vue.set(this.obj.payment, 'payment_at_unloading', false);
          if (!this.$isEmpty(this.id)) {
            try {
              await this.hasChanges();
              Promise.all([
                new Promise((resolve, reject) => {
                  (async () => {
                    try {
                      await this.$claim.removePaymentTypes(
                        this.collection,
                        this.obj.payment.type.map((a) => a.id),
                        this.id
                      );
                      Vue.set(this.obj.payment, 'type', []);
                      resolve();
                    } catch (e) {
                      reject(e);
                    }
                  })();
                }),
                new Promise((resolve, reject) => {
                  (async () => {
                    try {
                      await this.$claim.defaultPayment(
                        this.collection,
                        this.id
                      );
                      resolve();
                    } catch (e) {
                      reject(e);
                    }
                  })();
                })
              ])
                .then((r) => {
                  this.prepay = '*';
                })
                .catch((e) => {
                  this.$errorHandle(e);
                  Vue.set(this.obj, 'payment', JSON.parse(p));

                  (async () => {
                    try {
                      await this.hasChanges();
                    } catch (e) {
                      this.$errorHandle(e);
                    }
                  })();
                });
            } catch (e) {
              this.$errorHandle(e);
              Vue.set(this.obj, 'payment', JSON.parse(p));
            }
          }
          break;
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    async chooseCurrency(e, val) {
      Vue.set(this.obj.payment.pay, 'currency', val.value);
      if (this.obj.payment.prepay) {
        Vue.set(this.obj.payment.prepay, 'currency', val.value);
      }
      const m = e.target.closest('.m-select');
      const i = m.previousElementSibling.querySelector('input');
      await this.inputPay({ target: i });
    },

    async select(e, val, name, sub = undefined) {
      const n = e.target
        .closest('.m-select')
        .querySelector('input')
        .getAttribute('name');
      let url = n;
      if (sub) {
        url = `${n}_${sub}`;
        Vue.set(this.obj[n], sub, val);
      } else {
        Vue.set(this.obj, n, val);
      }
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.hasChanges();
        if (!this.$isEmpty(this.id)) {
          try {
            await this.$claim.putAttr(this.collection, url, {
              [this.claimId]: this.id,
              [name]: val
            });
          } catch (e) {
            this.$errorHandle(e);
            if (sub) {
              Vue.set(this.obj[n], sub, typeof val === 'boolean' ? false : '');
            } else {
              Vue.set(this.obj, n, typeof val === 'boolean' ? false : '');
            }
            try {
              await this.hasChanges();
            } catch (e) {
              this.$errorHandle(e);
            }
          }
        }
      } catch (e) {
        this.$errorHandle(e);
        if (sub) {
          Vue.set(this.obj[n], sub, typeof val === 'boolean' ? false : '');
        } else {
          Vue.set(this.obj, n, typeof val === 'boolean' ? false : '');
        }
        try {
          await this.hasChanges();
        } catch (e) {
          this.$errorHandle(e);
        }
      }

      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    async multiselect(e, val, name, sub = undefined) {
      const n = e.target
        .closest('.m-select')
        .querySelector('input')
        .getAttribute('name');
      let c = this.obj[n];
      let url = n;
      if (sub) {
        c = this.obj[n][sub];
        url = `${n}_${sub}`;
      }
      if (val.length < c.length) {
        let ob;
        for (const i of c) {
          const f = val.find((a) => a.value === i.value);
          if (this.$isEmpty(f)) {
            ({ ...ob } = JSON.parse(JSON.stringify(i)));
            if (this.mobile) {
              this.mobLoading = true;
            } else {
              this.$screen(true);
            }
            try {
              await this.$claim.deleteAttr(this.collection, url, {
                [this.claimId]: this.id,
                id: i.id
              });
              c.splice(
                c.findIndex((a) => a.value === ob.value),
                1
              );
              try {
                await this.hasChanges();
              } catch (e) {
                this.$errorHandle(e);
                c.push(ob);
              }
            } catch (e) {
              this.$errorHandle(e);
              c.push(ob);
            }
            if (this.mobile) {
              this.mobLoading = false;
            } else {
              this.$screen(false);
            }
            break;
          }
        }
      } else if (val.length >= c.length) {
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        for (const i of val) {
          const ob = c.find((a) => a.value === i.value);
          if (this.$isEmpty(ob)) {
            c.push(i);
            try {
              await this.hasChanges();
              if (!this.$isEmpty(this.id)) {
                try {
                  const r = await this.$claim.putAttr(this.collection, url, {
                    [this.claimId]: this.id,
                    [name]: i.value
                  });
                  c.find((a) => a.value === i.value).id = r.id;
                } catch (e) {
                  this.$errorHandle(e);
                  c.splice(
                    c.findIndex((a) => a.value === i.value),
                    1
                  );
                }
              }
            } catch (e) {
              this.$errorHandle(e);
              c.splice(
                c.findIndex((a) => a.value === i.value),
                1
              );
            }
            break;
          }
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }
    },
    async check(e, name, value = undefined, attr, sub = undefined) {
      const t = e.target;
      const c = t.checked;
      let url = attr;
      if (attr === 'permission_document') {
        this.$reject({ target: t.closest('#docs') });
      }
      if (value) {
        const d = t.getAttribute('name');
        const ob = this.obj[attr];
        if (c) {
          ob.push({ value: d });
          if (this.mobile) {
            this.mobLoading = true;
          } else {
            this.$screen(true);
          }
          try {
            await this.hasChanges();
            if (!this.$isEmpty(this.id)) {
              try {
                const r = await this.$claim.putAttr(this.collection, url, {
                  [this.claimId]: this.id,
                  [name]: d
                });
                Vue.set(ob[ob.length - 1], 'id', r.id);
              } catch (e) {
                ob.splice(ob.length - 1, 1);
                this.$errorHandle(e);
              }
            }
          } catch (e) {
            ob.splice(ob.length - 1, 1);
            this.$errorHandle(e);
          }
        } else {
          const id = ob.find((a) => a.value === d).id;
          const y = JSON.parse(JSON.stringify(ob.find((a) => a.value === d)));
          if (this.mobile) {
            this.mobLoading = true;
          } else {
            this.$screen(true);
          }
          try {
            await this.$claim.deleteAttr(this.collection, url, {
              [this.claimId]: this.id,
              id
            });
            ob.splice(
              ob.findIndex((a) => a.value === d),
              1
            );
            try {
              await this.hasChanges();
            } catch (e) {
              ob.push(y);
              this.$errorHandle(e);
            }
          } catch (e) {
            ob.push(y);
            this.$errorHandle(e);
          }
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      } else {
        if (sub) {
          url = `${attr}_${sub}`;
        } else if (!sub) {
          Vue.set(this.obj, attr, c);
        }
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          await this.hasChanges();
          if (!this.$isEmpty(this.id)) {
            try {
              await this.$claim.putAttr(this.collection, url, {
                [this.claimId]: this.id,
                [name]: c
              });
            } catch (e) {
              Vue.set(this.obj, attr, !c);
              this.$errorHandle(e);
            }
          }
        } catch (e) {
          Vue.set(this.obj, attr, !c);
          this.$errorHandle(e);
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }
    },
    checkPrepay(e) {
      const t = e.target;
      const v = t.checked;
      const i = t.closest('#beforePay').querySelector('.m-input input');
      const pV = this.obj.payment.pay.value;
      this.$reject({ target: i });
      this.prepayPlaceholder = '';
      if (v) {
        this.prepay = '';
        setTimeout(() => {
          if (pV > 101) {
            this.prepayPlaceholder = `101-${pV}`;
          } else if (pV == 101) {
            this.prepayPlaceholder = `101`;
          }
          i.focus();
        }, 100);
      } else {
        const iV = this.obj.payment.prepay.value;
        Vue.set(this.obj.payment.prepay, 'value', '');
        this.$nextTick(() => {
          if (iV > 100) {
            (async () => {
              if (this.mobile) {
                this.mobLoading = true;
              } else {
                this.$screen(true);
              }
              try {
                await this.$claim.zeroPayment(
                  this.collection,
                  this.id,
                  'prepay'
                );
                try {
                  await this.hasChanges();
                  this.prepay = '*';
                  this.prepayPlaceholder = '';
                  i.value = '';
                } catch (e) {
                  this.$errorHandle(e);
                  Vue.set(this.obj.payment.prepay, 'value', iV);
                }
              } catch (e) {
                this.$errorHandle(e);
                Vue.set(this.obj.payment.prepay, 'value', iV);
              }
              if (this.mobile) {
                this.mobLoading = false;
              } else {
                this.$screen(false);
              }
            })();
          } else {
            this.prepay = '*';
            this.prepayPlaceholder = '';
            i.value = '';
          }
        });
      }
    },
    textAreaInput(e) {
      const t = e.target;
      const v = t.value;
      Vue.set(this.obj, 'description', v);
      clearTimeout(this.timer);
      if (v.length > 1000) {
        this.$error(null, 'Введите не более 1000 символов');
      } else {
        this.$error();
        this.timer = setTimeout(() => {
          (async () => {
            try {
              await this.hasChanges();
              if (!this.$isEmpty(this.id)) {
                try {
                  await this.$claim.putAttr(this.collection, 'description', {
                    [this.claimId]: this.id,
                    description: v
                  });
                } catch (e) {
                  this.$errorHandle(e);
                }
              }
            } catch (e) {
              this.$errorHandle(e);
            }
          })();
        }, 500);
      }
    },
    async setContact(e, val) {
      const s = JSON.parse(JSON.stringify(this.obj.contact));
      Vue.set(this.obj, 'contact', val);
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.hasChanges();
        if (!this.$isEmpty(this.id)) {
          try {
            await this.$claim.putAttr(this.collection, 'contact', {
              [this.claimId]: this.id,
              contactId: val.value
            });
            this.contacts.push(s);
            this.contacts.splice(
              this.contacts.findIndex((a) => a.value === val.value),
              1
            );
          } catch (e) {
            this.$errorHandle(e);
            Vue.set(this.obj, 'contact', s);
          }
        }
      } catch (e) {
        this.$errorHandle(e);
        Vue.set(this.obj, 'contact', s);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    async setDriver(e, val) {
      const s = JSON.parse(JSON.stringify(this.obj.driver));
      if (val.value.icon.includes('busy')) {
        setTimeout(() => {
          this.$store.commit('setError', [
            true,
            `Водитель ${val.title} учавствует в другой заявке. Выберите другого водителя.`
          ]);
        }, 500);
        Vue.set(this.obj, 'driver', s);
      } else {
        Vue.set(this.obj, 'driver', val);
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          await this.hasChanges();
          if (!this.$isEmpty(this.id)) {
            if (!this.$isEmpty(s)) {
              try {
                await this.$claim.deleteAttr(this.collection, 'driver', {
                  [this.claimId]: this.id,
                  id: s.id
                });
                // this.drivers.splice(
                //   this.drivers.findIndex((a) => a.value.id === val.value.id),
                //   1
                // );
                this.drivers.push(s);
              } catch (e) {
                this.$errorHandle(e);
              }
            }
            try {
              const r = await this.$claim.putAttr(this.collection, 'driver', {
                [this.claimId]: this.id,
                driverId: val.value.id
              });
              this.obj.driver.id = r.id;
              this.drivers.splice(
                this.drivers.findIndex((a) => a.value.id === val.value.id),
                1
              );
            } catch (e) {
              this.$errorHandle(e);
              Vue.set(this.obj, 'driver', s);
              if (!this.$isEmpty(s)) {
                try {
                  const r = await this.$claim.putAttr(
                    this.collection,
                    'driver',
                    {
                      [this.claimId]: this.id,
                      driverId: s.value.id
                    }
                  );
                  this.obj.driver.id = r.id;
                } catch (e) {
                  this.$errorHandle(e);
                }
              } else {
                try {
                  await this.hasChanges();
                } catch (e) {
                  this.$errorHandle(e);
                }
              }
            }
          }
        } catch (e) {
          this.$errorHandle(e);
          Vue.set(this.obj, 'driver', s);
        }
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    async setVehicle(e, val, name) {
      const s = JSON.parse(JSON.stringify(this.obj[name]));
      Vue.set(this.obj, name, val);
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.hasChanges();
        if (!this.$isEmpty(this.id)) {
          if (!this.$isEmpty(s)) {
            try {
              await this.$claim.deleteAttr(this.collection, name, {
                [this.claimId]: this.id,
                id: s.id
              });
              if (!this.$isEmpty(this.obj.trailer)) {
                await this.$claim.deleteAttr(this.collection, 'trailer', {
                  [this.claimId]: this.id,
                  id: this.obj.trailer.id
                });
                Vue.set(this, 'sVehicles', []);
              }
            } catch (e) {
              this.$errorHandle(e);
              Vue.set(this.obj, name, s);
            }
          }
          try {
            const r = await this.$claim.putAttr(this.collection, name, {
              [this.claimId]: this.id,
              [`${name}Id`]: val.value.id
            });
            this.obj[name].id = r.id;
            let ob;
            if (name === 'tractor') {
              ob = val.value.type + 's';
              Vue.set(
                this,
                'sVehicles',
                JSON.parse(
                  JSON.stringify(
                    val.value.type === 'tractor'
                      ? this.vehicles.semitrailers
                      : this.vehicles.trailers
                  )
                )
              );
            } else {
              ob = `${
                this.obj.tractor.value.type === 'tractor'
                  ? 'semitrailers'
                  : 'trailers'
              }`;
            }
            this.vehicles[ob].push(s);
            if (val.value.type.includes('trailer')) {
              this.sVehicles.splice(
                this.sVehicles.findIndex((a) => a.value.id === val.value.id),
                1
              );
            }
            this.vehicles[ob].splice(
              this.vehicles[ob].findIndex((a) => a.value.id === val.value.id),
              1
            );
          } catch (e) {
            this.$errorHandle(e);
            Vue.set(this.obj, name, s);
            if (!this.$isEmpty(s)) {
              try {
                const r = await this.$claim.putAttr(this.collection, name, {
                  [this.claimId]: this.id,
                  [`${name}Id`]: s.value.id
                });
                this.obj[name].id = r.id;
                if (name === 'tractor') {
                  Vue.set(
                    this,
                    'sVehicles',
                    JSON.parse(
                      JSON.stringify(
                        s.value.type === 'tractor'
                          ? this.vehicles.semitrailers
                          : this.vehicles.trailers
                      )
                    )
                  );
                }
              } catch (e) {
                this.$errorHandle(e);
              }
            } else {
              try {
                await this.hasChanges();
              } catch (e) {
                this.$errorHandle(e);
              }
            }
          }
        }
      } catch (e) {
        this.$errorHandle(e);
        Vue.set(this.obj, name, s);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    async reset() {
      this.prepay = '*';
      this.templateValue = '';
      this.disabledTemplate = true;
      this.templateRequired = false;
      this.prepayPlaceholder = '';
      Vue.set(this, 'load', []);
      Vue.set(this, 'unload', []);
      this.id = '';
      this.contacts.push(JSON.parse(JSON.stringify(this.obj.contact)));
      ({ ...this.obj.contact } = this.contact);
      this.contacts.splice(
        this.contacts.findIndex((a) => a.value === this.obj.contact.value),
        1
      );
      Vue.set(
        this,
        this.collection,
        JSON.parse(JSON.stringify(this.defaultObj[this.collection]))
      );
      this.$nextTick(() => {
        this.saved = !this.saved;
        document.querySelector('html,body').scrollTo({
          top: document.querySelector('.m-background').offsetHeight,
          behavior: 'smooth'
        });
        setTimeout(() => {
          this.$zIndexing();
        }, 500);
      });
      if (this.collection === 'car') {
        await this.createVehicles();
        await this.createDrivers();
      }
    },
    async publish() {
      let correct = true;
      for (const r of this.$el.querySelectorAll('[data-required]')) {
        let t;
        if (r.hasAttribute('type')) {
          t = r;
          if (r.getAttribute('type') === 'hidden') {
            t = r.nextElementSibling;
          }
          if (this.$isEmpty(r.value)) {
            this.$incorrect({
              target: t
            });
            correct = false;
          }
        } else {
          t = r;
          if (t.getAttribute('id') === 'docs') {
            if (this.$isEmpty(this.obj.permission_document)) {
              this.$incorrect({
                target: t,
                error: 'Выберите документ(ы)'
              });
              correct = false;
            }
          } else if (t.classList.contains('when')) {
            if (
              this.$isEmpty(this.obj.loading_time.always) &&
              this.$isEmpty(this.obj.loading_time.ready) &&
              this.$isEmpty(this.obj.loading_time.by_calendar.dateFrom) &&
              this.$isEmpty(this.obj.loading_time.by_calendar.dateBy)
            ) {
              this.$incorrect({
                target: t,
                error: 'Выберите один вариант'
              });
              correct = false;
            }
          } else if (t.classList.contains('load')) {
            if (this.$isEmpty(this.load)) {
              this.$incorrect({
                target: t,
                error: 'Выберите пункт(ы) загрузки'
              });
              correct = false;
            }
          } else if (t.classList.contains('unload')) {
            if (this.$isEmpty(this.unload)) {
              this.$incorrect({
                target: t,
                error: 'Выберите пункт(ы) выгрузки'
              });
              correct = false;
            }
          }
        }
      }
      if (
        this.$isEmpty(this.obj[`${this.collection}_dimensions`].length) ||
        this.$isEmpty(this.obj[`${this.collection}_dimensions`].width) ||
        this.$isEmpty(this.obj[`${this.collection}_dimensions`].height)
      ) {
        if (
          this.$isEmpty(this.obj[`${this.collection}_dimensions`].length) &&
          this.$isEmpty(this.obj[`${this.collection}_dimensions`].width) &&
          this.$isEmpty(this.obj[`${this.collection}_dimensions`].height)
        ) {
        } else {
          for (const i of this.$el.querySelectorAll(
            `[name^="${this.collection}_dimensions_"]`
          )) {
            if (this.$isEmpty(i.value)) {
              this.$incorrect({
                target: i
              });
              correct = false;
            }
          }
        }
      }
      if (!this.obj.payment.rate_request) {
        if (this.collection === 'cargo') {
          const p = this.$el.querySelector('[name="pay"]');
          const pO = this.obj.payment.pay;
          const pPO = this.obj.payment.prepay;
          const pp = this.$el.querySelector('[name="prepay"]');
          const pT = this.$el
            .querySelector('.vol')
            .children[0].querySelector('._input');
          if (this.$isEmpty(this.obj.payment.type)) {
            this.$incorrect({
              target: pT
            });
            correct = false;
          }
          if (this.$isEmpty(pO.value)) {
            Vue.set(pPO, 'value', '');
            this.prepay = '*';
            this.$incorrect({
              target: p
            });
            correct = false;
          } else if (pO.value < 101) {
            Vue.set(pPO, 'value', '');
            this.prepay = '*';
            this.$incorrect({
              target: p,
              error: 'Минимум 101'
            });
            correct = false;
          } else if (pO.value > 100) {
            if (this.$isEmpty(this.prepay)) {
              if (this.$isEmpty(pPO.value) || pPO.value < 101) {
                this.$incorrect({
                  target: pp,
                  error: 'Минимум 101'
                });
                correct = false;
              } else if (
                Number.parseFloat(pPO.value) > Number.parseFloat(pO.value)
              ) {
                this.$incorrect({
                  target: pp,
                  error: 'Не более ставки'
                });
                correct = false;
              }
            }
          }
        } else {
          const p = this.$el.querySelector('[name="pay"]');
          const pO = this.obj.payment.pay;
          const pT = this.$el
            .querySelector('.vol')
            .children[0].querySelector('._input');
          if (this.$isEmpty(this.obj.payment.type)) {
            this.$incorrect({
              target: pT
            });
            correct = false;
          }
          if (this.$isEmpty(pO.value)) {
            this.$incorrect({
              target: p
            });
            correct = false;
          } else if (pO.value < 101) {
            this.$incorrect({
              target: p,
              error: 'Минимум 101'
            });
            correct = false;
          }
        }
      }
      if (!correct) {
        this.$error(undefined, 'Некоторые обязательные поля не заполнены');
      }
      if (correct) {
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          await this.$claim.publish(this.collection, {
            [this.claimId]: this.id
          });
          if (this.templateRequired) {
            try {
              await this.$template.create(this.collection, {
                [this.claimId]: this.id,
                name: this.templateValue
              });
            } catch (e) {
              this.$errorHandle(e);
            }
          }
          this.message = 'Заявка опубликована!';
          if (this.mobile) {
            this.mobLoading = false;
          } else {
            this.$screen(false);
          }
          this.reset();
        } catch (e) {
          this.$errorHandle(e);
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    try {
      this.unwatch();
    } catch {}
    next();
  }
};
