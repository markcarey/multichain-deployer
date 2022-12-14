// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.2;

import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol';
import { StringToAddress, AddressToString } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/StringAddressUtils.sol';
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract MultiChainDeployer is Initializable, IAxelarExecutable  {
    using StringToAddress for string;
    using AddressToString for address;

    event DeployStarted(address deployedAddress_, string[] chainNames);
    //event PayloadFrom(bytes bytecode, bytes32 salt, bytes init, address sender);
   
    IAxelarGateway public gateway;
    IAxelarGasService public gasReceiver;

    function initialize(address gateway_, address gasReceiver_) public virtual initializer {
        gateway = IAxelarGateway(gateway_);
        gasReceiver = IAxelarGasService(gasReceiver_);
    }

    function multiDeploy(bytes memory bytecode, bytes32 salt, string[] memory chainNames, address[] memory destinationAddresses, uint256[] memory fees) external payable returns (address deployedAddress_) {
        for(uint i = 0; i < chainNames.length; i++) {
            if (keccak256(bytes(chainNames[i])) == keccak256(bytes("this"))) {
                deployedAddress_ = this.deploy(bytecode, salt, msg.sender);
            } else {
                bytes memory payload = abi.encode(bytecode, salt, bytes(""), msg.sender);
                //emit PayloadFrom(bytecode, salt, bytes(""), msg.sender);
                _remoteDeploy(fees[i], chainNames[i], address(destinationAddresses[i]).toString(), payload);
            }
        }
        if (deployedAddress_ == address(0)) {
            deployedAddress_ = this.deployedAddress(bytecode, msg.sender, salt);
        }
        emit DeployStarted(deployedAddress_, chainNames);
    }

    function multiDeployAndInit(bytes memory bytecode, bytes32 salt, string[] memory chainNames, address[] memory destinationAddresses, uint256[] memory fees, bytes[] calldata inits) external payable returns (address deployedAddress_) {
        for(uint i = 0; i < chainNames.length; i++) {
            if (keccak256(bytes(chainNames[i])) == keccak256(bytes("this"))) {
                deployedAddress_ = this.deployAndInit(bytecode, salt, inits[i], msg.sender);
            } else {
                bytes memory payload = abi.encode(bytecode, salt, inits[i], msg.sender);
                //emit PayloadFrom(bytecode, salt, inits[i], msg.sender);
                _remoteDeploy(fees[i], chainNames[i], address(destinationAddresses[i]).toString(), payload);
            }
        }
        if (deployedAddress_ == address(0)) {
            deployedAddress_ = this.deployedAddress(bytecode, msg.sender, salt);
        }
        emit DeployStarted(deployedAddress_, chainNames);
    }

    function _remoteDeploy(uint256 fee, string memory chainName, string memory stringAddress, bytes memory payload) internal {
        gasReceiver.payNativeGasForContractCall{ value: fee }(
            address(this),
            chainName,
            stringAddress,
            payload,
            msg.sender
        );
        gateway.callContract(chainName, stringAddress, payload);
    }

    function execute(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) external override {
        bytes32 payloadHash = keccak256(payload);
        if (!gateway.validateContractCall(commandId, sourceChain, sourceAddress, payloadHash))
            revert NotApprovedByGateway();
        (bytes memory bytecode, bytes32 salt, bytes memory init, address sender) = abi.decode(payload, (bytes,bytes32,bytes,address));
        address deployedAddress_;
        if (init.length > 0) {
            deployedAddress_ = this.deployAndInit(bytecode, salt, init, sender);
        } else {
            deployedAddress_ = this.deploy(bytecode, salt, sender);
        }
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

    // @dev modified from '@axelar-network/axelar-gmp-sdk-solidity/contracts/ConstantAddressDeployer.sol':

    error EmptyBytecode();
    error FailedDeploy();
    error FailedInit();

    event Deployed(bytes32 indexed bytecodeHash, bytes32 indexed salt, address indexed deployedAddress);

    /**
     * @dev Deploys a contract using `CREATE2`. The address where the contract
     * will be deployed can be known in advance via {deployedAddress}.
     *
     * The bytecode for a contract can be obtained from Solidity with
     * `type(contractName).creationCode`.
     *
     * Requirements:
     *
     * - `bytecode` must not be empty.
     * - `salt` must have not been used for `bytecode` already by the same `msg.sender`.
     */
    function deploy(bytes memory bytecode, bytes32 salt, address sender) external returns (address deployedAddress_) {
        deployedAddress_ = _deploy(bytecode, keccak256(abi.encode(sender, salt)));
    }

    /**
     * @dev Deploys a contract using `CREATE2` and initialize it. The address where the contract
     * will be deployed can be known in advance via {deployedAddress}.
     *
     * The bytecode for a contract can be obtained from Solidity with
     * `type(contractName).creationCode`.
     *
     * Requirements:
     *
     * - `bytecode` must not be empty.
     * - `salt` must have not been used for `bytecode` already by the same `msg.sender`.
     * - `init` is used to initialize the deployed contract
     *    as an option to not have the constructor args affect the address derived by `CREATE2`.
     */
    function deployAndInit(
        bytes memory bytecode,
        bytes32 salt,
        bytes calldata init,
        address sender
    ) external returns (address deployedAddress_) {
        deployedAddress_ = _deploy(bytecode, keccak256(abi.encode(sender, salt)));

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = deployedAddress_.call(init);
        if (!success) revert FailedInit();
    }

    /**
     * @dev Returns the address where a contract will be stored if deployed via {deploy} or {deployAndInit} by `sender`.
     * Any change in the `bytecode`, `sender`, or `salt` will result in a new destination address.
     */
    function deployedAddress(
        bytes calldata bytecode,
        address sender,
        bytes32 salt
    ) external view returns (address deployedAddress_) {
        bytes32 newSalt = keccak256(abi.encode(sender, salt));
        deployedAddress_ = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            hex'ff',
                            address(this),
                            newSalt,
                            keccak256(bytecode) // init code hash
                        )
                    )
                )
            )
        );
    }

    function _deploy(bytes memory bytecode, bytes32 salt) internal returns (address deployedAddress_) {
        if (bytecode.length == 0) revert EmptyBytecode();

        // solhint-disable-next-line no-inline-assembly
        assembly {
            deployedAddress_ := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        if (deployedAddress_ == address(0)) revert FailedDeploy();

        emit Deployed(keccak256(bytecode), salt, deployedAddress_);
    }

}