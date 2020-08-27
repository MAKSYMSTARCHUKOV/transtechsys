<template>
  <v-content>
    <Loading :state="loading" />
    <m-breadcrumps
      last="поиск авто"
      :m-style="`${mobile ? 'brand' : 'white'}`"
      :style="{
        backgroundColor: `${
          mobile ? 'transparent !important' : 'rgba(0,0,0,0.3)  !important'
        }`
      }"
    ></m-breadcrumps>
    <div class="head tiny">
      <img v-if="!mobile" id="back" :src="$imgSrc(`back-tiny.png`)" alt="" />
      <div id="left"></div>
    </div>
    <div class="find d-flex flex-column">
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
              :input-value="
                $isEmpty(obj.routes.to) ? '' : obj.routes.to[0].title
              "
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
        <div class="on-map">
          <Loading
            :state="mapLoading"
            :absolute="true"
            :z-index="100"
          ></Loading>
          <div class="map"></div>
        </div>
        <div
          v-if="total > 0"
          class="found-count d-flex justify-center align-center"
        >
          Найдено заявок:&nbsp;<span>{{ total }}</span>
        </div>
        <div
          v-show="!$isEmpty(found)"
          class="company-profile r-section white-background requests"
        >
          <form class="profile d-flex flex-column pt-0">
            <div class="tabs-page">
              <div class="header" style="grid-template-columns: repeat(6, 1fr)">
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
                <div
                  v-for="(r, i) of found"
                  :key="i"
                  class="request"
                  style="grid-template-columns: repeat(6, 1fr);"
                >
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
                  </div>
                  <div class="item">
                    <div class="m-container">
                      <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                      <span
                        >Для связи с контрагентом<br />
                        <div class="pointer" @click="signin">
                          войдите
                        </div>
                        &nbsp;или&nbsp;
                        <div
                          class="pointer"
                          style="text-align: left"
                          @click="register"
                        >
                          зарегистрируйтесь
                        </div></span
                      >
                    </div>
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
        </div>
      </template>

      <transition-group v-else :name="direction" mode="out-in">
        <div v-if="tab === 'map'" :key="tab" class="on-map">
          <Loading
            :state="mapLoading"
            :absolute="true"
            :z-index="100"
          ></Loading>
          <div class="map"></div>
        </div>
        <div
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
                      <div
                        class="line d-flex justify-space-between align-center"
                      >
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                      </div>
                      <div
                        class="to  d-flex align-center"
                        style="flex-wrap:wrap"
                      >
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
                      <template
                        v-if="!$isEmpty(r.loadingTime.calendar.dateFrom)"
                      >
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
                      <span v-else class="string">{{
                        r.loadingTime.ready
                      }}</span>
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
                      </div>
                    </div>
                    <div class="m-container-item d-flex justify-center">
                      <div class="m-container" style="text-align: left">
                        <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                        <span
                          >Для связи с контрагентом<br />
                          <div class="pointer" @click="signin">
                            войдите
                          </div>
                          &nbsp;или&nbsp;
                          <div
                            class="pointer"
                            style="text-align: left"
                            @click="register"
                          >
                            зарегистрируйтесь
                          </div></span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="m-container-body hidden">
                    <div class="m-container-conatiner d-flex flex-column">
                      <div
                        class="m-container-item d-flex justify-space-between"
                      >
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
        </div>
      </transition-group>
    </div>
  </v-content>
</template>

<script>
import Loading from '~/components/Loading.vue';
import findCargoAuto from '~/mixins/findCargoAuto.js';
import requests from '~/mixins/requests.js';
import requestsList from '~/mixins/requestsList.js';

export default {
  components: {
    Loading
  },
  mixins: [findCargoAuto, requests, requestsList],
  loading: false,
  async asyncData({ app, store, route }) {
    const n = route.name;
    const collection = n.split('-')[1];
    const result = JSON.parse(JSON.stringify(store.getters.found));
    const limit = 10;
    let pages = 1;
    const page = 1;
    const sorting = {
      date: 'ASC',
      payment: 'DESC',
      body: 'DESC'
    };
    const bodyTypeValues = [];
    const loadingTypeValues = [];
    const adrValues = [];
    const equipmentValues = [];
    const currencie = [];
    const car = JSON.parse(JSON.stringify(store.getters.car));
    const div = result.total / limit;
    const abs = Math.floor(div);
    pages = div > abs ? abs + 1 : abs;
    try {
      const b = await app.$claim.get('body_types');
      [...app.bodyTypeValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('currencies');
      [...app.currencies] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('loading_types');
      [...app.loadingTypeValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('adrs');
      [...app.adrValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('equipments');
      [...app.equipmentValues] = b;
    } catch (e) {
      app.$errorHandle(e);
    }

    return {
      page,
      pages,
      limit,
      collection,
      sorting,
      car,
      result,
      bodyTypeValues,
      loadingTypeValues,
      adrValues,
      equipmentValues,
      currencie
    };
  },
  data() {
    return {
      loading: true
    };
  },
  async mounted() {
    await this.createGoogle();
    this.$nextTick(() => {
      this.onMap = document.querySelector('.on-map');
      const wH = window.innerHeight;
      this.onMap.style.height = wH - 80 + 'px';
      this.showAll({
        target: document.querySelector('.show-all')
      });
      this.$zIndexing();
      if (!this.$isEmpty(this.result)) {
        this.total = this.result.total;
        this.showFound(this.result.items);
      }
    });
  },
  head() {
    return {
      title: '| Поиск авто'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/index/layout.scss';
@import '~/static/scss/role/cargo-auto.scss';
@import '~/static/scss/role/requests.scss';
.map {
  margin-top: 0;
}
.r-section {
  padding: 0;
}
.profile {
  padding-top: 0 !important;
}
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
input {
  resize: none;
  font-weight: 600;
  width: 100%;
  outline: none !important;
  border: 1px solid $input;
  padding-left: 10px;
  font-size: rem(14);
  height: 35px;
  color: black;
  @include flow(0.15);
  &::placeholder {
    font-weight: 600;
    color: black;
  }
}
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
