export default class GameTimer {
  constructor(gameState) {
    this.gameState = gameState;
    this.timer = null;
    this.lastUpdate = null;
    this.isRunning = false;
    this.instantCompletion = true;
    this.timeMultiplier = 1;
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
    let deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
    deltaTime *= this.timeMultiplier;
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
      let totalProgress;
      if (
        this.gameState.isInstantLearningActive() &&
        this.gameState.getCurrentLearningProgress() === 0 &&
        Math.random() < 0.5
      ) {
        // Success! Complete the skill instantly
        totalProgress = 100;
      } else {
        // Normal progress calculation (including failed instant attempts)
        const baseProgressPerSecond =
          100 / (skill.timeRequired * effects.skillTimeReduction);
        const adjustedProgressPerSecond =
          baseProgressPerSecond * effects.learningSpeed;
        const progress = deltaTime * adjustedProgressPerSecond;
        totalProgress = this.gameState.getCurrentLearningProgress() + progress;
      }
      this.gameState.setCurrentLearningProgress(totalProgress);
    }

    // Update job progress if currently working
    const job = this.gameState.getCurrentJobInfo();
    if (job) {
      let totalProgress;
      if (
        this.gameState.isInstantJobMasteryActive() &&
        this.gameState.getCurrentJobProgress() === effects.jobInitialProgress &&
        this.instantCompletion &&
        Math.random() < 0.5
      ) {
        // Success! Complete the job instantly
        totalProgress = 100;
      } else {
        this.instantCompletion = false;
        // Normal progress calculation (including failed instant attempts)
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

        this.instantCompletion = true;
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
      instantCompletion: this.instantCompletion,
    };
  }

  setTimeMultiplier(value) {
    if (typeof value === "number" && value > 0) {
      this.timeMultiplier = value;
    }
  }

  getTimeMultiplier() {
    return this.timeMultiplier;
  }

  resetTimeMultiplier() {
    this.timeMultiplier = 1;
  }
}
