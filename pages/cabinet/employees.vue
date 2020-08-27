<template>
  <section class="company-profile r-section white-background">
    <form
      v-if="
        !$localstorage
          .get('userRole')
          .toLowerCase()
          .includes('driver')
      "
      class="profile"
    >
      <h1>добавить сотрудника</h1>
      <div class="edit-data mb-8">
        <div class="role-input d-flex flex-column">
          <m-input
            name="userEmail"
            placeholder="E-mail"
            :required="true"
            data-validate="email"
          ></m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <m-select
            name="userRole"
            :required="true"
            placeholder="Должность"
            :options="optionRoles"
          ></m-select>
        </div>
        <div id="buttons" class="role-input d-flex justify-center">
          <div class="b-container">
            <m-button
              shade="blue"
              :disabled="disabled"
              @click.native="invite($event)"
              >пригласить</m-button
            >
          </div>
        </div>
      </div>
    </form>
    <div v-if="!$isEmpty(users)" class="profile">
      <h1>добавленные сотрудники</h1>
      <div class="edit-data mb-8 b-shadow">
        <div :key="ready" class="role-input">
          <transition-group name="left" appear mode="out-in">
            <div v-for="d of users" :key="d.id.value" class="d-info">
              <div
                ref="avatar"
                class="d-item d-avatar"
                :style="{
                  backgroundImage: image(d),
                  backgroundSize: size(d)[2],
                  backgroundPosition: `${size(d)[0]} ${size(d)[1]}`
                }"
              >
                <div
                  v-if="
                    d.member.id.value !== $store.getters.member_id &&
                      isOnline(d.member.id.value)
                  "
                  class="online"
                ></div>
              </div>
              <div class="d-item d-second">{{ name(d) }}</div>
              <div class="d-item d-second d-role">
                {{ role(d) }}
              </div>
              <div class="d-item d-contacts">
                <template v-for="(p, ind) of phones(d)">
                  <div :key="`${p.value}-${ind}`" class="d-icons">
                    <a
                      :class="{ 'd-opaq': !has(p, 'whatsapp') }"
                      :href="`whatsapp://send?phone=${p.value}`"
                      ><img :src="$imgSrc('icons/contact/whatsapp.svg')" alt=""
                    /></a>
                    <a
                      :class="{ 'd-opaq': !has(p, 'telegram') }"
                      :href="`tg://resolve?domain=${p.value}`"
                      ><img :src="$imgSrc('icons/contact/telegram.svg')" alt=""
                    /></a>
                    <a
                      :class="{ 'd-opaq': !has(p, 'viber') }"
                      :href="`viber://add?number=${p.value}`"
                      ><img :src="$imgSrc('icons/contact/viber.svg')" alt=""
                    /></a>
                  </div>
                  <a :key="p.value" :href="`tel:${p.value}`">{{ p.value }}</a>
                </template>
                <div v-if="!$isEmpty(skype(d))" class="d-icons">
                  <a
                    :href="`skype:${skype(d)}?call`"
                    style="grid-column-start: 3"
                    ><img :src="$imgSrc('icons/contact/skype.svg')" alt=""
                  /></a>
                </div>
                <a
                  v-if="!$isEmpty(skype(d))"
                  :href="`skype:${skype(d)}?call`"
                  >{{ skype(d) }}</a
                >
                <div
                  v-if="d.member.id.value !== $store.getters.member_id"
                  class="m-container"
                  @click="startChat(d)"
                >
                  <img :src="$imgSrc('icons/dialogue.svg')" />
                  <span>начать чат</span>
                </div>
              </div>
              <div class="d-item d-erase d-flex align-center justify-center">
                <img
                  v-if="isManager(d)"
                  class="pointer"
                  :src="$imgSrc('icons/remove-user.svg')"
                  alt=""
                  @click="eraseUser(d.id.value)"
                />
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import dialog from '~/mixins/dialog.js';

