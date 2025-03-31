<template>
  <div class="progress-container">
    <div class="progress-info">
      <span>{{ label }}</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress"
        :style="{ width: `${progress}%` }"
        :class="{ 'job-progress': type === 'job' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    label: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: "learning",
      validator: (value) => ["learning", "job"].includes(value),
    },
  },
};
</script>

<style scoped>
.progress-container {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.progress.job-progress {
  background-color: #e74c3c;
}
</style>
