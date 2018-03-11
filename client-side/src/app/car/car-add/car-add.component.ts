import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {ContractService} from "../../shared/services/contract.service";
import IpfsUtils from "../../util/ipfs-utils";
import {CarIpfs} from "../../shared/ipfs-models/car-ipfs";

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {
  private picture: File = null;
  private carIpfs: CarIpfs;

  constructor(private contractService: ContractService,
              private router: Router) {
  }

  async ngOnInit() {
    await this.contractService.loadAccounts();
    await this.contractService.getBalance();
  }

  async onSubmit(f: NgForm) {
    const pictureIpfs = await IpfsUtils.addFile(this.picture) as string;

    const model = f.value;

    this.carIpfs = new CarIpfs();
    this.carIpfs.make = model.make;
    this.carIpfs.model = model.model;
    this.carIpfs.description = model.description;
    this.carIpfs.dateOfRegistration = model.dateOfRegistration;
    this.carIpfs.images = [];
    this.carIpfs.images.push(pictureIpfs);

    const metaIpfsHash = await IpfsUtils.addJsonAsFile(this.carIpfs) as string;
    await this.contractService.registerCar(model.vin, metaIpfsHash);
    this.router.navigate(['']);//TODO: car/id
  }

  fileChange(files: FileList): void {
    this.picture = files.item(0);
  }

  // uploadPicture(): void {
  //   IpfsUtils.addFile(this.picture).then(ipfsId => {
  //
  //   });
  // }
}
