import {Component, OnDestroy, OnInit} from '@angular/core';
import {Car} from "../../shared/models/car";
import {Part} from "../../shared/models/part";
import {PartIpfs} from '../../shared/ipfs-models/part-ipfs';
import {ContractService} from "../../shared/services/contract.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import IpfsUtils from "../../util/ipfs-utils";

@Component({
  selector: 'app-part-detail',
  templateUrl: './part-detail.component.html',
  styleUrls: ['./part-detail.component.css']
})
export class PartDetailComponent implements OnInit, OnDestroy {
  private part: Part;
  private car: Car;
  private sub: any;
  private partImages: string[];
  private partIpfs: PartIpfs;

  constructor(private contractService: ContractService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
    this.part = new Part();
    this.partImages = [];
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.load(params);
    });
  }

  async load(params: any) {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    const partId = +params['id'];
    this.part = await this.contractService.getPart(partId);
    this.part.id = partId;
    this.http.get(IpfsUtils.IPFS_SERVER + this.part.metaIpfsHash).subscribe(x => {
      this.partIpfs = x as PartIpfs;
      this.part.description = this.partIpfs.description;
      this.partIpfs.images.forEach(i => {
        this.partImages.push(IpfsUtils.IPFS_SERVER + i);
      });
    });
  }

  async buyPart() {
    await this.contractService.buyPart(this.part.id, this.part.price);
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
