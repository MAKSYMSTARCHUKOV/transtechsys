export const state = () => ({
  verified: false,
  editImage: '',
  imageCollection: '',
  showEditor: false,
  defaultImage: '/images/icons/info.svg',
  defaultButtons: ['да', 'нет'],
  showUp: false,
  dialog: {
    image: undefined,
    text: undefined,
    action: false,
    show: false,
    ok: false,
    close: false,
    buttons: [],
    extreme: false
  },
  mDraft: {
    show: false,
    draft: {
      title: '',
      value: ''
    },
    template: {}
  }
});

export const getters = {};

export const mutations = {
  setState(state, payload) {
    const k = Object.keys(payload);
    for (const i of k) {
      const f = payload[i];
      if (typeof f === 'object') {
        if (Array.isArray(f)) {
          [...state[i]] = JSON.parse(JSON.stringify(f));
        } else {
          ({ ...state[i] } = JSON.parse(JSON.stringify(f)));
        }
      } else {
        state[i] = f;
      }
    }
  },
  showDialog(state, payload) {
    for (const i in payload) {
      state.dialog[i] = payload[i];
    }
    if (!payload.image) {
      state.dialog.image = state.defaultImage;
    }
    if (!payload.buttons) {
      [...state.dialog.buttons] = state.defaultButtons;
    }
    state.dialog.show = true;
  },

  showDraft(state, payload) {
    ({ ...state.mDraft.draft } = payload);
    state.mDraft.show = true;
  },

  setTemplate(state, payload) {
    ({ ...state.mDraft.template } = payload);
  },

  toggleUp(state, flag) {
    state.showUp = flag;
  },

  actionDialog(state, flag) {
    state.dialog.action = flag;
  },

  closeDialog(state, flag) {
    state.dialog.close = flag;
  },

  hideDialog(state) {
    state.dialog.show = false;
    state.dialog.action = false;
    state.dialog.close = false;
    state.dialog.extreme = false;
    state.dialog.ok = false;
  },

  hideDraft(state) {
    state.mDraft.show = false;
    ({ ...state.mDraft.draft } = {
      title: '',
      value: ''
    });
    ({ ...state.mDraft.template } = {});
  }
};

export const actions = {};
