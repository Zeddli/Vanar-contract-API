// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthRecord {
    string private record;
    address public owner;

    constructor(string memory _record) {
        owner = msg.sender;
        record = _record;
    }

    function getRecord() public view returns (string memory) {
        return record;
    }
}
