<template>
  <section
    class="company-profile r-section"
    :class="{ 'white-background': !isManager }"
  >
    <v-snackbar
      v-if="isManager"
      :value="info"
      color="info"
      :top="true"
      :bottom="true"
      :timeout="0"
      >Введите пожалуйста правильный номер ЕГРПОУ/ИНН, так как<br />это можно
      сделать только один раз.<br />Последующее изменение кода ЕГРПОУ/ИНН
      возможно только<br />после подачи заявки администраторам нашей системы.
      <img
        :src="$imgSrc('icons/close.svg')"
        alt=""
        class="mx-3 pointer"
        style="height: 20px"
        @click="info = false"
      />
    </v-snackbar>
    <v-snackbar
      v-if="isManager"
      :value="verified"
      color="#ffb11f"
      :top="true"
      :timeout="0"
    >
      Нет данных о компании. Проверьте правильность ЕГРПОУ/ИНН<img
        :src="$imgSrc('icons/close.svg')"
        alt=""
        class="mx-3 pointer"
        style="height: 20px"
        @click="verified = false"
      />
    </v-snackbar>
    <form class="profile">
      <h1 v-if="isManager">профиль компании</h1>
      <div v-if="isManager" class="edit-data">
        <div class="role-input d-flex flex-column">
          <h3>роль</h3>
          <m-input
            placeholder="Роль участника"
            :disabled="true"
            :input-value="role"
          ></m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>дата регистрации в системе</h3>
          <m-input
            placeholder="Дата регистрации"
            :disabled="true"
            :input-value="regDate(data.companyDate)"
          ></m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>название организации</h3>
          <m-input
            placeholder="Название"
            :disabled="true"
            :input-value="data.companyName"
          >
            <template #default>
              <img
                v-if="!data.companyName"
                :src="$imgSrc('icons/void-success.svg')"
                alt=""
              />
              <img v-else :src="$imgSrc('icons/success.svg')" alt="" />
            </template>
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>форма собственности</h3>
          <m-input
            placeholder="Форма"
            :disabled="true"
            :input-value="data.companyForm"
          >
            <template #default>
              <img
                v-if="!data.companyForm"
                :src="$imgSrc('icons/void-success.svg')"
                alt=""
              />
              <img v-else :src="$imgSrc('icons/success.svg')" alt="" />
            </template>
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>егрпоу/инн</h3>
          <m-input
            name="companyCode"
            placeholder="ЕГРПОУ/ИНН"
            :input-value="data.companyCode"
            @input="showDataBot($event)"
            @focus="activateField($event)"
          >
            <template #default>
              <img
                v-if="!data.companyName"
                :src="$imgSrc('icons/void-success.svg')"
                alt=""
              />
              <img v-else :src="$imgSrc('icons/success.svg')" alt="" />
              <!-- <v-tooltip top>
                    <template #activator="{ on }">
                      <img
                        v-if="!data.companyName"
                        :src="$imgSrc('icons/edit.svg')"
                        class="pointer edit"
                        alt=""
                        @click="activateField($event)"
                        v-on="on"
                      />
                    </template>
                    <span>Редактировть поле</span>
                  </v-tooltip> -->
              <v-tooltip top>
                <template #activator="{ on }">
                  <img
                    :src="$imgSrc('icons/ok.svg')"
                    class="pointer ok d-none"
                    alt=""
                    @click="saveCompanyInfo($event)"
                    v-on="on"
                  />
                </template>
                <span>Сохранить изменения</span>
              </v-tooltip>
            </template>
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>юридический адрес</h3>
          <!-- <m-input
            placeholder="Адрес"
            :disabled="true"
            :input-value="data.companyLegalAddress"
            input-style="padding-right:30px; text-overflow:ellipsis"
            v-on="on"
          >
            <template #default>
              <img
                v-if="!data.companyLegalAddress"
                :src="$imgSrc('icons/void-success.svg')"
                alt=""
              />
              <img v-else :src="$imgSrc('icons/success.svg')" alt="" />
            </template>
          </m-input> -->
          <v-tooltip v-if="!mobile" top>
            <template #activator="{ on }">
              <m-input
                placeholder="Адрес"
                :disabled="true"
                :input-value="data.companyLegalAddress"
                input-style="padding-right:30px; text-overflow:ellipsis"
                v-on="on"
              >
                <template #default>
                  <img
                    v-if="!data.companyLegalAddress"
                    :src="$imgSrc('icons/void-success.svg')"
                    alt=""
                  />
                  <img v-else :src="$imgSrc('icons/success.svg')" alt="" />
                </template>
              </m-input>
            </template>
            <span>{{ data.companyLegalAddress || '' }}</span>
          </v-tooltip>
          <m-input
            v-else
            placeholder="Адрес"
            :disabled="true"
            :input-value="data.companyLegalAddress"
            input-style="padding-right:30px; text-overflow:ellipsis"
          >
            <template #default>
              <img
                v-if="!data.companyLegalAddress"
                :src="$imgSrc('icons/void-success.svg')"
                alt=""
              />
              <img v-else :src="$imgSrc('icons/success.svg')" alt="" />
            </template>
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>фактический адрес</h3>
          <m-input
            placeholder="Адрес"
            :input-value="data.companyPhysicalAddress"
            @input="saveChanges($event, 'companyPhysicalAddress')"
          >
          </m-input>
        </div>
        <div class="phones">
          <template v-if="data.companyPhones">
            <div
              v-for="(t, i) of data.companyPhones"
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
                          @click="saveChanges($event, 'companyPhone', i)"
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

        <div class="role-input d-flex flex-column" style="grid-column-start: 1">
          <h3>сайт</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.companySiteUrl"
            @input="saveChanges($event, 'companySiteUrl')"
          >
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>skype</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.companySkype"
            @input="saveChanges($event, 'companySkype')"
          >
            <!-- <template #default>
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <img
                        :src="$imgSrc('icons/edit.svg')"
                        class="pointer edit"
                        alt=""
                        @click="activateField($event)"
                        v-on="on"
                      />
                    </template>
                    <span>Редактировть поле</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <img
                        :src="$imgSrc('icons/ok.svg')"
                        class="pointer ok d-none"
                        alt=""
                        @click="saveChanges($event, 'companySkype')"
                        v-on="on"
                      />
                    </template>
                    <span>Сохранить изменения</span>
                  </v-tooltip>
                </template> -->
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>facebook</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.companyFacebook"
            @input="saveChanges($event, 'companyFacebook')"
          >
          </m-input>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>instagram</h3>
          <m-input
            placeholder="Ссылка"
            :input-value="data.companyInstagram"
            @input="saveChanges($event, 'companyInstagram')"
          >
          </m-input>
        </div>
        <div class="role-input d-flex flex-column" style="grid-column: 1 / -1">
          <h3>
            описание компании
          </h3>
          <textarea
            v-model="textarea"
            placeholder="Информация о компании"
            @input="saveChanges($event, 'companyDescription')"
          />
          <m-counter :total="1000" :current="textarea.length"></m-counter>
        </div>
        <div
          class="role-input d-flex flex-column mb-2"
          style="grid-column: 1 / -1"
        >
          <div class="d-flex align-center">
            <h3 style="margin-bottom:0">добавить документы</h3>
            <v-tooltip top>
              <template #activator="{ on }">
                <img
                  :src="$imgSrc('icons/info.svg')"
                  alt=""
                  class="pointer ml-4"
                  style="height: 15px"
                  v-on="on"
                />
              </template>
              <span>
                - Відомості з единого державного реестру підприемств та
                оргнізацій украиїни (статистика)<br />- Виписка с єдиного
                державного реестра юридичних осіб та физичних осіб -
                підприемців<br />- Витяг платника ПДВ<br />- Реквізити компанії
              </span>
            </v-tooltip>
          </div>
          <span class="description"
            >Форматы: DOC, DOCX, PDF, XLS, XLSX, JPG, PNG</span
          >
          <div class="docs d-flex">
            <template v-if="data.companyDocuments">
              <m-document
                v-for="(d, i) of data.companyDocuments"
                :key="d.name.default"
                :format="docFormat(d.name.default)"
                @click="removeDoc(i)"
              >
                {{ docName(d.name.default) }}
              </m-document>
            </template>
            <m-document @click.native="$refs.files.click()"> </m-document>
            <input
              id="files"
              ref="files"
              type="file"
              hidden
              multiple
              accept=".doc,.docx,.pdf,.xls,.xlsx,.jpg,.png"
              @change="uploadDocument($event)"
            />
          </div>
        </div>
      </div>
      <Profile
        v-else
        :company="company"
        :cars="cars"
        :employees="users"
      ></Profile>
    </form>
    <div v-if="isManager" class="profile images">
      <div class="edit-data">
        <m-image-upload
          type="logo"
          :image="companyLogo"
          @change="uploadImage($event, 'companyLogo')"
          >лого компании</m-image-upload
        >
        <m-image-upload
          type="background"
          :image="companyPhoto"
          @change="uploadImage($event, 'companyPhoto')"
          >обложка компании</m-image-upload
        >
      </div>
    </div>
    <div v-if="isManager" class="profile remove-company d-flex flex-column">
      <div class="del-header pointer d-flex align-center" @click="toggleRemove">
        <h3>удалить компанию</h3>
        <img :src="$imgSrc('icons/select.svg')" alt="" />
      </div>
      <div class="del-content d-flex justify-center align-center">
        <m-button m-style="error" shade="error" @click.native="removeCompany"
          >Удалить</m-button
        >
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { codes } from '~/modules/iso.js';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import phoneCodes from '~/mixins/phoneCodes.js';
import dialog from '~/mixins/dialog.js';
import Profile from '~/components/Profile.vue';

