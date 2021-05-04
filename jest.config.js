module.exports = {
  roots: [ './src' ],
  testMatch: [ '<rootDir>/src/**/*.test.ts?(x)' ],
  testEnvironment: 'jsdom',
  bail: true,
  verbose: true,
  errorOnDeprecated: false,
  clearMocks: true,
  setupFiles: [ './src/setupTests.ts' ],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  transformIgnorePatterns: ['<rootDir>/node_modules/leaflet/dist/leaflet.css'],
  moduleNameMapper: {
    '\\.css$':'<rootDir>/src/__mocks__/styleMock.ts'
  }
};