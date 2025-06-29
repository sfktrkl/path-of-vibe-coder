import { jobs } from "@data/jobs";
import { skills } from "@data/skills";
import { items } from "@data/items";
import { story } from "@data/story";

export default class GameState {
  constructor() {
    // Character basic info
    this._money = 0;
    this._influence = 0; // New influence stat

    // Job related
    this._currentJob = null;
    this._jobProgress = 0;

    // Skills and Learning progress
    this._currentLearning = null;
    this._skillProgress = {};

    // Shop items
    this._ownedItems = new Set();

    // AI Path state
    this._aiPathUnlocked = false;

    // Existence Path state
    this._existencePathUnlocked = false;

    // Acquired features (persist through transcendReset)
    this._acquiredFeatures = new Set();
  }

  // Money management
  getMoney() {
    return this._money;
  }

  addMoney(amount) {
    this._money += amount;
  }

  spendMoney(amount) {
    if (this._money >= amount) {
      this._money -= amount;
      return true;
    }
    return false;
  }

  // Influence management
  getInfluence() {
    return this._influence;
  }

  addInfluence(amount) {
    this._influence += amount;
  }

  spendInfluence(amount) {
    if (this._influence >= amount) {
      this._influence -= amount;
      return true;
    }
    return false;
  }

  // Job management
  getCurrentJob() {
    return this._currentJob;
  }

  setCurrentJob(jobId) {
    if (this.isJobUnlocked(jobId)) {
      this._currentJob = jobId;
      this._jobProgress = 0; // Reset progress when changing jobs

      // Apply initial job progress from effects
      const effects = this.getItemEffects();
      if (effects.jobInitialProgress > 0) {
        this._jobProgress = effects.jobInitialProgress;
      }

      return true;
    }
    return false;
  }

  getCurrentJobProgress() {
    if (!this._currentJob) return 0;
    return this._jobProgress;
  }

  setCurrentJobProgress(progress) {
    if (this._currentJob) {
      this._jobProgress = Math.min(Math.max(progress, 0), 100);

      // Check for AI path unlock when job is completed
      if (progress >= 100) {
        this.checkAIPathUnlock();
      }
    }
  }

  isJobUnlocked(jobId) {
    const job = jobs[jobId];
    if (!job) return false;

    // Check if job requires AI path and if AI path is not unlocked
    if (job.requiresAIPath === true && !this._aiPathUnlocked) {
      return false;
    }

    // Check if required skills are met
    const hasRequiredSkills = job.requiredSkills.every(
      (skill) => this._skillProgress[skill] >= 100
    );

    // Check if required jobs are met
    const hasRequiredJobs = job.requiredJobs.every((reqJobId) =>
      this.isJobUnlocked(reqJobId)
    );

    return hasRequiredSkills && hasRequiredJobs;
  }

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

  getCurrentJobInfo() {
    if (!this._currentJob) return null;
    return jobs[this._currentJob];
  }

  // Check if time stop feature is active
  isTimeStopActive() {
    const currentJob = this.getCurrentJobInfo();
    if (!currentJob) return false;

    // Check if current job is time_weaver and has timeStop feature
    return (
      currentJob.id === "time_weaver" && currentJob.abilities?.timeStop === true
    );
  }

  // Check if instant learning is active
  isInstantLearningActive() {
    return this.hasFeature("instantLearning");
  }

  isInstantJobMasteryActive() {
    return this.hasFeature("instantJobMastery");
  }

  // Check if revealLocked feature is active
  isRevealLockedActive() {
    return this.hasFeature("revealLocked");
  }

  // Check if completeVision feature is active
  isCompleteVisionActive() {
    return this.hasFeature("completeVision");
  }

  // Check if transcendence focus feature is active
  isTranscendenceFocusActive() {
    const currentJob = this.getCurrentJobInfo();
    return currentJob?.abilities?.transcendenceFocus === true;
  }

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
  getCurrentLearning() {
    return this._currentLearning;
  }

  setCurrentLearning(learningId) {
    this._currentLearning = learningId;
    // Only initialize progress if it doesn't exist
    if (this._skillProgress[learningId] === undefined) {
      this._skillProgress[learningId] = 0;
    }
  }

  getCurrentLearningProgress() {
    if (!this._currentLearning) return 0;
    return this._skillProgress[this._currentLearning] || 0;
  }

  setCurrentLearningProgress(progress) {
    if (this._currentLearning) {
      this._skillProgress[this._currentLearning] = Math.min(
        Math.max(progress, 0),
        100
      );
      // When learning is complete, mark as learned and update features
      if (progress >= 100) {
        // If existence_transcendence is learned, trigger transcend reset
        if (this._currentLearning === "existence_transcendence") {
          this._performTranscendReset();
          return;
        }
        this.updateFeaturesFromSkills();
        this._currentLearning = null;
        // Check for AI path unlock when completing a skill
        this.checkAIPathUnlock();
      }
    }
  }

