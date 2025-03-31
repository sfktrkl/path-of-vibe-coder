export const jobs = {
  // Starting Job
  everyday_normal_guy: {
    id: "everyday_normal_guy",
    name: "Everyday Normal Guy",
    description: "Just a regular person trying to make it in the tech world",
    category: "basic",
    salary: 500,
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
    requiredSkills: ["computer_basics"],
    requiredJobs: ["everyday_normal_guy"],
    timeRequired: 60, // 1 minute
  },
  data_entry: {
    id: "data_entry",
    name: "Data Entry Specialist",
    description: "Basic data entry work",
    category: "basic",
    salary: 1500,
    requiredSkills: ["computer_basics", "typing"],
    requiredJobs: ["computer_trainee"],
    timeRequired: 90, // 1.5 minutes
  },
  office_assistant: {
    id: "office_assistant",
    name: "Office Assistant",
    description: "Basic office work with computers",
    category: "basic",
    salary: 2000,
    requiredSkills: ["computer_basics", "typing", "internet_basics"],
    requiredJobs: ["data_entry"],
    timeRequired: 120, // 2 minutes
  },
  it_support: {
    id: "it_support",
    name: "IT Support Assistant",
    description: "Basic IT support work",
    category: "basic",
    salary: 2500,
    requiredSkills: [
      "computer_basics",
      "typing",
      "internet_basics",
      "problem_solving",
      "linux",
    ],
    requiredJobs: ["office_assistant"],
    timeRequired: 180, // 3 minutes
  },
  junior_tech: {
    id: "junior_tech",
    name: "Junior Technical Assistant",
    description: "Entry-level technical work",
    category: "basic",
    salary: 3000,
    requiredSkills: [
      "computer_basics",
      "typing",
      "internet_basics",
      "problem_solving",
      "logic",
      "git",
      "html",
    ],
    requiredJobs: ["it_support"],
    timeRequired: 240, // 4 minutes
  },

  // Web Development Career Path
  web_intern: {
    id: "web_intern",
    name: "Web Development Intern",
    description: "Entry-level web development position",
    category: "web",
    salary: 2000,
    requiredSkills: ["html", "css", "javascript", "computer_basics", "typing"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_web_dev: {
    id: "junior_web_dev",
    name: "Junior Web Developer",
    description: "Beginner web developer position",
    category: "web",
    salary: 3500,
    requiredSkills: ["html", "css", "javascript", "react"],
    requiredJobs: ["web_intern"],
    timeRequired: 240, // 4 minutes
  },
  web_dev: {
    id: "web_dev",
    name: "Web Developer",
    description: "Mid-level web developer position",
    category: "web",
    salary: 5000,
    requiredSkills: ["html", "css", "javascript", "react", "nodejs", "express"],
    requiredJobs: ["junior_web_dev"],
    timeRequired: 300, // 5 minutes
  },
  senior_web_dev: {
    id: "senior_web_dev",
    name: "Senior Web Developer",
    description: "Senior web developer position",
    category: "web",
    salary: 8000,
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "react",
      "nodejs",
      "express",
      "typescript",
    ],
    requiredJobs: ["web_dev"],
    timeRequired: 360, // 6 minutes
  },
  web_architect: {
    id: "web_architect",
    name: "Web Architect",
    description: "Lead web development position",
    category: "web",
    salary: 12000,
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "react",
      "nodejs",
      "express",
      "typescript",
      "ci_cd",
    ],
    requiredJobs: ["senior_web_dev"],
    timeRequired: 420, // 7 minutes
  },

  // DevOps Career Path
  devops_intern: {
    id: "devops_intern",
    name: "DevOps Intern",
    description: "Entry-level DevOps position",
    category: "devops",
    salary: 2500,
    requiredSkills: ["git", "linux", "computer_basics", "typing"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_devops: {
    id: "junior_devops",
    name: "Junior DevOps Engineer",
    description: "Beginner DevOps position",
    category: "devops",
    salary: 4000,
    requiredSkills: ["git", "linux", "docker"],
    requiredJobs: ["devops_intern"],
    timeRequired: 240, // 4 minutes
  },
  devops_engineer: {
    id: "devops_engineer",
    name: "DevOps Engineer",
    description: "Mid-level DevOps position",
    category: "devops",
    salary: 6000,
    requiredSkills: ["git", "linux", "docker", "kubernetes", "aws"],
    requiredJobs: ["junior_devops"],
    timeRequired: 300, // 5 minutes
  },
  senior_devops: {
    id: "senior_devops",
    name: "Senior DevOps Engineer",
    description: "Senior DevOps position",
    category: "devops",
    salary: 9000,
    requiredSkills: ["git", "linux", "docker", "kubernetes", "aws", "ci_cd"],
    requiredJobs: ["devops_engineer"],
    timeRequired: 360, // 6 minutes
  },
  devops_architect: {
    id: "devops_architect",
    name: "DevOps Architect",
    description: "Lead DevOps position",
    category: "devops",
    salary: 13000,
    requiredSkills: [
      "git",
      "linux",
      "docker",
      "kubernetes",
      "aws",
      "ci_cd",
      "security",
    ],
    requiredJobs: ["senior_devops"],
    timeRequired: 420, // 7 minutes
  },

  // Game Development Career Path
  game_intern: {
    id: "game_intern",
    name: "Game Development Intern",
    description: "Entry-level game development position",
    category: "game",
    salary: 2000,
    requiredSkills: ["cpp", "algorithms", "computer_basics", "typing"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_game_dev: {
    id: "junior_game_dev",
    name: "Junior Game Developer",
    description: "Beginner game development position",
    category: "game",
    salary: 3500,
    requiredSkills: ["cpp", "algorithms", "unity"],
    requiredJobs: ["game_intern"],
    timeRequired: 240, // 4 minutes
  },
  game_dev: {
    id: "game_dev",
    name: "Game Developer",
    description: "Mid-level game development position",
    category: "game",
    salary: 5000,
    requiredSkills: ["cpp", "algorithms", "unity", "opengl"],
    requiredJobs: ["junior_game_dev"],
    timeRequired: 300, // 5 minutes
  },
  senior_game_dev: {
    id: "senior_game_dev",
    name: "Senior Game Developer",
    description: "Senior game development position",
    category: "game",
    salary: 8000,
    requiredSkills: ["cpp", "algorithms", "unity", "opengl", "vulkan"],
    requiredJobs: ["game_dev"],
    timeRequired: 360, // 6 minutes
  },
  game_architect: {
    id: "game_architect",
    name: "Game Architect",
    description: "Lead game development position",
    category: "game",
    salary: 12000,
    requiredSkills: [
      "cpp",
      "algorithms",
      "unity",
      "opengl",
      "vulkan",
      "networking",
    ],
    requiredJobs: ["senior_game_dev"],
    timeRequired: 420, // 7 minutes
  },

  // Mobile Development Career Path
  mobile_intern: {
    id: "mobile_intern",
    name: "Mobile Development Intern",
    description: "Entry-level mobile development position",
    category: "mobile",
    salary: 2000,
    requiredSkills: ["java", "html", "computer_basics", "typing"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_mobile_dev: {
    id: "junior_mobile_dev",
    name: "Junior Mobile Developer",
    description: "Beginner mobile development position",
    category: "mobile",
    salary: 3500,
    requiredSkills: ["java", "html", "android"],
    requiredJobs: ["mobile_intern"],
    timeRequired: 240, // 4 minutes
  },
  mobile_dev: {
    id: "mobile_dev",
    name: "Mobile Developer",
    description: "Mid-level mobile development position",
    category: "mobile",
    salary: 5000,
    requiredSkills: ["java", "html", "android", "react_native"],
    requiredJobs: ["junior_mobile_dev"],
    timeRequired: 300, // 5 minutes
  },
  senior_mobile_dev: {
    id: "senior_mobile_dev",
    name: "Senior Mobile Developer",
    description: "Senior mobile development position",
    category: "mobile",
    salary: 8000,
    requiredSkills: ["java", "html", "android", "react_native", "ios"],
    requiredJobs: ["mobile_dev"],
    timeRequired: 360, // 6 minutes
  },
  mobile_architect: {
    id: "mobile_architect",
    name: "Mobile Architect",
    description: "Lead mobile development position",
    category: "mobile",
    salary: 12000,
    requiredSkills: [
      "java",
      "html",
      "android",
      "react_native",
      "ios",
      "security",
    ],
    requiredJobs: ["senior_mobile_dev"],
    timeRequired: 420, // 7 minutes
  },

  // AI/ML Career Path
  ai_intern: {
    id: "ai_intern",
    name: "AI/ML Intern",
    description: "Entry-level AI/ML position",
    category: "ai",
    salary: 2500,
    requiredSkills: ["python", "algorithms", "computer_basics", "typing"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_ai_engineer: {
    id: "junior_ai_engineer",
    name: "Junior AI Engineer",
    description: "Beginner AI/ML position",
    category: "ai",
    salary: 4000,
    requiredSkills: ["python", "algorithms", "machine_learning"],
    requiredJobs: ["ai_intern"],
    timeRequired: 240, // 4 minutes
  },
  ai_engineer: {
    id: "ai_engineer",
    name: "AI Engineer",
    description: "Mid-level AI/ML position",
    category: "ai",
    salary: 6000,
    requiredSkills: ["python", "algorithms", "machine_learning", "tensorflow"],
    requiredJobs: ["junior_ai_engineer"],
    timeRequired: 300, // 5 minutes
  },
  senior_ai_engineer: {
    id: "senior_ai_engineer",
    name: "Senior AI Engineer",
    description: "Senior AI/ML position",
    category: "ai",
    salary: 9000,
    requiredSkills: [
      "python",
      "algorithms",
      "machine_learning",
      "tensorflow",
      "deep_learning",
    ],
    requiredJobs: ["ai_engineer"],
    timeRequired: 360, // 6 minutes
  },
  ai_architect: {
    id: "ai_architect",
    name: "AI Architect",
    description: "Lead AI/ML position",
    category: "ai",
    salary: 13000,
    requiredSkills: [
      "python",
      "algorithms",
      "machine_learning",
      "tensorflow",
      "deep_learning",
      "security",
    ],
    requiredJobs: ["senior_ai_engineer"],
    timeRequired: 420, // 7 minutes
  },

  // Security Career Path
  security_intern: {
    id: "security_intern",
    name: "Security Intern",
    description: "Entry-level security position",
    category: "security",
    salary: 2500,
    requiredSkills: ["security", "networking", "computer_basics", "typing"],
    requiredJobs: ["junior_tech"],
    timeRequired: 180, // 3 minutes
  },
  junior_security: {
    id: "junior_security",
    name: "Junior Security Engineer",
    description: "Beginner security position",
    category: "security",
    salary: 4000,
    requiredSkills: ["security", "networking", "cryptography"],
    requiredJobs: ["security_intern"],
    timeRequired: 240, // 4 minutes
  },
  security_engineer: {
    id: "security_engineer",
    name: "Security Engineer",
    description: "Mid-level security position",
    category: "security",
    salary: 6000,
    requiredSkills: [
      "security",
      "networking",
      "cryptography",
      "penetration_testing",
    ],
    requiredJobs: ["junior_security"],
    timeRequired: 300, // 5 minutes
  },
  senior_security: {
    id: "senior_security",
    name: "Senior Security Engineer",
    description: "Senior security position",
    category: "security",
    salary: 9000,
    requiredSkills: [
      "security",
      "networking",
      "cryptography",
      "penetration_testing",
      "linux",
    ],
    requiredJobs: ["security_engineer"],
    timeRequired: 360, // 6 minutes
  },
  security_architect: {
    id: "security_architect",
    name: "Security Architect",
    description: "Lead security position",
    category: "security",
    salary: 13000,
    requiredSkills: [
      "security",
      "networking",
      "cryptography",
      "penetration_testing",
      "linux",
      "ci_cd",
    ],
    requiredJobs: ["senior_security"],
    timeRequired: 420, // 7 minutes
  },
};
