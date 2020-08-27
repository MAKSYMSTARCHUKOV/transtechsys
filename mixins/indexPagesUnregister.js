import { mapState } from 'vuex';
import Loading from '~/components/Loading.vue';

export default {
  loading: false,
  components: {
    Loading
  },
  data() {
    return {
      loading: true,
      offset: [0, 0],
      tab0: null,
      tab1: null,
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium enim dolores at, totam natus blanditiis provident laborum earum aliquam atque delectus nisi corporis, maiores facere reiciendis minima vel hic? Neque.`,
      profitOptions: {
        slidesPerView: 3,
        slidesPerColumn: 1,
        spaceBetween: 10,
        speed: 500,
        autoplay: {
          delay: 2000
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets'
        },
        breakpoints: {
          540: {
            slidesPerView: 1,
            spaceBetween: 0,
            slidesPerColumn: 1
          },
          960: {
            slidesPerView: 2,
            slidesPerColumnFill: 'row',
            slidesPerColumn: 2,
            spaceBetween: 30
          }
        }
      },
      cabinetOptions: {
        slidesPerView: 1,
        slidesPerColumn: 1,
        spaceBetween: 10,
        direction: 'vertical',
        speed: 300,
        autoplay: {
          delay: 1500
        },
        pagination: {
          el: '.swiper-pagination-cabinet',
          type: 'bullets'
        },
        breakpoints: {
          540: {
            direction: 'horizontal'
          }
        }
      }
    };
  },
  computed: {
    ...mapState(['mobile'])
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = undefined;
      this.$nuxt.$loading.finish();
    });
  }
};
