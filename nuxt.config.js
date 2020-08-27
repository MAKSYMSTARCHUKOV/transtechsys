export default {
  mode: 'universal',
  env: {
    DOMAIN:
      process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
        ? 'https://transtechsys.eu'
        : 'http://localhost:3000',
    API_KEY: 'AIzaSyAFxrTlEnVkMCULRHh3heTR6t3ZX8Xf78Q'
  },
  buildDir: 'build',
  head: {
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'height=device-height, width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: 'creator',
        content: 'MAKSYMSTARCHUKOV'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600,700,800,900&display=swap&subset=cyrillic,cyrillic-ext'
      }
    ]
  },
  loading: '~/components/Loading.vue',
  css: ['~/static/css/transition.css'],
  plugins: [
    '~/plugins/defaultComponents.js',
    '~/plugins/var.js',
    '~/plugins/helper.js',
    '~/plugins/axios.js',
    {
      src: '~/plugins/swiper.js',
      ssr: false
    },
    {
      src: '~/plugins/lightbox.js',
      ssr: false
    },
    { src: '~/plugins/ga.js', mode: 'client' }
  ],
  vuetify: {
    customVariables: ['~/static/scss/variables.scss'],
    treeShake: true
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify', 'nuxt-socket-io'],
  io: {
    sockets: [
      {
        name: 'chat',
        url: '/'
      },
      {
        name: 'auction',
        url: '/'
      }
    ]
  },

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/router-extras',
    'nuxt-trailingslash-module'
  ],
  router: {
    scrollBehavior: (to, from, savedPosition) => {
      return { x: 0, y: 0 };
    }
  },
  axios: {
    proxy: true,
    retry: { retries: 2 }
  },
  proxy: [
    `${
      process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
        ? 'https://adm1n.transtechsys.eu'
        : 'http://localhost:8080'
    }/api`,
    `${
      process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
        ? 'https://adm1n.transtechsys.eu'
        : 'http://localhost:8080'
    }/uploads`,
    'ws://localhost:9999/chat',
    'ws://localhost:9898/auction'
  ],
  build: {
    // publicPath: 'files/',
    extend(config, { isClient }) {
      // if (isClient) {
      //   config.optimization.splitChunks.maxSize = 200000;
      // }
    }
  }
};
