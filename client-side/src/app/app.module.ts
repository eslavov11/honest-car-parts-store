import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {ContractService} from "./shared/services/contract.service";
import {FooterComponent} from "./footer/footer.component";
import {NavComponent} from "./nav/nav.component";
import {SellerRegisterComponent} from "./seller/seller-register/seller-register.component";
import {SellerDetailComponent} from "./seller/seller-detail/seller-detail.component";
import {CustomerRegisterComponent} from "./customer/customer-register/customer-register.component";
import {CustomerDetailComponent} from './customer/customer-detail/customer-detail.component';
import {CarAddComponent} from "./car/car-add/car-add.component";
import {CarDetailComponent} from "./car/car-detail/car-detail.component";
import {CarListComponent} from "./car/car-list/car-list.component";
import {PartAddComponent} from "./part/part-add/part-add.component";
import {PartDetailComponent} from "./part/part-detail/part-detail.component";
import {PartListComponent} from "./part/part-list/part-list.component";
import {OrderDetailComponent} from "./order/order-detail/order-detail.component";
import {OrderEditComponent} from "./order/order-edit/order-edit.component";
import {OrderListComponent} from "./order/order-list/order-list.component";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    SellerRegisterComponent,
    SellerDetailComponent,
    CustomerRegisterComponent,
    CustomerDetailComponent,
    CarAddComponent,
    CarDetailComponent,
    CarListComponent,
    PartAddComponent,
    PartDetailComponent,
    PartListComponent,
    OrderDetailComponent,
    OrderEditComponent,
    OrderListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ContractService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
