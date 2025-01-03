import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import {
  DEVTOOLS_REDUX_CONFIG,
  OPTIONS_CONFIG,
  STATES_MODULES
} from './store.config';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot(STATES_MODULES, OPTIONS_CONFIG),
    NgxsReduxDevtoolsPluginModule.forRoot(DEVTOOLS_REDUX_CONFIG)
  ],
  exports: [NgxsModule]
})
export class NgxsStoreModule {}
