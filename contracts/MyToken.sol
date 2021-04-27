// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint initialSupply) ERC20("Kentucky Fried Crypto", "KFC") {
        _mint(msg.sender, initialSupply);
    }
}
