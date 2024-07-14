import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideAnimations(),
    provideToastr({
      closeButton: true,
      positionClass: 'toast-top-right',
      timeOut: 10000,
      preventDuplicates: true,
    }),
  ],
};
