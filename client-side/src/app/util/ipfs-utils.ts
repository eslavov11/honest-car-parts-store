import * as ipfsApi from 'ipfs-api';
import {Buffer} from 'buffer/';

// let Buffer = require('buffer/').Buffer;
export default class IpfsUtils {

  private static ipfs: any = ipfsApi('/ip4/127.0.0.1/tcp/5001');

  public static get IPFS_SERVER(): string {
    console.log(IpfsUtils.ipfs);
    return 'https://ipfs.io/ipfs/';
  }

  public static addFile(path: string, content: string) {
    return IpfsUtils.addFiles([{path, content}]);
  }

  public static addFiles(files: any[]) {
    IpfsUtils.ipfs.files.add(files, function (err, data) {
      console.log(data);
      return data;
    });
  }

  public static captureFile(file) {
    let reader = new (<any>window).FileReader();
    reader.onloadend = () => IpfsUtils.saveToIpfs(reader);
    reader.readAsArrayBuffer(file);
  }

  public static saveToIpfs(reader) {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    IpfsUtils.ipfs.add(buffer, {progress: (prog) => console.log(`received: ${prog}`)})
      .then((response) => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
