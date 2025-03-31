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

    // Update learning progress if currently learning
    if (this.gameState.currentLearning) {
      const skill = skills[this.gameState.currentLearning];
      if (skill) {
        const progressPerSecond = 100 / skill.timeRequired;
        const progress = deltaTime * progressPerSecond;
        this.gameState.updateLearningProgress(progress);
      }
    }

    // Update job progress if currently working
    if (this.gameState.currentJob) {
      const job = jobs[this.gameState.currentJob];
      if (job) {
        const progressPerSecond = 100 / job.timeRequired;
        const progress = deltaTime * progressPerSecond;
        this.gameState.jobProgress += progress;

        // If job is complete, pay the salary
        if (this.gameState.jobProgress >= 100) {
          this.gameState.addMoney(job.salary);
          this.gameState.jobProgress = 0; // Reset progress
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
