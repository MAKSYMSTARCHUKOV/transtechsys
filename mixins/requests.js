import { mapState } from 'vuex';
import Vue from 'vue';
import Loading from '~/components/Loading.vue';

export default {
  components: {
    Loading
  },
  data() {
    return {
      direction: 'right-tab',
      mobLoading: false,
      proposition: {
        value: '',
        currency: 'UAH'
      },
      reason: '',
      interval: undefined,
      tabs: [
        {
          title: 'Созданные заявки',
          value: 'created'
        },
        {
          title: 'Активные заявки',
          value: 'active'
        },
        {
          title: 'Заявки в работе',
          value: 'process'
        },
        {
          title: 'История',
          value: 'closed'
        }
      ],
      proposal: [
        {
          name: 'Kirk Hammett',
          bid: '1300',
          vol: 'UAH'
        },
        {
          name: 'Robert Trujillo',
          bid: '1300',
          vol: 'UAH'
        }
      ],
      limits: [
        {
          title: '5',
          value: 5
        },
        {
          title: '10',
          value: 10
        },
        {
          title: '25',
          value: 25
        },
        {
          title: '50',
          value: 50
        },
        {
          title: '100',
          value: 100
        }
      ],
      pageObj: {
        page: this.page
      }
    };
  },
  watch: {
    mobile(newV) {
      if (newV) {
        this.limit = 10;
      }
    },
    limit(newV, oldV) {
      if (newV !== oldV && newV !== 0) {
        const p = this.$localstorage.get('position');
        const e = this.$localstorage.get('email');
        const n = this.$route.name;
        this.page = 1;
        p[e][n].limit = this.limit;
        p[e][n].page = this.page;
        Vue.set(this, 'pageObj', { page: 0 });
        this.$nextTick(() => {
          Vue.set(this, 'pageObj', { page: 1 });
        });
      }
    },
    currentTab(newV) {
      if (newV) {
        this.func = `get${this.$capitalize(newV)}`;
        const p = this.$localstorage.get('position');
        const e = this.$localstorage.get('email');
        const n = this.$route.name;
        p[e][n].currentTab = newV;
        this.$localstorage.set('position', p, true);
        Vue.set(this, 'pageObj', { page: 0 });
        this.$nextTick(() => {
          Vue.set(this, 'pageObj', { page: 1 });
        });
      }
    },
    async pageObj(newV) {
      if (newV) {
        if (newV.page > 0) {
          if (this.mobile) {
            this.mobLoading = true;
          } else {
            this.$screen(true);
          }
          let backup = [];
          try {
            if (this.$route.name.includes('requests')) {
              [...backup] = JSON.parse(JSON.stringify(this.found));
              [...this.found] = [];
              const p = this.$localstorage.get('position');
              const e = this.$localstorage.get('email');
              const n = this.$route.name;
              const r = await this.$request[this.func](newV.page, this.limit);
              this.total = r.total;
              if (
                this.currentTab === 'active' ||
                this.currentTab === 'process' ||
                this.currentTab === 'closed'
              ) {
                // for (const y of r.items) {
                //   for (const m of y.auctions) {
                //     let p = this.$imgSrc('void-img.png');
                //     let t;
                //     try {
                //       t = await this.$fetchImage(m.memberFrom.photo.value);
                //       p = this.$isEmpty(t) ? p : t;
                //     } catch (e) {}
                //     m.memberFrom.photo.value = p;
                //     p = this.$imgSrc('void-img.png');
                //     try {
                //       t = await this.$fetchImage(m.memberTo.photo.value);
                //       p = this.$isEmpty(t) ? p : t;
                //     } catch (e) {}
                //     m.memberTo.photo.value = p;
                //   }
                // }
              }
              [...this.items] = r.items;
              const div = r.total / this.limit;
              const abs = Math.floor(div);
              this.pages = div > abs ? abs + 1 : abs;
              document.querySelector('html,body').scrollTo({
                top: this.$el.querySelector('.tabs').offsetTop,
                behavior: 'smooth'
              });
              this.page = newV.page;
              p[e][n].page = newV.page;
              this.$localstorage.set('position', p, true);
              this.showFound(this.items, true);
            } else {
              const { ...obj } = this.requestObj;
              ({ ...obj.sorting } = this.sorting);
              this.page = newV.page;
              obj.page = this.page;
              obj.perPage = this.limit;
              await this.sendForm(obj);
              document.querySelector('html,body').scrollTo({
                top: this.$el.querySelector('.requests').offsetTop,
                behavior: 'smooth'
              });
            }
          } catch (e) {
            this.$errorHandle(e);
            [...this.found] = backup;
          }
          if (this.mobile) {
            this.mobLoading = false;
          } else {
            this.$screen(false);
          }
        }
      }
    }
  },
  computed: {
    ...mapState(['mobile']),
    claimId() {
      return `claim${this.$capitalize(this.collection)}Id`;
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
    historyMode() {
      return this.currentTab === 'closed';
    }
  },
  mounted() {
    if (!this.$isEmpty(this.items)) {
      this.showFound(this.items, true);
    }
    this.tabs.forEach((d, i) => {
      Vue.set(this.tabs[i], 'title', this[d.value]);
    });
    this.$nextTick(() => {
      try {
        this.loading = undefined;
      } catch {}
      this.$nuxt.$loading.finish();
    });
  },
  methods: {
    getDirection(dir) {
      this.direction = dir;
    },
    isAccepted(a) {
      return a.status.accepted;
    },
    inWork(obj) {
      return obj.status.inWork;
    },
    isOnline(a) {
      const y =
        a.from.member_id === this.$store.getters.member_id
          ? a.to.member_id
          : a.from.member_id;
      return !this.$isEmpty(this.$store.getters.online.find((a) => a.id === y));
    },
    other(a) {
      return (
        a.from.member_id !== this.$store.getters.member_id &&
        a.to.member_id !== this.$store.getters.member_id
      );
    },
    rightToWrite(obj) {
      return obj.contact.member_id === this.$store.getters.member_id;
    },
    mightClose(obj) {
      return (
        (this.inWork(obj) || obj.status.partialClosed) &&
        obj.closingInitiator !== this.$store.getters.member_id
      );
    },
    waitingClose(obj) {
      return obj.closingInitiator === this.$store.getters.member_id;
    },

    leaveReview(obj) {
      if (obj.status.closed && !obj.status.partialClosed && obj.reviews === 0) {
        return 0;
      }
      return -1;
    },

    aDate(a) {
      // const d = new Date().toLocaleDateString();
      const dA = new Date(a.date).toLocaleDateString();
      const t = new Date(a.date).toLocaleTimeString().split(':');
      t.splice(2, 1);
      // return `${t.join(':')}`.concat(d === dA ? '' : ` • ${dA}`);
      return `${t.join(':')} • ${dA}`;
    },
    canRemove(obj) {
      if (this.currentTab === 'created' || this.currentTab === 'active') {
        if (obj.company.id === this.$store.getters.company_id) {
          return true;
        }
      }
      return false;
    },
    propSize(position) {
      const sF = 27 / 124;
      const p = position;
      const c = p.map((d, i) => {
        if (i !== 2 && i !== 3) {
          return d * sF + 'px';
        } else if (i === 2) {
          return d === 0
            ? 'cover'
            : p[3] === 0
            ? `auto calc(100% + ${d * sF}px)`
            : `calc(100% + ${d * sF}px)`;
        }
      });
      return c;
    },
    async showContact(obj) {
      if (obj.member_id) {
        if (obj.member_id !== this.$store.getters.member_id) {
          this.$store.commit('setOverlayObject', obj);
          this.$store.commit('setOverlayMode', 'm-info');
          this.$store.commit('setOverlayVisible', true);
        }
      } else if (!obj.member_id) {
        if (obj.id !== this.$store.getters.company_id) {
          if (this.mobile) {
            this.mobLoading = true;
          } else {
            this.$screen(true);
          }
          let cars = [];
          let users = [];
          if (!obj.role.toLowerCase().includes('sender')) {
            try {
              const c = await this.$car.getCarParkTotals(undefined, obj.id);
              [...cars] = c;
            } catch (e) {
              this.$errorHandle(e);
            }
          }
          try {
            const u = await this.$user.getUsers(obj.id);
            [...users] = u;
            this.$store.commit('setOverlayObject', {
              company: obj,
              cars,
              users
            });
            this.$store.commit('setOverlayMode', 'm-info');
            this.$store.commit('setOverlayVisible', true);
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
    async makeSorting(param) {
      Vue.set(
        this.sorting,
        param,
        this.sorting[param] === 'ASC' ? 'DESC' : 'ASC'
      );
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        const { ...obj } = this.requestObj;
        ({ ...obj.sorting } = this.sorting);
        this.page = 1;
        obj.page = this.page;
        obj.perPage = this.limit;
        await this.sendForm(obj);
        document.querySelector('html,body').scrollTo({
          top: this.$el.querySelector('.requests').offsetTop,
          behavior: 'smooth'
        });
        const p = this.$localstorage.get('position');
        const e = this.$localstorage.get('email');
        const n = this.$route.name;
        ({ ...p[e][n].sorting } = this.sorting);
        this.$localstorage.set('position', p, true);
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    routeFrom(obj) {
      return obj.routes.from.find((a) => a.order === 1);
    },
    routeTo(obj) {
      return obj.routes.to.find((a) => a.order === 1);
    },
    requestDate(obj) {
      if (
        this.$isEmpty(obj.loadingTime.always) &&
        this.$isEmpty(obj.loadingTime.ready)
      ) {
        return `<span>c <span>${obj.loadingTime.calendar.dateFrom}</span></span>
        <span>по <span>${obj.loadingTime.calendar.dateBy}</span></span>`;
      } else if (!this.$isEmpty(obj.loadingTime.always)) {
        return `<span>${obj.loadingTime.always}</span>`;
      } else {
        return `<span>${obj.loadingTime.ready}</span>`;
      }
    },
    auto(obj, mobile = undefined) {
      const collection = obj.carrying ? 'car' : 'cargo';
      const weight = collection === 'car' ? 'carrying' : 'cargoWeight';
      const volume = collection === 'car' ? 'carVolume' : 'cargoVolume';
      const f =
        collection === 'car' ? obj.bodyTypes.join('\\') : obj.cargoPackage;
      const arr = [f];
      arr.push(`${obj[volume]}м³`);
      arr.push(`${obj[weight]}т`);
      const arr2 = [obj.loadingTypes.join('\\')];
      if (obj.adrs) {
        arr2.push(`ADR: ${obj.adrs.join(', ')}`);
      }
      const arr3 = [];
      if (obj[`${collection}CarsCount`]) {
        arr3.push(`Кол-во авто: ${obj[`${collection}CarsCount`]}`);
      }
      const a = `<span>${arr.join(', ')}</span>`;
      const b = `<span>${arr2.join(', ')}</span>`;
      if (mobile) {
        let y = arr.concat(arr2);
        if (!this.$isEmpty(arr3)) {
          y = y.concat(arr3);
        }
        return y.join(', ');
      }
      return (a + b).concat(!this.$isEmpty(arr3) ? `<span>${arr3}</span>` : '');
    },
    docs(obj) {
      return obj.permissionDocuments.join('<span>|</span>');
    },
    pay(obj, mobile = undefined) {
      if (!obj.payment.rateRequest) {
        if (mobile) {
          return `<span>${obj.payment.pay.value} <span>${
            obj.payment.pay.currency
          }</span></span><span>${obj.payment.types.join(', ')}</span>${
            obj.payment.bargain ? '<span>Возможен торг</span>' : ''
          }`;
        }
        let q = `<span>${obj.payment.pay.value} <span>${obj.payment.pay.currency}</span></span>`;
        const s = [];
        for (const t of obj.payment.types) {
          s.push(`<span>${t}`);
        }
        q += s.join(',</span>');
        q += '</span>';
        if (obj.payment.bargain) {
          q += '<span>Возможен торг</span>';
        }
        return q;
      } else {
        return '';
      }
    },
    rts(dir, obj) {
      const a = [];
      obj.routes[dir].forEach((d, i) => {
        const y = i + 1;
        if (y > 1) {
          a.push(obj.routes[dir].find((b) => b.order === y));
        }
      });
      return a;
    },
    aPoint(route) {
      const arr = [];
      if (!this.$isEmpty(route.street.default)) {
        arr.push(route.street.default);
        if (!this.$isEmpty(route.home.default)) {
          arr[0] = route.street.default + ' ' + route.home.default;
        }
      }
      if (!this.$isEmpty(route.city.default)) {
        arr.push(route.city.default);
      }
      arr.push(route.country.default);
      return arr.join(', ');
    },
    routeName(route) {
      return `${route.city ? route.city.default + ', ' : ''}${
        route.country.default
      }`;
    },
    eq(obj) {
      let eq = '';
      for (const e of obj.equipments) {
        eq += `<span>${this.$capitalize(e.title)}, ${e.value}шт</span>`;
      }
      return eq;
    },
    size(position) {
      const a = this.$el.querySelector('.contact-faces-avatar');
      if (a !== null) {
        const w = a.offsetWidth;
        const sF = w / 124;
        const p = position;
        const c = p.map((d, i) => {
          if (i !== 2 && i !== 3) {
            return d * sF + 'px';
          } else if (i === 2) {
            return d === 0
              ? 'cover'
              : p[3] === 0
              ? `auto calc(100% + ${d * sF}px)`
              : `calc(100% + ${d * sF}px)`;
          }
        });
        return c;
      }
      return [0, 0, 'cover'];
    },
    sizeCompany(position) {
      const a = this.$el.querySelector('.contact-faces-avatar');
      if (a !== null) {
        const w = a.offsetWidth;
        const sF = w / 174;
        const p = position;
        const c = p.map((d, i) => {
          if (i !== 2 && i !== 3) {
            return d * sF + 'px';
          } else if (i === 2) {
            return d === 0
              ? 'cover'
              : p[3] === 0
              ? `auto calc(100% + ${d * sF}px)`
              : `calc(100% + ${d * sF}px)`;
          }
        });
        return c;
      }
      return [0, 0, 'cover'];
    },
    messengers(phones) {
      const q = {};
      for (const m of phones) {
        if (m.messenger.whatsapp) {
          q.whatsapp = m.value;
        }
        if (m.messenger.viber) {
          q.viber = m.value;
        }
        if (m.messenger.telegram) {
          q.telegram = m.value;
        }
      }
      return q;
    },

    async acceptAuction(obj, claim) {
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        const _id =
          obj.from.member_id === this.$store.getters.member_id
            ? obj.to.member_id
            : obj.from.member_id;
        await this.$io.acceptAuction(claim.collection, _id, {
          id: obj.id
        });
        this.message = 'Заявка в работе';
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    showMakeProposition(e, obj, foo = undefined) {
      if (foo) {
        if (obj.from.member_id === this.$store.getters.member_id) {
          return;
        }
      }
      const t = e.target.closest('.m-container');
      if (e.target.closest('.make-proposition') === null) {
        const p = t.querySelector('.make-proposition');
        for (const y of this.$el.querySelectorAll('.cancel-proposition')) {
          if (!y.classList.contains('d-opaq')) {
            const c = y.querySelector('.ok').nextElementSibling;
            this.closeCancel({ target: c });
          }
        }
        ({ ...this.proposition } = {
          value: '',
          currency: 'UAH'
        });
        if (!foo) {
          if (!obj.payment.rateRequest) {
            Vue.set(this.proposition, 'currency', obj.payment.pay.currency);
          }
        } else {
          Vue.set(this.proposition, 'currency', obj.pay.currency);
        }
        const i = p.querySelector('[type="text"]');
        for (const y of this.$el.querySelectorAll('.make-proposition')) {
          if (y !== p) {
            y.classList.add('d-opaq');
            y.classList.remove('d-flex');
          }
        }
        p.classList.remove('d-opaq');
        setTimeout(() => {
          i.focus();
        }, 210);
      }
    },
    async makeProposition(e, obj, cId = undefined) {
      const t = e.target.closest('.make-proposition');
      const i = t.querySelector('[type="text"]');
      // eslint-disable-next-line no-unused-vars
      let correct = true;
      const collection = cId ? cId.collection : this.collection;
      const _claimId = `claim${this.$capitalize(collection)}Id`;
      if (Number.parseFloat(this.proposition.value) < 101) {
        this.$incorrect({
          target: i,
          error: 'Не менее 101'
        });
        correct = false;
      }
      if (correct) {
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        if (cId) {
          try {
            await this.$io.cancelAuction(
              collection,
              this.$store.getters.member_id,
              {
                id: obj.id,
                description: 'new'
              }
            );
          } catch (e) {
            this.$errorHandle(e);
          }
        }
        const mId = cId ? obj.from.member_id : obj.contact.member_id;
        const clId = cId ? cId.id : obj.id;
        let i;
        try {
          i = await this.$io.makeAuction(collection, mId, {
            [_claimId]: clId,
            value: this.proposition.value,
            currency: this.proposition.currency
          });
          this.message = 'Предложение сделано!';
        } catch (e) {
          this.$errorHandle(e);
        }
        t.classList.add('d-opaq');
        if (cId) {
          const tId = obj.from.member_id;
          Vue.set(obj.from, 'member_id', this.$store.getters.member_id);
          Vue.set(obj.to, 'member_id', tId);
          Vue.set(obj.pay, 'value', this.proposition.value);
          Vue.set(obj.pay, 'currency', this.proposition.currency);
          Vue.set(obj, 'id', i.id);
        } else {
          Vue.set(obj, 'auctions', [
            {
              from: {
                member_id: this.$store.getters.member_id
              },
              to: {
                member_id: ''
              }
            }
          ]);
        }
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },
    changePropositionInput(e) {
      const t = e.target;
      const m = t.closest('.make-proposition');
      const p = m.querySelector('.panel');
      const ok = p.querySelector('.ok');
      const v = e.target.value;
      if (this.$isEmpty(v) || Number.parseFloat(v) < 101) {
        ok.style.width = '0';
      } else {
        ok.style.width = '80px';
      }
      Vue.set(this.proposition, 'value', e.target.value);
    },
    changePropositionCurrency(e, val) {
      Vue.set(this.proposition, 'currency', val);
    },
    closeRequest(e) {
      const m = e.target.closest('.make-proposition');
      const ok = m.querySelector('.ok');
      m.classList.add('d-opaq');
      setTimeout(() => {
        ok.style.width = '0';
        ({ ...this.proposition } = {
          value: '',
          currency: 'UAH'
        });
      }, 200);
    },

    showCancelAuction(e) {
      const t = e.target.closest('.m-container');
      if (e.target.closest('.cancel-proposition') === null) {
        const c = t.querySelector('.cancel-proposition');
        for (const y of this.$el.querySelectorAll('.make-proposition')) {
          if (!y.classList.contains('d-opaq')) {
            const c = y.querySelector('.ok').nextElementSibling;
            this.closeRequest({ target: c });
          }
        }
        for (const r of c.querySelectorAll('[type="radio"]')) {
          r.checked = false;
        }
        this.reason = '';
        this.$nextTick(() => {
          c.classList.remove('d-opaq');
        });
      }
    },

    async cancelAuction(e, obj, clObj) {
      const t = e.target.closest('.m-container');
      const c = t.querySelector('.cancel-proposition');
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        const _id =
          obj.from.member_id === this.$store.getters.member_id
            ? obj.to.member_id
            : obj.from.member_id;
        await this.$io.cancelAuction(clObj.collection, _id, {
          id: obj.id,
          description: this.reason
        });
        this.message = 'Торг отменен';
      } catch (e) {
        this.$errorHandle(e);
      }
      c.classList.add('d-opaq');
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    },

    removeRequest(obj) {
      this.callback = async () => {
        if (this.mobile) {
          this.mobLoading = true;
        } else {
          this.$screen(true);
        }
        try {
          if (this.currentTab === 'active') {
            for (const a of obj.auctions) {
              try {
                const _id =
                  a.from.member_id === this.$store.getters.member_id
                    ? a.to.member_id
                    : a.from.member_id;
                await this.$io.cancelAuction(obj.collection, _id, {
                  id: a.id,
                  description: 'deleted'
                });
              } catch (e) {
                this.$errorHandle(e);
              }
            }
          }
          await this.$claim.delete(obj.collection, obj.id);

          if (this.currentTab === 'active' || this.currentTab === 'created') {
            const i = this.found.findIndex((a) => a.id === obj.id);
            if (i !== -1) {
              if (this.pages === this.page) {
                if (this.found.length === 1) {
                  if (this.pages > 1) {
                    Vue.set(this, 'pageObj', { page: 0 });
                    this.$nextTick(() => {
                      Vue.set(this, 'pageObj', { page: this.page - 1 });
                    });
                  } else {
                    this.found.splice(i, 1);
                  }
                } else {
                  document.querySelector('.active').classList.remove('active');
                  this.found.splice(i, 1);
                }
              } else if (this.pages !== this.page) {
                const left = this.total - (this.pages - 1) * this.limit;
                if (left === 1) {
                  --this.pages;
                }
              }
            }
          }
          const els = [
            this.$el.querySelector('[data-id="created"]'),
            this.$el.querySelector('[data-id="active"]'),
            this.$el.querySelector('[data-id="process"]')
          ];
          try {
            const t = await this.$io.totalAuctions();
            t.forEach((d, i) => {
              const el = els[i];
              const b = el.querySelector('.bubble');
              if (d === 0) {
                if (b !== null) {
                  b.remove();
                }
              } else if (d !== 0) {
                if (b === null) {
                  const s = document.createElement('span');
                  s.classList.add('bubble');
                  s.textContent = d;
                  el.appendChild(s);
                } else {
                  b.textContent = d;
                }
              }
            });
          } catch (e) {
            this.$errorHandle(e);
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
        this.$hideDialog();
      };
      this.$dialog({
        image: this.$imgSrc('icons/garbage.svg'),
        text: 'Вы дествительно хотите удалить заявку?'
      });
    },

    closeCancel(e) {
      const t = e.target.closest('.m-container');
      const c = t.querySelector('.cancel-proposition');
      const o = t.querySelector('.ok');
      c.classList.add('d-opaq');
      setTimeout(() => {
        for (const r of c.querySelectorAll('[type="radio"]')) {
          r.checked = false;
        }
        this.reason = '';
        o.style.width = '0';
      }, 200);
    },

    cancelAuctionReason(e) {
      const r = e.target;
      const o = r.closest('.cancel-proposition').querySelector('.ok');
      if (r.checked) {
        this.reason = r.value;
        o.style.width = '65px';
      }
    },

    async finishClaim(obj) {
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      const a = obj.auctions[0];
      try {
        const id =
          a.from.member_id === this.$store.getters.member_id
            ? a.to.member_id
            : a.from.member_id;
        await this.$io.closeAuction(obj.collection, id, {
          id: a.id,
          initiatorId: this.$isEmpty(obj.closingInitiator)
            ? this.$store.getters.member_id
            : ''
        });
        this.message = 'Заявка успешно закрыта!';
        if (!this.$isEmpty(obj.closingInitiator)) {
          this.$store.commit('setOverlayMode', 'm-review');
          this.$store.commit('setOverlayObject', {
            id: obj.id,
            collection: obj.collection,
            memberToId: id,
            clientMemberId:
              obj.company.id === this.$store.getters.company_id ? id : ''
          });
          this.$store.commit('setOverlayVisible', true);
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

    showReview(obj) {
      let id = '';
      let to =
        obj.contact.member_id !== this.$store.getters.member_id
          ? obj.contact.member_id
          : '';
      if (obj.contact.member_id === this.$store.getters.member_id) {
        const y = obj.auctions[0];
        id = to =
          y.from.member_id === this.$store.getters.member_id
            ? y.to.member_id
            : y.from.member_id;
      }
      this.$store.commit('setOverlayMode', 'm-review');
      this.$store.commit('setOverlayObject', {
        id: obj.id,
        collection: obj.collection,
        memberToId: to,
        clientMemberId: id
      });
      this.$store.commit('setOverlayVisible', true);
    },

    expandMobile(e) {
      const t = e.target.closest('.expand-info');
      const h = t.previousElementSibling;
      const c = h.children[0];
      const r = h.closest('.request');
      const ex = r.querySelector('.extra-info');
      const exC = ex.querySelector('[class*="container"]');
      const exE = ex.querySelector('[class*="expand"]');
      for (const req of document.querySelectorAll('.request')) {
        if (r !== req) {
          if (req.classList.contains('active')) {
            const b = req.querySelector('.expand-info');
            const hi = b.previousElementSibling;
            try {
              req.querySelector('.propositions-content').style.height = '0';
              req.querySelector('.propositions-content').style.overflow =
                'hidden';
            } catch {}
            exC.style.height = '0';
            exC.style.overflow = 'hidden';
            exE.classList.remove('shown');
            hi.style.height = '0';
            b.classList.add('d-flex');
            b.classList.remove('d-none');
            req.classList.remove('active');
          }
        }
      }
      t.classList.add('d-none');
      t.classList.remove('d-flex');
      h.style.height = c.offsetHeight + 'px';
      r.classList.add('active');
    },
    expandItem(e, mobile = undefined) {
      const t = e.target;
      const p = t.closest('.propositions');
      const r = p.parentElement;
      const iC = p.querySelector('.item-container');
      const c = iC.parentElement;
      const iCH = iC.offsetHeight;

      for (const ip of document.querySelectorAll('.propositions')) {
        if (ip !== p) {
          ip.parentElement.classList.remove('active');
          ip.querySelector('.item-container').parentElement.style.height = '0';
          if (!mobile) {
            ip.parentElement.style.overflow = 'hidden';
          }
        }
      }
      if (mobile) {
        const h = p.closest('.hidden');
        if (c.style.height.split('px')[0] == 0) {
          c.style.height = iCH + 'px';
          h.style.height = h.offsetHeight + iCH + 'px';
          setTimeout(() => {
            c.style.overflow = 'visible';
          }, 200);
        } else {
          c.style.height = '0';
          c.style.overflow = 'hidden';
          h.style.height = h.offsetHeight - iCH + 'px';
        }
      } else if (!mobile) {
        if (!r.classList.contains('active')) {
          r.classList.add('active');
          c.style.height = iCH + 'px';
          setTimeout(() => {
            c.style.overflow = 'visible';
          }, 200);
        } else {
          r.classList.remove('active');
          c.style.height = '0';
          c.style.overflow = 'hidden';
        }
      }
    },
    expandExtra(e) {
      const r = e.target.closest('.request');
      const ex = r.querySelector('.extra-info');
      const exC = ex.querySelector('[class*="container"]');
      const exD = exC.children[0];
      const exE = ex.querySelector('[class*="expand"]');
      const exDH = exD.offsetHeight;
      let t, h, c;
      if (this.mobile) {
        t = r.querySelector('.expand-info');
        h = t.previousElementSibling;
        c = h.children[0];
      }
      if (exE.classList.contains('shown')) {
        exC.style.height = '0';
        exC.style.overflow = 'hidden';
        exE.classList.remove('shown');
        if (this.mobile) {
          h.style.height = c.offsetHeight - exDH + 'px';
          setTimeout(() => {
            h.style.height = 'auto';
            this.$nextTick(() => {
              h.style.height = c.offsetHeight + 'px';
            });
          }, 300);
          // setTimeout(() => {

          // }, 210);
        }
      } else {
        if (this.mobile) {
          h.style.height = 'auto';
          h.style.height = c.offsetHeight + 'px';
        }
        exC.style.height = `${exDH}px`;
        setTimeout(() => {
          exC.style.overflow = 'visible';
        }, 210);
        if (this.mobile) {
          h.style.height = c.offsetHeight + exDH + 'px';
        }
        exE.classList.add('shown');
      }
    },
    async startChat(e, user) {
      const c = this.$store.getters.chat;
      if (c !== user.member_id) {
        this.$screen(true);
        const k = user.member_id;
        const u = this.$store.getters.unread;
        try {
          const m = await this.$io.getChat(k);
          m.items.reverse();
          this.$store.commit('messaging/startChat', {
            memberPhoto: user.avatar || {
              value: this.$imgSrc('void-img.png'),
              position: [0, 0, 0]
            },
            memberName: user.name,
            content: m.items,
            member_id: k,
            total: m.pagination.totalCount
          });
          if (!u.hasOwnProperty(k)) {
            this.$store.commit('messaging/addUnread', {
              [k]: {
                ids: [],
                memberPhoto: user.avatar || {
                  value: this.$imgSrc('void-img.png'),
                  position: [0, 0, 0]
                },
                memberName: user.name
              }
            });
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
      }
    },

    async makeChat(obj) {
      const y =
        obj.from.member_id === this.$store.getters.member_id
          ? obj.to
          : obj.from;
      try {
        await this.startChat(null, y);
      } catch (e) {
        this.$errorHandle(e);
      }
    }
  }
};
