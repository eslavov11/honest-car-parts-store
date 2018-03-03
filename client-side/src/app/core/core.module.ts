import {NgModule, Optional, SkipSelf} from '@angular/core';

import {NavComponent} from './nav/nav.component';

@NgModule({
  imports: [],
  exports: [
    NavComponent,
    // FooterComponent
  ],
  declarations: [
    NavComponent,
    // FooterComponent,
  ],
  providers: [
  ]
})
export class CoreModule { }
