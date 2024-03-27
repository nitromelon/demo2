// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Transaction {
    struct Purchase {
        string itemID;
        uint256 purchasedTime;
        address purchaser;
        address seller;
        string price;
    }

    struct User {
        string id;
        string email;
    }

    mapping(address => Purchase[]) public purchases;

    event PurchaseMade(
        address indexed purchaser,
        address indexed seller,
        string itemID,
        uint256 purchasedTime,
        string price
    );

    function makePurchase(string memory _itemID, address _seller, string memory _price) public {
        purchases[msg.sender].push(
            Purchase({
                itemID: _itemID,
                purchasedTime: block.timestamp,
                purchaser: msg.sender,
                seller: _seller,
                price: _price
            })
        );

        emit PurchaseMade(msg.sender, _seller, _itemID, block.timestamp, _price);
    }

    function getUserPurchases() public view returns (Purchase[] memory) {
        return purchases[msg.sender];
    }

    function getPurchaseCount() public view returns (uint256) {
        return purchases[msg.sender].length;
    }
}
