import {Component, OnDestroy, OnInit} from '@angular/core';
import {Car} from "../../shared/models/car";
import {ContractService} from "../../shared/services/contract.service";
import {ActivatedRoute} from "@angular/router";
import IpfsUtils from "../../util/ipfs-utils";
import {HttpClient} from "@angular/common/http";
import {CarIpfs} from "../../shared/ipfs-models/car-ipfs";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit, OnDestroy {
  private car: Car;
  private sub: any;
  private carImages: string[];
  private carIpfs: CarIpfs;

  constructor(private contractService: ContractService,
              private route: ActivatedRoute,
              private http: HttpClient) {
    this.car = new Car();
    this.carImages = [];
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.load(params);
    });
  }

  async load(params: any) {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    this.car.id = +params['id'];
    this.car = await this.contractService.getCar(this.car.id);
    this.http.get(IpfsUtils.IPFS_SERVER + this.car.metaIpfsHash).subscribe(x => {
      this.carIpfs = x as CarIpfs;
      this.car.make = this.carIpfs.make;
      this.car.model = this.carIpfs.model;
      this.car.description = this.carIpfs.description;
      this.car.dateOfRegistration = this.carIpfs.dateOfRegistration;

      this.carIpfs.images.forEach(i => this.carImages.push(IpfsUtils.IPFS_SERVER + i));
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
