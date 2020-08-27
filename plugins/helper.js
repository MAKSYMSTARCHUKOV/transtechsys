import Cookies from 'universal-cookie';
import { Base64 } from 'js-base64';
let cookie;

export default ({ app, req, store, route, redirect, env }, inject) => {
  inject('validate', (obj) => {
    const resp = {};
    const regs = {
      email: {
        reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Введите правильный e-mail'
      },
      phone: {
        reg: /^\+[()-\s0-9]{10,19}$/,
        message: 'Введите правильный номер телефона'
      },
      code: {
        reg: /^\d{8}|\d{10}$/,
        message: 'Введите правильный ЕГРПОУ/ИНН'
      },
      password: {
        reg: /^.{6,}$/,
        message: 'Введите не менее 6 символов'
      },
      carNumber: {
        reg: /^([А-ЯІ]{2}\d{4}[А-ЯІ]{2})|(\d{3}-\d{2}[А-ЯІ]{2})$/,
        message: 'Введите гос.номер формата АА1234ББ или 123-45ББ'
      },
      year: {
        reg: (() => {
          const year = (new Date().getFullYear() + '').split('');
          return new RegExp(
            `^(19[0-9][0-9])|(20[0-${year[2] - 1}][0-9])|(20${year[2]}[0-${
              year[3]
            }])$`
          );
        })(),
        message: 'Введите год в формате 1909'
      },
      vin: {
        reg: /^[A-Z0-9]{17}$/,
        message: 'VIN состоит из 17 символов (латинские буквы и цифры)'
      }
    };
    for (const i in obj) {
      if (!regs[i].reg.test(obj[i])) {
        resp[i] = regs[i].message;
      }
    }
    return resp;
  });
  inject('localstorage', {
    get: (arg) => {
      if (process.browser) {
        cookie = new Cookies();
      } else {
        cookie = new Cookies(req.headers.cookie);
      }
      return cookie.get(app.$storage(arg));
    },
    set: (...arg) => {
      const opt = { path: '/' };
      if (arg[2]) {
        opt.maxAge = 2592000;
      }
      if (arg[3]) {
        for (const i in arg[3]) {
          opt[i] = arg[3][i];
        }
      }
      if (process.browser) {
        cookie = new Cookies();
      } else {
        cookie = new Cookies(req.headers.cookie);
      }
      cookie.set(app.$storage(arg[0]), arg[1], opt);
    },
    remove: (arg) => {
      if (process.browser) {
        cookie = new Cookies();
      } else {
        cookie = new Cookies(req.headers.cookie);
      }
      cookie.remove(app.$storage(arg), { path: '/' });
    }
  });
  inject('reject', (e) => {
    const t = e.target;
    t.classList.remove('incorrect');
    if (store.getters.error) {
      app.$error();
    }
    setTimeout(() => {
      t.nextElementSibling.textContent = '';
      try {
        document.querySelector('.error-message').style.display = 'none';
      } catch {}
    }, 150);
  });
  inject('allCorrect', (form) => {
    for (const i of form.querySelectorAll('.incorrect')) {
      app.$reject({ target: i });
    }
  });
  inject('incorrect', (e) => {
    const t = e.target;
    t.classList.add('incorrect');
    if (e.error !== '*') {
      t.nextElementSibling.textContent =
        e.error || 'Обязательно для заполнения';
    }
  });
  inject('capitalize', (str) => {
    try {
      return str[0].toUpperCase() + str.substr(1);
    } catch {
      return str;
    }
  });
  inject('toggle', (el) => {
    try {
      if (el.classList.contains('loading')) {
        el.classList.remove('loading');
      } else {
        el.classList.add('loading');
      }
    } catch (error) {}
  });
  inject('waiting', (el, state) => {
    if (!state) {
      el.classList.remove('waiting');
    } else {
      el.classList.add('waiting');
    }
  });
  inject('random', (arr) => {
    let n = Math.floor(Math.random() * (1000 - 1) + 1);
    while (arr.includes(n)) {
      n = Math.floor(Math.random() * (1000 - 1) + 1);
    }
    return n;
  });
  inject('error', (e, message = undefined) => {
    if (!e) {
      store.commit('setError', [false, '']);
    } else {
      console.log(e);
      let mes;
      if (e.data) {
        mes = e.data.message || e.data.error || e.data.detail || null;
      } else {
        mes = e || null;
      }
      const status = e.status;
      let m = `${status} | ${mes}`;
      if (status === 403) {
        m = 'Электронный адрес не подтвержден. Проверьте электронную почту';
      } else if (status === 413) {
        m = 'Файл слишком большой. Загрузка не удалась.';
      } else if (mes) {
        if (typeof mes === 'string') {
          if (mes.includes('Incorrect or already confirmed token')) {
            m =
              'Произошла ошибка. Пожалуйста, снова пройдите операцию сброса пароля.';
          } else if (mes.includes('User already exists with this email')) {
            m = 'Сотрудник с таким e-mail уже существует.';
          } else if (mes.includes('length exceeded')) {
            m =
              'Допустимое количество символов перевышено. Введите не более 1000 символов.';
          } else if (mes.includes('Company already exists with this code')) {
            m =
              'Компания уже существует с данным кодом. Если хотите зарегистрироваться — обратитесь к менеджеру данной компании.';
          } else if (mes.includes('Car already exists')) {
            m = 'Такой транспорт уже зарегистрирован.';
          }
        } else {
          m = mes;
        }
      }
      store.commit('setError', [true, m]);
    }
    if (message) {
      store.commit('setError', [true, message]);
    }
  });
  inject('errorHandle', (e) => {
    if (e.status === 403 || e.status === 401) {
      store.commit('setState', { logged: false });
      redirect({
        name: 'main',
        query: {
          status: 'unauthorized',
          from: route.path,
          reload: true
        }
      });
    }
    console.log(e);
    if (e.data) {
      if (e.message) {
        if (e.message.includes('canceled')) {
        } else {
          app.$error(e);
        }
      } else {
        app.$error(e);
      }
    } else {
      app.$error(e);
    }
  });
  inject('justify', (com) => {
    const p = com.querySelector('.icon-slot.prepend');
    const a = com.querySelector('.icon-slot:not(.prepend)');
    const t = com.querySelector('[type="text"]');
    t.style.paddingLeft = p.offsetWidth + 10 + 'px';
    t.style.paddingRight = a.offsetWidth + 10 + 'px';
  });
  inject('isEmpty', (obj) => {
    if (obj === null) {
      return true;
    }
    if (obj === undefined) {
      return true;
    }
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.length === 0;
      } else if (Object.keys(obj).length === 0) {
        return JSON.stringify(obj) === '{}';
      }
    } else {
      return obj === '';
    }
    return false;
  });
  inject('dialog', (obj) => {
    store.commit('profile/showDialog', obj);
  });
  inject('hideDialog', () => {
    store.commit('profile/hideDialog');
  });
  inject('generator', (times) => {
    return (function* g(times) {
      for (let i = 0; i < times - 1; i++) {
        yield;
      }
    })(times);
  });
  inject('dataBlob', (data) => {
    const arr = Base64.atob(data.split(',')[1]);
    const mime = data.split(';')[0].split(':')[1];
    let n = arr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = arr.charCodeAt(n);
    }
    return { data: [u8arr], type: mime };
  });
  inject('scrollTop', (top = undefined) => {
    document.querySelector('html,body').scrollTo({
      behavior: 'smooth',
      top: top || '0'
    });
  });

  inject('toISOString', (date) => {
    date.setHours(3, 0, 0, 0);
    return date.toISOString().split('T')[0];
  });

  inject('screen', (flag) => {
    store.commit('setScreen', flag);
  });

  inject('isEqual', (def, check) => {
    if (def === null) {
      if (check !== null) {
        return false;
      }
    } else if (def === undefined) {
      if (check !== undefined) {
        return false;
      }
    } else if (typeof def === 'number') {
      if (typeof check !== 'number' || def !== check) {
        return false;
      }
    } else if (typeof def === 'string') {
      if (typeof check !== 'string' || def !== check) {
        return false;
      }
    } else if (typeof def === 'boolean') {
      if (typeof check !== 'boolean' || def !== check) {
        return false;
      }
    } else if (typeof def === 'object') {
      if (typeof check !== 'object') {
        return false;
      } else {
        let noMatch = [];
        if (!Array.isArray(def)) {
          if (Array.isArray(check)) {
            return false;
          } else {
            const dK = Object.keys(def);
            const cK = Object.keys(check);
            if (def.getTime) {
              if (!check.getTime) {
                return false;
              } else {
                return app.$isEqual(def.getTime(), check.getTime());
              }
            }
            if (dK.length !== cK.length) {
              return false;
            } else {
              noMatch = cK.filter((a) => !dK.includes(a));
              if (!app.$isEmpty(noMatch)) {
                return false;
              } else if (app.$isEmpty(noMatch)) {
                if (!app.$isEmpty(dK)) {
                  for (const i of dK) {
                    if (!app.$isEqual(def[i], check[i])) {
                      return false;
                    }
                  }
                }
              }
            }
          }
        }
        if (Array.isArray(def)) {
          if (!Array.isArray(check)) {
            return false;
          } else if (Array.isArray(check)) {
            if (def.length !== check.length) {
              return false;
            } else if (def.length === check.length) {
              if (!app.$isEmpty(def)) {
                let hasMatch = false;
                for (const d of def) {
                  for (const c of check) {
                    if (app.$isEqual(d, c)) {
                      hasMatch = true;
                      break;
                    }
                  }
                  if (!hasMatch) {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
    return true;
  });
  inject('turn', function*(times) {
    for (let i = 0; i < times - 1; i++) {
      yield;
    }
  });
  inject('zIndexing', () => {
    setTimeout(() => {
      const mSelect = document.querySelectorAll('.m-select,.m-input,.m-button');
      for (let i = mSelect.length - 1; i >= 0; i--) {
        mSelect[i].style.zIndex = mSelect.length - i + '';
      }
    }, 100);
  });
  inject('feedback', () => {
    store.commit('setOverlayMode', 'feedback');
    store.commit('setOverlayVisible', true);
  });
  inject('fetchImage', async (link) => {
    if (app.$isEmpty(link)) {
      return '';
    }
    try {
      let r;
      if (process.server) {
        r = await fetch(`${env.DOMAIN}/uploads${link}`);
      } else {
        r = await fetch(`/uploads${link}`);
      }
      const t = await r.text();
      return t;
    } catch (e) {
      return '';
    }
  });
  inject('prettyCompany', (obj) => {
    const c = {};
    if (!app.$isEmpty(obj.companyDocuments)) {
      [...c.documents] = obj.companyDocuments;
    }
    if (!app.$isEmpty(obj.companyDescription)) {
      c.description = obj.companyDescription;
    }
    if (!app.$isEmpty(obj.companyFacebook)) {
      c.facebook = obj.companyFacebook;
    }
    if (!app.$isEmpty(obj.companyInstagram)) {
      c.instagram = obj.companyInstagram;
    }
    if (!app.$isEmpty(obj.companySiteUrl)) {
      c.siteUrl = obj.companySiteUrl;
    }
    if (!app.$isEmpty(obj.companySkype)) {
      c.skype = obj.companySkype;
    }
    if (!app.$isEmpty(obj.companyLegalAddress)) {
      c.legalAddress = obj.companyLegalAddress;
    }
    if (!app.$isEmpty(obj.companyPhysicalAddress)) {
      c.physicalAddress = obj.companyPhysicalAddress;
    }
    c.name = obj.companyName;
    c.role = obj.companyRole;
    c.rate = obj.companyRate || 0;
    c.code = obj.companyCode;
    c.avatar = obj.companyLogo;
    if (!app.$isEmpty(obj.companyPhones)) {
      c.phones = [];
      obj.companyPhones.forEach((d, i) => {
        c.phones.push({
          messenger: d.messengerSupports,
          value: d.value.default
        });
      });
    }
    return c;
  });
};
