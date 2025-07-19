import { jobs } from "../data/jobs.js";
import { skills } from "../data/skills.js";
import { items } from "../data/items.js";

export default class GameCheatCommands {
  constructor(gameState) {
    this.gameState = gameState;
  }

  // =============================
  // Player State Manipulation
  // =============================

  setMoney() {
    return {
      description:
        "setMoney(amount: number) - Set your money balance to a specific amount",
      execute: (amount) => {
        // First spend all money, then add the new amount
        this.gameState.spendMoney(this.gameState.getMoney());
        this.gameState.addMoney(amount);
        console.log(`Set money to ${amount}!`);
      },
    };
  }

  setInfluence() {
    return {
      description:
        "setInfluence(amount: number) - Set your influence balance to a specific amount",
      execute: (amount) => {
        // First spend all influence, then add the new amount
        this.gameState.spendInfluence(this.gameState.getInfluence());
        this.gameState.addInfluence(amount);
        console.log(`Set influence to ${amount}!`);
      },
    };
  }

  // =============================
  // Job Management
  // =============================

  setCurrentJob() {
    return {
      description: "setCurrentJob(jobId: string) - Set your current job",
      execute: (jobId) => {
        const job = jobs[jobId];
        if (!job) {
          console.log(`Job ${jobId} not found!`);
          return;
        }

        // Check if job is already unlocked
        if (this.gameState.isJobUnlocked(jobId)) {
          return;
        }

        // Recursively collect all required skills
        const collectRequiredSkills = (jobId, collectedSkills = new Set()) => {
          const job = jobs[jobId];
          if (!job) {
            console.log(`Job ${jobId} not found!`);
            return collectedSkills;
          }

          job.requiredSkills.forEach((skill) => {
            if (!this.gameState.hasSkill(skill)) {
              collectedSkills.add(skill);
            }
          });
          for (const requiredJobId of job.requiredJobs) {
            collectRequiredSkills(requiredJobId, collectedSkills);
          }

          return collectedSkills;
        };

        // Enable all required skills
        const allRequiredSkills = collectRequiredSkills(jobId);
        for (const requiredSkillId of allRequiredSkills) {
          this.completeSkill().execute(requiredSkillId);
        }

        // Unlock AI path if the job requires it
        if (
          job.requiresAIPath === true &&
          !this.gameState.getAIPathUnlocked()
        ) {
          if (typeof this.gameState.unlockAIPath === "function") {
            this.gameState.unlockAIPath();
          }
        }

        const success = this.gameState.setCurrentJob(jobId);
        if (success) {
          console.log(`Set job to ${jobId}!`);
        } else {
          console.log(`Failed to set job to ${jobId}!`);
        }
      },
    };
  }

  setCurrentJobProgress() {
    return {
      description:
        "setCurrentJobProgress(progress: number) - Set progress for current job (0-100)",
      execute: (progress) => {
        const currentJobInfo = this.gameState.getCurrentJobInfo();
        if (!currentJobInfo) {
          console.log("No job is currently selected!");
          return;
        }

        if (progress < 0 || progress > 100) {
          console.log("Progress must be between 0 and 100!");
          return;
        }

        this.gameState.setCurrentJobProgress(progress);
        console.log(`Set progress for current job to ${progress}%!`);
      },
    };
  }

  listJobs() {
    return {
      description: "listJobs() - List all job IDs with their categories",
      execute: () => {
        // Group jobs by category
        const jobsByCategory = {};
        Object.values(jobs).forEach((job) => {
          if (!jobsByCategory[job.category]) {
            jobsByCategory[job.category] = [];
          }
          jobsByCategory[job.category].push(job.id);
        });

        // Format the output
        let output = "Available Job IDs:\n\n";
        Object.entries(jobsByCategory).forEach(([category, ids]) => {
          output += `[${category}]\n${ids.join("\n")}\n\n`;
        });

        console.log(output);
      },
    };
  }

  // =============================
  // Skill Management
  // =============================

