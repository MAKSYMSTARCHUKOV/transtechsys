<template>
  <form style="min-width: 260px">
    <img
      id="close"
      :src="$imgSrc('icons/cancel.svg')"
      alt="x"
      class="pointer"
      @click="close"
    />
    <section
      v-if="data.member_id"
      class="member d-flex flex-column align-center"
    >
      <template v-if="data.avatar">
        <div
          class="member-avatar"
          :style="{
            backgroundImage: `url(${data.avatar.value})`,
            backgroundSize: size[2],
            backgroundPosition: `${size[0]} ${size[1]}`
          }"
        ></div>
      </template>
      <div class="member-name">
        {{ data.name }}
      </div>
      <div class="member-role">
        {{ role }}
      </div>
      <div class="member-phones d-flex justify-center" v-html="phones"></div>
      <div class="member-messenger d-flex justify-center">
        <a
          v-if="messengers.whatsapp"
          :href="`whatsapp://send?phone=${messengers.whatsapp}`"
          ><img :src="$imgSrc('icons/contact/whatsapp.svg')"
        /></a>
        <a
          v-if="messengers.telegram"
          :href="`tg://resolve?domain=${messengers.telegram}`"
          ><img :src="$imgSrc('icons/contact/telegram.svg')"
        /></a>
        <a
          v-if="messengers.viber"
          :href="`viber://add?number=${messengers.viber}`"
          ><img :src="$imgSrc('icons/contact/viber.svg')"
        /></a>
        <a v-if="messengers.skype" :href="`skype:login?${messengers.skype}call`"
          ><img :src="$imgSrc('icons/contact/skype.svg')"
        /></a>
        <a v-if="messengers.instagram" :href="`${messengers.instagram}`"
          ><img :src="$imgSrc('icons/info/instagram-color.svg')"
        /></a>
        <a v-if="messengers.facebook" :href="`${messengers.facebook}`"
          ><img :src="$imgSrc('icons/info/facebook.svg')"
        /></a>
      </div>
      <m-button shade="blue" @click.native="startChat($event, data)">
        написать<img :src="$imgSrc('icons/send-white.svg')" />
      </m-button>
    </section>
    <Profile
      v-else
      :company="data.company"
      :cars="data.cars"
      :employees="data.users"
    >
    </Profile>
  </form>
</template>
<script>
import Profile from '~/components/Profile.vue';

export default {
  components: {
    Profile
  },
  computed: {
    data() {
      return this.$store.state.overlay.obj;
    },
    size() {
      const sF = 221 / 124;
      const p = this.data.avatar.position;
      const c = p.map((d, i) => {
        if (i !== 2 && i !== 3) {
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
    role() {
      if (this.data.role.toLowerCase().includes('manager')) {
        return 'Менеджер';
      } else if (this.data.role.toLowerCase().includes('logist')) {
        return 'Логист';
      } else if (this.data.role.toLowerCase().includes('dispatcher')) {
        return 'Диспетчер';
      } else if (this.data.role.toLowerCase().includes('driver')) {
        return 'Водитель';
      } else if (this.data.role.toLowerCase().includes('expeditor')) {
        return 'Экспедитор';
      }
      return '';
    },
    messengers() {
      const obj = {};
      const whatsapp = this.data.phones.find((a) => a.messenger.whatsapp);
      const telegram = this.data.phones.find((a) => a.messenger.telegram);
      const viber = this.data.phones.find((a) => a.messenger.viber);
      const skype = this.data.skype;
      const facebook = this.data.facebook;
      const instagram = this.data.instagram;
      if (!this.$isEmpty(whatsapp)) {
        obj.whatsapp = whatsapp.value;
      }
      if (!this.$isEmpty(telegram)) {
        obj.telegram = telegram.value;
      }
      if (!this.$isEmpty(viber)) {
        obj.viber = viber.value;
      }
      if (!this.$isEmpty(skype)) {
        obj.skype = skype;
      }
      if (!this.$isEmpty(instagram)) {
        obj.instagram = instagram;
      }
      if (!this.$isEmpty(facebook)) {
        obj.facebook = facebook;
      }
      return obj;
    },
    phones() {
      const p = [];
      if (!this.$isEmpty(this.data.phones)) {
        this.data.phones.map((a) => {
          if (!p.includes(a.value)) {
            p.push(a.value);
          }
        });
      }
      return p
        .map((a) => `<a href="tel:${a}">${a}</a>`)
        .join('&nbsp;&nbsp;|&nbsp;&nbsp;');
    }
  },
  methods: {
    close() {
      this.$store.commit('setOverlayVisible', false);
    },
    async startChat(e, user) {
      const c = this.$store.getters.chat;
      if (c !== user.member_id) {
        this.$screen(true);
        const k = user.member_id;
        const u = this.$store.getters.unread;
        try {
          const m = await this.$io.getChat(k);
          m.items.reverse();
          this.$store.commit('messaging/startChat', {
            memberPhoto: user.avatar || {
              value: this.$imgSrc('void-img.png'),
              position: [0, 0, 0]
            },
            memberName: user.name,
            content: m.items,
            member_id: k,
            total: m.pagination.totalCount
          });
          if (!u.hasOwnProperty(k)) {
            this.$store.commit('messaging/addUnread', {
              [k]: {
                ids: [],
                memberPhoto: user.avatar || {
                  value: this.$imgSrc('void-img.png'),
                  position: [0, 0, 0]
                },
                memberName: user.name
              }
            });
          }
        } catch (e) {
          this.$errorHandle(e);
        }
        this.$screen(false);
        this.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/minfo.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.member-phones {
  font-size: rem(16);
  color: $dark-shade;
  a {
    font-size: rem(16);
    color: $dark-shade;
  }
}
</style>
