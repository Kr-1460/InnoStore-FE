import {
  ApplicationConfig,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  HttpClient,
  withFetch
} from '@angular/common/http';

import { environment } from '../environments/environment.development';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';
import { UnauthorizedInterceptor } from '../app/interceptors/unathorized.interceptor';

const getRedirectUri = () => {
  return typeof window !== 'undefined' ? window.location.origin : '';
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authHttpInterceptorFn]),
      withInterceptorsFromDi()
    ),

    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: getRedirectUri(),
        audience: environment.auth.audience,
        scope: 'openid profile email',
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: environment.auth.access_token_uri,
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth.audience,
                scope: 'openid profile email',
              },
            },
          },
        ],
      },
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },

    provideClientHydration(withEventReplay()),
  ],
};