module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**'],
  globalSetup: '<rootDir>/node_modules/@databases/pg-test/jest/globalSetup.js',
  globalTeardown: '<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown.js'
}
