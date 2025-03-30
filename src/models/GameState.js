export class GameState {
  constructor() {
    // Character basic info
    this.money = 0;
    this.title = "Novice";

    // Job related
    this.currentJob = null;
    this.unlockedJobs = new Set();
    this.jobProgress = 0; // Progress in current job

    // Skills and Learning progress
    this.skills = new Set();
    this.currentLearning = null;
    this.learningProgress = 0;
  }

  // Money management
  addMoney(amount) {
    this.money += amount;
  }

  spendMoney(amount) {
    if (this.money >= amount) {
      this.money -= amount;
      return true;
    }
    return false;
  }

  // Job management
  setJob(jobId) {
    if (this.unlockedJobs.has(jobId)) {
      this.currentJob = jobId;
      this.jobProgress = 0; // Reset progress when changing jobs
      return true;
    }
    return false;
  }

  unlockJob(jobId) {
    this.unlockedJobs.add(jobId);
  }

  isJobUnlocked(jobId) {
    return this.unlockedJobs.has(jobId);
  }

  updateJobProgress(amount) {
    if (this.currentJob) {
      this.jobProgress += amount;
      // TODO: Implement job completion logic
    }
  }

  // Skills management
  addSkill(skillId) {
    this.skills.add(skillId);
  }

  hasSkill(skillId) {
    return this.skills.has(skillId);
  }

  // Learning management
  startLearning(learningId) {
    this.currentLearning = learningId;
    this.learningProgress = 0;
  }

  updateLearningProgress(amount) {
    if (this.currentLearning) {
      this.learningProgress += amount;
      // When learning is complete, grant the skill
      if (this.learningProgress >= 100) {
        this.addSkill(this.currentLearning);
        this.currentLearning = null;
        this.learningProgress = 0;
      }
    }
  }

  // State serialization
  toJSON() {
    return {
      money: this.money,
      title: this.title,
      currentJob: this.currentJob,
      unlockedJobs: Array.from(this.unlockedJobs),
      jobProgress: this.jobProgress,
      skills: Array.from(this.skills),
      currentLearning: this.currentLearning,
      learningProgress: this.learningProgress,
    };
  }

  // State deserialization
  static fromJSON(json) {
    const state = new GameState();
    state.money = json.money;
    state.title = json.title;
    state.currentJob = json.currentJob;
    state.unlockedJobs = new Set(json.unlockedJobs);
    state.jobProgress = json.jobProgress;
    state.skills = new Set(json.skills);
    state.currentLearning = json.currentLearning;
    state.learningProgress = json.learningProgress;
    return state;
  }

  // Encode state with obfuscation
  encode() {
    // First convert to JSON string
    const jsonString = JSON.stringify(this.toJSON());

    // Convert to base64
    const base64 = btoa(jsonString);

    // Apply XOR cipher with a key
    const key = "PoV"; // Path of Vibe key
    let encoded = "";
    for (let i = 0; i < base64.length; i++) {
      encoded += String.fromCharCode(
        base64.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }

    // Convert to base64 again for safe storage
    return btoa(encoded);
  }

  // Decode obfuscated state
  static decode(encodedString) {
    try {
      // Decode base64
      const base64 = atob(encodedString);

      // Apply XOR cipher with the same key
      const key = "PoV"; // Path of Vibe key
      let decoded = "";
      for (let i = 0; i < base64.length; i++) {
        decoded += String.fromCharCode(
          base64.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }

      // Decode base64 again
      const jsonString = atob(decoded);

      // Parse JSON and create new state
      return GameState.fromJSON(JSON.parse(jsonString));
    } catch (error) {
      console.error("Failed to decode game state:", error);
      return new GameState(); // Return new state if decoding fails
    }
  }
}
