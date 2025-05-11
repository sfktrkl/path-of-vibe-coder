import { jobs } from "../data/jobs.js";
import { skills } from "../data/skills.js";
import { items } from "../data/items.js";

export default class GameCheatCommands {
  constructor(gameState) {
    this.gameState = gameState;
  }

  addMoney() {
    return {
      description: "addMoney(amount: number) - Add money to your balance",
      execute: (amount) => {
        this.gameState.addMoney(amount);
        console.log(`Added ${amount} money!`);
      },
    };
  }

  addInfluence() {
    return {
      description:
        "addInfluence(amount: number) - Add influence to your balance",
      execute: (amount) => {
        this.gameState.addInfluence(amount);
        console.log(`Added ${amount} influence!`);
      },
    };
  }

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

  listJobIds() {
    return {
      description: "listJobIds() - List all job IDs with their categories",
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

  listSkillIds() {
    return {
      description: "listSkillIds() - List all skill IDs with their categories",
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

  listItemIds() {
    return {
      description: "listItemIds() - List all item IDs with their categories",
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
