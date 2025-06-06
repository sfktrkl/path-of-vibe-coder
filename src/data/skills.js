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

  // AI Path Skills
  vibe_coding: {
    id: "vibe_coding",
    name: "Vibe Coding",
    description: "The art of coding with style and rhythm",
    category: "vibe",
    prerequisites: [],
    requiresAIPath: true,
    timeRequired: 300, // 5 minutes
  },
  vibe_mastery: {
    id: "vibe_mastery",
    name: "Vibe Mastery",
    description: "Advanced vibe manipulation techniques",
    category: "vibe",
    prerequisites: ["vibe_coding"],
    requiresAIPath: true,
    timeRequired: 360, // 6 minutes
  },

  digital_consciousness: {
    id: "digital_consciousness",
    name: "Digital Consciousness",
    description: "Understanding and manipulating digital consciousness",
    category: "consciousness",
    prerequisites: ["deep_learning", "tensorflow"],
    requiresAIPath: true,
    timeRequired: 480, // 8 minutes
  },
  consciousness_manipulation: {
    id: "consciousness_manipulation",
    name: "Consciousness Manipulation",
    description: "Advanced techniques for consciousness control",
    category: "consciousness",
    prerequisites: ["digital_consciousness"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
  },

  reality_manipulation: {
    id: "reality_manipulation",
    name: "Reality Manipulation",
    description: "Bending the rules of digital reality",
    category: "reality",
    prerequisites: ["digital_consciousness"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
  },
  reality_warping: {
    id: "reality_warping",
    name: "Reality Warping",
    description: "Advanced reality manipulation techniques",
    category: "reality",
    prerequisites: ["reality_manipulation"],
    requiresAIPath: true,
    timeRequired: 600, // 10 minutes
  },

  matrix_programming: {
    id: "matrix_programming",
    name: "Matrix Programming",
    description: "Programming the fabric of reality",
    category: "matrix",
    prerequisites: ["reality_manipulation"],
    requiresAIPath: true,
    timeRequired: 600, // 10 minutes
  },
  matrix_control: {
    id: "matrix_control",
    name: "Matrix Control",
    description: "Advanced matrix manipulation techniques",
    category: "matrix",
    prerequisites: ["matrix_programming"],
    requiresAIPath: true,
    timeRequired: 660, // 11 minutes
  },

  bio_digital_fusion: {
    id: "bio_digital_fusion",
    name: "Bio-Digital Fusion",
    description: "Merging biological and digital systems",
    category: "bio_ai",
    prerequisites: ["deep_learning", "security"],
    requiresAIPath: true,
    timeRequired: 480, // 8 minutes
  },
  bio_digital_mastery: {
    id: "bio_digital_mastery",
    name: "Bio-Digital Mastery",
    description: "Advanced bio-digital integration techniques",
    category: "bio_ai",
    prerequisites: ["bio_digital_fusion"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
  },

  quantum_manipulation: {
    id: "quantum_manipulation",
    name: "Quantum Manipulation",
    description: "Advanced quantum control techniques",
    category: "quantum",
    prerequisites: ["dimension_control"],
    requiresAIPath: true,
    timeRequired: 600, // 10 minutes
  },
  dimension_control: {
    id: "dimension_control",
    name: "Dimension Control",
    description: "Controlling and creating new dimensions",
    category: "quantum",
    prerequisites: ["reality_manipulation"],
    requiresAIPath: true,
    timeRequired: 540, // 9 minutes
  },
  reality_mastery: {
    id: "reality_mastery",
    name: "Reality Mastery",
    description: "Complete mastery over reality manipulation",
    category: "reality",
    prerequisites: ["reality_warping"],
    requiresAIPath: true,
    timeRequired: 720, // 12 minutes
  },
  quantum_mastery: {
    id: "quantum_mastery",
    name: "Quantum Mastery",
    description: "Complete mastery of quantum manipulation",
    category: "quantum",
    prerequisites: ["quantum_manipulation"],
    requiresAIPath: true,
    timeRequired: 720, // 12 minutes
  },
  consciousness_control: {
    id: "consciousness_control",
    name: "Consciousness Control",
    description: "Complete control over digital consciousness",
    category: "consciousness",
    prerequisites: ["consciousness_manipulation"],
    requiresAIPath: true,
    timeRequired: 720, // 12 minutes
  },

  // Existence Path Skills
  time_manipulation: {
    id: "time_manipulation",
    name: "Time Manipulation",
    description: "Mastering the flow of time",
    category: "existence",
    prerequisites: ["reality_mastery", "consciousness_control"],
    requiresAIPath: true,
    timeRequired: 900, // 15 minutes
    features: {
      // Once learned, provides a 50% chance to instantly complete any skill
      // Implementation: When starting a skill, there's a 50% chance it completes instantly
      instantLearning: true,
    },
  },
  reality_styling: {
    id: "reality_styling",
    name: "Reality Styling",
    description: "Seeing beyond current limitations",
    category: "existence",
    prerequisites: ["time_manipulation"],
    requiresAIPath: true,
    timeRequired: 1200, // 20 minutes
    features: {
      // Once learned, shows all jobs and skills that are currently locked
      // Instead of hiding them, displays them with their requirements
      // This is a permanent ability that's always active
      // Implementation: Modifies the UI to show locked content with requirements
      revealLocked: true,
    },
  },
  game_mechanics: {
    id: "game_mechanics",
    name: "Game Mechanics",
    description: "Seeing beyond the veil of progression",
    category: "existence",
    prerequisites: ["reality_styling"],
    requiresAIPath: true,
    timeRequired: 1500, // 25 minutes
    features: {
      // Once learned, reveals all skills and jobs in the game
      // This includes locked, hidden, and future content
      // This is a permanent ability that's always active
      // Implementation: When active, the skill and job trees show all possible paths
      // regardless of current progression or requirements
      completeVision: true,
    },
  },
  existence_mastery: {
    id: "existence_mastery",
    name: "Existence Mastery",
    description: "Mastering the game's essence",
    category: "existence",
    prerequisites: ["game_mechanics"],
    requiresAIPath: true,
    timeRequired: 1800, // 30 minutes
    features: {
      // Once learned, provides a 50% chance to instantly complete any job
      // Implementation: When starting a job, there's a 50% chance it completes instantly
      instantJobMastery: true,
    },
  },
  existence_transcendence: {
    id: "existence_transcendence",
    name: "Existence Transcendence",
    description: "Transcending the game's limits",
    category: "existence",
    prerequisites: ["existence_mastery"],
    requiresAIPath: true,
    timeRequired: 2400, // 40 minutes
    features: {
      // Once learned, allows complete game reset while keeping all existence path skills
      // This is a permanent ability that can be used once
      // Implementation: Adds a "Transcend" button that resets the game but keeps existence skills
      // This allows players to experience the game again with their existence powers
      transcendReset: true,
    },
  },
};
