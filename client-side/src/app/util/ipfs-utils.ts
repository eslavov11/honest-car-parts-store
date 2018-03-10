import {Buffer} from 'buffer/';
import * as ipfsApi from 'ipfs-api';

export default class IpfsUtils {

  public static get IPFS_SERVER(): string {
    return 'https://ipfs.io/ipfs/';
  }

  // private static ipfs: any = ipfsApi('/ip4/127.0.0.1/tcp/5001');
  private static ipfs: any = ipfsApi('ipfs.infura.io', '5001', {protocol: 'https'});


  public static addJsonAsFile(json) {
    const file = new File([JSON.stringify(json)], 'file.json');

    return new Promise(resolve => {
      IpfsUtils.addFile(file).then(ipfsId => {
        resolve(ipfsId);
      });
    });
  }

  public static addFile(file) {
    return new Promise(resolve => {
      let reader = new (<any>window).FileReader();
      reader.onloadend = () => {
        IpfsUtils.saveToIpfs(reader).then(ipfsId => {
          resolve(ipfsId);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  public static saveToIpfs(reader) {
    const buffer = Buffer.from(reader.result);
    return new Promise(resolve => {
      IpfsUtils.ipfs.add(buffer, {progress: (prog) => console.log(`received: ${prog}`)})
        .then((response) => {
          resolve(response[0].hash);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
}
