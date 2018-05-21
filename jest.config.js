module.exports = {
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest'
  },
  testRegex: 'test/.*.spec\\.(ts|tsx|js)$',
  setupFiles: ["jest-localstorage-mock"],
  moduleFileExtensions: ['ts', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{ts}',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  globals: {
    "ts-jest": {
      "tsConfigFile": "./test/tsconfig.json"
    }
  },
  coverageReporters: ['json', 'lcov', 'text'],
  bail: true,
  verbose: true
}
