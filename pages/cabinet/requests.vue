<template>
  <section class="company-profile r-section white-background requests">
    <Loading opacity="0.4" :state="mobLoading"></Loading>
    <form class="profile d-flex flex-column">
      <h1>мои заявки</h1>
      <div class="tabs">
        <m-tabs
          v-model="currentTab"
          :tabs="tabs"
          @mousedown="getDirection"
        ></m-tabs>
      </div>
      <transition :name="direction" mode="out-in">
        <template v-if="mobile">
          <div class="tabs-page">
            <div class="request-container">
              <div
                v-for="(r, i) of found"
                :key="i"
                class="request d-flex flex-column"
              >
                <div
                  v-if="canRemove(r)"
                  class="pointer remove-request d-flex justify-center align-center"
                  @click="removeRequest(r)"
                >
                  <img :src="$imgSrc('icons/cancel-white.svg')" />
                </div>
                <template v-if="r.carrying">
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
                        class="to d-flex align-center"
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
                    <div class="m-container-item d-flex flex-column">
                      <div class="m-container-item-header">Контакты</div>
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
                              <span
                                v-for="p of r.contact.phones"
                                :key="p.value"
                              >
                                <a :href="`tel:${p.value}`">{{ p.value }}</a>
                              </span>
                            </div>
                          </template>
                          <div
                            v-if="
                              r.contact.member_id !== $store.getters.member_id
                            "
                            class="m-container"
                            style="align-self: flex-start"
                            @click="startChat($event, r.contact)"
                          >
                            <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                            <span>написать</span>
                          </div>

                          <div
                            v-if="mightClose(r) && !historyMode"
                            class="m-container mt-1"
                            style="align-self: flex-start"
                            @click="finishClaim(r)"
                          >
                            <img
                              :src="$imgSrc('icons/check-brand.svg')"
                              alt=""
                            />
                            <span>закрыть заявку</span>
                          </div>
                          <div
                            v-if="leaveReview(r) !== -1"
                            class="m-container mt-1"
                            style="align-self: flex-start"
                            @click="showReview(r)"
                          >
                            <img :src="$imgSrc('icons/feedback.svg')" alt="" />
                            <span>оставить отзыв</span>
                          </div>
                          <div
                            v-if="waitingClose(r) && !historyMode"
                            class="m-container mt-1"
                            style="align-self: flex-start"
                          >
                            <img :src="$imgSrc('icons/wait.svg')" alt="" />
                            <span style="text-align: left"
                              >ожидается<br />подтверждение</span
                            >
                          </div>
                        </div>
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
                          Дополнительная информация про авто
                          <div class="select"></div>
                        </div>
                      </div>
                      <div
                        v-if="r.auctions"
                        class="propositions d-flex flex-column"
                      >
                        <div
                          class="propositions-header d-flex align-center pointer"
                          @click="expandItem($event, true)"
                        >
                          <div
                            class="attention"
                            :class="{
                              accepted: inWork(r),
                              history: historyMode
                            }"
                          ></div>
                          <template v-if="!inWork(r) && !historyMode">
                            <span class="quantity">{{ r.auctions.length }}</span
                            >&nbsp;новых предложений(я)
                            <div class="select"></div>
                          </template>
                          <template v-else-if="historyMode"
                            >История торгов
                            <div class="select"></div>
                          </template>
                          <template v-else>
                            <span class="quantity"></span>Предложение
                            <div class="select"></div>
                          </template>
                        </div>
                        <div class="propositions-content d-flex flex-column">
                          <div class="item-container">
                            <div
                              v-for="p of r.auctions"
                              :key="p.id"
                              class="propositions-content-item"
                            >
                              <div class="left-item">
                                <div
                                  class="avatar"
                                  :style="{
                                    backgroundImage: `url(${p.from.avatar.value})`,
                                    backgroundSize: propSize(
                                      p.from.avatar.position
                                    )[2],
                                    backgroundPosition: `${
                                      propSize(p.from.avatar.position)[0]
                                    } ${propSize(p.from.avatar.position)[1]}`
                                  }"
                                >
                                  <div
                                    :class="{ 'd-opaq': !isOnline(p) }"
                                    class="member-online"
                                  ></div>
                                </div>
                                <div class="name">{{ p.from.name }}</div>
                                <div class="bid">
                                  {{
                                    `${
                                      p.from.member_id !==
                                      $store.getters.member_id
                                        ? '⇾'
                                        : '⇽'
                                    }`
                                  }}&nbsp;{{ p.pay.value }}&nbsp;{{
                                    p.pay.currency
                                  }}
                                </div>
                              </div>
                              <div v-if="!other(p)" class="manipulation d-flex">
                                <div v-if="historyMode" class="m-container">
                                  <span>{{ aDate(p) }}</span>
                                </div>
                                <template v-if="!inWork(r) && !historyMode">
                                  <div
                                    v-if="
                                      p.from.member_id !==
                                        $store.getters.member_id
                                    "
                                    class="m-container"
                                    @click="acceptAuction(p, r)"
                                  >
                                    <img :src="$imgSrc('icons/euro.svg')" />
                                    <span>подтвердить</span>
                                  </div>
                                  <div
                                    class="m-container"
                                    @click="
                                      showMakeProposition($event, p, true)
                                    "
                                  >
                                    <div
                                      class="make-proposition d-opaq d-flex flex-column"
                                    >
                                      <div
                                        class="panel d-flex align-center justify-space-between"
                                      >
                                        <div
                                          class="ok d-flex align-center justify-center pointer"
                                          @click="makeProposition($event, p, r)"
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
                                    <img
                                      :src="$imgSrc('icons/scales.svg')"
                                      alt=""
                                    />
                                    <span>{{
                                      `торг${
                                        p.from.member_id ===
                                        $store.getters.member_id
                                          ? ' (в процессе)'
                                          : ''
                                      }`
                                    }}</span>
                                  </div>
                                  <div
                                    class="m-container"
                                    @click="showCancelAuction"
                                  >
                                    <div
                                      class="cancel-proposition d-opaq d-flex flex-column"
                                    >
                                      <div
                                        class="panel d-flex align-center justify-space-between"
                                      >
                                        <div
                                          class="ok d-flex align-center justify-center pointer"
                                          @click="cancelAuction($event, p, r)"
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
                                          @click="closeCancel"
                                        />
                                      </div>
                                      <div class="radios d-flex-flex-column">
                                        <span>Причина:</span>
                                        <label class="m-radio">
                                          <input
                                            type="radio"
                                            name="cancel"
                                            value="cheap"
                                            hidden
                                            @change="cancelAuctionReason"
                                          />
                                          <div class="square"></div>
                                          <div class="m-checkbox-content">
                                            Цена
                                          </div>
                                        </label>
                                        <label class="m-radio">
                                          <input
                                            type="radio"
                                            name="cancel"
                                            value="relevant"
                                            hidden
                                            @change="cancelAuctionReason"
                                          />
                                          <div class="square"></div>
                                          <div class="m-checkbox-content">
                                            Актуальность
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                    <img
                                      :src="$imgSrc('icons/cancel.svg')"
                                      alt=""
                                    />
                                    <span>закрыть</span>
                                  </div>
                                </template>
                                <div
                                  v-if="rightToWrite(r)"
                                  class="m-container"
                                  @click="makeChat(p)"
                                >
                                  <img
                                    :src="$imgSrc('icons/dialogue.svg')"
                                    alt=""
                                  />
                                  <span>написать</span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                </template>
                <template v-else>
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
                      <div class="m-container-item-header">Груз</div>
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
                    <div class="m-container-item d-flex flex-column">
                      <div class="m-container-item-header">Контакты</div>
                      <div :key="ready" class="contact item">
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
                          class="contact-faces d-flex flex-column"
                          @click="showContact(r.company)"
                        >
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
                              <span
                                v-for="p of r.contact.phones"
                                :key="p.value"
                              >
                                <a :href="`tel:${p.value}`">{{ p.value }}</a>
                              </span>
                            </div>
                          </template>
                          <div
                            v-if="
                              r.contact.member_id !== $store.getters.member_id
                            "
                            class="m-container"
                            style="align-self: flex-start"
                            @click="startChat($event, r.contact)"
                          >
                            <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                            <span>написать</span>
                          </div>

                          <div
                            v-if="mightClose(r) && !historyMode"
                            class="m-container mt-1"
                            style="align-self: flex-start"
                            @click="finishClaim(r)"
                          >
                            <img
                              :src="$imgSrc('icons/check-brand.svg')"
                              alt=""
                            />
                            <span>закрыть заявку</span>
                          </div>
                          <div
                            v-if="leaveReview(r) !== -1"
                            class="m-container"
                            style="align-self: flex-start"
                            @click="showReview(r)"
                          >
                            <img :src="$imgSrc('icons/feedback.svg')" alt="" />
                            <span>оставить отзыв</span>
                          </div>
                          <div
                            v-if="waitingClose(r) && !historyMode"
                            class="m-container mt-1"
                            style="align-self: flex-start"
                          >
                            <img :src="$imgSrc('icons/wait.svg')" alt="" />
                            <span>ожидается<br />подтверждение</span>
                          </div>
                        </div>
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
                              <div class="extra-info-content-info-header">
                                Наименование
                              </div>
                              <div
                                class="extra-info-content-info-data d-flex flex-column"
                              >
                                {{ r.cargoName }}
                              </div>
                              <div class="extra-info-content-info-header">
                                Тип кузова
                              </div>
                              <div
                                class="extra-info-content-info-data d-flex flex-column"
                              >
                                {{ r.bodyTypes.join('\\') }}
                              </div>
                              <template v-if="r.cargoDimensions">
                                <div class="extra-info-content-info-header">
                                  Габариты
                                </div>
                                <div class="extra-info-content-info-data">
                                  {{
                                    `${r.cargoDimensions.length}x${r.cargoDimensions.width}x${r.cargoDimensions.height}`
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
                          Дополнительная информация про груз
                          <div class="select"></div>
                        </div>
                      </div>
                      <div
                        v-if="r.auctions"
                        class="propositions d-flex flex-column"
                      >
                        <div
                          class="propositions-header d-flex align-center pointer"
                          @click="expandItem($event, true)"
                        >
                          <div
                            class="attention"
                            :class="{
                              accepted: inWork(r),
                              history: historyMode
                            }"
                          ></div>
                          <template v-if="!inWork(r) && !historyMode">
                            <span class="quantity">{{ r.auctions.length }}</span
                            >&nbsp;новых предложений(я)
                            <div class="select"></div>
                          </template>
                          <template v-else-if="historyMode"
                            >История торгов
                            <div class="select"></div>
                          </template>
                          <template v-else>
                            <span class="quantity"></span>Предложение
                            <div class="select"></div>
                          </template>
                        </div>
                        <div class="propositions-content d-flex flex-column">
                          <div class="item-container">
                            <div
                              v-for="p of r.auctions"
                              :key="p.id"
                              class="propositions-content-item"
                            >
                              <div class="left-item">
                                <div
                                  class="avatar"
                                  :style="{
                                    backgroundImage: `url(${p.from.avatar.value})`,
                                    backgroundSize: propSize(
                                      p.from.avatar.position
                                    )[2],
                                    backgroundPosition: `${
                                      propSize(p.from.avatar.position)[0]
                                    } ${propSize(p.from.avatar.position)[1]}`
                                  }"
                                >
                                  <div
                                    :class="{ 'd-opaq': !isOnline(p) }"
                                    class="member-online"
                                  ></div>
                                </div>
                                <div class="name">{{ p.from.name }}</div>
                                <div class="bid">
                                  {{
                                    `${
                                      p.from.member_id !==
                                      $store.getters.member_id
                                        ? '⇾'
                                        : '⇽'
                                    }`
                                  }}&nbsp;{{ p.pay.value }}&nbsp;{{
                                    p.pay.currency
                                  }}
                                </div>
                              </div>
                              <div v-if="!other(p)" class="manipulation d-flex">
                                <div v-if="historyMode" class="m-container">
                                  <span>{{ aDate(p) }}</span>
                                </div>
                                <template v-if="!inWork(r) && !historyMode">
                                  <div
                                    v-if="
                                      p.from.member_id !==
                                        $store.getters.member_id
                                    "
                                    class="m-container"
                                    @click="acceptAuction(p, r)"
                                  >
                                    <img :src="$imgSrc('icons/euro.svg')" />
                                    <span>подтвердить</span>
                                  </div>
                                  <div
                                    class="m-container"
                                    @click="
                                      showMakeProposition($event, p, true)
                                    "
                                  >
                                    <div
                                      class="make-proposition d-opaq d-flex flex-column"
                                    >
                                      <div
                                        class="panel d-flex align-center justify-space-between"
                                      >
                                        <div
                                          class="ok d-flex align-center justify-center pointer"
                                          @click="makeProposition($event, p, r)"
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
                                    <img
                                      :src="$imgSrc('icons/scales.svg')"
                                      alt=""
                                    />
                                    <span>{{
                                      `торг${
                                        p.from.member_id ===
                                        $store.getters.member_id
                                          ? ' (в процессе)'
                                          : ''
                                      }`
                                    }}</span>
                                  </div>
                                  <div
                                    class="m-container"
                                    @click="showCancelAuction"
                                  >
                                    <div
                                      class="cancel-proposition d-opaq d-flex flex-column"
                                    >
                                      <div
                                        class="panel d-flex align-center justify-space-between"
                                      >
                                        <div
                                          class="ok d-flex align-center justify-center pointer"
                                          @click="cancelAuction($event, p, r)"
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
                                          @click="closeCancel"
                                        />
                                      </div>
                                      <div class="radios d-flex-flex-column">
                                        <span>Причина:</span>
                                        <label class="m-radio">
                                          <input
                                            type="radio"
                                            name="cancel"
                                            value="cheap"
                                            hidden
                                            @change="cancelAuctionReason"
                                          />
                                          <div class="square"></div>
                                          <div class="m-checkbox-content">
                                            Цена
                                          </div>
                                        </label>
                                        <label class="m-radio">
                                          <input
                                            type="radio"
                                            name="cancel"
                                            value="relevant"
                                            hidden
                                            @change="cancelAuctionReason"
                                          />
                                          <div class="square"></div>
                                          <div class="m-checkbox-content">
                                            Актуальность
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                    <img
                                      :src="$imgSrc('icons/cancel.svg')"
                                      alt=""
                                    />
                                    <span>закрыть</span>
                                  </div>
                                </template>
                                <div
                                  v-if="rightToWrite(r)"
                                  class="m-container"
                                  @click="makeChat(p)"
                                >
                                  <img
                                    :src="$imgSrc('icons/dialogue.svg')"
                                    alt=""
                                  />
                                  <span>написать</span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                </template>
              </div>
            </div>
            <div v-if="pages > 1" class="pages d-flex">
              <m-pagination
                v-model="pageObj"
                :pages="pages"
                :page="page"
                color="#4E5357"
              ></m-pagination>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="!$isEmpty(found)" class="tabs-page">
            <div class="header">
              <span>Маршрут</span>
              <span>Дата</span>
              <span>Груз</span>
              <span>Док-ты</span>
              <span>Ставка</span>
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
                <div
                  v-if="canRemove(r)"
                  class="pointer remove-request d-flex justify-center align-center"
                  @click="removeRequest(r)"
                >
                  <img :src="$imgSrc('icons/cancel-white.svg')" />
                </div>
                <template v-if="r.carrying">
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
                        v-if="r.contact.member_id !== $store.getters.member_id"
                        class="m-container"
                        style="align-self: flex-start"
                        @click="startChat($event, r.contact)"
                      >
                        <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                        <span>написать</span>
                      </div>
                      <div
                        v-if="mightClose(r) && !historyMode"
                        class="m-container mt-1"
                        style="align-self: flex-start"
                        @click="finishClaim(r)"
                      >
                        <img :src="$imgSrc('icons/check-brand.svg')" alt="" />
                        <span>закрыть заявку</span>
                      </div>
                      <div
                        v-if="leaveReview(r) !== -1"
                        class="m-container"
                        style="align-self: flex-start"
                        @click="showReview(r)"
                      >
                        <img :src="$imgSrc('icons/feedback.svg')" alt="" />
                        <span>оставить отзыв</span>
                      </div>
                      <div
                        v-if="waitingClose(r) && !historyMode"
                        class="m-container mt-1"
                        style="align-self: flex-start"
                      >
                        <img :src="$imgSrc('icons/wait.svg')" alt="" />
                        <span>ожидается<br />подтверждение</span>
                      </div>
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
                      Дополнительная информация про авто
                      <div class="select"></div>
                    </div>
                  </div>
                </template>
                <template v-else>
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
                        v-if="r.contact.member_id !== $store.getters.member_id"
                        class="m-container"
                        style="align-self: flex-start"
                        @click="startChat($event, r.contact)"
                      >
                        <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                        <span>написать</span>
                      </div>
                      <div
                        v-if="mightClose(r) && !historyMode"
                        class="m-container mt-1"
                        style="align-self: flex-start"
                        @click="finishClaim(r)"
                      >
                        <img :src="$imgSrc('icons/check-brand.svg')" alt="" />
                        <span>закрыть заявку</span>
                      </div>
                      <div
                        v-if="leaveReview(r) !== -1"
                        class="m-container mt-1"
                        style="align-self: flex-start"
                        @click="showReview(r)"
                      >
                        <img :src="$imgSrc('icons/feedback.svg')" alt="" />
                        <span>оставить отзыв</span>
                      </div>
                      <div
                        v-if="waitingClose(r) && !historyMode"
                        class="m-container mt-1"
                        style="align-self: flex-start"
                      >
                        <img :src="$imgSrc('icons/wait.svg')" alt="" />
                        <span>ожидается<br />подтверждение</span>
                      </div>
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
                          <div class="extra-info-content-info-header">
                            Наименование
                          </div>
                          <div
                            class="extra-info-content-info-data d-flex flex-column"
                          >
                            {{ r.cargoName }}
                          </div>
                          <div class="extra-info-content-info-header">
                            Тип кузова
                          </div>
                          <div
                            class="extra-info-content-info-data d-flex flex-column"
                          >
                            {{ r.bodyTypes.join('\\') }}
                          </div>
                          <template v-if="r.cargoDimensions">
                            <div class="extra-info-content-info-header">
                              Габариты
                            </div>
                            <div class="extra-info-content-info-data">
                              {{
                                `${r.cargoDimensions.length}x${r.cargoDimensions.width}x${r.cargoDimensions.height}`
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
                      Дополнительная информация про груз
                      <div class="select"></div>
                    </div>
                  </div>
                </template>
                <div v-if="r.auctions" class="propositions d-flex flex-column">
                  <div
                    class="propositions-header d-flex align-center pointer"
                    @click="expandItem"
                  >
                    <div
                      class="attention"
                      :class="{ accepted: inWork(r), history: historyMode }"
                    ></div>
                    <template v-if="!inWork(r) && !historyMode">
                      <span class="quantity">{{ r.auctions.length }}</span
                      >&nbsp;новых предложений(я)
                      <div class="select"></div>
                    </template>
                    <template v-else-if="historyMode"
                      >История торгов
                      <div class="select"></div>
                    </template>
                    <template v-else>
                      <span class="quantity"></span>Предложение
                      <div class="select"></div>
                    </template>
                  </div>
                  <div class="propositions-content d-flex flex-column">
                    <div class="item-container">
                      <div
                        v-for="p of r.auctions"
                        :key="p.id"
                        class="propositions-content-item"
                      >
                        <div
                          class="avatar"
                          :style="{
                            backgroundImage: `url(${p.from.avatar.value})`,
                            backgroundSize: propSize(p.from.avatar.position)[2],
                            backgroundPosition: `${
                              propSize(p.from.avatar.position)[0]
                            } ${propSize(p.from.avatar.position)[1]}`
                          }"
                        >
                          <div
                            :class="{ 'd-opaq': !isOnline(p) }"
                            class="member-online"
                          ></div>
                        </div>
                        <div class="name">{{ p.from.name }}</div>
                        <div class="bid">
                          {{
                            `${
                              p.from.member_id !== $store.getters.member_id
                                ? '⇾'
                                : '⇽'
                            }`
                          }}&nbsp;{{ p.pay.value }}&nbsp;{{ p.pay.currency }}
                        </div>
                        <div
                          v-if="!other(p)"
                          class="manipulation d-flex align-center"
                        >
                          <div v-if="historyMode" class="m-container">
                            <span>{{ aDate(p) }}</span>
                          </div>
                          <template v-if="!inWork(r) && !historyMode">
                            <div
                              v-if="
                                p.from.member_id !== $store.getters.member_id
                              "
                              class="m-container"
                              @click="acceptAuction(p, r)"
                            >
                              <img :src="$imgSrc('icons/euro.svg')" alt="" />
                              <span>подтвердить</span>
                            </div>
                            <div
                              class="m-container"
                              @click="showMakeProposition($event, p, true)"
                            >
                              <div
                                class="make-proposition d-opaq d-flex flex-column"
                              >
                                <div
                                  class="panel d-flex align-center justify-space-between"
                                >
                                  <div
                                    class="ok d-flex align-center justify-center pointer"
                                    @click="makeProposition($event, p, r)"
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
                              <img :src="$imgSrc('icons/scales.svg')" alt="" />
                              <span>{{
                                `торг${
                                  p.from.member_id === $store.getters.member_id
                                    ? ' (в процессе)'
                                    : ''
                                }`
                              }}</span>
                            </div>
                            <div class="m-container" @click="showCancelAuction">
                              <div
                                class="cancel-proposition d-opaq d-flex flex-column"
                              >
                                <div
                                  class="panel d-flex align-center justify-space-between"
                                >
                                  <div
                                    class="ok d-flex align-center justify-center pointer"
                                    @click="cancelAuction($event, p, r)"
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
                                    @click="closeCancel"
                                  />
                                </div>
                                <div class="radios d-flex-flex-column">
                                  <span>Причина:</span>
                                  <label class="m-radio">
                                    <input
                                      type="radio"
                                      name="cancel"
                                      value="cheap"
                                      hidden
                                      @change="cancelAuctionReason"
                                    />
                                    <div class="square"></div>
                                    <div class="m-checkbox-content">Цена</div>
                                  </label>
                                  <label class="m-radio">
                                    <input
                                      type="radio"
                                      name="cancel"
                                      value="relevant"
                                      hidden
                                      @change="cancelAuctionReason"
                                    />
                                    <div class="square"></div>
                                    <div class="m-checkbox-content">
                                      Актуальность
                                    </div>
                                  </label>
                                </div>
                              </div>
                              <img :src="$imgSrc('icons/cancel.svg')" alt="" />
                              <span>закрыть</span>
                            </div>
                          </template>
                          <div
                            v-if="rightToWrite(r)"
                            class="m-container"
                            @click="makeChat(p)"
                          >
                            <img :src="$imgSrc('icons/dialogue.svg')" alt="" />
                            <span>написать</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pages > 1" class="pages d-flex">
              <m-pagination
                v-model="pageObj"
                :pages="pages"
                :page="page"
                color="#4E5357"
              ></m-pagination>
            </div>
          </div>
        </template>
      </transition>
    </form>
  </section>
</template>

<script>
import Vue from 'vue';
import hideMobileMenu from '~/mixins/hideMobileMenu.js';
import requests from '~/mixins/requests.js';
import requestsList from '~/mixins/requestsList.js';
import dialog from '~/mixins/dialog.js';

export default {
  mixins: [hideMobileMenu, requests, requestsList, dialog],
  async asyncData({ app, route, store }) {
    const p = app.$localstorage.get('position');
    const e = app.$localstorage.get('email');
    const n = route.name;
    let currencies = [];
    let limit = 10;
    let pages = 1;
    const page = 1;
    let items = [];
    let currentTab = 'created';
    let func = 'getCreated';
    let total = 0;
    let created = 'Созданные заявки';
    let active = 'Активные заявки';
    let process = 'Заявки в работе';
    const closed = 'История';
    const history = 'История';
    if (p !== undefined) {
      if (p[e]) {
        if (p[e][n]) {
          limit = p[e][n].limit;
          currentTab = p[e][n].currentTab;
        } else {
          p[e][n] = {
            limit,
            currentTab
          };
          app.$localstorage.set('position', p, true);
        }
      } else {
        p[e] = {
          [n]: {
            limit,
            currentTab
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
        currentTab
      };
      app.$localstorage.set('position', o, true);
    }
    if (route.query.tab) {
      currentTab = route.query.tab;
    }
    func = 'get' + app.$capitalize(currentTab);
    try {
      const r = await app.$request[func](page, limit);
      total = r.total;
      if (r.total > 0) {
        // for (const y of r.items) {
        //   for (const m of y.auctions) {
        //     let p = app.$imgSrc('void-img.png');
        //     let t;
        //     try {
        //       t = await app.$fetchImage(m.memberFrom.photo.value);
        //       p = app.$isEmpty(t) ? p : t;
        //     } catch (e) {}
        //     m.memberFrom.photo.value = p;
        //     p = app.$imgSrc('void-img.png');
        //     try {
        //       t = await app.$fetchImage(m.memberTo.photo.value);
        //       p = app.$isEmpty(t) ? p : t;
        //     } catch (e) {}
        //     m.memberTo.photo.value = p;
        //   }
        // }
        [...items] = r.items;
        const div = r.total / limit;
        const abs = Math.floor(div);
        pages = div > abs ? abs + 1 : abs;
      }
    } catch (e) {
      app.$errorHandle(e);
    }
    const els = [created, active, process];
    try {
      const t = await app.$io.totalAuctions();
      t.forEach((d, i) => {
        let el = els[i];
        if (d !== 0) {
          el += `<span class="bubble">${d}</span>`;
        }
        switch (i) {
          case 0:
            created = el;
            break;
          case 1:
            active = el;
            break;
          case 2:
            process = el;
            break;
        }
      });
    } catch (e) {
      app.$errorHandle(e);
    }
    try {
      const b = await app.$claim.get('currencies');
      [...currencies] = b;
    } catch (e) {
      app.$errorHandle(e);
    }
    return {
      page,
      pages,
      limit,
      items,
      currentTab,
      total,
      created,
      closed,
      currencies,
      active,
      process,
      history,
      func
    };
  },
  created() {
    this.$router.push({ query: {} });
  },
  mounted() {
    this.$nextTick(() => {
      this.auctionSocket.on('auction', async (res) => {
        if (
          res.memberFromId === this.$store.getters.member_id ||
          res.memberToId === this.$store.getters.member_id
        ) {
          if (res.type === 'created') {
            if (this.currentTab === 'created') {
              const i = this.found.findIndex((i) => i.id === res.claimId);
              if (i !== -1) {
                if (this.total > this.limit) {
                  if (this.page === this.pages) {
                    if (this.found.length === 1) {
                      Vue.set(this.pageObj, 'page', this.page - 1);
                    } else {
                      this.found.splice(i, 1);
                    }
                  } else if (this.page !== this.pages) {
                    Vue.set(this.pageObj, 'page', -1);
                    this.$nextTick(() => {
                      Vue.set(this.pageObj, 'page', this.page);
                    });
                  }
                } else {
                  this.found.splice(i, 1);
                }
              } else if (i == -1) {
                const left = this.total - (this.pages - 1) * this.limit;
                if (left === 1) {
                  --this.pages;
                }
              }
            } else if (this.currentTab === 'active') {
              const i = this.found.findIndex((a) => a.id === res.claimId);
              if (i !== -1) {
                const my = res.memberToId === this.$store.getters.member_id;
                if (my) {
                  const q = this.found[i].auctions.find((a) => {
                    const myProp =
                      a.from.member_id === this.$store.getters.member_id
                        ? 'from'
                        : 'to';
                    const herProp = myProp === 'from' ? 'to' : 'from';
                    return (
                      a[myProp].member_id === this.$store.getters.member_id &&
                      a[herProp].member_id === res.memberFromId
                    );
                  });
                  if (q !== null) {
                    Vue.set(q.pay, 'value', res.value);
                    Vue.set(q.pay, 'currency', res.currency);
                    Vue.set(q.from, 'member_id', res.memberFromId);
                    Vue.set(q.to, 'member_id', this.$store.getters.member_id);
                    Vue.set(q, 'id', res.auctionId);
                  } else {
                    const y = {
                      id: res.auctionId,
                      pay: {
                        value: res.value,
                        currency: res.currency
                      },
                      from: {
                        member_id: res.memberFromId,
                        name: res.memberFromName,
                        avatar: {
                          value: this.$imgSrc('void-img.png'),
                          position: res.memberFromPhoto.position
                        }
                      },
                      to: {
                        member_id: res.memberToId,
                        name: res.memberToName
                      }
                    };
                    try {
                      const w = await this.$fetchImage(
                        res.memberFromPhoto.value
                      );
                      if (!this.$isEmpty(w)) {
                        y.from.avatar.value = w;
                      }
                    } catch (e) {}
                    this.found[i].auctions.push(y);
                    this.$nextTick(() => {
                      const f = this.$el.querySelectorAll('.request');
                      const t = f[i];
                      if (t.classList.contains('active')) {
                        const pr = t.querySelector('.propositions');
                        const it = pr.querySelector('.item-container');
                        const c = it.parentElement;
                        const iCH = it.offsetHeight;
                        c.style.height = iCH + 'px';
                        if (this.mobile) {
                          const h = pr.closest('.hidden');
                          h.style.height = h.offsetHeight + iCH + 'px';
                        }
                      }
                    });
                  }
                }
              } else if (i === -1) {
                if (this.total > this.limit) {
                  if (this.page === this.pages) {
                    if (this.found.length === this.limit) {
                      ++this.pages;
                    } else {
                      let hasNoOpaq = false;
                      for (const t of this.$el.querySelectorAll(
                        '.make-proposition,.cancel-proposition'
                      )) {
                        if (!t.classList.contains('d-opaq')) {
                          hasNoOpaq = true;
                          this.interval = setInterval(() => {
                            let hasNoOpaq = false;
                            for (const a of this.$el.querySelectorAll(
                              '.make-proposition,.cancel-proposition'
                            )) {
                              if (!a.classList.contains('d-opaq')) {
                                hasNoOpaq = true;
                                break;
                              }
                            }
                            if (!hasNoOpaq) {
                              clearInterval(this.interval);
                              Vue.set(this, 'pageObj', { page: 0 });
                              this.$nextTick(() => {
                                Vue.set(this, 'pageObj', { page: this.page });
                              });
                            }
                          }, 1000);
                          break;
                        }
                      }
                      if (!hasNoOpaq) {
                        Vue.set(this, 'pageObj', { page: 0 });
                        this.$nextTick(() => {
                          Vue.set(this, 'pageObj', { page: this.page });
                        });
                      }
                    }
                  } else if (this.page !== this.pages) {
                    if (this.total / this.limit == this.pages) {
                      ++this.pages;
                    }
                  }
                } else if (this.total === this.limit) {
                  ++this.pages;
                } else {
                  let hasNoOpaq = false;
                  for (const t of this.$el.querySelectorAll(
                    '.make-proposition,.cancel-proposition'
                  )) {
                    if (!t.classList.contains('d-opaq')) {
                      hasNoOpaq = true;
                      this.interval = setInterval(() => {
                        let hasNoOpaq = false;
                        for (const a of this.$el.querySelectorAll(
                          '.make-proposition,.cancel-proposition'
                        )) {
                          if (!a.classList.contains('d-opaq')) {
                            hasNoOpaq = true;
                            break;
                          }
                        }
                        if (!hasNoOpaq) {
                          clearInterval(this.interval);
                          Vue.set(this, 'pageObj', { page: 0 });
                          this.$nextTick(() => {
                            Vue.set(this, 'pageObj', { page: this.page });
                          });
                        }
                      }, 1000);
                      break;
                    }
                  }
                  if (!hasNoOpaq) {
                    Vue.set(this, 'pageObj', { page: 0 });
                    this.$nextTick(() => {
                      Vue.set(this, 'pageObj', { page: this.page });
                    });
                  }
                }
              }
            }
          } else if (res.type === 'cancelled') {
            if (res.description !== 'new') {
              const i = this.found.findIndex((a) => a.id === res.claimId);
              const fI = this.found[i];
              const a = fI.auctions;
              if (a.length > 1) {
                a.splice(
                  a.findIndex((b) => b.id === res.auctionId),
                  1
                );
                this.$nextTick(() => {
                  const f = this.$el.querySelectorAll('.request');
                  const t = f[i];
                  if (t.classList.contains('active')) {
                    const pr = t.querySelector('.propositions');
                    const it = pr.querySelector('.item-container');
                    const c = it.parentElement;
                    const iCH = it.offsetHeight;
                    c.style.height = iCH + 'px';
                    if (this.mobile) {
                      const h = pr.closest('.hidden');
                      h.style.height = h.offsetHeight + iCH + 'px';
                    }
                  }
                });
              } else if (a.length === 1) {
                if (this.pages === 1) {
                  this.found.splice(i, 1);
                  try {
                    const y = document.querySelector('.active');
                    y.classList.remove('active');
                  } catch (e) {}
                } else if (this.pages > 1) {
                  if (this.page === this.pages) {
                    if (this.found.length === 1) {
                      Vue.set(this, 'pageObj', { page: 0 });
                      this.$nextTick(() => {
                        Vue.set(this, 'pageObj', { page: --this.page });
                      });
                    } else {
                      this.found.splice(i, 1);
                      try {
                        const y = document.querySelector('.active');
                        y.classList.remove('active');
                      } catch (e) {}
                    }
                  } else {
                    Vue.set(this, 'pageObj', { page: 0 });
                    this.$nextTick(() => {
                      Vue.set(this, 'pageObj', { page: this.page });
                    });
                  }
                }
              }
            }
          } else if (res.type === 'accepted') {
            const chosen =
              res.memberFromId === this.$store.getters.member_id
                ? res.memberToId
                : res.memberFromId;
            const i = this.found.findIndex((a) => a.id === res.claimId);
            const f = this.found[i];
            const a = f.auctions;
            if (a.length > 1) {
              const ids = [];
              const cs = a.filter(
                (b) => b.from.member_id !== chosen && b.to.member_id !== chosen
              );
              cs.forEach((d) => {
                const y =
                  d.from.member_id === this.$store.getters.member_id
                    ? d.to.member_id
                    : d.from.member_id;
                ids.push(
                  new Promise((resolve, reject) => {
                    (async () => {
                      try {
                        await this.$io.cancelAuction(f.collection, y, {
                          id: d.id,
                          description: 'finished'
                        });
                        resolve();
                      } catch (e) {
                        reject(e);
                      }
                    })();
                  })
                );
              });
              try {
                await Promise.all(ids);
              } catch (e) {
                this.$errorHandle(e);
              }
            }
            try {
              document
                .querySelector('.request.active')
                .classList.remove('active');
            } catch (error) {}
            if (this.pages === 1) {
              this.found.splice(i, 1);
            } else if (this.pages > 1) {
              if (this.pages === this.page) {
                if (this.found > 1) {
                  this.found.splice(i, 1);
                } else {
                  Vue.set(this, 'pageObj', { page: 0 });
                  this.$nextTick(() => {
                    Vue.set(this, 'pageObj', { page: --this.page });
                  });
                }
              } else {
                Vue.set(this, 'pageObj', { page: 0 });
                this.$nextTick(() => {
                  Vue.set(this, 'pageObj', { page: this.page });
                });
              }
            }
          } else if (res.type === 'partial_closed') {
            const f = this.found.find((a) => a.id === res.claimId);
            if (f !== null) {
              f.closingInitiator = res.memberFromId;
            }
          } else if (res.type === 'closed') {
            if (this.currentTab === 'process') {
              const i = this.found.findIndex((i) => i.id === res.claimId);
              if (i !== -1) {
                if (this.total > this.limit) {
                  if (this.page === this.pages) {
                    if (this.found.length === 1) {
                      Vue.set(this.pageObj, 'page', this.page - 1);
                    } else {
                      this.found.splice(i, 1);
                    }
                  } else if (this.page !== this.pages) {
                    Vue.set(this.pageObj, 'page', -1);
                    this.$nextTick(() => {
                      Vue.set(this.pageObj, 'page', this.page);
                    });
                  }
                } else {
                  this.found.splice(i, 1);
                }
              }
            }
          } else if (res.type === 'review') {
            if (res.memberFromId === this.$store.getters.member_id) {
              let clId = '';
              for (const i in res) {
                if (i.startsWith('claim')) {
                  clId = res[i];
                  break;
                }
              }
              const f = this.found.find((a) => a.id === clId);
              Vue.set(f, 'reviews', 1);
            }
          }
          const els = [
            this.$el.querySelector('[data-id="created"]'),
            this.$el.querySelector('[data-id="active"]'),
            this.$el.querySelector('[data-id="process"]')
          ];
          (async () => {
            try {
              const t = await this.$io.totalAuctions();
              t.forEach((d, i) => {
                const el = els[i];
                const b = el.querySelector('.bubble');
                if (d === 0) {
                  if (b !== null) {
                    b.remove();
                  }
                } else if (d !== 0) {
                  if (b === null) {
                    const s = document.createElement('span');
                    s.classList.add('bubble');
                    s.textContent = d;
                    el.appendChild(s);
                  } else {
                    b.textContent = d;
                  }
                }
              });
            } catch (e) {
              this.$errorHandle(e);
            }
          })();
        }
      });
    });
  },
  head() {
    return {
      title: '| Заявки'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/static/scss/role/requests.scss';
</style>

<style lang="scss">
@import '~/static/scss/_mix.scss';
@import '~/static/scss/_var.scss';
.requests {
  padding-top: 60px !important;
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
