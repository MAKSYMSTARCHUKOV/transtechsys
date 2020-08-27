<template>
  <section class="m-chat">
    <transition-group
      v-if="!mobile && !$route.name.includes('find')"
      :key="changed"
      tag="div"
      class="m-chat-container"
      name="from-right"
      mode="out-in"
      appear
    >
      <div
        v-for="(v, k) in $store.getters.unread"
        :key="`${k}-`"
        class="m-chat-member pointer"
        :data-id="k"
        @click="startChat($event, k)"
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <div
              class="m-chat-member-avatar"
              :class="{ active: $store.getters.chat === k }"
              :style="{
                backgroundImage: `url(${v.memberPhoto.value})`,
                backgroundSize: avatarSize(v.memberPhoto.position, 75)[2],
                backgroundPosition: `${
                  avatarSize(v.memberPhoto.position, 75)[0]
                } ${avatarSize(v.memberPhoto.position, 75)[1]}`
              }"
              v-on="on"
            >
              <div
                :class="{ 'd-opaq': !isOnline(k) }"
                class="m-chat-member-online"
              ></div>
              <div
                class="m-chat-member-counter"
                :class="{ 'd-opaq': $isEmpty(v.ids) }"
              >
                <span v-if="!$isEmpty(v.ids)">{{ count(v.ids) }}</span>
              </div>
            </div>
          </template>
          <span>{{ v.memberName }}</span>
        </v-tooltip>
      </div>
    </transition-group>
    <div v-if="!$isEmpty($store.getters.chat)" class="m-chat-popup">
      <div class="m-chat-popup-header">
        <div class="m-chat-popup-header-member">
          <div
            class="member-avatar"
            :style="{
              backgroundImage: `url(${chat.memberPhoto.value})`,
              backgroundSize: avatarSize(chat.memberPhoto.position, 40)[2],
              backgroundPosition: `${
                avatarSize(chat.memberPhoto.position, 40)[0]
              } ${avatarSize(chat.memberPhoto.position, 40)[1]}`
            }"
          >
            <div
              v-show="isOnline($store.getters.chat)"
              class="member-online"
            ></div>
          </div>
          <div class="member-name">{{ chat.memberName }}</div>
        </div>
        <img
          id="close"
          :src="$imgSrc('icons/close.svg')"
          class="pointer"
          @click="closePopup"
        />
      </div>
      <div class="m-chat-popup-chat" @scroll="uploadEvent">
        <div class="m-chat-popup-chat-container">
          <div class="m-chat-popup-chat-dialogs">
            <div class="uploading d-opaq">
              <img :src="$imgSrc('icons/loading.gif')" />
            </div>
            <template v-for="m of chat.content">
              <div
                :key="m.id"
                class="dialog"
                :class="{ to: m.member_from.id === $store.getters.member_id }"
                v-html="aContent(m)"
              ></div>
            </template>
          </div>
        </div>
      </div>
      <div class="m-chat-popup-type type-area">
        <textarea
          placeholder="Сообщение..."
          @keydown="sendIt($event, scroll)"
        ></textarea>
        <img
          id="send"
          :src="$imgSrc('icons/send.svg')"
          alt=""
          class="pointer"
          @click="sendMessage($event, scroll)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import messaging from '~/mixins/messaging.js';

export default {
  mixins: [messaging],
  computed: {
    ...mapState(['mobile']),
    ...mapState('messaging', ['chat']),
    maxWidth() {
      return (
        document.querySelector('.m-chat-popup-chat').offsetWidth - 20 + 'px'
      );
    }
  },
  mounted() {
    if (this.$route.name !== 'cabinet-messages') {
      this.unwatch = this.$store.watch(
        (state, getters) => getters.chat,
        (newV, oldV) => {
          this.showHidePopup();
        }
      );
    }
  },
  beforeDestroy() {
    try {
      this.unwatch();
    } catch (e) {}
  },
  methods: {
    closePopup() {
      const p = this.$el.querySelector('.m-chat-popup');
      p.style.height = '0px';
      setTimeout(() => {
        this.$store.commit(
          'messaging/deleteFromUnread',
          this.$store.getters.chat
        );
        this.$store.commit('messaging/clearChat');
      }, 160);
    },
    showHidePopup() {
      if (!this.$isEmpty(this.$store.getters.chat)) {
        this.$nextTick(() => {
          const p = this.$el.querySelector('.m-chat-popup');
          p.querySelector('[class*="-dialogs"]').style.maxWidth = this.maxWidth;
          const wH = window.innerHeight;
          if (this.mobile) {
            p.style.height = (wH * 80) / 100 + 'px';
          } else {
            p.style.height = '500px';
          }
          this.scroll(false);
        });
      }
    },
    scroll(smooth = true) {
      const p = this.$el.querySelector('.m-chat-popup');
      const c = p.querySelector('.m-chat-popup-chat');
      const d = c.querySelector('[class*="-dialogs"]');
      setTimeout(() => {
        c.scrollTo({
          top: d.offsetHeight,
          behavior: smooth ? 'smooth' : 'instant'
        });
      }, 160);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/chat.scss';
</style>

<style lang="scss">
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.v-tooltip__content {
  background-color: $brand !important;
  max-width: 300px;
  padding: 8px;
}
.dialog {
  .date {
    font-size: rem(10);
    color: $dark-shade;
    margin-left: auto;
    margin-right: -7px;
    margin-top: 3px;
  }
}
</style>
