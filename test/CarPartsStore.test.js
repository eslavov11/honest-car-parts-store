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
    });
})