  hasSkill(skillId) {
    return this._skillProgress[skillId] >= 100;
  }

  getSkillProgress() {
    return { ...this._skillProgress };
  }

  isSkillAvailable(skillId) {
    const skill = skills[skillId];
    if (!skill) return false;

    // Check if skill requires AI path and if AI path is not unlocked
    if (skill.requiresAIPath === true && !this._aiPathUnlocked) {
      return false;
    }

    return skill.prerequisites.every((prereq) => this.hasSkill(prereq));
  }

  getAvailableSkills() {
    return Object.values(skills).filter((skill) => {
      // Check if skill is already learned
      if (this.hasSkill(skill.id)) return false;

      // Check if prerequisites are met using isSkillAvailable
      return this.isSkillAvailable(skill.id);
    });
  }

  getCurrentSkillInfo() {
    if (!this._currentLearning) return null;
    return skills[this._currentLearning];
  }

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

  // Shop management
  hasItem(itemId) {
    return this._ownedItems.has(itemId);
  }

  getOwnedItems() {
    return new Set(this._ownedItems);
  }

  isItemAvailable(itemId) {
    const item = items[itemId];
    if (!item) return false;

    // Check if item requires AI path and if AI path is not unlocked
    if (item.requiresAIPath === true && !this._aiPathUnlocked) {
      return false;
    }

    return item.requiredItems.every((requiredItem) =>
      this.hasItem(requiredItem)
    );
  }

  purchaseItem(itemId) {
    const item = items[itemId];
    if (!item) return false;

    // Check if already owned
    if (this.hasItem(itemId)) return false;

    // Check if item requires AI path and if AI path is not unlocked
    if (item.requiresAIPath === true && !this._aiPathUnlocked) {
      return false;
    }

    // Check if requirements are met using isItemAvailable
    if (!this.isItemAvailable(itemId)) {
      return false;
    }

    // Check if can afford
    if (!this.spendMoney(item.price)) {
      return false;
    }

    // Purchase successful
    this._ownedItems.add(itemId);
    return true;
  }

  // Get item effects
  getItemEffects() {
    const effects = {
      salaryBoost: 1,
      learningSpeed: 1,
      workSpeed: 1,
      skillTimeReduction: 1,
      jobInitialProgress: 0,
      influenceBoost: 1,
    };

    // Track the highest value for each effect
    this._ownedItems.forEach((itemId) => {
      const item = items[itemId];
      if (!item) return;

      Object.entries(item.stats).forEach(([stat, value]) => {
        switch (stat) {
          case "salaryBoost":
            effects.salaryBoost = Math.max(effects.salaryBoost, value);
            break;
          case "learningSpeed":
            effects.learningSpeed = Math.max(effects.learningSpeed, value);
            break;
          case "workSpeed":
            effects.workSpeed = Math.max(effects.workSpeed, value);
            break;
          case "skillTimeReduction":
            effects.skillTimeReduction = Math.min(
              effects.skillTimeReduction,
              value
            );
            break;
          case "jobInitialProgress":
            effects.jobInitialProgress = Math.max(
              effects.jobInitialProgress,
              value
            );
            break;
          case "influenceBoost":
            effects.influenceBoost = Math.max(effects.influenceBoost, value);
            break;
        }
      });
    });

    return effects;
  }

  // AI Path management
  getAIPathUnlocked() {
    return this._aiPathUnlocked;
  }

  unlockAIPath() {
    this._aiPathUnlocked = true;
  }

