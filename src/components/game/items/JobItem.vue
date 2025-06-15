<template>
  <div
    :class="[
      'item-base',
      {
        unlocked: isUnlocked,
        current: isCurrent,
        locked: isLocked,
      },
    ]"
    @click="isUnlocked && !isCurrent ? gameState.setCurrentJob(job.id) : null"
  >
    <div class="item-info">
      <span class="item-name">{{ job.name }}</span>
      <span class="item-description">{{ job.description }}</span>
      <div v-if="isLocked" class="requirements">
        <div v-if="job.requiredSkills.length > 0" class="requirement-group">
          <span class="requirement-label">Required Skills:</span>
          <span
            v-for="skillId in job.requiredSkills"
            :key="skillId"
            :class="['requirement-item', { met: gameState.hasSkill(skillId) }]"
          >
            {{ getSkillName(skillId) }}
          </span>
        </div>
        <div v-if="job.requiredJobs.length > 0" class="requirement-group">
          <span class="requirement-label">Required Jobs:</span>
          <span
            v-for="jobId in job.requiredJobs"
            :key="jobId"
            :class="[
              'requirement-item',
              { met: gameState.isJobUnlocked(jobId) },
            ]"
          >
            {{ getJobName(jobId) }}
          </span>
        </div>
        <div v-if="job.requiresAIPath" class="requirement-group">
          <span class="requirement-label">Requires:</span>
          <span
            :class="[
              'requirement-item',
              { met: gameState.getAIPathUnlocked() },
            ]"
          >
            AI Path
          </span>
        </div>
        <div v-if="job.requiresExistencePath" class="requirement-group">
          <span class="requirement-label">Requires:</span>
          <span
            :class="[
              'requirement-item',
              { met: gameState.getExistencePathUnlocked() },
            ]"
          >
            Existence Path
          </span>
        </div>
      </div>
    </div>
    <div class="item-status">
      <span class="job-salary">${{ job.salary }}</span>
      <span v-if="job.influenceGain" class="job-influence">
        <span class="job-influence-icon">⚡</span>{{ job.influenceGain }}
      </span>
      <span v-if="isLocked" class="status-badge locked-badge"> Locked </span>
    </div>
  </div>
</template>

<script>
import "@styles/item-styles.css";
import { skills } from "@data/skills";
import { jobs } from "@data/jobs";

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
  computed: {
    isUnlocked() {
      return this.gameState.isJobUnlocked(this.job.id);
    },
    isCurrent() {
      return this.gameState.getCurrentJob() === this.job.id;
    },
    isLocked() {
      return !this.isUnlocked && this.gameState.isRevealLockedActive();
    },
  },
  methods: {
    getSkillName(skillId) {
      return skills[skillId]?.name || skillId;
    },
    getJobName(jobId) {
      return jobs[jobId]?.name || jobId;
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
  font-weight: bold;
}

.job-influence {
  font-weight: bold;
  font-size: 0.9em;
  display: flex;
  align-items: baseline;
}

.job-influence-icon {
  font-size: 0.7em;
  line-height: 1;
  display: inline-block;
  transform: translateY(-0.1em);
  margin-right: 0.1em;
}
</style>
