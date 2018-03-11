import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContractService} from "../../shared/services/contract.service";
import {Customer} from "../../shared/models/customer";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  private customer: Customer;
  private balance: number;
  private sub: any;

  constructor(private contractService: ContractService,
              private route: ActivatedRoute,) {
    this.customer = new Customer();
    this.balance = 0;
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.load(params);
    });
  }

  async load(params: any) {
    const address = params['address'];
    if (address) {
      this.balance = await this.contractService.getBalanceForAccount(address);
      this.customer = await this.contractService.getCustomer(address);
    } else {
      await this.contractService.loadAccounts();
      await this.contractService.getBalance();

      this.balance = this.contractService.accountBalance;
      this.customer = await this.contractService.getCustomer(this.contractService.account);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
