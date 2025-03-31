<template>
  <div
    :class="[
      'item-base',
      {
        learned: gameState.hasSkill(skill.id),
        available: isAvailable,
        learning: gameState.currentLearning === skill.id,
      },
    ]"
    @click="gameState.hasSkill(skill.id) ? null : startLearning(skill.id)"
  >
    <div class="item-info">
      <span class="item-name">{{ skill.name }}</span>
      <span class="item-description">{{ skill.description }}</span>
    </div>
    <div class="item-status">
      <div
        v-if="gameState.currentLearning === skill.id"
        class="progress-container"
      >
        <div class="progress-bar">
          <div
            class="progress"
            :style="{
              width: `${gameState.getSkillProgress(skill.id)}%`,
            }"
          ></div>
        </div>
        <span>{{ gameState.getSkillProgress(skill.id) }}%</span>
      </div>
      <span
        v-else-if="gameState.hasSkill(skill.id)"
        class="status-badge learned-badge"
        >Learned</span
      >
      <span v-else-if="isAvailable" class="status-badge available-badge"
        >Available</span
      >
      <span v-else class="status-badge locked-badge">Locked</span>
    </div>
  </div>
</template>

<script>
import "@styles/item-styles.css";

export default {
  name: "SkillItem",
  props: {
    skill: {
      type: Object,
      required: true,
    },
    gameState: {
      type: Object,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    startLearning(skillId) {
      this.gameState.startLearning(skillId);
    },
  },
};
</script>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}

.learned-badge {
  background-color: #4a4a4a;
  color: #888;
}

.available-badge {
  background-color: #2ecc71;
  color: white;
}

.locked-badge {
  background-color: #e74c3c;
  color: white;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background-color: #1a1a1a;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #2ecc71;
  transition: width 0.3s ease;
}
</style>
