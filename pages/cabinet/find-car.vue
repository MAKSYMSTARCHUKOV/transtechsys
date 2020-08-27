<template>
  <section class="find d-flex flex-column">
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <div class="search-bar d-flex flex-column align-center">
      <div class="search-bar-extend">
        <div class="search-bar-container">
          <h1>поиск авто</h1>
          <m-input
            ref="load"
            :prepend="true"
            placeholder="Загрузка/Откуда"
            :autocomplete="true"
            :result="addressesLoad"
            :input-value="
              $isEmpty(obj.routes.from) ? '' : obj.routes.from[0].title
            "
            @input="startAutocomplete($event, 'load')"
            @click="(val) => chooseRoute('load', val)"
          >
            <template #prepend>
              <img :src="$imgSrc('icons/pin.svg')" />
            </template>
          </m-input>
          <m-input
            ref="unload"
            :prepend="true"
            placeholder="Выгрузка/Куда"
            :autocomplete="true"
            :result="addressesUnload"
            :input-value="$isEmpty(obj.routes.to) ? '' : obj.routes.to[0].title"
            @input="startAutocomplete($event, 'unload')"
            @click="(val) => chooseRoute('unload', val)"
          >
            <template #prepend>
              <img :src="$imgSrc('icons/pin.svg')" />
            </template>
          </m-input>
          <div id="carrying" class="bordered d-flex align-center">
            <span>Масса, т</span>
            <div class="inputs d-flex align-center ml-auto">
              <span>от</span>
              <m-input
                :digit="true"
                :flat="true"
                border="transparent"
                name="gte"
                :input-value="obj.carrying.gte"
                input-style="padding-left:3px"
                @input="($event) => (obj.carrying.gte = $event.target.value)"
              ></m-input>
              <span>до</span>
              <m-input
                :digit="true"
                :flat="true"
                name="lte"
                border="transparent"
                input-style="padding-left:3px"
                :input-value="obj.carrying.lte"
                @input="($event) => (obj.carrying.lte = $event.target.value)"
              ></m-input>
            </div>
          </div>
          <div id="carVolume" class="bordered d-flex align-center">
            <span>Объём, м³</span>
            <div class="inputs d-flex align-center ml-auto">
              <span>от</span>
              <m-input
                :digit="true"
                :flat="true"
                border="transparent"
                input-style="padding-left:3px"
                name="gte"
                :input-value="obj.carVolume.gte"
                @input="($event) => (obj.carVolume.gte = $event.target.value)"
              ></m-input>
              <span>до</span>
              <m-input
                :digit="true"
                :flat="true"
                name="lte"
                input-style="padding-left:3px"
                border="transparent"
                :input-value="obj.carVolume.lte"
                @input="($event) => (obj.carVolume.lte = $event.target.value)"
              ></m-input>
            </div>
          </div>
          <m-select
            placeholder="Тип кузова"
            options-mode="multi"
            :options="bodyTypeValues"
            name="bodyTypes"
            @change="multiselect"
          ></m-select>
          <div class="datepickers">
            <datepicker
              id="dateFrom"
              v-model="calendarFrom"
              :lang="lang"
              :editable="false"
              :clearable="true"
              placeholder="Дата с"
              format="DD.MM.YYYY"
              title-format="DD.MM.YYYY"
              input-class="c-input"
              @clear="clearDate('dateFrom')"
            >
            </datepicker>
            <datepicker
              v-model="calendarBy"
              :lang="lang"
              :editable="false"
              :clearable="true"
              placeholder="Дата по"
              format="DD.MM.YYYY"
              title-format="DD.MM.YYYY"
              input-class="c-input"
              @clear="clearDate('dateBy')"
            >
            </datepicker>
          </div>
          <div class="hidden-options">
            <div class="options">
              <div class="role-input d-flex flex-column find-equipment">
                <span>доп.оборудование</span>
                <div class="equipment d-flex flex-column">
                  <div v-if="hasEquipment" class="drag d-flex flex-column">
                    <div
                      v-for="(d, i) of equipment"
                      :key="`${d.title}-${i}`"
                      class="drag-element"
                      :data-id="i"
                    >
                      {{ `${$capitalize(d.title)}, ${d.quantity} шт.` }}
                      <img
                        :src="$imgSrc('icons/remove.svg')"
                        @click="removeEquipment(i)"
                      />
                    </div>
                  </div>
                  <div class="d-element d-flex align-center">
                    <m-select
                      :key="equipmentFlag"
                      border="bottom"
                      :options="equipmentValues"
                      placeholder="Оборудование"
                      @change="selectEquipment"
                    ></m-select>
                    <m-input
                      :key="!equipmentFlag"
                      placeholder="Кол-во"
                      :flat="true"
                      :digit="true"
                      border="bottom"
                      :disabled="quantityInput"
                      input-style="padding-left:0"
                      @input="enterQuantity"
                    ></m-input>
                    <img
                      v-show="!quantityInput"
                      :src="$imgSrc('icons/add.svg')"
                      style="flex-shrink:0"
                      @click="addEquipment"
                    />
                  </div>
                </div>
              </div>
              <m-select
                options-mode="multi"
                placeholder="ADR"
                :options="sorted(adrValues)"
                name="adrs"
                @change="multiselect"
              ></m-select>
              <m-select
                options-mode="multi"
                placeholder="Документы"
                :options="permission_documents"
                name="permissionDocuments"
                @change="multiselect"
              ></m-select>
              <m-select
                placeholder="Тип загрузки"
                options-mode="multi"
                :options="loadingTypeValues"
                name="loadingTypes"
                @change="multiselect"
              ></m-select>
            </div>
          </div>
          <div class="find-expand pointer" @click="showExtended">
            расширеный поиск
          </div>
          <div class="find-button d-flex justify-center">
            <m-button
              class="button"
              shade="blue"
              :disabled="disabled"
              @click.native="search"
              >найти</m-button
            >
          </div>
        </div>
      </div>
      <div v-if="!mobile" class="m-container show-all" @click="showAll">
        <img :src="$imgSrc('icons/expand.svg')" alt="" />
        <span>поиск авто</span>
      </div>
    </div>
    <div v-if="mobile" class="footer-img">
      <div class="right"></div>
      <div class="left"></div>
    </div>
    <div v-if="mobile && !$isEmpty(found)" class="tabs">
      <div
        v-if="total > 0"
        class="found-count d-flex justify-center align-center"
      >
        Найдено заявок:&nbsp;<span>{{ total }}</span>
      </div>
      <m-tabs
        v-model="tab"
        :tabs="tabsMobile"
        @mousedown="getDirection"
      ></m-tabs>
    </div>

    <template v-if="!mobile">
      <section class="on-map">
        <Loading :state="mapLoading" :absolute="true" :z-index="100"></Loading>
        <div class="map"></div>
      </section>
      <div
        v-if="total > 0"
        class="found-count d-flex justify-center align-center"
      >
        Найдено заявок:&nbsp;<span>{{ total }}</span>
      </div>
      <section
        v-show="!$isEmpty(found)"
        class="company-profile r-section white-background requests"
      >
        <form class="profile d-flex flex-column pt-0">
          <div class="tabs-page">
            <div class="header">
              <span>Маршрут</span>
              <span
                class="d-flex align-center pointer justify-center"
                @click="makeSorting('date')"
                ><img
                  :src="$imgSrc('icons/chevron-down-white.svg')"
                  alt=""
                  :class="sorting.date"
                />Дата</span
              >
              <span>Авто</span>
              <span>Док-ты</span>
              <span
                class="d-flex align-center pointer justify-center"
                @click="makeSorting('payment')"
                ><img
                  :src="$imgSrc('icons/chevron-down-white.svg')"
                  alt=""
                  :class="sorting.payment"
                />Ставка</span
              >
              <span>Контакты</span>
              <span class="functions d-flex align-center justify-center">
                <m-select
                  :options="limits"
                  :selected="limit.toString()"
                  selected-color="white"
                  border="transparent"
                  background-color="#2D5EBB"
                  :prepend="$imgSrc('icons/burger.svg')"
                  select-icon="icons/select-white.svg"
                  width="85px"
                  class="mr-4"
                  @change="(e, val) => (limit = val)"
                ></m-select>
                <img id="refresh" :src="$imgSrc('icons/refresh-white.svg')" />
              </span>
            </div>
            <div class="request-container d-flex flex-column">
              <div v-for="(r, i) of found" :key="i" class="request">
                <div class="route item">
                  <div class="iso d-flex align-center">
                    <div class="flags d-flex align-center">
                      <img
                        :src="
                          $imgSrc(
                            `icons/countries/${routeFrom(
                              r
                            ).iso.toLowerCase()}.svg`
                          )
                        "
                        :alt="routeFrom(r).iso"
                      />
                      <img
                        :src="
                          $imgSrc(
                            `icons/countries/${routeTo(
                              r
                            ).iso.toLowerCase()}.svg`
                          )
                        "
                        :alt="routeTo(r).iso"
                      />
                    </div>
                    <div class="abbr d-flex align-center">
                      <span class="from-iso">{{ routeFrom(r).iso }}</span
                      >-<span class="to-iso">{{ routeTo(r).iso }}</span>
                    </div>
                  </div>
                  <div class="countries">
                    <span class="from">{{ routeFrom(r).city.default }}</span>
                    <span class="to">{{ routeTo(r).city.default }}</span>
                  </div>
                </div>
                <div
                  class="date item align-center"
                  v-html="requestDate(r)"
                ></div>
                <div class="auto item align-center" v-html="auto(r)"></div>
                <div class="doc item" v-html="docs(r)"></div>
                <div class="bid item align-center">
                  <div
                    v-if="!r.payment.rateRequest"
                    class="into-bid pt-0 item align-center"
                    v-html="pay(r)"
                  ></div>
                  <div
                    v-if="
                      r.company.id !== $store.getters.company_id &&
                        !madeAuction(r, $store.getters.member_id)
                    "
                    class="m-container"
                    @click="showMakeProposition($event, r)"
                  >
                    <div class="make-proposition d-opaq d-flex flex-column">
                      <div
                        class="panel d-flex align-center justify-space-between"
                      >
                        <div
                          class="ok d-flex align-center justify-center pointer"
                          @click="makeProposition($event, r)"
                        >
                          <img
                            class="pointer"
                            :src="$imgSrc('icons/check.svg')"
                            alt=""
                          />
                        </div>
                        <img
                          class="pointer"
                          :src="$imgSrc('icons/cancel.svg')"
                          alt=""
                          @click="closeRequest"
                        />
                      </div>
                      <div class="inputs d-flex">
                        <m-input
                          :input-value="proposition.value"
                          :flat="true"
                          :digit="true"
                          border="bottom"
                          input-style="text-align:right"
                          @input="changePropositionInput"
                        ></m-input>
                        <m-select
                          v-if="r.payment.rateRequest"
                          :selected="proposition.currency"
                          :options="currencies"
                          border="bottom"
                          width="80px"
                          selected-color="#2D5EBB"
                          background-color="transparent"
                          @change="changePropositionCurrency"
                        ></m-select>
                        <div
                          v-else
                          class="proposition-currency d-flex align-center"
                        >
                          {{ proposition.currency }}
                        </div>
                      </div>
                    </div>
                    <img :src="$imgSrc('icons/euro.svg')" alt="" />
                    <span>предложить</span>
                  </div>
                  <div
                    v-if="
                      r.company.id !== $store.getters.company_id &&
                        madeAuction(r, $store.getters.member_id)
                    "
                    class="m-container"
                    @click="
                      $router.push({
                        name: 'cabinet-requests',
                        query: { tab: 'active' }
                      })
                    "
                  >
                    <img :src="$imgSrc('icons/scales.svg')" alt="" />
                    <span>торг в процессе</span>
                  </div>
                </div>
                <div :key="ready" class="contact item">
                  <div class="contact-faces d-flex flex-column">
                    <div
                      v-if="r.company.id !== $store.getters.company_id"
                      class="contact-faces-company pointer d-flex"
                      @click="showContact(r.company)"
                    >
                      <div
                        v-if="r.company.avatar"
                        class="contact-faces-avatar"
                        :style="{
                          backgroundImage: `url(${r.company.avatar.value})`,
                          backgroundSize: sizeCompany(
                            r.company.avatar.position
                          )[2],
                          backgroundPosition: `${
                            sizeCompany(r.company.avatar.position)[0]
                          } ${sizeCompany(r.company.avatar.position)[1]}`
                        }"
                      ></div>
                      <div class="contact-faces-company-bio d-flex flex-column">
                        <span v-if="r.company.name !== 'dummy'">{{
                          r.company.name
                        }}</span>
                        <div
                          class="contact-faces-company-bio-rating d-flex align-center"
                        ></div>
                      </div>
                    </div>
                    <div
                      class="contact-faces-member pointer d-flex"
                      @click="showContact(r.contact)"
                    >
                      <div
                        v-if="r.contact.avatar"
                        class="contact-faces-avatar"
                        :style="{
                          backgroundImage: `url(${r.contact.avatar.value})`,
                          backgroundSize: size(r.contact.avatar.position)[2],
                          backgroundPosition: `${
                            size(r.contact.avatar.position)[0]
                          } ${size(r.contact.avatar.position)[1]}`
                        }"
                      ></div>
                      <span>{{ r.contact.name }}</span>
                    </div>
                  </div>
                  <div class="contact-contacts d-flex flex-column">
                    <template v-if="r.contact.phones">
                      <div
                        v-if="!$isEmpty(messengers(r.contact.phones))"
                        class="contact-contacts-messengers d-flex justify-end align-center"
                      >
                        <a
                          v-if="messengers(r.contact.phones).whatsapp"
                          :href="
                            `whatsapp://send?phone=${
                              messengers(r.contact.phones).whatsapp
                            }`
                          "
                          ><img
                            :src="$imgSrc('icons/contact/whatsapp.svg')"
                            alt=""
                        /></a>
                        <a
                          v-if="messengers(r.contact.phones).telegram"
                          :href="
                            `tg://resolve?domain=${
                              messengers(r.contact.phones).telegram
                            }`
                          "
                          ><img
                            :src="$imgSrc('icons/contact/telegram.svg')"
                            alt=""
                        /></a>
                        <a
                          v-if="messengers(r.contact.phones).viber"
                          :href="
                            `viber://add?number=${
                              messengers(r.contact.phones).viber
                            }`
                          "
                          ><img :src="$imgSrc('icons/contact/viber.svg')" alt=""
                        /></a>
                        <a
                          v-if="r.contact.skype"
                          :href="`skype:${r.contact.skype}?call`"
                          ><img :src="$imgSrc('icons/contact/skype.svg')" alt=""
                        /></a>
                      </div>
                      <div
                        class="contact-contacts-phones d-flex flex-column align-end justify-center"
                      >
                        <span v-for="p of r.contact.phones" :key="p.value">
                          <a :href="`tel:${p.value}`">{{ p.value }}</a>
                        </span>
                      </div>
                    </template>
                    <div
                      v-if="r.contact.member_id !== $store.getters.member_id"
                      class="m-container"
                      @click="startChat($event, r.contact)"
                    >
                      <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                      <span>написать</span>
                    </div>
                  </div>
                </div>
                <div class="extra-info d-flex flex-column">
                  <div class="extra-info-container">
                    <div class="extra-info-content d-flex">
                      <div class="extra-info-content-routes d-flex flex-column">
                        <div
                          class="extra-info-content-routes-route d-flex main"
                        >
                          <div
                            class="extra-info-content-routes-route-marker d-flex align-center justify-center from main"
                          >
                            <div class="circle main">
                              А
                            </div>
                          </div>
                          <div
                            class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                          >
                            <span class="h">Пункт отправления</span>
                            <span>{{ aPoint(routeFrom(r)) }}</span>
                          </div>
                        </div>
                        <template v-if="!$isEmpty(rts('from', r))">
                          <div
                            v-for="d of rts('from', r)"
                            :key="`${d.city}-${d.country}`"
                            class="extra-info-content-routes-route d-flex"
                          >
                            <div
                              class="extra-info-content-routes-route-marker d-flex align-center justify-center"
                            >
                              <div class="circle"></div>
                            </div>
                            <div
                              class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                            >
                              <span class="h"
                                >Дополнительный пункт загрузки</span
                              >
                              <span>{{ routeName(d) }}</span>
                            </div>
                          </div>
                        </template>
                        <template v-if="!$isEmpty(rts('to', r))">
                          <div
                            v-for="d of rts('to', r)"
                            :key="`${d.city}-${d.country}`"
                            class="extra-info-content-routes-route d-flex"
                          >
                            <div
                              class="extra-info-content-routes-route-marker d-flex align-center justify-center"
                            >
                              <div class="circle"></div>
                            </div>
                            <div
                              class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                            >
                              <span class="h"
                                >Дополнительный пункт выгрузки</span
                              >
                              <span>{{ routeName(d) }}</span>
                            </div>
                          </div>
                        </template>
                        <div
                          class="extra-info-content-routes-route d-flex main"
                        >
                          <div
                            class="extra-info-content-routes-route-marker d-flex align-center justify-center to main"
                          >
                            <div class="circle main">
                              Б
                            </div>
                          </div>
                          <div
                            class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                          >
                            <span class="h">Пункт прибытия</span>
                            <span>{{ aPoint(routeTo(r)) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="extra-info-content-info">
                        <template v-if="r.carDimensions">
                          <div class="extra-info-content-info-header">
                            Габариты
                          </div>
                          <div class="extra-info-content-info-data">
                            {{
                              `${r.carDimensions.length}x${r.carDimensions.width}x${r.carDimensions.height}`
                            }}
                          </div>
                        </template>
                        <template v-if="r.equipments">
                          <div class="extra-info-content-info-header">
                            Дополнительное<br />оборудование
                          </div>
                          <div
                            class="extra-info-content-info-data d-flex flex-column"
                            v-html="eq(r)"
                          ></div>
                        </template>
                        <template v-if="r.description">
                          <div class="extra-info-content-info-header">
                            Примечание
                          </div>
                          <div class="extra-info-content-info-data textarea">
                            {{ r.description }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div
                    class="extra-info-expand d-flex align-center pointer"
                    @click="expandExtra"
                  >
                    {{
                      `Дополнительная информация про ${
                        collection === 'car' ? 'авто' : 'груз'
                      }`
                    }}
                    <div class="select"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="pages > 1" class="pages d-flex">
              <m-pagination
                v-model="pageObj"
                :pages="pages"
                :page="page"
                color="#4E5357"
              ></m-pagination>
            </div>
          </div>
        </form>
      </section>
    </template>

    <transition-group v-else :name="direction" mode="out-in">
      <section v-if="tab === 'map'" :key="tab" class="on-map">
        <Loading :state="mapLoading" :absolute="true" :z-index="100"></Loading>
        <div class="map"></div>
      </section>
      <section
        v-if="tab === 'list' && !$isEmpty(found)"
        :key="direction"
        class="company-profile r-section white-background requests"
      >
        <form class="profile d-flex flex-column">
          <div class="tabs-page">
            <div class="request-container">
              <div
                v-for="(r, i) of found"
                :key="i"
                class="request d-flex flex-column"
              >
                <div class="m-header d-flex flex-column">
                  <div class="m-iso m-grid">
                    <div
                      class="from  d-flex align-center"
                      style="flex-wrap:wrap; justify-content:end"
                    >
                      <img
                        :src="
                          $imgSrc(
                            `icons/countries/${routeFrom(
                              r
                            ).iso.toLowerCase()}.svg`
                          )
                        "
                        :alt="routeFrom(r).iso"
                      />
                      <span class="iso">{{ routeFrom(r).iso }}</span>
                      <div class="flex-break"></div>
                      <span class="iso-title">{{
                        routeFrom(r).city.default
                      }}</span>
                    </div>
                    <div class="line d-flex justify-space-between align-center">
                      <div class="bubble"></div>
                      <div class="bubble"></div>
                    </div>
                    <div class="to  d-flex align-center" style="flex-wrap:wrap">
                      <img
                        :src="
                          $imgSrc(
                            `icons/countries/${routeTo(
                              r
                            ).iso.toLowerCase()}.svg`
                          )
                        "
                        :alt="routeTo(r).iso"
                      />
                      <span class="iso">{{ routeTo(r).iso }}</span>
                      <div class="flex-break"></div>
                      <span class="iso-title">{{
                        routeTo(r).city.default
                      }}</span>
                    </div>
                  </div>
                  <div class="m-date m-grid">
                    <template v-if="!$isEmpty(r.loadingTime.calendar.dateFrom)">
                      <div class="from-date">
                        с
                        <span>{{
                          r.loadingTime.calendar.dateFrom.substring(0, 5)
                        }}</span>
                      </div>
                      <div class="line"></div>
                      <div class="to-date">
                        по
                        <span>{{
                          r.loadingTime.calendar.dateBy.substring(0, 5)
                        }}</span>
                      </div>
                    </template>
                    <span
                      v-else-if="!$isEmpty(r.loadingTime.always)"
                      class="string"
                      >{{ r.loadingTime.always }}</span
                    >
                    <span v-else class="string">{{ r.loadingTime.ready }}</span>
                  </div>
                </div>
                <div class="m-container-body d-flex flex-column">
                  <div class="m-container-item d-flex justify-space-between">
                    <div class="m-container-item-header">Авто</div>
                    <div class="auto d-flex">{{ auto(r, true) }}</div>
                  </div>
                  <div class="m-container-item d-flex justify-space-between">
                    <div class="m-container-item-header">Ставка</div>
                    <div class="d-flex flex-column justify-end align-end">
                      <div
                        class="bid d-flex flex-column"
                        v-html="pay(r, true)"
                      ></div>
                      <div
                        v-if="
                          r.company.id !== $store.getters.company_id &&
                            !madeAuction(r, $store.getters.member_id)
                        "
                        class="m-container"
                        @click="showMakeProposition($event, r)"
                      >
                        <div class="make-proposition d-opaq d-flex flex-column">
                          <div
                            class="panel d-flex align-center justify-space-between"
                          >
                            <div
                              class="ok d-flex align-center justify-center pointer"
                              @click="makeProposition($event, r)"
                            >
                              <img
                                class="pointer"
                                :src="$imgSrc('icons/check.svg')"
                                alt=""
                              />
                            </div>
                            <img
                              class="pointer"
                              :src="$imgSrc('icons/cancel.svg')"
                              alt=""
                              @click="closeRequest"
                            />
                          </div>
                          <div class="inputs d-flex">
                            <m-input
                              :input-value="proposition.value"
                              :flat="true"
                              :digit="true"
                              border="bottom"
                              input-style="text-align:right"
                              @input="changePropositionInput"
                            ></m-input>
                            <m-select
                              v-if="r.payment.rateRequest"
                              :selected="proposition.currency"
                              :options="currencies"
                              border="bottom"
                              width="80px"
                              selected-color="#2D5EBB"
                              background-color="transparent"
                              @change="changePropositionCurrency"
                            ></m-select>
                            <div
                              v-else
                              class="proposition-currency d-flex align-center"
                            >
                              {{ proposition.currency }}
                            </div>
                          </div>
                        </div>
                        <img :src="$imgSrc('icons/euro.svg')" alt="" />
                        <span>предложить</span>
                      </div>
                      <div
                        v-if="
                          r.company.id !== $store.getters.company_id &&
                            madeAuction(r, $store.getters.member_id)
                        "
                        class="m-container"
                        @click="
                          $router.push({
                            name: 'cabinet-requests',
                            query: { tab: 'active' }
                          })
                        "
                      >
                        <img :src="$imgSrc('icons/scales.svg')" alt="" />
                        <span>торг в процессе</span>
                      </div>
                    </div>
                  </div>
                  <div class="m-container-item d-flex flex-column">
                    <div class="m-container-item-header">Контакты</div>
                    <div :key="ready" class="contact item">
                      <div class="contact-faces d-flex flex-column">
                        <div
                          v-if="r.company.id !== $store.getters.company_id"
                          class="contact-faces-company d-flex"
                          @click="showContact(r.company)"
                        >
                          <div
                            v-if="r.company.avatar"
                            class="contact-faces-avatar"
                            :style="{
                              backgroundImage: `url(${r.company.avatar.value})`,
                              backgroundSize: sizeCompany(
                                r.company.avatar.position
                              )[2],
                              backgroundPosition: `${
                                sizeCompany(r.company.avatar.position)[0]
                              } ${sizeCompany(r.company.avatar.position)[1]}`
                            }"
                          ></div>
                          <div
                            class="contact-faces-company-bio d-flex flex-column"
                          >
                            <span v-if="r.company.name !== 'dummy'">{{
                              r.company.name
                            }}</span>
                            <div
                              class="contact-faces-company-bio-rating d-flex align-center"
                            ></div>
                          </div>
                        </div>
                        <div
                          class="contact-faces-member d-flex"
                          @click="showContact(r.contact)"
                        >
                          <div
                            v-if="r.contact.avatar"
                            class="contact-faces-avatar"
                            :style="{
                              backgroundImage: `url(${r.contact.avatar.value})`,
                              backgroundSize: size(
                                r.contact.avatar.position
                              )[2],
                              backgroundPosition: `${
                                size(r.contact.avatar.position)[0]
                              } ${size(r.contact.avatar.position)[1]}`
                            }"
                          ></div>
                          <span>{{ r.contact.name }}</span>
                        </div>
                      </div>
                      <div class="contact-contacts d-flex flex-column">
                        <template v-if="r.contact.phones">
                          <div
                            v-if="!$isEmpty(messengers(r.contact.phones))"
                            class="contact-contacts-messengers d-flex justify-end align-center"
                          >
                            <a
                              v-if="messengers(r.contact.phones).whatsapp"
                              :href="
                                `whatsapp://send?phone=${
                                  messengers(r.contact.phones).whatsapp
                                }`
                              "
                              ><img
                                :src="$imgSrc('icons/contact/whatsapp.svg')"
                                alt=""
                            /></a>
                            <a
                              v-if="messengers(r.contact.phones).telegram"
                              :href="
                                `tg://resolve?domain=${
                                  messengers(r.contact.phones).telegram
                                }`
                              "
                              ><img
                                :src="$imgSrc('icons/contact/telegram.svg')"
                                alt=""
                            /></a>
                            <a
                              v-if="messengers(r.contact.phones).viber"
                              :href="
                                `viber://add?number=${
                                  messengers(r.contact.phones).viber
                                }`
                              "
                              ><img
                                :src="$imgSrc('icons/contact/viber.svg')"
                                alt=""
                            /></a>
                            <a
                              v-if="r.contact.skype"
                              :href="`skype:${r.contact.skype}?call`"
                              ><img
                                :src="$imgSrc('icons/contact/skype.svg')"
                                alt=""
                            /></a>
                          </div>
                          <div
                            class="contact-contacts-phones d-flex flex-column align-end justify-center"
                          >
                            <span v-for="p of r.contact.phones" :key="p.value">
                              <a :href="`tel:${p.value}`">{{ p.value }}</a>
                            </span>
                          </div>
                        </template>
                        <div
                          v-if="
                            r.contact.member_id !== $store.getters.member_id
                          "
                          class="m-container"
                          @click="startChat($event, r.contact)"
                        >
                          <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                          <span>написать</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="m-container-body hidden">
                  <div class="m-container-conatiner d-flex flex-column">
                    <div class="m-container-item d-flex justify-space-between">
                      <div class="m-container-item-header">Документы</div>
                      <div class="doc d-flex" v-html="docs(r)"></div>
                    </div>
                    <div class="extra-info d-flex flex-column">
                      <div class="extra-info-container">
                        <div class="extra-info-content d-flex">
                          <div
                            class="extra-info-content-routes d-flex flex-column"
                          >
                            <div
                              class="extra-info-content-routes-route d-flex main"
                            >
                              <div
                                class="extra-info-content-routes-route-marker d-flex align-center justify-center from main"
                              >
                                <div class="circle main">
                                  А
                                </div>
                              </div>
                              <div
                                class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                              >
                                <span class="h">Пункт отправления</span>
                                <span>{{ aPoint(routeFrom(r)) }}</span>
                              </div>
                            </div>
                            <template v-if="!$isEmpty(rts('from', r))">
                              <div
                                v-for="d of rts('from', r)"
                                :key="`${d.city}-${d.country}`"
                                class="extra-info-content-routes-route d-flex"
                              >
                                <div
                                  class="extra-info-content-routes-route-marker d-flex align-center justify-center"
                                >
                                  <div class="circle"></div>
                                </div>
                                <div
                                  class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                                >
                                  <span class="h"
                                    >Дополнительный пункт загрузки</span
                                  >
                                  <span>{{ routeName(d) }}</span>
                                </div>
                              </div>
                            </template>
                            <template v-if="!$isEmpty(rts('to', r))">
                              <div
                                v-for="d of rts('to', r)"
                                :key="`${d.city}-${d.country}`"
                                class="extra-info-content-routes-route d-flex"
                              >
                                <div
                                  class="extra-info-content-routes-route-marker d-flex align-center justify-center"
                                >
                                  <div class="circle"></div>
                                </div>
                                <div
                                  class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                                >
                                  <span class="h"
                                    >Дополнительный пункт выгрузки</span
                                  >
                                  <span>{{ routeName(d) }}</span>
                                </div>
                              </div>
                            </template>
                            <div
                              class="extra-info-content-routes-route d-flex main"
                            >
                              <div
                                class="extra-info-content-routes-route-marker d-flex align-center justify-center to main"
                              >
                                <div class="circle main">
                                  Б
                                </div>
                              </div>
                              <div
                                class="extra-info-content-routes-route-data d-flex flex-column justify-center"
                              >
                                <span class="h">Пункт прибытия</span>
                                <span>{{ aPoint(routeTo(r)) }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="extra-info-content-info">
                            <template v-if="r.carDimensions">
                              <div class="extra-info-content-info-header">
                                Габариты
                              </div>
                              <div class="extra-info-content-info-data">
                                {{
                                  `${r.carDimensions.length}x${r.carDimensions.width}x${r.carDimensions.height}`
                                }}
                              </div>
                            </template>
                            <template v-if="r.equipments">
                              <div class="extra-info-content-info-header">
                                Дополнительное<br />оборудование
                              </div>
                              <div
                                class="extra-info-content-info-data d-flex flex-column"
                                v-html="eq(r)"
                              ></div>
                            </template>
                            <template v-if="r.description">
                              <div class="extra-info-content-info-header">
                                Примечание
                              </div>
                              <div
                                class="extra-info-content-info-data textarea"
                              >
                                {{ r.description }}
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                      <div
                        class="extra-info-expand d-flex align-center pointer"
                        @click="expandExtra"
                      >
                        {{
                          `Дополнительная информация про ${
                            collection === 'car' ? 'авто' : 'груз'
                          }`
                        }}
                        <div class="select"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="expand-info d-flex align-center justify-center pointer"
                  @click="expandMobile"
                >
                  <img :src="$imgSrc('icons/chevron-down-white.svg')" />
                </div>
              </div>
            </div>
            <div v-show="pages > 1" class="pages d-flex">
              <m-pagination
                v-model="pageObj"
                :pages="pages"
                :page="page"
                color="#4E5357"
              ></m-pagination>
            </div>
          </div>
        </form>
        <div v-show="pages > 1" class="pages d-flex">
          <m-pagination
            v-model="pageObj"
            :pages="pages"
            :page="page"
            color="#4E5357"
          ></m-pagination>
        </div>
      </section>
    </transition-group>
  </section>
</template>

<script>
import findCargoAuto from '~/mixins/findCargoAuto.js';
import requests from '~/mixins/requests.js';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import redirectRole from '~/mixins/redirectRole.js';
import requestsList from '~/mixins/requestsList.js';

export default {
  mixins: [hideMobileMenu, redirectRole, findCargoAuto, requests, requestsList],
  loading: false,
  layout: 'role',
  async asyncData({ app, route, store }) {
    const p = app.$localstorage.get('position');
    const e = app.$localstorage.get('email');
    const n = route.name;
    const collection = n.split('-')[2];
    let bodyTypeValues = [];
    let loadingTypeValues = [];
    let adrValues = [];
    let equipmentValues = [];
    let currencies = [];
    let limit = 10;
    const pages = 1;
    const page = 1;
    let sorting = {
      date: 'ASC',
      payment: 'DESC',
      body: 'DESC'
    };
    const car = JSON.parse(JSON.stringify(store.getters.car));
    if (p !== undefined) {
      if (p[e]) {
        if (p[e][n]) {
          limit = p[e][n].limit;
          ({ ...sorting } = p[e][n].sorting);
        } else {
          p[e][n] = {
            limit,
            sorting
          };
          app.$localstorage.set('position', p, true);
        }
      } else {
        p[e] = {
          [n]: {
            limit,
            sorting
          }
        };
        app.$localstorage.set('position', p, true);
      }
    } else {
      const o = {
        [e]: {}
      };
      o[e][n] = {
        limit,
        sorting
      };
      app.$localstorage.set('position', o, true);
    }
    try {
      const b = await app.$claim.get('body_types');
      [...bodyTypeValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('currencies');
      [...currencies] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('loading_types');
      [...loadingTypeValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('adrs');
      [...adrValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('equipments');
      [...equipmentValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    return {
      page,
      pages,
      limit,
      collection,
      bodyTypeValues,
      loadingTypeValues,
      adrValues,
      equipmentValues,
      sorting,
      currencies,
      car
    };
  },
  head() {
    return {
      title: '| Поиск авто'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/cargo-auto.scss';
@import '~/static/scss/role/requests.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.doc {
  flex-direction: row !important;
  justify-content: center;
  span {
    font-weight: 800;
    color: $brand;
    @include mx(5);
  }
}
.auto,
.date {
  span {
    text-align: center;
  }
}
.bid {
  span {
    span {
      color: $brand;
    }
  }
}
.equipment {
  span {
    font-weight: normal;
    font-size: rem(13);
  }
}
</style>
