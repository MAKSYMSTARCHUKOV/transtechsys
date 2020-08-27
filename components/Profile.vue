<template>
  <section class="a-company d-flex flex-column">
    <div class="a-header">
      <div
        v-if="showAvatar"
        class="a-header-avatar"
        :style="{
          backgroundImage: `url(${logo.value})`,
          backgroundSize: companySize(logo.position, 196)[2],
          backgroundPosition: `${companySize(logo.position, 196)[0]} ${
            companySize(logo.position, 196)[1]
          }`
        }"
      ></div>
      <div class="a-header-info">
        <div class="a-header-info-bio">
          <h1 class="bio-title">
            {{ companyName(company) }}
          </h1>
          <div class="bio-role">
            {{ companyRole(company.role) }}
          </div>
          <div v-if="company.phones" class="bio-contacts">
            <template v-for="p of company.phones">
              <div
                v-if="
                  !p.messenger.whatsapp &&
                    !p.messenger.viber &&
                    !p.messenger.telegram
                "
                :key="p.value"
                class="bio-contacts-contact"
              >
                <a class="contact-icon" style="width:20px"></a>
                <a class="contact-number" :href="`tel:${p.value}`">{{
                  p.value
                }}</a>
              </div>
              <template v-for="(m, i) of p.messenger" v-else>
                <div v-if="m" :key="i" class="bio-contacts-contact">
                  <a
                    v-if="i === 'whatsapp'"
                    :href="`whatsapp://send?phone=${p.value}`"
                    class="contact-icon"
                    ><img :src="$imgSrc('icons/contact/whatsapp.svg')"
                  /></a>
                  <a
                    v-else-if="i === 'telegram'"
                    :href="`tg://resolve?domain=${p.value}`"
                    class="contact-icon"
                    ><img :src="$imgSrc('icons/contact/telegram.svg')"
                  /></a>
                  <a
                    v-else-if="i === 'viber'"
                    :href="`viber://add?number=${p.value}`"
                    class="contact-icon"
                    ><img :src="$imgSrc('icons/contact/viber.svg')"
                  /></a>
                  <a class="contact-number" :href="`tel:${p.value}`">{{
                    p.value
                  }}</a>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="a-info">
      <div class="a-info-bio">
        <div class="a-info-bio-desc">
          <div class="a-info-bio-desc-item">
            <h3>едрпоу/инн</h3>
            <span>{{ company.code }}</span>
          </div>
          <div v-if="company.legalAddress" class="a-info-bio-desc-item">
            <h3>юридический адрес</h3>
            <span>{{ company.legalAddress }}</span>
          </div>
          <div v-if="company.physicalAddress" class="a-info-bio-desc-item">
            <h3>физический адрес</h3>
            <span>{{ company.physicalAddress }}</span>
          </div>
          <a
            v-if="company.skype"
            class="a-info-bio-desc-item"
            :href="`skype:login?${company.skype}call`"
          >
            <h3>skype</h3>
            <span>{{ company.skype }}</span>
          </a>
          <a
            v-if="company.siteUrl"
            class="a-info-bio-desc-item"
            :href="`//${company.siteUrl.replace(/^https?:\/\//, '')}`"
          >
            <h3>сайт</h3>
            <span>{{ company.siteUrl }}</span>
          </a>
          <a
            v-if="company.facebook"
            class="a-info-bio-desc-item"
            :href="`//${company.facebook.replace(/^https?:\/\//, '')}`"
          >
            <h3>facebook</h3>
            <span>{{ company.facebook }}</span>
          </a>
          <a
            v-if="company.instagram"
            class="a-info-bio-desc-item"
            :href="`//${company.instagram.replace(/^https?:\/\//, '')}`"
          >
            <h3>instagram</h3>
            <span>{{ company.instagram }}</span>
          </a>
        </div>
      </div>
      <div v-if="company.description" class="a-info-bio">
        <div class="a-info-bio-desc">
          <div class="a-info-bio-desc-item" style="column-grid: 1 / -1">
            <h3>описание</h3>
            <span v-html="aText(company.description)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="a-else">
      <!-- <div class="a-extra monit">
        <div class="monit-header" @click="show">
          <h3>мониторинг компании</h3>
          <img :src="$imgSrc('icons/select-check.svg')" />
        </div>
        <div class="monit-container">
          <div class="inner">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            libero cumque perferendis provident velit quia accusamus!
            Dignissimos dolorem et omnis repudiandae a alias, repellat unde
            impedit quod laboriosam distinctio hic? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Quis ipsum beatae, facere officiis
            nemo quibusdam accusantium cumque veniam necessitatibus tempora
            possimus dolor incidunt vel consequatur architecto consectetur
            dolorem minus obcaecati!
          </div>
        </div>
      </div> -->
      <div v-if="company.documents" class="a-extra docum">
        <div class="monit-header" @click="show">
          <h3>документы</h3>
          <img :src="$imgSrc('icons/select-check.svg')" />
        </div>
        <div class="monit-container">
          <div class="inner">
            <div class="doc-docs">
              <div
                v-for="d of company.documents"
                :key="d.id.value"
                class="doc-docs-item"
              >
                <img
                  :src="
                    $imgSrc(`icons/format/${docFormat(d.name.default)}.svg`)
                  "
                />
                <span>{{ docName(d.name.default) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="a-footer"
        :style="{
          'grid-template-columns':
            !mobile && hasPark(company.role) ? 'repeat(2, 1fr)' : '1fr'
        }"
      >
        <div
          class="a-extra empl"
          :style="{
            'grid-column-end':
              !mobile && hasPark(company.role) ? 'span 1' : '-1'
          }"
        >
          <div
            class="monit-header"
            :class="{
              shown: !mobile && hasPark(company.role)
            }"
            @click="show"
          >
            <h3>{{ `сотрудники (${totalEmployees(users)})` }}</h3>
            <img
              :class="{
                'd-none': hasPark(company.role)
              }"
              :src="$imgSrc('icons/select-check.svg')"
            />
          </div>
          <div
            class="monit-container"
            :style="{
              height: hasPark(company.role) ? 'auto' : 0
            }"
          >
            <div class="inner">
              <div v-for="e of users" :key="e.id.value" class="empl-item">
                <div
                  class="empl-item-avatar"
                  :style="{
                    backgroundImage: `url(${e.member.photo.value})`,
                    backgroundSize: size(
                      e.member.photo.position,
                      mobile ? 54 : 68
                    )[2],
                    backgroundPosition: `${
                      size(e.member.photo.position, mobile ? 54 : 68)[0]
                    } ${size(e.member.photo.position, mobile ? 54 : 68)[1]}`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasPark(company.role)" class="a-extra cars">
          <h3>{{ `подвижной состав (${totalCars(cars)})` }}</h3>
          <div class="cars-items">
            <div class="cars-item">
              <img :src="$imgSrc('icons/car/tractor.svg')" />
              <b
                >Тягач&nbsp;<span>{{ `x${cars[0].total}` }}</span></b
              >
            </div>
            <div class="cars-item">
              <img :src="$imgSrc('icons/car/semitrailer.svg')" />
              <b
                >Полуприцеп&nbsp;<span>{{ `x${cars[1].total}` }}</span></b
              >
            </div>
            <div class="cars-item">
              <img :src="$imgSrc('icons/car/truck.svg')" />
              <b
                >Грузовик&nbsp;<span>{{ `x${cars[2].total}` }}</span></b
              >
            </div>
            <div class="cars-item">
              <img :src="$imgSrc('icons/car/trailer.svg')" />
              <b
                >Прицеп&nbsp;<span>{{ `x${cars[3].total}` }}</span></b
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import company from '~/mixins/company.js';

export default {
  mixins: [company],
  props: {
    company: {
      type: Object,
      default: () => ({})
    },
    cars: {
      type: Array,
      default: () => []
    },
    employees: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      users: []
    };
  },

  computed: {
    logo() {
      return this.company.avatar;
    },
    showAvatar() {
      if (!this.$isEmpty(this.logo.value)) {
        const n = this.$route.name;
        if (n === 'cabinet-profile') {
          return !this.mobile;
        } else {
          return true;
        }
      }
      return false;
    }
  },
  async mounted() {
    [...this.users] = JSON.parse(JSON.stringify(this.employees));
    for (const e of this.users) {
      const p = this.$imgSrc('void-img.png');
      try {
        const y = await this.$fetchImage(e.member.photo.value);
        e.member.photo.value = this.$isEmpty(y) ? p : y;
      } catch (error) {
        e.member.photo.value = p;
      }
    }
    // this.$nextTick(() => {
    //   this.updated = !this.updated;
    // });
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/default.scss';
@import '~/static/scss/catalog-cabinet.scss';
</style>
