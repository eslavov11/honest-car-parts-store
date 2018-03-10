import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';


import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {SellerRegisterComponent} from "./seller/seller-register/seller-register.component";
import {ContractService} from "./shared/services/contract.service";
import {SellerDetailComponent} from "./seller/seller-detail/seller-detail.component";
import {CustomerRegisterComponent} from "./customer/customer-register/customer-register.component";
import {CustomerDetailComponent} from './customer/customer-detail/customer-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SellerRegisterComponent,
    SellerDetailComponent,
    CustomerRegisterComponent,
    CustomerDetailComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ContractService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
