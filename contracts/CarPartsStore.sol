pragma solidity ^0.4.18;
 
import "./base/Owned.sol";
import "./base/SafeMath.sol";

pragma solidity ^0.4.18;


contract Owned {
  address public owner;

  function Owned() public {
    owner = msg.sender;
  }

  modifier isOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
        @notice Changes the address of the store owner
        @param  new_owner Address of the new owner
  */
  function transferOwnership(address new_owner) isOwner public {
    if (new_owner != address(0) &&
        new_owner != owner) {
      owner = new_owner;
    }
  }

}

/**
    @notice Safe mathematical operations contract
*/
contract SafeMath {
  /**
        @notice Safely subtract two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return z Result
  */
  function safeSub(uint256 x, uint256 y) pure internal returns (uint256) {
    assert(y <= x);
    return x - y;
  }
  
  /**
        @notice Safely add two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return uint256 Result
  */
  
  function safeAdd(uint256 x, uint256 y) pure internal returns (uint256) {
    uint256 z = x + y;
    assert(z >= x);
    return z;
  }
  
  /**
        @notice Safely multiply two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return z uint256 Result
  */
  function safeMul(uint256 x, uint256 y) pure  internal returns (uint256) {
    uint256 z = x * y;
    assert(x == 0 || z / x == y);
    return z;
  }
  /**
        @notice Safely divide two numbers without overflows
        @param x uint256 First operand
        @param y uint256 Second operand
        @return z uint256 Result
  */
  function safeDiv(uint256 x, uint256 y) pure  internal returns (uint256) {
    uint256 z = x / y;
    return z;
  }

}
 
//import "./Base/Owned.sol";
//import "./Base/SafeMath.sol";
 
