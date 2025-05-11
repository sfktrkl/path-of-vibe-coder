<template>
  <div
    :class="[
      'item-base',
      {
        learned: gameState.hasSkill(skill.id),
        available: isAvailable,
        learning: gameState.getCurrentLearning() === skill.id,
      },
    ]"
    @click="
      gameState.hasSkill(skill.id) ||
      gameState.getCurrentLearning() === skill.id
        ? null
        : setCurrentLearning(skill.id)
    "
  >
    <div class="item-info">
      <span class="item-name">{{ skill.name }}</span>
      <span class="item-description">{{ skill.description }}</span>
    </div>
    <div class="item-status">
      <div
        v-if="gameState.getCurrentLearning() === skill.id"
        class="progress-container"
      >
        <div class="progress-bar">
          <div
            class="progress"
            :style="{
              width: `${gameState.getCurrentLearningProgress()}%`,
            }"
          ></div>
        </div>
      </div>
      <span
        v-else-if="gameState.hasSkill(skill.id)"
        class="status-badge learned-badge"
        >Learned</span
      >
      <span v-else class="status-badge available-badge">Available</span>
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
    setCurrentLearning(skillId) {
      this.gameState.setCurrentLearning(skillId);
    },
  },
};
</script>
