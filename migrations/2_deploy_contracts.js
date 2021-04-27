const MyToken = artifacts.require("./MyToken.sol");
const MyTokenSale = artifacts.require("./MyTokenSale.sol");
const KycContract = artifacts.require("./KycContract.sol");

module.exports = async function(deployer) {
  const totalSupply = process.env.INITIAL_TOKENS;
  const [address] = await web3.eth.getAccounts();

  await deployer.deploy(MyToken, totalSupply);
  await deployer.deploy(KycContract);
  await deployer.deploy(MyTokenSale, 1, address, MyToken.address, KycContract.address);

  const instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, totalSupply);
};
