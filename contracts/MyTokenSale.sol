// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {

    KycContract kyc;

    constructor(uint _rate, address payable _wallet, IERC20 _token, KycContract _kyc) Crowdsale(_rate, _wallet, _token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address _beneficiary, uint _weiAmount) internal view override {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(kyc.kycIsAllowed(_beneficiary), "Address is not allowed yet, aborting.");
    }
}
