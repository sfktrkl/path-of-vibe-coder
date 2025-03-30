export const skills = {
  // Programming Languages
  javascript: {
    id: "javascript",
    name: "JavaScript",
    description: "The language of the web",
    category: "programming",
    prerequisites: [],
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    description: "Typed JavaScript",
    category: "programming",
    prerequisites: ["javascript"],
  },
  python: {
    id: "python",
    name: "Python",
    description: "Versatile programming language",
    category: "programming",
    prerequisites: [],
  },
  java: {
    id: "java",
    name: "Java",
    description: "Enterprise-grade programming language",
    category: "programming",
    prerequisites: [],
  },
  cpp: {
    id: "cpp",
    name: "C++",
    description: "Systems programming language",
    category: "programming",
    prerequisites: [],
  },
  rust: {
    id: "rust",
    name: "Rust",
    description: "Modern systems programming language",
    category: "programming",
    prerequisites: ["cpp"],
  },

  // Web Development
  html: {
    id: "html",
    name: "HTML",
    description: "Web page structure",
    category: "web",
    prerequisites: [],
  },
  css: {
    id: "css",
    name: "CSS",
    description: "Web styling",
    category: "web",
    prerequisites: ["html"],
  },
  react: {
    id: "react",
    name: "React",
    description: "Frontend framework",
    category: "web",
    prerequisites: ["javascript", "html", "css"],
  },
  vue: {
    id: "vue",
    name: "Vue.js",
    description: "Frontend framework",
    category: "web",
    prerequisites: ["javascript", "html", "css"],
  },
  nodejs: {
    id: "nodejs",
    name: "Node.js",
    description: "Backend JavaScript runtime",
    category: "web",
    prerequisites: ["javascript"],
  },
  express: {
    id: "express",
    name: "Express.js",
    description: "Backend web framework",
    category: "web",
    prerequisites: ["nodejs"],
  },

  // Database
  sql: {
    id: "sql",
    name: "SQL",
    description: "Database querying",
    category: "database",
    prerequisites: [],
  },
  mongodb: {
    id: "mongodb",
    name: "MongoDB",
    description: "NoSQL database",
    category: "database",
    prerequisites: ["javascript"],
  },
  postgresql: {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Relational database",
    category: "database",
    prerequisites: ["sql"],
  },
  redis: {
    id: "redis",
    name: "Redis",
    description: "In-memory database",
    category: "database",
    prerequisites: ["sql"],
  },

  // DevOps & Cloud
  git: {
    id: "git",
    name: "Git",
    description: "Version control",
    category: "devops",
    prerequisites: [],
  },
  docker: {
    id: "docker",
    name: "Docker",
    description: "Containerization",
    category: "devops",
    prerequisites: ["git"],
  },
  kubernetes: {
    id: "kubernetes",
    name: "Kubernetes",
    description: "Container orchestration",
    category: "devops",
    prerequisites: ["docker"],
  },
  aws: {
    id: "aws",
    name: "AWS",
    description: "Cloud platform",
    category: "devops",
    prerequisites: ["docker"],
  },
  ci_cd: {
    id: "ci_cd",
    name: "CI/CD",
    description: "Continuous Integration/Deployment",
    category: "devops",
    prerequisites: ["git", "docker"],
  },

  // Game Development
  unity: {
    id: "unity",
    name: "Unity",
    description: "Game engine",
    category: "game",
    prerequisites: ["csharp"],
  },
  unreal: {
    id: "unreal",
    name: "Unreal Engine",
    description: "Game engine",
    category: "game",
    prerequisites: ["cpp"],
  },
  opengl: {
    id: "opengl",
    name: "OpenGL",
    description: "Graphics library",
    category: "game",
    prerequisites: ["cpp"],
  },
  vulkan: {
    id: "vulkan",
    name: "Vulkan",
    description: "Graphics API",
    category: "game",
    prerequisites: ["opengl"],
  },

  // Mobile Development
  android: {
    id: "android",
    name: "Android Development",
    description: "Mobile app development",
    category: "mobile",
    prerequisites: ["java"],
  },
  ios: {
    id: "ios",
    name: "iOS Development",
    description: "Mobile app development",
    category: "mobile",
    prerequisites: ["swift"],
  },
  react_native: {
    id: "react_native",
    name: "React Native",
    description: "Cross-platform mobile development",
    category: "mobile",
    prerequisites: ["react", "javascript"],
  },

  // AI & Machine Learning
  machine_learning: {
    id: "machine_learning",
    name: "Machine Learning",
    description: "AI algorithms and models",
    category: "ai",
    prerequisites: ["python", "math"],
  },
  deep_learning: {
    id: "deep_learning",
    name: "Deep Learning",
    description: "Neural networks",
    category: "ai",
    prerequisites: ["machine_learning"],
  },
  tensorflow: {
    id: "tensorflow",
    name: "TensorFlow",
    description: "Machine learning framework",
    category: "ai",
    prerequisites: ["python", "machine_learning"],
  },

  // Security
  security: {
    id: "security",
    name: "Security",
    description: "Software security principles",
    category: "security",
    prerequisites: [],
  },
  cryptography: {
    id: "cryptography",
    name: "Cryptography",
    description: "Encryption and security",
    category: "security",
    prerequisites: ["security"],
  },
  penetration_testing: {
    id: "penetration_testing",
    name: "Penetration Testing",
    description: "Security testing",
    category: "security",
    prerequisites: ["security", "networking"],
  },

  // Other
  algorithms: {
    id: "algorithms",
    name: "Algorithms",
    description: "Problem-solving algorithms",
    category: "fundamentals",
    prerequisites: [],
  },
  data_structures: {
    id: "data_structures",
    name: "Data Structures",
    description: "Data organization",
    category: "fundamentals",
    prerequisites: ["algorithms"],
  },
  networking: {
    id: "networking",
    name: "Networking",
    description: "Computer networks",
    category: "fundamentals",
    prerequisites: [],
  },
  linux: {
    id: "linux",
    name: "Linux",
    description: "Operating system",
    category: "fundamentals",
    prerequisites: [],
  },
};
