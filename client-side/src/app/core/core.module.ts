import {NgModule} from '@angular/core';

import {NavComponent} from './nav/nav.component';
import {FooterComponent} from "./footer/footer.component";

@NgModule({
  imports: [],
  exports: [
    NavComponent,
    FooterComponent
  ],
  declarations: [
    NavComponent,
    FooterComponent,
  ],
  providers: [
  ]
})
export class CoreModule { }
