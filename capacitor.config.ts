import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.daisuki.app',
  appName: 'Moodboard',
  webDir: 'build',
  plugins: {
    "CapacitorHttp": {
      enabled: true
    },
    "GoogleAuth": {
      scopes: ["profile", "email"],
      serverClientId: "861872270939-1em90kl6hodbisjq7prd4a9getcbkslo.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
  }
}
};

export default config;
