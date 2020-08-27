<template>
  <form>
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <img
      v-if="!extreme"
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="$store.commit('setOverlayVisible', false)"
    />
    <h1>регистрация</h1>
    <m-input
      name="companyCode"
      :required="true"
      placeholder="ЕДРПОУ/ИНН"
      data-validate="code"
      @input="showDataBot($event)"
    ></m-input>
    <div class="databot">
      <div class="databot-info d-flex flex-column">
        <div class="databot-info-header d-flex align-center">
          <img
            id="success"
            :src="$imgSrc('icons/success.svg')"
            alt="ok"
          />OpenDataBot
          <div
            v-if="Object.keys(dbInfo).length === 0"
            class="databot-info-header-message"
          >
            Данные не найдены
          </div>
        </div>
        <div
          v-if="Object.keys(dbInfo).length > 0"
          class="databot-info-content flex-column d-flex"
        >
          <h3 class="com-title overview">
            {{ dbInfo.companyName }}
          </h3>
          <div class="com-field">
            <div class="com-field-title">Адрес:</div>
            {{ dbInfo.companyLegalAddress }}
          </div>
          <div class="com-field">
            <div class="com-field-title">Руководитель:</div>
            {{ dbInfo.companyHeadName }}
          </div>
          <!-- <div class="com-field">
            <div class="com-field-title">Деятельность:</div>
            {{ dbInfo.company_activities }}
          </div> -->
          <div class="com-field">
            <div class="com-field-title">Статус:</div>
            {{ dbInfo.companyStatus }}
          </div>
        </div>
      </div>
    </div>
    <m-select
      name="companyRole"
      :required="true"
      placeholder="Роль участника системы"
      :options="$store.state.roles"
    ></m-select>
    <m-input name="memberName" :required="true" placeholder="ФИО"></m-input>
    <div class="p-container d-flex">
      <m-select
        :temp="true"
        placeholder="Выберите страну"
        class="temp choose d-opaq opaq"
        value-mode="object"
        options-mode="icon"
        :options="isoCodes"
        :max-height="300"
        @change="inputIso"
      ></m-select>
      <m-input
        name="memberPhone"
        :required="true"
        data-validate="phone"
        placeholder="Телефон"
        class="w-100"
        @focus="pastePlus($event)"
        @input="findCode($event)"
      >
        <template #default>
          <div class="f32 d-flex justify-end">
            <div></div>
          </div>
        </template>
      </m-input>
    </div>
    <m-input
      name="userEmail"
      :required="true"
      data-validate="email"
      placeholder="E-mail"
    >
    </m-input>
    <m-input
      id="password"
      name="userPassword"
      :required="true"
      placeholder="Пароль"
      type="password"
      data-validate="password"
    >
    </m-input>
    <m-input
      id="confirmPassword"
      placeholder="Повторите пароль"
      type="password"
    ></m-input>
    <label class="m-checkbox d-flex pointer align-center">
      <input
        id="terms"
        type="checkbox"
        hidden
        @change="disabled = !$event.target.checked"
      />
      <div class="square"></div>
      <div class="m-checkbox-content">
        Согласиться с
        <span class="terms" @click="$store.commit('setOverlayMode', 'terms')"
          >условиями пользования</span
        >
      </div>
    </label>
    <m-button
      ref="register"
      shade="blue"
      :disabled="disabled"
      @click.native="submit($event)"
      >зарегестрироваться</m-button
    >
  </form>
</template>

<script>
import Vue from 'vue';
import phoneCodes from '~/mixins/phoneCodes.js';
import elPositioning from '~/mixins/elPositioning.js';
import Loading from '~/components/Loading.vue';

