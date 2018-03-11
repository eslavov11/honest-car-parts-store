import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContractService} from "../../shared/services/contract.service";
import {Seller} from "../../shared/models/seller";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-seller-detail',
  templateUrl: './seller-detail.component.html',
  styleUrls: ['./seller-detail.component.css']
})
export class SellerDetailComponent implements OnInit, OnDestroy {
  private seller: Seller;
  private balance: number;
  private sub: any;

  constructor(private contractService: ContractService,
              private route: ActivatedRoute,) {
    this.seller = new Seller();
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
      this.seller = await this.contractService.getSeller(address);
    } else {
      await this.contractService.loadAccounts();
      await this.contractService.getBalance();

      this.balance = this.contractService.accountBalance;
      this.seller = await this.contractService.getSeller(this.contractService.account);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
