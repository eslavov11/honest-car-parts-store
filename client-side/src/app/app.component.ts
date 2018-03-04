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

  fileChange(files: FileList): void {
    this.picture = files.item(0);
  }

  uploadPicture(): void {
    IpfsUtils.addFile(this.picture).then(ipfsId => {
      window.location.href = IpfsUtils.IPFS_SERVER + ipfsId;
    });
  }
}
