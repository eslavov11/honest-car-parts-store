pragma solidity ^0.4.18;
 
import "./base/Owned.sol";
import "./base/SafeMath.sol";

/**
    @notice This contract implements a simple store that can interact with
    registered customers. Every customer has its own shopping cart.
    @title Retail Store Contract
    @author Edward Slavov
*/
contract CarPartStore is Owned, SafeMath {
    // right data types bytes32 > string etc...
    
    // address private oracle; ??
    mapping(address => Seller) private sellers;
    mapping(address => Customer) private customers;
    // mapping cars -> by id -> vin, or ipfs directory
    // mapping parts -> by id, or ipfs directory
   
    /* Store Events */
    // events
    // events
    // events
   
    struct Seller {
        Car[] cars;    // mapping??
        // reputation?
        // sold parts
    }
   
    struct Car {
        // id??
        bytes32 vin;
        bytes32 make;
        bytes32 model;
        //date dateOfRegistration;
        string[] pictures;
       
    }
   
    /**
        @notice Represents a product:
        @id: Product id
        @type: part type
        Decription: @description
        Amount of items in a single product: @default_amount
    */
    struct Part {
        // id??
        string[] pictures;
        bytes32 _type;
        string description;
        uint256 price;
    }
   
    /**
        @notice every customer has an address, name,
        balance and a shopping cart
    */
    struct Customer {
        address addr;
        bytes32 name;
        uint256 balance;
        // Cart cart; - for simplicity maybe only 1 per order?
    }
   
    /* Modifiers */
   
    function CarPartStore() public {
        owner = msg.sender;
        // set name?
    }
   
    /** 
     * Needed?
        @notice Payable fallback
    */
    function() public payable { }
   
    // register seller
    function registerSeller() public {
        // sellers.add();
    }
 
    // register customer
    function registerCustomer() public {
        // sellers.add();
    }
   
    // cart functions??
 
    // add Car // PROBABLY NOT EDIT CAR, JUST DELETE?
    function registerCar() public returns(bytes) {
        // sellers.add();
    }
   
    // del car
   
    // get car
   
    // func add part
    function addPart() public returns(bytes) {
        // sellers.add();
    }
    
    // del part
   
    // get part
    
    function buyPart(bytes partHash) public payable returns(bytes) {
        
    }
    
    function withdrawRefund() public {
        uint refund = 0;
        //todo: require sender is customer and n days have passed 
    
        msg.sender.transfer(refund);
    }
   
    // TODO: return part
   
    // get balance seller modifier()
   
    // get balance customer modifier()
   
    //todo ban seller and confiscate his balance if parts/car is stolen
   
    // fileComplaint for seller
    
    //rate seller after receiving item
}
