module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!routes/**',
    '!middleware/**',
    '!app.js',
    '!index.js',
    '!main.ts',
    '!**/*.module.ts',
    '!config/**',
    '!lib/prisma.js',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^packages/(.*)$': '<rootDir>/../../packages/$1',
  },
};
