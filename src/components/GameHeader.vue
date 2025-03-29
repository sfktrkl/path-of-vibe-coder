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
  background-color: #2c3e50;
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
  gap: 1rem;
}

.character-info {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
}

.title,
.money {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.navigation {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-button.active {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
