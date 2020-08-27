<template>
  <div
    class="write-us"
    :class="{
      black
    }"
  >
    <div class="write-us-text">
      <div v-if="!h1" class="h1">свяжитесь с нами</div>
      <h1 v-else>свяжитесь с нами</h1>
      <div class="write-us-text-desc">
        Заполните форму обратной связи и наш менеджер свяжется с Вами в
        ближайшее время
      </div>
      <div class="write-us-text-address">
        <a href="https://goo.gl/maps/zmnyQNA9sQxybwdh8" target="_blank"
          >Киев, Украина, Проспект Соборности, 7а<img
            v-if="black"
            :src="$imgSrc('icons/location-on-map.svg')"
            alt=""/><img
            v-else
            :src="$imgSrc('icons/location-on-map-dark.svg')"
            alt=""
        /></a>
      </div>
      <div class="write-us-text-address d-flex">
        <a :href="`tel:${$store.getters.a_phone_number}`">{{
          $store.getters.phone_number
        }}</a>
      </div>
      <div class="write-us-text-address">
        <a :href="`mailto:${$store.getters.email}`">{{
          $store.getters.email
        }}</a>
      </div>
    </div>
    <div :key="clear" class="write-us-form d-flex flex-column">
      <m-input
        v-if="black"
        placeholder="Ваше имя*"
        placeholder-color="white"
        :required="true"
        name="name"
        input-style="background-color:transparent;color:white"
      ></m-input>
      <m-input
        v-else
        placeholder="Ваше имя*"
        name="name"
        :required="true"
        input-style="background-color:#cbcbcb"
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
          v-if="black"
          :required="true"
          data-validate="phone"
          name="phone"
          placeholder="Ваш телефон*"
          placeholder-color="white"
          class="w-100"
          input-style="background-color:transparent;color:white"
          @focus="pastePlus($event)"
        >
        </m-input>
        <m-input
          v-else
          :required="true"
          data-validate="phone"
          name="phone"
          placeholder="Ваш телефон*"
          input-style="background-color:#cbcbcb"
          class="w-100"
          @focus="pastePlus($event)"
        >
        </m-input>
      </div>
      <m-input
        v-if="black"
        placeholder="Ваш e-mail"
        placeholder-color="white"
        :required="true"
        name="email"
        input-style="background-color:transparent;color:white"
      ></m-input>
      <m-input
        v-else
        placeholder="Ваш e-mail"
        name="email"
        :required="true"
        input-style="background-color:#cbcbcb"
      ></m-input>
      <textarea
        v-model="textarea"
        placeholder="Ваше сообщение"
        @input="watchOut"
      ></textarea>
      <div class="message"></div>
      <m-counter :total="1000" :current="textarea.length"></m-counter>
      <div class="buttons">
        <m-button
          class="w-100"
          :disabled="disabled"
          shade="blue"
          @click.native="send"
          >отправить</m-button
        >
      </div>
    </div>
    <v-snackbar
      id="success"
      :value="changes"
      color="#2DAD51"
      :bottom="true"
      :top="true"
      :timeout="1500"
      >Отправлено!
    </v-snackbar>
  </div>
</template>

