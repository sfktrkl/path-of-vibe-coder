<template>
  <div class="jobs-view">
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
</template>

<script>
import { jobs } from "@data/jobs";
import JobItem from "@items/JobItem.vue";

export default {
  name: "JobsView",
  components: {
    JobItem,
  },
  props: {
    gameState: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
};
</script>

<style scoped>
.jobs-view {
  overflow-x: hidden;
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
</style>
