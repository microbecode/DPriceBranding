pragma solidity ^0.6.6;

import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "./ERC20/ERC20.sol";

// Adjusted from https://yos.io/2019/07/13/smart-contract-extensibility-wrapped-tokens/
contract WETH is ERC20 {
  event Deposit(address indexed sender, uint256 amount);
  event Withdrawal(address indexed recipient, uint256 amount);

  constructor() public ERC20("Wrapped Ether", "WETH") {}

  function deposit() virtual external payable {
    _mint(msg.sender, msg.value);
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(uint amount) virtual external {
    require(balanceOf(msg.sender) >= amount);
    address payable recipient = msg.sender;
    _burn(msg.sender, amount);
    recipient.transfer(amount);
    emit Withdrawal(recipient, amount);
  }

  function withdraw(uint amount, address payable recipient) virtual external {
    require(balanceOf(msg.sender) >= amount);
    recipient.transfer(amount);
    _burn(msg.sender, amount);
    emit Withdrawal(recipient, amount);
  }
}