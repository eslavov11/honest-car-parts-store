import {Component} from '@angular/core';

import IpfsUtils from './util/ipfs-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent {
  title = 'app';
  picture: File = null;

  constructor() {
    IpfsUtils.IPFS_SERVER;
  }

  fileChange(files: FileList): void {
    this.picture = files.item(0);
  }

  uploadPicture(): void {
    // IpfsUtils.addFile(this.picture.
    IpfsUtils.captureFile(this.picture);
  }
}
