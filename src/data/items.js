export const items = {
  // Salary Boost Items
  basic_salary_boost: {
    id: "basic_salary_boost",
    name: "Basic Salary Boost",
    description: "Increases your salary by 5%",
    category: "salary_boosts",
    price: 1000,
    requiredItems: [],
    stats: {
      salaryBoost: 1.05,
    },
  },
  advanced_salary_boost: {
    id: "advanced_salary_boost",
    name: "Advanced Salary Boost",
    description: "Increases your salary by 10%",
    category: "salary_boosts",
    price: 2500,
    requiredItems: ["basic_salary_boost"],
    stats: {
      salaryBoost: 1.1,
    },
  },
  expert_salary_boost: {
    id: "expert_salary_boost",
    name: "Expert Salary Boost",
    description: "Increases your salary by 25%",
    category: "salary_boosts",
    price: 5000,
    requiredItems: ["advanced_salary_boost"],
    stats: {
      salaryBoost: 1.25,
    },
  },

  // Learning Speed Items
  basic_learning_boost: {
    id: "basic_learning_boost",
    name: "Basic Learning Boost",
    description: "Increases learning speed by 5%",
    category: "learning_speed",
    price: 1500,
    requiredItems: [],
    stats: {
      learningSpeed: 1.05,
    },
  },
  advanced_learning_boost: {
    id: "advanced_learning_boost",
    name: "Advanced Learning Boost",
    description: "Increases learning speed by 10%",
    category: "learning_speed",
    price: 3500,
    requiredItems: ["basic_learning_boost"],
    stats: {
      learningSpeed: 1.1,
    },
  },
  expert_learning_boost: {
    id: "expert_learning_boost",
    name: "Expert Learning Boost",
    description: "Increases learning speed by 25%",
    category: "learning_speed",
    price: 7000,
    requiredItems: ["advanced_learning_boost"],
    stats: {
      learningSpeed: 1.25,
    },
  },

  // Work Progress Items
  basic_work_boost: {
    id: "basic_work_boost",
    name: "Basic Work Boost",
    description: "Increases work progress speed by 5%",
    category: "work_speed",
    price: 2000,
    requiredItems: [],
    stats: {
      workSpeed: 1.05,
    },
  },
  advanced_work_boost: {
    id: "advanced_work_boost",
    name: "Advanced Work Boost",
    description: "Increases work progress speed by 10%",
    category: "work_speed",
    price: 4500,
    requiredItems: ["basic_work_boost"],
    stats: {
      workSpeed: 1.1,
    },
  },
  expert_work_boost: {
    id: "expert_work_boost",
    name: "Expert Work Boost",
    description: "Increases work progress speed by 25%",
    category: "work_speed",
    price: 9000,
    requiredItems: ["advanced_work_boost"],
    stats: {
      workSpeed: 1.25,
    },
  },

  // Skill Time Reduction Items
  basic_skill_time_reducer: {
    id: "basic_skill_time_reducer",
    name: "Basic Skill Time Reducer",
    description: "Reduces skill time requirement by 5%",
    category: "skill_time_reduction",
    price: 1800,
    requiredItems: [],
    stats: {
      skillTimeReduction: 0.95,
    },
  },
  advanced_skill_time_reducer: {
    id: "advanced_skill_time_reducer",
    name: "Advanced Skill Time Reducer",
    description: "Reduces skill time requirement by 10%",
    category: "skill_time_reduction",
    price: 4000,
    requiredItems: ["basic_skill_time_reducer"],
    stats: {
      skillTimeReduction: 0.9,
    },
  },
  expert_skill_time_reducer: {
    id: "expert_skill_time_reducer",
    name: "Expert Skill Time Reducer",
    description: "Reduces skill time requirement by 25%",
    category: "skill_time_reduction",
    price: 8000,
    requiredItems: ["advanced_skill_time_reducer"],
    stats: {
      skillTimeReduction: 0.75,
    },
  },

  // Job Initial Progress Items
  basic_job_boost: {
    id: "basic_job_boost",
    name: "Basic Job Boost",
    description: "Starts jobs with 5% progress",
    category: "job_progress",
    price: 2200,
    requiredItems: [],
    stats: {
      jobInitialProgress: 5,
    },
  },
  advanced_job_boost: {
    id: "advanced_job_boost",
    name: "Advanced Job Boost",
    description: "Starts jobs with 10% progress",
    category: "job_progress",
    price: 5000,
    requiredItems: ["basic_job_boost"],
    stats: {
      jobInitialProgress: 10,
    },
  },
  expert_job_boost: {
    id: "expert_job_boost",
    name: "Expert Job Boost",
    description: "Starts jobs with 25% progress",
    category: "job_progress",
    price: 10000,
    requiredItems: ["advanced_job_boost"],
    stats: {
      jobInitialProgress: 25,
    },
  },

  // Premium Combo Items
  premium_boost_pack: {
    id: "premium_boost_pack",
    name: "Premium Boost Pack",
    description: "Combines multiple boosts for maximum efficiency",
    category: "premium_packs",
    price: 15000,
    requiredItems: [
      "expert_salary_boost",
      "expert_learning_boost",
      "expert_work_boost",
      "expert_skill_time_reducer",
      "expert_job_boost",
    ],
    stats: {
      salaryBoost: 1.3,
      learningSpeed: 1.3,
      workSpeed: 1.3,
      skillTimeReduction: 0.7,
      jobInitialProgress: 30,
    },
  },
  ultimate_boost_pack: {
    id: "ultimate_boost_pack",
    name: "Ultimate Boost Pack",
    description: "The ultimate combination of all boosts",
    category: "premium_packs",
    price: 30000,
    requiredItems: ["premium_boost_pack"],
    stats: {
      salaryBoost: 1.5,
      learningSpeed: 1.5,
      workSpeed: 1.5,
      skillTimeReduction: 0.5,
      jobInitialProgress: 50,
    },
  },
};
