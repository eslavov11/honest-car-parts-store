import {Component, OnInit} from '@angular/core';
import {ContractService} from '../../shared/services/contract.service';

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {
  private balance:number;

  constructor(private contractService: ContractService) {
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    this.balance = this.contractService.accountBalance;

    // await this.contractService.registerSeller("Bai seller", "Lulin");
    console.log(await this.contractService.getSeller(this.contractService.account));
  }
}
