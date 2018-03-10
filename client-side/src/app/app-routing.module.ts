import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SellerRegisterComponent} from './seller/seller-register/seller-register.component';
import {CustomerRegisterComponent} from './customer/customer-register/customer-register.component';
import {CustomerDetailComponent} from './customer/customer-detail/customer-detail.component';
import {SellerDetailComponent} from './seller/seller-detail/seller-detail.component';

const routes: Routes = [
  {path: 'seller/register', component: SellerRegisterComponent},
  {path: 'seller/detail', component: SellerDetailComponent},
  {path: 'customer/register', component: CustomerRegisterComponent},
  {path: 'customer/detail', component: CustomerDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
