// SPDX-License-Identifier: MIT

pragma solidity =0.5.16;

import "@uniswap/v2-core/contracts/UniswapV2Factory.sol";

contract UniswapV2Factory02Mock is UniswapV2Factory {
     constructor(address _feeToSetter) public
     UniswapV2Factory(_feeToSetter) {

    } 
}
