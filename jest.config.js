export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setUpTest.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
};
