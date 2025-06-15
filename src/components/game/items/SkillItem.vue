<template>
  <div
    :class="[
      'item-base',
      {
        learned: isLearned,
        available: isAvailable,
        learning: isLearning,
        locked: isLocked,
      },
    ]"
    @click="isLearned || isLearning ? null : setCurrentLearning(skill.id)"
  >
    <div class="item-info">
      <span class="item-name">{{ skill.name }}</span>
      <span class="item-description">{{ skill.description }}</span>
      <div v-if="isLocked" class="requirements">
        <div v-if="skill.prerequisites.length > 0" class="requirement-group">
          <span class="requirement-label">Prerequisites:</span>
          <span
            v-for="prereqId in skill.prerequisites"
            :key="prereqId"
            :class="['requirement-item', { met: gameState.hasSkill(prereqId) }]"
          >
            {{ getSkillName(prereqId) }}
          </span>
        </div>
        <div v-if="skill.requiresAIPath" class="requirement-group">
          <span class="requirement-label">Requires:</span>
          <span
            :class="[
              'requirement-item',
              { met: gameState.getAIPathUnlocked() },
            ]"
          >
            AI Path
          </span>
        </div>
        <div v-if="skill.requiresExistencePath" class="requirement-group">
          <span class="requirement-label">Requires:</span>
          <span
            :class="[
              'requirement-item',
              { met: gameState.getExistencePathUnlocked() },
            ]"
          >
            Existence Path
          </span>
        </div>
      </div>
    </div>
    <div class="item-status">
      <div v-if="isLearning" class="progress-container">
        <div class="progress-bar">
          <div
            class="progress"
            :style="{
              width: `${gameState.getCurrentLearningProgress()}%`,
            }"
          ></div>
        </div>
      </div>
      <span v-else-if="isLearned" class="status-badge learned-badge"
        >Learned</span
      >
      <span v-else-if="isAvailable" class="status-badge available-badge"
        >Available</span
      >
      <span v-else-if="isLocked" class="status-badge locked-badge">Locked</span>
    </div>
  </div>
</template>

<script>
import "@styles/item-styles.css";
import { skills } from "@data/skills";

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
  computed: {
    isLearned() {
      return this.gameState.hasSkill(this.skill.id);
    },
    isLearning() {
      return this.gameState.getCurrentLearning() === this.skill.id;
    },
    isLocked() {
      return (
        !this.isLearned &&
        !this.isAvailable &&
        this.gameState.isRevealLockedActive()
      );
    },
  },
  methods: {
    setCurrentLearning(skillId) {
      this.gameState.setCurrentLearning(skillId);
    },
    getSkillName(skillId) {
      return skills[skillId]?.name || skillId;
    },
  },
};
</script>
