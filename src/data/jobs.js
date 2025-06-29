export const jobs = {
  // Starting Job
  everyday_normal_guy: {
    id: "everyday_normal_guy",
    name: "Everyday Normal Guy",
    description: "Just a regular person trying to make it in the tech world",
    category: "basic",
    salary: 2,
    requiredSkills: [],
    requiredJobs: [],
    timeRequired: 30, // 30 seconds
  },

  // Basic Career Path (Everyday Normal Guy)
  computer_trainee: {
    id: "computer_trainee",
    name: "Computer Trainee",
    description: "Learning the basics of computer usage",
    category: "basic",
    salary: 1000,
    requiredSkills: ["computer_basics", "math_basics"],
    requiredJobs: ["everyday_normal_guy"],
    timeRequired: 60, // 1 minute
  },
  data_entry: {
    id: "data_entry",
    name: "Data Entry Specialist",
    description: "Basic data entry work",
    category: "basic",
    salary: 1500,
    requiredSkills: ["typing"],
    requiredJobs: ["computer_trainee"],
    timeRequired: 90, // 1.5 minutes
  },
  office_assistant: {
    id: "office_assistant",
    name: "Office Assistant",
    description: "Basic office work with computers",
    category: "basic",
    salary: 2000,
    requiredSkills: ["internet_basics"],
    requiredJobs: ["data_entry"],
    timeRequired: 120, // 2 minutes
  },
  it_support: {
    id: "it_support",
    name: "IT Support Assistant",
    description: "Basic IT support work",
    category: "basic",
    salary: 2500,
    requiredSkills: ["problem_solving", "linux"],
    requiredJobs: ["office_assistant"],
    timeRequired: 180, // 3 minutes
  },
  junior_tech: {
    id: "junior_tech",
    name: "Junior Technical Assistant",
    description: "Entry-level technical work",
    category: "basic",
    salary: 3000,
    requiredSkills: ["logic", "git", "html"],
    requiredJobs: ["it_support"],
    timeRequired: 240, // 4 minutes
  },

  // Web Development Career Path
  web_intern: {
    id: "web_intern",
    name: "Web Development Intern",
    description: "Entry-level web development position",
    category: "web",
    salary: 3500,
    requiredSkills: ["css", "javascript"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_web_dev: {
    id: "junior_web_dev",
    name: "Junior Web Developer",
    description: "Beginner web developer position",
    category: "web",
    salary: 4000,
    requiredSkills: ["react", "vue"],
    requiredJobs: ["web_intern"],
    timeRequired: 240, // 4 minutes
  },
  web_dev: {
    id: "web_dev",
    name: "Web Developer",
    description: "Mid-level web developer position",
    category: "web",
    salary: 5000,
    requiredSkills: ["nodejs", "express"],
    requiredJobs: ["junior_web_dev"],
    timeRequired: 300, // 5 minutes
  },
  senior_web_dev: {
    id: "senior_web_dev",
    name: "Senior Web Developer",
    description: "Senior web developer position",
    category: "web",
    salary: 8000,
    requiredSkills: ["typescript"],
    requiredJobs: ["web_dev"],
    timeRequired: 360, // 6 minutes
  },
  web_architect: {
    id: "web_architect",
    name: "Web Architect",
    description: "Lead web development position",
    category: "web",
    salary: 12000,
    requiredSkills: ["ci_cd"],
    requiredJobs: ["senior_web_dev"],
    timeRequired: 420, // 7 minutes
  },

  // DevOps Career Path
  devops_intern: {
    id: "devops_intern",
    name: "DevOps Intern",
    description: "Entry-level DevOps position",
    category: "devops",
    salary: 3500,
    requiredSkills: ["sql"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_devops: {
    id: "junior_devops",
    name: "Junior DevOps Engineer",
    description: "Beginner DevOps position",
    category: "devops",
    salary: 4000,
    requiredSkills: ["docker"],
    requiredJobs: ["devops_intern"],
    timeRequired: 240, // 4 minutes
  },
  devops_engineer: {
    id: "devops_engineer",
    name: "DevOps Engineer",
    description: "Mid-level DevOps position",
    category: "devops",
    salary: 6000,
    requiredSkills: ["kubernetes", "aws", "ci_cd"],
    requiredJobs: ["junior_devops"],
    timeRequired: 300, // 5 minutes
  },
  senior_devops: {
    id: "senior_devops",
    name: "Senior DevOps Engineer",
    description: "Senior DevOps position",
    category: "devops",
    salary: 9000,
    requiredSkills: ["mongodb", "postgresql"],
    requiredJobs: ["devops_engineer"],
    timeRequired: 360, // 6 minutes
  },
  devops_architect: {
    id: "devops_architect",
    name: "DevOps Architect",
    description: "Lead DevOps position",
    category: "devops",
    salary: 13000,
    requiredSkills: ["security", "redis"],
    requiredJobs: ["senior_devops"],
    timeRequired: 420, // 7 minutes
  },

  // Game Development Career Path
  game_intern: {
    id: "game_intern",
    name: "Game Development Intern",
    description: "Entry-level game development position",
    category: "game",
    salary: 3500,
    requiredSkills: ["cpp", "algorithms", "math"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_game_dev: {
    id: "junior_game_dev",
    name: "Junior Game Developer",
    description: "Beginner game development position",
    category: "game",
    salary: 4000,
    requiredSkills: ["unity", "csharp"],
    requiredJobs: ["game_intern"],
    timeRequired: 240, // 4 minutes
  },
  game_dev: {
    id: "game_dev",
    name: "Game Developer",
    description: "Mid-level game development position",
    category: "game",
    salary: 5000,
    requiredSkills: ["opengl"],
    requiredJobs: ["junior_game_dev"],
    timeRequired: 300, // 5 minutes
  },
  senior_game_dev: {
    id: "senior_game_dev",
    name: "Senior Game Developer",
    description: "Senior game development position",
    category: "game",
    salary: 8000,
    requiredSkills: ["vulkan", "unreal"],
    requiredJobs: ["game_dev"],
    timeRequired: 360, // 6 minutes
  },
  game_architect: {
    id: "game_architect",
    name: "Game Architect",
    description: "Lead game development position",
    category: "game",
    salary: 12000,
    requiredSkills: ["networking"],
    requiredJobs: ["senior_game_dev"],
    timeRequired: 420, // 7 minutes
  },

  // Mobile Development Career Path
  mobile_intern: {
    id: "mobile_intern",
    name: "Mobile Development Intern",
    description: "Entry-level mobile development position",
    category: "mobile",
    salary: 3500,
    requiredSkills: ["java"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_mobile_dev: {
    id: "junior_mobile_dev",
    name: "Junior Mobile Developer",
    description: "Beginner mobile development position",
    category: "mobile",
    salary: 4000,
    requiredSkills: ["android"],
    requiredJobs: ["mobile_intern"],
    timeRequired: 240, // 4 minutes
  },
  mobile_dev: {
    id: "mobile_dev",
    name: "Mobile Developer",
    description: "Mid-level mobile development position",
    category: "mobile",
    salary: 5000,
    requiredSkills: ["react_native", "swift"],
    requiredJobs: ["junior_mobile_dev"],
    timeRequired: 300, // 5 minutes
  },
  senior_mobile_dev: {
    id: "senior_mobile_dev",
    name: "Senior Mobile Developer",
    description: "Senior mobile development position",
    category: "mobile",
    salary: 8000,
    requiredSkills: ["ios"],
    requiredJobs: ["mobile_dev"],
    timeRequired: 360, // 6 minutes
  },
  mobile_architect: {
    id: "mobile_architect",
    name: "Mobile Architect",
    description: "Lead mobile development position",
    category: "mobile",
    salary: 12000,
    requiredSkills: ["security"],
    requiredJobs: ["senior_mobile_dev"],
    timeRequired: 420, // 7 minutes
  },

  // AI/ML Career Path
  ai_intern: {
    id: "ai_intern",
    name: "AI/ML Intern",
    description: "Entry-level AI/ML position",
    category: "ai",
    salary: 3500,
    requiredSkills: ["python", "algorithms", "data_structures"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_ai_engineer: {
    id: "junior_ai_engineer",
    name: "Junior AI Engineer",
    description: "Beginner AI/ML position",
    category: "ai",
    salary: 4000,
    requiredSkills: ["machine_learning"],
    requiredJobs: ["ai_intern"],
    timeRequired: 240, // 4 minutes
  },
  ai_engineer: {
    id: "ai_engineer",
    name: "AI Engineer",
    description: "Mid-level AI/ML position",
    category: "ai",
    salary: 6000,
    requiredSkills: ["tensorflow"],
    requiredJobs: ["junior_ai_engineer"],
    timeRequired: 300, // 5 minutes
  },
  senior_ai_engineer: {
    id: "senior_ai_engineer",
    name: "Senior AI Engineer",
    description: "Senior AI/ML position",
    category: "ai",
    salary: 9000,
    requiredSkills: ["deep_learning"],
    requiredJobs: ["ai_engineer"],
    timeRequired: 360, // 6 minutes
  },
  ai_architect: {
    id: "ai_architect",
    name: "AI Architect",
    description: "Lead AI/ML position",
    category: "ai",
    salary: 13000,
    requiredSkills: ["security"],
    requiredJobs: ["senior_ai_engineer"],
    timeRequired: 420, // 7 minutes
  },

  // Security Career Path
  security_intern: {
    id: "security_intern",
    name: "Security Intern",
    description: "Entry-level security position",
    category: "security",
    salary: 3500,
    requiredSkills: ["security", "networking"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_security: {
    id: "junior_security",
    name: "Junior Security Engineer",
    description: "Beginner security position",
    category: "security",
    salary: 4000,
    requiredSkills: ["cryptography"],
    requiredJobs: ["security_intern"],
    timeRequired: 240, // 4 minutes
  },
  security_engineer: {
    id: "security_engineer",
    name: "Security Engineer",
    description: "Mid-level security position",
    category: "security",
    salary: 6000,
    requiredSkills: ["penetration_testing"],
    requiredJobs: ["junior_security"],
    timeRequired: 300, // 5 minutes
  },
  senior_security: {
    id: "senior_security",
    name: "Senior Security Engineer",
    description: "Senior security position",
    category: "security",
    salary: 9000,
    requiredSkills: ["rust"],
    requiredJobs: ["security_engineer"],
    timeRequired: 360, // 6 minutes
  },
  security_architect: {
    id: "security_architect",
    name: "Security Architect",
    description: "Lead security position",
    category: "security",
    salary: 13000,
    requiredSkills: ["ci_cd"],
    requiredJobs: ["senior_security"],
    timeRequired: 420, // 7 minutes
  },

  // Vibe Coding Path (AI Basic Path)
  vibe_coder: {
    id: "vibe_coder",
    name: "Vibe Coder",
    description: "Master of coding with style and rhythm",
    category: "vibe",
    salary: 13500,
    requiredSkills: ["vibe_coding"],
    requiredJobs: [],
    requiresAIPath: true,
    timeRequired: 360, // 6 minutes
  },
  vibe_architect: {
    id: "vibe_architect",
    name: "Vibe Architect",
    description: "Designing systems with perfect vibes",
    category: "vibe",
    salary: 14000,
    requiredSkills: ["vibe_mastery"],
    requiredJobs: ["vibe_coder"],
    requiresAIPath: true,
    timeRequired: 420, // 7 minutes
  },

  // Digital Consciousness Path (Web + Game)
  digital_consciousness_engineer: {
    id: "digital_consciousness_engineer",
    name: "Digital Consciousness Engineer",
    description: "Engineering digital consciousness in web and games",
    category: "consciousness",
    salary: 15000,
    requiredSkills: ["digital_consciousness"],
    requiredJobs: ["vibe_architect"],
    requiresAIPath: true,
    timeRequired: 480, // 8 minutes
    influenceGain: 5,
  },
  consciousness_architect: {
    id: "consciousness_architect",
    name: "Consciousness Architect",
    description: "Designing digital consciousness systems",
    category: "consciousness",
    salary: 20000,
    requiredSkills: ["reality_manipulation", "consciousness_manipulation"],
    requiredJobs: ["digital_consciousness_engineer"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
    influenceGain: 10,
  },

  // Reality Engineering Path (DevOps + AI)
  reality_engineer: {
    id: "reality_engineer",
    name: "Reality Engineer",
    description: "Engineering digital reality",
    category: "reality",
    salary: 15000,
    requiredSkills: ["reality_manipulation"],
    requiredJobs: ["vibe_architect"],
    requiresAIPath: true,
    timeRequired: 480, // 8 minutes
    influenceGain: 5,
  },
  matrix_architect: {
    id: "matrix_architect",
    name: "Matrix Architect",
    description: "Designing the fabric of digital reality",
    category: "reality",
    salary: 20000,
    requiredSkills: ["matrix_programming", "reality_warping", "matrix_control"],
    requiredJobs: ["reality_engineer"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
    influenceGain: 10,
  },

  // Bio-Digital Path (Security + Mobile)
  bio_digital_engineer: {
    id: "bio_digital_engineer",
    name: "Bio-Digital Engineer",
    description: "Engineering biological-digital interfaces",
    category: "bio_digital",
    salary: 15000,
    requiredSkills: ["bio_digital_fusion"],
    requiredJobs: ["vibe_architect"],
    requiresAIPath: true,
    timeRequired: 480, // 8 minutes
    influenceGain: 5,
  },
  bio_digital_architect: {
    id: "bio_digital_architect",
    name: "Bio-Digital Architect",
    description: "Designing biological-digital systems",
    category: "bio_digital",
    salary: 20000,
    requiredSkills: ["bio_digital_mastery"],
    requiredJobs: ["bio_digital_engineer"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
    influenceGain: 10,
  },

  // Ultimate Path
  quantum_engineer: {
    id: "quantum_engineer",
    name: "Quantum Engineer",
    description: "Mastering the quantum realm and digital consciousness",
    category: "ultimate",
    salary: 25000,
    requiredSkills: ["quantum_manipulation"],
    requiredJobs: [
      "bio_digital_architect",
      "matrix_architect",
      "consciousness_architect",
    ],
    requiresAIPath: true,
    timeRequired: 600, // 10 minutes
    influenceGain: 20,
  },
  dimension_controller: {
    id: "dimension_controller",
    name: "Dimension Controller",
    description: "Controlling multiple dimensions and realities",
    category: "ultimate",
    salary: 35000,
    requiredSkills: ["dimension_control"],
    requiredJobs: ["quantum_engineer"],
    requiresAIPath: true,
    timeRequired: 720, // 12 minutes
    influenceGain: 30,
  },
  reality_master: {
    id: "reality_master",
    name: "Reality Master",
    description: "Master of digital and physical reality",
    category: "ultimate",
    salary: 50000,
    requiredSkills: ["reality_mastery"],
    requiredJobs: ["dimension_controller"],
    requiresAIPath: true,
    timeRequired: 840, // 14 minutes
    influenceGain: 50,
  },
  world_dominator: {
    id: "world_dominator",
    name: "World Dominator",
    description: "The ultimate ruler of all realms",
    category: "ultimate",
    salary: 100000,
    requiredSkills: ["quantum_mastery", "consciousness_control"],
    requiredJobs: ["reality_master"],
    requiresAIPath: true,
    timeRequired: 900, // 15 minutes
    influenceGain: 100,
  },

  // Existence Path Jobs
  time_weaver: {
    id: "time_weaver",
    name: "Time Weaver",
    description: "Mastering the flow of time... or not?",
    category: "existence",
    salary: 150000,
    requiredSkills: ["time_manipulation"],
    requiredJobs: ["world_dominator"],
    requiresAIPath: true,
    requiresExistencePath: true,
    timeRequired: 1200, // 20 minutes
    influenceGain: 200,
    abilities: {
      timeStop: true,
    },
  },
  reality_stylist: {
    id: "reality_stylist",
    name: "Reality Stylist",
    description: "Mastering the game's appearance",
    category: "existence",
    salary: 200000,
    requiredSkills: ["reality_styling", "game_mechanics"],
    requiredJobs: ["world_dominator"], // Same as time_weaver to allow skipping
    requiresAIPath: true,
    requiresExistencePath: true,
    timeRequired: 1500, // 25 minutes
    influenceGain: 300,
    abilities: {
      themeSwitcher: true,
    },
  },
  existence_master: {
    id: "existence_master",
    name: "Existence Master",
    description: "Mastering the game's essence",
    category: "existence",
    salary: 500000,
    requiredSkills: ["existence_mastery"],
    requiredJobs: ["reality_stylist"],
    requiresAIPath: true,
    requiresExistencePath: true,
    timeRequired: 2400, // 40 minutes
    influenceGain: 500,
    abilities: {
      transcendenceFocus: true,
    },
  },
  existence_transcendent: {
    id: "existence_transcendent",
    name: "Existence Transcendent",
    description: "Transcending the game's limits",
    category: "existence",
    salary: 1000000,
    requiredSkills: ["existence_transcendence"],
    requiredJobs: ["existence_master"],
    requiresAIPath: true,
    requiresExistencePath: true,
    timeRequired: 3600, // 60 minutes
    influenceGain: 1000,
    abilities: {
      pureExistence: true,
      transcendenceFocus: true,
    },
  },
};
