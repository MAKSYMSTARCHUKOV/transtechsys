export const state = () => ({
  mobile: true,
  tab: false,
  showMobile: false,
  fullScreen: true,
  error: false,
  errorMessage: '',
  message: '',
  screen: false,
  logged: undefined,
  changes: false,
  member_id: undefined,
  company_id: undefined,
  phone_number: '+38 (098) 595 73 37',
  a_phone_number: '+380985957337',
  email: 'transtechsystem.info@gmail.com',

  roleMenu: [
    {
      name: 'кабинет',
      id: 'dashboard'
    },
    {
      name: 'профиль',
      id: 'profile',
      path: 'profile'
    },
    {
      name: 'личная инфо',
      id: 'info',
      path: 'personal'
    },
    {
      name: 'сотрудники',
      id: 'employee',
      path: 'employees'
    },
    {
      name: 'автопарк',
      id: 'truck',
      path: 'car-park',
      for: ['ROLE_COMPANY_CARRIER', 'ROLE_COMPANY_EXPEDITOR']
    },
    {
      name: 'задачи',
      id: 'tasks',
      path: 'tasks'
    },
    {
      name: 'сообщения',
      id: 'message',
      path: 'messages'
    },
    {
      name: 'партнеры',
      id: 'partners',
      path: 'partners'
    },
    {
      name: 'поиск груза',
      id: 'find',
      path: 'find-cargo',
      for: ['ROLE_COMPANY_CARRIER']
    },
    {
      name: 'поиск авто',
      id: 'find',
      path: 'find-car',
      for: ['ROLE_COMPANY_SENDER']
    },
    {
      name: 'поиск',
      id: 'find',
      for: ['ROLE_COMPANY_EXPEDITOR'],
      sub: [
        {
          name: 'Авто',
          id: 'find',
          ico: 'auto',
          path: 'find-car',
          for: ['ROLE_COMPANY_EXPEDITOR', 'ROLE_COMPANY_SENDER']
        },
        {
          name: 'Груз',
          id: 'find',
          ico: 'cargo',
          path: 'find-cargo',
          for: ['ROLE_COMPANY_EXPEDITOR', 'ROLE_COMPANY_CARRIER']
        }
      ]
    },
    {
      name: 'добавить груз',
      id: 'add',
      path: 'add-cargo',
      for: ['ROLE_COMPANY_SENDER']
    },
    {
      name: 'добавить авто',
      id: 'add',
      path: 'add-car',
      for: ['ROLE_COMPANY_CARRIER']
    },
    {
      name: 'добавить',
      id: 'add',
      for: ['ROLE_COMPANY_EXPEDITOR'],
      sub: [
        {
          name: 'Авто',
          id: 'add',
          ico: 'auto',
          path: 'add-car',
          for: ['ROLE_COMPANY_EXPEDITOR', 'ROLE_COMPANY_CARRIER']
        },
        {
          name: 'Груз',
          id: 'add',
          ico: 'cargo',
          path: 'add-cargo',
          for: ['ROLE_COMPANY_EXPEDITOR', 'ROLE_COMPANY_SENDER']
        }
      ]
    },
    {
      name: 'шаблоны',
      id: 'templates',
      path: 'drafts'
    },
    {
      name: 'заявки',
      id: 'request',
      path: 'requests'
    },
    {
      name: 'документы',
      id: 'documents',
      path: 'documents'
    },
    {
      name: 'статистика',
      id: 'statistics',
      path: 'statistics'
    },
    {
      name: 'расчет',
      id: 'calculate',
      path: 'calculate'
    },
    {
      name: 'отзывы',
      id: 'feedback',
      path: 'feedback'
    },
    {
      name: 'тарифы',
      id: 'cost',
      path: 'rates'
    }
  ],
  topMenu: [
    {
      name: 'блог',
      path: '/blog'
    },
    {
      name: 'тарифы',
      path: '/rates'
    },
    {
      name: 'о нас',
      path: '/about-us'
    },
    {
      name: 'каталог',
      path: '/catalog'
    },
    {
      name: 'контакты',
      path: '/find-us'
    }
  ],
  roleTopMenuFirst: [
    {
      name: 'блог',
      path: '/blog'
    },
    // {
    //   name: 'добавить заявку',
    //   path: '/cabinet/add-cargo'
    // },
    {
      name: 'уведомления',
      path: '/cabinet/messages'
    }
  ],
  roleTopMenu: [
    {
      name: 'курс валют',
      path: '/exchange-rates'
    },
    {
      name: 'цены на гсм',
      path: '/prices'
    }
  ],
  footerMenu: [
    {
      name: 'погран переходы',
      path: '/boundries'
    },
    {
      name: 'разрешения',
      path: '/permits'
    },
    {
      name: 'тендеры',
      path: '/tender'
    },
    {
      name: 'партнеры',
      path: '/partners'
    },
    {
      name: 'api',
      path: '/_api'
    }
  ],
  month: [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь'
  ],
  monthForDate: [
    '',
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ],

  empty: 'Обязательно заполните поле',
  overlay: {
    mode: 'signin',
    visible: false,
    obj: undefined
  },
  roles: [
    {
      title: 'грузовладелец',
      value: 'ROLE_COMPANY_SENDER'
    },
    {
      title: 'экспедитор',
      value: 'ROLE_COMPANY_EXPEDITOR'
    },
    {
      title: 'грузоперевозчик',
      value: 'ROLE_COMPANY_CARRIER'
    }
  ],
  employeeRoles: [
    { title: 'менеджер', value: 'ROLE_USER_MANAGER' },
    { title: 'логист', value: 'ROLE_USER_LOGIST' },
    { title: 'диспетчер', value: 'ROLE_USER_DISPATCHER' },
    { title: 'водитель', value: 'ROLE_USER_DRIVER' },
    { title: 'экспедитор', value: 'ROLE_USER_EXPEDITOR' }
  ],
  carPark: [
    { title: 'Тягач', value: 'tractor' },
    { title: 'Полуприцеп', value: 'semitrailer' },
    { title: 'Грузовик', value: 'truck' },
    { title: 'Прицеп', value: 'trailer' }
  ],
  readySelect: [
    {
      title: 'Только сегодня',
      value: 1
    },
    {
      title: 'Сегодня-завтра',
      value: 2
    }
  ],
  alwaysSelect: [
    {
      title: 'Постоянно',
      value: 1
    },
    {
      title: 'По рабочим дням',
      value: 2
    },
    {
      title: 'По выходным дням',
      value: 3
    }
  ],
  rateTabs: [
    {
      title: 'Все лицензии',
      value: 'all',
      options: [
        {
          name: 'carrier',
          title: 'перевозчик',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все грузы',
            'Добавить автопарк',
            'Добавить авто (заявку на биржу)',
            'Уведомление о грузах'
          ]
        },
        {
          name: 'expeditor',
          title: 'экспедитор',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все грузы',
            'Видит все авто',
            'Добавить груз/авто (заявку на биржу)',
            'Уведомление о грузах/авто'
          ]
        },
        {
          name: 'sender',
          title: 'грузоотправитель',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все авто',
            'Добавить груз (заявку на биржу)',
            'Уведомление о авто'
          ]
        },
        {
          name: 'carpark',
          title: 'автопарк',
          value: 2000,
          currency: 'uah',
          profit: [
            'Добавить автомобили (тягач, полуприцеп, грузовик, прицеп) в свою фирму'
          ]
        }
      ]
    },
    {
      title: 'Перевозчикам',
      value: 'carrier',
      options: [
        {
          name: 'carrier',
          title: 'перевозчик',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все грузы',
            'Добавить автопарк',
            'Добавить авто (заявку на биржу)',
            'Уведомление о грузах'
          ]
        },
        {
          name: 'expeditor',
          title: 'экспедитор',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все грузы',
            'Видит все авто',
            'Добавить груз/авто (заявку на биржу)',
            'Уведомление о грузах/авто'
          ]
        },
        {
          name: 'sender',
          title: 'грузоотправитель',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все авто',
            'Добавить груз (заявку на биржу)',
            'Уведомление о авто'
          ]
        },
        {
          name: 'carpark',
          title: 'автопарк',
          value: 2000,
          currency: 'uah',
          profit: [
            'Добавить автомобили (тягач, полуприцеп, грузовик, прицеп) в свою фирму'
          ]
        }
      ]
    },
    {
      title: 'Грузоотправителям',
      value: 'sender',
      options: [
        {
          name: 'carrier',
          title: 'перевозчик',
          value: 2000,
          currency: 'uah',
          profit: [
            'Видит все грузы',
            'Добавить автопарк',
            'Добавить авто (заявку на биржу)',
            'Уведомление о грузах'
          ]
        },
        {
          name: 'carpark',
          title: 'автопарк',
          value: 2000,
          currency: 'uah',
          profit: [
            'Добавить автомобили (тягач, полуприцеп, грузовик, прицеп) в свою фирму'
          ]
        }
      ]
    },
    {
      title: 'Экспедиторам',
      value: 'expeditor',
      options: [
        // {
        //   name: 'carrier',
        //   title: 'перевозчик',
        //   value: 2000,
        //   currency: 'uah',
        //   profit: [
        //     'Видит все грузы',
        //     'Добавить автопарк',
        //     'Добавить авто (заявку на биржу)',
        //     'Уведомление о грузах'
        //   ]
        // },
        // {
        //   name: 'expeditor',
        //   title: 'экспедитор',
        //   value: 2000,
        //   currency: 'uah',
        //   profit: [
        //     'Видит все грузы',
        //     'Видит все авто',
        //     'Добавить груз/авто (заявку на биржу)',
        //     'Уведомление о грузах/авто'
        //   ]
        // },
        // {
        //   name: 'sender',
        //   title: 'грузоотправитель',
        //   value: 2000,
        //   currency: 'uah',
        //   profit: [
        //     'Видит все авто',
        //     'Добавить груз (заявку на биржу)',
        //     'Уведомление о авто'
        //   ]
        // },
        // {
        //   name: 'carpark',
        //   title: 'автопарк',
        //   value: 2000,
        //   currency: 'uah',
        //   profit: [
        //     'Добавить автомобили (тягач, полуприцеп, грузовик, прицеп) в свою фирму'
        //   ]
        // }
      ]
    }
  ],
  data: {}
});

