module.exports = {
    moduleFileExtensions: ['ts', 'js', 'jsx', 'tsx'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest'
    },
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
        setupFilesAfterEnv: ["./setupTests.ts"]
      },
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    preset: 'ts-jest',
    transformIgnorePatterns: ['/node_modules/(?!(module-to-ignore)/)'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    // jest: {
    //   "setupFilesAfterEnv": ["./setupTests.ts"]
    // }
  };
  