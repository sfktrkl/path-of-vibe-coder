<template>
  <header class="game-header">
    <div class="header-content">
      <div class="character-info">
        <h1>{{ gameState.title }}</h1>
        <div class="money">${{ gameState.money }}</div>
      </div>

      <div class="learning-progress" v-if="currentLearning">
        <div class="progress-info">
          <span>Learning: {{ currentLearning.name }}</span>
          <span>{{ gameState.getLearningProgress() }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: `${gameState.getLearningProgress()}%` }"
          ></div>
        </div>
      </div>

      <nav class="navigation">
        <button
          v-for="view in views"
          :key="view.id"
          :class="['nav-button', { active: currentView === view.id }]"
          @click="$emit('view-change', view.id)"
        >
          {{ view.name }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
import { skills } from "../data/skills";

export default {
  name: "GameHeader",
  props: {
    currentView: {
      type: String,
      required: true,
    },
    gameState: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      views: [
        { id: "job", name: "Jobs" },
        { id: "skills", name: "Skills" },
        { id: "shop", name: "Shop" },
      ],
    };
  },
  computed: {
    currentLearning() {
      if (!this.gameState.currentLearning) return null;
      return skills[this.gameState.currentLearning];
    },
  },
};
</script>

<style scoped>
.game-header {
  background-color: #2c3e50;
  padding: 0;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  height: 220px;
  display: flex;
  align-items: flex-start;
  margin-top: 0;
  width: 100%;
  box-sizing: border-box;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 24px;
}

.character-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #ffffff;
}

.money {
  font-size: 1.25rem;
  color: #2ecc71;
  font-weight: bold;
}

.learning-progress {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.navigation {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  padding-bottom: 0;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: none;
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
