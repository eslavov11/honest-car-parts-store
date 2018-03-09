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
    // address private oracle; ??
    mapping(address => Seller) private sellers;
    
    mapping(address => Customer) private customers;
    
    mapping(uint256 => Car) private cars; 
    mapping(bytes32 => uint256) carsByVin;
    
    mapping(uint256 => Part) private parts; 
    
    mapping(uint256 => Order) private orders; 
    
    uint256 private customerPercentFee;
    uint8 private daysForRespond;
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
        //TODO: remove?uint256[] cars;
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
        string description;
        uint256 dateOfRegistration;
        bytes metaIpfsHash;
        //uint256[] soldParts;
        address seller;
    }
   
    struct Part {
        uint256 id;
        bytes32 partType;
        uint256 car;
        string description;
        uint256 price;
        uint8 daysForDelivery;
        bool sold;
        bytes metaIpfsHash;
    }
    
    struct Order {
        uint256 id;
        uint256 partId;
        uint256 deliveryDate;
        address customer;
        address seller;
        OrderStatus status;
    }
    
    enum OrderStatus {
        Active,
        Complete,
        Reject,
        Return
    }
   
    /* Modifiers */
    modifier isSeller() {
        require(msg.sender == sellers[msg.sender].addr);
        _;
    }
    
    modifier isCustomer() {
        require(msg.sender == customers[msg.sender].addr);
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
    
    modifier hasOrderedPart(uint256 orderId) {
        require(msg.sender == customers[msg.sender].addr &&
                msg.sender == orders[orderId].customer);
        _;
    }
    
    modifier hasSoldPart(uint256 orderId) {
        require(msg.sender == sellers[msg.sender].addr &&
                msg.sender == orders[orderId].seller);
        _;
    }
    
    modifier orderDeliveryDateExpired(uint256 orderId) {
        require(now <= orders[orderId].deliveryDate + 
                        parts[orders[orderId].partId].daysForDelivery * 1 seconds); //1 days
        _;
    }
    
    modifier orderDeliveryDateWithResponseExpired(uint256 orderId) {
        require(now <= orders[orderId].deliveryDate + 
                     (parts[orders[orderId].partId].daysForDelivery + daysForRespond) * 1 seconds); //1 days
        _;
    }
    
    modifier orderIsActive(uint256 orderId) {
        require(orders[orderId].status == OrderStatus.Active);
        _;
    }
    
    modifier userCanViewOrder(uint256 orderId) {
        require(msg.sender == orders[orderId].customer || 
                msg.sender == orders[orderId].seller ||
                msg.sender == owner);
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
        string name,
        string shippingAddress
    ) 
    public 
    {
        sellers[msg.sender].addr = msg.sender;
        sellers[msg.sender].name = name;
        sellers[msg.sender].shippingAddress = shippingAddress;
        sellers[msg.sender].registrationDate = now;
    }
    
    function getSeller(address addr) public view 
        returns(string name, uint256 registrationDate, string shippingAddress) 
    {
        Seller memory seller = sellers[addr];
        
        return (
            seller.name,
            seller.registrationDate,
            seller.shippingAddress
        );
    }
 
    // register customer
    function registerCustomer(
        string name,
        string shippingAddress
    ) 
    public
    {
        customers[msg.sender].addr = msg.sender;
        customers[msg.sender].name = name;
        customers[msg.sender].shippingAddress = shippingAddress;
        customers[msg.sender].registrationDate = now;
    }
    
    function getCustomer(address addr) public view 
        returns(string name, uint256 registrationDate, string shippingAddress) 
    {
        Customer memory customer = customers[addr];
        
        return (
            customer.name,
            customer.registrationDate,
            customer.shippingAddress
        );
    }
   
    // add Car // PROBABLY NOT EDIT CAR, JUST DELETE?
    // and hash from ipfs json with everything, if params are valid -> add hash to blockchain
    function registerCar(
        bytes32 vin,
        bytes32 make,
        bytes32 model,
        string description,
        uint256 dateOfRegistration,
        bytes metaIpfsHash
    )
        public 
        isSeller
        carIsNotInTheRegister(vin)
        returns(uint256) 
    {
        cars[carsCount].vin = vin;
        cars[carsCount].make = make;
        cars[carsCount].model = model;
        cars[carsCount].description = description;
        cars[carsCount].dateOfRegistration = dateOfRegistration;
        cars[carsCount].metaIpfsHash = metaIpfsHash;
        cars[carsCount].seller = msg.sender;
        
        carsByVin[vin] = carsCount;
        
        return carsCount++;
    }
   
    // del car
   
    // get car
    function getCar(uint256 carId) 
        public 
        view 
        returns(
            bytes32 vin,
            bytes32 make,
            bytes32 model,
            string description,
            uint256 dateOfRegistration,
            bytes metaIpfsHash,
            address seller
        ) 
    {
        //require this vin isn't in the register .tolower
        //report a car/part, ex. in 3 reports, get banned
        
        Car memory car = cars[carId]; 
        return (
            car.vin,
            car.make,
            car.model,
            car.description,
            car.dateOfRegistration,
            car.metaIpfsHash,
            car.seller
        );
    }
   
    function addPart(
        bytes32 partType,
        uint256 carId,
        string description,
        uint256 price,
        uint8 daysForDelivery,
        bytes metaIpfsHash
    ) 
        public
        isSeller
        carBelongsToSeller(carId)
        returns(uint256) 
    {
        //check car should not have this spart already .tolower()
        
        parts[partsCount].partType = partType;
        parts[partsCount].car = carId;
        parts[partsCount].description = description;
        parts[partsCount].price = price;
        parts[partsCount].metaIpfsHash = metaIpfsHash;
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
            bytes metaIpfsHash
        ) 
    {
        Part memory part = parts[partId]; 
        return (
            part.partType,
            part.car,
            part.description,
            part.price,
            part.daysForDelivery,
            part.metaIpfsHash
        );
    }
    
    //TODO: get sold part, only customer & seller can see
    
    function buyPart(uint256 partId) 
        public 
        payable 
        isCustomer 
        customerCanBuyPart(partId) 
        returns(uint256) 
    {
        address seller = cars[parts[partId].car].seller;
        orders[ordersCount] = Order(ordersCount, partId, now, msg.sender, seller, OrderStatus.Active);
        parts[partId].sold = true;
        
        return ordersCount++;
    }
    
     function getOrder(uint256 orderId) 
        public 
        view 
        userCanViewOrder(orderId)
        returns(
            uint256 partId,
            uint256 date,
            address customer,
            address seller,
            OrderStatus status
        ) 
    {
        Order memory order = orders[orderId]; 
        return (
            order.partId,
            order.deliveryDate,
            order.customer,
            order.seller,
            order.status
        );
    }
    
    // Seller request for payment after part delivery days have passed,
    // plus default days for customer to respond have passed as well.
    function sellerRequestPayment(uint256 orderId) 
        public
        hasSoldPart(orderId)
        orderDeliveryDateWithResponseExpired(orderId)
        orderIsActive(orderId)
    {
        uint orderAmount = parts[orders[orderId].partId].price;
        orderAmount = _getAmountAfterCommision(orderAmount);
    
        msg.sender.transfer(orderAmount);
        orders[orderId].status = OrderStatus.Complete;
    }
    
    function payToSeller(uint256 orderId) 
        public
        hasOrderedPart(orderId)
        orderIsActive(orderId)
    {
        uint orderAmount = parts[orders[orderId].partId].price;
        orderAmount = _getAmountAfterCommision(orderAmount);
    
        msg.sender.transfer(orderAmount);
        orders[orderId].status = OrderStatus.Complete;
    }
   
    // customer is not happy with the part and wants to return the part and get his money back
    function returnPart(uint256 orderId)
        public 
        hasOrderedPart(orderId) 
        orderIsActive(orderId)
        orderDeliveryDateExpired(orderId)
    {
       _withdrawRefund(orderId);
       orders[orderId].status = OrderStatus.Return;
    }
   
    // hasnt received a part, so customer wants his money back
    function rejectPart(uint256 orderId) 
        public 
        hasOrderedPart(orderId)
        orderIsActive(orderId) 
        orderDeliveryDateExpired(orderId)
    {
       _withdrawRefund(orderId);
       orders[orderId].status = OrderStatus.Reject;
    }
    
    function _withdrawRefund(uint256 orderId) private {
        uint refund = parts[orders[orderId].partId].price;
        refund = _getAmountAfterCommision(refund);
    
        orders[orderId].customer.transfer(refund);
    }
   
    //todo ban seller and confiscate his balance if parts/car is stolen
   
    // fileComplaint for seller
    
    //rate seller after receiving item
    
    function _getAmountAfterCommision(uint256 orderAmount) private view returns(uint256) {
        return safeSub(orderAmount, 
                       safeMul(orderAmount, 
                                safeDiv(customerPercentFee, 100)));
    }
}
