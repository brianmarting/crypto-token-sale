import React, { Component, useEffect, useState } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {

  const [isLoading, setLoading] = useState(true);
  const [account, setAccount] = useState(undefined);
  const [amountOfTokens, setAmountOfTokens] = useState(undefined);
  const [tokenSaleAddress, setTokenSaleAddress] = useState(undefined);
  const [kycAddress, setKycAddress] = useState(undefined);
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        console.log(web3);
  
        // Use web3 to get the user's accounts.
        const [account] = await web3.eth.getAccounts();
        console.log(KycContract)

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        console.log(networkId)
        
        // Init contracts
        const myToken = new web3.eth.Contract(
          MyToken.abi,
          MyToken.networks[networkId] && MyToken.networks[networkId].address
        );
  
        const myTokenSale = new web3.eth.Contract(
          MyTokenSale.abi,
          MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address
        );
  
        const kycContract = new web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[networkId] && KycContract.networks[networkId].address
        );
  
        listenToTokenTransferEvent(myToken, account);
        setContracts({myToken, myTokenSale, kycContract});
        setAccount(account);
        setTokenSaleAddress(myTokenSale._address);
        getAmountOfTokens(myToken, account);
        setLoading(false);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleKycInputChange = (value) => {
    setKycAddress(value);
  }

  const handleKycSubmit = async () => {
    const {kycContract} = contracts;

    await kycContract.methods.setKycCompleted(kycAddress).send({from: account});
    
    alert(`Account ${kycAddress} is now whitelisted.`);
  }

  const buyMoreTokens = async () => {
    const {myTokenSale} = contracts;

    await myTokenSale.methods.buyTokens(account).send({from: account, value: 1});
  
    alert('Bought more tokens!');
  }

  const getAmountOfTokens = async (myToken, account) => {
    const amount = await myToken.methods.balanceOf(account).call();

    setAmountOfTokens(amount);
  }

  const listenToTokenTransferEvent = async (myToken, account) => {
    // this 'to' filters all events to only emit with your acc
    await myToken.events.Transfer({to: account})
              .on('data', async () => getAmountOfTokens(myToken, account));
  }

  return (
    <div className='App'>
      {isLoading && <div>Loading...</div>}

      {!isLoading && 
        <>
          <h1>Capuccino Token for StarDucks</h1>

          <h2>Enable your account</h2>
          Address to allow: <input type="text" value={kycAddress || ''} onChange={(e) => handleKycInputChange(e.target.value)} />
          <button type="button" onClick={() => handleKycSubmit()}>Add Address to Whitelist</button>  

          <h2>Buy KFC tokens</h2>
          <p>Send ether to this address: {tokenSaleAddress}</p>

          <h2>You have: {amountOfTokens || 0} tokens</h2>
          <button type="button" onClick={() => buyMoreTokens()}>Buy moree</button>
        </>
      }
    </div>
  );
}

export default App;
