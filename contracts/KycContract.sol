// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

// Kyc = Know Your Customer
contract KycContract is Ownable {
    
    mapping(address => bool) allowed;

    function setKycCompleted(address _address) public onlyOwner {
        allowed[_address] = true;
    }

    function setKycRevoked(address _address) public onlyOwner {
        allowed[_address] = false;
    }

    function kycIsAllowed(address _address) public view returns (bool) {
        return allowed[_address];
    }
}