export default {
  components: {
    Profile
  },
  mixins: [hideMobileMenu, phoneCodes, dialog],
  async asyncData({ app, store, redirect, route }) {
    if (app.$localstorage.get('userRole')) {
      const r = app.$localstorage.get('userRole').toLowerCase();
      if (r.includes('manager')) {
        try {
          const r = await app.$getCompanyInfo();
          store.commit('setState', { logged: true });
          r.companyLogo = store.state.data.companyLogo;
          r.companyPhoto = store.state.data.companyPhoto;
          r.memberPhoto = store.state.data.memberPhoto;
          r.memberName = store.state.data.memberName;
          r.companyRate = store.state.data.companyRate;
          store.commit('setData', r);
          if (store.state.data.companyPhones.length === 0) {
            store.commit('addCompanyPhone', '');
          }
          store.commit('profile/setState', {
            verified: store.state.data.companyName === ''
          });
          return {};
        } catch (e) {
          app.$errorHandle(e);
        }
      } else {
        try {
          const m = await app.$getChunkCompanyInfo();
          const r = await app.$user.getUser(app.$localstorage.get('email'));
          let t = await app.$fetchImage(r.company.logo.value);
          store.commit('setField', {
            field: 'companyLogo',
            value: {
              position: r.company.logo.position,
              value: t
            }
          });
          t = await app.$fetchImage(r.company.photo.value);
          store.commit('setField', {
            field: 'companyPhoto',
            value: {
              position: r.company.photo.position,
              value: t
            }
          });

          t = await app.$fetchImage(r.member.photo.value);
          store.commit('setField', {
            field: 'memberPhoto',
            value: {
              position: r.member.photo.position,
              value: t
            }
          });
          store.commit('setField', {
            field: 'memberName',
            value: r.member.name.default
          });
          store.commit('setState', {
            logged: true,
            member_id: r.member.id.value,
            company_id: r.company.id.value
          });
          m.companyLogo = store.state.data.companyLogo;
          m.companyPhoto = store.state.data.companyPhoto;
          m.companyRate = store.state.data.companyRate;
          m.memberPhoto = store.state.data.memberPhoto;
          m.memberName = store.state.data.memberName;
          let cars;
          let users = [];
          let company = {};
          if (!m.companyRole.toLowerCase().includes('sender')) {
            try {
              const c = await app.$car.getCarParkTotals();
              [...cars] = c;
            } catch (e) {
              app.$errorHandle(e);
            }
          }
          try {
            const u = await app.$user.getUsers();
            [...users] = u;
          } catch (e) {
            app.$errorHandle(e);
          }
          try {
            company = await app.$prettyCompany(m);
          } catch (e) {
            app.$errorHandle(e);
          }
          return {
            company,
            cars,
            users
          };
        } catch (e) {
          app.$errorHandle(e);
        }
      }
    } else {
      store.commit('setState', { logged: false, id: undefined });
      redirect({
        name: 'main',
        query: { status: 'unauthorized', from: route.path, reload: true }
      });
    }
  },
  data() {
    return {
      timer: undefined,
      info: false
    };
  },
  computed: {
    ...mapState(['data', 'mobile']),
    isManager() {
      return this.$localstorage
        .get('userRole')
        .toLowerCase()
        .includes('manager');
    },
    role() {
      const u = !!this.$store.getters.getRole;
      return u ? this.$capitalize(this.$store.getters.getRole.title) : '';
    },
    textarea: {
      get() {
        return this.$store.state.data.companyDescription || '';
      },
      set(v) {
        this.$store.commit('setField', {
          field: 'companyDescription',
          value: v
        });
      }
    },
    verified: {
      get() {
        return this.$store.state.profile.verified;
      },
      set(v) {
        this.$store.commit('profile/setState', { verified: v });
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
    companyPhoto: {
      get() {
        return this.$store.state.data.companyPhoto
          ? this.$store.state.data.companyPhoto.value
          : `/images/${this.roler}-background.png`;
      },
      set(v) {
        this.$store.commit('setImage', { companyPhoto: v });
      }
    },
    companyLogo: {
      get() {
        return this.$store.state.data.companyLogo
          ? this.$store.state.data.companyLogo.value
          : `/images/company-logo.png`;
      },
      set(v) {
        this.$store.commit('setImage', { companyLogo: v });
      }
    },
    changes: {
      get() {
        return this.$store.state.changes;
      },
      set(v) {
        this.$store.commit('setState', { changes: v });
      }
    },
    roler() {
      switch (this.$localstorage.get('companyRole')) {
        case 'ROLE_COMPANY_SENDER':
          return 'sender';
        case 'ROLE_COMPANY_CARRIER':
          return 'carrier';
        case 'ROLE_COMPANY_EXPEDITOR':
          return 'expeditor';
      }
      return false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isManager) {
        if (this.$store.state.data.companyName !== '') {
          document
            .querySelector('[name="companyCode"]')
            .setAttribute('disabled', 'disabled');
        }
        if (document.querySelectorAll('.remove-number').length === 1) {
          if (this.$store.getters.getCompanyPhone(0) === '') {
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
      }
      this.$nuxt.$loading.finish();
    });
  },
  beforeDestroy() {
    try {
      this.unwatch();
    } catch {}
  },
  methods: {
    regDate(date) {
      if (date) {
        const d = date.split('-');
        return `${parseInt(d[2], 10)} ${
          this.$store.state.monthForDate[parseInt(d[1], 10)]
        } ${d[0]}`;
      }
      return '';
    },
    isMesengerActive(messenger, i) {
      const p = this.$store.state.data.companyPhones;
      return p ? p[i].messengerSupports[messenger] : false;
    },
    docFormat(name) {
      return name.substr(name.lastIndexOf('.') + 1);
    },
    docName(name) {
      return name.substring(0, name.lastIndexOf('.'));
    },

    *turn(quantity) {
      for (let i = 0; i < quantity - 1; i++) {
        yield;
      }
    },
    uploadDocument(e) {
      const t = e.target;
      const fs = t.files;
      const l = fs.length;
      const end = this.turn(l);
      let done;
      const errors = [];
      this.$nuxt.$loading.start();
      for (const f of fs) {
        const r = new FileReader();
        r.onload = (e) => {
          const res = e.target.result;
          this.$company
            .companyDocument({
              name: { default: f.name },
              value: { default: res }
            })
            .then((r) => {
              this.$store.commit('addCompanyDocument', {
                id: r.id,
                name: f.name,
                value: res
              });
            })
            .catch((e) => {
              errors.push(
                `-Ошибка при загрузке "${f.name}". Файл не загрузился. Причина: ${e.status} | ${e.data.message}`
              );
            })
            .finally(() => {
              done = end.next().done;
              if (done) {
                if (errors.length > 0) {
                  this.$error(null, errors.join('<br>'));
                }
                this.$nuxt.$loading.finish();
                this.changes = true;
              }
            });
        };
        r.readAsDataURL(f);
      }
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
    removeDoc(index) {
      this.$erase
        .companyDocument(this.data.companyDocuments[index])
        .then((r) => {
          this.$store.commit('removeCompanyDocument', index);
          this.changes = true;
        })
        .catch((e) => {
          this.$error(e);
        });
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
      t.closest('.m-input').setAttribute('data-active', '');
      if (t.value !== '') {
        this.$store.commit('setCompanyPhone', { id, value: t.value });
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
        if (this.data.companyPhones.length > 1) {
          this.$erase.companyPhone(this.data.companyPhones[id]);
          this.$store.commit('removeCompanyPhone', id);
          for (const m of document.querySelectorAll('[name="memberPhone"]')) {
            try {
              this.$justify(m.closest('.m-input'));
            } catch {}
          }
        } else {
          t.value = '';
          this.$erase.companyPhone(this.data.companyPhones[id]);
          this.$store.commit('cleanCompanyPhone', id);
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
      this.$store.commit('setCompanyPhone', { id, value: v });
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
        this.$store.commit('setCompanyMessenger', {
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
          this.$store.commit('addCompanyPhone', '');
          this.$nextTick(() => {
            el.previousElementSibling.querySelector(
              '.remove-number'
            ).style.display = 'none';
          });
        }
      } else {
        this.toggleEdit(e);
      }
    },
    removeNumber(e, index) {
      const el = e.target.closest('.role-input');
      const i = el.querySelector('[type="text"]');
      if (this.data.companyPhones.length > 1) {
        this.$erase.companyPhone(this.data.companyPhones[index]);
        this.$store.commit('removeCompanyPhone', index);
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

    clearCompanyInfo() {
      this.$store.commit('setField', {
        field: 'companyName',
        value: ''
      });
      this.$store.commit('setField', {
        field: 'companyForm',
        value: ''
      });
      this.$store.commit('setField', {
        field: 'companyLegalAddress',
        value: ''
      });
      const p = this.data.companyPhones.find((a) => !a.hasOwnProperty('id'));
      if (p) {
        this.$store.commit('setField', {
          field: 'companyPhones',
          value:
            this.data.companyPhones.find((a) => a.hasOwnProperty('id')) || []
        });
      }
      if (this.data.companyPhones.length === 0) {
        this.$store.commit('addCompanyPhone', '');
      }
    },

    showDataBot(e) {
      const t = e.target;
      const l = t.closest('.m-input').querySelector('.loading_img');
      const v = t.value;
      if (v.length !== 8 && v.length !== 10) {
        this.$waiting(l, false);
        this.$cancel();
        this.clearCompanyInfo();
        this.$store.commit('setField', {
          field: 'companyCode',
          value: v
        });
      } else {
        this.$waiting(l, true);
        this.$cancel();
        const _method = v.length === 8 ? this.$getBotInfo : this.$getFopInfo;
        _method(v)
          .then((r) => {
            this.$waiting(l, false);
            if (!Object.keys(r).includes('companyShortName')) {
              this.$store.commit('setField', {
                field: 'companyForm',
                value: 'ФОП'
              });
            }
            for (const field of Object.keys(r)) {
              if (field !== 'companyPhones') {
                if (field === 'companyShortName') {
                  this.$store.commit('setField', {
                    field: 'companyForm',
                    value: r.companyShortName
                  });
                } else {
                  this.$store.commit('setField', { field, value: r[field] });
                }
              } else {
                for (const p of r[field]) {
                  this.$store.commit('addCompanyPhone', p);
                }
              }
            }
            this.$store.commit('setField', {
              field: 'companyCode',
              value: v
            });
          })
          .catch((e) => {
            this.clearCompanyInfo();
            this.$waiting(l, false);
          });
      }
    },
    toggleEdit(e) {
      const m = e.target.closest('.m-input') || e.target.closest('.role-input');
      try {
        this.$justify(m);
      } catch {}
    },
    saveCompanyInfo(e) {
      if (this.$store.state.data.companyName) {
        let p = [];
        p = p.concat(
          this.$store.state.data.companyPhones.filter(
            (a) => !a.hasOwnProperty('id') && a.value.default !== ''
          )
        );
        const o = {
          code: this.$store.state.data.companyCode,
          form: this.$store.state.data.companyForm,
          name: this.$store.state.data.companyName,
          legalAddress: this.$store.state.data.companyLegalAddress
        };
        if (p) {
          [...o.phone] = [];
          for (const y of p) {
            const x = {};
            x.value = y.value.default;
            ({ ...x.messengerSupports } = y.messengerSupports);
            o.phone.push(x);
          }
        }
        this.$setCompanyInfo(o)
          .then((r) => {
            this.changes = true;
            if (this.$store.state.data.companyName) {
              this.verified = false;
              e.target
                .closest('.m-input')
                .querySelector('[type="text"]')
                .setAttribute('disabled', 'disabled');
            }
          })
          .catch((e) => {
            this.$error(e);
          })
          .finally(() => {
            e.target.classList.add('d-none');
          });
      } else {
        e.target.classList.add('d-none');
        this.saveChanges(e, 'companyCode');
      }
    },
    saveChanges(e, field, index = undefined) {
      const t = e.target;
      let s;
      if (field === 'companyPhone') {
        const inp = t.closest('.m-input').querySelector('[type="text"]');
        this.removePlus({ target: inp }, index);
        if (this.correct) {
          if (this.data.companyPhones[index]) {
            if (!this.data.companyPhones[index].id) {
              this.$company
                .companyPhone(this.data.companyPhones[index])
                .then((r) => {
                  this.$store.commit('setPhoneId', r.id);
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
                .companyPhone(this.data.companyPhones[index])
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
        if (field === 'companyDescription') {
          s = t.closest('.role-input').querySelector('textarea');
        } else {
          s = m.querySelector('[type="text"]');
        }
        let enough = true;
        const v = s.value;
        if (field === 'companyDescription') {
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
            this.$company[field](v)
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
    },
    toggleRemove(e) {
      const t = e.target.closest('.remove-company');
      if (t.classList.contains('shown')) {
        t.classList.remove('shown');
      } else {
        t.classList.add('shown');
      }
    },
    removeCompany(e) {
      this.callback = async () => {
        try {
          this.$screen(true);

          await this.$company.deleteRequest();
          this.$hideDialog();
          this.$nextTick(() => {
            this.$store.commit('setOverlayMode', 'success-delete');
            this.$store.commit('setOverlayVisible', true);
          });
        } catch (e) {
          this.$errorHandle(e);
          this.$hideDialog();
        }
        this.$screen(false);
      };
      this.$dialog({
        image: this.$imgSrc('icons/garbage.svg'),
        text: 'Вы дествительно хотите удалить компанию?'
      });
    }
  },
  head() {
    return {
      title: '| Профиль'
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
