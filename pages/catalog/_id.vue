<template>
  <div class="a-company d-flex flex-column">
    <m-breadcrumps
      :last="company.name !== 'dummy' ? company.name : ''"
      :up="true"
      :middle="[{ name: 'catalog', title: 'каталог компаний' }]"
      m-style="white"
      :style="bStyle"
    ></m-breadcrumps>
    <div class="a-header">
      <div
        v-if="!$isEmpty(company.avatar.value)"
        class="a-header-avatar"
        :style="{
          backgroundImage: `url(${company.avatar.value})`,
          backgroundSize: companySize(
            company.avatar.position,
            mobile ? 172 : 196
          )[2],
          backgroundPosition: `${
            companySize(company.avatar.position, mobile ? 172 : 196)[0]
          } ${companySize(company.avatar.position, mobile ? 172 : 196)[1]}`
        }"
      ></div>
      <div class="a-header-info">
        <div class="a-header-info-bio">
          <div
            class="bio-status"
            :class="{ checked: company.name !== 'dummy' }"
          >
            {{ `${company.name === 'dummy' ? 'не проверен' : 'проверен'}` }}
          </div>
          <h1 class="bio-title">
            {{ companyName(company) }}
          </h1>
          <div class="bio-rate d-flex">
            <div
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{
                active: i <= company.rate
              }"
            ></div>
          </div>
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
              <template v-for="(m, i) of p.messengers" v-else>
                <div v-if="m" :key="i" class="bio-contacts-contact">
                  <a
                    v-if="i === 'whatsapp'"
                    :href="`whatsapp://send?phone=${p.value}`"
                    class="contact-icon"
                    ><img :src="$imgSrc('icons/contact/whatsapp-white.svg')"
                  /></a>
                  <a
                    v-else-if="i === 'telegram'"
                    :href="`tg://resolve?domain=${p.value}`"
                    class="contact-icon"
                    ><img :src="$imgSrc('icons/contact/telegram-white.svg')"
                  /></a>
                  <a
                    v-else-if="i === 'viber'"
                    :href="`viber://add?number=${p.value}`"
                    class="contact-icon"
                    ><img :src="$imgSrc('icons/contact/viber-white.svg')"
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
      <div class="a-header-media">
        <a
          v-if="company.siteUrl"
          class="bio-media"
          :href="`//${company.siteUrl.replace(/https?:\/\//, '')}`"
          target="_blank"
        >
          <div v-if="!mobile" class="media-content-text">
            {{ company.siteUrl }}
          </div>
          <img
            class="media-content-icon"
            :src="$imgSrc('icons/contact/site-white.svg')"
          />
        </a>
        <a
          v-if="company.facebook"
          :href="`//${company.facebook.replace(/https?:\/\//, '')}`"
          class="bio-media"
        >
          <div v-if="!mobile" class="media-content-text">
            {{ company.facebook }}
          </div>
          <img
            class="media-content-icon"
            :src="$imgSrc('icons/contact/facebook-white.svg')"
          />
        </a>
        <a
          v-if="company.instagram"
          :href="`//${company.instagram.replace(/https?:\/\//, '')}`"
          class="bio-media"
        >
          <div v-if="!mobile" class="media-content-text">
            {{ company.instagram }}
          </div>
          <img
            class="media-content-icon"
            :src="$imgSrc('icons/contact/instagram-white.svg')"
          />
        </a>
        <a
          v-if="company.skype"
          :href="`skype:login?${company.skype}call`"
          class="bio-media"
        >
          <div v-if="!mobile" class="media-content-text">
            {{ company.skype }}
          </div>
          <img
            class="media-content-icon"
            :src="$imgSrc('icons/contact/skype-white.svg')"
          />
        </a>
      </div>
    </div>
    <div class="m-board">
      <div class="a-left d-flex flex-column">
        <div class="a-info">
          <div class="a-info-bio">
            <div v-if="company.description" class="a-info-bio-about">
              <div class="h3">описание компании</div>
              <article v-html="aText(company.description)"></article>
            </div>
            <div
              class="a-info-bio-desc"
              :style="{
                'grid-column-start': company.description ? (mobile ? 1 : 2) : 1
              }"
            >
              <div class="a-info-bio-desc-item">
                <div class="h3">едрпоу/инн</div>
                <span>{{ company.code }}</span>
              </div>
              <div v-if="company.legalAddress" class="a-info-bio-desc-item">
                <div class="h3">юридический адрес</div>
                <span>{{ company.legalAddress }}</span>
              </div>
              <div v-if="company.physicalAddress" class="a-info-bio-desc-item">
                <div class="h3">физический адрес</div>
                <span>{{ company.physicalAddress }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="a-else">
          <div v-if="company.documents" class="a-extra doc">
            <div class="h3">документы</div>
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
          <!-- <div class="a-extra monit">
            <div class="monit-header" @click="show">
              <div class="h3">мониторинг компании</div>
              <img :src="$imgSrc('icons/select-check.svg')" />
            </div>
            <div class="monit-container">
              <div class="inner">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
                libero cumque perferendis provident velit quia accusamus!
                Dignissimos dolorem et omnis repudiandae a alias, repellat unde
                impedit quod laboriosam distinctio hic? Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Quis ipsum beatae, facere
                officiis nemo quibusdam accusantium cumque veniam necessitatibus
                tempora possimus dolor incidunt vel consequatur architecto
                consectetur dolorem minus obcaecati!
              </div>
            </div>
          </div> -->
          <div class="a-extra empl">
            <div class="h3">
              {{ `сотрудники (${users.length > 10 ? '10+' : users.length})` }}
            </div>
            <div v-for="u of users" :key="u.id.value" class="empl-item">
              <div
                class="empl-item-avatar"
                :style="{
                  backgroundImage: `url(${u.photo.value})`,
                  backgroundSize: size(u.photo.position, mobile ? 65 : 103)[2],
                  backgroundPosition: `${
                    size(u.photo.position, mobile ? 65 : 103)[0]
                  } ${size(u.photo.position, mobile ? 65 : 103)[1]}`
                }"
              ></div>
              <div class="empl-item-text">
                <div class="empl-item-text-name">{{ u.name.default }}</div>
                <div class="empl-item-text-role">{{ userRole(u.role) }}</div>
              </div>
              <div v-if="mobile" class="flex-break"></div>
              <div class="empl-item-contacts">
                <div
                  v-for="p of u.phones"
                  :key="p.value.default"
                  class="contact"
                >
                  <div class="contact-media">
                    <a
                      v-if="p.messengerSupports.whatsapp"
                      :href="`whatsapp://send?phone=${p.value.default}`"
                      class="whatsapp"
                    >
                      <img :src="$imgSrc('icons/contact/whatsapp.svg')" />
                    </a>
                    <a
                      v-if="p.messengerSupports.telegram"
                      :href="`tg://resolve?domain=${p.value.default}`"
                      class="telegram"
                    >
                      <img :src="$imgSrc('icons/contact/telegram.svg')" />
                    </a>
                    <a
                      v-if="p.messengerSupports.viber"
                      :href="`viber://add?number=${p.value.default}`"
                      class="viber"
                    >
                      <img :src="$imgSrc('icons/contact/viber.svg')" />
                    </a>
                  </div>
                  <a :href="`tel:${p.value.default}`">
                    {{ p.value.default }}
                  </a>
                </div>
                <div v-if="!$isEmpty(u.skype.default)" class="contact">
                  <div class="contact-media">
                    <a
                      :href="`skype:login?${u.skype.default}call`"
                      class="skype"
                    >
                      <img :src="$imgSrc('icons/contact/skype.svg')" />
                    </a>
                  </div>
                  <a :href="`skype:login?${u.skype.default}call`">{{
                    u.skype.default
                  }}</a>
                </div>
              </div>
              <div v-if="mobile" class="flex-break"></div>
              <m-button
                v-if="
                  u.id.value !== $store.getters.member_id &&
                    $store.getters.logged
                "
                shade="blue"
                @click.native="startChat(e, u)"
                >написать</m-button
              >
            </div>
          </div>
          <div v-if="hasPark(company.role)" class="a-extra cars">
            <div class="h3">{{ `подвижной состав (${totalCars(cars)})` }}</div>
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
      <Chat></Chat>
    </div>
  </div>
