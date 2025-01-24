import type { CapacitorConfig } from '@capacitor/cli';

const appName = process.env['LPG_APP_NAME'];

console.log( process.env['LPG_APP_NAME'])

const configMapping: Record<string, CapacitorConfig> = {
  depot: {
    appId: 'com.depot.lpgmanager.app',
    appName: 'LPG-Manager Depot',
    webDir: 'dist/apps/depot/browser',
    android: { path: 'android/depot' },
    server: { androidScheme: 'http' },
  },
  dealer: {
    appId: 'com.dealer.lpgmanager.app',
    appName: 'LPG-Manager Dealer',
    webDir: 'dist/apps/dealer/browser',
    android: { path: 'android/dealer' },
    server: { androidScheme: 'http' },
  },
  driver: {
    appId: 'com.driver.lpgmanager.app',
    appName: 'LPG-Manager Driver',
    webDir: 'dist/apps/driver/browser',
    android: { path: 'android/driver' },
    server: { androidScheme: 'http' },
  },
};

// Use the app-specific config or fallback to an empty object
const config: CapacitorConfig = configMapping[appName] || {};

export default config;
