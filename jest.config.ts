import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['./src/utils/fakeApi.ts', './src/slack-plugin.ts'],
  setupFiles: ['./jest.setup.js']
}
export default config
