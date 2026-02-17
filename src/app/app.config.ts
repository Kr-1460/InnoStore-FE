import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BASE_PATH_INNOSTORE } from './core/generated/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: BASE_PATH_INNOSTORE,
      useFactory: (): string => {
        if (typeof window === 'undefined') return '';
        if ((window as any).__API_BASE_PATH !== undefined) return (window as any).__API_BASE_PATH;
        return '';
      },
    },
  ],
};
