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
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
