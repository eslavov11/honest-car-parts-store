import {Component, OnInit} from '@angular/core';
import {ContractService} from "../../shared/services/contract.service";
import {Customer} from "../../shared/models/customer";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  private customer: Customer;

  constructor(private contractService: ContractService) {
  }

  async ngOnInit() {
    this.customer = await this.contractService.getCustomer(this.contractService.account);
  }
}
