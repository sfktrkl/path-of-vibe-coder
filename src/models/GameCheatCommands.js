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
        return `Added ${amount} money!`;
      },
    };
  }

  setJob() {
    return {
      description: "setJob(jobId: string) - Set your current job",
      execute: (jobId) => {
        const success = this.gameState.setJob(jobId);
        return success
          ? `Set job to ${jobId}!`
          : `Failed to set job to ${jobId}!`;
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
        return "Job IDs listed";
      },
    };
  }

  completeSkill() {
    return {
      description: "completeSkill(skillId: string) - Complete a skill",
      execute: (skillId) => {
        this.gameState.startLearning(skillId);
        this.gameState.updateLearningProgress(100);
        return `Completed skill ${skillId}!`;
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
        return "Skill IDs listed";
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
        return "Help message";
      },
    };
  }
}
