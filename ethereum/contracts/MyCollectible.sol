pragma solidity ^0.6.0;

import "./token/ERC721/ERC721.sol";

contract MyCollectible is ERC721 {
    address private _minter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) public {
        _minter = msg.sender;
    }

    function mintCollectible(address receiver, uint tokenId) public {
        require(msg.sender == _minter, "only minter can mint");
        _safeMint(receiver, tokenId);
    }
}