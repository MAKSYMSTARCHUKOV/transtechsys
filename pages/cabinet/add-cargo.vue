<template>
  <section class="company-profile r-section white-background cargo mb-8">
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <form class="profile">
      <div class="section-header d-flex">
        <h1>добавить груз</h1>
        <div
          class="m-container"
          @click="
            $store.commit('profile/showDraft', {
              title: 'добавить груз',
              value: 'cargo'
            })
          "
        >
          <img :src="$imgSrc('icons/file.svg')" alt="" />
          <span>выбрать из сохраненных</span>
        </div>
      </div>
      <div :key="saved" class="edit-data">
        <div class="role-input d-flex flex-column" style="margin-bottom:0">
          <h3>груз</h3>
          <div class="cargo-section extra">
            <m-select
              :options="cargoNameValues"
              placeholder="Наименование*"
              name="cargo_name"
              :selected="selected('cargo_name')"
              :required="true"
              @change="($event, val) => select($event, val, 'name')"
            ></m-select>

            <m-select
              placeholder="Упаковка"
              :options="packageValues"
              name="cargo_package"
              :required="true"
              :selected="selected('cargo_package')"
              @change="($event, val) => select($event, val, 'package')"
            ></m-select>
            <m-select
              options-mode="multi"
              placeholder="ADR"
              :options="sorted(adrValues)"
              name="adr"
              :selected="selected('adr')"
              @change="($event, val) => multiselect($event, val, 'value')"
            ></m-select>
            <m-input
              placeholder="Вес, т*"
              :digit="true"
              :flat="true"
              name="cargo_weight"
              :required="true"
              :input-value="selected('cargo_weight')"
              @input="easyInput($event, 'weight')"
            ></m-input>
            <m-input
              placeholder="Объём, м³*"
              :digit="true"
              :flat="true"
              name="cargo_volume"
              :required="true"
              :input-value="selected('cargo_volume')"
              @input="easyInput($event, 'volume')"
            ></m-input>
            <div class="size">
              <span>Габариты, м:</span>
              <m-input
                placeholder="Длина"
                :digit="true"
                :flat="true"
                name="cargo_dimensions_length"
                :input-value="selected('cargo_dimensions', 'length')"
                @input="inputDimensions($event, 'length')"
              ></m-input>
              <m-input
                placeholder="Ширина"
                :digit="true"
                :flat="true"
                name="cargo_dimensions_width"
                :input-value="selected('cargo_dimensions', 'width')"
                @input="inputDimensions($event, 'width')"
              ></m-input>
              <m-input
                placeholder="Высота"
                :digit="true"
                :flat="true"
                name="cargo_dimensions_height"
                :input-value="selected('cargo_dimensions', 'height')"
                @input="inputDimensions($event, 'height')"
              ></m-input>
            </div>
          </div>
        </div>
        <div class="sub-input d-flex flex-column">
          <label class="m-checkbox">
            <input
              v-if="selected('partial_load') === true"
              :key="selected('partial_load')"
              type="checkbox"
              hidden
              name="partial_load"
              checked
              @change="check($event, 'partialLoad', undefined, 'partial_load')"
            />
            <input
              :key="selected('partial_load')"
              type="checkbox"
              hidden
              name="partial_load"
              else
              @change="check($event, 'partialLoad', undefined, 'partial_load')"
            />
            <div class="square"></div>
            <div class="m-checkbox-content">Догруз</div>
          </label>
        </div>
        <div class="role-input d-flex flex-column">
          <h3>дополнительное оборудование</h3>
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
            <div
              v-if="!$isEmpty(equipmentValues)"
              class="equipment-add d d-flex align-center"
            >
              <div class="m-container" @click="showAddEquipment">
                <img :src="$imgSrc('icons/add.svg')" alt="" />
                <span>добавить оборудование</span>
              </div>
              <div class="d-element d-opaq">
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
                  @input="enterQuantity"
                ></m-input>
                <img
                  :src="$imgSrc('icons/add.svg')"
                  alt=""
                  class="d-opaq"
                  @click="addEquipment"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="role-input d-flex flex-column route-section">
          <h3>маршрут</h3>
          <div class="sub-input d-flex flex-column load" data-required>
            <h4>Пункт загрузки</h4>
            <draggable
              v-if="!$isEmpty(load)"
              v-model="load"
              class="drag"
              ghost-class="dragging"
              @end="orderRoute('load')"
            >
              <div
                v-for="(d, i) of load"
                :key="`${d}-${i}`"
                class="drag-element"
                :data-id="i"
              >
                {{ d }}
                <img
                  :src="$imgSrc('icons/remove.svg')"
                  @click="removeRoute('load', i)"
                />
              </div>
            </draggable>
            <div ref="load" class="map-section d-flex">
              <div
                class="m-container"
                :class="{ 'ml-2': !$isEmpty(load) }"
                @click="showRouteInput"
              >
                <img :src="$imgSrc('icons/add.svg')" alt="" />
                <span
                  >{{ $isEmpty(load) ? 'основное ' : 'дополнительное ' }}место
                  загрузки</span
                >
              </div>
              <m-input
                class="d-opaq"
                :prepend="true"
                placeholder="Город и/или адрес"
                :autocomplete="true"
                :result="addresses"
                @input="startAutocomplete"
                @click="(val) => chooseRoute('load', val)"
              >
                <template #prepend>
                  <img :src="$imgSrc('icons/pin.svg')" />
                </template>
              </m-input>
              <div class="map-section-map d-flex flex-column d-opaq">
                <div class="header d-flex justify-space-between align-center">
                  <span>Уточнить местоположение</span>
                  <img
                    :src="$imgSrc('icons/confirm.svg')"
                    class="pointer ok d-opaq"
                    @click="saveRoute('load')"
                  />
                </div>
                <span id="address">{{ selectedAddress }}</span>
                <div class="google-map">
                  <Loading :state="mapLoading" :absolute="true"></Loading>
                  <div class="map"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="message"></div>
          <div class="sub-input d-flex flex-column unload" data-required>
            <h4>Пункт выгрузки</h4>
            <div
              ref="unload"
              class="map-section d-flex"
              :class="{ 'ml-2': !$isEmpty(unload) }"
            >
              <div class="m-container" @click="showRouteInput">
                <img :src="$imgSrc('icons/add.svg')" alt="" />
                <span
                  >{{ $isEmpty(unload) ? 'конечное ' : 'дополнительное ' }}место
                  выгрузки</span
                >
              </div>
              <m-input
                class="d-opaq"
                :prepend="true"
                placeholder="Город и/или адрес"
                :autocomplete="true"
                :result="addresses"
                @input="startAutocomplete"
                @click="(val) => chooseRoute('unload', val)"
              >
                <template #prepend>
                  <img :src="$imgSrc('icons/pin.svg')" />
                </template>
              </m-input>
              <div class="map-section-map d-flex flex-column d-opaq">
                <div class="header d-flex justify-space-between align-center">
                  <span>Уточнить местоположение</span>
                  <img
                    :src="$imgSrc('icons/confirm.svg')"
                    class="pointer ok d-opaq"
                    @click="saveRoute('unload')"
                  />
                </div>
                <span id="address">{{ selectedAddress }}</span>
                <div class="google-map">
                  <Loading :state="mapLoading" :absolute="true"></Loading>
                  <div class="map"></div>
                </div>
              </div>
            </div>
            <draggable
              v-if="!$isEmpty(unload)"
              v-model="unload"
              class="drag"
              ghost-class="dragging"
              @end="orderRoute('unload')"
            >
              <div
                v-for="(d, i) of unload"
                :key="`${d}-${i}`"
                class="drag-element"
                :data-id="i"
              >
                {{ d }}
                <img
                  :src="$imgSrc('icons/remove.svg')"
                  @click="removeRoute('unload', i)"
                />
              </div>
            </draggable>
            <!-- <draggable
              v-if="!$isEmpty(unload)"
              v-model="unload"
              class="drag"
              ghost-class="dragging"
            >
              <div :key="`${unload[0]}-0`" class="drag-element" :data-id="1">
                {{ unload[0] }}
                <img
                  :src="$imgSrc('icons/remove.svg')"
                  @click="removeRoute('unload', 0)"
                />
              </div>
            </draggable> -->

            <!-- <draggable
              v-if="!$isEmpty(unload)"
              v-model="unload"
              class="drag"
              ghost-class="dragging"
              @end="orderRoute('unload')"
            >
              <div
                v-for="(d, i) of unload"
                :key="`${d}-${i}`"
                class="drag-element"
                :data-id="i"
              >
                {{ d }}
                <img
                  :src="$imgSrc('icons/remove.svg')"
                  @click="removeRoute('unload', i)"
                />
              </div>
            </draggable>
            <div ref="unload" class="map-section d-flex">
              <div
                :class="{ 'ml-2': !$isEmpty(unload) }"
                class="m-container"
                @click="showRouteInput"
              >
                <img :src="$imgSrc('icons/add.svg')" alt="" />
                <span
                  >{{ $isEmpty(unload) ? 'конечное' : 'дополнительное ' }}место
                  выгрузки</span
                >
              </div>
              <m-input
                class="d-opaq"
                :prepend="true"
                placeholder="Город и/или адрес"
                :autocomplete="true"
                :result="addresses"
                @input="startAutocomplete"
                @click="(val) => chooseRoute('unload', val)"
              >
                <template #prepend>
                  <img :src="$imgSrc('icons/pin.svg')" />
                </template>
              </m-input>
              <div class="map-section-map d-flex flex-column d-opaq">
                <div class="header d-flex justify-space-between align-center">
                  <span>Уточнить местоположение</span>
                  <img
                    :src="$imgSrc('icons/confirm.svg')"
                    class="pointer ok d-opaq"
                    @click="saveRoute('unload')"
                  />
                </div>
                <span id="address">{{ selectedAddress }}</span>
                <div class="google-map">
                  <Loading :state="mapLoading" :absolute="true"></Loading>
                  <div class="map"></div>
                </div>
              </div>
            </div> -->
          </div>
          <div class="message"></div>
        </div>
        <div class="role-input d-flex flex-column transfer-section extra">
          <h3>транспорт</h3>
          <m-select
            placeholder="Тип кузова*"
            options-mode="multi"
            :options="bodyTypeValues"
            :required="true"
            name="body_type"
            :style="{ width: mobile ? '100%' : '33%' }"
            :selected="selected('body_type')"
            @change="($event, val) => multiselect($event, val, 'value')"
          ></m-select>
          <m-select
            placeholder="Тип загрузки*"
            options-mode="multi"
            style="margin-top:10px"
            :options="loadingTypeValues"
            name="loading_type"
            :required="true"
            :style="{ width: mobile ? '100%' : '33%' }"
            :selected="selected('loading_type')"
            @change="($event, val) => multiselect($event, val, 'value')"
          ></m-select>
          <div class="sub-input d-flex flex-column m-docs">
            <h4>Документы</h4>
            <div id="docs" data-required>
              <label class="m-checkbox">
                <input
                  v-if="
                    selected('permission_document') !== undefined &&
                      !$isEmpty(
                        selected('permission_document').find(
                          (a) => a.value === 'TIR'
                        )
                      )
                  "
                  type="checkbox"
                  hidden
                  checked
                  name="TIR"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <input
                  v-else
                  type="checkbox"
                  hidden
                  name="TIR"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <div class="square"></div>
                <div class="m-checkbox-content">TIR</div>
              </label>
              <label class="m-checkbox">
                <input
                  v-if="
                    selected('permission_document') !== undefined &&
                      !$isEmpty(
                        selected('permission_document').find(
                          (a) => a.value === 'CMR'
                        )
                      )
                  "
                  type="checkbox"
                  hidden
                  checked
                  name="CMR"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <input
                  v-else
                  type="checkbox"
                  hidden
                  name="CMR"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <div class="square"></div>
                <div class="m-checkbox-content">CMR</div>
              </label>
              <label class="m-checkbox">
                <input
                  v-if="
                    selected('permission_document') !== undefined &&
                      !$isEmpty(
                        selected('permission_document').find(
                          (a) => a.value === 'T1'
                        )
                      )
                  "
                  type="checkbox"
                  hidden
                  checked
                  name="T1"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <input
                  v-else
                  type="checkbox"
                  hidden
                  name="T1"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <div class="square"></div>
                <div class="m-checkbox-content">T1</div>
              </label>
              <label class="m-checkbox">
                <input
                  v-if="
                    selected('permission_document') !== undefined &&
                      !$isEmpty(
                        selected('permission_document').find(
                          (a) => a.value === 'Медкнижка'
                        )
                      )
                  "
                  type="checkbox"
                  hidden
                  checked
                  name="Медкнижка"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <input
                  v-else
                  type="checkbox"
                  hidden
                  name="Медкнижка"
                  @change="check($event, 'value', true, 'permission_document')"
                />
                <div class="square"></div>
                <div class="m-checkbox-content">Медкнижка</div>
              </label>
            </div>
            <div class="message"></div>
          </div>
          <div class="sub-input d-flex align-center">
            <h4>Кол-во машин</h4>
            <m-input
              class="ml-5"
              :flat="true"
              border="bottom"
              :digit="true"
              width="50px"
              name="cars_count"
              :input-value="selected('cars_count')"
              @input="easyInput($event, 'carsCount')"
            ></m-input>
          </div>
        </div>
        <div class="role-input d-flex flex-column when" data-required>
          <h3>когда</h3>
          <div class="when-to">
            <label class="m-radio">
              <input
                v-if="!loadingTimeDisabled('ready')"
                type="radio"
                name="loading_time"
                value="ready"
                hidden
                checked
                @change="chooseLoadingTime($event, 'ready')"
              />
              <input
                v-else
                type="radio"
                name="loading_time"
                value="ready"
                hidden
                @change="chooseLoadingTime($event, 'ready')"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">Готово к отгрузке</div>
            </label>
            <m-select
              :key="obj.loading_time.ready"
              border="bottom"
              value-mode="object"
              :options="readySelect"
              :disabled="loadingTimeDisabled('ready')"
              :selected="loadingTimeSelected('ready')"
              name="loading_time_ready"
              @change="($event, val) => selectLoadingTime($event, val, 'ready')"
            ></m-select>
          </div>
          <div class="when-to">
            <label class="m-radio">
              <input
                v-if="!loadingTimeDisabled('by_calendar')"
                type="radio"
                name="loading_time"
                value="by_calendar"
                hidden
                checked
                @change="chooseLoadingTime($event, 'by_calendar')"
              />
              <input
                v-else
                type="radio"
                name="loading_time"
                value="by_calendar"
                hidden
                @change="chooseLoadingTime($event, 'by_calendar')"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">Календарь</div>
            </label>
            <div class="calendar">
              <span>с</span>
              <datepicker
                v-model="calendarFrom"
                :disabled="loadingTimeDisabled('by_calendar')"
                :lang="lang"
                :editable="false"
                :clearable="false"
                format="DD.MM.YYYY"
                title-format="DD.MM.YYYY"
                input-class="c-input"
              >
              </datepicker>
              <div class="flex-break"></div>
              <span>по</span>
              <datepicker
                v-model="calendarBy"
                :disabled="loadingTimeDisabled('by_calendar')"
                :lang="lang"
                :editable="false"
                :clearable="false"
                format="DD.MM.YYYY"
                title-format="DD.MM.YYYY"
                input-class="c-input"
              >
              </datepicker>
            </div>
          </div>
          <div class="when-to">
            <label class="m-radio">
              <input
                v-if="!loadingTimeDisabled('always')"
                type="radio"
                name="loading_time"
                value="always"
                hidden
                checked
                @change="chooseLoadingTime($event, 'always')"
              />
              <input
                v-else
                type="radio"
                name="loading_time"
                value="always"
                hidden
                @change="chooseLoadingTime($event, 'always')"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">Постоянно</div>
            </label>
            <m-select
              :key="obj.loading_time.always"
              border="bottom"
              value-mode="object"
              :options="alwaysSelect"
              :disabled="loadingTimeDisabled('always')"
              :selected="loadingTimeSelected('always')"
              name="loading_time_always"
              @change="
                ($event, val) => selectLoadingTime($event, val, 'always')
              "
            ></m-select>
          </div>
        </div>
        <div class="message"></div>
        <div class="role-input d-flex flex-column payment-section">
          <h3>оплата</h3>
          <div class="pay-methods d-flex">
            <label class="m-radio">
              <input
                v-if="!obj.payment.rate_request"
                :key="obj.payment.rate_request"
                type="radio"
                name="rate_request"
                hidden
                checked
                @change.prevent="choosePayment('bid')"
              />
              <input
                v-else
                :key="obj.payment.rate_request"
                type="radio"
                name="rate_request"
                hidden
                @change="choosePayment('bid')"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">Ставка</div>
            </label>
            <label class="m-radio">
              <input
                v-if="obj.payment.rate_request"
                :key="obj.payment.rate_request"
                type="radio"
                name="rate_request"
                hidden
                checked
                @change.prevent="choosePayment('req')"
              />
              <input
                v-else
                :key="obj.payment.rate_request"
                type="radio"
                name="rate_request"
                hidden
                @change="choosePayment('req')"
              />
              <div class="square"></div>
              <div class="m-checkbox-content">Запрос ставки</div>
            </label>
          </div>
          <div v-if="!obj.payment.rate_request" class="bid d-flex flex-column">
            <div class="vol d-flex">
              <m-select
                placeholder="Вид оплаты*"
                :width="mobile ? '100%' : '180px'"
                :options="sorted(paymentTypeValues)"
                options-mode="multi"
                name="payment"
                :selected="selected('payment', 'type')"
                @change="
                  ($event, val) => multiselect($event, val, 'value', 'type')
                "
              ></m-select>
              <div class="flex-break"></div>
              <m-input
                :flat="true"
                border="bottom"
                placeholder="min 101"
                name="pay"
                :input-value="obj.payment.pay.value"
                :digit="true"
                width="100px"
                input-style="padding-right:10px; text-align:right;"
                @input="inputPay"
              ></m-input>
              <m-select
                :selected="obj.payment.pay.currency"
                width="90px"
                :options="sorted(currencyValues)"
                value-mode="object"
                @change="chooseCurrency"
              ></m-select>
            </div>
            <label class="m-checkbox">
              <input
                v-if="obj.payment.bargain"
                :key="obj.payment.bargain"
                type="checkbox"
                hidden
                checked
                @change="
                  check(
                    $event,
                    'paymentBargain',
                    undefined,
                    'payment',
                    'bargain'
                  )
                "
              />
              <input
                v-else
                :key="obj.payment.bargain"
                type="checkbox"
                hidden
                @change="
                  check(
                    $event,
                    'paymentBargain',
                    undefined,
                    'payment',
                    'bargain'
                  )
                "
              />
              <div class="square"></div>
              <div class="m-checkbox-content">возможен торг</div>
            </label>
            <label class="m-checkbox">
              <input
                v-if="obj.payment.show_proposition"
                :key="obj.payment.show_proposition"
                type="checkbox"
                hidden
                checked
                @change="
                  check(
                    $event,
                    'showProposition',
                    undefined,
                    'payment',
                    'show_proposition'
                  )
                "
              />
              <input
                v-else
                :key="obj.payment.show_proposition"
                type="checkbox"
                hidden
                @change="
                  check(
                    $event,
                    'showProposition',
                    undefined,
                    'payment',
                    'show_proposition'
                  )
                "
              />
              <div class="square"></div>
              <div class="m-checkbox-content">
                встречные предложения видны только вам
              </div>
            </label>
            <div id="beforePay" class="d-flex align-center">
              <label class="m-checkbox">
                <input
                  v-if="prepay !== '*'"
                  :key="obj.payment.prepay.value"
                  type="checkbox"
                  hidden
                  checked
                  @change="checkPrepay"
                />
                <input
                  v-else
                  :key="obj.payment.prepay.value"
                  type="checkbox"
                  hidden
                  @change="checkPrepay"
                />
                <div class="square"></div>
                <div class="m-checkbox-content">предоплата</div>
              </label>
              <m-input
                :flat="true"
                border="bottom"
                class="ml-5"
                width="100px"
                name="prepay"
                :placeholder="prepayPlaceholder"
                :input-value="obj.payment.prepay.value"
                :disabled="prepay === '*'"
                :digit="true"
                input-style="padding-right:10px; text-align:right;"
                @input="inputPrepay"
              ></m-input>
              <span>{{ obj.payment.prepay.currency }}</span>
            </div>
            <label class="m-checkbox">
              <input
                v-if="obj.payment.at_unloading"
                :key="obj.payment.at_unloading"
                type="checkbox"
                hidden
                checked
                @change="
                  check(
                    $event,
                    'paymentAtUnloading',
                    undefined,
                    'payment',
                    'at_unloading'
                  )
                "
              />
              <input
                v-else
                :key="obj.payment.at_unloading"
                type="checkbox"
                hidden
                @change="
                  check(
                    $event,
                    'paymentAtUnloading',
                    undefined,
                    'payment',
                    'at_unloading'
                  )
                "
              />
              <div class="square"></div>
              <div class="m-checkbox-content">оплата на выгрузке</div>
            </label>
          </div>
        </div>
        <div class="role-input d-flex flex-column document-section">
          <h3>добавить документ</h3>
          <input
            :ref="docRef"
            type="file"
            hidden
            multiple
            accept=".txt,.doc,.xls,.pdf,.gif,.bmp,.jpeg,.jpg,.png"
            @change="uploadDocuments"
          />
          <transition-group
            v-if="!$isEmpty(obj.documents)"
            name="down"
            tag="div"
            class="docs d-flex"
          >
            <m-document
              v-for="d of obj.documents"
              :key="d.name"
              :format="docFormat(d.name)"
              @click="rDoc(d.name)"
              >{{ docName(d.name) }}</m-document
            >
          </transition-group>
          <div
            v-if="obj.documents.length < 10"
            class="m-container"
            @click="startUpload"
          >
            <img :src="$imgSrc('icons/add.svg')" alt="" />
            <span
              >загрузить
              {{ $isEmpty(obj.documents) ? '' : 'ещё' }} скан/фото</span
            >
          </div>
          <div class="description" v-html="description"></div>
        </div>
        <div class="role-input d-flex flex-column textarea-section">
          <h3>Примечание</h3>
          <textarea
            placeholder="Введите дополнительную информацию"
            name="description"
            @input="textAreaInput"
          ></textarea>
          <m-counter
            :total="1000"
            :current="obj.description.length"
          ></m-counter>
        </div>
        <div class="role-input d-flex flex-column ref-section">
          <h3>контакты</h3>
          <m-select
            :selected="obj.contact"
            :options="contacts"
            value-mode="object"
            :sorted="true"
            @change="setContact"
          ></m-select>
          <div class="description">
            Укажите к кому из вашей компании обратиться по-поводу этой машины
          </div>
        </div>
        <div v-if="!$isEmpty(id)" class="role-input d-flex template-section">
          <label class="m-checkbox">
            <input type="checkbox" hidden @change="templateChange" />
            <div class="square"></div>
            <div class="m-checkbox-content">
              <h3>сохранить шаблон под именем</h3>
            </div>
          </label>
          <m-input
            :input-value="templateValue"
            :disabled="disabledTemplate"
            :required="templateRequired"
            border="bottom"
            :width="mobile ? '100%' : '200px'"
            input-style="text-align:center; padding-right:10px"
            @input="($event) => (templateValue = $event.target.value)"
          ></m-input>
        </div>
        <div
          v-if="!$isEmpty(id)"
          class="role-input d-flex justify-center submit-section"
        >
          <div class="b-container">
            <m-button shade="blue" @click.native="publish"
              >опубликовать</m-button
            >
          </div>
        </div>
      </div>
    </form>
    <m-draft></m-draft>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import redirectRole from '~/mixins/redirectRole.js';
