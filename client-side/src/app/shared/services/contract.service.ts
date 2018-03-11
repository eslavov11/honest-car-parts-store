import {Injectable} from '@angular/core';
import * as Web3 from 'web3';
import {default as contract} from 'truffle-contract';

import {ContractConfig} from '../config/contract-config';
import {Seller} from "../models/seller";
import {Customer} from "../models/customer";
import {Car} from "../models/car";
import {Part} from "../models/part";
import {Order} from "../models/order";

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
          resolve(this.web3.fromWei(balance, 'ether'));
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
  }

  public async getSeller(account: any) {
    const sellerObj = await new Promise((resolve, reject) => {
      this.contract.getSeller(account, function (error, result) {
        if (!error)
          resolve(result);
        else {
          resolve(false);
          console.log(error);
        }
      });
    });

    if (!sellerObj) {
      return null;
    }

    const seller = new Seller();
    seller.address = account;
    seller.name = sellerObj[0];
    seller.registrationDate = new Date(sellerObj[1].c[0] * 1000);
    seller.shippingAddress = sellerObj[2];
    seller.cars = sellerObj[3];

    return seller;
  }

  public async getCars(carsId: number[]) {
    const cars = [];
    carsId.forEach(async cId => {
      const carObj = await new Promise((resolve, reject) => {
        this.contract.getCar(cId, function (error, result) {
          if (!error)
            resolve(result);
          else {
            resolve(false);
            console.log(error);
          }
        });
      });

      const car = new Car();
      car.id = cId;
      car.vin = this.web3.toUtf8(carObj[0]);
      car.metaIpfsHash = this.web3.toAscii(carObj[1]);
      car.seller = carObj[2];

      cars.push(car);
    });


    return cars;
  }

  public async registerCustomer(name: string, shippingAddress: string) {
    this.contract.registerCustomer(name, shippingAddress, function (error, result) {
      //TODO: notify
      if (!error)
        console.log(result);
      else
        console.error(error);
    });

    await this.getBalance();
  }

  public async getCustomer(account: any) {
    const customerObj = await new Promise((resolve, reject) => {
      this.contract.getCustomer(account, function (error, result) {
        if (!error)
          resolve(result);
        else {
          resolve(false);
          console.log(error);
        }
      });
    });

    if (!customerObj) {
      return null;
    }

    const customer = new Customer();
    customer.address = account;
    customer.name = customerObj[0];
    customer.registrationDate = new Date(customerObj[1].c[0] * 1000);
    customer.shippingAddress = customerObj[2];

    return customer;
  }

  public async registerCar(vin: string, metaIpfsHash: string) {
    return await new Promise((resolve, reject) => {
      this.contract.registerCar(vin, metaIpfsHash, function (error, result) {
        if (!error)
          resolve(result);
        else
          console.error(error);
      });
    });
  }

  public async getCar(id: number) {
    const carObj = await new Promise((resolve, reject) => {
      this.contract.getCar(id, function (error, result) {
        if (!error)
          resolve(result);
        else
          console.error(error);
      });
    });

    const car = new Car();
    car.vin = this.web3.toUtf8(carObj[0]);
    car.metaIpfsHash = this.web3.toAscii(carObj[1]);
    car.seller = carObj[2];

    return car;
  }

  public async addPart(partType: string,
                       carId: number,
                       price: string,
                       daysForDelivery: number,
                       metaIpfsHash: string) {
    return await new Promise((resolve, reject) => {
      this.contract.addPart(partType, carId, this.web3.toWei(price, 'ether'),
        daysForDelivery, metaIpfsHash, function (error, result) {
          if (!error)
            resolve(result);
          else
            console.error(error);
        });
    });
  }

  public async getPart(id: number) {
    const partObj = await new Promise((resolve, reject) => {
      this.contract.getPartForSale(id, function (error, result) {
        if (!error)
          resolve(result);
        else
          console.error(error);
      });
    });

    const part = new Part();
    part.partType = this.web3.toUtf8(partObj[0]);
    part.car = partObj[1].toString(10);
    part.price = this.web3.fromWei(partObj[2], 'ether').toString(10);
    part.daysForDelivery = partObj[3].toString(10);
    part.metaIpfsHash = this.web3.toAscii(partObj[4]);

    return part;
  }

  public async buyPart(partId: number, price: number) {
    return await new Promise((resolve, reject) => {
      this.contract.buyPart(partId, {value: this.web3.toWei(price, 'ether')},
        function (error, result) {
          if (!error)
            resolve(result);
          else
            console.error(error);
        });
    });
  }

  public async getOrder(id: number) {
    const orderObj = await new Promise((resolve, reject) => {
      this.contract.getOrder(id, function (error, result) {
        if (!error)
          resolve(result);
        else
          console.error(error);
      });
    });

    const order = new Order();
    order.part = orderObj[0].toString(10);
    order.deliveryDate = orderObj[1].toString(10) * 1000;
    order.customer = orderObj[3];
    order.seller = orderObj[3];
    order.status = orderObj[4];

    return order;
  }
}
