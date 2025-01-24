import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.depot.lpgmanager.app',
  appName: 'LPG-Manager',
  webDir: 'dist/apps/depot/browser',
  server: {
    androidScheme: 'http'
  }
};

export default config;
