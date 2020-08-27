<template>
  <section v-if="!mobile" class="d-flex messages">
    <div key="hello" class="contacts d-flex flex-column">
      <h1>мои сообщения</h1>
      <m-input
        v-model="select"
        placeholder="Поиск"
        border="transparent"
        input-style="background-color: white"
        :prepend="true"
        :result="result"
        @input="find"
      >
        <template #prepend>
          <img :src="$imgSrc('icons/search.svg')" />
        </template>
      </m-input>
      <div class="faces d-flex flex-column">
        <div class="single">
          <div class="contact-container d-flex flex-column">
            <div
              v-for="c of $store.getters.history"
              :key="c.id"
              class="contact d-flex pointer"
              @click="showDialogue($event, c.member_id)"
            >
              <div class="avatar">
                <div
                  class="img-holder"
                  :style="{
                    backgroundImage: `url(${c.memberPhoto.value})`,
                    backgroundSize: avatarSize(c.memberPhoto.position, 75)[2],
                    backgroundSize: avatarSize(c.memberPhoto.position, 75)[2],
                    backgroundPosition: `${
                      avatarSize(c.memberPhoto.position, 75)[0]
                    } ${avatarSize(c.memberPhoto.position, 75)[1]}`
                  }"
                ></div>
                <div
                  v-if="c.unread !== 0"
                  class="bubble d-flex align-center justify-center"
                >
                  <span>{{ c.unread }}</span>
                </div>
                <div v-if="isOnline(c.member_id)" class="online"></div>
              </div>
              <div class="bio d-flex flex-column">
                <span id="name">{{ c.memberName }}</span>
                <div class="chunck">{{ textChunck(c.content) }}</div>
                <span class="date">{{ date(c.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="group d-flex pointer" @click="activateGroupChat">
            <div class="choser d-flex align-center">
              <img :src="$imgSrc('icons/people.svg')" alt="" />
              <span>групповой чат</span>
            </div>
          </div> -->
      </div>
    </div>
    <div
      v-if="!$isEmpty($store.getters.chat)"
      key="goodbye"
      class="dialogues d-flex flex-column"
    >
      <Loading :state="loading" :absolute="true" :z-index="990"></Loading>
      <div class="head d-flex align-center">
        <div class="avatar d-flex">
          <div
            v-if="groupChat.current"
            class="img-holder"
            :style="{ backgroundImage: `url(${groupChat.avatar})` }"
          ></div>
          <div
            v-else
            class="img-holder"
            :style="{
              backgroundImage: `url(${chat.memberPhoto.value})`,
              backgroundSize: avatarSize(chat.memberPhoto.position, 75)[2],
              backgroundSize: avatarSize(chat.memberPhoto.position, 75)[2],
              backgroundPosition: `${
                avatarSize(chat.memberPhoto.position, 75)[0]
              } ${avatarSize(chat.memberPhoto.position, 75)[1]}`
            }"
          ></div>
        </div>
        <div class="bio d-flex flex-column justify-center">
          <div class="name d-flex align-center">
            <span id="name" ref="name">{{ chat.memberName }}</span>
            <div
              ref="editGroupName"
              class="change-name d-flex align-center d-opaq"
            >
              <m-input
                border="transparent"
                :input-value="groupChat.name"
                :flat="true"
                :input-style="groupChat.inputStyle"
                @input="inputGroupName"
              ></m-input
              ><img
                ref="confirmButton"
                class="manipulate pointer"
                :src="$imgSrc('icons/confirm.svg')"
                @click="saveGroupName"
              />
            </div>
            <img
              v-if="groupChat.current"
              ref="editButton"
              class="manipulate pointer"
              :src="$imgSrc('icons/edit.svg')"
              @click="editGroupName"
            />
          </div>
          <div v-if="isOnline(chat.member_id)" class="chunck">
            Онлайн
          </div>
          <div v-if="groupChat.current" class="group-chat d-flex flex-column">
            <transition-group
              v-if="groupChat.participants.length > 0"
              class="participants d-flex align-center"
              name="chips"
              mode="out-in"
              tag="div"
            >
              <div
                v-for="(p, i) of groupChat.participants"
                :key="p.title"
                class="participants-chip d-flex align-center"
              >
                {{ p.title }}
                <div v-if="p.online" class="online"></div>
                <img
                  :src="$imgSrc('icons/close.svg')"
                  class="pointer"
                  @click="removeParticipant(i)"
                />
              </div>
            </transition-group>
            <!-- <div
                ref="buttonAddParticipant"
                class="m-container"
                @click="showAddParticipant"
              >
                <img :src="$imgSrc('icons/add.svg')" alt="" />
                <span>добавить участников</span>
              </div>
              <m-input
                ref="addParticipant"
                v-model="participants"
                border="bottom"
                :autocomplete="true"
                :result="result"
                placeholder="Имя участника..."
                input-style="height:30px"
                class="d-opaq"
                @input="findParticipants"
              ></m-input> -->
          </div>
        </div>
      </div>
      <div
        ref="chatContainer"
        class="chat-container d-flex"
        @scroll="uploadEvent($event, 35)"
      >
        <div ref="chat" class="chat d-flex flex-column">
          <div class="uploading d-opaq">
            <img :src="$imgSrc('icons/loading.gif')" />
          </div>
          <div
            v-for="c of chat.content"
            :key="c.id"
            :class="{
              from: c.member_from.id !== $store.getters.member_id,
              to: c.member_from.id === $store.getters.member_id
            }"
            v-html="aContent(c)"
          >
            <span class="date">{{ date(c.created_at.date) }}</span>
          </div>
          <!-- <div class="from typing">
              <img :src="$imgSrc('icons/typing.svg')" />
            </div> -->
        </div>
      </div>
      <div class="type-area d-flex mt-auto">
        <textarea
          placeholder="Ваше сообщение"
          @keydown="sendIt($event, scroll)"
        ></textarea>
        <div class="action-area d-flex">
          <img
            class="pointer"
            :src="$imgSrc('icons/send.svg')"
            @click="sendMessage($event, scroll)"
          />
        </div>
      </div>
    </div>
  </section>
  <transition-group
    v-else
    tag="section"
    class="d-flex messages"
    :name="transition"
    mode="out-in"
  >
    <div v-if="!showDialogues" key="hello" class="contacts d-flex flex-column">
      <h1>мои сообщения</h1>
      <m-input
        v-model="select"
        placeholder="Поиск"
        border="transparent"
        input-style="background-color: white"
        :prepend="true"
        :result="result"
        @input="find"
      >
        <template #prepend>
          <img :src="$imgSrc('icons/search.svg')" />
        </template>
      </m-input>
      <div class="faces d-flex flex-column">
        <div class="single">
          <div class="contact-container d-flex flex-column">
            <div
              v-for="c of $store.getters.history"
              :key="c.id"
              class="contact d-flex pointer"
              @click="showDialogue($event, c.member_id)"
            >
              <div class="avatar">
                <div
                  class="img-holder"
                  :style="{
                    backgroundImage: `url(${c.memberPhoto.value})`,
                    backgroundSize: avatarSize(c.memberPhoto.position, 75)[2],
                    backgroundSize: avatarSize(c.memberPhoto.position, 75)[2],
                    backgroundPosition: `${
                      avatarSize(c.memberPhoto.position, 75)[0]
                    } ${avatarSize(c.memberPhoto.position, 75)[1]}`
                  }"
                ></div>
                <div
                  v-if="c.unread !== 0"
                  class="bubble d-flex align-center justify-center"
                >
                  <span>{{ c.unread }}</span>
                </div>
                <div v-if="isOnline(c.member_id)" class="online"></div>
              </div>
              <div class="bio d-flex flex-column">
                <span id="name">{{ c.memberName }}</span>
                <div class="chunck">{{ textChunck(c.content) }}</div>
                <span class="date">{{ date(c.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="group d-flex pointer" @click="activateGroupChat">
            <div class="choser d-flex align-center">
              <img :src="$imgSrc('icons/people.svg')" alt="" />
              <span>групповой чат</span>
            </div>
          </div> -->
      </div>
    </div>
    <div
      v-if="showDialogues && !$isEmpty($store.getters.chat)"
      key="goodbye"
      class="dialogues d-flex flex-column"
    >
      <Loading :state="loading" :absolute="true" :z-index="990"></Loading>
      <div class="ref d-flex justify-center align-center">
        <img :src="$imgSrc('icons/back.svg')" @click="hideDialogues" />
        <h1>мои сообщения</h1>
      </div>
      <div class="head d-flex align-center">
        <div class="avatar d-flex">
          <div
            v-if="groupChat.current"
            class="img-holder"
            :style="{ backgroundImage: `url(${groupChat.avatar})` }"
          ></div>
          <div
            v-else
            class="img-holder"
            :style="{
              backgroundImage: `url(${chat.memberPhoto.value})`,
              backgroundSize: avatarSize(chat.memberPhoto.position, 75)[2],
              backgroundSize: avatarSize(chat.memberPhoto.position, 75)[2],
              backgroundPosition: `${
                avatarSize(chat.memberPhoto.position, 75)[0]
              } ${avatarSize(chat.memberPhoto.position, 75)[1]}`
            }"
          ></div>
        </div>
        <div class="bio d-flex flex-column justify-center">
          <div class="name d-flex align-center">
            <span id="name" ref="name">{{ chat.memberName }}</span>
            <div
              ref="editGroupName"
              class="change-name d-flex align-center d-opaq"
            >
              <m-input
                border="transparent"
                :input-value="groupChat.name"
                :flat="true"
                :input-style="groupChat.inputStyle"
                @input="inputGroupName"
              ></m-input
              ><img
                ref="confirmButton"
                class="manipulate pointer"
                :src="$imgSrc('icons/confirm.svg')"
                @click="saveGroupName"
              />
            </div>
            <img
              v-if="groupChat.current"
              ref="editButton"
              class="manipulate pointer"
              :src="$imgSrc('icons/edit.svg')"
              @click="editGroupName"
            />
          </div>
          <div v-if="isOnline(chat.member_id)" class="chunck">
            Онлайн
          </div>
          <div v-if="groupChat.current" class="group-chat d-flex flex-column">
            <transition-group
              v-if="groupChat.participants.length > 0"
              class="participants d-flex align-center"
              name="chips"
              mode="out-in"
              tag="div"
            >
              <div
                v-for="(p, i) of groupChat.participants"
                :key="p.title"
                class="participants-chip d-flex align-center"
              >
                {{ p.title }}
                <div v-if="p.online" class="online"></div>
                <img
                  :src="$imgSrc('icons/close.svg')"
                  class="pointer"
                  @click="removeParticipant(i)"
                />
              </div>
            </transition-group>
            <!-- <div
                ref="buttonAddParticipant"
                class="m-container"
                @click="showAddParticipant"
              >
                <img :src="$imgSrc('icons/add.svg')" alt="" />
                <span>добавить участников</span>
              </div>
              <m-input
                ref="addParticipant"
                v-model="participants"
                border="bottom"
                :autocomplete="true"
                :result="result"
                placeholder="Имя участника..."
                input-style="height:30px"
                class="d-opaq"
                @input="findParticipants"
              ></m-input> -->
          </div>
        </div>
      </div>
      <div ref="chatContainer" class="chat-container d-flex">
        <div ref="chat" class="chat d-flex flex-column">
          <div
            v-for="c of chat.content"
            :key="c.id"
            :class="{
              from: c.member_from.id !== $store.getters.member_id,
              to: c.member_from.id === $store.getters.member_id
            }"
            v-html="aContent(c)"
          ></div>
          <!-- <div class="from typing">
              <img :src="$imgSrc('icons/typing.svg')" />
            </div> -->
        </div>
      </div>
      <div class="type-area d-flex mt-auto">
        <textarea
          placeholder="Ваше сообщение"
          @keydown="sendIt($event, scroll)"
        ></textarea>
        <div class="action-area d-flex">
          <img
            class="pointer"
            :src="$imgSrc('icons/send.svg')"
            @click="sendMessage($event, scroll)"
          />
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import { mapState } from 'vuex';
import redirectRole from '~/mixins/redirectRole.js';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import messaging from '~/mixins/messaging.js';
import Loading from '~/components/Loading.vue';

export default {
  components: {
    Loading
  },
  mixins: [redirectRole, hideMobileMenu, messaging],
  async asyncData({ app, store }) {
    store.commit('messaging/clearChat');
    if (!store.getters.member_id) {
      const r = await app.$user.getUser(app.$localstorage.get('email'));
      store.commit('setState', {
        member_id: r.member.id.value
      });
    }
    try {
      const i = await app.$io.getHistory();
      const s = [];
      if (!app.$isEmpty(i.items)) {
        for (const a of i.items) {
          const self = a.member_from.id === store.getters.member_id;
          const from = self ? a.member_to : a.member_from;
          const q = {
            id: a.id,
            member_id: from.id,
            memberName: from.memberName,
            content: a.content,
            created_at: a.created_at.date
          };
          let unread = 0;
          try {
            const u = await app.$io.getHistory(from.id);
            if (!app.$isEmpty(u.items)) {
              const y = u.items.filter(
                (a) => a.member_from.id !== store.getters.member_id
              );
              unread = y.length;
            }
          } catch (e) {
            console.log(e);
          }
          q.unread = unread;
          let ava = app.$imgSrc('void-img.png');
          try {
            const s = await app.$fetchImage(from.memberPhoto.value);
            ava = app.$isEmpty(s) ? ava : s;
          } catch (e) {}
          q.memberPhoto = {
            value: ava,
            position: from.memberPhoto.position
          };
          s.push(q);
        }
        s.sort((a, b) => {
          if (a.unread !== 0 && b.unread === 0) {
            return -1;
          } else if (a.unread === 0 && b.unread !== 0) {
            return 1;
          } else if (
            (a.unread === 0 && b.unread === 0) ||
            (a.unread !== 0 && b.unread !== 0)
          ) {
            if (new Date(a.created_at) > new Date(b.created_at)) {
              return -1;
            } else if (new Date(a.created_at) < new Date(b.created_at)) {
              return 1;
            } else {
              return 0;
            }
          }
        });
      }
      store.commit('messaging/setHistory', s);
    } catch (e) {
      app.$errorHandle(e);
    }
    return {};
  },
  data() {
    return {
      transition: 'left',
      loading: true,
      showDialogues: false,
      select: undefined,
      result: [],
      groupChat: {
        defaultName: 'Групповой чат',
        name: undefined,
        current: false,
        avatar: this.$imgSrc('group-img.png'),
        participants: [],
        inputStyle: 'padding-left:0'
      },
      currentChat: {
        title: undefined
      }
    };
  },
  computed: {
    ...mapState(['mobile']),
    ...mapState('messaging', ['chat']),
    maxWidth() {
      const w = window.innerWidth;
      if (w > 1264 && w < 1905) {
        return w - (205 + 500 + 80) + 'px';
      } else if (w > 1904) {
        return w - (205 + 700 + 80) + 'px';
      }
      return '100vw';
    },
    chatName() {
      if (this.groupChat.current) {
        return this.groupChat.name;
      } else {
        return this.currentChat.title;
      }
    },
    participants: {
      get() {
        return this.groupChat.participants[0] || {};
      },
      set(v) {
        this.groupChat.participants.push(v);
        this.result.splice(
          this.result.findIndex((a) => a.title === v.title),
          1
        );
      }
    }
  },
  watch: {
    showDialogues(newV) {
      if (newV) {
        if (!this.mobile) {
          const h = document.querySelector('html, body');
          const y = document.querySelector('.dialogues');
          const w = window.innerHeight;
          y.style.height = h.scrollTop - 80 + w - y.offsetTop + 'px';
          this.scroll();
        } else {
          setTimeout(() => {
            this.scroll();
            this.loading = false;
          }, 2000);
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.$el.addEventListener(
      //   'click',
      //   (e) => {
      //     if (
      //       this.$isEmpty(e.target.closest('.m-input')) &&
      //       this.$isEmpty(e.target.closest('.m-container')) &&
      //       this.$isEmpty(e.target.closest('.participants'))
      //     ) {
      //       this.hideAddParticipant();
      //     }
      //   },
      //   true
      // );
      this.$nuxt.$loading.finish();
    });
  },
  methods: {
    onScroll(e) {
      const h = document.querySelector('html, body');
      try {
        const y = document.querySelector('.dialogues');
        const w = window.innerHeight;
        y.style.height = h.scrollTop - 80 + w - y.offsetTop + 'px';
      } catch (e) {}
    },
    textChunck(text) {
      if (this.mobile) {
        return text.length > 56 ? `${text.substr(0, 53)}...` : text;
      } else {
        return text.length > 80 ? `${text.substr(0, 77)}...` : text;
      }
    },
    find(e) {
      const v = e.target.value;
      if (v.length > 0) {
        [...this.result] = this.people.filter((a) =>
          a.title.toLowerCase().includes(v.toLowerCase())
        );
      } else {
        [...this.result] = [];
      }
    },
    scroll() {
      const cc = document.querySelector('.chat-container');
      const c = cc.children[0];
      cc.scrollTo({
        top: c.offsetHeight,
        behavior: 'smooth'
      });
    },

    async showDialogue(e, index = undefined) {
      document.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
      this.$nextTick(() => {
        if (!this.mobile) {
          document.addEventListener('scroll', this.onScroll);
          window.addEventListener('resize', this.onScroll);
        }
      });
      this.loading = true;
      const t = e.target.closest('.contact');
      for (const y of this.$el.querySelectorAll('.shown')) {
        y.classList.remove('shown');
      }
      t.classList.add('shown');
      try {
        await this.startChat(null, index, true);
        if (!this.mobile) {
          document.querySelector('.chat').style.maxWidth = this.maxWidth;
        }
        if (index !== undefined) {
          this.groupChat.current = false;
        }
        if (this.mobile) {
          this.transition = 'left';
          this.$nextTick(() => {
            this.showDialogues = true;
          });
        } else if (!this.mobile) {
          const m = t.closest('.contacts');
          if (!m.classList.contains('activated')) {
            m.classList.add('activated');
          }
          this.$el
            .querySelector('.chat-container')
            .scrollTo({ top: this.$el.querySelector('.chat').offsetHeight });
          this.$nextTick(() => {
            this.scroll();
          });
          this.loading = false;
        }
        this.$nextTick(() => {
          const addd =
            document.querySelector('.m-background').offsetHeight +
            (this.mobile ? 165 : 0);
          this.$scrollTop(addd);
        });
      } catch (e) {
        console.log(e);
      }
    },
    hideDialogues() {
      this.transition = 'right';
      for (const y of this.$el.querySelectorAll('.shown')) {
        y.classList.remove('shown');
      }
      this.$nextTick(() => {
        this.showDialogues = false;
        this.$store.commit(
          'messaging/deleteFromUnread',
          this.$store.getters.chat
        );
        this.$store.commit('messaging/clearChat');
      });
    },
    activateGroupChat() {
      this.groupChat.name = this.groupChat.defaultName;
      this.groupChat.current = true;
      this.$nextTick(() => {
        this.showDialogue();
      });
    },
    editGroupName(e) {
      this.groupChat.inputStyle = `width:${(
        this.groupChat.name.length * 8 +
        8
      ).toFixed(2)}px; padding-left:0`;
      this.$refs.name.classList.add('d-opaq');
      this.$refs.editButton.classList.add('d-opaq');
      this.$refs.editGroupName.classList.remove('d-opaq');
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.editGroupName.querySelector('input').focus();
          this.$refs.editGroupName.querySelector('input').select();
        }, 100);
      });
    },
    inputGroupName(e) {
      this.groupChat.name = e.target.value;
      this.groupChat.inputStyle = `width:${(
        this.groupChat.name.length * 8 +
        8
      ).toFixed(2)}px; padding-left:0`;
    },
    saveGroupName() {
      this.$refs.editGroupName.classList.add('d-opaq');
      this.$refs.name.classList.remove('d-opaq');
      this.$refs.editButton.classList.remove('d-opaq');
    },
    // findParticipants(e) {
    //   const t = e.target;
    //   const v = t.value;
    //   if (v.length > 2) {
    //     this.$toggle(t.closest('.m-input').querySelector('.loading_img'));
    //     const f = this.people.filter((a) =>
    //       a.title.toLowerCase().includes(v.toLowerCase())
    //     );
    //     const y = [];
    //     for (const i of f) {
    //       if (
    //         this.$isEmpty(
    //           this.groupChat.participants.find(
    //             (a) => a !== undefined && a.title === i.title
    //           )
    //         )
    //       ) {
    //         y.push(i);
    //       }
    //     }
    //     [...this.result] = y;
    //   } else {
    //     [...this.result] = [];
    //   }
    // },
    // showAddParticipant() {
    //   this.$refs.buttonAddParticipant.classList.add('d-opaq');
    //   this.$refs.addParticipant.$el.querySelector('input').value = '';
    //   this.$refs.addParticipant.$el.classList.remove('d-opaq');
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       this.$refs.addParticipant.$el.querySelector('input').focus();
    //     }, 100);
    //   });
    // },
    // hideAddParticipant() {
    //   try {
    //     [...this.result] = [];
    //     this.$refs.addParticipant.$el.classList.add('d-opaq');
    //     this.$refs.buttonAddParticipant.classList.remove('d-opaq');
    //   } catch {}
    // },
    removeParticipant(index) {
      this.groupChat.participants.splice(index, 1);
    }
  },
  beforeRouteLeave(to, from, next) {
    try {
      this.$store.commit(
        'messaging/deleteFromUnread',
        this.$store.getters.chat
      );
      this.$store.commit('messaging/clearChat');
      this.$store.commit('messaging/clearHistory');
    } catch (e) {}
    next();
  },
  head() {
    return {
      title: '| Сообщения'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/messages.scss';
</style>

<style lang="scss">
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.chat {
  .date {
    font-size: rem(10);
    color: $dark-shade;
    margin-left: auto;
    margin-right: -7px;
    margin-top: 3px;
    @include extra() {
      font-size: rem(14);
    }
  }
}
</style>
