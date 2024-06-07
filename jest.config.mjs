// jest.config.mjs
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./testSetup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
