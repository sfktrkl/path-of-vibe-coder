import { jobs } from "../data/jobs.js";
import { skills } from "../data/skills.js";

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

  setJob() {
    return {
      description: "setJob(jobId: string) - Set your current job",
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

        const success = this.gameState.setJob(jobId);
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

        this.gameState.startLearning(skillId);
        this.gameState.updateLearningProgress(100);
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
