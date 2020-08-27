<template>
  <div class="m-input">
    <div v-if="!flat" class="icon-slot d-flex align-center justify-end">
      <img class="loading_img" :src="$imgSrc('icons/loading.gif')" alt="" />
      <slot></slot>
    </div>
    <input
      v-model="getValue"
      autocomplete="off"
      :disabled="disabled"
      :placeholder="disabled ? '' : placeholder"
      :class="{
        [`placeholder-${placeholderColor}`]: true
      }"
      @keydown="$reject($event)"
      v-on="$listeners"
      @input="digits"
    />
    <div class="message"></div>
    <!-- <input
      v-if="multi && condition"
      type="checkbox"
      hidden
      :checked="multi && condition"
      :name="name"
      :value="inputValue"
    /> -->
    <div
      v-if="!flat"
      class="icon-slot prepend d-flex align-center justify-start"
    >
      <slot name="prepend"></slot>
    </div>
    <div
      v-if="!$isEmpty(result) && autocomplete"
      class="m-input-autocomplete"
      :style="autocompleteStyle"
    >
      <div class="m-input-autocomplete-container">
        <transition-group
          tag="div"
          name="default"
          class="m-input-autocomplete-list d-flex flex-column"
          mode="out-in"
        >
          <div
            v-for="(r, index) of result"
            :key="r.title"
            :data-id="index"
            class="m-input-autocomplete-item pointer"
            :style="{ paddingLeft: prependPadding }"
            v-on="listeners"
          >
            {{ r.title }}
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'select',
    event: 'click'
  },
  props: {
    select: {
      type: Object,
      default: () => {}
    },
    dataValidate: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      default: undefined
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: undefined
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // multi: {
    //   type: Boolean,
    //   default: false
    // },
    prepend: {
      type: Boolean,
      default: false
    },
    inputValue: {
      type: String,
      default: ''
    },
    inputStyle: {
      type: String,
      default: undefined
    },
    border: {
      type: String,
      default: undefined
    },
    flat: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: undefined
    },
    autocomplete: {
      type: Boolean,
      default: false
    },
    result: {
      type: Array,
      default: () => []
    },
    digit: {
      type: Boolean,
      default: false
    },
    placeholderColor: {
      type: String,
      default: 'black'
    }
  },
  data() {
    return {
      value: this.inputValue,
      prependPadding: '10px'
    };
  },
  computed: {
    condition() {
      if (this.required) {
        if (this.dataValidate) {
          const { ...v } = this.$validate({ [this.dataValidate]: this.value });
          return Object.keys(v).length === 0;
        } else {
          return !!this.value.trim();
        }
      }
      return true;
    },
    listeners() {
      return Object.assign({}, this.$listeners, {
        // input: (e) => {
        //   this.$emit('input', e.target.value);
        // },
        click: (e) => {
          this.$emit('click', this.selected(e));
        }
      });
    },
    getValue: {
      get() {
        return this.$isEmpty(this.inputValue) ? this.value : this.inputValue;
      },
      set(val) {
        if (this.$isEmpty(this.inputValue)) {
          this.value = val;
        }
      }
    },
    autocompleteStyle() {
      return this.$el
        ? `top:${this.$el.querySelector('input').offsetHeight - 1}px`
        : '35px';
    }
  },
  watch: {
    disabled(newV) {
      switch (this.$props.border) {
        case 'bottom': {
          this.$el.querySelector('input').style.borderColor = 'transparent';
          this.$el.querySelector('input').style.borderBottomColor = this.$props
            .disabled
            ? '#CBCBCB'
            : '#2D5EBB';
          break;
        }
      }
    },
    width(newV) {
      this.$el.style.width = newV;
    },
    result(newV) {
      this.$nextTick(() => {
        this.$el.querySelector('.loading_img').classList.remove('waiting');
      });
    },
    inputStyle(newV) {
      const inp = this.$el.querySelector('input');
      this.styleConcat(inp);
    },
    inputValue(newV) {
      if (this.$isEmpty(newV)) {
        this.value = '';
        const inp = this.$el.querySelector('input');
        inp.value = '';
      }
    },
    required(newV) {
      const inp = this.$el.querySelector('input');
      if (newV) {
        inp.setAttribute('data-required', true);
      } else {
        inp.removeAttribute('data-required');
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$el) {
        for (const p in this.$props) {
          const inp = this.$el.querySelector('input');
          if (this.$props[p]) {
            if (p !== 'disabled' && p !== 'width') {
              const a = p.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
              if (p === 'required') {
                inp.setAttribute('data-required', true);
              } else {
                inp.setAttribute(a, this.$props[p]);
                if (p === 'prepend') {
                  const p = this.$el.querySelector('.prepend');
                  p.children[0].onload = () => {
                    const w = p.offsetWidth;
                    this.prependPadding = w + 10 + 'px';
                    inp.style.paddingLeft = w + 10 + 'px';
                  };
                  const w = p.offsetWidth;
                  this.prependPadding = w + 10 + 'px';
                  inp.style.paddingLeft = w + 10 + 'px';
                }
                if (p === 'inputStyle') {
                  this.styleConcat(inp);
                }
              }
            }
            if (p === 'width') {
              this.$el.style.width = this.$props[p];
            }
            if (p === 'autocomplete') {
              inp.style.backgroundColor = 'white';
            }
          }
        }
        switch (this.$props.border) {
          case 'bottom': {
            this.$el.querySelector('input').style.borderColor = 'transparent';
            this.$el.querySelector('input').style.borderBottomColor = this
              .$props.disabled
              ? '#CBCBCB'
              : '#2D5EBB';
            break;
          }
          case 'transparent': {
            this.$el.querySelector('input').style.borderColor = 'transparent';
            break;
          }
        }
      }
    });
  },
  methods: {
    selected(e) {
      return this.result[e.target.getAttribute('data-id')];
    },
    styleConcat(input) {
      if (input.hasAttribute('style')) {
        const allr = input.getAttribute('style').split(/\s*;\s*/);
        const alln = this.inputStyle.split(/\s*;\s*/);
        const q = {};
        const w = [];

        for (const x of allr) {
          if (!this.$isEmpty(x)) {
            const i = x.split(/:\s*/);
            q[i[0]] = i[1];
          }
        }
        for (const x of alln) {
          if (!this.$isEmpty(x)) {
            const i = x.split(/:\s*/);
            q[i[0]] = i[1];
          }
        }

        for (const x of Object.keys(q)) {
          w.push(`${x}:${q[x]}`);
        }
        input.setAttribute('style', w.join(';'));
      } else {
        input.setAttribute('style', this.inputStyle);
      }
    },
    digits(e) {
      if (this.digit) {
        if (!this.$isEmpty(e.target.value)) {
          e.target.value = e.target.value
            .replace(/[^.,0-9]/g, '')
            .replace(/,/g, '.')
            .replace(/\.{2,}/g, '.');
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
.m-input {
  position: relative;
  @include flow;
  z-index: 9;
  input {
    @include flow;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    position: relative;
    z-index: 2;
    &.placeholder-black {
      &::placeholder {
        color: black;
      }
    }
    &.placeholder-white {
      &::placeholder {
        color: white;
      }
    }
  }
  &-autocomplete {
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
    position: absolute;
    background-color: white;
    left: 0;
    width: 100%;
    z-index: 1;
    &-container {
      max-height: 155px;
      overflow-y: auto;
    }
    &-list {
      @include my(5);
    }
    &-item {
      line-height: 100%;
      font-size: rem(14);
      font-weight: 600;
      @include py(5);
      @include px(10);
      @include flow;
      color: black;
      &:hover {
        @include flow;
        color: $brand;
      }
    }
  }
  .icon-slot {
    position: absolute;
    @include py(5);
    height: 35px;
    overflow-x: visible;
    top: 0;
    width: max-content;
    right: 10px;
    overflow-x: visible;
    z-index: 3;
    .loading_img {
      height: 100%;
      opacity: 0;
      visibility: hidden;
      margin-right: 4px;
      @include flow(0.15);
      &.waiting {
        opacity: 1;
        visibility: visible;
        @include flow(0.15);
      }
    }
  }
  .prepend {
    z-index: 3;
    left: 5px;
    img {
      height: 25px;
    }
  }
}
</style>
