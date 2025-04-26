module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@styles/(.*)$": "<rootDir>/src/assets/styles/$1",
    "^@items/(.*)$": "<rootDir>/src/components/game/items/$1",
    "^@views/(.*)$": "<rootDir>/src/components/game/views/$1",
    "^@layout/(.*)$": "<rootDir>/src/components/layout/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@mixins/(.*)$": "<rootDir>/src/mixins/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
