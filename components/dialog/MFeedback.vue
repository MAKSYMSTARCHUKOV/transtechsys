<template>
  <form>
    <img
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="close"
    />
    <h1>написать нам</h1>
    <m-input
      placeholder="Имя*"
      :required="true"
      @input="($event) => (name = $event.target.value)"
    ></m-input>
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
        placeholder="Телефон*"
        class="w-100"
        @focus="pastePlus($event)"
        @input="($event) => (phone = $event.target.value)"
      >
        <template #default>
          <div class="f32 d-flex justify-end">
            <div></div>
          </div>
        </template>
      </m-input>
    </div>
    <m-input
      placeholder="E-mail"
      data-validate="email"
      @input="($event) => (email = $event.target.value)"
    ></m-input>
    <div class="p-container">
      <textarea
        placeholder="Ваше сообщение..."
        data-required
        @input="watchOut"
      ></textarea>
      <div class="message"></div>
      <m-counter :total="1000" :current="content.length"></m-counter>
    </div>
    <div class="buttons p-container d-flex align-center">
      <m-button :disabled="disabled" @click.native="send">Отправить</m-button>
    </div>
  </form>
</template>

<script>
import phoneCodes from '~/mixins/phoneCodes.js';

export default {
  mixins: [phoneCodes],
  data() {
    return {
      dis: false,
      name: '',
      email: '',
      phone: '',
      content: ''
    };
  },
  computed: {
    disabled: {
      get() {
        if (
          !this.$isEmpty(this.name) &&
          !this.$isEmpty(this.phone) &&
          !this.$isEmpty(this.content)
        ) {
          return this.dis;
        }
        return true;
      },
      set(v) {
        this.dis = v;
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
      setTimeout(() => {
        this.$zIndexing();
      }, 200);
    });
  },
  methods: {
    close() {
      this.$store.commit('setOverlayVisible', false);
    },
    async send(e) {
      if (!this.disabled) {
        const b = e.target.closest('.m-button');
        let correct = true;
        this.disabled = true;
        this.$toggle(b);
        const req = this.$el.querySelectorAll('[data-required]');
        const val = this.$el.querySelectorAll('[data-validate]');
        for (const r of req) {
          if (!r.hasAttribute('data-validate')) {
            if (this.$isEmpty(r.value)) {
              this.$incorrect({
                target: r
              });
              correct = false;
            }
          } else {
            const n = r.getAttribute('data-validate');
            const y = this.$validate({ [n]: r.value });
            if (!this.$isEmpty(y)) {
              this.$incorrect({
                target: r,
                error: y[n]
              });
              correct = false;
            }
          }
        }
        for (const r of val) {
          if (!r.hasAttribute('data-required')) {
            if (!this.$isEmpty(r.value)) {
              const n = r.getAttribute('data-validate');
              const y = this.$validate({ [n]: r.value });
              if (!this.$isEmpty(y)) {
                this.$incorrect({
                  target: r,
                  error: y[n]
                });
                correct = false;
              }
            }
          }
        }
        if (correct) {
          try {
            await this.$mail.send({
              name: this.name,
              phone: this.phone,
              emailTo: this.$store.getters.email,
              emailFrom: this.email,
              messageText: this.content
            });
            this.message = 'Ваше обращение получено!';
            this.close();
          } catch (e) {
            this.$errorHandle(e);
          }
          this.$toggle(b);
          this.disabled = false;
        }
      }
    },
    watchOut(e) {
      this.content = e.target.value;
      if (this.content.length > 1000) {
        this.$incorrect({
          target: e.target,
          error: 'Введите не более 1000 символов'
        });
      } else {
        this.$reject(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/authorization.scss';
textarea {
  width: 100%;
  @include tablet() {
    width: 400px;
  }
}
.buttons {
  margin-top: 20px;
  justify-content: center;
  .m-button {
    position: relative !important;
    bottom: 0 !important;
  }
}
</style>
