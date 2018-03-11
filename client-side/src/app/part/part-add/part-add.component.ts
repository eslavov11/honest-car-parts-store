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

    //TODO: seller cars
    this.cars = await this.contractService.getCars([2,3]);
  }

  async onSubmit(f: NgForm) {
    // const pictureIpfs = await IpfsUtils.addFile(this.picture) as string;

    const model = f.value;

    // this.carIpfs = new CarIpfs();
    // this.carIpfs.make = model.make;
    // this.carIpfs.model = model.model;
    // this.carIpfs.description = model.description;
    // this.carIpfs.dateOfRegistration = model.dateOfRegistration;
    // this.carIpfs.images = [];
    // this.carIpfs.images.push(pictureIpfs);
    //
    // const metaIpfsHash = await IpfsUtils.addJsonAsFile(this.carIpfs) as string;
    // await this.contractService.registerCar(model.vin, metaIpfsHash);
    // this.router.navigate(['']);//TODO: car/id
  }

  fileChange(files: FileList): void {
    this.picture = files.item(0);
  }
}