export default {
  mixins: [hideMobileMenu, dialog],
  async asyncData({ app, redirect, route, store }) {
    try {
      const users = await app.$user.getUsers();
      users.map((a) => {
        (async () => {
          const i = await app.$fetchImage(a.member.photo.value);
          a.member.photo.value = i;
        })();
      });
      users.sort((a, b) => {
        if (
          a.member.name.default.toLowerCase() >
          b.member.name.default.toLowerCase()
        ) {
          return 1;
        } else if (
          a.member.name.default.toLowerCase() <
          b.member.name.default.toLowerCase()
        ) {
          return -1;
        } else if (
          a.member.name.default.toLowerCase() ===
          b.member.name.default.toLowerCase()
        ) {
          return 0;
        } else {
          return -1;
        }
      });
      const manager = app.$localstorage
        .get('userRole')
        .toLowerCase()
        .includes('manager');
      if (manager) {
        const m = await app.$user.countManagers();
        return {
          managers: m.countManagers,
          users
        };
      } else {
        return {
          users
        };
      }
    } catch (e) {
      app.$errorHandle(e);
    }
  },
  data() {
    return {
      disabled: false,
      correct: true,
      ready: false
    };
  },
  computed: {
    ...mapState(['mobile', 'data']),
    optionRoles() {
      return this.$store.state.employeeRoles.filter((a) => {
        if (
          !this.$localstorage
            .get('userRole')
            .toLowerCase()
            .includes('manager')
        ) {
          if (a.value.toLowerCase().includes('manager')) {
            return false;
          }
        }
        return true;
      });
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.ready = !this.ready;
      this.$nextTick(() => {
        this.$nuxt.$loading.finish();
      });
    });
  },
  methods: {
    eraseUser(id) {
      this.callback = () => {
        this.$erase
          .user(id)
          .then((r) => {
            this.users.splice(
              this.users.findIndex((i) => i.id.value === id),
              1
            );
          })
          .catch((e) => {
            this.$error(e);
          })
          .finally(() => {
            this.$hideDialog();
          });
      };
      this.$dialog({
        image: this.$imgSrc('icons/delete-user.svg'),
        text:
          'Вы дествительно хотите удалить пользователя из списка сотрудников?'
      });
    },
    isOnline(id) {
      return !this.$isEmpty(
        this.$store.getters.online.find((a) => a.id === id)
      );
    },
    isManager(obj) {
      if (
        this.$localstorage
          .get('userRole')
          .toLowerCase()
          .includes('manager')
      ) {
        if (obj.role.manager) {
          if (this.managers === 1) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    size(obj) {
      if (this.$el) {
        const a = this.$el.querySelectorAll('.d-info .d-avatar')[0];
        const w = a.offsetWidth;
        const sF = w / 124;
        const p = obj.member.photo.position;
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
    image(obj) {
      return `url(${
        !this.$isEmpty(obj.member.photo.value)
          ? obj.member.photo.value
          : this.$imgSrc('void-img.png')
      })`;
    },
    name(obj) {
      return obj.member.name.default;
    },
    phones(obj) {
      const p = [];
      for (const i of obj.member.phones) {
        p.push({
          value: i.value.default,
          messengerSupports: JSON.parse(JSON.stringify(i.messengerSupports))
        });
      }
      return p;
    },
    skype(obj) {
      return obj.member.skype.default;
    },
    id(obj) {
      return obj.member.id.value;
    },
    has(p, str) {
      return p.messengerSupports[str];
    },
    role(obj) {
      return this.$capitalize(this.$store.getters.getMemberRole(obj.role.name));
    },
    invite(e) {
      if (!this.disabled) {
        this.correct = true;
        const t = e.target.closest('.m-button');
        const f = t.closest('form');
        for (const d of f.querySelectorAll('[data-validate]')) {
          const { ...v } = this.$validate({
            [d.getAttribute('data-validate')]: d.value
          });
          if (!this.$isEmpty(v)) {
            this.correct = false;
            this.$incorrect({
              target: d,
              error: v[d.getAttribute('data-validate')]
            });
          }
        }
        for (const d of f.querySelectorAll(
          '[data-required]:not([data-validate])'
        )) {
          if (this.$isEmpty(d.value)) {
            this.$incorrect({
              target:
                d.getAttribute('type') === 'hidden' ? d.nextElementSibling : d
            });
            this.correct = false;
          }
        }
        if (this.correct) {
          this.disabled = true;
          this.$toggle(t);
          this.$nextTick(() => {
            const userRole = f.querySelector('[name="userRole"]').value;
            const userEmail = f.querySelector('[name="userEmail"]').value;
            this.$user
              .inviteUser(userRole, userEmail)
              .then((r) => {
                this.message = 'Приглашение отправлено';
              })
              .catch((e) => {
                this.$error(e);
              })
              .finally(() => {
                this.disabled = false;
                this.$toggle(t);
              });
          });
        }
      }
    },
    async startChat(user) {
      const c = this.$store.getters.chat;
      if (c !== user.member.id.value) {
        this.$screen(true);
        const k = user.member.id.value;
        const u = this.$store.getters.unread;
        try {
          const m = await this.$io.getChat(k);
          m.items.reverse();
          this.$store.commit('messaging/startChat', {
            memberPhoto: {
              value: this.$isEmpty(user.member.photo.value)
                ? this.$imgSrc('void-img.png')
                : user.member.photo.value,
              position: user.member.photo.position
            },
            memberName: user.member.name.default,
            content: m.items,
            member_id: k,
            total: m.pagination.totalCount
          });
          if (!u.hasOwnProperty(k)) {
            this.$store.commit('messaging/addUnread', {
              [k]: {
                ids: [],
                memberPhoto: {
                  value: this.$isEmpty(user.member.photo.value)
                    ? this.$imgSrc('void-img.png')
                    : user.member.photo.value,
                  position: user.member.photo.position
                },
                memberName: user.member.name.default
              }
            });
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
      }
    }
  },
  head() {
    return {
      title: '| Сотрудники'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/company.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.v-tooltip__content {
  background-color: $brand !important;
  max-width: 300px;
  padding: 8px;
}
#success {
  .v-snack__content {
    justify-content: center;
  }
}
</style>
