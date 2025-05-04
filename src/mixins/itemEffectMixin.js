export default {
  methods: {
    formatEffectName(effect) {
      // Split by camelCase and capitalize each word
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
  },
};
