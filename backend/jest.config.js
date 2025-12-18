module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transformIgnorePatterns: ['/node_modules/(?!next-auth)/'],
    transform: {
        '^.+\\.(t|j)sx?$': ['ts-jest', {
            tsconfig: '<rootDir>/tsconfig.json',
            useESM: true,
        }],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};