<script>
import phoneCodes from '~/mixins/phoneCodes.js';
export default {
  mixins: [phoneCodes],
  props: {
    black: {
      type: Boolean,
      default: true
    },
    h1: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textarea: '',
      disabled: false,
      clear: true
    };
  },
  computed: {
    changes: {
      get() {
        return this.$store.state.changes;
      },
      set(v) {
        this.$store.commit('setState', { changes: v });
      }
    }
  },
  watch: {
    clear(newV) {
      this.textarea = '';
    }
  },
  created() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.changes,
      (newV, oldV) => {
        if (newV) {
          setTimeout(() => {
            this.$store.commit('setState', { changes: false });
            this.$store.commit('setMessage', '');
          }, 1500);
        }
      }
    );
  },
  beforeDestroy() {
    try {
      this.unwatch();
    } catch {}
  },
  methods: {
    async send(e) {
      const b = e.target.closest('.m-button');
      const f = b.closest('.write-us-form');
      let correct = true;
      for (const d of f.querySelectorAll('[data-required]')) {
        if (!d.hasAttribute('data-validate')) {
          if (this.$isEmpty(d.value.trim())) {
            this.$incorrect({
              target: d
            });
            correct = false;
          }
        } else {
          const attr = d.getAttribute('data-validate');
          const val = this.$validate({
            [attr]: d.value.trim()
          });
          if (!this.$isEmpty(val)) {
            this.$incorrect({
              target: d,
              error: val[attr]
            });
            correct = false;
          }
        }
      }
      for (const r of f.querySelectorAll('[data-validate]')) {
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
      if (this.$isEmpty(this.textarea)) {
        this.$incorrect({
          target: f.querySelector('textarea')
        });
        correct = false;
      } else if (this.textarea.length > 1000) {
        this.$incorrect({
          target: f.querySelector('textarea'),
          error: 'Введите не более 1000 символов'
        });
        correct = false;
      }
      if (correct) {
        this.$screen(true);
        this.disabled = true;
        this.$toggle(b);
        try {
          await this.$mail.send({
            name: document.querySelector('[name="name"]').value,
            phone: document.querySelector('[name="phone"]').value,
            emailTo: this.$store.getters.email,
            emailFrom: document.querySelector('[name="email"]').value,
            messageText: this.textarea
          });
          this.message = 'Ваше обращение получено!';
          this.changes = true;
          this.clear = !this.clear;
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
        this.disabled = false;
        this.$toggle(b);
      }
    },
    watchOut(e) {
      if (this.textarea.length > 1000) {
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
@import '~/static/scss/default.scss';
.write-us {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 100%;
  column-gap: 45px;
  row-gap: 20px;
  background-color: white;
  padding: 50px 20px;
  @include tablet() {
    grid-template-columns: repeat(2, 1fr);
    padding: 65px 130px;
  }
  @include extra() {
    @include px(200);
  }
  &-text {
    align-self: center;
    .h1,
    h1 {
      padding: 0;
      color: black;
      font-weight: 800;
      font-size: rem(26);
      margin-bottom: 10px;
      @include tablet() {
        font-size: rem(30);
      }
    }
    &-desc {
      color: $dark-shade;
      border-bottom: 1px solid $dark-shade;
      padding-bottom: 30px;
      margin-bottom: 30px;
      font-size: rem(14);
      @include tablet() {
        font-size: rem(18);
      }
    }
    &-address {
      display: flex;
      align-items: center;
      color: $dark-shade;
      font-size: rem(16);
      margin-bottom: 10px;
      @include tablet() {
        font-size: rem(20);
      }
      a {
        font-size: rem(16);
        color: $dark-shade;
        @include tablet() {
          font-size: rem(20);
        }
        img {
          height: 16px;
          margin-left: 8px;
          @include tablet() {
            height: 20px;
          }
        }
      }
    }
  }
  &-form {
    background-color: white;
    box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
    padding: 30px 20px;
    @include tablet() {
      padding: 60px 45px;
    }
    textarea {
      background-color: $input;
    }
    .p-container {
      grid-column: 1 / -1;
      position: relative;
      .choose {
        position: absolute;
        z-index: 12;
      }
    }
    .m-input,
    .m-counter {
      margin-bottom: 10px;
    }
    .buttons {
      .m-button {
        position: relative;
        bottom: auto !important;
      }
    }
  }
}
.write-us.black {
  background-position: center;
  background-image: url(/images/write-us-mob.png);
  background-size: cover;
  @include tablet() {
    background-image: url(/images/write-us.png);
  }
  .write-us-text {
    .h1 {
      color: white;
    }
    &-desc {
      color: white;
      border-bottom: 1px solid white !important;
    }
    &-address {
      color: white;
      a {
        color: white;
      }
    }
  }
  .write-us-form {
    background-color: rgba(22, 26, 29, 0.6);
    textarea {
      color: white;
      background-color: transparent;
      &::placeholder {
        color: white;
      }
    }
  }
}
</style>
