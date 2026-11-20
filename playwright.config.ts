import { defineConfig, devices } from '@playwright/test';

// Node lo define al ejecutar Playwright; se declara aquí para no añadir sus tipos a todo el proyecto.
declare const process: { env: Record<string, string | undefined> };
const CI = !!process.env.CI;

// Tests E2E con la API simulada (tests/e2e/support/mockApi.ts): no hace falta backend.
// Se prueba en horizontal, como la tablet colgada. Arranca el servidor de desarrollo si no está en marcha.
export default defineConfig({
  testDir: 'tests/e2e',
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'tablet',
      use: {
        browserName: 'chromium',
        // Para usar un Chromium ya instalado (p. ej. en un contenedor) en vez del que descarga Playwright
        launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH || undefined },
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