  completeSkill() {
    return {
      description: "completeSkill(skillId: string) - Complete a skill",
      execute: (skillId) => {
        const skill = skills[skillId];
        if (!skill) {
          console.log(`Skill ${skillId} not found!`);
          return;
        }

        // Check if skill is already acquired
        if (this.gameState.hasSkill(skillId)) {
          return;
        }

        // Enable prerequisite skills first
        for (const prerequisiteId of skill.prerequisites) {
          this.completeSkill().execute(prerequisiteId);
        }

        this.gameState.setCurrentLearning(skillId);
        this.gameState.setCurrentLearningProgress(100);
        console.log(`Completed skill ${skillId}!`);
      },
    };
  }

  setCurrentLearningProgress() {
    return {
      description:
        "setCurrentLearningProgress(progress: number) - Set progress for current skill (0-100)",
      execute: (progress) => {
        if (!this.gameState.getCurrentLearning()) {
          console.log("No skill is currently being learned!");
          return;
        }

        if (progress < 0 || progress > 100) {
          console.log("Progress must be between 0 and 100!");
          return;
        }

        this.gameState.setCurrentLearningProgress(progress);
        console.log(`Set progress for current skill to ${progress}%!`);
      },
    };
  }

  listSkills() {
    return {
      description: "listSkills() - List all skill IDs with their categories",
      execute: () => {
        // Group skills by category
        const skillsByCategory = {};
        Object.values(skills).forEach((skill) => {
          if (!skillsByCategory[skill.category]) {
            skillsByCategory[skill.category] = [];
          }
          skillsByCategory[skill.category].push(skill.id);
        });

        // Format the output
        let output = "Available Skill IDs:\n\n";
        Object.entries(skillsByCategory).forEach(([category, ids]) => {
          output += `[${category}]\n${ids.join("\n")}\n\n`;
        });

        console.log(output);
      },
    };
  }

  // =============================
  // Item Management
  // =============================

  getItem() {
    return {
      description: "getItem(itemId: string) - Get an item and its requirements",
      execute: (itemId) => {
        const item = items[itemId];
        if (!item) {
          console.log(`Item ${itemId} not found!`);
          return;
        }

        // Check if item is already owned
        if (this.gameState.hasItem(itemId)) {
          return;
        }

        // Recursively collect all required items
        const collectRequiredItems = (itemId, collectedItems = new Set()) => {
          const item = items[itemId];
          if (!item) {
            console.log(`Item ${itemId} not found!`);
            return collectedItems;
          }

          item.requiredItems.forEach((requiredItem) => {
            if (!this.gameState.hasItem(requiredItem)) {
              collectedItems.add(requiredItem);
            }
          });

          return collectedItems;
        };

        // Get all required items
        const allRequiredItems = collectRequiredItems(itemId);
        for (const requiredItemId of allRequiredItems) {
          this.getItem().execute(requiredItemId);
        }

        // Add money if needed for purchase
        if (item.price > 0) {
          this.gameState.addMoney(item.price);
        }

        // Use purchaseItem to properly handle the item acquisition
        const success = this.gameState.purchaseItem(itemId);
        if (success) {
          console.log(`Got item ${itemId}!`);
        } else {
          console.log(`Failed to get item ${itemId}!`);
        }
      },
    };
  }

  listItems() {
    return {
      description: "listItems() - List all item IDs with their categories",
      execute: () => {
        // Group items by category
        const itemsByCategory = {};
        Object.values(items).forEach((item) => {
          if (!itemsByCategory[item.category]) {
            itemsByCategory[item.category] = [];
          }
          itemsByCategory[item.category].push(item.id);
        });

        // Format the output
        let output = "Available Item IDs:\n\n";
        Object.entries(itemsByCategory).forEach(([category, ids]) => {
          output += `[${category}]\n${ids.join("\n")}\n\n`;
        });

        console.log(output);
      },
    };
  }

