import { BaseConfig } from './jest.config';

export const e2eConfig: typeof BaseConfig = {
  ...BaseConfig,
  collectCoverageFrom: [
    ...BaseConfig.collectCoverageFrom,
    '!**/environment.service.ts',
    '!**/dto-validation.pipe.ts',
    '!**/*.(config|spec).ts',
    '!(dist|test)/**',
    '!src/utils/**',
  ],
  coverageDirectory: 'coverage/e2e',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  maxWorkers: 1,
  rootDir: './',
  testPathIgnorePatterns: [
    '/coverage/',
    '/dist/',
    '/node_modules/',
    '/public/',
    '/src/',
  ],
  testRegex: '.e2e-spec.ts$',
};

export default e2eConfig;
