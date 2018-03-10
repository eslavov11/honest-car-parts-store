const CarPartsStore = artifacts.require("./CarPartsStore.sol");
// require('truffle-test-utils').init();

contract('CarPartsStore',function(accounts){
    let storeInstance;
	let owner = accounts[0];
    let sellerAddr = accounts[1];
    let customerAddr = accounts[2];

    let seller = {name: "Seller p", shippingAddress: "Boyana"};
    let customer = {name: "Customer p", shippingAddress: "Lulin"};
    let car = {
		vin: "WBD208ASLKF",
		metaIpfsHash: "H1l;2jkrh"
	};

    let part = {
        partType: 'mirrors',
        car: 1,
        price: '500000000000000000',
        daysForDelivery: 30,
        metaIpfsHash:"H1l;2jkrh"
    };

    describe("creating car parts store",() => {
        beforeEach(async function() {
            storeInstance = await CarPartsStore.new({
                from:owner
            });
        });

        //testing if owner is set correctly
        it("should be correct owner", async function() {
            let _owner = await storeInstance.owner.call();

            assert.strictEqual(_owner, owner, "expected owner");
        });

        //testing seller registration and get
        it("should register seller", async function() {
            await storeInstance.registerSeller(seller.name, seller.shippingAddress, {from: sellerAddr});
            let sellerCreated = await storeInstance.getSeller.call(sellerAddr, {from: sellerAddr});

            assert.strictEqual(seller.name, sellerCreated[0].valueOf(), "seller name not set");
            assert.strictEqual(seller.shippingAddress, sellerCreated[2].valueOf(), "seller shipping address not set");
        });

        //testing customer registration and get
        it("should register customer", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        //testing car registration and get
        it("should register customer", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        //testing add part and get
        it("should register customer", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        //testing buy part and get order
        it("should register customer", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        //testing return part
        it("should return part", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        //testing return part
        it("should not return part due to days for delivery not passed", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        it("should reject part", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        it("should not reject part due to days for delivery not passed", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        it("seller request payment should pay", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        it("seller request payment should not pay due to days plus sellers response days not passed", async function() {
            await storeInstance.registerCustomer(customer.name, customer.shippingAddress, {from: customerAddr});
            let customerCreated = await storeInstance.getCustomer.call(customerAddr, {from: customerAddr});

            assert.strictEqual(customer.name, customerCreated[0].valueOf(), "customer name not set");
            assert.strictEqual(customer.shippingAddress, customerCreated[2].valueOf(), "customer shipping address not set");
        });

        // it("should not allow borrowing book if value send is less than 100", async function() {
        //     await lms.addBook('a', 'b', 'c', 'e', 'f', 'g');
        //     await lms.addMember('Michael Scofield', accounts[2], "Ms@gmail.com");
        //     await lms.borrowBook(1, {from: accounts[2], value: 10**12})
        //     await expectThrow(lms.borrowBook(1, {from: accounts[2], value: 10000})); // should throw exception
        // });
    });
})
