<template>
  <div class="game-content">
    <h2>{{ viewTitle }}</h2>
    <div class="view-content">
      <!-- Content will be added based on the current view -->
      <p>Content for {{ currentView }} view will be displayed here</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameContent",
  props: {
    currentView: {
      type: String,
      required: true,
    },
  },
  computed: {
    viewTitle() {
      const titles = {
        job: "Job Information",
        skills: "Skills & Experience",
        learn: "Learning Center",
        shop: "Shop",
      };
      return titles[this.currentView] || "Game Content";
    },
  },
};
</script>

<style scoped>
.game-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 16px;
}

.view-content {
  margin-top: 20px;
}
</style>
