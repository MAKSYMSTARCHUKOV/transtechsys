export default {
  data() {
    return {
      callback: () => {},
      close: () => this.$hideDialog()
    };
  },
  created() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.dialogAction,
      (newV, oldV) => {
        if (newV) {
          this.callback();
        }
      }
    );
    this.unwatch1 = this.$store.watch(
      (state, getters) => getters.dialogClose,
      (newV, oldV) => {
        if (newV) {
          this.close();
        }
      }
    );
  },
  beforeDestroy() {
    this.unwatch();
    this.unwatch1();
    // this.callback = () => this.$hideDialog();
    // this.close = () => this.$hideDialog();
  }
};
