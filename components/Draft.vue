<template>
  <div class="drafts d-flex flex-column">
    <m-input
      class="search"
      :prepend="true"
      :input-value="result"
      @input="search"
    >
      <template #prepend>
        <img :src="$imgSrc('icons/search.svg')" alt="" />
      </template>
    </m-input>
    <div v-if="!popup && !$isEmpty(drafts)" class="limit d-flex align-center">
      <span>Отображать по</span>
      <div :class="{ current: limit === 5 }" @click="limit = 5">5</div>
      <div :class="{ current: limit === 10 }" @click="limit = 10">10</div>
      <div :class="{ current: limit === 25 }" @click="limit = 25">25</div>
      <div :class="{ current: limit === 50 }" @click="limit = 50">50</div>
      <div :class="{ current: limit === 100 }" @click="limit = 100">
        100
      </div>
    </div>
    <div class="items d-flex flex-column">
      <transition-group name="chips" mode="out-in">
        <div v-for="(d, i) of drafts" :key="d.date" class="item d-flex">
          <div class="title d-flex flex-column">
            <h3>{{ d.name.default }}</h3>
            <div>
              последнее изменение: <span>{{ date(d.date) }}</span>
            </div>
          </div>
          <div class="control d-flex align-center">
            <m-button
              shade="blue"
              :disabled="disabled"
              @click.native="showTemplate($event, i)"
              >выбрать</m-button
            >
            <div
              v-if="!popup"
              class="trash pointer d-flex align-center justify-center"
              @click="deleteDraft(i)"
            >
              <img :src="$imgSrc('icons/delete.svg')" alt="" />
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div v-if="pages > 1" :key="`${page}-${limit}`" class="pagination d-flex">
      <m-pagination
        v-model="obj"
        :pages="pages"
        :page="page"
        color="#4E5357"
      ></m-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import dialog from '~/mixins/dialog.js';

