<template>
  <div
    class="progress-container"
    :class="{
      glowing: type === 'story' && progress == 100,
      single: isSingleProgressBar,
    }"
    :data-type="type"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="progress-info">
      <span class="label">{{ displayLabel }}</span>
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
    hoverLabel: {
      type: String,
      default: "",
    },
    isSingleProgressBar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    displayLabel() {
      if (
        this.type === "story" &&
        this.progress === 100 &&
        this.isHovered &&
        this.hoverLabel
      ) {
        return this.hoverLabel;
      }
      return this.label;
    },
  },
  methods: {
    handleClick() {
      if (this.type === "story") {
        this.$emit("story-complete-click");
      }
    },
    handleMouseEnter() {
      this.isHovered = true;
    },
    handleMouseLeave() {
      this.isHovered = false;
    },
  },
};
</script>

<style scoped>
.progress-container {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: all 0.3s ease;
  cursor: default;
  width: 100%;
  min-width: 200px;
  max-width: 100%;
}

/* When it's the only progress bar, take full width */
.progress-container.single {
  width: 100%;
  max-width: 100%;
}

/* When multiple progress bars exist, they'll stack */
@media (min-width: 768px) {
  .progress-container:not(.single) {
    width: calc(50% - 0.5rem);
    min-width: 200px;
  }
}

/* Ensure the container takes full width on mobile */
@media (max-width: 767px) {
  .progress-container {
    width: 100%;
    max-width: 100%;
  }
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
  justify-content: center;
  color: #ffffff;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  min-height: 1.2em;
  width: 100%;
}

.label {
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 0 0.5rem;
}

/* Only apply hover effects to story type progress bars at 100% progress */
.progress-container[data-type="story"]
  .progress[style*="width: 100%"]
  ~ .progress-info
  .label:hover {
  color: #ffd700;
  transition: color 0.2s ease;
}

/* Remove the general hover transition */
.progress-info {
  transition: none;
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
