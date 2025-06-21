<template>
  <div class="skills-view">
    <div class="skills-list">
      <SkillItem
        v-for="skill in sortedSkills.filter(
          (s) =>
            gameState.isCompleteVisionActive() ||
            gameState.isRevealLockedActive() ||
            gameState.isSkillAvailable(s.id) ||
            gameState.hasSkill(s.id) ||
            gameState.getCurrentLearning() === s.id
        )"
        :key="skill.id"
        :skill="skill"
        :game-state="gameState"
        :is-available="gameState.isSkillAvailable(skill.id)"
      />
    </div>
  </div>
</template>

<script>
import SkillItem from "@items/SkillItem.vue";
import dataMixin from "@mixins/dataMixin";

export default {
  name: "SkillsView",
  components: {
    SkillItem,
  },
  mixins: [dataMixin],
  props: {
    gameState: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.skills-view {
  overflow-x: hidden;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
