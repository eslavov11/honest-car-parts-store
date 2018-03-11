import {Component, OnInit} from '@angular/core';
import {PartIpfs} from "../../shared/ipfs-models/part-ipfs";
import {Router} from "@angular/router";
import {ContractService} from '../../shared/services/contract.service';
import IpfsUtils from "../../util/ipfs-utils";
import {NgForm} from "@angular/forms";
import {Car} from "../../shared/models/car";

@Component({
  selector: 'app-part-add',
  templateUrl: './part-add.component.html',
  styleUrls: ['./part-add.component.css']
})
export class PartAddComponent implements OnInit {
  private picture: File = null;
  private partIpfs: PartIpfs;
  private cars: Car[];

  constructor(private contractService: ContractService,
              private router: Router) {
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();

    const seller = await this.contractService.getSeller(this.contractService.account);

    this.cars = await this.contractService.getCars(seller.cars);
  }

  async onSubmit(f: NgForm) {
    const pictureIpfs = await IpfsUtils.addFile(this.picture) as string;

    const model = f.value;

    this.partIpfs = new PartIpfs();
    this.partIpfs.description = model.description;
    this.partIpfs.images = [];
    this.partIpfs.images.push(pictureIpfs);

    const metaIpfsHash = await IpfsUtils.addJsonAsFile(this.partIpfs) as string;
    await this.contractService.addPart(model.partType,
      model.car,
      model.price,
      model.daysForDelivery,
      metaIpfsHash);
    this.router.navigate(['']);
  }

  fileChange(files: FileList): void {
    this.picture = files.item(0);
  }
}
