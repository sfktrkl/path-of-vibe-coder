import { jobs } from "@data/jobs";
import { items } from "@data/items";
import { skills } from "@data/skills";

export default {
  methods: {
    // From ShopItem.vue and GameHeader.vue
    formatEffectName(effect) {
      return effect
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    formatEffectValue(effect, value) {
      let percentage;
      let reductionPercentage;

      switch (effect) {
        case "salaryBoost":
        case "learningSpeed":
        case "workSpeed":
        case "influenceBoost":
          percentage = ((value - 1) * 100).toFixed(0);
          return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
        case "skillTimeReduction":
          reductionPercentage = ((1 - value) * 100).toFixed(0);
          return `+${reductionPercentage}%`;
        case "jobInitialProgress":
          return `+${value}%`;
        default:
          return value;
      }
    },

    // From JobsView.vue and ShopView.vue
    formatCategoryName(category) {
      return category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  computed: {
    // From JobsView.vue
    jobsByCategory() {
      const categories = {};
      const isAIPathUnlocked = this.gameState.getAIPathUnlocked();
      const isExistencePathUnlocked = this.gameState.getExistencePathUnlocked();
      const currentJob = this.gameState.getCurrentJob();
      const isRevealLockedActive = this.gameState.isRevealLockedActive();

      // First pass: collect all available architect jobs and their categories
      const availableArchitectJobs = new Map();
      Object.values(jobs).forEach((job) => {
        if (
          !job.requiresAIPath &&
          job.id.includes("_architect") &&
          this.gameState.isJobUnlocked(job.id)
        ) {
          availableArchitectJobs.set(job.category, job);
        }
      });

      Object.values(jobs).forEach((job) => {
        // Always show the starting job
        if (job.id === "everyday_normal_guy") {
          if (!categories[job.category]) {
            categories[job.category] = [];
          }
          categories[job.category].push(job);
          return;
        }

        // Check if job should be shown
        let shouldShow = false;

        // If revealLocked is active, show all jobs
        if (isRevealLockedActive) {
          shouldShow = true;
        } else {
          // For other jobs, check if they're available
          if (this.gameState.isJobUnlocked(job.id)) {
            // Check existence path requirements first
            if (job.requiresExistencePath && !isExistencePathUnlocked) {
              return; // Skip existence jobs if existence path is not unlocked
            }

            // If AI path is unlocked
            if (isAIPathUnlocked) {
              // Show jobs that require AI path in their original categories
              if (job.requiresAIPath) {
                shouldShow = true;
              } else {
                // Handle architect jobs for non-AI path
                if (job.id.includes("_architect")) {
                  shouldShow = true;
                }
                // Handle senior jobs non-AI path only
                else if (job.id.includes("senior_")) {
                  // Show senior job if there's no architect job in its category
                  // OR if this senior job is currently selected
                  if (
                    job.id === currentJob ||
                    !availableArchitectJobs.has(job.category)
                  ) {
                    shouldShow = true;
                  }
                }
              }
            }
            // If AI path is not unlocked, show all available jobs in their original categories
            else {
              shouldShow = true;
            }
          }
        }

        if (shouldShow) {
          let targetCategory = job.category;

          // If AI path is unlocked and this is a non-AI path senior or architect job
          if (
            isAIPathUnlocked &&
            !job.requiresAIPath &&
            (job.id.includes("_architect") || job.id.includes("senior_"))
          ) {
            targetCategory = "vibe";
          }

          if (!categories[targetCategory]) {
            categories[targetCategory] = [];
          }
          categories[targetCategory].push(job);
        }
      });

      // Filter out empty categories
      return Object.fromEntries(
        Object.entries(categories).filter(([, jobs]) => jobs.length > 0)
      );
    },

    // From ShopView.vue
    itemsByCategory() {
      const categories = {};
      Object.values(items).forEach((item) => {
        // Check if item is available using GameState method
        if (this.gameState.isItemAvailable(item.id)) {
          if (!categories[item.category]) {
            categories[item.category] = [];
          }
          categories[item.category].push(item);
        }
      });

      // Filter out empty categories
      return Object.fromEntries(
        Object.entries(categories).filter(([, items]) => items.length > 0)
      );
    },

    // From SkillsView.vue
    sortedSkills() {
      const allSkills = Object.values(skills);
      const isExistencePathUnlocked = this.gameState.getExistencePathUnlocked();

      const filteredSkills = allSkills.filter((skill) => {
        // Check existence path requirements first
        if (skill.requiresExistencePath && !isExistencePathUnlocked) {
          return false; // Skip existence skills if existence path is not unlocked
        }

        // If AI path is unlocked, hide learned non-AI path skills
        if (this.gameState.getAIPathUnlocked()) {
          return (
            skill.requiresAIPath === true || !this.gameState.hasSkill(skill.id)
          );
        }
        // If AI path is not unlocked, show all skills
        return true;
      });

      // Sort skills: learned at the bottom, maintain original order for others
      return filteredSkills.sort((a, b) => {
        // If one is learned and the other isn't, put learned at the bottom
        if (this.gameState.hasSkill(a.id) && !this.gameState.hasSkill(b.id))
          return 1;
        if (!this.gameState.hasSkill(a.id) && this.gameState.hasSkill(b.id))
          return -1;

        // For remaining skills, sort by prerequisites length
        return a.prerequisites.length - b.prerequisites.length;
      });
    },
  },
};
