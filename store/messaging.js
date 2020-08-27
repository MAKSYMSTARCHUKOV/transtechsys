function makePages(total, limit) {
  const div = total / limit;
  const abs = Math.floor(div);
  return abs + (div > abs ? 1 : 0);
}

function sortHistory(arr) {
  arr.sort((a, b) => {
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

export const state = () => ({
  online: [],
  unread: {},
  unreadLength: 0,
  messagesLength: 0,
  history: [],
  chat: {
    member_id: undefined,
    memberPhoto: {},
    memberName: undefined,
    content: [],
    page: 1,
    pages: 1,
    limit: 100,
    total: 0
  }
});

export const getters = {};

export const mutations = {
  setOnline(state, payload) {
    [...state.online] = payload;
  },
  setUnread(state, payload) {
    ({ ...state.unread } = payload);
    state.unreadLength = Object.keys(payload).length;
  },
  updateUnread(state, payload) {
    const id = Object.keys(payload)[0];
    const obj = payload[id];
    for (const i in obj) {
      const v = obj[i];
      if (typeof v !== 'object') {
        state.unread[id][i] = v;
      } else if (typeof v === 'object') {
        if (v !== undefined && v !== null) {
          if (Array.isArray(v)) {
            [...state.unread[id][i]] = JSON.parse(JSON.stringify(v));
          } else {
            ({ ...state.unread[id][i] } = JSON.parse(JSON.stringify(v)));
          }
        } else {
          state.unread[id][i] = v;
        }
        ++state.unreadLength;
      }
    }
  },
  addUnread(state, payload) {
    for (const i in payload) {
      ({ ...state.unread[i] } = JSON.parse(JSON.stringify(payload[i])));
      ++state.unreadLength;
    }
  },
  deleteFromUnread(state, payload) {
    delete state.unread[payload];
    --state.unreadLength;
  },
  clearChat(state) {
    state.chat.member_id = undefined;
    state.chat.memberName = undefined;
    ({ ...state.chat.memberPhoto } = {});
    [...state.chat.content] = [];
    state.chat.page = 1;
    state.chat.pages = 1;
    state.chat.total = 0;
    state.messagesLength = 0;
  },
  startChat(state, payload) {
    state.chat.memberName = payload.memberName;
    ({ ...state.chat.memberPhoto } = JSON.parse(
      JSON.stringify(payload.memberPhoto)
    ));
    [...state.chat.content] = JSON.parse(JSON.stringify(payload.content));
    state.chat.member_id = payload.member_id;
    state.chat.pages = makePages(payload.total, 100);
    state.chat.total = payload.total;
  },
  addMessageToChat(state, payload) {
    const c = state.chat.content;
    c.push(payload);
    if (c.length > 100) {
      c.splice(0, 1);
    }
    state.chat.pages = makePages(++state.chat.total, 100);
    ++state.messagesLength;
  },

  setHistory(state, payload) {
    [...state.history] = payload;
  },

  addHistory(state, payload) {
    state.history.push(payload);
    ++state.unreadLength;
    sortHistory(state.history);
  },

  updateHistory(state, payload) {
    state.history[payload.index].content = payload.content;
    state.history[payload.index].created_at = payload.created_at;
    state.history[payload.index].message_id = payload.message_id;
    state.history[payload.index].unread = payload.unread || 0;
    ++state.unreadLength;
    sortHistory(state.history);
  },

  updateHistoryUnread(state, payload) {
    state.history[payload.index].unread = payload.unread;
    ++state.unreadLength;
    sortHistory(state.history);
  },

  clearHistory(state) {
    [...state.history] = [];
  },

  uploadChat(state, payload) {
    ++state.chat.page;
    state.chat.content = state.chat.content.unshift(payload.content);
  }
};

export const actions = {};
