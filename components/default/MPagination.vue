<template>
  <div v-if="pages > 1" class="m-pagination d-flex align-center">
    <template v-for="i in pages">
      <template v-if="i === 1">
        <div
          :key="i"
          :class="{ current: i === current }"
          :style="{ color }"
          @click="nextPage(i)"
        >
          1
        </div>
        <div
          v-if="before && !showBefore"
          :key="`before-${i}`"
          @click="showBefore = true"
        >
          ...
        </div>
      </template>
      <div
        v-if="time(i) && i !== 1 && i !== pages"
        :key="i"
        :class="{ current: i === current }"
        @click="nextPage(i)"
      >
        {{ i }}
      </div>
      <template v-if="i === pages">
        <div
          v-if="after && !showAfter"
          :key="`after-${i}`"
          @click="showAfter = true"
        >
          ...
        </div>
        <div :key="i" :class="{ current: i === current }" @click="nextPage(i)">
          {{ pages }}
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'obj',
    event: 'click'
  },
  props: {
    pages: {
      type: Number,
      default: 1
    },
    page: {
      type: Number,
      default: 1
    },
    obj: {
      type: Object,
      default: () => ({})
    },
    color: {
      type: String,
      default: 'white'
    }
  },
  data() {
    return {
      showBefore: false,
      showAfter: false,
      current: this.page
    };
  },
  computed: {
    before() {
      if (this.pages > 7) {
        if (this.current > 4) {
          return true;
        }
      }
      return false;
    },
    after() {
      if (this.pages > 7) {
        if (this.pages - this.current > 3) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    nextPage(i) {
      if (i !== this.current) {
        if (i < this.current) {
          this.$emit('click', { page: i, direction: 'right-tab' });
        } else {
          this.$emit('click', { page: i, direction: 'left-tab' });
        }
        this.current = i;
      }
    },
    time(i) {
      if (i === this.current) {
        return true;
      } else if (i !== this.current) {
        if (this.pages > 7) {
          if (i < this.current) {
            if (this.showBefore) {
              return true;
            }
            if (this.pages - this.current >= 4) {
              if (this.current > 4) {
                if (i > this.current - 2) {
                  return true;
                }
              } else {
                return true;
              }
            } else if (this.pages - this.current < 4) {
              if (i >= this.pages - 4) {
                return true;
              }
            }
            return false;
          } else if (i > this.page) {
            if (this.showAfter) {
              return true;
            }
            if (this.current >= 4) {
              if (this.pages - this.current > 3) {
                if (i < this.current + 2) {
                  return true;
                }
              } else {
                return true;
              }
            } else if (this.current < 4) {
              if (i < 6) {
                return true;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.m-pagination {
  flex-wrap: wrap;
  div {
    user-select: none;
    cursor: pointer;
    font-weight: 600;
    font-size: rem(16);
    @include my(5);
    @include tablet() {
      font-size: rem(14);
    }
    &:not(:last-child) {
      margin-right: 14px;
      @include tablet() {
        margin-right: 12px;
      }
    }
    &.current {
      color: $brand !important;
      font-size: rem(24);
      font-weight: 800;
      @include tablet() {
        font-size: rem(22);
      }
    }
  }
}
</style>
