<template>
  <header class="game-header">
    <div class="header-content">
      <div
        class="character-info"
        :class="{ 'default-title': !gameState.getCurrentJob() }"
      >
        <h1>
          <template v-if="isPureExistence">
            You have acceded the limits. Congratulations!
          </template>
          <template v-else>
            {{ currentJob ? currentJob.name : "Path of Vibe Coder" }}
          </template>
        </h1>
        <template v-if="!isPureExistence">
          <div class="stats">
            <div class="money">${{ gameState.getMoney() }}</div>
            <div
              v-if="hasInfluenceGainJobs || gameState.getInfluence() > 0"
              class="influence"
            >
              <span class="influence-icon">⚡</span
              >{{ gameState.getInfluence() }}
            </div>
          </div>
          <div
            class="item-effects"
            v-if="totalItemEffects && gameState.getCurrentJob()"
          >
            <div
              v-for="(value, effect) in filteredItemEffects"
              :key="effect"
              class="effect"
            >
              <span class="effect-name">{{ formatEffectName(effect) }}:</span>
              <span class="effect-value">{{
                formatEffectValue(effect, value)
              }}</span>
            </div>
          </div>
        </template>
      </div>

      <div
        class="progress-bars"
        v-if="
          !isPureExistence &&
          (hasInfluenceGainJobs || gameState.getInfluence() > 0) &&
          !gameState.getExistencePathUnlocked()
        "
      >
        <ProgressBar
          :label="currentStoryStage?.message || 'Begin your journey'"
          :hoverLabel="
            storyProgressPercentage === 100 ? 'Transcend into existence' : ''
          "
          :progress="storyProgressPercentage"
          type="story"
          @story-complete-click="handleStoryProgressClick"
        />
      </div>

      <div
        class="progress-bars"
        v-if="!isPureExistence && (currentLearning || currentJob)"
      >
        <ProgressBar
          v-if="currentLearning"
          :label="`Learning: ${currentLearning.name}`"
          :progress="gameState.getCurrentLearningProgress()"
          type="learning"
        />

        <ProgressBar
          v-if="currentJob"
          :label="`Working: ${currentJob.name}`"
          :progress="gameState.getCurrentJobProgress()"
          type="job"
        />
      </div>

      <nav class="navigation">
        <button
          v-for="view in filteredViews"
          :key="view.id"
          :class="['nav-button', { active: currentView === view.id }]"
          @click="$emit('view-change', view.id)"
        >
          {{ view.name }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
import { jobs } from "@data/jobs";
import { skills } from "@data/skills";
import dataMixin from "@mixins/dataMixin";
import ProgressBar from "@items/ProgressBar.vue";

export default {
  name: "GameHeader",
  components: {
    ProgressBar,
  },
  mixins: [dataMixin],
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
  data() {
    return {
      views: [
        { id: "job", name: "Jobs" },
        { id: "skills", name: "Skills" },
        { id: "shop", name: "Shop" },
        { id: "save", name: "Save/Load" },
      ],
    };
  },
  computed: {
    isPureExistence() {
      return this.gameState.isPureExistenceActive();
    },
    filteredViews() {
      if (this.isPureExistence) {
        return this.views.filter((v) => v.id === "job" || v.id === "save");
      }
      return this.views;
    },
    currentLearning() {
      if (!this.gameState.getCurrentLearning()) return null;
      return skills[this.gameState.getCurrentLearning()];
    },
    currentJob() {
      if (!this.gameState.getCurrentJob()) return null;
      return jobs[this.gameState.getCurrentJob()];
    },
    totalItemEffects() {
      return this.gameState.getItemEffects();
    },
    filteredItemEffects() {
      const effects = { ...this.totalItemEffects };
      // Only remove influenceBoost if it's not active (value <= 1)
      if (!this.hasInfluenceBoost) {
        delete effects.influenceBoost;
      }
      return effects;
    },
    hasInfluenceGainJobs() {
      // Check if any unlocked jobs have influenceGain
      return Object.values(jobs).some(
        (job) => job.influenceGain && this.gameState.isJobUnlocked(job.id)
      );
    },
    hasInfluenceBoost() {
      return (
        this.totalItemEffects.influenceBoost &&
        this.totalItemEffects.influenceBoost > 1
      );
    },
    currentStoryStage() {
      return this.gameState.getCurrentStoryStage();
    },
    storyProgressPercentage() {
      return this.gameState.getStoryProgressPercentage();
    },
    storyProgressTitle() {
      return this.currentStoryStage?.message || "Begin your journey";
    },
  },
  methods: {
    handleStoryProgressClick() {
      if (this.gameState.checkExistencePathUnlock()) {
        this.gameState.unlockExistencePath();
      }
    },
  },
};
</script>

<style scoped>
.game-header {
  background-color: #2c3e50;
  padding: 0;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: flex-start;
  margin-top: 0;
  width: 100%;
  box-sizing: border-box;
  min-height: 140px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 16px;
  min-height: 140px;
}

.character-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  height: auto;
  min-height: 48px;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.character-info.default-title {
  justify-content: center;
}

.character-info.default-title .money {
  display: none;
}

h1 {
  margin: 0;
  font-size: 1.1rem;
  color: #ffffff;
}

.stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.money {
  font-size: 1.1rem;
  color: #2ecc71;
  font-weight: bold;
}

.influence {
  font-size: 1.1rem;
  color: #f1c40f;
  font-weight: bold;
  display: flex;
  align-items: baseline;
}

.influence-icon {
  font-size: 0.7em;
  line-height: 1;
  display: inline-block;
  transform: translateY(-0.1em);
  margin-right: 0.1em;
}

.story-section {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.story-message {
  color: #f1c40f;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-style: italic;
  text-align: center;
}

.story-progress {
  display: none;
}

.item-effects {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 0.5rem;
}

.effect {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.effect-name {
  color: #888;
}

.effect-value {
  color: #2ecc71;
  font-weight: 500;
}

.navigation {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  height: 48px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: none;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  min-width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 0 8px;
  transform-origin: center;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(0.98);
}

.nav-button.active {
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .nav-button {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .nav-button {
    font-size: 0.9rem;
    min-width: 70px;
  }

  .progress-bars {
    flex-direction: column;
  }

  .progress-bars > * {
    width: 100%;
    max-width: 100%;
    flex: 1 1 100%;
  }

  .header-content {
    padding: 12px;
  }

  .stats {
    gap: 0.5rem;
  }

  h1,
  .money,
  .influence {
    font-size: 1rem;
  }

  .item-effects {
    flex-direction: column;
    gap: 0.25rem;
  }

  .effect {
    font-size: 0.8rem;
  }

  .story-message {
    font-size: 0.8rem;
  }

  .story-progress {
    flex-direction: column;
  }

  .story-progress > * {
    min-width: 100%;
  }

  .game-header:has(.progress-bars) {
    min-height: 280px;
  }

  .game-header:has(.progress-bars) .header-content {
    min-height: 280px;
  }
}

/* Update the progress bars container to handle multiple bars properly */
.progress-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  padding: 0;
}

/* Base styles for all progress bars */
.progress-bars > * {
  box-sizing: border-box;
  width: 100%;
  flex: 1;
}

/* On larger screens, show progress bars side by side */
@media (min-width: 768px) {
  .progress-bars {
    flex-direction: row;
  }

  .progress-bars > * {
    width: calc(50% - 0.25rem); /* Half width minus half the gap */
  }

  /* Different heights based on number of progress bars */
  .game-header:has(.progress-bars:has(> *:only-child)) {
    min-height: 180px; /* Shorter height for single progress bar */
  }

  .game-header:has(.progress-bars:has(> *:nth-child(2))) {
    min-height: 220px; /* Taller height for two progress bars */
  }

  .game-header:has(.progress-bars:has(> *:only-child)) .header-content {
    min-height: 180px;
  }

  .game-header:has(.progress-bars:has(> *:nth-child(2))) .header-content {
    min-height: 220px;
  }
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .progress-bars {
    flex-direction: column;
  }

  .progress-bars > * {
    width: 100%;
  }

  /* Different heights based on number of progress bars */
  .game-header:has(.progress-bars:has(> *:only-child)) {
    min-height: 220px; /* Shorter height for single progress bar */
  }

  .game-header:has(.progress-bars:has(> *:nth-child(2))) {
    min-height: 280px; /* Taller height for two progress bars */
  }

  .game-header:has(.progress-bars:has(> *:only-child)) .header-content {
    min-height: 220px;
  }

  .game-header:has(.progress-bars:has(> *:nth-child(2))) .header-content {
    min-height: 280px;
  }
}

/* Remove old story-progress specific styles since we're using progress-bars class */
.story-progress {
  display: none;
}

/* Remove duplicate styles */
.story-progress-wrapper {
  display: none;
}
</style>