  listItemEffects() {
    return {
      description:
        "listItemEffects() - List all possible item effect keys, their type (increase/reduction), and a short description",
      execute: () => {
        const effectsInfo = [
          {
            key: "salaryBoost",
            type: "increase",
            description: "Increases salary earned from jobs (higher is better)",
          },
          {
            key: "learningSpeed",
            type: "increase",
            description: "Increases skill learning speed (higher is better)",
          },
          {
            key: "workSpeed",
            type: "increase",
            description: "Increases job progress speed (higher is better)",
          },
          {
            key: "skillTimeReduction",
            type: "reduction",
            description:
              "Reduces time required to learn skills (lower is better)",
          },
          {
            key: "jobInitialProgress",
            type: "increase",
            description:
              "Sets initial progress when starting a new job (higher is better)",
          },
          {
            key: "influenceBoost",
            type: "increase",
            description: "Increases influence gained (higher is better)",
          },
        ];

        let output = "Available Item Effects:\n\n";
        effectsInfo.forEach((effect) => {
          output += `- ${effect.key} (${effect.type}): ${effect.description}\n`;
        });
        console.log(output);
      },
    };
  }

  setItemEffect() {
    return {
      description:
        "setItemEffect(effectName: string, value: number|null) - Set a custom value for an item effect. Set to null to clear the override.",
      execute: (effectName, value) => {
        const validEffects = [
          "salaryBoost",
          "learningSpeed",
          "workSpeed",
          "skillTimeReduction",
          "jobInitialProgress",
          "influenceBoost",
        ];
        if (!validEffects.includes(effectName)) {
          console.log(
            `Invalid effect name '${effectName}'. Use listItemEffects() to see valid effect names.`
          );
          return;
        }
        if (value === null || value === undefined) {
          // Remove the override
          delete this.gameState._customItemEffects[effectName];
          console.log(
            `Custom item effect override for '${effectName}' has been cleared.`
          );
          return;
        }
        if (typeof value !== "number" || isNaN(value)) {
          console.log(`Value must be a number.`);
          return;
        }
        this.gameState.setCustomItemEffect(effectName, value);
        console.log(`Set custom item effect '${effectName}' to ${value}.`);
      },
    };
  }

  // =============================
  // Feature Management
  // =============================

  listFeatures() {
    return {
      description:
        "listFeatures() - List all skill features with their descriptions",
      execute: () => {
        const features = new Map();

        // Collect all features from skills
        Object.values(skills).forEach((skill) => {
          if (skill.features) {
            Object.keys(skill.features).forEach((featureName) => {
              if (!features.has(featureName)) {
                features.set(featureName, {
                  name: featureName,
                  skills: [],
                });
              }
              features.get(featureName).skills.push(skill.name);
            });
          }
        });

        if (features.size === 0) {
          console.log("No skill features found!");
          return;
        }

        // Format the output
        let output = "Available Skill Features:\n\n";
        features.forEach((feature, featureName) => {
          output += `${featureName}:\n`;
          output += `  Skills: ${feature.skills.join(", ")}\n\n`;
        });

        console.log(output);
      },
    };
  }

  enableFeature() {
    return {
      description:
        "enableFeature(featureName: string) - Enable a skill feature",
      execute: (featureName) => {
        // Validate feature name by checking if it exists in any skill
        let featureExists = false;
        Object.values(skills).forEach((skill) => {
          if (skill.features && skill.features[featureName]) {
            featureExists = true;
          }
        });

        if (!featureExists) {
          console.log(`Feature '${featureName}' not found in any skill!`);
          console.log("Use listFeatures() to see available features.");
          return;
        }

        this.gameState.setFeature(featureName, true);
        console.log(`Feature '${featureName}' enabled!`);
      },
    };
  }

