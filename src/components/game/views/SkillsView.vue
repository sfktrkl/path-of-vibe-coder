<template>
  <div class="skills-view">
    <div class="skills-list">
      <SkillItem
        v-for="skill in sortedSkills"
        :key="skill.id"
        :skill="skill"
        :game-state="gameState"
        :is-available="isSkillAvailable(skill)"
      />
    </div>
  </div>
</template>

<script>
import { skills } from "@data/skills";
import SkillItem from "@items/SkillItem.vue";

export default {
  name: "SkillsView",
  components: {
    SkillItem,
  },
  props: {
    gameState: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sortedSkills() {
      const allSkills = Object.values(skills);
      const filteredSkills = allSkills.filter(
        (skill) =>
          this.gameState.hasSkill(skill.id) ||
          this.isSkillAvailable(skill) ||
          this.gameState.currentLearning === skill.id
      );

      // Sort skills: learned at the bottom, maintain original order for others
      return filteredSkills.sort((a, b) => {
        // If one is learned and the other isn't, put learned at the bottom
        if (this.gameState.hasSkill(a.id) && !this.gameState.hasSkill(b.id))
          return 1;
        if (!this.gameState.hasSkill(a.id) && this.gameState.hasSkill(b.id))
          return -1;

        // For remaining skills, sort by prerequisites length
        return a.prerequisites.length - b.prerequisites.length;
      });
    },
  },
  methods: {
    isSkillAvailable(skill) {
      return skill.prerequisites.every((prereq) =>
        this.gameState.hasSkill(prereq)
      );
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
