import { mapState } from 'vuex';
import MarkerClusterer from '@google/markerclustererplus';

export default {
  data() {
    return {
      ready: false,
      found: [],
      requestObj: {}
    };
  },
  computed: {
    ...mapState(['readySelect', 'alwaysSelect'])
  },
  methods: {
    async showFound(obj, col = undefined) {
      if (this.google || this.$route.name === 'cabinet-requests') {
        const picBuffer = {};
        for (const i of obj) {
          let collection = 'cargo';
          const found = {};
          if (!col) {
            collection = this.collection;
          } else if (col) {
            if (i.claimCar) {
              collection = 'car';
              ({ ...i.claim } = i.claimCar);
            } else {
              ({ ...i.claim } = i.claimCargo);
            }
            found.collection = collection;
          }
          found.reviews = i.reviews;
          found.id = i.claim.id.value;
          found.closingInitiator = i.claim.closingInitiator.default;
          ({ ...found.status } = i.claim.status);
          if (!this.$isEmpty(i.auctions)) {
            found.auctions = [];
            for (const m of i.auctions) {
              let allowed = false;
              if (this.currentTab === 'closed') {
                if (m.status.created) {
                  allowed = true;
                }
              } else {
                allowed = true;
              }
              if (allowed) {
                const _from =
                  m.memberFrom.id.value === this.$store.getters.member_id
                    ? m.memberTo
                    : m.memberFrom;
                const _to =
                  m.memberFrom.id.value === this.$store.getters.member_id
                    ? m.memberFrom
                    : m.memberTo;
                const y = {
                  id: m.id.value,
                  date: m.date,
                  pay: {
                    currency: m.paymentPay.currency,
                    value: m.paymentPay.value
                  },
                  status: m.status,
                  from: {
                    name: _from.name.default,
                    member_id: m.memberFrom.id.value,
                    avatar: {
                      value: this.$imgSrc('void-img.png'),
                      position: _from.photo.position
                    }
                  },
                  to: {
                    name: _to.name.default,
                    member_id: m.memberTo.id.value,
                    avatar: {
                      value: this.$imgSrc('void-img.png'),
                      position: _to.photo.position
                    }
                  }
                };
                if (!picBuffer[_from.photo.value]) {
                  try {
                    const t = await this.$fetchImage(_from.photo.value);
                    if (!this.$isEmpty(t)) {
                      picBuffer[_from.photo.value] = t;
                      y.from.avatar.value = t;
                    }
                  } catch (e) {}
                } else {
                  y.from.avatar.value = picBuffer[_from.photo.value];
                }
                if (!picBuffer[_to.photo.value]) {
                  try {
                    const t = await this.$fetchImage(_to.photo.value);
                    if (!this.$isEmpty(t)) {
                      picBuffer[_to.photo.value] = t;
                      y.to.avatar.value = t;
                    }
                  } catch (e) {}
                } else {
                  y.to.avatar.value = picBuffer[_to.photo.value];
                }
                found.auctions.push(y);
              }
            }
            found.auctions.sort((a, b) => {
              const aD = new Date(a.date);
              const bD = new Date(b.date);
              if (aD > bD) {
                return -1;
              } else if (aD < bD) {
                return 1;
              } else {
                return 0;
              }
            });
          }
          found.routes = {
            from: [],
            to: []
          };
          let counter = 1;
          let flag = true;
          while (flag) {
            const f = i.routes.find((a) => {
              if (a.type.default === 'from' && a.order.default === counter) {
                return true;
              }
            });
            const t = i.routes.find((a) => {
              if (a.type.default === 'to' && a.order.default === counter) {
                return true;
              }
            });
            if (!this.$isEmpty(f)) {
              const r = {
                iso: f.iso.default,
                order: counter
              };
              ({ ...r.country } = f.country);
              if (f.city) {
                ({ ...r.city } = f.city);
              }
              if (f.street) {
                ({ ...r.street } = f.street);
              }
              if (f.home) {
                ({ ...r.home } = f.home);
              }
              found.routes.from.push(r);
            }
            if (!this.$isEmpty(t)) {
              const r = {
                iso: t.iso.default,
                order: counter
              };
              ({ ...r.country } = t.country);
              if (t.city) {
                ({ ...r.city } = t.city);
              }
              if (t.street) {
                ({ ...r.street } = t.street);
              }
              if (t.home) {
                ({ ...r.home } = t.home);
              }
              found.routes.to.push(r);
            }
            if (this.$isEmpty(f) && this.$isEmpty(t)) {
              flag = false;
            } else {
              ++counter;
            }
          }
          found.loadingTime = {
            always:
              i.claim.loadingTimeAlways.default === 0
                ? ''
                : this.alwaysSelect.find(
                    (a) => a.value === i.claim.loadingTimeAlways.default
                  ).title,
            ready:
              i.claim.loadingTimeReady.default === 0
                ? ''
                : this.readySelect.find(
                    (a) => a.value === i.claim.loadingTimeReady.default
                  ).title,
            calendar: {
              dateFrom: i.claim.loadingTimeByCalendar.time
                ? new Date(i.claim.loadingTimeByCalendar.dateFrom)
                    .toLocaleDateString()
                    .substr(0, 5)
                : '',
              dateBy: i.claim.loadingTimeByCalendar.time
                ? new Date(i.claim.loadingTimeByCalendar.dateBy)
                    .toLocaleDateString()
                    .substr(0, 5)
                : ''
            }
          };
          if (!this.$isEmpty(i.adrs)) {
            found.adrs = [];
            i.adrs.map((a) => {
              found.adrs.push(a.value.default);
            });
            found.adrs.sort((a, b) => this.sortBy(a, b));
          }
          found.permissionDocuments = [];
          i.permissionDocuments.map((a) => {
            found.permissionDocuments.push(a.value.default);
          });
          found.permissionDocuments.sort((a, b) => this.sortBy(a, b));
          if (i.claim[`${collection}CarsCount`].default !== 0) {
            found[`${collection}CarsCount`] =
              i.claim[`${collection}CarsCount`].default;
          }
          found.payment = {
            rateRequest: true,
            bargain: i.claim.paymentBargain.default,
            pay: {
              value: '',
              currency: ''
            },
            types: []
          };
          if (!i.claim.paymentRateRequest.default) {
            found.payment.rateRequest = false;
            found.payment.pay.value = i.claim.paymentPay.value;
            found.payment.pay.currency = i.claim.paymentPay.currency;
            this.proposition.currency = i.claim.paymentPay.currency;
            i.claim.paymentTypes.map((a) =>
              found.payment.types.push(a.value.default)
            );
          }
          if (!this.$isEmpty(i.claim.equipments)) {
            found.equipments = [];
            i.claim.equipments.map((a) => {
              found.equipments.push({
                title: a.name.default,
                value: a.value.default
              });
            });
            found.equipments.sort((a, b) => this.sortBy(a, b, 'title'));
          }
          if (!this.$isEmpty(i.claim.description.default)) {
            found.description = i.claim.description.default;
          }
          found.contact = {
            id: i.claim.contact.id.value,
            name: i.claim.contact.member.name.default,
            member_id: i.claim.contact.member.id.value
          };
          if (!this.$isEmpty(i.claim.contact.member.skype.default)) {
            found.contact.skype = i.claim.contact.member.skype.default;
          }
          if (!this.$isEmpty(i.claim.contact.member.facebook.default)) {
            found.contact.facebook = i.claim.contact.member.facebook.default;
          }
          if (!this.$isEmpty(i.claim.contact.member.instagram.default)) {
            found.contact.instagram = i.claim.contact.member.instagram.default;
          }
          if (!this.$isEmpty(i.claim.contact.member.facebook.default)) {
            found.contact.facebook = i.claim.contact.member.facebook.default;
          }
          if (!this.$isEmpty(i.claim.contact.member.phones)) {
            found.contact.phones = [];
            i.claim.contact.member.phones.map((a) => {
              const p = {
                value: a.value.default
              };
              ({ ...p.messenger } = a.messengerSupports);
              found.contact.phones.push(p);
            });
          }
          found.contact.role = i.claim.contact.role.name;
          if (!this.$isEmpty(i.claim.contact.member.photo.value)) {
            found.contact.avatar = {
              value: this.$imgSrc('void-img.png'),
              position: i.claim.contact.member.photo.position
            };
            if (!picBuffer[i.claim.contact.member.photo.value]) {
              const t = await this.$fetchImage(
                i.claim.contact.member.photo.value
              );
              if (!this.$isEmpty(t)) {
                picBuffer[i.claim.contact.member.photo.value] = t;
                found.contact.avatar.value = t;
              }
            } else {
              found.contact.avatar.value =
                picBuffer[i.claim.contact.member.photo.value];
            }
          }

          found.company = {
            id: i.claim.contact.company.id.value,
            name: i.claim.contact.company.name.default
          };
          if (!this.$isEmpty(i.claim.contact.company.skype.default)) {
            found.company.skype = i.claim.contact.company.skype.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.siteUrl.default)) {
            found.company.siteUrl = i.claim.contact.company.siteUrl.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.facebook.default)) {
            found.company.facebook = i.claim.contact.company.facebook.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.description.default)) {
            found.company.description =
              i.claim.contact.company.description.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.instagram.default)) {
            found.company.instagram = i.claim.contact.company.instagram.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.legalAddress.default)) {
            found.company.legalAddress =
              i.claim.contact.company.legalAddress.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.physicalAddress.default)) {
            found.company.physicalAddress =
              i.claim.contact.company.physicalAddress.default;
          }
          if (!this.$isEmpty(i.claim.contact.company.documents)) {
            [...found.company.documents] = i.claim.contact.company.documents;
          }
          if (!this.$isEmpty(i.claim.contact.company.phones)) {
            found.company.phones = [];
            i.claim.contact.company.phones.map((a) => {
              const p = {
                value: a.value.default
              };
              ({ ...p.messenger } = a.messengerSupports);
              found.company.phones.push(p);
            });
          }
          found.company.role = i.claim.contact.company.role.default;
          found.company.code = i.claim.contact.company.code.default;
          if (!this.$isEmpty(i.claim.contact.company.logo.value)) {
            found.company.avatar = {
              value: this.$imgSrc('void-img.png'),
              position: i.claim.contact.company.logo.position
            };
            if (!picBuffer[i.claim.contact.company.logo.value]) {
              const t = await this.$fetchImage(
                i.claim.contact.company.logo.value
              );
              if (!this.$isEmpty(t)) {
                picBuffer[i.claim.contact.company.logo.value] = t;
                found.company.avatar.value = t;
              }
            } else {
              found.company.avatar.value =
                picBuffer[i.claim.contact.company.logo.value];
            }
          }
          if (!this.$isEmpty(i.bodyTypes)) {
            found.bodyTypes = [];
            i.bodyTypes.map((a) => {
              found.bodyTypes.push(a.value.default);
            });
            found.bodyTypes.sort((a, b) => this.sortBy(a, b));
          }
          const weight = collection === 'car' ? 'carrying' : 'cargoWeight';
          const volume = collection === 'car' ? 'carVolume' : 'cargoVolume';
          found[volume] = i.claim[volume].default;
          found[weight] = i.claim[weight].default;
          found.loadingTypes = [];
          i.loadingTypes.map((a) => {
            found.loadingTypes.push(a.value.default);
          });
          found.loadingTypes.sort((a, b) => this.sortBy(a, b));
          if (i.claim[`${collection}Dimensions`].dimension) {
            found[`${collection}Dimensions`] = {
              length: i.claim[`${collection}Dimensions`].length,
              width: i.claim[`${collection}Dimensions`].width,
              height: i.claim[`${collection}Dimensions`].height
            };
          }
          if (i.claim.cargoName) {
            found.cargoName = i.claim.cargoName.default;
          }
          if (i.claim.cargoPackage) {
            found.cargoPackage = i.claim.cargoPackage.default;
          }
          this.found.push(found);
          this.$nextTick(() => {
            if (this.mobile) {
              setTimeout(() => {
                document.querySelector('html,body').scrollTo({
                  top: this.$el.querySelector('.tabs').offsetTop,
                  behavior: 'smooth'
                });
              }, 100);
            }
            if (!this.mobile) {
              if (!col) {
                const n =
                  this.$route.name === 'find-car' ||
                  this.$route.name === 'find-cargo'
                    ? 80
                    : 0;
                const wH = window.innerHeight;
                this.onMap.style.height = wH - 50 - n + 'px';
                // document.querySelector('html,body').scrollTo({
                //   top: 80,
                //   behavior: 'smooth'
                // });
                this.showOnMap(this.found);
              }
            }
            if (this.mobile) {
              this.mobLoading = false;
            } else {
              this.$screen(false);
            }
            setTimeout(() => {
              this.ready = !this.ready;
            }, 160);
          });
        }
      }
    },
    sortBy(a, b, param = undefined) {
      let a1 = a;
      let b1 = b;
      if (param) {
        a1 = isNaN(a[param]) ? a[param].toLowerCase() : a[param];
        b1 = isNaN(b[param]) ? b[param].toLowerCase() : b[param];
      } else if (!param) {
        if (isNaN(a)) {
          a1 = a.toLowerCase();
          b1 = b.toLowerCase();
        }
      }
      if (a1 > b1) {
        return 1;
      } else if (a1 < b1) {
        return -1;
      } else {
        return 0;
      }
    },
    showOnMap(items) {
      if (this.markers !== undefined) {
        this.markers.map((a) => {
          a.setVisible(false);
        });
        this.markerCluster.repaint();
      }
      const from = items[0].routes.from.find((a) => a.order === 1);
      this.markers = items.map((a) => {
        const to = a.routes.to.find((a) => a.order === 1);
        const from = a.routes.from.find((a) => a.order === 1);
        const date = (obj) => {
          if (
            this.$isEmpty(obj.loadingTime.always) &&
            this.$isEmpty(obj.loadingTime.ready)
          ) {
            return `${obj.loadingTime.calendar.dateFrom}-${obj.loadingTime.calendar.dateBy}`;
          } else if (this.$isEmpty(obj.loadingTime.always)) {
            return obj.loadingTime.ready;
          }
          return obj.loadingTime.always;
        };
        const fArr = [];
        const tArr = [];
        if (!this.$isEmpty(from.street.default)) {
          fArr.push(from.street.default);
        }
        if (!this.$isEmpty(from.home.default)) {
          fArr.push(from.home.default);
        }
        if (!this.$isEmpty(from.city.default)) {
          fArr.push(from.city.default);
        }
        fArr.push(from.country.default);
        if (!this.$isEmpty(to.street.default)) {
          tArr.push(to.street.default);
        }
        if (!this.$isEmpty(to.home.default)) {
          tArr.push(to.home.default);
        }
        if (!this.$isEmpty(to.city.default)) {
          tArr.push(to.city.default);
        }
        tArr.push(to.country.default);
        let lat, lng;
        if (!this.$isEmpty(from.home.default)) {
          lat = from.home.latitude;
          lng = from.home.longitude;
        } else if (this.$isEmpty(from.home.default)) {
          if (!this.$isEmpty(from.street.default)) {
            lat = from.street.latitude;
            lng = from.street.longitude;
          } else if (this.$isEmpty(from.street.default)) {
            if (!this.$isEmpty(from.city.default)) {
              lat = from.city.latitude;
              lng = from.city.longitude;
            } else if (this.$isEmpty(from.city.default)) {
              lat = from.country.latitude;
              lng = from.country.longitude;
            }
          }
        }

        return new this.google.maps.Marker({
          position: {
            lat,
            lng
          },
          id: a.id,
          title: `${fArr.join(', ')} -> ${tArr.join(', ')}
${a.bodyTypes.join('\\')}
${date(a)}`,
          // fromLat: from.latitude,
          // fromLng: from.longitude,
          // date:
          icon: '/images/marker.png'
        });
      });
      this.markerCluster = new MarkerClusterer(this.map, this.markers, {
        ignoreHidden: true,
        imagePath:
          'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
      if (!this.mobile) {
        this.hideAll({ target: this.$el.querySelector('.show-all') });
      }
      this.map.setZoom(this.mobile ? 5 : 6);
      this.map.setCenter({
        lat: from.country.latitude,
        lng: from.country.longitude
      });
      try {
        this.loading = false;
      } catch {}
      if (this.mobile) {
        this.mobLoading = false;
      } else {
        this.$screen(false);
      }
    }
  }
};
