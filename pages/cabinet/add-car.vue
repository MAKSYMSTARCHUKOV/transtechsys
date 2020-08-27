<template>
  <section class="company-profile r-section white-background cargo mb-8">
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <form class="profile">
      <div class="section-header d-flex">
        <h1>добавить авто</h1>
        <div
          class="m-container"
          @click="
            $store.commit('profile/showDraft', {
              title: 'добавить авто',
              value: 'car'
            })
          "
        >
          <img :src="$imgSrc('icons/file.svg')" alt="" />
          <span>выбрать из сохраненных</span>
        </div>
      </div>
      <div :key="saved" class="edit-data">
        <div class="role-input d-flex flex-column" style="margin-bottom:0">
          <h3>кузов</h3>
          <div class="cabine-section extra">
            <m-select
              placeholder="Тип кузова*"
              options-mode="multi"
              :options="bodyTypeValues"
              :required="true"
              name="body_type"
              :selected="selected('body_type')"
              @change="($event, val) => multiselect($event, val, 'value')"
            ></m-select>
            <m-select
              placeholder="Тип загрузки"
              options-mode="multi"
              :options="loadingTypeValues"
              name="loading_type"
              :required="true"
              :selected="selected('loading_type')"
              @change="($event, val) => multiselect($event, val, 'value')"
            ></m-select>
            <m-input
              placeholder="Грузоподъемность, т*"
              :digit="true"
              :flat="true"
              name="carrying"
              :required="true"
              :input-value="selected('carrying')"
              @input="easyInput($event, 'carrying')"
            ></m-input>
            <m-input
              placeholder="Объём, м³*"
              :digit="true"
              :flat="true"
              name="car_volume"
              :required="true"
              :input-value="selected('car_volume')"
              @input="easyInput($event, 'volume')"
            ></m-input>
            <div class="cabine-size">
              <span>Габариты, м</span>
              <m-input
                placeholder="Длина"
                :digit="true"
                :flat="true"
                name="car_dimensions_length"
                :input-value="selected('car_dimensions', 'length')"
                @input="inputDimensions($event, 'length')"
              ></m-input>
              <m-input
                placeholder="Ширина"
                :digit="true"
                :flat="true"
                name="car_dimensions_width"
                :input-value="selected('car_dimensions', 'width')"
                @input="inputDimensions($event, 'width')"
              ></m-input>
              <m-input
                placeholder="Высота"
                :digit="true"
                :flat="true"
                name="car_dimensions_height"
                :input-value="selected('car_dimensions', 'height')"
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
            <div class="m-checkbox-content">Готов взять догруз</div>
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
        <div class="role-input d-flex flex-column">
          <h3>разрешения</h3>
          <div class="permition-section extra">
            <m-select
              options-mode="multi"
              placeholder="ADR"
              :options="sorted(adrValues)"
              name="adr"
              :selected="selected('adr')"
              @change="($event, val) => multiselect($event, val, 'value')"
            ></m-select>
            <div class="docs d-flex flex-column">
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
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
                  />
                  <input
                    v-else
                    type="checkbox"
                    hidden
                    name="TIR"
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
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
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
                  />
                  <input
                    v-else
                    type="checkbox"
                    hidden
                    name="CMR"
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
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
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
                  />
                  <input
                    v-else
                    type="checkbox"
                    hidden
                    name="T1"
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
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
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
                  />
                  <input
                    v-else
                    type="checkbox"
                    hidden
                    name="Медкнижка"
                    @change="
                      check($event, 'value', true, 'permission_document')
                    "
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
          </div>
        </div>
        <div
          v-if="roleAllowed"
          class="role-input d-flex flex-column payment-section"
        >
          <h3>транспорт</h3>
          <div class="vehicle-section">
            <m-select
              :key="obj.driver.title"
              :options="drivers"
              placeholder="Водитель"
              :selected="obj.driver"
              :sorted="true"
              value-mode="object"
              options-mode="append"
              @change="setDriver"
            ></m-select>
            <m-select
              :key="obj.tractor.title"
              style="grid-column-start: 1"
              :options="fVehicles"
              :selected="obj.tractor"
              :sorted="true"
              placeholder="Тягач/Грузовик"
              value-mode="object"
              @change="($event, val) => setVehicle($event, val, 'tractor')"
            ></m-select>
            <m-select
              :key="obj.tractor.id"
              :options="sVehicles"
              :selected="obj.trailer"
              :sorted="true"
              placeholder="Полуприцеп/Прицеп"
              value-mode="object"
              @change="($event, val) => setVehicle($event, val, 'trailer')"
            ></m-select>
          </div>
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
            :key="obj.contact.title"
            :selected="obj.contact"
            :options="contacts"
            :sorted="true"
            value-mode="object"
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
    const role = app.$localstorage.get('plan');
    const roleAllowed = store.state.roleMenu
      .find((a) => a.path === 'car-park')
      .for.includes(role);
    const car = {
      adr: [],
      car_volume: '',
      car_dimensions: {
        length: '',
        width: '',
        height: ''
      },
      carrying: '',
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
        show_proposition: false
      },
      contact: {},
      driver: {},
      tractor: {},
      trailer: {},
      description: ''
    };
    const defaultObj = { car: {} };
    try {
      const r = await app.$user.getUser(app.$localstorage.get('email'));
      store.commit('setState', { logged: true });
      const contacts = [];
      const contact = {};
      const drivers = [];
      const companyName =
        r.company.name.default === 'dummy' ? '' : r.company.name.default;
      contact.title = r.member.name.default;
      contact.value = r.id.value;
      car.contact = {
        value: contact.value,
        title: contact.title
      };
      ({ ...defaultObj.car } = JSON.parse(JSON.stringify(car)));
      try {
        const r = await app.$user.getUsers();
        for (const i of r) {
          if (contact.value !== i.id.value) {
            contacts.push({
              value: i.id.value,
              title: i.member.name.default
            });
          }
        }
        try {
          const r = await app.$user.getDrivers();
          for (const d of r) {
            drivers.push({
              title: d.user.member.name.default,
              value: {
                id: d.user.id.value,
                icon: d.busy
                  ? app.$imgSrc('busy.png')
                  : app.$imgSrc('pixel.png')
              }
            });
          }
        } catch (e) {
          app.$errorHandle(e);
        }
        try {
          const r = await app.$claim.lists();
          r.contacts = contacts;
          r.contact = contact;
          r.companyName = companyName;
          r.collection = 'car';
          r.defaultObj = defaultObj;
          r.drivers = drivers;
          r.car = car;
          r.id = '';
          r.roleAllowed = roleAllowed;
          r.draft = {};
          if (!app.$isEmpty(template)) {
            ({ ...r.draft } = template);
            return r;
          } else {
            try {
              const re = await app.$claim.draft(r.collection);
              if (app.$isEmpty(re)) {
                return r;
              } else {
                const res = re.draft;
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
                res.driver = !app.$isEmpty(re.driver)
                  ? {
                      id: re.driver.id.value,
                      value: re.driver.driver.id.value,
                      title: re.driver.driver.member.name.default
                    }
                  : {};
                res.tractor = !app.$isEmpty(re.tractor)
                  ? {
                      id: re.tractor.id.value,
                      value: {
                        id: re.tractor.tractor.id.value,
                        type: re.tractor.tractor.type.default
                          .replace('CAR_TYPE_', '')
                          .toLowerCase()
                      },
                      title: `${re.tractor.tractor.number.default} (${
                        re.tractor.tractor.brand.default === 'other'
                          ? 'Другое'
                          : re.tractor.tractor.brand.default
                      }, ${
                        re.tractor.tractor.model.default === 'other'
                          ? 'Другое'
                          : re.tractor.tractor.model.default
                      })`
                    }
                  : {};
                res.trailer = !app.$isEmpty(re.trailer)
                  ? {
                      id: re.trailer.id.value,
                      value: {
                        id: re.trailer.trailer.id.value,
                        type: re.trailer.trailer.type.default
                          .replace('CAR_TYPE_', '')
                          .toLowerCase()
                      },
                      title: `${re.trailer.trailer.number.default} (${
                        re.trailer.trailer.brand.default === 'other'
                          ? 'Другое'
                          : re.trailer.trailer.brand.default
                      }, ${
                        re.trailer.trailer.model.default === 'other'
                          ? 'Другое'
                          : re.trailer.trailer.model.default
                      })`
                    }
                  : {};
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
    //     const contacts = [];
    //     const contact = {};
    //     const drivers = [];
    //     const companyName =
    //       r.company.name.default === 'dummy' ? '' : r.company.name.default;
    //     contact.title = r.member.name.default;
    //     contact.value = r.id.value;
    //     car.contact = {
    //       value: contact.value,
    //       title: contact.title
    //     }(({ ...defaultObj.car } = JSON.parse(JSON.stringify(car))));
    //     return app.$user
    //       .getUsers()
    //       .then((r) => {
    //         store.commit('setState', { logged: true });
    //         for (const i of r) {
    //           if (i.id.value !== contact.value) {
    //             contacts.push({
    //               value: i.id.value,
    //               title: i.member.name.default
    //             });
    //           }
    //         }
    //         return app.$user
    //           .getDrivers()
    //           .then((r) => {
    //             for (const d of r) {
    //               drivers.push({
    //                 title: d.member.name.default,
    //                 value: d.id.value
    //               });
    //             }
    //             return app.$claim
    //               .lists()
    //               .then((r) => {
    //                 r.contacts = contacts;
    //                 r.contact = contact;
    //                 r.companyName = companyName;
    //                 r.collection = route.name.split('-')[2];
    //                 r.defaultObj = defaultObj;
    //                 r.drivers = drivers;
    //                 r.car = car;
    //                 r.id = '';
    //                 r.roleAllowed = roleAllowed;
    //                 return app.$claim
    //                   .draft(r.collection)
    //                   .then((res) => {
    //                     if (app.$isEmpty(res)) {
    //                       return r;
    //                     } else {
    //                       delete res.date;
    //                       delete res.status;
    //                       delete res.draft;
    //                       delete res.published;
    //                       for (const i of Object.keys(res.contact)) {
    //                         if (i !== 'id' && i !== 'member') {
    //                           delete res.contact[i];
    //                         }
    //                       }
    //                       delete res.creator;
    //                       ({ ...r.draft } = res);
    //                       return r;
    //                     }
    //                   })
    //                   .catch((e) => {
    //                     app.$errorHandle(e);
    //                   });
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
    fVehicles() {
      const arr = this.$isEmpty(this.vehicles.tractors)
        ? []
        : this.vehicles.tractors;
      const r = arr.concat(this.vehicles.trucks);

      return r.filter((a) => !this.$isEmpty(a));
    }
  },
  head() {
    return {
      title: '| Добавить авто'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/cargo-auto.scss';
</style>
