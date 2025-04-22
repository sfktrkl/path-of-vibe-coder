import { skills } from "@data/skills";
import { jobs } from "@data/jobs";

export default class GameTimer {
  constructor(gameState) {
    this.gameState = gameState;
    this.timer = null;
    this.lastUpdate = null;
    this.isRunning = false;
  }

  // Start the timer
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastUpdate = Date.now();
    this.timer = setInterval(() => this.update(), 1000); // Update every second
  }

  // Stop the timer
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Update progress for both learning and job
  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
    this.lastUpdate = now;

    // Get current item effects
    const effects = this.gameState.getItemEffects();

    // Update learning progress if currently learning
    if (this.gameState.currentLearning) {
      const skill = skills[this.gameState.currentLearning];
      if (skill) {
        // Apply learning speed multiplier and skill time reduction
        const baseProgressPerSecond =
          100 / (skill.timeRequired * effects.skillTimeMultiplier);
        const adjustedProgressPerSecond =
          baseProgressPerSecond * effects.learningSpeedMultiplier;
        const progress = deltaTime * adjustedProgressPerSecond;
        this.gameState.updateLearningProgress(progress);
      }
    }

    // Update job progress if currently working
    if (this.gameState.currentJob) {
      const job = jobs[this.gameState.currentJob];
      if (job) {
        // Apply work progress multiplier
        const baseProgressPerSecond = 100 / job.timeRequired;
        const adjustedProgressPerSecond =
          baseProgressPerSecond * effects.workSpeedMultiplier;
        const progress = deltaTime * adjustedProgressPerSecond;
        this.gameState.jobProgress += progress;

        // If job is complete, pay the salary with multiplier
        if (this.gameState.jobProgress >= 100) {
          const salaryWithMultiplier = job.salary * effects.salaryMultiplier;
          this.gameState.addMoney(salaryWithMultiplier);
          this.gameState.jobProgress = effects.initialJobProgress;
        }
      }
    }
  }

  // Pause the timer
  pause() {
    this.stop();
  }

  // Resume the timer
  resume() {
    this.start();
  }

  // Get current timer state
  getState() {
    return {
      isRunning: this.isRunning,
      currentLearning: this.gameState.currentLearning,
      currentJob: this.gameState.currentJob,
      learningProgress: this.gameState.getLearningProgress(),
      jobProgress: this.gameState.jobProgress,
    };
  }
}
