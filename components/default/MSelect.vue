<template>
  <div
    class="m-select"
    :class="{ multi: optionsMode === 'multi' }"
    :style="{ width: width, backgroundColor }"
  >
    <input type="hidden" :name="name" :value="value" />
    <div
      class="_input d-flex align-center"
      :style="{ cursor: disabled ? 'default' : 'pointer', backgroundColor }"
      @click="toggleSelect($event)"
    >
      <img v-if="icon" :src="icon" class="chosenIcon" alt="" />
      <img v-if="prepend" :src="prepend" class="chosenIcon" alt="" />
      <div class="placeholder">
        {{ $capitalize(placeholderText) }}
      </div>
      <img
        v-if="!disabled && !$isEmpty(theOptions)"
        id="select"
        :src="$imgSrc(`${selectIcon}`)"
        class="ml-auto"
      />
    </div>
    <div class="message"></div>
    <div
      v-show="theOptions.length > 0"
      class="m-select-list"
      :style="{ maxHeight: maxHeight ? `${maxHeight}px` : '150px' }"
    >
      <div class="m-select-list-container d-flex flex-column">
        <template v-if="!optionsMode">
          <div
            v-for="i of theOptions"
            :key="i.title"
            class="m-select-list-item pointer"
            @click="chooseValue($event, i)"
          >
            {{ i.title }}
          </div>
        </template>
        <template v-else>
          <template v-if="optionsMode === 'icon'">
            <div
              v-for="i of theOptions"
              :key="i.title"
              class="m-select-list-item iconed pointer"
              @click="chooseValue($event, i)"
            >
              <img :src="i.value.icon" alt="" />
              <div>{{ i.title }}</div>
            </div>
          </template>
          <template v-if="optionsMode === 'append'">
            <div
              v-for="i of theOptions"
              :key="i.title"
              class="m-select-list-item iconed append pointer"
              @click="chooseValue($event, i)"
            >
              <div>{{ i.title }}</div>
              <img :src="i.value.icon" alt="" />
            </div>
          </template>
          <template v-if="optionsMode === 'multi'">
            <label
              v-for="(i, index) of theOptions"
              :key="i.title"
              class="m-select-list-item iconed m-checkbox"
              @click="chooseValue($event, i, index)"
            >
              <input
                v-if="$isEmpty(multiselected.filter((a) => a.value == i.value))"
                type="checkbox"
                hidden
                @change.prevent="dont"
              />
              <input
                v-else
                type="checkbox"
                hidden
                checked="checked"
                @change.prevent="dont"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">{{ i.title }}</div>
            </label>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: '_name'
    },
    placeholder: {
      type: String,
      default: 'Выберите значение'
    },
    required: {
      type: Boolean,
      default: undefined
    },
    valueMode: {
      type: String,
      default: 'string'
    },
    optionsMode: {
      type: String,
      default: undefined
    },
    maxHeight: {
      type: Number,
      default: undefined
    },
    temp: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: [Object, Array, String],
      default: ''
    },
    sorted: {
      type: Boolean,
      default: false
    },
    border: {
      type: String,
      default: undefined
    },
    width: {
      type: String,
      default: undefined
    },
    selectedColor: {
      type: String,
      default: 'black'
    },
    backgroundColor: {
      type: String,
      default: 'white'
    },
    selectIcon: {
      type: String,
      default: 'icons/select.svg'
    },
    prepend: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      value: '_value',
      placeholderText: this.placeholder,
      multiselected: [],
      icon: undefined,
      theOptions: [],
      check: false
    };
  },
  watch: {
    selected(newV, oldV) {
      if (newV) {
        this.doSelect(newV);
      }
    },
    options(newV) {
      if (this.sorted) {
        const i = JSON.parse(JSON.stringify(this.options));
        i.sort((a, b) => {
          const a1 = isNaN(a.title) ? a.title.toLowerCase() : a.title;
          const b1 = isNaN(a.title) ? b.title.toLowerCase() : b.title;
          if (a1 > b1) {
            return 1;
          } else if (a1 < b1) {
            return -1;
          } else if (a1 == b1) {
            return 0;
          }
        });
        [...this.theOptions] = JSON.parse(JSON.stringify(i));
      } else {
        [...this.theOptions] = JSON.parse(JSON.stringify(newV));
      }
      this.theOptions.map((a) => {
        a.title = this.$capitalize(a.title);
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$props.required) {
        this.$el.children[0].setAttribute('data-required', true);
      }
      switch (this.$props.border) {
        case 'bottom': {
          this.$el.querySelector('._input').style.borderColor = 'transparent';
          this.$el.querySelector('._input').style.borderBottomColor = this
            .$props.disabled
            ? '#CBCBCB'
            : '#2D5EBB';
          break;
        }
        case 'transparent': {
          this.$el.querySelector('._input').style.borderColor = 'transparent';
        }
      }
      if (this.sorted) {
        const i = JSON.parse(JSON.stringify(this.options));
        i.sort((a, b) => {
          const a1 = isNaN(a.title) ? a.title.toLowerCase() : a.title;
          const b1 = isNaN(a.title) ? b.title.toLowerCase() : b.title;
          if (a1 > b1) {
            return 1;
          } else if (a1 < b1) {
            return -1;
          } else if (a1 == b1) {
            return 0;
          }
        });
        [...this.theOptions] = JSON.parse(JSON.stringify(i));
      } else {
        [...this.theOptions] = JSON.parse(JSON.stringify(this.options));
      }
      this.theOptions.map((a) => {
        a.title = this.$capitalize(a.title);
      });
      if (this.width) {
        this.$el.querySelector('._input').style.width = `${this.width}`;
      }
      this.doSelect(this.$props.selected);
    });
  },
  methods: {
    dont(e) {},
    chooseValue(e, val, index = undefined) {
      if (this.optionsMode === 'multi') {
        const eT = e.target;
        if (!eT.hasAttribute('type')) {
          const t = eT.closest('.m-select-list-item');
          const ch = t.children[0];
          ch.checked = !ch.checked;
          if (ch.checked) {
            this.multiselected.push({
              title: this.theOptions[index].title,
              value: this.theOptions[index].value
            });
          } else {
            this.multiselected.splice(
              this.multiselected.findIndex(
                (a) => a.value === this.theOptions[index].value
              ),
              1
            );
          }
          this.$emit('change', e, this.multiselected);
          if (this.$isEmpty(this.multiselected)) {
            this.placeholderText = this.placeholder;
            const i = e.target.closest('.m-select').querySelector('._input');
            i.style.color = 'rgba(0,0,0,0.5)';
          } else {
            const i = this.multiselected.sort((a, b) => {
              const a1 = isNaN(a.title) ? a.title.toLowerCase() : a.title;
              const b1 = isNaN(a.title) ? b.title.toLowerCase() : b.title;
              if (a1 > b1) {
                return 1;
              } else if (a1 < b1) {
                return -1;
              } else if (a1 == b1) {
                return 0;
              }
            });
            this.placeholderText = i
              .map((a) => {
                return a.title;
              })
              .join(', ');

            const q = e.target.closest('.m-select').querySelector('._input');
            q.style.color = this.selectedColor;
          }
          return false;
        } else {
          e.preventDefault();
        }
      } else {
        if (this.optionsMode === 'icon') {
          this.icon = val.value.icon;
        }
        if (this.valueMode === 'string') {
          if (!this.temp) {
            this.value = val.value;
          }
          this.$emit('change', e, val.value);
        } else if (this.valueMode === 'object') {
          this.$emit('change', e, val);
        }
        this.toggleSelect(e);
        if (!this.temp) {
          this.placeholderText = val.title;
        }
      }
      const i = e.target.closest('.m-select').querySelector('._input');
      i.style.color = this.selectedColor;
    },
    toggleSelect(e) {
      if (!this.disabled && !this.$isEmpty(this.theOptions) && e.button === 0) {
        const t = e.target.classList.contains('_input')
          ? e.target
          : e.target.closest('.m-select').querySelector('._input');
        const l = t.closest('.m-select').querySelector('.m-select-list');
        // this.$reject({ target: t });
        for (const s of document.querySelectorAll('.m-select')) {
          const ta = s.querySelector('._input');
          const m = ta.closest('.m-select');
          const li = m.querySelector('.m-select-list');
          if (ta !== t) {
            if (ta.classList.contains('activated')) {
              if (m.classList.contains('temp')) {
                if (m.classList.contains('opaq')) m.classList.add('d-opaq');
              }
              li.style.overflow = 'hidden';
              li.style.height = '0';
              ta.classList.remove('activated');
              setTimeout(() => {
                li.style.visibility = 'hidden';
              }, 151);
            }
          }
        }
        if (t.classList.contains('activated')) {
          l.style.overflow = 'hidden';
          l.style.height = '0';
          t.classList.remove('activated');
          setTimeout(() => {
            l.style.visibility = 'hidden';
          }, 151);
          this.$reject({ target: t });
        } else {
          l.style.visibility = 'visible';
          l.style.height = `${l.children[0].offsetHeight + 1 + 'px'}`;
          t.classList.add('activated');
          setTimeout(() => {
            l.style.overflow = 'auto';
          }, 200);
        }
      }
    },
    doSelect(val) {
      if (this.$isEmpty(val)) {
        this.placeholderText = this.placeholder;
        this.$el.querySelector('._input').style.color = 'rgba(0,0,0,0.5)';
        this.value = '';
      } else {
        if (this.optionsMode === 'multi') {
          const i = JSON.parse(JSON.stringify(this.selected));
          i.sort((a, b) => {
            const a1 = isNaN(a.title) ? a.title.toLowerCase() : a.title;
            const b1 = isNaN(a.title) ? b.title.toLowerCase() : b.title;
            if (a1 > b1) {
              return 1;
            } else if (a1 < b1) {
              return -1;
            } else if (a1 == b1) {
              return 0;
            }
          });
          [...this.multiselected] = i;
          this.placeholderText = i
            .map((a) => {
              return a.title;
            })
            .join(', ');

          this.value = this.placeholderText;
        } else if (typeof this.selected === 'string') {
          this.placeholderText = this.selected;
          this.value = this.selected;
        } else {
          this.placeholderText = this.selected.title;
          this.value = this.selected.value;
        }
        this.$el.querySelector('._input').style.color = this.selectedColor;
        this.$reject({ target: this.$el.querySelector('._input') });
        if (this.optionsMode === 'icon') {
          this.icon = val.value.icon;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
.m-select {
  position: relative;
  width: 100%;
  z-index: 9;
  background-color: white;
  &.temp {
    z-index: 60;
  }
  ._input {
    color: transparentize($black, 0.5);
    position: relative;
    overflow: hidden;
    .placeholder {
      user-select: none;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .chosenIcon {
      width: 20px;
      margin-right: 7px;
    }
    span {
      margin-right: 10px;
    }
    #select {
      margin-right: 10px;
      width: 10px;
      flex-shrink: 0;
      @include flow(0.15);
    }
    &.activated {
      #select {
        transform: rotate(180deg);
        @include flow(0.15);
      }
    }
  }
  &-list {
    visibility: hidden;
    height: 0;
    position: absolute;
    left: 0;
    top: 34px;
    width: 100%;
    max-height: 148px;
    overflow: hidden;
    background-color: $white;
    border: 1px solid #cbcbcb;
    border-top: 0;
    z-index: 10;
    @include flow(0.15);
    &-container {
      width: 100%;
    }
    &-item {
      width: 100%;
      padding: 5px 10px;
      line-height: 100%;
      font-size: rem(14);
      font-weight: 600;
      color: $black;
      @include flow(0.15);
      &:hover {
        color: $brand;
        background-color: $light-shade;
        @include flow(0.15);
      }
      &.iconed {
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: auto;
          margin-right: 7px;
          flex-shrink: 0;
        }
        div {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &.append {
          justify-content: space-between;
        }
      }
    }
  }
  .m-checkbox {
    margin: 0;
  }
}
</style>
