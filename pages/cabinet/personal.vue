<template>
  <section class="company-profile r-section">
    <form class="profile">
      <h1>Личный кабинет</h1>
      <div class="edit-data mb-8">
        <div class="bio">
          <m-image-upload
            id="avatar"
            type="avatar"
            :image="memberPhoto"
            :position="memberPhotoPosition"
            class="w-100"
            @change="uploadImage($event, 'memberPhoto')"
            >ваше фото</m-image-upload
          >
          <div id="fio" class="role-input d-flex flex-column">
            <h3>ФИО</h3>
            <m-input
              placeholder="Фамилия Имя Отчество"
              :input-value="data.memberName"
              @input="saveChanges($event, 'memberName')"
            >
            </m-input>
          </div>
          <div id="role" class="role-input d-flex flex-column">
            <h3>роль</h3>
            <m-input
              placeholder="Роль участника"
              :disabled="true"
              :input-value="role"
            ></m-input>
          </div>
        </div>
        <!-- <div class="role-input d-flex flex-column">
          <h3 class="mb-n3">изменить данные для входа</h3>
        </div>
        <div id="email" class="role-input d-flex flex-column">
          <h3>E-mail</h3>
          <m-input
            placeholder="E-mail"
            :required="true"
            data-validate="email"
            :input-value="$localstorage.get('email')"
            @input="saveChanges($event, 'userEmail')"
          ></m-input>
        </div>
        <div id="password" class="role-input d-flex flex-column">
          <h3>пароль</h3>
          <m-input
            id="password"
            placeholder="Пароль"
            type="password"
            @input="checkPassword($event)"
          >
            <template #default>
              <v-tooltip top>
                <template #activator="{ on }">
                  <img
                    :src="$imgSrc('icons/view.svg')"
                    class="pointer view d-none"
                    alt=""
                    @click="togglePassword($event)"
                    v-on="on"
                  />
                </template>
                <span>Скрыть пароль</span>
              </v-tooltip>
              <v-tooltip top>
                <template #activator="{ on }">
                  <img
                    :src="$imgSrc('icons/hide.svg')"
                    class="pointer hide"
                    alt=""
                    @click="togglePassword($event)"
                    v-on="on"
                  />
                </template>
                <span>Показать пароль</span>
              </v-tooltip>
            </template>
          </m-input>
        </div>
        <div id="password_repeat" class="role-input d-flex flex-column">
          <h3>Повтор пароля</h3>
          <m-input
            id="password_repeat"
            placeholder="Повторите пароль"
            type="password"
            @input="checkPassword($event)"
            ><template #default>
              <v-tooltip top>
                <template #activator="{ on }">
                  <img
                    :src="$imgSrc('icons/view.svg')"
                    class="pointer view d-none"
                    alt=""
                    @click="togglePassword($event)"
                    v-on="on"
                  />
                </template>
                <span>Скрыть пароль</span>
              </v-tooltip>
              <v-tooltip top>
                <template #activator="{ on }">
                  <img
                    :src="$imgSrc('icons/hide.svg')"
                    class="pointer hide"
                    alt=""
                    @click="togglePassword($event)"
                    v-on="on"
                  />
                </template>
                <span>Показать пароль</span>
              </v-tooltip>
            </template></m-input
          >
        </div> -->
        <div class="phones">
          <template v-if="data.memberPhones">
            <div
              v-for="(t, i) of data.memberPhones"
              :key="i"
              class="role-input d-flex flex-column"
              :data-id="t"
            >
              <h3>Телефон</h3>
              <div class="d-flex p-container">
                <m-select
                  :temp="true"
                  placeholder="Выберите страну"
                  class="temp choose d-opaq opaq"
                  value-mode="object"
                  options-mode="icon"
                  :options="isoCodes"
                  :data-id="i"
                  :max-height="300"
                  @change="inputIso"
                ></m-select>
                <m-input
                  name="memberPhone"
                  :required="true"
                  data-validate="phone"
                  placeholder="Телефон"
                  :prepend="true"
                  :multi="true"
                  class="w-100"
                  :input-value="t.value.default"
                  @click="pastePlus($event, i)"
                  @input="findCode($event, i)"
                >
                  <template #default>
                    <div class="f32 d-flex justify-end align-center">
                      <div></div>
                    </div>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <img
                          :src="$imgSrc('icons/ok.svg')"
                          class="pointer ok d-none"
                          alt=""
                          @click="saveChanges($event, 'memberPhone', i)"
                          v-on="on"
                        />
                      </template>
                      <span>Сохранить изменения</span>
                    </v-tooltip>
                  </template>
                  <template #prepend>
                    <v-tooltip top>
                      <template #activator="{on}">
                        <div
                          id="whatsapp"
                          class="pointer media justify-center align-center"
                          :class="{
                            active: isMesengerActive('whatsapp', i)
                          }"
                          v-on="on"
                          @click="addMessenger($event, i)"
                        >
                          <img :src="$imgSrc('icons/whatsapp.svg')" alt="" />
                        </div>
                      </template>
                      <span>Привязать телефон к месенджеру</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{on}">
                        <div
                          id="telegram"
                          class="pointer media justify-center align-center"
                          :class="{
                            active: isMesengerActive('telegram', i)
                          }"
                          v-on="on"
                          @click="addMessenger($event, i)"
                        >
                          <img :src="$imgSrc('icons/telegram.svg')" alt="" />
                        </div>
                      </template>
                      <span>Привязать телефон к месенджеру</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{on}">
                        <div
                          id="viber"
                          class="pointer media justify-center align-center"
                          :class="{ active: isMesengerActive('viber', i) }"
                          v-on="on"
                          @click="addMessenger($event, i)"
                        >
                          <img :src="$imgSrc('icons/viber.svg')" alt="" />
                        </div>
                      </template>
                      <span>Привязать телефон к месенджеру</span>
                    </v-tooltip>
                  </template>
                </m-input>
                <v-tooltip top>
                  <template #activator="{on}">
                    <div
                      class="remove-number pointer align-center justify-center"
                      :style="{
                        display: t.value.default.length > 3 ? 'flex' : 'none'
                      }"
                      @click="removeNumber($event, i)"
                      v-on="on"
                    >
                      <img :src="$imgSrc('icons/close.svg')" alt="" />
                    </div>
                  </template>
                  <span>Убрать номер</span>
                </v-tooltip>
              </div>
            </div>
          </template>
          <div
            class="role-input d-flex align-center add-number pointer"
            style="grid-column-start: 1"
            @click="addNumber($event)"
          >
            <img :src="$imgSrc('icons/add.svg')" alt="" class="mr-2" />
            <span>добавить номер</span>
          </div>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>skype</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.memberSkype"
            @input="saveChanges($event, 'memberSkype')"
          >
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>facebook</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.memberFacebook"
            @input="saveChanges($event, 'memberFacebook')"
          >
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>instagram</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.memberInstagram"
            @input="saveChanges($event, 'memberInstagram')"
          >
          </m-input>
        </div>
        <div class="role-input d-flex flex-column" style="grid-column: 1 / -1">
          <h3>
            профессиональные навыки
          </h3>
          <textarea
            v-model="textarea"
            placeholder="Перечень ваших профессиональных навыков"
            @input="saveChanges($event, 'memberDescription')"
          />
          <m-counter :total="1000" :current="textarea.length"></m-counter>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { codes } from '~/modules/iso.js';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import phoneCodes from '~/mixins/phoneCodes.js';

