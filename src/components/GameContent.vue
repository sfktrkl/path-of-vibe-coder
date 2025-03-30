<template>
  <div class="game-content">
    <h2>{{ viewTitle }}</h2>
    <!-- Skills View -->
    <div v-if="currentView === 'skills'" class="skills-view">
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

    <!-- Job View -->
    <div v-if="currentView === 'job'" class="job-view">
      <div v-for="(jobs, category) in jobsByCategory" :key="category">
        <h4>{{ category.charAt(0).toUpperCase() + category.slice(1) }}</h4>
        <div class="jobs-list">
          <JobItem
            v-for="job in jobs"
            :key="job.id"
            :job="job"
            :game-state="gameState"
          />
        </div>
      </div>
    </div>

    <!-- Shop View -->
    <div v-if="currentView === 'shop'" class="shop-view">
      <h3>Shop</h3>
      <p>Coming soon...</p>
    </div>
  </div>
</template>

<script>
import { skills } from "../data/skills";
import { jobs } from "../data/jobs";
import "../assets/styles/item-styles.css";
import SkillItem from "./SkillItem.vue";
import JobItem from "./JobItem.vue";

export default {
  name: "GameContent",
  components: {
    SkillItem,
    JobItem,
  },
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
  computed: {
    viewTitle() {
      return {
        job: "Career Path",
        skills: "Skills",
        shop: "Shop",
      }[this.currentView];
    },
    sortedSkills() {
      const allSkills = Object.values(skills);
      const filteredSkills = allSkills.filter(
        (skill) =>
          this.gameState.hasSkill(skill.id) ||
          this.isSkillAvailable(skill) ||
          this.gameState.currentLearning === skill.id
      );
      return filteredSkills.sort(
        (a, b) => a.prerequisites.length - b.prerequisites.length
      );
    },
    jobsByCategory() {
      const categories = {};
      Object.values(jobs).forEach((job) => {
        // Always show the starting job
        if (job.id === "everyday_normal_guy") {
          if (!categories[job.category]) {
            categories[job.category] = [];
          }
          categories[job.category].push(job);
          return;
        }

        // For other jobs, check if they're available
        if (this.gameState.isJobUnlocked(job.id)) {
          if (!categories[job.category]) {
            categories[job.category] = [];
          }
          categories[job.category].push(job);
        }
      });
      return categories;
    },
  },
  methods: {
    isSkillAvailable(skill) {
      // Check if all prerequisites are learned
      return skill.prerequisites.every((prereq) =>
        this.gameState.hasSkill(prereq)
      );
    },
  },
};
</script>

<style scoped>
.game-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  background-color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 24px;
  overflow-x: hidden;
}

h2 {
  margin-top: 0;
  color: #ffffff;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
}

h3 {
  color: #ffffff;
  margin-top: 24px;
  margin-bottom: 16px;
}

h4 {
  color: #ffffff;
  margin-top: 16px;
  margin-bottom: 8px;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skills-view,
.job-view,
.shop-view {
  overflow-x: hidden;
}
</style>
