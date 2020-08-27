import { mapState } from 'vuex';

export default {
  data() {
    return {
      text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni vitae eum ipsum rerum fuga consequatur. In amet, libero nemo adipisci et reprehenderit. Quisquam ut suscipit deleniti accusantium nostrum, quasi numquam. 
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta, sapiente. Optio harum quia distinctio odio adipisci minima magni asperiores, exercitationem, soluta dolorum nobis temporibus assumenda repellendus vero error corrupti a.`,
      updated: true
    };
  },
  computed: {
    ...mapState(['mobile'])
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    hasPark(role) {
      return !role.toLowerCase().includes('sender');
    },
    totalCars(cars) {
      return cars.reduce((a, b) => {
        return a + b.total;
      }, 0);
    },
    totalEmployees(empl) {
      const l = empl.length;
      return l > 10 ? '10+' : l;
    },
    companyName(com) {
      return com.name === 'dummy' ? 'Без названия' : com.name;
    },
    companyRole(role) {
      const r = role.toLowerCase();
      if (r.includes('sender')) {
        return 'Грузовладелец';
      } else if (r.includes('expeditor')) {
        return 'Экспедитор';
      }
      return 'Грузоперевозчик';
    },
    userRole(role) {
      if (role.toLowerCase().includes('manager')) {
        return 'Менеджер';
      } else if (role.toLowerCase().includes('logist')) {
        return 'Логист';
      } else if (role.toLowerCase().includes('dispatcher')) {
        return 'Диспетчер';
      } else if (role.toLowerCase().includes('driver')) {
        return 'Водитель';
      } else if (role.toLowerCase().includes('expeditor')) {
        return 'Экспедитор';
      }
      return '';
    },

    docName(doc) {
      return doc.substring(0, doc.lastIndexOf('.'));
    },
    docFormat(doc) {
      const a = doc.split('.');
      return a[a.length - 1];
    },
    size(p, w) {
      const sF = w / 124;
      const c = p.map((d, i) => {
        if (i !== 2 && i !== 3) {
          if (p[2] === 0) {
            return 'center';
          }
          return d * sF + 'px';
        } else if (i === 2) {
          return d === 0
            ? 'cover'
            : p[3] === 0
            ? `auto calc(100% + ${d * sF}px)`
            : `calc(100% + ${d * sF}px)`;
        }
      });
      return c;
    },
    companySize(p, w) {
      const sF = w / 174;
      const c = p.map((d, i) => {
        if (i !== 2 && i !== 3) {
          if (p[2] === 0) {
            return 'center';
          }
          return d * sF + 'px';
        } else if (i === 2) {
          return d === 0
            ? 'cover'
            : p[3] === 0
            ? `auto calc(100% + ${d * sF}px)`
            : `calc(100% + ${d * sF}px)`;
        }
      });
      return c;
    },
    aText(t) {
      return t.replace(/\n/g, '<p>');
    },
    show(e) {
      const t = e.target.closest('.monit-header');
      const c = t.nextElementSibling;
      const i = c.children[0];
      const iH = i.offsetHeight;
      if (t.classList.contains('shown')) {
        c.style.height = '0';
        t.classList.remove('shown');
      } else {
        c.style.height = iH + 7 + 'px';
        t.classList.add('shown');
      }
    },
    async startChat(e, user) {
      const c = this.$store.getters.chat;
      if (c !== user.id.value) {
        this.$screen(true);
        const k = user.id.value;
        const u = this.$store.getters.unread;
        try {
          const m = await this.$io.getChat(k);
          m.items.reverse();
          this.$store.commit('messaging/startChat', {
            memberPhoto: user.photo || {
              value: this.$imgSrc('void-img.png'),
              position: [0, 0, 0]
            },
            memberName: user.name.default,
            content: m.items,
            member_id: k,
            total: m.pagination.totalCount
          });
          if (!u.hasOwnProperty(k)) {
            this.$store.commit('messaging/addUnread', {
              [k]: {
                ids: [],
                memberPhoto: user.photo || {
                  value: this.$imgSrc('void-img.png'),
                  position: [0, 0, 0]
                },
                memberName: user.name.default
              }
            });
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
      }
    }
  }
};
