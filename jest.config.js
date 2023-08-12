/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'config.ts',
    'src/db/db.connect.ts',
    'src/repository/user.mongo.model.ts',
    'src/routers/user.router.ts',
    'src/controllers/controller.ts',
    'index.html',
    'src/repository/nudibranch.mongo.model.ts',
    'src/routers/nudibranch.router.ts'
  ],
};
