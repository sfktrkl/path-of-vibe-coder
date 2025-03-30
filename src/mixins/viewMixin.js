export default {
  props: {
    gameState: {
      type: Object,
      required: true,
    },
  },
  computed: {
    viewTitle() {
      return {
        job: "Career Path",
        skills: "Skills",
        shop: "Shop",
      }[this.currentView];
    },
  },
};
