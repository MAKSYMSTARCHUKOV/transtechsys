import axios from 'axios';

export default ({ app, $axios, store }, inject) => {
  const { CancelToken } = $axios;
  let cancel;

  function get(url, options = undefined, _key = undefined) {
    const opt = {
      headers: {
        common: {}
      },
      progress: false,
      cancelToken: new CancelToken((c) => {
        cancel = c;
      })
    };
    if (options) {
      const o = options;
      if (o.query) {
        const a = [];
        for (const p in o.query) {
          a.push(`${p}=${encodeURIComponent(o.query[p])}`);
        }
        url += '?' + a.join('&');
      }
      if (o.headers) {
        ({ ...opt.headers.common } = o.headers);
      }
      if (o.token) {
        if (_key) {
          opt.headers.common.Authorization = _key;
        } else {
          opt.headers.common.Authorization =
            app.$localstorage.get('token') || '';
        }
      }
    } else if (!options) {
      if (_key) {
        opt.headers.common.Authorization = _key;
      } else {
        opt.headers.common.Authorization = app.$localstorage.get('token') || '';
      }
    }
    return new Promise((resolve, reject) => {
      $axios
        .$get(url, opt)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(
                        get(url, options, process.server ? r : undefined)
                      );
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          }
        });
    });
  }

  function post(url, data, options = undefined, _key = undefined) {
    const opt = {
      headers: {
        common: {}
      },
      progress: false,
      cancelToken: new CancelToken((c) => {
        cancel = c;
      })
    };
    if (options) {
      const o = options;
      if (o.headers) {
        ({ ...opt.headers.common } = o.headers);
      }
      if (o.token) {
        if (_key) {
          opt.headers.common.Authorization = _key;
        } else {
          opt.headers.common.Authorization =
            app.$localstorage.get('token') || '';
        }
      } else if (!o.token) {
        if (_key) {
          opt.headers.common.Authorization = _key;
        } else {
          opt.headers.common.Authorization =
            app.$localstorage.get('token') || '';
        }
      }
    } else if (!options) {
      if (_key) {
        opt.headers.common.Authorization = _key;
      } else {
        opt.headers.common.Authorization = app.$localstorage.get('token') || '';
      }
    }
    return new Promise((resolve, reject) => {
      $axios
        .$post(url, data, opt)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(
                        post(url, data, options, process.server ? r : undefined)
                      );
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          }
        });
    });
  }

  function put(url, data, options = undefined, _key = undefined) {
    const CancelToken = axios.CancelToken;
    const opt = {
      headers: {},
      cancelToken: new CancelToken((c) => {
        cancel = c;
      })
    };
    if (options) {
      const o = options;
      if (o.headers) {
        ({ ...opt.headers } = o.headers);
      }
      if (o.token) {
        if (_key) {
          opt.headers.Authorization = _key;
        } else {
          opt.headers.Authorization = app.$localstorage.get('token') || '';
        }
      } else if (!o.token) {
        if (_key) {
          opt.headers.common.Authorization = _key;
        } else {
          opt.headers.common.Authorization =
            app.$localstorage.get('token') || '';
        }
      }
    } else if (!options) {
      if (_key) {
        opt.headers.Authorization = _key;
      } else {
        opt.headers.Authorization = app.$localstorage.get('token') || '';
      }
    }
    return new Promise((resolve, reject) => {
      axios
        .put(url, data, opt)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(
                        put(url, data, options, process.server ? r : undefined)
                      );
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          }
        });
    });
  }

  function remove(url, data, options = undefined, _key = undefined) {
    const CancelToken = axios.CancelToken;
    const opt = {
      headers: {},
      data,
      cancelToken: new CancelToken((c) => {
        cancel = c;
      })
    };
    if (options) {
      const o = options;
      if (o.headers) {
        ({ ...opt.headers } = o.headers);
      }
      if (o.token) {
        if (_key) {
          opt.headers.Authorization = _key;
        } else {
          opt.headers.Authorization = app.$localstorage.get('token') || '';
        }
      } else if (!o.token) {
        if (_key) {
          opt.headers.Authorization = _key;
        } else {
          opt.headers.Authorization = app.$localstorage.get('token') || '';
        }
      }
    } else if (!options) {
      if (_key) {
        opt.headers.Authorization = _key;
      } else {
        opt.headers.Authorization = app.$localstorage.get('token') || '';
      }
    }
    return new Promise((resolve, reject) => {
      axios
        .delete(url, opt)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(
                        remove(
                          url,
                          data,
                          options,
                          process.server ? r : undefined
                        )
                      );
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          }
        });
    });
  }

  function init(username, password) {
    return new Promise((resolve, reject) => {
      $axios
        .$post(
          '/api/token/get',
          { username, password },
          {
            progress: false
          }
        )
        .then((r) => {
          app.$localstorage.set('token', r.token, true);
          app.$localstorage.set('refresh_token', r.refresh_token, true);
          resolve('success');
        })
        .catch((e) => {
          reject(e.response || e);
        });
    });
  }

  function resetToken() {
    return new Promise((resolve, reject) => {
      $axios
        .$post(
          '/api/token/reset',
          {
            refresh_token: app.$localstorage.get('refresh_token')
          },
          {
            credentials: true,
            headers: {
              common: {
                Authorization: app.$localstorage.get('token')
              }
            }
          }
        )
        .then((r) => {
          app.$localstorage.set('token', r.token, true);
          resolve(r.token);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  function getBotInfo(code) {
    return get('/api/opendata/company', {
      query: {
        code
      }
    });
  }

  function getFopInfo(code) {
    return get('/api/opendata/fop', {
      query: {
        code
      }
    });
  }

  function getCarInfo(number) {
    return get('/api/opendata/car', {
      query: {
        number
      },
      token: true
    });
  }

  function signUp(data) {
    return post('/api/auth/signup', data, { token: false });
  }

  function resetPassword(email) {
    return post('/api/auth/reset_request', { email }, { token: false });
  }

  function updatePassword(obj) {
    return post('/api/auth/reset_handle', obj, { token: false });
  }

  function getCompanyInfo() {
    return get('/api/company/profile');
  }

  function getChunkCompanyInfo() {
    return get('/api/company/chunk_profile');
  }

  function getMemberInfo() {
    return get('/api/member/profile');
  }

  function setCompanyInfo(obj) {
    return new Promise((resolve, reject) => {
      let y;
      if (obj.phone) {
        const r = [];
        for (const p of obj.phone) {
          r.push(
            new Promise((resolve, reject) => {
              post('/api/company/phone', { p })
                .then((r) => {
                  resolve(r);
                })
                .catch((e) => {
                  reject(e.response || e);
                });
            })
          );
        }
        y = new Promise((resolve, reject) => {
          Promise.all(r)
            .then((re) => {
              resolve(re);
            })
            .catch((e) => {
              reject(e.response || e);
            });
        });
      }

      const req = [
        new Promise((resolve, reject) => {
          $axios
            .$post(
              '/api/company/legal_address',
              { legalAddress: obj.legalAddress },
              {
                headers: {
                  common: {
                    Authorization: app.$localstorage.get('token')
                  }
                }
              }
            )
            .then((r) => {
              resolve(r);
            })
            .catch((e) => {
              reject(e.response || e);
            });
        }),
        new Promise((resolve, reject) => {
          $axios
            .$post(
              '/api/company/code',
              { code: obj.code },
              {
                headers: {
                  common: {
                    Authorization: app.$localstorage.get('token')
                  }
                }
              }
            )
            .then((r) => {
              resolve(r);
            })
            .catch((e) => {
              reject(e.response || e);
            });
        }),
        new Promise((resolve, reject) => {
          $axios
            .$post(
              '/api/company/form',
              { form: obj.form },
              {
                headers: {
                  common: {
                    Authorization: app.$localstorage.get('token')
                  }
                }
              }
            )
            .then((r) => {
              resolve(r);
            })
            .catch((e) => {
              reject(e.response || e);
            });
        }),
        new Promise((resolve, reject) => {
          $axios
            .$post(
              '/api/company/name',
              { name: obj.name },
              {
                headers: {
                  common: {
                    Authorization: app.$localstorage.get('token')
                  }
                }
              }
            )
            .then((r) => {
              resolve(r);
            })
            .catch((e) => {
              reject(e.response || e);
            });
        })
      ];
      if (y) {
        req.push(y);
      }

      Promise.all(req)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  const change = {
    companyPhone: (obj) => {
      const p = {
        id: obj.id.value,
        value: obj.value.default,
        messengerSupports: obj.messengerSupports
      };
      return put('/api/company/phone', p);
    },
    memberPhone: (obj) => {
      const p = {
        id: obj.id.value,
        value: obj.value.default,
        messengerSupports: obj.messengerSupports
      };
      return put('/api/member/phone', p);
    }
  };

  const erase = {
    companyPhone: (obj) => {
      if (obj.id) {
        const i = {
          id: obj.id.value
        };
        return remove('/api/company/phone', i);
      }
    },
    companyDocument: (obj) => {
      if (obj.id) {
        const i = {
          id: obj.id.value
        };
        return remove('/api/company/document', { document: i });
      }
    },
    memberPhone: (obj) => {
      if (obj.id) {
        const i = {
          id: obj.id.value
        };
        return remove('/api/member/phone', i);
      }
    },
    memberDocument: (obj) => {
      if (obj.id) {
        const i = {
          id: obj.id.value
        };
        return remove('/api/member/document', { document: i });
      }
    },
    user: (id) => {
      return remove('/api/user/delete', { id });
    },
    car: (id) => {
      return remove('/api/car/delete', { id });
    },
    carPhoto: (carId, id) => {
      return remove('/api/car/photo', { carId, id });
    },
    carPassport: (carId, id) => {
      return remove('/api/car/passport', { carId, id });
    }
  };

  const user = {
    getUsers: (id = undefined) => {
      return get('/api/users' + (id ? '/' + id : ''), {
        token: !id
      });
    },
    getUser: (email) => {
      return post('/api/user', { email });
    },
    getDrivers: () => {
      return get('/api/user/drivers');
    },
    countManagers: () => {
      return get('/api/user/count_managers');
    },
    inviteUser: (role, email) => {
      return post('/api/user/invite_request', {
        userRole: role,
        userEmail: email
      });
    },
    register: (obj) => {
      return post('/api/user/invite_handle', obj, { token: false });
    }
  };

  const company = {
    getCompany: (
      page = undefined,
      perPage = undefined,
      search = undefined,
      id = undefined
    ) => {
      if (!id) {
        const n = search || '';
        return post(
          '/api/company/search',
          {
            name: n,
            sorting: {
              name: 'ASC'
            },
            page: page || 1,
            perPage: perPage || 5
          },
          { token: false }
        );
      }
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const i = await Promise.all([
              new Promise((resolve, reject) => {
                (async () => {
                  try {
                    const q = await get('/api/company/chunk_profile/' + id, {
                      token: false
                    });
                    // try {
                    //   q.companyLogo.value = await app.$fetchImage(
                    //     q.companyLogo.value
                    //   );
                    // } catch {}
                    resolve(q);
                  } catch (e) {
                    reject(e);
                  }
                })();
              }),
              new Promise((resolve, reject) => {
                (async () => {
                  try {
                    const q = await get('/api/users/' + id, {
                      token: false
                    });
                    const y = [];
                    for (const u of q) {
                      const { ...w } = JSON.parse(JSON.stringify(u.member));
                      let p = app.$imgSrc('void-img.png');
                      try {
                        const t = await app.$fetchImage(w.photo.value);
                        p = app.$isEmpty(t) ? p : t;
                      } catch (e) {}
                      w.photo.value = p;
                      w.role = u.role.name;
                      y.push(w);
                    }
                    resolve(y);
                  } catch (e) {
                    reject(e);
                  }
                })();
              })
            ]);
            if (!i[0].companyRole.toLowerCase().includes('sender')) {
              try {
                const c = await car.getCarParkTotals(undefined, id);
                i[2] = c;
              } catch (e) {
                reject(e);
              }
            }
            resolve(i);
          } catch (e) {
            reject(e);
          }
        })();
      });
    },
    companyPhysicalAddress: (str) => {
      return post('/api/company/physical_address', { physicalAddress: str });
    },
    companyDescription: (str) => {
      return post('/api/company/description', { description: str });
    },
    companyCode: (str) => {
      return post('/api/company/code', { code: str });
    },
    companySiteUrl: (str) => {
      return post('/api/company/site_url', { siteUrl: str });
    },
    companyFacebook: (str) => {
      return post('/api/company/facebook', { facebook: str });
    },
    companySkype: (str) => {
      return post('/api/company/skype', { skype: str });
    },
    companyInstagram: (str) => {
      return post('/api/company/instagram', { instagram: str });
    },
    companyDocument: (obj) => {
      const d = {
        name: obj.name.default,
        value: obj.value.default
      };
      return post('/api/company/document', d);
    },
    companyPhone: (obj) => {
      const p = {
        value: obj.value.default,
        messengerSupports: obj.messengerSupports
      };
      return post('/api/company/phone', p);
    },
    deleteRequest: () => {
      return post('/api/company/delete_request');
    },
    delete: (deleteKey) => {
      return post('/api/company/delete_handle', { deleteKey });
    }
  };

  const member = {
    memberDescription: (str) => {
      return post('/api/member/description', { description: str });
    },
    memberName: (str) => {
      return post('/api/member/name', { name: str });
    },
    memberFacebook: (str) => {
      return post('/api/member/facebook', { facebook: str });
    },
    memberSkype: (str) => {
      return post('/api/member/skype', { skype: str });
    },
    memberInstagram: (str) => {
      return post('/api/member/instagram', { instagram: str });
    },
    memberDocument: (obj) => {
      const d = {
        name: obj.name.default,
        value: obj.value.default
      };
      return post('/api/member/document', d);
    },
    memberPhone: (obj) => {
      const p = {
        value: obj.value.default,
        messengerSupports: obj.messengerSupports
      };
      return post('/api/member/phone', p);
    }
  };

  const images = {
    companyLogo: (obj) => {
      return post('/api/company/logo', obj);
    },
    companyPhoto: (obj) => {
      return post('/api/company/photo', obj);
    },
    memberPhoto: (obj) => {
      return post('/api/member/photo', obj);
    }
  };

  const claim = {
    publish: (collection, obj) => {
      return post(`/api/claim_${collection}/publication`, obj);
    },
    lists: (arg = undefined) => {
      const key = arg || app.$localstorage.get('token');
      return new Promise((resolve, reject) => {
        Promise.all([
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/adrs', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/cargo_names', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/packages', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/body_types', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/loading_types', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/currencies', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/payment_types', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/claim/equipments', {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          })
        ])
          .then((r) => {
            resolve({
              adrValues: r[0]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              cargoNameValues: r[1]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              packageValues: r[2]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              bodyTypeValues: r[3]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              loadingTypeValues: r[4]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              currencyValues: r[5]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              paymentTypeValues: r[6]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other'),
              equipmentValues: r[7]
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other')
            });
          })
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(claim.lists(r));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    get: (list) => {
      return new Promise((resolve, reject) => {
        get(`/api/claim/${list}`, { token: true })
          .then((r) => {
            resolve(
              r
                .map((a) => ({
                  value: a.id.value,
                  title: app.$capitalize(a.id.value)
                }))
                .filter((a) => a.value !== 'other')
            );
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    chooseLoadingTime: (collection, name, id, arg = undefined) => {
      const a = {
        [`claim${app.$capitalize(collection)}Id`]: id,
        always: '0'
      };
      const c = {
        [`claim${app.$capitalize(collection)}Id`]: id,
        dateFrom: '',
        dateBy: ''
      };
      const r = {
        [`claim${app.$capitalize(collection)}Id`]: id,
        ready: '0'
      };
      let p;
      switch (name) {
        case 'always':
          p = [
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  await claim.putAttr(
                    collection,
                    'loading_time_by_calendar',
                    c
                  );
                  resolve();
                } catch (e) {
                  reject(e);
                }
              })();
            }),
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  await claim.putAttr(collection, 'loading_time_ready', r);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              })();
            })
          ];
          break;
        case 'by_calendar':
          p = [
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  await claim.putAttr(collection, 'loading_time_always', a);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              })();
            }),
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  await claim.putAttr(collection, 'loading_time_ready', r);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              })();
            })
          ];
          break;
        case 'ready':
          p = [
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  await claim.putAttr(
                    collection,
                    'loading_time_by_calendar',
                    c
                  );
                  resolve();
                } catch (e) {
                  reject(e);
                }
              })();
            }),
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  await claim.putAttr(collection, 'loading_time_always', a);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              })();
            })
          ];
          break;
      }
      return new Promise((resolve, reject) => {
        Promise.all(p)
          .then((r) => resolve())
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(claim.chooseLoadingTime(collection, name, id, r));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    removePaymentTypes: (collection, ids, id, arg = undefined) => {
      const key = arg || app.$localstorage.get('token');
      const p = [];
      for (const i of ids) {
        p.push(
          new Promise((resolve, reject) => {
            axios
              .delete(`/api/claim_${collection}/payment_type`, {
                headers: {
                  Authorization: key
                },
                data: {
                  [`claim${app.$capitalize(collection)}Id`]: id,
                  id: i
                },
                cancelToken: new CancelToken((c) => {
                  cancel = c;
                })
              })
              .then((r) => {
                resolve();
              })
              .catch((e) => {
                reject(e.response || e);
              });
          })
        );
      }
      return new Promise((resolve, reject) => {
        if (app.$isEmpty(p)) {
          resolve();
        } else {
          Promise.all(p)
            .then((r) => {
              resolve();
            })
            .catch((e) => {
              if (e.response.data.message) {
                if (e.response.data.message.includes('Expired')) {
                  if (app.$localstorage.get('keep-sign-in')) {
                    resetToken()
                      .then((r) => {
                        resolve(
                          claim.removePaymentTypes(collection, ids, id, r)
                        );
                      })
                      .catch((e) => {
                        reject(e.response || e);
                      });
                  } else {
                    reject(e.response || e);
                  }
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            });
        }
      });
    },
    defaultPayment: (collection, id, arg = undefined) => {
      const key = arg || app.$localstorage.get('token');
      return new Promise((resolve, reject) => {
        Promise.all([
          new Promise((resolve, reject) => {
            $axios
              .$post(
                `/api/claim_${collection}/zeroing_payment_pay`,
                {
                  [`claim${app.$capitalize(collection)}Id`]: id
                },
                {
                  headers: {
                    common: {
                      Authorization: key
                    }
                  }
                }
              )
              .then((r) => resolve())
              .catch((e) => {
                reject(e);
              });
          }),
          new Promise((resolve, reject) => {
            if (collection === 'cargo') {
              $axios
                .$post(
                  `/api/claim_${collection}/zeroing_payment_prepay`,
                  {
                    [`claim${app.$capitalize(collection)}Id`]: id
                  },
                  {
                    headers: {
                      common: {
                        Authorization: key
                      }
                    }
                  }
                )
                .then((r) => resolve())
                .catch((e) => {
                  reject(e.response || e);
                });
            } else {
              resolve();
            }
          }),
          new Promise((resolve, reject) => {
            $axios
              .$post(
                `/api/claim_${collection}/payment_bargain`,
                {
                  [`claim${app.$capitalize(collection)}Id`]: id,
                  paymentBargain: false
                },
                {
                  headers: {
                    common: {
                      Authorization: key
                    }
                  }
                }
              )
              .then((r) => resolve())
              .catch((e) => {
                reject(e.response || e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$post(
                `/api/claim_${collection}/payment_rate_request`,
                {
                  [`claim${app.$capitalize(collection)}Id`]: id,
                  rateRequest: true
                },
                {
                  headers: {
                    common: {
                      Authorization: key
                    }
                  }
                }
              )
              .then((r) => resolve())
              .catch((e) => {
                reject(e.response || e);
              });
          }),
          new Promise((resolve, reject) => {
            $axios
              .$post(
                `/api/claim_${collection}/payment_show_proposition`,
                {
                  [`claim${app.$capitalize(collection)}Id`]: id,
                  showProposition: false
                },
                {
                  headers: {
                    common: {
                      Authorization: key
                    }
                  }
                }
              )
              .then((r) => resolve())
              .catch((e) => {
                reject(e.response || e);
              });
          }),
          new Promise((resolve, reject) => {
            if (collection === 'cargo') {
              $axios
                .$post(
                  `/api/claim_${collection}/payment_at_unloading`,
                  {
                    [`claim${app.$capitalize(collection)}Id`]: id,
                    paymentAtUnloading: false
                  },
                  {
                    headers: {
                      common: {
                        Authorization: key
                      }
                    }
                  }
                )
                .then((r) => resolve())
                .catch((e) => {
                  reject(e.response || e);
                });
            } else {
              resolve();
            }
          })
        ])
          .then((r) => {
            resolve();
          })
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(claim.defaultPayment(collection, id, r));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    zeroPayment: (collection, id, name) => {
      return post(`/api/claim_${collection}/zeroing_payment_${name}`, {
        [`claim${app.$capitalize(collection)}Id`]: id
      });
    },
    routeOrder: (collection, obj) => {
      return put(`/api/claim_${collection}/route_order`, obj);
    },
    draft: (collection) => {
      return get(`/api/claim_${collection}/draft`);
    },
    create: (collection) => {
      return post(`/api/claim_${collection}/create`);
    },
    delete: (collection, id) => {
      return remove(`/api/claim_${collection}/delete`, {
        id
      });
    },
    deleteDraft: (collection, id) => {
      return remove(`/api/claim_${collection}/draft`, { id });
    },
    putAttr: (collection, name, obj) => {
      return post(`/api/claim_${collection}/${name}`, obj);
    },
    deleteAttr: (collection, name, obj) => {
      return remove(`/api/claim_${collection}/${name}`, obj);
    }
  };

  const template = {
    create: (collection, obj) => {
      return post(`/api/template_claim_${collection}/create`, obj);
    },
    delete: (collection, id) => {
      return remove(`/api/template_claim_${collection}/delete`, {
        id
      });
    },
    get: (collection, page, limit, search = undefined) => {
      const query = {
        page,
        limit
      };
      if (search) {
        query.search = search;
      }
      return get(
        `/api/template_claim_${collection}`.concat(
          `${search ? '/by_name' : ''}`
        ),
        {
          query,
          token: true
        }
      );
    },
    total: (collection) => {
      return get(`/api/template_claim_${collection}/total`);
    },
    makeDraft: (collection, id) => {
      return post(`/api/claim_${collection}/create_by_template`, {
        [`templateClaim${app.$capitalize(collection)}Id`]: id
      });
    }
  };

  const request = {
    find: (collection, obj, unregistered = undefined) => {
      return post(
        `/api/claim_${collection}/search${unregistered ? '_unregister' : ''}`,
        obj,
        { token: !unregistered }
      );
    },
    getCreated: (page, perPage) => {
      return get(`/api/claims/created`, {
        query: {
          page,
          perPage
        },
        token: true
      });
    },
    getActive: (page, perPage) => {
      return get(`/api/claims/active`, {
        query: {
          page,
          perPage
        },
        token: true
      });
    },
    getProcess: (page, perPage) => {
      return get(`/api/claims/in_work`, {
        query: {
          page,
          perPage
        },
        token: true
      });
    },
    getClosed: (page, perPage) => {
      return get(`/api/claims/closed`, {
        query: {
          page,
          perPage
        },
        token: true
      });
    }
  };

  const blog = {
    get: (page, limit, id = undefined) => {
      if (id) {
        return get(`/api/blog/${id}`, {
          token: false
        });
      }
      return get('/api/blog', {
        query: {
          page,
          limit
        },
        token: false
      });
    }
  };

  const google = {
    autocomplete: (address) => {
      return get('/api/google/address_autocomplete', {
        query: {
          address
        },
        token: true
      });
    },
    getKey: () => {
      return get('/api/google/key', {
        token: true
      });
    },
    address: (address) => {
      return get('/api/google/address_object', {
        query: {
          address
        },
        token: true
      });
    },
    latLng: (latitude, longitude) => {
      return get('/api/google/address_lat_lng', {
        query: {
          latitude,
          longitude
        },
        token: true
      });
    }
  };

  const car = {
    allVehicleTypes: (arg = undefined) => {
      const key = arg || app.$localstorage.get('token');
      const tractors = new Promise((resolve, reject) => {
        $axios
          .$get('/api/car/tractors', {
            headers: { common: { Authorization: key } }
          })
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            reject(e);
          });
      });
      const semitrailers = new Promise((resolve, reject) => {
        $axios
          .$get('/api/car/semitrailers', {
            headers: { common: { Authorization: key } }
          })
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            reject(e);
          });
      });
      const trucks = new Promise((resolve, reject) => {
        $axios
          .$get('/api/car/trucks', {
            headers: { common: { Authorization: key } }
          })
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            reject(e);
          });
      });
      const trailers = new Promise((resolve, reject) => {
        $axios
          .$get('/api/car/trailers', {
            headers: { common: { Authorization: key } }
          })
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            reject(e);
          });
      });
      return new Promise((resolve, reject) => {
        Promise.all([tractors, semitrailers, trucks, trailers])
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(car.allVehicleTypes(r));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    getTotal: (obj) => {
      return get('/api/cars/total', { query: obj, token: true });
    },
    getCarParkTotal: (obj) => {
      return get('/api/cars_park/total', { query: obj, token: true });
    },
    getTotals: (arg = undefined) => {
      const v = [
        'CAR_TYPE_TRACTOR',
        'CAR_TYPE_SEMITRAILER',
        'CAR_TYPE_TRUCK',
        'CAR_TYPE_TRAILER'
      ];
      const r = [];
      const key = arg || app.$localstorage.get('token');
      for (const y of v) {
        r.push(
          new Promise((resolve, reject) => {
            $axios
              .$get('/api/cars/total?type=' + y, {
                headers: { common: { Authorization: key } }
              })
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          })
        );
      }
      return new Promise((resolve, reject) => {
        Promise.all(r)
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(car.getTotals(r));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    getCarParkTotals: (arg = undefined, id = undefined) => {
      const v = [
        'CAR_TYPE_TRACTOR',
        'CAR_TYPE_SEMITRAILER',
        'CAR_TYPE_TRUCK',
        'CAR_TYPE_TRAILER'
      ];
      const r = [];
      const key = arg || app.$localstorage.get('token');
      for (const y of v) {
        r.push(
          new Promise((resolve, reject) => {
            let h = {};
            if (id) {
              h.token = false;
            } else {
              ({ ...h } = {
                headers: { common: { Authorization: key } }
              });
            }
            $axios
              .$get(`/api/cars_park/total${id ? '/' + id : ''}?type=` + y, h)
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          })
        );
      }
      return new Promise((resolve, reject) => {
        Promise.all(r)
          .then((r) => {
            resolve(r);
          })
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(car.getCarParkTotals(r, id));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    editCar: (obj, arg = undefined) => {
      const key = arg || app.$localstorage.get('token');
      const r = [];
      for (const i in obj) {
        if (i !== 'id') {
          r.push(
            new Promise((resolve, reject) => {
              $axios
                .$post(
                  `/api/car/${i}`,
                  {
                    carId: obj.id,
                    [i]: obj[i]
                  },
                  { headers: { common: { Authorization: key } } }
                )
                .then((r) => {
                  resolve();
                })
                .catch((e) => {
                  reject(e);
                });
            })
          );
        }
      }
      return new Promise((resolve, reject) => {
        Promise.all(r)
          .then((r) => {
            resolve();
          })
          .catch((e) => {
            if (e.response.data.message) {
              if (e.response.data.message.includes('Expired')) {
                if (app.$localstorage.get('keep-sign-in')) {
                  resetToken()
                    .then((r) => {
                      resolve(car.editCar(obj, r));
                    })
                    .catch((e) => {
                      reject(e.response || e);
                    });
                } else {
                  reject(e.response || e);
                }
              } else {
                reject(e.response || e);
              }
            } else {
              reject(e.response || e);
            }
          });
      });
    },
    getCarPark: (obj) => {
      return get('/api/cars_park', { query: obj, token: true });
    },
    getVehicles: (obj) => {
      return get('/api/cars', { query: obj, token: true });
    },
    create: (obj) => {
      return post('/api/car/create', obj);
    },
    rental: (carId, rental) => {
      return post('/api/car/rental', { carId, rental });
    },
    euro: (carId, euro) => {
      return post('/api/car/euro', { carId, euro });
    },
    brand: (carId, brand) => {
      return post('/api/car/brand', { carId, brand });
    },
    model: (carId, model) => {
      return post('/api/car/model', { carId, model });
    },
    number: (carId, number) => {
      return post('/api/car/number', { carId, number });
    },
    vin: (carId, vin) => {
      return post('/api/car/vin', { carId, vin });
    },
    photo: (carId, value) => {
      return post('/api/car/photo', { carId, value });
    },
    passport: (carId, value) => {
      return post('/api/car/passport', { carId, value });
    }
  };

  const io = {
    getUnreadMessages: () => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const d = await io.getTotal();
            if (d.not_read > 0) {
              try {
                const query = {
                  page: 1,
                  limit: d.not_read,
                  is_read: 0
                };
                const t = await get('/api/chat/incoming-messages', {
                  query,
                  token: true
                });
                resolve(t);
              } catch (e) {
                reject(e);
              }
            } else {
              resolve({
                items: []
              });
            }
          } catch (e) {
            reject(e);
          }
        })();
      });
    },
    getChat: (id, page = undefined, limit = undefined) => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const d = await io.getTotal();
            try {
              const query = {
                page: page || 1,
                limit: limit || 100
              };
              const t = await get('/api/chat/messages/' + id, {
                query,
                token: true
              });
              ({ ...t.total } = d);
              resolve(t);
            } catch (e) {
              reject(e);
            }
          } catch (e) {
            reject(e);
          }
        })();
      });
    },
    getTotal: () => {
      return get('/api/chat/incoming-messages-count');
    },
    sendMessage: (id, message) => {
      return post(`/api/chat/message-send/${id}`, {
        content: message
      });
    },
    markRead: (ids) => {
      return put('/api/chat/mark-as-read', { ids });
    },
    getHistory: (id = undefined) => {
      if (id) {
        return get('/api/chat/messages/' + id, {
          query: {
            page: 1,
            limit: 100,
            is_read: 0
          },
          token: true
        });
      }
      return get('/api/chat/list', {
        query: {
          page: 1,
          limit: 100
        },
        token: true
      });
    },
    makeAuction: (collection, id, obj) => {
      return post(`/api/claim_${collection}_auction/create/${id}`, obj);
    },
    acceptAuction: (collection, id, obj) => {
      return put(`/api/claim_${collection}_auction/accept/${id}`, obj);
    },
    cancelAuction: (collection, id, obj) => {
      return remove(`/api/claim_${collection}_auction/cancel/${id}`, obj);
    },
    closeAuction: (collection, id, obj) => {
      return remove(`/api/claim_${collection}_auction/close/${id}`, obj);
    },
    totalAuctions: () => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const col = ['created', 'active', 'in_work'];
            const p = col.map((a) => {
              return new Promise((resolve, reject) => {
                (async () => {
                  try {
                    const tt = await get(`/api/claims/${a}/total`);
                    resolve(tt.total);
                  } catch (e) {
                    reject(e);
                  }
                })();
              });
            });
            const t = await Promise.all(p);
            resolve(t);
          } catch (e) {
            reject(e);
          }
        })();
      });
    }
  };

  const dpsu = {
    get: (id = undefined) => {
      if (id) {
        return get('/api/dpsu', {
          query: {
            id
          },
          token: false
        });
      } else {
        return get('/api/dpsu', { token: false });
      }
    }
  };

  const mail = {
    send: (obj) => {
      return post('/api/mailer/send', obj, { token: false });
    }
  };

  const review = {
    set: (reaction, collection, obj, memberToId) => {
      return post(
        `/api/claim_${collection}_review/${reaction}/${memberToId}`,
        obj
      );
    },
    getAll: (page, perPage, name) => {
      return post('/api/company/search_with_reviews', {
        name,
        sorting: {
          name: 'ASC'
        },
        page,
        perPage
      });
    },
    getLike: (page, perPage, name) => {
      return post('/api/company/search_with_likes', {
        name,
        sorting: {
          name: 'ASC'
        },
        page,
        perPage
      });
    },
    getNotLike: (page, perPage, name) => {
      return post('/api/company/search_with_not_likes', {
        name,
        sorting: {
          name: 'ASC'
        },
        page,
        perPage
      });
    }
  };

  inject('init', init);
  inject('get', get);
  inject('post', post);
  inject('getBotInfo', getBotInfo);
  inject('getFopInfo', getFopInfo);
  inject('getCarInfo', getCarInfo);
  inject('getCompanyInfo', getCompanyInfo);
  inject('getChunkCompanyInfo', getChunkCompanyInfo);
  inject('getMemberInfo', getMemberInfo);
  inject('signUp', signUp);
  inject('resetPassword', resetPassword);
  inject('updatePassword', updatePassword);
  inject('company', company);
  inject('blog', blog);
  inject('images', images);
  inject('member', member);
  inject('user', user);
  inject('car', car);
  inject('mail', mail);
  inject('io', io);
  inject('dpsu', dpsu);
  inject('review', review);
  inject('google', google);
  inject('claim', claim);
  inject('template', template);
  inject('request', request);
  inject('change', change);
  inject('erase', erase);
  inject('setCompanyInfo', setCompanyInfo);
  inject('cancel', () => {
    if (cancel) {
      cancel();
      cancel = undefined;
    }
  });
};
