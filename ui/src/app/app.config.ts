import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideStore } from '@ngxs/store';

import { routes } from './app.routes';
import { MyYellowPreset } from '../assets/theme/mytheme';
import { AppState } from './app.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      inputStyle: 'outlined', // 'outlined' | 'filled';
      theme: {
          preset: MyYellowPreset,
          options: {
            darkModeSelector: '.dark',
        },
      }
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore([AppState])
  ]
};
