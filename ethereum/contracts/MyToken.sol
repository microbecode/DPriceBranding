pragma solidity ^0.6.0;

import "./token/ERC20/ERC20.sol";
import "./token/ERC20/ERC20Burnable.sol";

contract MyToken is ERC20Burnable {
    constructor(uint initialSupply, string memory name, string memory symbol) 
      ERC20(name, symbol) public {
          _mint(msg.sender, initialSupply);
    }
}