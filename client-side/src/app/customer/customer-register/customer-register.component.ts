import {Component, OnInit} from '@angular/core';
import {ContractService} from "../../shared/services/contract.service";
import {Router} from '@angular/router';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.css']
})
export class CustomerRegisterComponent implements OnInit {
  constructor(private contractService: ContractService,
              private router: Router) {
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();
  }

  async onSubmit(f: NgForm) {
    await this.contractService.registerCustomer(f.value.name, f.value.shippingAddress);
    this.router.navigate(['']);
  }
}
