import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ContractService} from "../shared/services/contract.service";
import {Seller} from "../shared/models/seller";
import {Customer} from "../shared/models/customer";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private balance: number;
  private seller: Seller;
  private customer: Customer;
  private isSeller: boolean;
  private isCustomer: boolean;
  private isRegistered: boolean;


  constructor(private contractService: ContractService) {
    this.seller = new Seller();
    this.customer = new Customer();

    this.balance = 0;
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    this.balance = this.contractService.accountBalance;
    this.seller = await this.contractService.getSeller(this.contractService.account);
    this.customer = await this.contractService.getCustomer(this.contractService.account);

    this.isSeller = !!this.seller;
    this.isCustomer = !!this.customer;
    this.isRegistered = this.isSeller || this.isCustomer;
  }
}
