import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

Vue.use(VueAwesomeSwiper);
if (process.browser) {
  const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr');
  Vue.use(VueAwesomeSwiper);
}
