<template>
  <div class="game-content">
    <h2>{{ viewTitle }}</h2>
    <div class="view-content">
      <!-- Skills View -->
      <div v-if="currentView === 'skills'" class="skills-view">
        <div class="skills-list">
          <div
            v-for="skill in sortedSkills"
            :key="skill.id"
            :class="[
              'skill-item',
              {
                learned: gameState.hasSkill(skill.id),
                available: isSkillAvailable(skill),
                learning: gameState.currentLearning === skill.id,
              },
            ]"
            @click="
              gameState.hasSkill(skill.id) ? null : startLearning(skill.id)
            "
          >
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-description">{{ skill.description }}</span>
            </div>
            <div class="skill-status">
              <div
                v-if="gameState.currentLearning === skill.id"
                class="learning-progress"
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
                class="learned-badge"
                >Learned</span
              >
              <span v-else-if="isSkillAvailable(skill)" class="available-badge"
                >Available</span
              >
              <span v-else class="locked-badge">Locked</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Job View -->
      <div v-if="currentView === 'job'" class="job-view">
        <div
          v-for="(jobs, category) in jobsByCategory"
          :key="category"
          class="career-path"
        >
          <h4>{{ category.charAt(0).toUpperCase() + category.slice(1) }}</h4>
          <div class="jobs-list">
            <div
              v-for="job in jobs"
              :key="job.id"
              :class="[
                'job-item',
                {
                  unlocked: gameState.isJobUnlocked(job.id),
                  current: gameState.currentJob === job.id,
                },
              ]"
              @click="
                gameState.isJobUnlocked(job.id)
                  ? gameState.setJob(job.id)
                  : null
              "
            >
              <div class="job-info">
                <span class="job-name">{{ job.name }}</span>
                <span class="job-salary">${{ job.salary }}</span>
              </div>
              <div class="job-status">
                <span
                  v-if="gameState.currentJob === job.id"
                  class="current-badge"
                  >Current</span
                >
                <span
                  v-else-if="gameState.isJobUnlocked(job.id)"
                  class="unlocked-badge"
                  >Available</span
                >
                <span v-else class="locked-badge">Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Center View -->
      <div v-if="currentView === 'learn'" class="learning-view">
        <h3>Learning Center</h3>
        <div v-if="gameState.currentLearning" class="current-learning">
          <h4>Currently Learning</h4>
          <p>{{ currentLearning.name }}</p>
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: `${gameState.getLearningProgress()}%` }"
            ></div>
          </div>
          <p>{{ gameState.getLearningProgress() }}% Complete</p>
        </div>
        <div v-else>
          <p>Select a skill to learn from the Skills tab</p>
        </div>
      </div>

      <!-- Shop View -->
      <div v-if="currentView === 'shop'" class="shop-view">
        <h3>Shop</h3>
        <p>Coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { skills } from "../data/skills";

export default {
  name: "GameContent",
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
      const titles = {
        job: "Job Information",
        skills: "Skills & Experience",
        learn: "Learning Center",
        shop: "Shop",
      };
      return titles[this.currentView] || "Game Content";
    },
    currentLearning() {
      if (!this.gameState.currentLearning) return null;
      return skills[this.gameState.currentLearning];
    },
    sortedSkills() {
      const allSkills = Object.values(skills);
      // Filter skills to only show learned, available, or currently learning
      const filteredSkills = allSkills.filter(
        (skill) =>
          this.gameState.hasSkill(skill.id) ||
          this.isSkillAvailable(skill) ||
          this.gameState.currentLearning === skill.id
      );
      // Sort skills by number of prerequisites (fewer prerequisites first)
      return filteredSkills.sort(
        (a, b) => a.prerequisites.length - b.prerequisites.length
      );
    },
    skillsByCategory() {
      const categories = this.gameState.getSkillsByCategory();
      // Filter out categories that have no available skills
      return Object.fromEntries(
        Object.entries(categories).filter(([, skills]) =>
          skills.some(
            (skill) =>
              this.isSkillAvailable(skill) || this.gameState.hasSkill(skill.id)
          )
        )
      );
    },
    jobsByCategory() {
      const categories = this.gameState.getJobsByCategory();
      // Filter out jobs that require skills we don't have
      Object.keys(categories).forEach((category) => {
        categories[category] = categories[category].filter((job) => {
          return job.requiredSkills.every((skill) =>
            this.gameState.hasSkill(skill)
          );
        });
      });
      // Filter out categories that have no available jobs
      return Object.fromEntries(
        Object.entries(categories).filter(([, jobs]) => jobs.length > 0)
      );
    },
  },
  methods: {
    startLearning(skillId) {
      this.gameState.startLearning(skillId);
    },
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
  background-color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

.view-content {
  margin-top: 20px;
}

.skills-grid,
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.skill-card,
.job-card {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-category {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.career-path {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.job-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.job-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.job-name {
  font-weight: 500;
  color: #ffffff;
}

.job-salary {
  color: #3498db;
  font-size: 0.9em;
}

.job-status {
  display: flex;
  align-items: center;
}

.current-badge,
.unlocked-badge,
.locked-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}

.current-badge {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.unlocked-badge {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.locked-badge {
  background-color: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
}

.job-item.current {
  background-color: rgba(52, 152, 219, 0.1);
  border-color: rgba(52, 152, 219, 0.3);
}

.job-item.unlocked {
  background-color: rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.3);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 8px 0;
}

.progress {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 4px 0;
  color: #ecf0f1;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.skill-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.skill-name {
  font-weight: 500;
  color: #ffffff;
}

.skill-description {
  color: #bdc3c7;
  font-size: 0.9em;
}

.skill-status {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.learning-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.learning-progress .progress-bar {
  width: 100px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.learning-progress .progress {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.learned-badge {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}

.available-badge {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}

.locked-badge {
  background-color: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
}

.skill-item.learned {
  background-color: rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.3);
}

.skill-item.available {
  background-color: rgba(52, 152, 219, 0.1);
  border-color: rgba(52, 152, 219, 0.3);
}

.skill-item.learning {
  background-color: rgba(52, 152, 219, 0.15);
  border-color: rgba(52, 152, 219, 0.4);
}
</style>
