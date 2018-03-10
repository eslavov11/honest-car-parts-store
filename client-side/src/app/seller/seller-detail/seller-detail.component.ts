import {Component, OnInit} from '@angular/core';
import {ContractService} from "../../shared/services/contract.service";
import {Seller} from "../../shared/models/seller";

@Component({
  selector: 'app-seller-detail',
  templateUrl: './seller-detail.component.html',
  styleUrls: ['./seller-detail.component.css']
})
export class SellerDetailComponent implements OnInit {
  private seller:Seller;

  constructor(private contractService: ContractService) {
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    // this.balance = this.contractService.accountBalance;

    this.seller = await this.contractService.getSeller(this.contractService.account);
  }
}
