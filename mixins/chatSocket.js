export default {
  data() {
    return {
      chatSocket: undefined
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.chatSocket = this.$nuxtSocket({
        name: 'chat',
        path: '/chat',
        forceNew: true
      });
      this.$nextTick(() => {
        // this.chatSocket.on('connect', () => {
        //   this.chatSocket.emit('online', {
        //     id: this.$store.state.member_id,
        //     username: this.$store.state.data.memberName,
        //     avatar: this.$store.state.data.memberPhoto,
        //     token: this.$localstorage.get('token')
        //   });
        // });
        this.chatSocket.emit('online', {
          id: this.$store.state.member_id,
          username: this.$store.state.data.memberName,
          avatar: this.$store.state.data.memberPhoto,
          token: this.$localstorage.get('token')
        });
        this.chatSocket.on('getAllOnline', (val) => {
          this.$store.commit('messaging/setOnline', val.users);
        });
        this.chatSocket.on('memberAction', async (obj) => {
          if (obj.type === 'newMessage') {
            if (obj.recipient_id === this.$store.getters.member_id) {
              if (this.$store.getters.chat !== obj.id) {
                let p = this.$imgSrc('void-img.png');
                if (!this.$store.getters.unread.hasOwnProperty(obj.id)) {
                  if (!this.$isEmpty(obj.memberPhoto.value)) {
                    try {
                      const a = await this.$fetchImage(obj.memberPhoto.value);
                      p = this.$isEmpty(a) ? p : a;
                    } catch (e) {}
                  }
                  this.$store.commit('messaging/addUnread', {
                    [obj.id]: {
                      ids: [obj.message_id],
                      memberPhoto: {
                        value: p,
                        position: obj.memberPhoto.position
                      },
                      memberName: obj.memberName
                    }
                  });
                } else {
                  const ids = JSON.parse(
                    JSON.stringify(this.$store.getters.unread[obj.id].ids)
                  );
                  const ind = ids.findIndex((i) => i === obj.message_id);
                  if (ind === -1) {
                    ids.push(obj.message_id);
                    this.$store.commit('messaging/updateUnread', {
                      [obj.id]: {
                        ids
                      }
                    });
                  }
                }
                const ind = this.$store.getters.history.findIndex(
                  (a) => a.member_id === obj.id
                );
                if (ind === -1) {
                  if (!this.$isEmpty(obj.memberPhoto.value)) {
                    try {
                      const a = await this.$fetchImage(obj.memberPhoto.value);
                      p = this.$isEmpty(a) ? p : a;
                    } catch (e) {}
                  }
                  this.$store.commit('messaging/addHistory', {
                    message_id: obj.message_id,
                    member_id: obj.id,
                    memberPhoto: {
                      value: p,
                      position: obj.memberPhoto.position
                    },
                    memberName: obj.memberName,
                    created_at: new Date().toISOString(),
                    content: obj.message,
                    unread: 1
                  });
                } else {
                  const u = this.$store.getters.history[ind];
                  if (u.message_id !== obj.message_id) {
                    this.$store.commit('messaging/updateHistory', {
                      message_id: obj.message_id,
                      index: ind,
                      content: obj.message,
                      created_at: new Date().toISOString(),
                      unread: u.unread + 1
                    });
                  }
                }
              } else {
                const ind = this.chat.content.findIndex(
                  (a) => a.id === obj.message_id
                );
                const indH = this.$store.getters.history.findIndex(
                  (a) => a.member_id === obj.id
                );
                if (indH !== -1) {
                  this.$store.commit('messaging/updateHistory', {
                    message_id: obj.message_id,
                    index: indH,
                    content: obj.message,
                    created_at: new Date().toISOString()
                  });
                }
                if (ind === -1) {
                  const d = new Date();
                  this.$store.commit('messaging/addMessageToChat', {
                    id: obj.message_id,
                    member_from: {
                      id: obj.id
                    },
                    content: obj.message,
                    created_at: {
                      date: d.toISOString()
                    }
                  });
                  try {
                    await this.$io.markRead([obj.message_id]);
                  } catch (e) {
                    this.$errorHandle(e);
                  }
                }
              }
            }
          }
        });
      });
    });
  }
};
