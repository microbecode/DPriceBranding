pragma solidity ^0.6.0;

import "../token/ERC20/ERC20.sol";

contract MyToken1Mock is ERC20 {
    constructor(uint initialSupply, string memory name, string memory symbol) 
      ERC20(name, symbol) public {
          _mint(msg.sender, initialSupply);
    }
}