export default {
  mixins: [dialog],
  props: {
    popup: {
      type: Boolean,
      default: false
    },
    draft: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      loading: false,
      obj: { page: this.page, direction: 'right-tab' },
      disabled: false,
      pages: 1,
      page: 1,
      limit: 5,
      total: 0,
      result: '',
      dr: [],
      timer: undefined,
      full: true,
      collection: undefined
    };
  },
  computed: {
    drafts() {
      const arr = [];
      if (!this.$isEmpty(this.dr)) {
        if (this.collection === 'cargo') {
          this.dr.map((a) => {
            delete a.status;
            delete a.draft;
            delete a.published;
            for (const i of Object.keys(a.contact)) {
              if (i !== 'id' && i !== 'member') {
                delete a.contact[i];
              }
            }
            delete a.creator;
            arr.push(a);
          });
        } else {
          for (const n in this.dr) {
            const ob = this.dr[n];
            const res = ob.template || ob.draft;
            delete res.status;
            delete res.draft;
            delete res.published;
            for (const i of Object.keys(res.contact)) {
              if (i !== 'id' && i !== 'member') {
                delete res.contact[i];
              }
            }
            delete res.creator;
            res.driver = !this.$isEmpty(ob.driver)
              ? {
                  id: ob.driver.id.value,
                  value: ob.driver.driver.id.value,
                  title: ob.driver.driver.member.name.default
                }
              : {};
            res.tractor = !this.$isEmpty(ob.tractor)
              ? {
                  id: ob.tractor.id.value,
                  value: {
                    id: ob.tractor.tractor.id.value,
                    type: ob.tractor.tractor.type.default
                      .replace('CAR_TYPE_', '')
                      .toLowerCase()
                  },
                  title: `${ob.tractor.tractor.number.default} (${
                    ob.tractor.tractor.brand.default === 'other'
                      ? 'Другое'
                      : ob.tractor.tractor.brand.default
                  }, ${
                    ob.tractor.tractor.model.default === 'other'
                      ? 'Другое'
                      : ob.tractor.tractor.model.default
                  })`
                }
              : {};
            res.trailer = !this.$isEmpty(ob.trailer)
              ? {
                  id: ob.trailer.id.value,
                  value: {
                    id: ob.trailer.trailer.id.value,
                    type: ob.trailer.trailer.type.default
                      .replace('CAR_TYPE_', '')
                      .toLowerCase()
                  },
                  title: `${ob.trailer.trailer.number.default} (${
                    ob.trailer.trailer.brand.default === 'other'
                      ? 'Другое'
                      : ob.trailer.trailer.brand.default
                  }, ${
                    ob.trailer.trailer.model.default === 'other'
                      ? 'Другое'
                      : ob.trailer.trailer.model.default
                  })`
                }
              : {};
            res.partialLoad = {
              default: false
            };
            res.carCarsCount = {
              default: 0
            };
            arr.push(res);
          }
        }
      }
      return arr;
    }
  },
  watch: {
    obj(newV) {
      this.page = newV.page;
    },
    async page(newV) {
      const l = this.$el.querySelector('.search').querySelector('.loading_img');
      if (newV !== 0) {
        this.$screen(true);
        this.$waiting(l, true);
        try {
          const r = await this.$template.get(this.collection, newV, this.limit);
          if (Array.isArray(r)) {
            [...this.dr] = r;
          } else {
            ({ ...this.dr } = r);
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
        this.$waiting(l, false);
      }
    },
    limit(newV) {
      const div = this.total / newV;
      const abs = Math.floor(div);
      this.pages = div !== abs ? abs + 1 : abs;
      this.page = 0;
      let p = this.$localstorage.get('position');
      const e = this.$localstorage.get('email');
      const n = this.$route.name;
      if (!this.popup) {
        if (p !== undefined) {
          if (p[e]) {
            p[e][n] = {
              limit: this.limit
            };
            this.$localstorage.set('position', p, true);
          } else {
            p[e] = {
              [n]: {
                limit: this.limit
              }
            };
            this.$localstorage.set('position', p, true);
          }
        } else {
          p = {
            [e]: {
              [n]: {
                limit: this.limit
              }
            }
          };
          this.$localstorage.set('position', p, true);
        }
      }
      this.$nextTick(() => {
        this.page = 1;
      });
    }
  },
  async mounted() {
    this.$screen(true);
    let p = this.$localstorage.get('position');
    const e = this.$localstorage.get('email');
    const n = this.$route.name;
    const nArr = n.split('-');
    this.collection = this.draft ? this.draft : nArr[nArr.length - 1];
    if (!this.popup) {
      if (p !== undefined) {
        if (p[e]) {
          if (p[e][n]) {
            this.limit = p[e][n].limit;
          } else {
            p[e][n] = {
              limit: this.limit
            };
            this.$localstorage.set('position', p, true);
          }
        } else {
          p[e] = {
            [n]: {
              limit: this.limit
            }
          };
          this.$localstorage.set('position', p, true);
        }
      } else {
        p = {
          [e]: {
            [n]: {
              limit: this.limit
            }
          }
        };
        this.$localstorage.set('position', p, true);
      }
    }
    try {
      await this.createDrafts();
    } catch (e) {
      this.$errorHandle(e);
    }
    this.$nextTick(() => {
      this.$screen(false);
    });
  },
  methods: {
    async createDrafts(search = undefined) {
      const l = this.$el.querySelector('.search').querySelector('.loading_img');
      this.$waiting(l, true);
      const r = await this.$template.total(this.collection);
      this.total = r.total;
      if (this.total > 0) {
        const div = this.total / this.limit;
        const abs = Math.floor(div);
        this.pages = div !== abs ? abs + 1 : abs;
        const r = await this.$template.get(
          this.collection,
          1,
          this.limit,
          search
        );
        if (Array.isArray(r)) {
          [...this.dr] = r;
        } else {
          ({ ...this.dr } = r);
        }
      }
      this.$waiting(l, false);
    },
    deleteDraft(index) {
      this.callback = () => {
        (async () => {
          this.$screen(true);

          try {
            await this.$template.delete(
              this.collection,
              this.drafts[index].id.value
            );
            this.$hideDialog();
            const o = this.page;
            this.page = 0;
            this.$nextTick(() => {
              if (this.drafts.length === 1) {
                [...this.dr] = [];
                if (this.pages > 1) {
                  --this.pages;
                  this.page = this.pages;
                }
              } else {
                this.page = o;
              }
            });
          } catch (e) {
            this.$errorHandle(e);
            this.$hideDialog();
          }
          this.$screen(false);
        })();
      };
      this.$dialog({
        image: this.$imgSrc('icons/garbage.svg'),
        text: 'Вы дествительно хотите удалить шаблон?'
      });
    },
    date(str) {
      const d = this.$toISOString(new Date(str)).split('-');
      return `${d[2]}.${d[1]}.${d[0]}`;
    },
    async showTemplate(e, index) {
      const t = e.target.closest('.m-button');
      this.disabled = true;
      this.$toggle(t);
      this.$screen(true);
      try {
        let r = await this.$claim.draft(this.collection);
        if (!this.$isEmpty(r)) {
          try {
            r = r.driver !== undefined ? r.draft : r;
            await this.$claim.deleteDraft(this.collection, r.id.value);
            try {
              const i = await this.$template.makeDraft(
                this.collection,
                this.drafts[index].id.value
              );
              this.drafts[index].id.value = i.id;
              let res = await this.$claim.draft(this.collection);
              res = res.driver ? res.draft : res;
              let name, date;
              if (!Array.isArray(this.dr)) {
                ({ ...name } = JSON.parse(
                  JSON.stringify(this.dr[`template_${index}`].template.name)
                ));
                date = this.dr[`template_${index}`].template.date;
                ({ ...res.draft.name } = name);
                res.draft.date = date;
                Vue.set(this.dr, `template_${index}`, res);
              } else {
                ({ ...name } = JSON.parse(JSON.stringify(this.dr[index].name)));
                date = this.dr[index].date;
                ({ ...res.name } = name);
                res.date = date;
                Vue.set(this.dr, index, res);
              }
              this.$nextTick(() => {
                this.$store.commit('profile/setTemplate', this.drafts[index]);
                this.$screen(false);
                if (!this.popup) {
                  this.$router.push({
                    name: `cabinet-add-${this.collection}`
                  });
                }
              });
            } catch (e) {
              this.$errorHandle(e);
            }
          } catch (e) {
            this.$errorHandle(e);
          }
        } else {
          try {
            const i = await this.$template.makeDraft(
              this.collection,
              this.drafts[index].id.value
            );
            this.drafts[index].id.value = i.id;
            let res = await this.$claim.draft(this.collection);
            res = res.driver ? res.draft : res;
            let name, date;
            if (!Array.isArray(this.dr)) {
              ({ ...name } = JSON.parse(
                JSON.stringify(this.dr[`template_${index}`].template.name)
              ));
              date = this.dr[`template_${index}`].template.date;
              ({ ...res.draft.name } = name);
              res.draft.date = date;
              Vue.set(this.dr, `template_${index}`, res);
            } else {
              ({ ...name } = JSON.parse(JSON.stringify(this.dr[index].name)));
              date = this.dr[index].date;
              ({ ...res.name } = name);
              res.date = date;
              Vue.set(this.dr, index, res);
            }
            this.$nextTick(() => {
              this.$store.commit('profile/setTemplate', this.drafts[index]);
              this.$screen(false);
              if (!this.popup) {
                this.$router.push({
                  name: `cabinet-add-${this.collection}`
                });
              }
            });
          } catch (e) {
            this.$errorHandle(e);
          }
        }
      } catch (e) {
        this.$errorHandle(e);
      }
    },
    search(e) {
      const t = e.target;
      const m = t.closest('.m-input');
      const l = m.querySelector('.loading_img');
      const v = t.value;
      if (v.length > 2) {
        if (!this.$isEmpty(this.dr)) {
          [...this.dr] = [];
        }
        this.$waiting(l, true);
        this.$nextTick(() => {
          clearTimeout(this.timer);
          this.$cancel();
          setTimeout(() => {
            (async () => {
              try {
                await this.createDrafts(v);
                this.full = false;
              } catch (e) {
                this.pages = 1;
                (async () => {
                  try {
                    await this.createDrafts();
                    this.full = true;
                  } catch (e) {
                    [...this.dr] = [];
                    this.$errorHandle(e);
                  }
                })();
              }
              this.$waiting(l, false);
            })();
          }, 750);
        });
      } else if (v.length < 3) {
        this.$cancel();
        clearTimeout(this.timer);
        if (!this.full) {
          this.$waiting(l, true);
          (async () => {
            try {
              await this.createDrafts();
              this.full = true;
            } catch (e) {
              this.$errorHandle(e);
              [...this.dr] = [];
              this.full = false;
            }
          })();
          this.$waiting(l, true);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/drafts.scss';
</style>
