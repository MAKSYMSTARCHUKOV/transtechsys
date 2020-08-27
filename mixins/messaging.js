export default {
  data() {
    return {
      changed: true
    };
  },
  mounted() {
    this.unwatch1 = this.$store.watch(
      (state, getters) => getters.unreadLength,
      (newV, oldV) => {
        if (newV) {
          this.changed = !this.changed;
        }
      }
    );
    this.unwatch2 = this.$store.watch(
      (state, getters) => getters.messagesLength,
      (newV, oldV) => {
        if (newV) {
          this.scroll();
        }
      }
    );
  },
  beforeDestroy() {
    try {
      this.unwatch2();
    } catch (e) {}
    try {
      this.unwatch1();
    } catch (e) {}
  },

  methods: {
    date(date) {
      const n = new Date();
      const d = new Date(date);
      const nd = n.toLocaleDateString();
      const dd = d.toLocaleDateString();
      const t = d.toLocaleTimeString().split(':');
      if (nd === dd) {
        return `${t[0]}:${t[1]}`;
      } else {
        return `${dd} ${t[0]}:${t[1]}`;
      }
    },
    avatarSize(p, w) {
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
    count(arr) {
      const l = arr.length;
      return l > 99 ? '99+' : l;
    },
    isOnline(id) {
      return !this.$isEmpty(
        this.$store.getters.online.find((a) => a.id === id)
      );
    },
    aContent(obj) {
      return obj.content
        .replace(/\n/g, '<br />')
        .concat(`<span class="date">${this.date(obj.created_at.date)}</span>`);
    },
    async startChat(e, k, messages = undefined) {
      this.$screen(true);
      const u = this.$store.getters.unread;
      const h = this.$store.getters.history;
      const p = !messages ? u[k] : h.find((a) => a.member_id === k);
      let ids = [];
      if (u[k]) {
        [...ids] = u[k].ids;
      }
      try {
        const m = await this.$io.getChat(k);
        m.items.reverse();
        this.$store.commit('messaging/startChat', {
          memberName: p.memberName,
          memberPhoto: p.memberPhoto,
          content: m.items,
          member_id: k,
          total: m.pagination.totalCount
        });
      } catch (e) {
        this.$errorHandle(e);
      }
      if (!this.$isEmpty(ids)) {
        try {
          await this.$io.markRead(ids);
          this.$store.commit('messaging/updateUnread', {
            [k]: {
              ids: []
            }
          });
          if (messages) {
            this.$store.commit('messaging/updateHistoryUnread', {
              index: h.findIndex((a) => a.member_id === k),
              unread: 0
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
      this.$screen(false);
    },
    async sendMessage(e, scroll) {
      this.$screen(true);
      const t = e.target;
      const ta = t.closest('.type-area').querySelector('textarea');
      const v = ta.value;
      const id = this.$store.getters.chat;
      if (!this.$isEmpty(v)) {
        try {
          await this.$io.sendMessage(id, v);
          const d = new Date();
          const ids = [];
          this.chat.content.map((a) => {
            if (!isNaN(a.id)) {
              ids.push(a.id);
            }
          });
          const c = {
            id: this.$random(ids),
            member_from: {
              id: this.$store.getters.member_id
            },
            content: v,
            created_at: {
              date: d.toISOString()
            }
          };
          this.$store.commit('messaging/addMessageToChat', c);
          const indH = this.$store.getters.history.findIndex(
            (a) => a.member_id === id
          );
          if (indH !== -1) {
            this.$store.commit('messaging/updateHistory', {
              index: indH,
              content: v,
              created_at: d.toISOString()
            });
          }
          this.$nextTick(() => {
            scroll();
            ta.value = '';
          });
        } catch (e) {
          this.$errorHandle(e);
        }
      }
      this.$screen(false);
    },
    async sendIt(e, scroll) {
      if (
        e.keyCode === 13 &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        try {
          await this.sendMessage(e, scroll);
        } catch (e) {
          this.$errorHandle(e);
        }
      }
    },

    uploadEvent(e, treshold = undefined) {
      const t = e.target;
      const tr = treshold || 25;
      if (t.scrollTop < tr) {
        this.uploadMore(t);
      }
    },

    async uploadMore(target) {
      const c = this.$store.getters.chatContent;
      const p = this.$store.getters.chatPage;
      const pS = this.$store.getters.chatPages;
      const id = this.$store.getters.chat;
      const loading = target.querySelector('.uploading');
      if (c.length % 100 === 0 && c.length !== 0) {
        if (pS > 1 && p !== pS) {
          target.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          loading.classList.remove('d-opaq');
          this.$cancel();
          try {
            const m = await this.$io.getChat(id, p + 1, 100);
            m.items.reverse();
            this.$store.commit('messaging/uploadChat', { content: m.items });
          } catch (e) {
            this.$errorHandle(e);
          }
          loading.classList.add('d-opaq');
        }
      }
    }
  }
};
