<template>
  <form>
    <img
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="close"
    />
    <div class="review d-flex flex-column">
      <h1>отзыв о компании</h1>
      <div class="review-content d-flex flex-column">
        <div class="h3">настроение от сделки</div>
        <div class="p-container mb-4">
          <div class="likes d-flex">
            <label>
              <input
                type="radio"
                name="like"
                value="like"
                hidden
                @change="like($event, 'like')"
              />
              <div
                class="img"
                :style="{
                  backgroundImage: `url(${$imgSrc(
                    'icons/feedback/like-brand' +
                      (liked === 'like' ? '-active' : '') +
                      '.svg'
                  )})`
                }"
              ></div>
            </label>
            <label>
              <input
                type="radio"
                name="like"
                value="not_like"
                hidden
                @change="like($event, 'not_like')"
              />
              <div
                class="img"
                :style="{
                  backgroundImage: `url(${$imgSrc(
                    'icons/feedback/like-brand' +
                      (liked === 'not_like' ? '-active' : '') +
                      '.svg'
                  )})`
                }"
              ></div>
            </label>
          </div>
          <div class="message"></div>
        </div>
        <div class="h3">краткий отзыв</div>
        <div class="p-container">
          <textarea placeholder="Комментарий" @input="watchOut"></textarea>
          <div class="message"></div>
          <m-counter :total="250" :current="content.length"></m-counter>
        </div>
        <div class="m-buttons d-flex justify-center">
          <m-button shade="blue" :disabled="disabled" @click.native="comment"
            >отправить</m-button
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      liked: '',
      content: '',
      disabled: false,
      correct: false,
      claimId: ''
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
  mounted() {},
  methods: {
    close() {
      this.$store.commit('setOverlayVisible', false);
    },
    like(e, l) {
      if (e.target.checked) {
        this.liked = l;
        this.$reject({ target: e.target.closest('.likes') });
      }
    },
    watchOut(e) {
      this.content = e.target.value;
      if (this.content.length > 250) {
        this.$incorrect({
          target: e.target,
          error: 'Введите не более 250 символов'
        });
        this.correct = false;
      } else {
        this.$reject(e);
      }
    },
    async comment(e) {
      if (!this.disabled) {
        this.correct = true;
        const b = e.target;
        if (this.$isEmpty(this.liked)) {
          this.$incorrect({
            target: document.querySelector('.likes'),
            error: 'Оцените, пожалуйста'
          });
          this.correct = false;
        }
        if (this.$isEmpty(this.content)) {
          this.$incorrect({
            target: document.querySelector('textarea'),
            error: 'Напишите короткий отзыв, пожалуйста'
          });
          this.correct = false;
        }
        if (this.correct) {
          this.$toggle(b);
          this.disabled = true;
          const o = this.$store.getters.overlayObj;
          const cI = `claim${this.$capitalize(o.collection)}Id`;
          try {
            await this.$review.set(
              this.liked,
              o.collection,
              {
                [cI]: o.id,
                description: this.content,
                clientMemberId: o.clientMemberId
              },
              o.memberToId
            );
            this.message = 'Отзыв оставлен!';
          } catch (e) {
            this.$errorHandle(e);
          }
          this.close();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/review.scss';
</style>
