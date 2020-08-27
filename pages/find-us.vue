<template>
  <v-content>
    <Loading :state="loading" />
    <m-breadcrumps last="контакты"></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <WriteUs :black="false" :h1="true"></WriteUs>
    <div class="find-us-map d-flex">
      <div class="my-map"></div>
    </div>
  </v-content>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader';
import Loading from '~/components/Loading.vue';
import WriteUs from '~/components/WriteUs.vue';

export default {
  loading: false,
  components: {
    Loading,
    WriteUs
  },
  data() {
    return {
      google: undefined,
      map: undefined,
      marker: undefined,
      loading: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      (async () => {
        try {
          await this.createGoogle();
        } catch (e) {
          console.log(e);
          this.$nuxt.$loading.finish();
        }
      })();
    });
  },
  methods: {
    async createGoogle() {
      const apiKey = `${process.env.API_KEY}`;
      try {
        this.google = await GoogleMapsApiLoader({
          apiKey
        });
        this.createMap();
      } catch (e) {
        try {
          this.google = await GoogleMapsApiLoader({
            apiKey
          });
          if (!this.mobile) {
            this.createMap();
          }
          console.log(e);
        } catch (e) {
          console.log(e);
          this.$nuxt.$loading.finish();
          this.loading = undefined;
        }
      }
    },
    createMap() {
      this.map = new this.google.maps.Map(
        this.$el.querySelector('.find-us-map .my-map'),
        {
          center: { lat: 50.4391481, lng: 30.6166916 },
          zoom: this.mobile ? 14 : window.innerWidth > 1900 ? 14 : 13,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            {
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#242f3e' }]
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{ color: '#746855' }]
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }]
            }
          ]
        }
      );
      this.marker = new this.google.maps.Marker({
        position: { lat: 50.4391481, lng: 30.6166916 },
        map: this.map,
        title: 'Transtech System',
        icon: '/images/icon.png'
      });
      this.google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
        this.$nuxt.$loading.finish();
        this.loading = undefined;
      });
    }
  },
  head() {
    return {
      title: 'Адрес и контактная информация TransTechSystem',
      meta: [
        {
          name: 'description',
          content:
            'Адрес и контактная информация TransTechSystem - система автоматизации логистических процессов'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
</style>

<style lang="scss">
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
.find-us-map {
  grid-column: 1 / -1;
  position: relative;
  .my-map {
    width: 100%;
    height: 400px;
    @include tablet() {
      height: 450px;
    }
    @include extra() {
      height: 600px;
    }
  }
}
</style>
