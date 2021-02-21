pragma solidity ^0.6.0;

import "./token/ERC20/ERC20.sol";
import "./token/ERC20/ERC20Burnable.sol";
import "./MyCollectible.sol";

contract MyToken is ERC20Burnable {
    MyCollectible public nft;

    constructor(uint initialSupply, string memory name, string memory symbol) 
      ERC20(name, symbol) public {
          _mint(msg.sender, initialSupply);
          nft = new MyCollectible();
    }

    /**
     * @dev Destroys `amount` tokens from the caller and mints an NFT
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) override public virtual {
        _burn(msg.sender, amount);
        // If burning at least one full token, mint an NFT for each full token
        if (amount >= 10 ** 18) {
            uint fullTokens = amount / (10 ** 18);
            for (uint i = 0; i < fullTokens; i++) {
                uint newId = nft.totalSupply() + 1;
                nft.mintCollectible(msg.sender, newId);
            }
            
        }
    }
}