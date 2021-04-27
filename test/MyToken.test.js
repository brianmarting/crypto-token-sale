const MyToken = artifacts.require("MyToken");

const chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;

chai.use(chaiBN);
chai.use(chaiAsPromised);

contract("My token", async accounts => {
    const [initialHolder, recipient, anotherAccount] = accounts;

    let instance;

    beforeEach(async () => {
        instance = await MyToken.new(process.env.INITIAL_TOKENS);
    });

    it("All tokens should be in my account", async () => {
        const totalSupply = await instance.totalSupply();
        const currentBalance = await instance.balanceOf(initialHolder);
    
        expect(currentBalance).to.be.a.bignumber.equal(totalSupply);
    });

    it('I can transfer tokens', async () => {
        const sentTokens = 45;
        const totalSupply = await instance.totalSupply();

        await instance.transfer(recipient, sentTokens);
        const initialHolderBalance = await instance.balanceOf(initialHolder);
        const recipientBalance = await instance.balanceOf(recipient);

        expect(initialHolderBalance).to.be.a.bignumber.equal(totalSupply.sub(new BN(sentTokens)));
        expect(recipientBalance).to.be.a.bignumber.equal(new BN(sentTokens));
    });

    it('should not be able to send more tokens than the acc has', async () => {
        const balance = await instance.balanceOf(initialHolder);

        expect(instance.transfer(recipient, new BN(balance + 1))).to.eventually.be.rejected;
        
        const currentBalance = await instance.balanceOf(initialHolder);

        expect(currentBalance).to.be.a.bignumber.equal(balance);
    });
});