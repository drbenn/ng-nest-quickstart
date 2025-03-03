import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { AppState } from '../store/app/app.state';
import { UserState } from '../store/user/user.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore([AuthState, AppState, UserState]),
    // // devtools always last after NgxsModule
    // importProvidersFrom(
    //   NgxsReduxDevtoolsPluginModule.forRoot({
    //     // disabled: environment.production,
    //   })
    // ),
  
  ]
};
