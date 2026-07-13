import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Vitest reuses the Vite config (plugins, aliases, etc.) and adds the test
// runtime configuration. Splitting the file avoids the duplicated-Vite-types
// problem you get when you put `test:` directly inside vite.config.ts.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }),
)
