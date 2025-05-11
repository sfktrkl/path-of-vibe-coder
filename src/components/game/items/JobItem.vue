<template>
  <div
    :class="[
      'item-base',
      {
        unlocked: gameState.isJobUnlocked(job.id),
        current: gameState.getCurrentJob() === job.id,
      },
    ]"
    @click="
      gameState.isJobUnlocked(job.id) && gameState.getCurrentJob() !== job.id
        ? gameState.setCurrentJob(job.id)
        : null
    "
  >
    <div class="item-info">
      <span class="item-name">{{ job.name }}</span>
      <span class="item-description">{{ job.description }}</span>
    </div>
    <div class="item-status">
      <span class="job-salary">${{ job.salary }}</span>
      <span v-if="job.influenceGain" class="job-influence"
        >⚡{{ job.influenceGain }}</span
      >
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
.item-status {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.job-salary {
  color: #2ecc71;
  font-weight: bold;
}

.job-influence {
  color: #f1c40f;
  font-weight: bold;
  font-size: 0.9em;
}
</style>
