import { jobs } from "@data/jobs";
import { skills } from "@data/skills";
import { items } from "@data/items";

export default class GameState {
  constructor() {
    // Character basic info
    this.money = 0;

    // Job related
    this.currentJob = null;
    this.jobProgress = 0;

    // Skills and Learning progress
    this.currentLearning = null;
    this.skillProgress = {};

    // Shop items
    this.ownedItems = new Set();
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

      // Apply initial job progress from effects
      const effects = this.getItemEffects();
      if (effects.initialJobProgress > 0) {
        this.jobProgress = effects.initialJobProgress;
      }

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

  isSkillAvailable(skillId) {
    const skill = skills[skillId];
    if (!skill) return false;

    return skill.prerequisites.every((prereq) => this.hasSkill(prereq));
  }

  // Get available skills that can be learned
  getAvailableSkills() {
    return Object.values(skills).filter((skill) => {
      // Check if skill is already learned
      if (this.hasSkill(skill.id)) return false;

      // Check if prerequisites are met using isSkillAvailable
      return this.isSkillAvailable(skill.id);
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
      this.skillProgress[this.currentLearning] = Math.min(
        (this.skillProgress[this.currentLearning] || 0) + amount,
        100
      );
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

  // Shop management
  hasItem(itemId) {
    return this.ownedItems.has(itemId);
  }

  isItemAvailable(itemId) {
    const item = items[itemId];
    if (!item) return false;

    return item.requiredItems.every((requiredItem) =>
      this.hasItem(requiredItem)
    );
  }

  purchaseItem(itemId) {
    const item = items[itemId];
    if (!item) return false;

    // Check if already owned
    if (this.hasItem(itemId)) return false;

    // Check if requirements are met using isItemAvailable
    if (!this.isItemAvailable(itemId)) {
      return false;
    }

    // Check if can afford
    if (!this.spendMoney(item.price)) {
      return false;
    }

    // Purchase successful
    this.ownedItems.add(itemId);
    return true;
  }

  // Get item effects
  getItemEffects() {
    const effects = {
      salaryMultiplier: 1,
      learningSpeedMultiplier: 1,
      workSpeedMultiplier: 1,
      skillTimeMultiplier: 1,
      initialJobProgress: 0,
    };

    // Track the highest value for each effect
    this.ownedItems.forEach((itemId) => {
      const item = items[itemId];
      if (!item) return;

      Object.entries(item.stats).forEach(([stat, value]) => {
        switch (stat) {
          case "salaryMultiplier":
            effects.salaryMultiplier = Math.max(
              effects.salaryMultiplier,
              value
            );
            break;
          case "learningSpeedMultiplier":
            effects.learningSpeedMultiplier = Math.max(
              effects.learningSpeedMultiplier,
              value
            );
            break;
          case "workSpeedMultiplier":
            effects.workSpeedMultiplier = Math.max(
              effects.workSpeedMultiplier,
              value
            );
            break;
          case "skillTimeMultiplier":
            effects.skillTimeMultiplier = Math.min(
              effects.skillTimeMultiplier,
              value
            );
            break;
          case "initialJobProgress":
            effects.initialJobProgress = Math.max(
              effects.initialJobProgress,
              value
            );
            break;
        }
      });
    });

    return effects;
  }

  // State serialization
  toJSON() {
    return {
      money: this.money,
      currentJob: this.currentJob,
      jobProgress: this.jobProgress,
      currentLearning: this.currentLearning,
      skillProgress: this.skillProgress,
      ownedItems: Array.from(this.ownedItems),
    };
  }

  // State deserialization
  static fromJSON(json) {
    const state = new GameState();
    state.money = json.money;
    state.currentJob = json.currentJob;
    state.jobProgress = json.jobProgress;
    state.currentLearning = json.currentLearning;
    state.skillProgress = json.skillProgress || {};
    state.ownedItems = new Set(json.ownedItems || []);
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
