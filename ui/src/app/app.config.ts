import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppState } from './store/app/app.state';
import { AuthState } from './store/auth/auth.state';
import { AppInitializationService } from './services/app-initialization.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment.development';

const config: SocketIoConfig = {
  // url: environment.apiUrl,
  url: 'http://localhost:3000',
  options: {
    transports: ['websocket'] // Optional: force websocket transport
    // You can add other options here, like authentication tokens
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    // provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),

    // app init config
    AppInitializationService,
    provideAppInitializer(() => {
      console.log('app INIT!');
      const initService = inject(AppInitializationService);
      initService.initializeApp();
    }),

    importProvidersFrom(SocketIoModule.forRoot(config)),

    // NGXS store config
    provideStore([AuthState, AppState]),
    // devtools always last after NgxsModule
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({
        // disabled: environment.production,
      })
    ),

  ]
};
