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

    // From ShopView.vue
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
      Object.values(jobs).forEach((job) => {
        // Always show the starting job
        if (job.id === "everyday_normal_guy") {
          if (!categories[job.category]) {
            categories[job.category] = [];
          }
          categories[job.category].push(job);
          return;
        }

        // For other jobs, check if they're available
        if (this.gameState.isJobUnlocked(job.id)) {
          if (!categories[job.category]) {
            categories[job.category] = [];
          }
          categories[job.category].push(job);
        }
      });
      return categories;
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
      const filteredSkills = allSkills.filter(
        (skill) =>
          this.gameState.hasSkill(skill.id) ||
          this.gameState.isSkillAvailable(skill.id) ||
          this.gameState.getCurrentLearning() === skill.id
      );

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
