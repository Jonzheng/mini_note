Component({
  data: {

  },

  properties: {
    width: {
      type: Number,
      value: 96
    },
    height: {
      type: Number,
      value: 50
    },
    borderRadius: {
      type: Number,
      value: 64
    },
    background: {
      type: String,
      value: '#2049EE'
    },
    active: {
      type: Boolean,
      value: true
    }
  },

  ready() {

  },

  methods: {
    toggle() {
      const active = !this.data.active;
      this.setData({ active });
      this.triggerEvent('change', { active });
    },
  },

});
