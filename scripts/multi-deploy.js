const multiDeployerJSON = require("../artifacts/contracts/MultiChainDeployer.sol/MultiChainDeployer.json");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

const chain = hre.network.name;
console.log(chain);

var addr = {};
addr.goerli = {
    "name": "ethereum-2",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x22a96ef89590dbb8705AC66734137D7BE55991c7"
};
addr.mumbai = {
    "name": "Polygon",
    "gateway": "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x22a96ef89590dbb8705AC66734137D7BE55991c7"
};
addr["arbitrum-goerli"] = {
    "name": "arbitrum",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x22a96ef89590dbb8705AC66734137D7BE55991c7"
};
addr["moonbeam-alpha"] = {
    "name": "Moonbeam",
    "gateway": "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x22a96ef89590dbb8705AC66734137D7BE55991c7"
};

const v = "nineteen";
const salt = ethers.utils.formatBytes32String(v);

const ABI = ["function initialize(address gateway_, address gasReceiver_)"];
const iface = new ethers.utils.Interface(ABI);

async function main() {

    const targetChains = ["goerli", "mumbai", "arbitrum-goerli"];
    var chainNames = [];
    var destinations = [];
    var inits = [];
    for (let i = 0; i < targetChains.length; i++) {
        var thisChain = targetChains[i];
        if ( thisChain == chain ) {
            chainNames.push("this");
        } else {
            chainNames.push(addr[thisChain].name);
        }
        destinations.push(addr[thisChain].multi);
        inits.push(iface.encodeFunctionData("initialize", [ addr[thisChain].gateway, addr[thisChain].gas ]));
    }

    const factory = new ethers.Contract(addr[chain].multi, multiDeployerJSON.abi, signer);
    //const result = await factory.multiDeploy(multiDeployerJSON.bytecode, salt, chainNames, [destinationAddress]);
    console.log(multiDeployerJSON.bytecode, salt, chainNames, destinations, inits);
    const result = await factory.multiDeployAndInit(multiDeployerJSON.bytecode, salt, chainNames, destinations, inits);
    console.log(result);
    await result.wait();

}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });