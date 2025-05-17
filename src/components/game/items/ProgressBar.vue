<template>
  <div
    class="progress-container"
    :class="{ glowing: type === 'story' && isComplete }"
    @click="handleClick"
    :title="tooltip"
  >
    <div class="progress-info">
      <span>{{ label }}</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress"
        :style="{ width: `${progress}%` }"
        :class="{
          'job-progress': type === 'job',
          'story-progress': type === 'story',
        }"
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
      validator: (value) => ["learning", "job", "story"].includes(value),
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleClick() {
      if (this.type === "story" && this.isComplete) {
        this.$emit("story-complete-click");
      }
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
  transition: all 0.3s ease;
  cursor: default;
}

.progress-container.glowing {
  cursor: pointer;
  animation: glow 2s infinite;
}

.progress-container.glowing:hover {
  transform: scale(1.02);
  filter: brightness(1.2);
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(241, 196, 15, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
  }
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

.progress.story-progress {
  background-color: #f1c40f;
  box-shadow: 0 0 8px rgba(241, 196, 15, 0.3);
}
</style>