  checkAIPathUnlock() {
    // If already unlocked, return true
    if (this._aiPathUnlocked) {
      return true;
    }

    // High-value jobs that show expertise
    const jobPoints = {
      senior_web_dev: 5,
      senior_devops: 5,
      senior_game_dev: 5,
      senior_mobile_dev: 5,
      senior_ai_engineer: 6, // AI path gives bonus points
      senior_security: 5,
      web_architect: 15,
      devops_architect: 15,
      game_architect: 15,
      mobile_architect: 15,
      ai_architect: 18, // AI path gives bonus points
      security_architect: 15,
    };

    // Calculate total job points and check if has any architect job
    let totalJobPoints = 0;
    let hasArchitectJob = false;
    Object.entries(jobPoints).forEach(([jobId, points]) => {
      if (this.isJobUnlocked(jobId)) {
        totalJobPoints += points;
        if (jobId.includes("architect")) {
          hasArchitectJob = true;
        }
      }
    });

    if (totalJobPoints === 0) {
      return false;
    }

    // High-value skills that show technical depth
    const skillPoints = {
      machine_learning: 3,
      deep_learning: 4,
      tensorflow: 3,
      algorithms: 2,
      cpp: 2,
      rust: 3,
      kubernetes: 3,
      security: 2,
      cryptography: 3,
      vulkan: 3,
    };

    // High-value items that show dedication
    const itemPoints = {
      expert_salary_boost: 3,
      expert_learning_boost: 3,
      expert_work_boost: 3,
      expert_skill_time_reducer: 3,
      premium_boost_pack: 5,
      ultimate_boost_pack: 7,
    };

    // Calculate total points
    let totalPoints = totalJobPoints;

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

    // Money bonus points (up to 5 points)
    const moneyThreshold = 100000;
    const moneyPoints = Math.min(
      Math.floor(this._money / moneyThreshold) * 5,
      5
    );
    totalPoints += moneyPoints;

    // Calculate unlock chance
    // If no architect job, cap at 10%
    // If has architect job, cap at 25%
    const maxChance = hasArchitectJob ? 25 : 10;
    const unlockChance = Math.min(totalPoints / 2, maxChance);
    const randomChance = Math.random() * 100;

    // Unlock if chance succeeds
    if (randomChance < unlockChance) {
      this._aiPathUnlocked = true;
      return true;
    }

    return false;
  }

  isAIPathUnlocked() {
    return this._aiPathUnlocked;
  }

  // Story progress management
  getCurrentStoryStage() {
    const stages = Object.values(story);
    // Find the highest stage that the player has reached
    return stages.reduce((highest, stage) => {
      if (
        this._influence >= stage.influenceRequired &&
        (!highest || stage.influenceRequired > highest.influenceRequired)
      ) {
        return stage;
      }
      return highest;
    }, null);
  }

  getStoryProgressPercentage() {
    const currentStage = this.getCurrentStoryStage();
    if (!currentStage) return 0;

    const stages = Object.values(story);
    const maxInfluence = Math.max(
      ...stages.map((stage) => stage.influenceRequired)
    );

    // Calculate percentage based on current influence vs max influence
    return Math.min(100, (this._influence / maxInfluence) * 100);
  }

  // Existence Path management
  getExistencePathUnlocked() {
    return this._existencePathUnlocked;
  }

  unlockExistencePath() {
    this._existencePathUnlocked = true;
  }

  checkExistencePathUnlock() {
    // Return early if already unlocked
    if (this._existencePathUnlocked) {
      return true;
    }

    // Check if AI path is unlocked
    if (!this._aiPathUnlocked) {
      return false;
    }

    // Check if story progress is complete (100%)
    if (this.getStoryProgressPercentage() < 100) {
      return false;
    }

    // All conditions met, unlock the path
    this._existencePathUnlocked = true;
    return true;
  }

  hasFeature(featureName) {
    return this._acquiredFeatures.has(featureName);
  }

  addFeature(featureName) {
    this._acquiredFeatures.add(featureName);
  }

  // Check and update features when skills are completed
  updateFeaturesFromSkills() {
    Object.entries(this._skillProgress).forEach(([skillId, progress]) => {
      if (progress >= 100) {
        const skill = skills[skillId];
        if (skill && skill.features) {
          Object.keys(skill.features).forEach((featureName) => {
            this.addFeature(featureName);
          });
        }
      }
    });
  }

  // State serialization
  toJSON() {
    return {
      money: this._money,
      influence: this._influence,
      currentJob: this._currentJob,
      jobProgress: this._jobProgress,
      currentLearning: this._currentLearning,
      skillProgress: this._skillProgress,
      ownedItems: Array.from(this._ownedItems),
      aiPathUnlocked: this._aiPathUnlocked,
      existencePathUnlocked: this._existencePathUnlocked, // Add existence path state
      acquiredFeatures: Array.from(this._acquiredFeatures), // Add acquired features
    };
  }

  // State deserialization
  static fromJSON(json) {
    const state = new GameState();
    state._money = json.money;
    state._influence = json.influence || 0;
    state._currentJob = json.currentJob;
    state._jobProgress = json.jobProgress;
    state._currentLearning = json.currentLearning;
    state._skillProgress = json.skillProgress || {};
    state._ownedItems = new Set(json.ownedItems || []);
    state._aiPathUnlocked = json.aiPathUnlocked || false;
    state._existencePathUnlocked = json.existencePathUnlocked || false; // Add existence path state
    state._acquiredFeatures = new Set(json.acquiredFeatures || []); // Add acquired features
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

  _performTranscendReset() {
    // Reset all game state, except acquired features
    this._money = 0;
    this._influence = 0;
    this._currentJob = null;
    this._jobProgress = 0;
    this._currentLearning = null;
    this._skillProgress = {};
    this._ownedItems = new Set();
    this._aiPathUnlocked = false;
    this._existencePathUnlocked = false;
  }
}
