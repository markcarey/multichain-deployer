// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.2;

import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol';
import { StringToAddress, AddressToString } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/StringAddressUtils.sol';

interface ConstAddressDeployer {
    function deploy(bytes memory bytecode, bytes32 salt) external returns (address deployedAddress_);
    function deployAndInit(bytes memory bytecode, bytes32 salt, bytes calldata init) external returns (address deployedAddress_);
    function deployedAddress(bytes calldata bytecode, address sender, bytes32 salt) external view returns (address deployedAddress_);
}

contract MultiChainDeployer is IAxelarExecutable  {
    using StringToAddress for string;
    using AddressToString for address;

    event DeployStarted(address deployedAddress_, string[] chainNames);
    event DeployEnded(address deployedAddress_);

    ConstAddressDeployer cad = ConstAddressDeployer(0x98B2920D53612483F91F12Ed7754E51b4A77919e);
   
    //TODO: move these to initializer?
    IAxelarGateway public gateway = IAxelarGateway(0xe432150cce91c13a887f7D836923d5597adD8E31);
    IAxelarGasService public gasReceiver = IAxelarGasService(0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6);

    //constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {
    //    gasReceiver = IAxelarGasService(gasReceiver_);
    //}

    function deploy(bytes memory bytecode, bytes32 salt, string[] memory chainNames, address[] memory destinationAddresses) external returns (address deployedAddress_) {
        bytes memory payload = abi.encode(bytecode, salt);
        deployedAddress_ = cad.deployedAddress(bytecode, destinationAddresses[0], salt);
        for(uint i = 0; i < chainNames.length; i++) {
            string memory stringAddress = address(destinationAddresses[i]).toString();
            gasReceiver.payNativeGasForContractCall{ value: 0.01 ether }(
                address(this),
                chainNames[i],
                stringAddress,
                payload,
                address(this)
            );
            gateway.callContract(chainNames[i], stringAddress, payload);
        }
        emit DeployStarted(deployedAddress_, chainNames);
    }

    function execute(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) external {
        (bytes memory bytecode, bytes32 salt) = abi.decode(payload, (bytes,bytes32));
        address deployedAddress_ = cad.deploy(bytecode, salt);
        emit DeployEnded(deployedAddress_);
    }

    function executeWithToken(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) external {}

    receive() external payable {}
}