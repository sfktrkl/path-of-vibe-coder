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
import JobItem from "@items/JobItem.vue";
import dataMixin from "@mixins/dataMixin";

export default {
  name: "JobsView",
  components: {
    JobItem,
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
