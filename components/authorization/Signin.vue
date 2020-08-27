<template>
  <form>
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <img
      v-if="!extremeButton"
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="$store.commit('setOverlayVisible', false)"
    />
    <h1>
      <!-- <v-btn class="mr-5" @click.native="mock">Авторизоваться</v-btn> -->
      вход
    </h1>
    <div class="error-message">Логин и/или пароль введены неверно</div>
    <m-input
      name="signin_email"
      :required="true"
      data-validate="email"
      placeholder="E-mail"
      :input-value="email"
    ></m-input>
    <m-input
      name="signin_password"
      type="password"
      :required="true"
      placeholder="Пароль"
      :input-value="password"
    ></m-input>
    <label class="m-checkbox d-flex pointer align-center">
      <input
        id="keep-sign-in"
        type="checkbox"
        hidden
        @change="setLocalStorage($event)"
      />
      <div class="square"></div>
      <div class="m-checkbox-content">
        Сохранить данные для входа в системе
      </div>
    </label>
    <m-button
      ref="signin"
      :disabled="disabled"
      shade="blue"
      @click.native="submit($event)"
      >войти</m-button
    >
    <div class="variants d-flex justify-center">
      <div
        id="forgot"
        class="pointer"
        @click="$store.commit('setOverlayMode', 'forgot')"
      >
        забыли пароль?
      </div>
      <div class="vertical"></div>
      <div
        id="register"
        class="pointer"
        @click="$store.commit('setOverlayMode', 'register')"
      >
        регистрация
      </div>
    </div>
  </form>
</template>

<script>
import Loading from '~/components/Loading.vue';

export default {
  components: {
    Loading
  },
  props: {
    extreme: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mobLoading: false,
      email: '',
      password: '',
      extremeButton: this.extreme,
      disabled: false,
      personal: false,
      from: undefined
    };
  },
  created() {
    if (this.$route.query.from) {
      this.from = this.$route.query.from;
    }
    if (this.$route.query.userSignin) {
      this.personal = true;
      this.extremeButton = true;
    } else {
      this.personal = false;
    }
    this.$router.push({ query: {} });
  },
  methods: {
    mock() {
      this.email = 'ofslandm@supere.ml';
      this.password = '123456';
    },
    setLocalStorage(e) {
      const t = e.target;
      this.$localstorage.set('keep-sign-in', t.checked, true);
    },
    submit(e) {
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
              obj[y.getAttribute('data-validate')] = this.$store.state.empty;
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
        for (const i in ch) {
          obj[i] = ch[i];
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
      if (correct) {
        if (this.mobile) {
          this.mobLoading = true;
        }
        const b = this.$refs.signin.$el;
        const n = document.querySelector('[name="signin_email"]');
        const p = document.querySelector('[name="signin_password"]');
        const er = document.querySelector('.error-message');
        this.disabled = true;
        this.$toggle(b);
        this.$nextTick(() => {
          this.$init(n.value, p.value)
            .then((r) => {
              this.$user
                .getUser(n.value)
                .then((r) => {
                  this.$fetchImage(r.member.photo.value).then((res) => {
                    this.$store.commit('setField', {
                      field: 'memberPhoto',
                      value: {
                        value: res,
                        position: r.member.photo.position
                      }
                    });
                    this.$store.commit('setField', {
                      field: 'name',
                      value: r.member.name
                    });
                    this.$store.commit('setState', { logged: true });
                    this.$localstorage.set(
                      'companyRole',
                      r.company.role.default,
                      true
                    );
                    this.$localstorage.set(
                      'plan',
                      r.company.role.default,
                      true
                    );
                    this.$localstorage.set('userRole', r.role.name, true);
                    this.$localstorage.set('email', n.value, true);
                    this.$store.commit('setOverlayVisible', false);
                    if (this.from) {
                      this.$router.push(this.from);
                    } else {
                      this.$router.push({
                        name: this.personal
                          ? 'cabinet-personal'
                          : 'cabinet-profile'
                      });
                    }
                  });
                })
                .catch((e) => {
                  this.disabled = false;
                  this.$toggle(b);
                  this.$error(e);
                  if (this.mobile) {
                    this.mobLoading = false;
                  }
                });
            })
            .catch((e) => {
              if (this.mobile) {
                this.mobLoading = false;
              }
              this.disabled = false;
              this.$toggle(b);
              if (e.status === 401) {
                er.style.display = 'block';
              } else {
                this.$error(e);
              }
            });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
