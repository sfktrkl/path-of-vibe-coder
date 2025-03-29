<template>
  <header class="game-header">
    <div class="header-content">
      <div class="character-info">
        <div class="title">Title: {{ characterTitle }}</div>
        <div class="money">Money: ${{ money }}</div>
      </div>
      <nav class="navigation">
        <button
          v-for="button in navigationButtons"
          :key="button.id"
          :class="['nav-button', { active: currentView === button.id }]"
          @click="changeView(button.id)"
        >
          {{ button.label }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "GameHeader",
  data() {
    return {
      characterTitle: "Junior Developer",
      money: 1000,
      currentView: "job",
      navigationButtons: [
        { id: "job", label: "Job" },
        { id: "skills", label: "Skills" },
        { id: "learn", label: "Learn" },
        { id: "shop", label: "Shop" },
      ],
    };
  },
  methods: {
    changeView(view) {
      this.currentView = view;
      this.$emit("view-change", view);
    },
  },
};
</script>

<style scoped>
.game-header {
  background-color: #1a252f;
  color: #ffffff;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 0 1rem;
}

.character-info {
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.title,
.money {
  padding: 0.8rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-weight: 500;
}

.navigation {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  width: 100%;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 120px;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-button.active {
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