  disableFeature() {
    return {
      description:
        "disableFeature(featureName: string) - Disable a skill feature",
      execute: (featureName) => {
        // Validate feature name by checking if it exists in any skill
        let featureExists = false;
        Object.values(skills).forEach((skill) => {
          if (skill.features && skill.features[featureName]) {
            featureExists = true;
          }
        });

        if (!featureExists) {
          console.log(`Feature '${featureName}' not found in any skill!`);
          console.log("Use listFeatures() to see available features.");
          return;
        }

        this.gameState.setFeature(featureName, false);
        console.log(`Feature '${featureName}' disabled!`);
      },
    };
  }

  listCurrentFeatures() {
    return {
      description:
        "listCurrentFeatures() - List all currently enabled features",
      execute: () => {
        const currentFeatures = this.gameState.getAllFeatures();

        if (currentFeatures.length === 0) {
          console.log("No features are currently enabled!");
          return;
        }

        console.log("Currently Enabled Features:");
        currentFeatures.forEach((feature) => {
          console.log(`  - ${feature}`);
        });
      },
    };
  }

  // =============================
  // Ability Management
  // =============================

  listAbilities() {
    return {
      description:
        "listAbilities() - List all job abilities with their descriptions",
      execute: () => {
        const abilities = new Map();

        // Collect all abilities from jobs
        Object.values(jobs).forEach((job) => {
          if (job.abilities) {
            Object.keys(job.abilities).forEach((abilityName) => {
              if (!abilities.has(abilityName)) {
                abilities.set(abilityName, {
                  name: abilityName,
                  jobs: [],
                });
              }
              abilities.get(abilityName).jobs.push(job.name);
            });
          }
        });

        if (abilities.size === 0) {
          console.log("No job abilities found!");
          return;
        }

        // Format the output
        let output = "Available Job Abilities:\n\n";
        abilities.forEach((ability, abilityName) => {
          output += `${abilityName}:\n`;
          output += `  Jobs: ${ability.jobs.join(", ")}\n\n`;
        });

        console.log(output);
      },
    };
  }

  enableAbility() {
    return {
      description: "enableAbility(abilityName: string) - Enable a job ability",
      execute: (abilityName) => {
        // Validate ability name by checking if it exists in any job
        let abilityExists = false;
        Object.values(jobs).forEach((job) => {
          if (job.abilities && job.abilities[abilityName]) {
            abilityExists = true;
          }
        });

        if (!abilityExists) {
          console.log(`Ability '${abilityName}' not found in any job!`);
          console.log("Use listAbilities() to see available abilities.");
          return;
        }

        this.gameState.setAbility(abilityName, true);
        console.log(`Ability '${abilityName}' enabled!`);
      },
    };
  }

  disableAbility() {
    return {
      description:
        "disableAbility(abilityName: string) - Disable a job ability",
      execute: (abilityName) => {
        // Validate ability name by checking if it exists in any job
        let abilityExists = false;
        Object.values(jobs).forEach((job) => {
          if (job.abilities && job.abilities[abilityName]) {
            abilityExists = true;
          }
        });

        if (!abilityExists) {
          console.log(`Ability '${abilityName}' not found in any job!`);
          console.log("Use listAbilities() to see available abilities.");
          return;
        }

        this.gameState.setAbility(abilityName, false);
        console.log(`Ability '${abilityName}' disabled!`);
      },
    };
  }

  listCurrentAbilities() {
    return {
      description:
        "listCurrentAbilities() - List all currently enabled abilities",
      execute: () => {
        const currentAbilities = this.gameState.getAllAbilities();

        if (currentAbilities.length === 0) {
          console.log("No abilities are currently enabled!");
          return;
        }

        console.log("Currently Enabled Abilities:");
        currentAbilities.forEach((ability) => {
          console.log(`  - ${ability}`);
        });
      },
    };
  }

  // =============================
  // Help
  // =============================

  help() {
    return {
      description: "help() - Show this help message",
      execute: () => {
        const commands = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
          .filter(
            (prop) => prop !== "constructor" && typeof this[prop] === "function"
          )
          .map((method) => this[method]().description)
          .join("\n");
        console.log(`Available cheat commands:\n${commands}`);
      },
    };
  }
}
