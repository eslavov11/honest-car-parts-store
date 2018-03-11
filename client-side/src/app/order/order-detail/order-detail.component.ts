import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../shared/models/order";
import {ContractService} from "../../shared/services/contract.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private order: Order;
  private sub: any;

  constructor(private contractService: ContractService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
    this.order = new Order();
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.load(params);
    });
  }

  async load(params: any) {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    const orderId = +params['id'];
    this.order = await this.contractService.getOrder(orderId);
    this.order.id = orderId;
  }

  async buyPart() {
    // await this.contractService.buyPart(this.part.id, this.part.price);
    // this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

