pragma solidity ^0.6.0;

import "./token/ERC721/ERC721.sol";

contract MyCollectible is ERC721 {
    address private _minter;

    constructor() ERC721("MyCollectible", "MCO") public {
        _minter = msg.sender;
    }

    function mintCollectible(address receiver, uint tokenId) public {
        require(msg.sender == _minter, "Only minter can mint");
        _safeMint(receiver, tokenId);
    }
}