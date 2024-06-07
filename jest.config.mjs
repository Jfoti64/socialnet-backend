export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/server.js',
    '<rootDir>/config/db.js',
    '<rootDir>/routes/**/*.js',
    '<rootDir>/controllers/**/*.js',
    '<rootDir>/models/**/*.js',
    '<rootDir>/middleware/**/*.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
