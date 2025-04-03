module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@items/(.*)$": "<rootDir>/src/components/game/items/$1",
    "^@views/(.*)$": "<rootDir>/src/components/game/views/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
