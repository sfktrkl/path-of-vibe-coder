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

    // Check if time stop is active - if so, don't process any updates
    if (this.gameState.isTimeStopActive()) {
      return;
    }

    // Get current item effects
    const effects = this.gameState.getItemEffects();

    // Update learning progress if currently learning
    const skill = this.gameState.getCurrentSkillInfo();
    if (skill) {
      if (
        this.gameState.isInstantLearningActive() &&
        this.gameState.getCurrentLearningProgress() === 0
      ) {
        // Try instant learning with 50% chance
        if (Math.random() < 0.5) {
          // Success! Complete the skill instantly
          this.gameState.setCurrentLearningProgress(100);
        }
      } else {
        // Apply learning speed multiplier and skill time reduction
        const baseProgressPerSecond =
          100 / (skill.timeRequired * effects.skillTimeReduction);
        const adjustedProgressPerSecond =
          baseProgressPerSecond * effects.learningSpeed;
        const progress = deltaTime * adjustedProgressPerSecond;
        const totalProgress =
          this.gameState.getCurrentLearningProgress() + progress;
        this.gameState.setCurrentLearningProgress(totalProgress);
      }
    }

    // Update job progress if currently working
    const job = this.gameState.getCurrentJobInfo();
    if (job) {
      let totalProgress;
      if (
        this.gameState.isInstantJobMasteryActive() &&
        this.gameState.getCurrentJobProgress() === 0
      ) {
        // Try instant job mastery with 50% chance
        if (Math.random() < 0.5) {
          // Success! Complete the job instantly
          totalProgress = 100;
        } else {
          // Failed instant mastery, calculate normal progress
          const baseProgressPerSecond = 100 / job.timeRequired;
          const adjustedProgressPerSecond =
            baseProgressPerSecond * effects.workSpeed;
          const progress = deltaTime * adjustedProgressPerSecond;
          totalProgress = this.gameState.getCurrentJobProgress() + progress;
        }
      } else {
        // Normal progress calculation
        const baseProgressPerSecond = 100 / job.timeRequired;
        const adjustedProgressPerSecond =
          baseProgressPerSecond * effects.workSpeed;
        const progress = deltaTime * adjustedProgressPerSecond;
        totalProgress = this.gameState.getCurrentJobProgress() + progress;
      }
      this.gameState.setCurrentJobProgress(totalProgress);

      // If job is complete, pay the salary with multiplier
      if (totalProgress >= 100) {
        const salaryWithMultiplier = job.salary * effects.salaryBoost;
        this.gameState.addMoney(salaryWithMultiplier);

        // Apply influence gain with boost if the job has influence gain
        if (job.influenceGain) {
          const influenceWithBoost = job.influenceGain * effects.influenceBoost;
          this.gameState.addInfluence(influenceWithBoost);
        }

        this.gameState.setCurrentJobProgress(effects.jobInitialProgress);
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
      currentLearning: this.gameState.getCurrentLearning(),
      currentJob: this.gameState.getCurrentJob(),
      learningProgress: this.gameState.getCurrentLearningProgress(),
      jobProgress: this.gameState.getCurrentJobProgress(),
    };
  }
}
