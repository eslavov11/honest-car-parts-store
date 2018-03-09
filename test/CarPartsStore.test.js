const CarPartsStore = artifacts.require("./CarPartsStore.sol");
require('truffle-test-utils').init();

contract('CarPartsStore',function(accounts){
    let storeInstance;
	let owner = accounts[0];
    let sellerAddr = accounts[1];
    let customerAddr = accounts[2];
    
    let seller = {name: "Seller p", shippingAddress: "Boyana"};
    let customer = {name: "Customer p", shippingAddress: "Lulin"};
    let car = {
		vin: "WBD208ASLKF", 
		make: "Mercedes",
		model: "CLK",
		description:"got it since brand new",
		dateOfRegistration: 952588873,
		metaIpfsHash: "H1l;2jkrh"
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
        
        
    });
})
