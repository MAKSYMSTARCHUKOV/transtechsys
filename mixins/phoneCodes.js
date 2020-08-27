import { codes, countries } from '~/modules/iso.js';
export default {
  computed: {
    isoCodes() {
      const iso = [];
      const cK = Object.keys(countries).sort((a, b) => {
        if (a === 'Украина') {
          return -1;
        } else if (b === 'Украина') {
          return 1;
        } else {
          return a - b;
        }
      });
      for (const c of cK) {
        const code = countries[c];
        if (codes[code]) {
          iso.push({
            title: `${code} ${c}`,
            value: {
              icon: this.$imgSrc(`icons/countries/${codes[code]}.svg`),
              content: `${code} ${c}`,
              code
            }
          });
        }
      }
      return iso;
    }
  },
  methods: {
    inputIso(e, val) {
      const t = e.target;
      const s = t.closest('.m-select');
      const mI = s.nextElementSibling;
      const inp = mI.querySelector('[type="text"]');
      const i = s.getAttribute('data-id');
      const code = val.value.code;
      inp.value = code;
      this.findCode({ target: inp }, i);
      s.classList.add('d-opaq');
      inp.focus();
    },
    pastePlus(e) {
      const t = e.target;
      const i = t.closest('.m-input');
      i.setAttribute('data-active', '');
      if (t.value === '') {
        const m = i.previousElementSibling;
        setTimeout(() => {
          m.classList.remove('d-opaq');
          setTimeout(() => {
            m.querySelector('._input').click();
          }, 100);
        }, 200);
      }
    },
    findCode(e) {
      this.pastePlus(e);
      const t = e.target;
      const v = t.value;
      try {
        const f = t.previousElementSibling.children[1].children[0];
        f.removeAttribute('class');
        if (v.length > 2) {
          for (const c of Object.keys(codes)) {
            if (v.includes(c)) {
              f.classList.add('flag');
              f.classList.add(codes[c]);
              break;
            }
          }
        }
      } catch (e) {}
    }
  }
};