export const mutations = {
  setMessage(state, str) {
    state.message = str;
  },
  setMobile(state, flag) {
    state.mobile = flag;
  },
  setError(state, payload) {
    state.errorMessage = payload[1];
    state.error = payload[0];
  },
  setData(state, payload) {
    ({ ...state.data } = payload);
    state.data.companyName =
      state.data.companyName === 'dummy' ? '' : state.data.companyName;
  },
  setTab(state, flag) {
    state.tab = flag;
  },
  toggleMobile(state) {
    state.showMobile = !state.showMobile;
  },
  setShowMobile(state, flag) {
    state.showMobile = flag;
  },
  setFullScreen(state, flag) {
    state.fullScreen = flag;
  },
  setOverlayVisible(state, flag) {
    state.overlay.visible = flag;
    if (!flag) {
      state.overlay.obj = undefined;
    }
  },
  setOverlayMode(state, mode) {
    state.overlay.mode = mode;
  },
  setOverlayObject(state, obj) {
    ({ ...state.overlay.obj } = obj);
  },
  setPhoneId(state, id) {
    state.data.companyPhones[state.data.companyPhones.length - 1].id = {
      value: id
    };
  },
  setMemberPhoneId(state, id) {
    state.data.memberPhones[state.data.memberPhones.length - 1].id = {
      value: id
    };
  },
  setCompanyMessenger(state, payload) {
    state.data.companyPhones[payload.index].messengerSupports[
      payload.messenger
    ] = payload.state;
  },
  removeCompanyPhone(state, id) {
    state.data.companyPhones.splice(id, 1);
  },
  setMemberMessenger(state, payload) {
    state.data.memberPhones[payload.index].messengerSupports[
      payload.messenger
    ] = payload.state;
  },
  removeMemberPhone(state, id) {
    state.data.memberPhones.splice(id, 1);
  },
  removeCompanyDocument(state, id) {
    state.data.companyDocuments.splice(id, 1);
  },
  addCompanyPhone(state, number) {
    state.data.companyPhones.push({
      value: {
        default: number
      },
      messengerSupports: {
        viber: false,
        whatsapp: false,
        telegram: false
      }
    });
  },
  addMemberPhone(state, number) {
    state.data.memberPhones.push({
      value: {
        default: number
      },
      messengerSupports: {
        viber: false,
        whatsapp: false,
        telegram: false
      }
    });
  },
  addCompanyDocument(state, payload) {
    state.data.companyDocuments.push({
      id: {
        value: payload.id
      },
      value: {
        default: payload.value
      },
      name: {
        default: payload.name
      }
    });
  },
  setCompanyPhone(state, payload) {
    state.data.companyPhones[payload.id].value.default = payload.value;
  },
  setMemberPhone(state, payload) {
    state.data.memberPhones[payload.id].value.default = payload.value;
  },
  cleanCompanyPhone(state, index) {
    state.data.companyPhones[index].value.default = '';
    delete state.data.companyPhones[index].id;
    for (const k in state.data.companyPhones[index].messengerSupports) {
      state.data.companyPhones[index].messengerSupports[k] = false;
    }
  },
  cleanMemberPhone(state, index) {
    state.data.memberPhones[index].value.default = '';
    delete state.data.memberPhones[index].id;
    for (const k in state.data.memberPhones[index].messengerSupports) {
      state.data.memberPhones[index].messengerSupports[k] = false;
    }
  },
  setField(state, payload) {
    let f = state.data[payload.field];
    if (typeof f === 'object') {
      if (Array.isArray(f)) {
        [...f] = JSON.parse(JSON.stringify(payload.value));
      } else {
        ({ ...f } = JSON.parse(JSON.stringify(payload.value)));
      }
    } else {
      state.data[payload.field] = payload.value;
    }
  },
  setImage(state, payload) {
    state.data[Object.keys(payload)[0]].value =
      payload[Object.keys(payload)[0]];
  },
  setImagePosition(state, payload) {
    [...state.data[Object.keys(payload)[0]].position] = JSON.parse(
      JSON.stringify(payload[Object.keys(payload)[0]])
    );
  },
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
  showMessage(state, mes) {
    if (mes) {
      state.message = mes;
    }
    state.changes = true;
  },
  setScreen(state, flag) {
    state.screen = flag;
  }
};

