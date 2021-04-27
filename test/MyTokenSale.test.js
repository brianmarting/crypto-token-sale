const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;

chai.use(chaiBN);
chai.use(chaiAsPromised);


contract("My token sale", async accounts => {
    const [initialHolder, recipient, anotherAccount] = accounts;

    let tokenInstance;
    let tokenSaleInstance;
    let kycInstance;

    beforeEach(async () => {
        tokenInstance = await MyToken.deployed();
        tokenSaleInstance = await MyTokenSale.deployed();
        kycInstance = await KycContract.deployed();
    });

    it('should not have any coins in my acc on deployment', async () => {
        const balance = await tokenInstance.balanceOf(initialHolder);

        expect(balance).to.be.a.bignumber.equal(new BN(0));
    });

    it('should all coins should be in sale contract - address', async () => {
        const balance = await tokenInstance.balanceOf(MyTokenSale.address);
        const totalSupply = await tokenInstance.totalSupply();
        
        expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it('should be possible to buy one token', async () => {
        const initialBalance = await tokenInstance.balanceOf(recipient);

        await(kycInstance.setKycCompleted(recipient));
        await tokenSaleInstance.sendTransaction({
            from: recipient,
            value: web3.utils.toWei('1', 'wei')
        });
        const currentBalance = await tokenInstance.balanceOf(recipient);

        expect(initialBalance + 1).to.be.a.bignumber.equal(currentBalance);
    });

    it('should reject buying of token if acc is not whitelisted by kyc', async() => {
        expect(tokenSaleInstance.sendTransaction({
            from: recipient,
            value: web3.utils.toWei('1', 'wei')
        })).to.be.rejected;
    })
});
