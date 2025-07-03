export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setUpTest.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "\\.(css|less)$": "identity-obj-proxy",
  },
};