import cargoAuto from '~/mixins/cargoAuto.js';
import claim from '~/mixins/claim.js';
import dialog from '~/mixins/dialog.js';

export default {
  mixins: [hideMobileMenu, redirectRole, cargoAuto, claim, dialog],
  async asyncData({ app, store, route, redirect }) {
    const template = store.getters.template;
    const cargo = {
      cargo_name: '',
      cargo_package: '',
      adr: [],
      cargo_weight: '',
      cargo_volume: '',
      cargo_dimensions: {
        length: '',
        width: '',
        height: ''
      },
      partial_load: false,
      equipment: [],
      routes: {
        from: [],
        to: []
      },
      body_type: [],
      loading_type: [],
      permission_document: [],
      cars_count: '',
      loading_time: {
        ready: '',
        by_calendar: {
          dateFrom: '',
          dateBy: ''
        },
        always: ''
      },
      payment: {
        rate_request: false,
        type: [],
        pay: {
          currency: 'UAH',
          value: ''
        },
        bargain: false,
        show_proposition: false,
        prepay: {
          currency: 'UAH',
          value: ''
        },
        at_unloading: false
      },
      documents: [],
      contact: {},
      description: ''
    };
    const defaultObj = { cargo: {} };
    try {
      const r = await app.$user.getUser(app.$localstorage.get('email'));
      store.commit('setState', { logged: true });
      const cs = [];
      const c = {};
      const companyName =
        r.company.name.default === 'dummy' ? '' : r.company.name.default;
      c.title = r.member.name.default;
      c.value = r.id.value;
      cargo.contact = {
        value: c.value,
        title: c.title
      };
      ({ ...defaultObj.cargo } = JSON.parse(JSON.stringify(cargo)));
      try {
        const r = await app.$user.getUsers();
        store.commit('setState', { logged: true });
        for (const i of r) {
          if (c.value !== i.id.value) {
            cs.push({
              value: i.id.value,
              title: i.member.name.default
            });
          }
        }
        try {
          const r = await app.$claim.lists();
          r.contacts = cs;
          r.contact = c;
          r.companyName = companyName;
          r.collection = 'cargo';
          r.defaultObj = defaultObj;
          r.cargo = cargo;
          r.id = '';
          r.draft = {};
          if (!app.$isEmpty(template)) {
            ({ ...r.draft } = template);
            return r;
          } else {
            try {
              const res = await app.$claim.draft(r.collection);
              if (app.$isEmpty(res)) {
                return r;
              } else {
                delete res.date;
                delete res.status;
                delete res.draft;
                delete res.published;
                for (const i of Object.keys(res.contact)) {
                  if (i !== 'id' && i !== 'member') {
                    delete res.contact[i];
                  }
                }
                delete res.creator;
                ({ ...r.draft } = res);
                return r;
              }
            } catch (e) {
              app.$errorHandle(e);
            }
          }
        } catch (e) {
          app.$errorHandle(e);
        }
      } catch (e) {
        app.$errorHandle(e);
      }
    } catch (e) {
      app.$errorHandle(e);
    }
    // return app.$user
    //   .getUser(app.$localstorage.get('email'))
    //   .then((r) => {
    //     store.commit('setState', { logged: true });
    //     const cs = [];
    //     const c = {};
    //     const companyName =
    //       r.company.name.default === 'dummy' ? '' : r.company.name.default;
    //     c.title = r.member.name.default;
    //     c.value = r.id.value;
    //     cargo.contact = {
    //       value: c.value,
    //       title: c.title
    //     };
    //     ({ ...defaultObj.cargo } = JSON.parse(JSON.stringify(cargo)));
    //     return app.$user
    //       .getUsers()
    //       .then((r) => {
    //         store.commit('setState', { logged: true });
    //         for (const i of r) {
    //           if (i.id.value !== c.value) {
    //             cs.push({
    //               value: i.id.value,
    //               title: i.member.name.default
    //             });
    //           }
    //         }
    //         return app.$claim
    //           .lists()
    //           .then((r) => {
    //             r.contacts = cs;
    //             r.contact = c;
    //             r.companyName = companyName;
    //             r.collection = route.name.split('-')[2];
    //             r.defaultObj = defaultObj;
    //             r.cargo = cargo;
    //             r.id = '';
    //             return app.$claim
    //               .draft(r.collection)
    //               .then((res) => {
    //                 if (app.$isEmpty(res)) {
    //                   return r;
    //                 } else {
    //                   delete res.date;
    //                   delete res.status;
    //                   delete res.draft;
    //                   delete res.published;
    //                   for (const i of Object.keys(res.contact)) {
    //                     if (i !== 'id' && i !== 'member') {
    //                       delete res.contact[i];
    //                     }
    //                   }
    //                   delete res.creator;
    //                   ({ ...r.draft } = res);
    //                   return r;
    //                 }
    //               })
    //               .catch((e) => {
    //                 app.$errorHandle(e);
    //               });
    //           })
    //           .catch((e) => {
    //             app.$errorHandle(e);
    //           });
    //       })
    //       .catch((e) => {
    //         app.$errorHandle(e);
    //       });
    //   })
    //   .catch((e) => {
    //     app.$errorHandle(e);
    //   });
  },

  computed: {
    ...mapState(['mobile']),
    description() {
      return 'Форматы: TXT, DOC, XLS, PDF, GIF, BMP, JPEG, JPG, PNG.<br>Размер файла до 10мб. Не более 10 файлов.';
    }
  },
  methods: {
    docFormat(name) {
      return name.substr(name.lastIndexOf('.') + 1);
    },
    docName(name) {
      return name.substring(0, name.lastIndexOf('.'));
    },
    startUpload() {
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      this.$refs[this.docRef].click();
      setTimeout(() => {
        if (this.mobile) {
          this.mobLoading = false;
        } else {
          this.$screen(false);
        }
      }, 2000);
    },

    uploadDocuments(e) {
      const t = e.target;
      const gs = t.files;
      const fs = [];
      for (let i = 0; i < gs.length; i++) {
        if (fs.length < 10) {
          fs.push(gs[i]);
        }
      }
      const gen = this.$turn(fs.length);
      let d;
      const err = [];
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      (async () => {
        try {
          if (this.$isEmpty(this.id)) {
            const i = await this.$claim.create(this.collection);
            this.id = i.id;
          }
          for (const f of fs) {
            const r = new FileReader();
            r.onload = (e) => {
              const res = e.target.result;
              (async () => {
                if (
                  this.$isEmpty(
                    this.obj.documents.find((a) => a.name === f.name)
                  )
                ) {
                  try {
                    const rs = await this.$claim.putAttr(
                      this.collection,
                      'cargo_document',
                      {
                        [this.claimId]: this.id,
                        name: f.name,
                        value: res
                      }
                    );
                    this.obj.documents.push({
                      name: f.name,
                      value: res
                    });
                    this.obj.documents.find((a) => a.name === f.name).id =
                      rs.id;
                  } catch (e) {
                    err.push(
                      `-Ошибка при загрузке "${f.name}". Файл не загрузился. Причина: ${e.status} | ${e.data.message}`
                    );
                  }
                }
                d = gen.next().done;
                if (d) {
                  if (err.length > 0) {
                    this.$error(null, err.join('<br>'));
                  }
                  this.$refs[this.docRef].value = '';
                  if (this.mobile) {
                    this.mobLoading = false;
                  } else {
                    this.$screen(false);
                  }
                }
              })();
            };
            r.readAsDataURL(f);
          }
        } catch (e) {
          this.$refs[this.docRef].value = '';
          this.$errorHandle(e);
          if (this.mobile) {
            this.mobLoading = false;
          } else {
            this.$screen(false);
          }
        }
      })();
    },
    async rDoc(name) {
      const d = JSON.parse(
        JSON.stringify(this.obj.documents.find((a) => a.name === name))
      );
      if (this.mobile) {
        this.mobLoading = true;
      } else {
        this.$screen(true);
      }
      try {
        await this.$claim.deleteAttr(this.collection, 'cargo_document', {
          [this.claimId]: this.id,
          id: d.id
        });
        this.obj.documents.splice(
          this.obj.documents.findIndex((a) => a.name === name),
          1
        );
        try {
          await this.hasChanges();
        } catch (e) {
          this.$errorHandle(e);
        }
      } catch (e) {
        this.$errorHandle(e);
      }
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    }
  },
  head() {
    return {
      title: '| Добавить груз'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/cargo-auto.scss';
</style>
