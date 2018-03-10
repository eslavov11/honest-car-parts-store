import {NgModule} from '@angular/core';

import {NavComponent} from './nav/nav.component';
import {FooterComponent} from "./footer/footer.component";
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
  imports: [
    AppRoutingModule
  ],
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
