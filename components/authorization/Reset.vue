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
    <h1>новый пароль</h1>
    <m-input
      id="password"
      name="password"
      :required="true"
      placeholder="Новый пароль"
      type="password"
      data-validate="password"
    >
    </m-input>
    <m-input
      id="confirmPassword"
      placeholder="Повторите новый пароль"
      type="password"
    ></m-input>
    <m-button
      ref="register"
      class="mt-5"
      shade="blue"
      :disabled="disabled"
      @click.native="submit($event)"
      >сохранить</m-button
    >
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
      disabled: false,
      token: ''
    };
  },
  created() {
    this.token = this.$route.query.passwordResetToken;
    this.$router.push({ query: {} });
  },
  methods: {
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
          const data = {};
          for (const k of fd.keys()) {
            data[k] = fd.get(k);
          }
          data.token = this.token;
          const b = this.$refs.register.$el;
          this.$toggle(b);
          this.disabled = true;
          this.$updatePassword(data)
            .then((r) => {
              this.$store.commit('setOverlayMode', 'success-reset');
            })
            .catch((e) => {
              this.disabled = false;
              this.$error(e);
            })
            .finally(() => {
              if (this.mobile) {
                this.mobLoading = false;
              }
              this.$toggle(b);
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