export default {
  components: {
    Loading
  },
  mixins: [phoneCodes, elPositioning],
  props: {
    extreme: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mobLoading: false,
      disabled: true,
      dbInfo: {}
    };
  },

  created() {
    this.$router.push({ query: {} });
  },

  methods: {
    removePlus(e) {
      const t = e.target;
      if (t.value.trim().length === 1) {
        t.value = '';
      }
    },
    showDataBot(e) {
      const t = e.target;
      const l = t.closest('.m-input').querySelector('.loading_img');
      const b = document.querySelector('.databot');
      const v = t.value;
      if (v.length !== 8 && v.length !== 10) {
        this.$waiting(l, false);
        this.$cancel();
        b.style.height = '0';
        setTimeout(() => {
          b.style.display = 'none';
        }, 151);
      } else {
        this.$waiting(l, true);
        this.$cancel();
        const _method = v.length === 8 ? this.$getBotInfo : this.$getFopInfo;
        _method(v)
          .then((r) => {
            this.$waiting(l, false);
            Vue.set(this.dbInfo, 'companyName', r.companyName);
            Vue.set(this.dbInfo, 'companyHeadName', r.companyHeadName);
            Vue.set(this.dbInfo, 'companyLegalAddress', r.companyLegalAddress);
            Vue.set(this.dbInfo, 'companyStatus', r.companyStatus);
            Vue.set(
              this.dbInfo,
              'companyForm',
              r.companyShortName ? r.companyShortName : 'ФОП'
            );
            Vue.set(this.dbInfo, 'companyPhones', []);
            // Vue.set(this.dbInfo, 'company_activities', r[0].activities);
            if (r.cpmpanyPhones) {
              if (r.companyPhones.length > 0) {
                for (const p of r.companyPhones) {
                  this.dbInfo.companyPhones.push({
                    value: p,
                    messengerSupports: {
                      viber: false,
                      whatsapp: false,
                      telegram: false
                    }
                  });
                }
              }
            }
            this.$nextTick(() => {
              b.style.display = 'block';
              b.style.height = b.children[0].offsetHeight + 'px';
            });
          })
          .catch((e) => {
            this.$waiting(l, false);
            Vue.set(this, 'dbInfo', {});
            this.$nextTick(() => {
              b.style.display = 'block';
              b.style.height = b.children[0].offsetHeight + 'px';
            });
          });
      }
    },
    submit(e) {
      if (!this.disabled) {
        let correct = true;
        const obj = {};
        let ch = {};
        const textField = ['text', 'password', 'hidden'];
        const children = ['hidden'];
        const f = e.target.closest('form');
        const c = f.querySelectorAll('[data-required]');
        for (const y of c) {
          if (!y.hasAttribute('data-validate')) {
            if (textField.includes(y.getAttribute('type'))) {
              if (!y.value.trim()) {
                obj[y.getAttribute('name')] = this.empty;
              }
            }
          } else if (y.hasAttribute('data-validate')) {
            if (textField.includes(y.getAttribute('type'))) {
              ch[y.getAttribute('data-validate')] = y.value.trim();
            }
          }
        }
        ({ ...ch } = this.$validate(ch));
        if (Object.keys(ch).length > 0) {
          correct = false;
          for (const i in ch) {
            let com = f.querySelector(`[data-validate="${i}"]`);
            if (children.includes(com.getAttribute('type'))) {
              com = com.nextElementSibling;
            }
            com.nextElementSibling.textContent = ch[i];
            com.classList.add('incorrect');
          }
        }
        if (Object.keys(obj).length > 0) {
          correct = false;
          for (const i in obj) {
            let com = f.querySelector(`[name="${i}"]`);
            if (children.includes(com.getAttribute('type'))) {
              com = com.nextElementSibling;
            }
            com.nextElementSibling.textContent = obj[i];
            com.classList.add('incorrect');
          }
        }
        const p = f.querySelector('#password input');
        const cp = f.querySelector('#confirmPassword input');
        if (cp) {
          if (cp.value !== p.value) {
            cp.nextElementSibling.textContent = 'Пароль не совпадает';
            cp.classList.add('incorrect');
            correct = false;
          }
        }
        if (correct) {
          if (this.mobile) {
            this.mobLoading = true;
          }
          const fd = new FormData(f);
          let data = {};
          if (Object.keys(this.dbInfo).length > 0) {
            ({ ...data } = this.dbInfo);
          } else {
            data.companyName = '';
            data.companyHeadName = '';
            data.companyLegalAddress = '';
            data.companyStatus = '';
            data.companyPhones = [];
            data.companyForm = '';
            // data.company_activities = '';
          }
          for (const k of fd.keys()) {
            if (k === 'memberPhone') {
              data.memberPhones = [
                {
                  value: fd.get(k),
                  messengerSupports: {
                    viber: false,
                    whatsapp: false,
                    telegram: false
                  }
                }
              ];
            } else {
              data[k] = fd.get(k);
            }
          }
          data.companyCode = parseInt(data.companyCode, 10);
          const b = this.$refs.register.$el;
          this.$toggle(b);
          this.disabled = true;
          this.$signUp(data)
            .then((r) => {
              this.$store.commit('setOverlayMode', 'success');
            })
            .catch((e) => {
              this.$toggle(b);
              this.disabled = false;
              this.$error(e);
            })
            .finally(() => {
              if (this.mobile) {
                this.mobLoading = false;
              }
            });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
