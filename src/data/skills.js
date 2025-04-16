export const skills = {
  // Basic Computer Skills
  computer_basics: {
    id: "computer_basics",
    name: "Computer Basics",
    description: "Understanding how to use a computer",
    category: "basic",
    prerequisites: [],
    timeRequired: 10, // 10 seconds
  },
  typing: {
    id: "typing",
    name: "Touch Typing",
    description: "Fast and accurate typing skills",
    category: "basic",
    prerequisites: ["computer_basics"],
    timeRequired: 30, // 30 seconds
  },
  internet_basics: {
    id: "internet_basics",
    name: "Internet Basics",
    description: "Understanding how to use the internet",
    category: "basic",
    prerequisites: ["computer_basics"],
    timeRequired: 30, // 30 seconds
  },
  problem_solving: {
    id: "problem_solving",
    name: "Problem Solving",
    description: "Basic problem-solving skills",
    category: "basic",
    prerequisites: ["computer_basics"],
    timeRequired: 60, // 1 minute
  },
  math_basics: {
    id: "math_basics",
    name: "Basic Math",
    description: "Basic mathematical skills",
    category: "basic",
    prerequisites: [],
    timeRequired: 30, // 30 seconds
  },
  logic: {
    id: "logic",
    name: "Logical Thinking",
    description: "Basic logical reasoning skills",
    category: "basic",
    prerequisites: ["math_basics"],
    timeRequired: 60, // 1 minute
  },

  // Programming Languages
  javascript: {
    id: "javascript",
    name: "JavaScript",
    description: "The language of the web",
    category: "programming",
    prerequisites: [],
    timeRequired: 120, // 2 minutes
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    description: "Typed JavaScript",
    category: "programming",
    prerequisites: ["javascript"],
    timeRequired: 180, // 3 minutes
  },
  python: {
    id: "python",
    name: "Python",
    description: "Versatile programming language",
    category: "programming",
    prerequisites: [],
    timeRequired: 120, // 2 minutes
  },
  java: {
    id: "java",
    name: "Java",
    description: "Enterprise-grade programming language",
    category: "programming",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },
  csharp: {
    id: "csharp",
    name: "C#",
    description: "Game development language",
    category: "programming",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },
  cpp: {
    id: "cpp",
    name: "C++",
    description: "Systems programming language",
    category: "programming",
    prerequisites: [],
    timeRequired: 240, // 4 minutes
  },
  rust: {
    id: "rust",
    name: "Rust",
    description: "Modern systems programming language",
    category: "programming",
    prerequisites: ["cpp"],
    timeRequired: 300, // 5 minutes
  },
  swift: {
    id: "swift",
    name: "Swift",
    description: "iOS and macOS development language",
    category: "programming",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },

  // Web Development
  html: {
    id: "html",
    name: "HTML",
    description: "Web page structure",
    category: "web",
    prerequisites: [],
    timeRequired: 60, // 1 minute
  },
  css: {
    id: "css",
    name: "CSS",
    description: "Web styling",
    category: "web",
    prerequisites: ["html"],
    timeRequired: 120, // 2 minutes
  },
  react: {
    id: "react",
    name: "React",
    description: "Frontend framework",
    category: "web",
    prerequisites: ["javascript", "html", "css"],
    timeRequired: 240, // 4 minutes
  },
  vue: {
    id: "vue",
    name: "Vue.js",
    description: "Frontend framework",
    category: "web",
    prerequisites: ["javascript", "html", "css"],
    timeRequired: 240, // 4 minutes
  },
  nodejs: {
    id: "nodejs",
    name: "Node.js",
    description: "Backend JavaScript runtime",
    category: "web",
    prerequisites: ["javascript"],
    timeRequired: 180, // 3 minutes
  },
  express: {
    id: "express",
    name: "Express.js",
    description: "Backend web framework",
    category: "web",
    prerequisites: ["nodejs"],
    timeRequired: 180, // 3 minutes
  },

  // Database
  sql: {
    id: "sql",
    name: "SQL",
    description: "Database querying",
    category: "database",
    prerequisites: [],
    timeRequired: 120, // 2 minutes
  },
  mongodb: {
    id: "mongodb",
    name: "MongoDB",
    description: "NoSQL database",
    category: "database",
    prerequisites: ["javascript"],
    timeRequired: 180, // 3 minutes
  },
  postgresql: {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Relational database",
    category: "database",
    prerequisites: ["sql"],
    timeRequired: 180, // 3 minutes
  },
  redis: {
    id: "redis",
    name: "Redis",
    description: "In-memory database",
    category: "database",
    prerequisites: ["sql"],
    timeRequired: 180, // 3 minutes
  },

  // DevOps & Cloud
  git: {
    id: "git",
    name: "Git",
    description: "Version control",
    category: "devops",
    prerequisites: [],
    timeRequired: 60, // 1 minute
  },
  docker: {
    id: "docker",
    name: "Docker",
    description: "Containerization",
    category: "devops",
    prerequisites: ["git"],
    timeRequired: 180, // 3 minutes
  },
  kubernetes: {
    id: "kubernetes",
    name: "Kubernetes",
    description: "Container orchestration",
    category: "devops",
    prerequisites: ["docker"],
    timeRequired: 300, // 5 minutes
  },
  aws: {
    id: "aws",
    name: "AWS",
    description: "Cloud platform",
    category: "devops",
    prerequisites: ["docker"],
    timeRequired: 300, // 5 minutes
  },
  ci_cd: {
    id: "ci_cd",
    name: "CI/CD",
    description: "Continuous Integration/Deployment",
    category: "devops",
    prerequisites: ["git", "docker"],
    timeRequired: 240, // 4 minutes
  },

  // Game Development
  unity: {
    id: "unity",
    name: "Unity",
    description: "Game engine",
    category: "game",
    prerequisites: ["csharp"],
    timeRequired: 300, // 5 minutes
  },
  unreal: {
    id: "unreal",
    name: "Unreal Engine",
    description: "Game engine",
    category: "game",
    prerequisites: ["cpp"],
    timeRequired: 300, // 5 minutes
  },
  opengl: {
    id: "opengl",
    name: "OpenGL",
    description: "Graphics library",
    category: "game",
    prerequisites: ["cpp"],
    timeRequired: 240, // 4 minutes
  },
  vulkan: {
    id: "vulkan",
    name: "Vulkan",
    description: "Graphics API",
    category: "game",
    prerequisites: ["opengl"],
    timeRequired: 360, // 6 minutes
  },

  // Mobile Development
  android: {
    id: "android",
    name: "Android Development",
    description: "Mobile app development",
    category: "mobile",
    prerequisites: ["java"],
    timeRequired: 240, // 4 minutes
  },
  ios: {
    id: "ios",
    name: "iOS Development",
    description: "Mobile app development",
    category: "mobile",
    prerequisites: ["swift"],
    timeRequired: 240, // 4 minutes
  },
  react_native: {
    id: "react_native",
    name: "React Native",
    description: "Cross-platform mobile development",
    category: "mobile",
    prerequisites: ["react", "javascript"],
    timeRequired: 300, // 5 minutes
  },

  // AI & Machine Learning
  machine_learning: {
    id: "machine_learning",
    name: "Machine Learning",
    description: "AI algorithms and models",
    category: "ai",
    prerequisites: ["python", "math"],
    timeRequired: 360, // 6 minutes
  },
  deep_learning: {
    id: "deep_learning",
    name: "Deep Learning",
    description: "Neural networks",
    category: "ai",
    prerequisites: ["machine_learning"],
    timeRequired: 420, // 7 minutes
  },
  tensorflow: {
    id: "tensorflow",
    name: "TensorFlow",
    description: "Machine learning framework",
    category: "ai",
    prerequisites: ["python", "machine_learning"],
    timeRequired: 300, // 5 minutes
  },
  math: {
    id: "math",
    name: "Advanced Mathematics",
    description: "Advanced mathematical concepts for AI/ML",
    category: "fundamentals",
    prerequisites: ["math_basics"],
    timeRequired: 240, // 4 minutes
  },

  // Security
  security: {
    id: "security",
    name: "Security",
    description: "Software security principles",
    category: "security",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },
  cryptography: {
    id: "cryptography",
    name: "Cryptography",
    description: "Encryption and security",
    category: "security",
    prerequisites: ["security"],
    timeRequired: 240, // 4 minutes
  },
  penetration_testing: {
    id: "penetration_testing",
    name: "Penetration Testing",
    description: "Security testing",
    category: "security",
    prerequisites: ["security", "networking"],
    timeRequired: 300, // 5 minutes
  },

  // Other
  algorithms: {
    id: "algorithms",
    name: "Algorithms",
    description: "Problem-solving algorithms",
    category: "fundamentals",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },
  data_structures: {
    id: "data_structures",
    name: "Data Structures",
    description: "Data organization",
    category: "fundamentals",
    prerequisites: ["algorithms"],
    timeRequired: 240, // 4 minutes
  },
  networking: {
    id: "networking",
    name: "Networking",
    description: "Computer networks",
    category: "fundamentals",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },
  linux: {
    id: "linux",
    name: "Linux",
    description: "Operating system",
    category: "fundamentals",
    prerequisites: [],
    timeRequired: 180, // 3 minutes
  },
};
