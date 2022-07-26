// get contract
var MyToken = artifacts.require("MyToken.sol");

// Import chai, chai-bn. chai-as-promised
var chai = require("chai");
var BN = web3.utils.BN;

const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

// console.log(expect);

contract("MyToken test", async(accounts) => {
    // Test toan bo Token khoi tao ban dau se nam trong tai khoan cua nguoi deployer

    const [ deployerAccount, anotherAccount ] = accounts;

    console.log('accounts', accounts);
    console.log('deployerAccount', deployerAccount);
    console.log('anotherAccount', anotherAccount);

    it("All tokens should be in first account", async () => {

        let instance = await MyToken.deployed();
    
        let totalSupply = await instance.totalSupply();
    
        await expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply);
    });


    it("is possible to send tokens between accounts ", async () => {
        const sendToken = 1;
        let instance = await MyToken.deployed();
        let totalSupply = await instance.totalSupply();

        // check balance of deployer accounts is equal to totalSupply
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);

        // check transfer is to receive the token
        await expect(instance.transfer(anotherAccount, sendToken)).to.eventually.be.fulfilled;

        // check balance of deployer when transfer money to another account
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));

        // deployerAccount --- transfer --> anotherAccount
        //                      (Token)

        // (sub token)                      (add token)

        // check token receive when deployerAccount transfer to anotherAccount
        await expect(instance.balanceOf(anotherAccount).to.eventually.be.a.bignumber.equal(new BN(sendToken)));
    })

})