/**
    @notice This contract implements a simple store that can interact with
    registered customers. Every customer has its own shopping cart.
    @title Retail Store Contract
    @author Edward Slavov
*/
contract CarPartStore is Owned, SafeMath {
    // address private oracle; ??
    mapping(address => Seller) private sellers;
    
    mapping(address => Customer) private customers;
    
    mapping(uint256 => Car) private cars; 
    mapping(bytes32 => uint256) carsByVin;
    
    mapping(uint256 => Part) private parts; 
    
    mapping(uint256 => Order) private orders; 
    
    uint256 private customerPercentFee;
    uint256 private carsCount;
    uint256 private partsCount;
    uint256 private ordersCount;
    
    /* Store Events */
    // part delivery expired event 
    // events
    // events
   
    struct Seller {
        address addr;
        string name;
        string shippingAddress;
        uint256 registrationDate;
        uint256[] cars;
        // reputation?
    }
    
    struct Customer {
        address addr;
        string name;
        string shippingAddress;
        uint256 registrationDate;
        uint256[] purchasedParts;
    }
   
    struct Car {
        uint256 id;
        bytes32 vin;
        bytes32 make;
        bytes32 model;
        uint256 dateOfRegistration;
        bytes picturesIpfsDir;
        uint256[] soldParts;
        address seller;
    }
   
    struct Part {
        uint256 id;
        bytes32 partType;
        uint256 carId;
        string description;
        uint256 price;
        uint8 daysForDelivery;
        bool sold;
        bytes picturesIpfsDir;
    }
    
    struct Order {
        uint256 id;
        uint256 partId;
        uint256 date;
        address customer;
        OrderStatus status;
    }
    
    enum OrderStatus {
        Ordered,
        Completed,
        Rejected,
        Refunded
    }
   
    /* Modifiers */
    modifier isSeller() {
        require(msg.sender == sellers[msg.sender].addr);
        _;
    }
    
    modifier isCustomer() {
        require(msg.sender == sellers[msg.sender].addr);
        _;
    }
    
    modifier customerCanBuyPart(uint256 partId) {
        //TODO: part exits
        require(!parts[partId].sold);
        require(msg.value >= parts[partId].price);
        _;
    }
    
    modifier carBelongsToSeller(uint256 carId) {
        require(msg.sender == cars[carId].seller);
        _;
    }
    
    modifier carIsNotInTheRegister(bytes32 vin) {
        require(carsByVin[vin] == 0);
        _;
    }
   
    function CarPartStore() public {
        owner = msg.sender;
        customerPercentFee = 5;
        carsCount = 1;
        partsCount = 1;
        ordersCount = 1;
    }
   
    /** 
     * @notice Payable fallback
    */
    function() public payable { }
   
    //owner get money from fees method
   
    // register seller
    function registerSeller(
        address addr,
        string name,
        string shippingAddress
    ) 
    public 
    {
        sellers[addr].addr = addr;
        sellers[addr].name = name;
        sellers[addr].shippingAddress = shippingAddress;
        sellers[addr].registrationDate = now;
    }
 
    // register customer
    function registerCustomer(
        address addr,
        string name,
        string shippingAddress
    ) 
    public
    {
        customers[addr].addr = addr;
        customers[addr].name = name;
        customers[addr].shippingAddress = shippingAddress;
        sellers[addr].registrationDate = now;
    }
   
    // add Car // PROBABLY NOT EDIT CAR, JUST DELETE?
    // and hash from ipfs json with everything, if params are valid -> add hash to blockchain
    function registerCar(
        bytes32 vin,
        bytes32 make,
        bytes32 model,
        uint256 dateOfRegistration,
        bytes picturesIpfsDir
    )
        public 
        isSeller
        carIsNotInTheRegister(vin)
        returns(uint256) 
    {
        cars[carsCount].vin = vin;
        cars[carsCount].make = make;
        cars[carsCount].model = model;
        cars[carsCount].dateOfRegistration = dateOfRegistration;
        cars[carsCount].picturesIpfsDir = picturesIpfsDir;
        
        carsByVin[vin] = carsCount;
        sellers[msg.sender].cars.push(carsCount);
        
        return carsCount++;
    }
   
    // del car
   
    // get car
   
    // func add part
    function addPart(
        bytes32 partType,
        uint256 carId,
        string description,
        uint256 price,
        uint8 daysForDelivery,
        bytes picturesIpfsDir
    ) 
        public
        isSeller
        carBelongsToSeller(carId)
        returns(uint256) 
    {
        parts[partsCount].partType = partType;
        parts[partsCount].carId = carId;
        parts[partsCount].description = description;
        parts[partsCount].price = price;
        parts[partsCount].picturesIpfsDir = picturesIpfsDir;
        parts[partsCount].daysForDelivery = daysForDelivery;
        parts[partsCount].sold = false;
        
        //cars
        
        return partsCount++;
    }
    
    // del part
   
    function getPartForSale(uint256 partId) 
        public 
        view 
        //TODO: require part exists
        //TODO: require not sold?
        returns(
            bytes32 partType,
            uint256 carId,
            string description,
            uint256 price,
            uint8 daysForDelivery,
            bytes picturesIpfsDir
        ) 
    {
        Part memory part = parts[partId]; 
        return (
            part.partType,
            part.carId,
            part.description,
            part.price,
            part.daysForDelivery,
            part.picturesIpfsDir
        );
    }
    
    function buyPart(uint256 partId) 
        public 
        payable 
        isCustomer 
        customerCanBuyPart(partId) 
        returns(uint256) 
    {
        orders[ordersCount] = Order(ordersCount, partId, now, msg.sender, OrderStatus.Ordered);
        parts[partId].sold = true;
        //customers[msg.sender].purchasedParts.push(partId);
        
        return ordersCount++;
    }
    
    function payToSeller(uint256 orderId) 
        public 
        //is Customer?  
        //orderIsCompleted(orderId)
    {
        uint orderAmount = parts[orders[orderId].partId].price;
        orderAmount = _getAmountAfterCommision(orderAmount);
    
        msg.sender.transfer(orderAmount);
    }
    
    function withdrawRefund(uint256 orderId) public isCustomer {
        uint refund = 0;
        //refund = orders[orderId];
        //todo: require sender is customer and n days have passed 
    
        msg.sender.transfer(refund);
    }
   
    // TODO: return part
   
    // get balance seller modifier()
   
    // get balance customer modifier()
   
    //todo ban seller and confiscate his balance if parts/car is stolen
   
    // fileComplaint for seller
    
    //rate seller after receiving item
    
    function _getAmountAfterCommision(uint256 orderAmount) private view returns(uint256) {
        return safeSub(orderAmount, 
                       safeMul(orderAmount, 
                                safeDiv(customerPercentFee, 100)));
    }
}
