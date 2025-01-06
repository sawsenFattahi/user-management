import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@le-common/(.*)$': '<rootDir>/src/common/$1',
    '^@le-users/(.*)$': '<rootDir>/src/modules/users/$1',
    '^@le-auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@le-decorators/(.*)$': '<rootDir>/src/common/decorators/$1',
    '^@le-guards/(.*)$': '<rootDir>/src/common/guards/$1',
    '^@le-strategies/(.*)$': '<rootDir>/src/common/strategies/$1',
    '^@le-schemas/(.*)$': '<rootDir>/src/infrastructure/database/schemas/$1',
    '^@le-repositories/(.*)$': '<rootDir>/src/infrastructure/database/repositories/$1',
    '^@le-entities/(.*)$': '<rootDir>/src/core/entities/$1',
    '^@le-config/(.*)$': '<rootDir>/src/config/$1',
    '^@le-swagger/(.*)$': '<rootDir>/src/swagger/$1',
    '^@le-modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@le-core/(.*)$': '<rootDir>/src/core/$1',
    '^@le-interfaces/(.*)$': '<rootDir>/src/core/interfaces/$1',
    '^@le-use-cases/(.*)$': '<rootDir>/src/core/use-cases/$1',
    '^@le-infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  },
  coverageDirectory: './coverage',
  coverageReporters: ['html'],
  collectCoverageFrom: ['src/**/*.(ts|js)', '!**/*.d.ts', '!**/test/**'],
  testEnvironment: 'node',
};

export default config;
