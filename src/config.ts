import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string; serverUrl: string };
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: {
    name: 'Devias Kit',
    description: '',
    themeColor: '#090a0b',
    url: getSiteURL(),
    serverUrl: 'http://localhost:8080',
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};
