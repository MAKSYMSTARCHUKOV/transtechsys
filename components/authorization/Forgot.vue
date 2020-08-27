<template>
  <form>
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <img
      id="back"
      :src="$imgSrc('icons/back.svg')"
      alt="<"
      class="pointer"
      @click="$store.commit('setOverlayMode', 'signin')"
    />
    <h1>напомнить пароль</h1>
    <div class="overview">Введите Ваш E-mail для получения пароля</div>
    <m-input
      name="email"
      :required="true"
      data-validate="email"
      placeholder="E-mail"
    ></m-input>
    <m-button
      ref="send_forgot"
      shade="blue"
      class="mt-5"
      :disabled="disabled"
      @click.native="submit($event)"
      >отправить</m-button
    >
  </form>
</template>

<script>
import Loading from '~/components/Loading.vue';

export default {
  components: {
    Loading
  },
  data() {
    return {
      mobLoading: false,
      disabled: false
    };
  },
  methods: {
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
              obj[y.getAttribute('name')] = this.$store.state.empty;
            }
          }
        } else if (y.hasAttribute('data-validate')) {
          if (textField.includes(y.getAttribute('type'))) {
            ch[y.getAttribute('name')] = y.value.trim();
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
        const b = this.$refs.send_forgot.$el;
        this.disabled = true;
        this.$toggle(b);
        this.$resetPassword(document.querySelector('[name="email"]').value)
          .then((r) => {
            this.$store.commit('setOverlayMode', 'success-forgot');
          })
          .catch((e) => {
            this.$error(e);
          })
          .finally(() => {
            this.$toggle(b);
            this.disabled = false;
            if (this.mobile) {
              this.mobLoading = false;
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
</style>
