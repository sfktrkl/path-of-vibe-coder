<template>
  <div
    :class="[
      'item-base',
      {
        unlocked: gameState.isJobUnlocked(job.id),
        current: gameState.currentJob === job.id,
      },
    ]"
    @click="
      gameState.isJobUnlocked(job.id) && gameState.currentJob !== job.id
        ? gameState.setJob(job.id)
        : null
    "
  >
    <div class="item-info">
      <span class="item-name">{{ job.name }}</span>
      <span class="item-description">{{ job.description }}</span>
    </div>
    <div class="item-status">
      <span class="job-salary">${{ job.salary }}</span>
    </div>
  </div>
</template>

<script>
import "@styles/item-styles.css";

export default {
  name: "JobItem",
  props: {
    job: {
      type: Object,
      required: true,
    },
    gameState: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.job-salary {
  color: #2ecc71;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}
</style>