export const actions = {};

export const getters = {
  changes: (state) => state.changes,
  error: (state) => state.error,
  logged: (state) => state.logged,
  member_id: (state) => state.member_id,
  company_id: (state) => state.company_id,
  phone_number: (state) => state.phone_number,
  a_phone_number: (state) => state.a_phone_number,
  email: (state) => state.email,
  mobile: (state) => state.mobile,
  screen: (state) => state.screen,
  online: (state, getters, rootState) => rootState.messaging.online,
  chat: (state, getters, rootState) => rootState.messaging.chat.member_id,
  history: (state, getters, rootState) => rootState.messaging.history,
  car: (state, getters, rootState) => rootState.search.car,
  cargo: (state, getters, rootState) => rootState.search.cargo,
  found: (state, getters, rootState) => rootState.search.found,
  unread: (state, getters, rootState) => rootState.messaging.unread,
  unreadLength: (state, getters, rootState) => rootState.messaging.unreadLength,
  messagesLength: (state, getters, rootState) =>
    rootState.messaging.messagesLength,
  showEditor: (state, getters, rootState) => rootState.profile.showEditor,
  showEditorLogo: (state, getters, rootState) =>
    rootState.profile.showEditorLogo,
  overlay: (state) => state.overlay.visible,
  overlayObj: (state) => state.overlay.obj,
  getRole: (state) =>
    state.roles.filter((r) => r.value === state.data.companyRole)[0],
  getData: (state) => state.data,
  dialogAction: (state, getters, rootState) => rootState.profile.dialog.action,
  dialogClose: (state, getters, rootState) => rootState.profile.dialog.close,
  dialog: (state, getters, rootState) => rootState.profile.dialog.show,
  drafts: (state, getters, rootState) => rootState.profile.mDraft.show,
  template: (state, getters, rootState) => rootState.profile.mDraft.template,
  chatPage: (state, getters, rootState) => rootState.messaging.chat.page,
  chatPages: (state, getters, rootState) => rootState.messaging.chat.pages,
  chatContent: (state, getters, rootState) => rootState.messaging.chat.content,
  getCompanyPhone: (state) => (order) => {
    if (state.data.companyPhones) {
      if (state.data.companyPhones.length > 0) {
        return state.data.companyPhones[order].value.default;
      } else {
        return '';
      }
    }
    return '';
  },
  getMemberPhone: (state) => (order) => {
    if (state.data.memberPhones) {
      if (state.data.memberPhones.length > 0) {
        return state.data.memberPhones[order].value.default;
      } else {
        return '';
      }
    }
    return '';
  },
  getMemberRole: (state) => (role) => {
    return state.employeeRoles.find((a) => a.value === role).title;
  }
};