export default {
  mixins: [hideMobileMenu, phoneCodes],
  async asyncData({ app, store, redirect, route }) {
    try {
      const r = await app.$getMemberInfo();
      r.companyLogo = store.state.data.companyLogo;
      r.companyPhoto = store.state.data.companyPhoto;
      r.companyRate = store.state.data.companyRate;
      r.memberPhoto = store.state.data.memberPhoto;
      r.memberName = store.state.data.memberName;
      store.commit('setData', r);
      if (store.state.data.memberPhones.length === 0) {
        store.commit('addMemberPhone', '');
      }
      store.commit('setState', { logged: true });
      return {};
    } catch (e) {
      app.$errorHandle(e);
    }
  },
  data() {
    return {
      password: '',
      password_repeat: '',
      timer: undefined,
      timerP: undefined,
      correct: true
    };
  },
  computed: {
    ...mapState(['data']),
    role() {
      return this.$capitalize(
        this.$store.getters.getMemberRole(this.$localstorage.get('userRole'))
      );
    },
    textarea: {
      get() {
        return this.$store.state.data.memberDescription || '';
      },
      set(v) {
        this.$store.commit('setField', {
          field: 'memberDescription',
          value: v
        });
      }
    },
    editImage: {
      get() {
        return this.$store.state.profile.editImage;
      },
      set(v) {
        this.$store.commit('profile/setState', { editImage: v });
      }
    },
    imageCollection: {
      get() {
        return this.$store.state.profile.imageCollection;
      },
      set(v) {
        this.$store.commit('profile/setState', { imageCollection: v });
      }
    },
    showEditor: {
      get() {
        return this.$store.state.profile.showEditor;
      },
      set(v) {
        this.$store.commit('profile/setState', { showEditor: v });
      }
    },
    memberPhotoPosition: {
      get() {
        let p = [];
        [...p] = this.$store.state.data.memberPhoto
          ? this.$store.state.data.memberPhoto.position
          : [0, 0, 0];
        return p;
      },
      set(v) {
        this.$store.commit('setImagePosition', { memberPhoto: v });
      }
    },
    memberPhoto: {
      get() {
        return this.$store.state.data.memberPhoto
          ? this.$store.state.data.memberPhoto.value
          : `/images/void-img.png`;
      },
      set(v) {
        this.$store.commit('setImage', { memberPhoto: v });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (document.querySelectorAll('.remove-number').length === 1) {
        if (this.$store.getters.getMemberPhone(0) === '') {
          document.querySelector('.remove-number').style.display = 'none';
        }
      }
      const phones = document.querySelectorAll('[name="memberPhone"]');
      if (!this.$isEmpty(phones)) {
        for (let i = 0; i < phones.length; i++) {
          const t = phones[i];
          const v = t.value;
          const f = t.previousElementSibling.children[1].children[0];
          const r = t.closest('.role-input').querySelector('.remove-number');
          f.removeAttribute('class');
          if (v.length > 2) {
            for (const c of Object.keys(codes)) {
              if (v.includes(c)) {
                f.classList.add('flag');
                f.classList.add(codes[c]);
                break;
              }
            }
          }
          if (v.length >= 4) {
            r.style.display = 'flex !important';
          } else {
            r.style.display = 'none';
          }
        }
      }
      this.unwatch = this.$store.watch(
        (state, getters) => getters.showEditor,
        (newV, oldV) => {
          if (newV) {
            document.querySelector('html').style.overflowY = 'hidden';
          } else {
            document.querySelector('html').style.overflowY = 'auto';
          }
        }
      );
      this.$nuxt.$loading.finish();
    });
  },
  beforeDestroy() {
    this.unwatch();
  },
  methods: {
    isMesengerActive(messenger, i) {
      const p = this.$store.state.data.memberPhones;
      return p ? p[i].messengerSupports[messenger] : false;
    },
    uploadImage(e, collection) {
      const t = e.target;
      const f = t.files[0];
      const r = new FileReader();
      r.onload = (e) => {
        const res = e.target.result;
        this.editImage = res;
        this.imageCollection = collection;
        this.showEditor = true;
        t.value = '';
      };
      r.readAsDataURL(f);
    },
    validateNumbers() {
      this.correct = true;
      for (const n of document.querySelectorAll('[name="memberPhone"]')) {
        if (n.value > 0) {
          const { ...r } = this.$validate({ phone: n.value });
          if (Object.keys(r).length > 0) {
            this.correct = false;
            n.classList.add('incorrect');
            n.nextElementSibling.textContent = r.phone;
          }
        }
      }
    },
    pastePlus(e, id) {
      const t = e.target;
      const i = t.closest('.m-input');
      i.setAttribute('data-active', '');
      if (t.value !== '') {
        this.$store.commit('setMemberPhone', { id, value: t.value });
      } else {
        const m = i.previousElementSibling;
        m.classList.remove('d-opaq');
        setTimeout(() => {
          m.querySelector('._input').click();
        }, 100);
      }
      this.toggleEdit(e);
      if (
        t
          .closest('.m-input')
          .querySelector('.ok')
          .classList.contains('d-none')
      ) {
        t.closest('.m-input')
          .querySelector('.ok')
          .classList.remove('d-none');
      }
    },
    removePlus(e, id) {
      const t = e.target;
      const r = t.closest('.role-input').querySelector('.remove-number');
      if (t.value.trim().length <= 4) {
        if (this.data.memberPhones.length > 1) {
          this.$erase.memberPhone(this.data.memberPhones[id]);
          this.$store.commit('removeMemberPhone', id);
          for (const m of document.querySelectorAll('[name="memberPhone"]')) {
            try {
              this.$justify(m.closest('.m-input'));
            } catch {}
          }
        } else {
          t.value = '';
          this.$erase.memberPhone(this.data.memberPhones[id]);
          this.$store.commit('cleanMemberPhone', id);
          r.style.display = 'none';
          const f = t.previousElementSibling.children[1].children[0];
          f.removeAttribute('class');
        }
      } else {
        this.validateNumbers();
      }
    },
    findCode(e, id) {
      this.pastePlus(e, id);
      const t = e.target;
      const v = t.value;
      this.$store.commit('setMemberPhone', { id, value: v });
      const f = t.previousElementSibling.children[1].children[0];
      const r = t.closest('.role-input').querySelector('.remove-number');
      f.removeAttribute('class');
      if (v.length > 2) {
        for (const c of Object.keys(codes)) {
          if (v.includes(c)) {
            f.classList.add('flag');
            f.classList.add(codes[c]);
            break;
          }
        }
      }
      if (v.length >= 4) {
        r.style.display = 'flex !important';
      } else {
        r.style.display = 'none';
      }
    },
    activateField(e) {
      const t = e.target;
      const m = t.closest('.m-input');
      if (!this.$store.state.data.companyName) {
        this.info = true;
        m.querySelector('.ok').classList.remove('d-none');
      }
    },

    addMessenger(e, index) {
      const t = e.target.closest('.media');
      if (t.closest('.m-input').hasAttribute('data-active')) {
        if (t.classList.contains('active')) {
          t.classList.remove('active');
        } else {
          t.classList.add('active');
        }
        this.$store.commit('setMemberMessenger', {
          index,
          messenger: t.getAttribute('id'),
          state: t.classList.contains('active')
        });
      }
    },
    addNumber(e) {
      const el = e.target.closest('.add-number');
      if (
        el.previousElementSibling.querySelector('[type="text"]').value.length >
        4
      ) {
        this.validateNumbers();
        if (this.correct) {
          this.$store.commit('addMemberPhone', '');
          this.$nextTick(() => {
            el.previousElementSibling.querySelector(
              '.remove-number'
            ).style.display = 'none';
          });
        }
      }
    },
    removeNumber(e, index) {
      const el = e.target.closest('.role-input');
      const i = el.querySelector('[type="text"]');
      if (this.data.memberPhones.length > 1) {
        this.$erase.memberPhone(this.data.memberPhones[index]);
        this.$store.commit('removeMemberPhone', index);
      } else {
        i.value = '';
        this.removePlus({ target: i }, index);
        i.classList.remove('incorrect');
        i.nextElementSibling.textContent = '';
        i.closest('.m-input').removeAttribute('data-active');
        if (
          !i
            .closest('.m-input')
            .querySelector('.ok')
            .classList.contains('d-none')
        ) {
          i.closest('.m-input')
            .querySelector('.ok')
            .classList.add('d-none');
        }
        this.toggleEdit({ target: i });
      }
      this.$nextTick(() => {
        const phones = document.querySelectorAll('[name="memberPhone"]');
        if (!this.$isEmpty(phones)) {
          for (let i = 0; i < phones.length; i++) {
            const t = phones[i];
            if (
              !t
                .closest('.m-input')
                .querySelector('.ok')
                .classList.contains('d-none')
            ) {
              t.closest('.m-input')
                .querySelector('.ok')
                .classList.add('d-none');
            }
            try {
              this.$justify(t.closest('.m-input'));
            } catch {}
            const v = t.value;
            const f = t.previousElementSibling.children[1].children[0];
            const r = t.closest('.role-input').querySelector('.remove-number');
            f.removeAttribute('class');
            if (v.length > 2) {
              for (const c of Object.keys(codes)) {
                if (v.includes(c)) {
                  f.classList.add('flag');
                  f.classList.add(codes[c]);
                  break;
                }
              }
            }
            if (v.length >= 4) {
              r.style.display = 'flex !important';
            } else {
              r.style.display = 'none';
            }
          }
        }
      });
    },

    toggleEdit(e) {
      const m = e.target.closest('.m-input') || e.target.closest('.role-input');
      try {
        this.$justify(m);
      } catch {}
    },

    // togglePassword(e) {
    //   const t = e.target;
    //   const cL = t.classList;
    //   const i = t.closest('.m-input');
    //   const p = i.querySelector('[type]');
    //   const show = i.querySelector('.view');
    //   const hide = i.querySelector('.hide');
    //   if (cL.contains('hide')) {
    //     p.setAttribute('type', 'text');
    //     hide.classList.add('d-none');
    //     show.classList.remove('d-none');
    //   } else {
    //     p.setAttribute('type', 'password');
    //     hide.classList.remove('d-none');
    //     show.classList.add('d-none');
    //   }
    // },

    // checkPassword(e) {
    //   clearTimeout(this.timerP);
    //   const t = e.target;
    //   const p = document.querySelector('#password').querySelector('[type]');
    //   const pr = document
    //     .querySelector('#password_repeat')
    //     .querySelector('[type]');
    //   const password = p.value;
    //   const passwordRepeat = pr.value;
    //   this.correct = true;
    //   this.timerP = setTimeout(() => {
    //     if (this.$isEmpty(password)) {
    //       if (!this.$isEmpty(passwordRepeat)) {
    //         this.correct = false;
    //       }
    //     }
    //     if (!this.$isEmpty(password)) {
    //       if (this.$isEmpty(passwordRepeat)) {
    //         this.correct = false;
    //       }
    //       const { ...obj } = this.$validate({ password });
    //       if (!this.$isEmpty(obj)) {
    //         this.$incorrect({ target: p, error: obj.password });
    //         this.correct = false;
    //       }
    //       if (!this.$isEmpty(passwordRepeat)) {
    //         if (password !== passwordRepeat) {
    //           this.$incorrect({ target: pr, error: 'Пароли не совпадают' });
    //           this.correct = false;
    //         }
    //       }
    //     }
    //     if (this.correct) {
    //       this.$store.commit('profile/showDialog', {
    //         image: this.$imgSrc('icons/question.svg'),
    //         text: 'Вы действительно хотите поменять пароль?',
    //         yes: () => {
    //           console.log('success');
    //         }
    //       });
    //     }
    //   }, 1500);
    // },
    // savePassword(e) {
    //   // this.$toggle(e.target.closest('.m-button'));
    //   // this.$nextTick(() => {
    //   //   setTimeout(() => {
    //   //     this.$toggle(e.target.closest('.m-button'));
    //   //     this.$store.commit('setOverlayVisible', false);
    //   //   }, 1000);
    //   // });
    // },
    saveChanges(e, field, index = undefined) {
      this.$error();
      const t = e.target;
      let s;
      if (field === 'memberPhone') {
        const inp = t.closest('.m-input').querySelector('[type="text"]');
        this.removePlus({ target: inp }, index);
        if (this.correct) {
          if (this.data.memberPhones[index]) {
            if (!this.data.memberPhones[index].id) {
              this.$member
                .memberPhone(this.data.memberPhones[index])
                .then((r) => {
                  this.$store.commit('setMemberPhoneId', r.id);
                  // this.changes = true;
                })
                .catch((e) => {
                  this.$error(e);
                })
                .finally(() => {
                  t.closest('.m-input').removeAttribute('data-active');
                  if (
                    !t
                      .closest('.m-input')
                      .querySelector('.ok')
                      .classList.contains('d-none')
                  ) {
                    t.closest('.m-input')
                      .querySelector('.ok')
                      .classList.add('d-none');
                  }
                  this.toggleEdit(e);
                });
            } else {
              this.$change
                .memberPhone(this.data.memberPhones[index])
                .then((r) => {
                  // this.changes = true;
                })
                .catch((e) => {
                  this.$error(e);
                })
                .finally(() => {
                  t.closest('.m-input').removeAttribute('data-active');
                  if (
                    !t
                      .closest('.m-input')
                      .querySelector('.ok')
                      .classList.contains('d-none')
                  ) {
                    t.closest('.m-input')
                      .querySelector('.ok')
                      .classList.add('d-none');
                  }
                  this.toggleEdit(e);
                });
            }
          }
        }
      } else {
        const m = t.closest('.m-input');
        if (field === 'memberDescription') {
          s = t.closest('.role-input').querySelector('textarea');
        } else {
          s = m.querySelector('[type="text"]');
        }
        let enough = true;
        const v = s.value;
        if (field === 'memberDescription') {
          if (v.length > 1000) {
            this.$error(null, 'Введите не более 1000 символов');
            enough = false;
          } else {
            this.$error();
          }
        }
        if (enough) {
          this.$store.commit('setField', { field, value: v });
          this.rand = this.$random([this.rand]);
          this.$cancel();
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.$member[field](v)
              .then((r) => {
                this.toggleEdit(e);
                // this.changes = true;
              })
              .catch((e) => {
                this.$error(e);
              });
          }, 700);
        }
      }
    }
  },
  head() {
    return {
      title: '| Личная инфо'
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
