export default {
  methods: {
    formatEffectName(effect) {
      const names = {
        salaryMultiplier: "Salary Boost",
        learningSpeedMultiplier: "Learning Speed",
        workSpeedMultiplier: "Work Speed",
        skillTimeMultiplier: "Skill Time Reduction",
        initialJobProgress: "Job Initial Progress",
      };
      return names[effect] || effect;
    },
    formatEffectValue(effect, value) {
      let percentage;
      let reductionPercentage;

      switch (effect) {
        case "salaryMultiplier":
        case "learningSpeedMultiplier":
        case "workSpeedMultiplier":
          percentage = ((value - 1) * 100).toFixed(0);
          return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
        case "skillTimeMultiplier":
          reductionPercentage = ((1 - value) * 100).toFixed(0);
          return `+${reductionPercentage}%`;
        case "initialJobProgress":
          return `+${value}%`;
        default:
          return value;
      }
    },
  },
};
