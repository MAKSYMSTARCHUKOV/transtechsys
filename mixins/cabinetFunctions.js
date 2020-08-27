export default {
  methods: {
    toggleEdit(e) {
      const m = e.target.closest('.m-input') || e.target.closest('.role-input');
      try {
        if (!m.querySelector('.ok').classList.contains('d-none')) {
          m.querySelector('.ok').classList.add('d-none');
        }
        this.$justify(m);
      } catch {}
    },
    validateNumbers() {
      this.correct = true;
      for (const n of document.querySelectorAll('[name="memberPhone"]')) {
        if (n.value > 0) {
          const { ...r } = this.$validate({ phone: n.value });
          if (Object.keys(r).length > 0) {
            this.correct = false;
            n.classList.add('incorrect');
            n.nextElementSibling.textContent = r.phone;
          }
        }
      }
    },
    activateField(e) {
      const t = e.target;
      const m = t.closest('.m-input');
      if (!this.$store.state.data.companyName) {
        this.info = true;
        m.querySelector('.ok').classList.remove('d-none');
      }
    }
  }
};
