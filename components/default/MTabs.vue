<template>
  <div :key="tabsChanged" class="m-tabs d-flex">
    <div
      v-for="t of tabs"
      :key="t.value"
      :data-id="t.value"
      class="m-tabs-tab w-100 pointer d-flex align-center justify-center"
      :class="{ current: tabs[current].value === t.value }"
      v-on="listeners"
      v-html="t.title"
    ></div>
    <div class="m-tabs-line"></div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'tab',
    event: 'click'
  },
  props: {
    tab: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => [
        {
          title: '',
          value: ''
        }
      ]
    }
  },
  data() {
    return {
      tabResult: this.tab,
      current:
        this.tabs.findIndex((a) => a.value === this.tab) === -1
          ? 0
          : this.tabs.findIndex((a) => a.value === this.tab),
      tabsChanged: true
    };
  },
  computed: {
    listeners() {
      return Object.assign({}, this.$listeners, {
        click: (e) => {
          this.$emit('click', this.clickHandle(e));
        },
        mousedown: (e) => {
          this.$emit('mousedown', this.getDirection(e));
        }
      });
    }
  },
  watch: {
    tabs(newV) {
      this.current =
        this.tabs.findIndex((a) => a.value === this.tab) === -1
          ? 0
          : this.tabs.findIndex((a) => a.value === this.tab);
      this.tabsChanged = !this.tabsChanged;
    }
  },
  mounted() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.chat,
      (newV, oldV) => {
        setTimeout(() => {
          this.stationing();
        }, 100);
      }
    );
    this.$nextTick(() => {
      this.stationing();
    });
  },
  beforeDestroy() {
    try {
      this.unwatch();
    } catch (e) {}
  },
  methods: {
    clickHandle(e) {
      const t = e.target;
      const i = t.getAttribute('data-id');
      const index = this.tabs.findIndex((a) => a.value === i);
      if (index !== this.current) {
        this.$el.querySelector('.current').classList.remove('current');
        t.classList.add('current');
        this.stationing();
        this.tabResult = i;
        this.current = index;
      }
      return this.tabResult;
    },
    getDirection(e) {
      const t = e.target;
      const i = t.getAttribute('data-id');
      const index = this.tabs.findIndex((a) => a.value === i);
      if (i === this.tabResult) {
        return false;
      }
      if (index !== this.current) {
        return this.current > index ? 'left-tab' : 'right-tab';
      }
    },
    stationing() {
      const e = this.$el.querySelector('.current');
      const l = this.$el.querySelector('.m-tabs-line');
      l.style.left = e.offsetLeft + 'px';
      l.style.width = e.offsetWidth + 'px';
      l.style.top = e.offsetTop + e.offsetHeight - 5 + 'px';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.m-tabs {
  flex-direction: column;
  position: relative;
  @include tablet() {
    flex-direction: row;
  }
  &-tab {
    user-select: none;
    @include py(6);
    border-bottom: 2px solid $brand;
    font-size: rem(18);
    color: $dark-shade;
    text-align: center;
    @include flow(0.2);
    &.current {
      @include flow(0.2);
      color: $brand;
      font-weight: 600;
    }
  }
  &-line {
    @include flow(0.2);
    position: absolute;
    height: 4px;
    background-color: $brand;
    bottom: 0;
  }
}
</style>

<style lang="scss">
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.bubble {
  margin-left: 5px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  color: white;
  font-size: rem(13);
  background-color: $brand;
  display: flex;
  font-weight: normal;
  align-items: center;
  justify-content: center;
}
</style>
