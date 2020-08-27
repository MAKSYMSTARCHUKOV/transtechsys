export default {
  mounted() {
    this.$nextTick(() => {
      const mSelect = document.querySelectorAll('.m-select,.m-input');
      for (let i = mSelect.length - 1; i >= 0; i--) {
        const sty = window.getComputedStyle(mSelect[i], null);
        const zI = sty.getPropertyValue('z-index');
        mSelect[i].style.zIndex = parseInt(zI, 10) + (mSelect.length - i) + '';
      }
    });
  }
};
