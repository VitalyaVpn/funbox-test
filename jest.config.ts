import type {Config} from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    testEnvironment: 'jsdom',
    verbose: true,
    setupFilesAfterEnv: [
        "<rootDir>/src/setupTests.ts"
    ],
};
export default config;