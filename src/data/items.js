export const items = {
  // Salary Boost Items
  basic_salary_boost: {
    id: "basic_salary_boost",
    name: "Basic Salary Boost",
    description: "Increases your salary by 5%",
    category: "salary",
    price: 1000,
    requiredItems: [],
    stats: {
      salaryMultiplier: 1.05,
    },
  },
  advanced_salary_boost: {
    id: "advanced_salary_boost",
    name: "Advanced Salary Boost",
    description: "Increases your salary by 10%",
    category: "salary",
    price: 2500,
    requiredItems: ["basic_salary_boost"],
    stats: {
      salaryMultiplier: 1.1,
    },
  },
  expert_salary_boost: {
    id: "expert_salary_boost",
    name: "Expert Salary Boost",
    description: "Increases your salary by 25%",
    category: "salary",
    price: 5000,
    requiredItems: ["advanced_salary_boost"],
    stats: {
      salaryMultiplier: 1.25,
    },
  },

  // Learning Speed Items
  basic_learning_boost: {
    id: "basic_learning_boost",
    name: "Basic Learning Boost",
    description: "Increases learning speed by 5%",
    category: "learning",
    price: 1500,
    requiredItems: [],
    stats: {
      learningSpeedMultiplier: 1.05,
    },
  },
  advanced_learning_boost: {
    id: "advanced_learning_boost",
    name: "Advanced Learning Boost",
    description: "Increases learning speed by 10%",
    category: "learning",
    price: 3500,
    requiredItems: ["basic_learning_boost"],
    stats: {
      learningSpeedMultiplier: 1.1,
    },
  },
  expert_learning_boost: {
    id: "expert_learning_boost",
    name: "Expert Learning Boost",
    description: "Increases learning speed by 25%",
    category: "learning",
    price: 7000,
    requiredItems: ["advanced_learning_boost"],
    stats: {
      learningSpeedMultiplier: 1.25,
    },
  },

  // Work Progress Items
  basic_work_boost: {
    id: "basic_work_boost",
    name: "Basic Work Boost",
    description: "Increases work progress speed by 5%",
    category: "work",
    price: 2000,
    requiredItems: [],
    stats: {
      workSpeedMultiplier: 1.05,
    },
  },
  advanced_work_boost: {
    id: "advanced_work_boost",
    name: "Advanced Work Boost",
    description: "Increases work progress speed by 10%",
    category: "work",
    price: 4500,
    requiredItems: ["basic_work_boost"],
    stats: {
      workSpeedMultiplier: 1.1,
    },
  },
  expert_work_boost: {
    id: "expert_work_boost",
    name: "Expert Work Boost",
    description: "Increases work progress speed by 25%",
    category: "work",
    price: 9000,
    requiredItems: ["advanced_work_boost"],
    stats: {
      workSpeedMultiplier: 1.25,
    },
  },

  // Skill Time Reduction Items
  basic_skill_time_reducer: {
    id: "basic_skill_time_reducer",
    name: "Basic Skill Time Reducer",
    description: "Reduces skill time requirement by 5%",
    category: "skill",
    price: 1800,
    requiredItems: [],
    stats: {
      skillTimeMultiplier: 0.95,
    },
  },
  advanced_skill_time_reducer: {
    id: "advanced_skill_time_reducer",
    name: "Advanced Skill Time Reducer",
    description: "Reduces skill time requirement by 10%",
    category: "skill",
    price: 4000,
    requiredItems: ["basic_skill_time_reducer"],
    stats: {
      skillTimeMultiplier: 0.9,
    },
  },
  expert_skill_time_reducer: {
    id: "expert_skill_time_reducer",
    name: "Expert Skill Time Reducer",
    description: "Reduces skill time requirement by 25%",
    category: "skill",
    price: 8000,
    requiredItems: ["advanced_skill_time_reducer"],
    stats: {
      skillTimeMultiplier: 0.75,
    },
  },

  // Job Initial Progress Items
  basic_job_boost: {
    id: "basic_job_boost",
    name: "Basic Job Boost",
    description: "Starts jobs with 5% progress",
    category: "job",
    price: 2200,
    requiredItems: [],
    stats: {
      initialJobProgress: 5,
    },
  },
  advanced_job_boost: {
    id: "advanced_job_boost",
    name: "Advanced Job Boost",
    description: "Starts jobs with 10% progress",
    category: "job",
    price: 5000,
    requiredItems: ["basic_job_boost"],
    stats: {
      initialJobProgress: 10,
    },
  },
  expert_job_boost: {
    id: "expert_job_boost",
    name: "Expert Job Boost",
    description: "Starts jobs with 25% progress",
    category: "job",
    price: 10000,
    requiredItems: ["advanced_job_boost"],
    stats: {
      initialJobProgress: 25,
    },
  },

  // Premium Combo Items
  premium_boost_pack: {
    id: "premium_boost_pack",
    name: "Premium Boost Pack",
    description: "Combines multiple boosts for maximum efficiency",
    category: "premium",
    price: 15000,
    requiredItems: [
      "expert_salary_boost",
      "expert_learning_boost",
      "expert_work_boost",
      "expert_skill_time_reducer",
      "expert_job_boost",
    ],
    stats: {
      salaryMultiplier: 1.3,
      learningSpeedMultiplier: 1.3,
      workSpeedMultiplier: 1.3,
      skillTimeMultiplier: 0.7,
      initialJobProgress: 30,
    },
  },
  ultimate_boost_pack: {
    id: "ultimate_boost_pack",
    name: "Ultimate Boost Pack",
    description: "The ultimate combination of all boosts",
    category: "premium",
    price: 30000,
    requiredItems: ["premium_boost_pack"],
    stats: {
      salaryMultiplier: 1.5,
      learningSpeedMultiplier: 1.5,
      workSpeedMultiplier: 1.5,
      skillTimeMultiplier: 0.5,
      initialJobProgress: 50,
    },
  },
};
