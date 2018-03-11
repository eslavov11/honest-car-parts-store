import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SellerRegisterComponent} from './seller/seller-register/seller-register.component';
import {CustomerRegisterComponent} from './customer/customer-register/customer-register.component';
import {CustomerDetailComponent} from './customer/customer-detail/customer-detail.component';
import {SellerDetailComponent} from './seller/seller-detail/seller-detail.component';
import {CarAddComponent} from "./car/car-add/car-add.component";
import {CarDetailComponent} from "./car/car-detail/car-detail.component";
import {CarListComponent} from "./car/car-list/car-list.component";
import {OrderDetailComponent} from "./order/order-detail/order-detail.component";
import {PartListComponent} from "./part/part-list/part-list.component";
import {PartDetailComponent} from "./part/part-detail/part-detail.component";
import {PartAddComponent} from './part/part-add/part-add.component';
import {OrderListComponent} from './order/order-list/order-list.component';
import {OrderEditComponent} from './order/order-edit/order-edit.component';

const routes: Routes = [
  {path: 'seller/register', component: SellerRegisterComponent},
  {path: 'seller/detail', component: SellerDetailComponent},
  {path: 'seller/detail/:address', component: SellerDetailComponent},
  {path: 'customer/register', component: CustomerRegisterComponent},
  {path: 'customer/detail', component: CustomerDetailComponent},
  {path: 'customer/detail/:address', component: CustomerDetailComponent},
  {path: 'car/add', component: CarAddComponent},
  {path: 'car/detail/:id', component: CarDetailComponent},
  {path: 'car/list', component: CarListComponent},
  {path: 'part/add', component: PartAddComponent},
  {path: 'part/detail/:id', component: PartDetailComponent},
  {path: 'part/list', component: PartListComponent},
  {path: '', component: PartListComponent},
  {path: 'order/detail/:id', component: OrderDetailComponent},
  {path: 'order/edit/:id', component: OrderEditComponent},
  {path: 'order/list', component: OrderListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
