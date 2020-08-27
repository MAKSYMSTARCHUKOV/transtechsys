<template>
  <div
    class="m-document d-flex flex-column align-center justify-center pointer"
    :style="{ backgroundColor: `${isEmpty ? '#2D5EBB' : 'white'}` }"
  >
    <template v-if="!mobile">
      <v-tooltip top>
        <template #activator="{ on }">
          <div class="close" v-on="on">
            <img
              v-if="!isEmpty"
              :src="$imgSrc('icons/cancel.svg')"
              alt=""
              class="pointer"
              v-on="listeners"
            />
          </div>
        </template>
        <span>Убрать из списка</span>
      </v-tooltip>
    </template>
    <div v-else class="close">
      <img
        v-if="!isEmpty"
        :src="$imgSrc('icons/cancel.svg')"
        alt=""
        class="pointer"
        v-on="listeners"
      />
    </div>
    <img class="img" :src="imgSrc" alt="" />
    <div :style="{ color: `${isEmpty ? 'white' : '#4E5357'}` }">
      <template v-if="isEmpty">
        Загрузить
      </template>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    format: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['mobile']),
    isEmpty() {
      return !this.format;
    },
    imgSrc() {
      if (!this.isEmpty) {
        return this.$imgSrc(`icons/format/${this.format}.svg`);
      }
      return this.$imgSrc('icons/download-white.svg');
    },
    listeners() {
      return Object.assign({}, this.$listeners, {
        close: (e) => {
          this.$emit('input', e.target.value);
        },
        on: (e) => {
          this.$emit('on', e.target.value);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
.m-document {
  padding: 10px;
  position: relative;
  .img {
    height: 36px;
  }
  .close {
    top: 5px;
    right: 5px;
    position: absolute;
    img {
      height: 20px;
    }
  }
  div:not(.close) {
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
