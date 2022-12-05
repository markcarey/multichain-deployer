var chain = "goerli";

async function main() {
    // Grab the contract factory 
    const Contract = await ethers.getContractFactory("MultiChainDeployer");
 
    // Start deployment, returning a promise that resolves to a contract object
    const myDeployer = await Contract.deploy(); // Instance of the contract 
    console.log("Contract deployed to address:", myDeployer.address);
    //console.log(`npx hardhat verify --network ${chain} ${myDeployer.address}`);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });