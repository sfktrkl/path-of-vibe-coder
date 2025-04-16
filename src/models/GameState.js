import { jobs } from "@data/jobs";
import { skills } from "@data/skills";

export default class GameState {
  constructor() {
    // Character basic info
    this.money = 0;
    this.title = "Path of Vibe Coder";

    // Job related
    this.currentJob = null;
    this.jobProgress = 0;

    // Skills and Learning progress
    this.currentLearning = null;
    this.skillProgress = {};
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
    if (this.isJobUnlocked(jobId)) {
      this.currentJob = jobId;
      this.jobProgress = 0; // Reset progress when changing jobs
      this.title = jobs[jobId].name; // Update title to current job name
      return true;
    }
    return false;
  }

  isJobUnlocked(jobId) {
    const job = jobs[jobId];
    if (!job) return false;

    // Check if required skills are met
    const hasRequiredSkills = job.requiredSkills.every(
      (skill) => this.skillProgress[skill] >= 100
    );

    // Check if required jobs are met
    const hasRequiredJobs = job.requiredJobs.every((reqJobId) =>
      this.isJobUnlocked(reqJobId)
    );

    return hasRequiredSkills && hasRequiredJobs;
  }

  // Get available jobs that can be unlocked
  getAvailableJobs() {
    return Object.values(jobs).filter((job) => {
      // Check if job is already unlocked
      if (this.isJobUnlocked(job.id)) return false;

      // Check if required skills are met
      const hasRequiredSkills = job.requiredSkills.every((skill) =>
        this.hasSkill(skill)
      );

      // Check if required jobs are met
      const hasRequiredJobs = job.requiredJobs.every((jobId) =>
        this.isJobUnlocked(jobId)
      );

      return hasRequiredSkills && hasRequiredJobs;
    });
  }

  // Get current job info
  getCurrentJobInfo() {
    if (!this.currentJob) return null;
    return jobs[this.currentJob];
  }

  // Get all jobs grouped by category
  getJobsByCategory() {
    const categories = {};
    Object.values(jobs).forEach((job) => {
      if (!categories[job.category]) {
        categories[job.category] = [];
      }
      categories[job.category].push(job);
    });
    return categories;
  }

  // Skills management
  hasSkill(skillId) {
    return this.skillProgress[skillId] >= 100;
  }

  // Get available skills that can be learned
  getAvailableSkills() {
    return Object.values(skills).filter((skill) => {
      // Check if skill is already learned
      if (this.hasSkill(skill.id)) return false;

      // Check if prerequisites are met
      return skill.prerequisites.every((prereq) => this.hasSkill(prereq));
    });
  }

  // Get all skills grouped by category
  getSkillsByCategory() {
    const categories = {};
    Object.values(skills).forEach((skill) => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    return categories;
  }

  // Learning management
  startLearning(learningId) {
    this.currentLearning = learningId;
    // Only initialize progress if it doesn't exist
    if (this.skillProgress[learningId] === undefined) {
      this.skillProgress[learningId] = 0;
    }
  }

  updateLearningProgress(amount) {
    if (this.currentLearning) {
      this.skillProgress[this.currentLearning] += amount;
      // When learning is complete, mark as learned
      if (this.skillProgress[this.currentLearning] >= 100) {
        this.currentLearning = null;
      }
    }
  }

  // Get current learning progress
  getLearningProgress() {
    if (!this.currentLearning) return 0;
    return this.skillProgress[this.currentLearning] || 0;
  }

  // Get skill progress
  getSkillProgress(skillId) {
    if (!this.skillProgress[skillId]) return 0;
    return this.skillProgress[skillId];
  }

  // Add method to reset title when quitting job
  quitJob() {
    this.currentJob = null;
    this.jobProgress = 0;
    this.title = "Path of Vibe Coder";
  }

  // State serialization
  toJSON() {
    return {
      money: this.money,
      title: this.title,
      currentJob: this.currentJob,
      jobProgress: this.jobProgress,
      currentLearning: this.currentLearning,
      skillProgress: this.skillProgress,
    };
  }

  // State deserialization
  static fromJSON(json) {
    const state = new GameState();
    state.money = json.money;
    state.title = json.title;
    state.currentJob = json.currentJob;
    state.jobProgress = json.jobProgress;
    state.currentLearning = json.currentLearning;
    state.skillProgress = json.skillProgress || {}; // Ensure it's initialized even if not in JSON
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
