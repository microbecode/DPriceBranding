// SPDX-License-Identifier: MIT
// This file is used for getting the artifacts locally
pragma solidity ^0.6.0;

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";

contract UniswapV2Router02Mock is UniswapV2Router02 {
    constructor(address _factory, address _WETH)
    UniswapV2Router02(_factory, _WETH)
    public {
    }
}