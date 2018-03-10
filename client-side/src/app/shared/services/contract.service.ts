import {Injectable} from '@angular/core';
import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract';

import {ContractConfig} from '../config/contract-config';
import {Seller} from "../models/seller";

@Injectable()
export class ContractService {
  public accounts: any[] = [];
  public account: any;
  public accountBalance: number;
  private web3: any;
  private contract;
  private LOCAL_PROVIDER_URL = 'http://localhost:8545';

  constructor() {
    this.initWeb3();
  }

  public async loadAccounts() {
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert('Couldnt get any accounts! Make sure your Ethereum client is configured correctly.');
            return;
          }

          resolve(accs[0]);
          this.accounts = accs;
        });
      });
    }

    return Promise.resolve(this.account);
  }

  public async setDefaultAccount() {
    if (this.web3.eth.defaultAccount == null) {
      this.web3.eth.defaultAccount = await new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert('Couldnt get any accounts! Make sure your Ethereum client is configured correctly.');
            return;
          }

          resolve(accs[0]);
        });
      });
    }

    return Promise.resolve(this.web3.eth.defaultAccount);
  }

  public async getBalance(): Promise<number> {
    if (this.account != null) {
      this.accountBalance = await new Promise((resolve, reject) => {
        this.web3.eth.defaultAccount = this.account;
        this.web3.eth.getBalance(this.account, (err, balance) => {
          if (err != null) {
            alert('There was an error getting your balance.');
            return;
          }
          resolve(this.web3.fromWei(balance, 'ether').c);
        });
      }) as number;
    }

    return Promise.resolve(this.accountBalance);
  }

  public async getBalanceForAccount(account: any): Promise<number> {
    const balanceFromAccount = await new Promise((resolve, reject) => {
      this.web3.eth.defaultAccount = account;
      this.web3.eth.getBalance(account, (err, balance) => {
        if (err != null) {
          alert('There was an error getting your balance.');
          return;
        }
        resolve(this.web3.fromWei(balance, 'ether'));
      });
    }) as number;

    return Promise.resolve(balanceFromAccount);
  }

  public initWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof (window as any).web3 !== 'undefined') {
      this.web3 = (window as any).web3;
    } else {
      (window as any).web3 =
        new Web3(new Web3.providers.HttpProvider(this.LOCAL_PROVIDER_URL));
    }

    const myContract = this.web3.eth.contract(ContractConfig.contract.abi);
    console.log(myContract);
    this.contract = myContract.at(ContractConfig.contract.address);
    // let c = new this.web3.eth.Contract(ContractConfig.contract.abi, '0xFa028Ad8D553803078af63130b059A3de1CE37Bd');
    console.log(contract);
  }

  public async registerSeller(name: string, shippingAddress: string) {
    this.contract.registerSeller(name, shippingAddress, function (error, result) {
      //TODO: notify
      if (!error)
        console.log(result)
      else
        console.error(error);
    });

    await this.getBalance();
  }

  public async getSeller(account: any) {
    const sellerObj = await new Promise((resolve, reject) => {
      this.contract.getSeller(account, function (error, result) {
        if (!error)
          resolve(result);
        else
          console.error(error);
      });
    });

    const seller = new Seller();
    seller.address = account;
    seller.name = sellerObj[0];
    seller.registrationDate = new Date(sellerObj[1].c[0] * 1000);
    seller.shippingAddress = sellerObj[2];

    return seller;
  }
}
