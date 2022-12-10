# Multichain Deployer

Multichain Deployer provides a set of contracts that enables developers to deploy and intialize their contracts to multiple chains using a _single transaction_, which each contract being _deployed to the same address_.

# Features include:
- deploy contracts to multiple chains by sending a transaction to _only one chain_ (developer doesn't need native gas for every target chain)
- contracts on each chain are deployed at the _same address_ (much cleaner for your docs, your users, and other developers)
- (optionally) initialize each contract as part of the same transaction (saving time and reducing the chance of error for large multi-chain deployments)

# How it works
Starting from the [https://docs.axelar.dev/dev/build/solidity-utilities#constant-address-deployer](Constant Address Deployer) (CAD) contract by Alexar, I expanded it to also provide remote deployment functions. The CAD contracts are deployed to the same address on each chain and provide `deploy()` and `deployAndInt()` functions that developers can call to _deploy their own contracts *from* the CAD contract_. The main reason to do this -- rather than deploy directly -- is to ensure that each deployment on each chain is _deployed to the same address_. But you still need to deploy to each chain separately, calling the CAD functions on each target chain.

Multichain Deployer adds `multiDeploy()` and `multiDeployAndInit()` functions. These functions accept not only the bytecode needed to deploy, but also the target chains and addresses. These functions will deploy on the local chain if specified, and also send `callContract()` GMP (General Message Passing) to the Alexar network, to be relayed to the target chains. Once the `execute()` function has been called on the target domains, the same bytecode and other payload data is used to deploy (and optionally initialize) the contract on each target chain.

_The end result is that by sending a single transaction on a chain of your choice, you can deploy and initialize a contract on multiple chains, each deployed to the same address_.

# Examples
Examples can be found in `/scripts/multi-deploy.js` and in `/tests/deployer.js`. In both examples, we are actually multi-deploying a copy of the `MultiChainDeployer.sol` contract itself. (_Side note: while a contract deploying a copy of itself may not be a real-world example, the bytecode was handy and readily avaialble. One can imagine "Hello World" examples or cross-chain token contracts being deployed instead_).

Example Axelar GMPs, from Goerli to Moonbase and Mumbai:
https://testnet.axelarscan.io/gmp/0x05b1c6170074b8a5641fb213298627396fd93f57e8215ac93d8352b2341ba510:168
https://testnet.axelarscan.io/gmp/0x5ca8e7e00becf50e6755b6104ed7b4e857c37e15bd0d687ca1820ddde8f915fe:11

Contracts deployed by the above GMPs, respectively (note that the addresses are the same):
https://moonbase.moonscan.io/address/0x3fea137d02712610a849d012f9719d983869f324
https://mumbai.polygonscan.com/address/0x3fea137d02712610a849d012f9719d983869f324

# Deployments
MultiChain Deployer is currently deployed to four testnets. 

- [Ethereum Goerli](https://goerli.etherscan.io/address/0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757)
- [Polygon Mumbai](https://mumbai.polygonscan.com/address/0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757)
- [Arbitrum Goerli](https://goerli.arbiscan.io/address/0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757)
- [Moonbase Alpha](https://moonbase.moonscan.io/address/0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757)

The contract is deployed to the same address on each of the above chains: `0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757`.

