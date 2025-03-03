import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { routes } from './app.routes';
import { AuthState } from '../store/auth/auth.state';
import { AppState } from '../store/app/app.state';
import { provideStore } from '@ngxs/store';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    // provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore([AuthState, AppState]),
    // devtools always last after NgxsModule
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({
        // disabled: environment.production,
      })
    ),

  ]
};