</template>

<script>
import indexPagesUnregister from '~/mixins/indexPagesUnregister.js';
import company from '~/mixins/company.js';
import Chat from '~/components/Chat.vue';

export default {
  components: {
    Chat
  },
  mixins: [indexPagesUnregister, company],
  async asyncData({ app, route }) {
    let company, users, cars;
    try {
      const y = await app.$company.getCompany(
        null,
        null,
        null,
        route.params.id
      );
      company = app.$prettyCompany(y[0]);
      const v = company.avatar.value;
      let p = '';
      if (!app.$isEmpty(v)) {
        if (v.startsWith('/')) {
          try {
            const t = await app.$fetchImage(v);
            p = app.$isEmpty(t) ? p : t;
          } catch (e) {}
        } else {
          p = v;
        }
      }
      company.avatar.value = p;
      users = y[1];
      cars = y[2];
    } catch (e) {
      app.$errorHandle(e);
    }
    return {
      company,
      users,
      cars
    };
  },
  computed: {
    bStyle() {
      const s = {
        top: '80px',
        paddingLeft: '50px'
      };
      if (!this.$store.state.mobile) {
        s.top = '80px';
        s.paddingLeft = '130px';
      }
      return s;
    }
  },
  head() {
    return {
      title: `${
        this.company.name === 'dummy' ? '' : this.companyName(this.company)
      }`
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/_var.scss';
@import '~/static/scss/_mix.scss';
@import '~/static/scss/index/a-company.scss';
</style>
