import {Component, OnInit} from '@angular/core';
import {ContractService} from '../../shared/services/contract.service';

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {
  constructor(private contractService: ContractService) {
  }

  ngOnInit() {
  }

  registerSeller() {
    // await this.contractService.registerSeller("Bai seller", "Lulin");
  }
}
