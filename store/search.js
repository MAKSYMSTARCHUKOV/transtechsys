export const state = () => ({
  car: {
    equipments: [],
    permissionDocuments: [],
    adrs: [],
    bodyTypes: [],
    loadingTypes: [],
    routes: {
      from: [],
      to: []
    },
    carrying: {
      gte: '',
      lte: ''
    },
    carVolume: {
      gte: '',
      lte: ''
    },
    loadingTimeByCalendar: {
      dateFrom: '',
      dateBy: ''
    },
    sorting: {
      date: 'ASC',
      payment: 'DESC',
      body: 'DESC'
    }
  },
  cargo: {
    equipments: [],
    permissionDocuments: [],
    adrs: [],
    bodyTypes: [],
    loadingTypes: [],
    cargoName: '',
    cargoPackage: '',
    routes: {
      from: [],
      to: []
    },
    cargoWeight: {
      gte: '',
      lte: ''
    },
    cargoVolume: {
      gte: '',
      lte: ''
    },
    loadingTimeByCalendar: {
      dateFrom: '',
      dateBy: ''
    },
    sorting: {
      date: 'ASC',
      payment: 'DESC',
      body: 'DESC'
    }
  },
  found: {}
});

export const getters = {};

export const mutations = {
  setCollection(state, payload) {
    const k = Object.keys(payload);
    for (const i of k) {
      for (const q in payload[i]) {
        const w = payload[i][q];
        if (typeof w === 'object') {
          if (w === null || w === undefined) {
            state[i][q] = w;
          } else if (Array.isArray(w)) {
            [...state[i][q]] = w;
          } else {
            ({ ...state[i][q] } = w);
          }
        } else {
          state[i][q] = w;
        }
      }
    }
  },
  setFound(state, payload) {
    ({ ...state.found } = payload);
  },
  clear(state) {
    ({ ...state.car } = {
      equipments: [],
      permissionDocuments: [],
      adrs: [],
      bodyTypes: [],
      loadingTypes: [],
      routes: {
        from: [],
        to: []
      },
      carrying: {
        gte: '',
        lte: ''
      },
      carVolume: {
        gte: '',
        lte: ''
      },
      loadingTimeByCalendar: {
        dateFrom: '',
        dateBy: ''
      },
      sorting: {
        date: 'ASC',
        payment: 'DESC',
        body: 'DESC'
      }
    });
    ({ ...state.cargo } = {
      equipments: [],
      permissionDocuments: [],
      adrs: [],
      bodyTypes: [],
      loadingTypes: [],
      cargoName: '',
      cargoPackage: '',
      routes: {
        from: [],
        to: []
      },
      cargoWeight: {
        gte: '',
        lte: ''
      },
      cargoVolume: {
        gte: '',
        lte: ''
      },
      loadingTimeByCalendar: {
        dateFrom: '',
        dateBy: ''
      },
      sorting: {
        date: 'ASC',
        payment: 'DESC',
        body: 'DESC'
      }
    });
    ({ ...state.found } = {});
  }
};

export const actions = {};
