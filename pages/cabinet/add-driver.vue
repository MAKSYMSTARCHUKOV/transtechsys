<template>
  <section class="company-profile r-section white-background add-driver">
    <form class="profile">
      <h1>добавить водителя</h1>
      <div class="edit-data mb-8">
        <div class="edit-tabs">
          <transition
            class="edit-tabs-forms"
            mode="out-in"
            name="right-tab"
            appear
          >
            <div class="edit-tabs-forms-form d-flex flex-column">
              <div class="edit-tabs-forms-form-inputs driver-forms">
                <div class="role-input d-flex">
                  <m-input
                    name="lastname"
                    class="w-100"
                    placeholder="Фамилия"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="name"
                    class="w-100"
                    placeholder="Имя"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="secondname"
                    class="w-100"
                    placeholder="Отчество"
                    :required="true"
                  ></m-input>
                </div>
              </div>
              <div class="edit-tabs-forms-form-inputs driver-forms">
                <h3>паспорт</h3>
                <div class="role-input d-flex">
                  <m-input
                    name="series"
                    class="w-100"
                    placeholder="Серия"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="number"
                    class="w-100"
                    placeholder="Номер"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="issueDate"
                    class="w-100"
                    placeholder="Дата выдачи"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="issuedBy"
                    class="w-100"
                    placeholder="Кем выдан"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="registration"
                    class="w-100"
                    placeholder="Прописка"
                    :required="true"
                  ></m-input>
                </div>
              </div>
              <div class="edit-tabs-forms-form-media">
                <div
                  id="passport"
                  class="edit-tabs-forms-form-media-item d-flex flex-column"
                >
                  <div
                    v-if="!$isEmpty(passport)"
                    class="uploaded d-flex flex-column"
                  >
                    <h3>скан паспорта</h3>
                    <div id="doc" class="d-flex">
                      <img class="vehicle" :src="passport.value" alt="" /><img
                        :src="$imgSrc('icons/cancel.svg')"
                        alt=""
                        class="pointer cancel"
                        @click="removeFile('passport')"
                      />
                    </div>
                  </div>
                  <div
                    v-else
                    class="pointer m-container d-flex align-center"
                    @click="$refs[passportRef].click()"
                  >
                    <img :src="$imgSrc('icons/download.svg')" alt="" />
                    <span>загрузить скан паспорта</span>
                  </div>
                </div>
              </div>
              <div class="edit-tabs-forms-form-inputs driver-forms">
                <h3>водительское удостоверение</h3>
                <div class="role-input d-flex">
                  <m-input
                    name="licenseSeries"
                    class="w-100"
                    placeholder="Серия"
                    :required="true"
                  ></m-input>
                </div>
                <div class="role-input d-flex">
                  <m-input
                    name="licenseNumber"
                    class="w-100"
                    placeholder="Номер"
                    :required="true"
                  ></m-input>
                </div>
              </div>
              <div class="edit-tabs-forms-form-media">
                <div
                  id="passport"
                  class="edit-tabs-forms-form-media-item d-flex flex-column"
                >
                  <div
                    v-if="!$isEmpty(driverLicense)"
                    class="uploaded d-flex flex-column"
                  >
                    <h3>скан водительского удостоверения</h3>
                    <div id="doc" class="d-flex">
                      <img
                        class="vehicle"
                        :src="driverLicense.value"
                        alt=""
                      /><img
                        :src="$imgSrc('icons/cancel.svg')"
                        alt=""
                        class="pointer cancel"
                        @click="removeFile('driverLicense')"
                      />
                    </div>
                  </div>
                  <div
                    v-else
                    class="pointer m-container d-flex align-center"
                    @click="$refs[driverLicenseRef].click()"
                  >
                    <img :src="$imgSrc('icons/download.svg')" alt="" />
                    <span>загрузить скан водительского удостоверения</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <input
            id="file-passport"
            :ref="passportRef"
            type="file"
            hidden
            accept=".jpg,.png,.gif,.bmp,.png"
            @change="uploadFile($event, 'passport')"
          />
          <input
            id="file-photo"
            :ref="driverLicenseRef"
            type="file"
            hidden
            accept=".jpg,.png,.gif,.bmp"
            @change="uploadFile($event, 'driverLicense')"
          />
        </div>
        <div id="buttons" class="role-input d-flex justify-center">
          <div class="b-container">
            <m-button
              :disabled="bDisabled"
              shade="blue"
              @click.native="submit"
              >{{ add ? 'добавить' : 'сохранить' }}</m-button
            >
          </div>
        </div>
      </div>
    </form>
  </section>
</template>
<script>
// import { mapState } from 'vuex';
import redirectRole from '~/mixins/redirectRole.js';
export default {
  mixins: [redirectRole]
  //   ,
  //   asyncData({ app, redirect, route }) {
  //     return app.$user
  //       .geDrivers()
  //       .then((r) => {
  //         return {
  //           drivers: r
  //         };
  //       })
  //       .catch((e) => {
  //         if (e.status === 403 || e.status === 401) {
  //           redirect({
  //             name: 'main',
  //             query: { status: 'unauthorized', from: route.path, reload: true }
  //           });
  //         }
  //       });
  //   }
  //   computed:{

  //   }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/car-park.scss';
</style>
