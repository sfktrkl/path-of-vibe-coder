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

    // AI Path state
    this.aiPathUnlocked = false;
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
        // Check for AI path unlock when completing a skill
        this.checkAIPathUnlock();
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

  setJobProgress(jobId, progress) {
    if (this.currentJob === jobId) {
      this.jobProgress = Math.min(Math.max(progress, 0), 100);
    }
  }

  setSkillProgress(skillId, progress) {
    this.skillProgress[skillId] = Math.min(Math.max(progress, 0), 100);
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

  // AI Path management
  checkAIPathUnlock() {
    // If already unlocked, return true
    if (this.aiPathUnlocked) {
      return true;
    }

    // High-value jobs that show expertise
    const jobPoints = {
      senior_web_dev: 15,
      senior_devops: 15,
      senior_game_dev: 15,
      senior_mobile_dev: 15,
      senior_ai_engineer: 20, // AI path gives bonus points
      senior_security: 15,
      web_architect: 25,
      devops_architect: 25,
      game_architect: 25,
      mobile_architect: 25,
      ai_architect: 30, // AI path gives bonus points
      security_architect: 25,
    };

    // First check if player has at least one senior job by calculating job points
    let seniorJobPoints = 0;
    Object.entries(jobPoints).forEach(([jobId, points]) => {
      if (this.isJobUnlocked(jobId)) {
        seniorJobPoints += points;
      }
    });

    if (seniorJobPoints === 0) {
      return false;
    }

    // High-value skills that show technical depth
    const skillPoints = {
      machine_learning: 10,
      deep_learning: 15,
      tensorflow: 10,
      algorithms: 8,
      cpp: 8,
      rust: 12,
      kubernetes: 10,
      security: 8,
      cryptography: 10,
      vulkan: 12,
    };

    // High-value items that show dedication
    const itemPoints = {
      expert_salary_boost: 10,
      expert_learning_boost: 10,
      expert_work_boost: 10,
      expert_skill_time_reducer: 10,
      premium_boost_pack: 20,
      ultimate_boost_pack: 30,
    };

    // Calculate total points
    let totalPoints = seniorJobPoints; // Start with the job points we already calculated

    // Add points from skills
    Object.entries(skillPoints).forEach(([skillId, points]) => {
      if (this.hasSkill(skillId)) {
        totalPoints += points;
      }
    });

    // Add points from items
    Object.entries(itemPoints).forEach(([itemId, points]) => {
      if (this.hasItem(itemId)) {
        totalPoints += points;
      }
    });

    // Money bonus points (up to 20 points)
    const moneyThreshold = 100000;
    const moneyPoints = Math.min(
      Math.floor(this.money / moneyThreshold) * 20,
      20
    );
    totalPoints += moneyPoints;

    // Random chance based on total points
    const baseChance = 5; // 5% base chance
    const pointBonus = Math.min(totalPoints / 2, 45); // Up to 45% bonus from points
    const unlockChance = baseChance + pointBonus;
    const randomChance = Math.random() * 100;

    // Unlock if chance succeeds
    if (randomChance < unlockChance) {
      this.aiPathUnlocked = true;
      return true;
    }

    return false;
  }

  isAIPathUnlocked() {
    return this.aiPathUnlocked;
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
      aiPathUnlocked: this.aiPathUnlocked,
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
    state.aiPathUnlocked = json.aiPathUnlocked || false;
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
      return null;
    }
  }
}
