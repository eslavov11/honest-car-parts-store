pragma solidity ^0.4.18;

import "./base/Owned.sol";
import "./base/SafeMath.sol";

/**
    @notice This contract implements a simple store that can interact with
    registered customers. Every customer has its own shopping cart.
    @title Retail Store Contract
    @author Edward Slavov
*/
contract CarPartsStore is Owned, SafeMath {
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
        string name;
        string shippingAddress;
        uint256 registrationDate;
        uint256[] cars;
        uint256[] orders;
        // reputation?
    }

    struct Customer {
        string name;
        string shippingAddress;
        uint256 registrationDate;
        uint256[] orders;
    }

    struct Car {
        bytes32 vin;
        bytes metaIpfsHash;
        address seller;
        uint256[] parts;
    }

    struct Part {
        bytes32 partType;
        uint256 car;
        uint256 price;
        uint8 daysForDelivery;
        bool sold;
        bytes metaIpfsHash;
    }

    struct Order {
        uint256 part;
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
        require(!_stringEmpty(sellers[msg.sender].name));
        _;
    }

    modifier isCustomer() {
        require(!_stringEmpty(customers[msg.sender].name));
        _;
    }

    modifier sellerExists(address addr) {
        require(!_stringEmpty(sellers[addr].name));
        _;
    }

    modifier customerExists(address addr) {
        require(!_stringEmpty(customers[addr].name));
        _;
    }

    modifier carExists(uint256 car) {
        require(cars[car].vin != 0);
        _;
    }

    modifier partExists(uint256 part) {
        require(parts[part].partType != 0);
        _;
    }

    modifier customerCanBuyPart(uint256 part) {
        //partExists
        require(parts[part].partType != 0);
        require(!parts[part].sold);
        require(msg.value >= parts[part].price);
        _;
    }

    modifier carBelongsToSeller(uint256 car) {
        require(msg.sender == cars[car].seller);
        _;
    }

    modifier carIsNotInTheRegister(bytes32 vin) {
        require(carsByVin[vin] == 0);
        _;
    }

    modifier hasOrderedPart(uint256 order) {
        require(!_stringEmpty(customers[msg.sender].name) &&
                msg.sender == orders[order].customer);
        _;
    }

    modifier hasSoldPart(uint256 order) {
        require(!_stringEmpty(sellers[msg.sender].name) &&
                msg.sender == orders[order].seller);
        _;
    }

    modifier orderDeliveryDateExpired(uint256 order) {
        require(now <= orders[order].deliveryDate +
                        parts[orders[order].part].daysForDelivery * 1 seconds); //TODO: 1 days
        _;
    }

    modifier orderDeliveryDateWithResponseExpired(uint256 order) {
        require(now <= orders[order].deliveryDate +
                     (parts[orders[order].part].daysForDelivery + daysForRespond) * 1 seconds); //1 days
        _;
    }

    modifier orderIsActive(uint256 order) {
        require(orders[order].status == OrderStatus.Active);
        _;
    }

    modifier userCanViewOrder(uint256 order) {
        require(msg.sender == orders[order].customer ||
                msg.sender == orders[order].seller ||
                msg.sender == owner);
        _;
    }

    function CarPartStore() public {
        owner = msg.sender;
        customerPercentFee = 5;
        carsCount = 0;
        partsCount = 0;
        ordersCount = 0;
        daysForRespond = 3;
    }

    /**
     * @notice Payable fallback
    */
    function() public payable { }

    //todo: owner get money from fees method

    // register seller
    function registerSeller(
        string name,
        string shippingAddress
    )
    public
    {
        sellers[msg.sender].name = name;
        sellers[msg.sender].shippingAddress = shippingAddress;
        sellers[msg.sender].registrationDate = now;
    }

    function getSeller(address addr) public sellerExists(addr) view
        returns(
            string name, 
            uint256 registrationDate, 
            string shippingAddress, 
            uint256[] sellerCars, 
            uint256[] sellerOrders
        )
    {
        Seller memory seller = sellers[addr];

        return (
            seller.name,
            seller.registrationDate,
            seller.shippingAddress,
            seller.cars,
            seller.orders
        );
    }

    // register customer
    function registerCustomer(
        string name,
        string shippingAddress
    )
    public
    {
        customers[msg.sender].name = name;
        customers[msg.sender].shippingAddress = shippingAddress;
        customers[msg.sender].registrationDate = now;
    }

    function getCustomer(address addr) public customerExists(addr) view
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
    function registerCar(bytes32 vin, bytes metaIpfsHash)
        public 
        isSeller
        carIsNotInTheRegister(vin)
        returns(uint256) 
    {
        carsCount++;
        //todo: require this vin isn't in the register .tolower
        //TODO: event car exists?
        
        cars[carsCount].vin = vin;
        cars[carsCount].metaIpfsHash = metaIpfsHash;
        cars[carsCount].seller = msg.sender;
        sellers[msg.sender].cars.push(carsCount);
        
        carsByVin[vin] = carsCount;
        
        return carsCount;
    }
   
    // del car
   
    function getCar(uint256 car) 
        public 
        view 
        carExists(car)
        returns(
            bytes32 vin,
            bytes metaIpfsHash,
            address seller
        ) 
    {
        //report a car/part, ex. in 3 reports, get banned
        Car memory carStr = cars[car]; 
        return (
            carStr.vin,
            carStr.metaIpfsHash,
            carStr.seller
        );
    }
   
    function addPart(
        bytes32 partType,
        uint256 carId,
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
        
        partsCount++;
        parts[partsCount].partType = partType;
        parts[partsCount].car = carId;
        parts[partsCount].price = price;
        parts[partsCount].metaIpfsHash = metaIpfsHash;
        parts[partsCount].daysForDelivery = daysForDelivery;
        parts[partsCount].sold = false;
        
        //cars
        
        return partsCount;
    }
    
    // del part
   
    function getPartForSale(uint256 part) 
        public 
        view 
        partExists(part)
        //TODO: require part exists
        //TODO: require not sold?
        returns(
            bytes32 partType,
            uint256 car,
            uint256 price,
            uint8 daysForDelivery,
            bytes metaIpfsHash
        ) 
    {
        Part memory partStr = parts[part]; 
        return (
            partStr.partType,
            partStr.car,
            partStr.price,
            partStr.daysForDelivery,
            partStr.metaIpfsHash
        );
    }
    
    //TODO: get sold part, only customer & seller can see
    
    function buyPart(uint256 part) 
        public 
        payable 
        isCustomer 
        customerCanBuyPart(part) 
        returns(uint256) 
    {
        ordersCount++;
        address seller = cars[parts[part].car].seller;
        uint256 deliveryDate = now + parts[part].daysForDelivery * 1 seconds; // TODO: 1 days
        orders[ordersCount] = Order(part, deliveryDate, msg.sender, seller, OrderStatus.Active);
        parts[part].sold = true;
        
        return ordersCount;
    }
    
     function getOrder(uint256 orderId) 
        public 
        view 
        userCanViewOrder(orderId)
        returns(
            uint256 part,
            uint256 date,
            address customer,
            address seller,
            OrderStatus status
        ) 
    {
        Order memory order = orders[orderId]; 
        return (
            order.part,
            order.deliveryDate,
            order.customer,
            order.seller,
            order.status
        );
    }
    
    // Seller request for payment after part delivery days have passed,
    // plus default days for customer to respond have passed as well.
    function sellerRequestPayment(uint256 order) 
        public
        hasSoldPart(order)
        orderDeliveryDateWithResponseExpired(order)
        orderIsActive(order)
    {
        uint orderAmount = parts[orders[order].part].price;
        orderAmount = _getAmountAfterCommision(orderAmount);
    
        msg.sender.transfer(orderAmount);
        orders[order].status = OrderStatus.Complete;
    }
    
    function payToSeller(uint256 order) 
        public
        hasOrderedPart(order)
        orderIsActive(order)
    {
        uint orderAmount = parts[orders[order].part].price;
        orderAmount = _getAmountAfterCommision(orderAmount);
    
        orders[order].seller.transfer(orderAmount);
        orders[order].status = OrderStatus.Complete;
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
    function rejectPart(uint256 order) 
        public 
        hasOrderedPart(order)
        orderIsActive(order) 
        orderDeliveryDateExpired(order)
    {
       _withdrawRefund(order);
       orders[order].status = OrderStatus.Reject;
    }
    
    function _withdrawRefund(uint256 order) private {
        uint refund = parts[orders[order].part].price;
        refund = _getAmountAfterCommision(refund);
    
        orders[order].customer.transfer(refund);
    }
   
    //todo ban seller and confiscate his balance if parts/car is stolen
   
    // fileComplaint for seller
    
    //rate seller after receiving item
    
    function _getAmountAfterCommision(uint256 orderAmount) private view returns(uint256) {
        return safeSub(orderAmount, 
                       safeMul(orderAmount, 
                                safeDiv(customerPercentFee, 100)));
    }
    
    function _stringEmpty(string s) private pure returns(bool) {
        return keccak256("") == keccak256(s);
    }
}
