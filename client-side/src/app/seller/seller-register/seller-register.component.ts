import {Component, OnInit} from '@angular/core';
import {ContractService} from '../../shared/services/contract.service';
import {Seller} from "../../shared/models/seller";
import { NgModel } from '@angular/forms';
import {NgForm} from '@angular/forms'
import {Router} from "@angular/router";

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {

  constructor(private contractService: ContractService,
              private router:Router) {
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();
  }

  async onSubmit(f: NgForm) {
    await this.contractService.registerSeller(f.value.name, f.value.shippingAddress);
    this.router.navigate(['']);
  }
}
