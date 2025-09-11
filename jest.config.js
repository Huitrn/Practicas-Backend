module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
  ,globalSetup: './tests/globalSetup.js'
};
