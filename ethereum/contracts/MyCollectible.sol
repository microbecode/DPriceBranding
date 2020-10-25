pragma solidity ^0.6.0;

import "./token/ERC721/ERC721.sol";

contract MyCollectible is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") public {
    }
}