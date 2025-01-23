import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideStore } from '@ngxs/store';

import { routes } from './app.routes';
import { MyYellowPreset } from '../assets/theme/mytheme-yellow';
import { MyDarkPreset } from '../assets/theme/mytheme';
import { AppState } from '../store/app/app.state';
import { AuthState } from '../store/auth/auth.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      inputStyle: 'outlined',             // 'outlined' | 'filled';
      theme: {
          preset: MyDarkPreset,
          options: {
            darkModeSelector: '.dark',
        },
      }
    }),
    importProvidersFrom(ToastModule),     // Import PrimeNG ToastModule to entire application
    MessageService,                       // Provide PrimeNG MessageService to entrire application
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore([AuthState]),
    // devtools always last after NgxsModule
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({
        // disabled: environment.production,
      })
    ),

  ]
};
