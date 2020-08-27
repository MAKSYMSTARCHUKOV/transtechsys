export default (c, inject) => {
  inject('imgSrc', (src) => {
    return `/images/${src}`;
  });
  inject('storage', (arg) => {
    return `tts_${arg}`;
  });
};
