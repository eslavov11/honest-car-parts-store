import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ContractService} from "../shared/services/contract.service";
import {Seller} from "../shared/models/seller";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private balance:number;

  constructor(private contractService: ContractService) {
    this.balance = 0;
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    this.balance = this.contractService.accountBalance;
  }
}
