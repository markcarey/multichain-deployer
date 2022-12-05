const cdaABI = [{"inputs":[],"name":"EmptyBytecode","type":"error"},{"inputs":[],"name":"FailedDeploy","type":"error"},{"inputs":[],"name":"FailedInit","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"bytecodeHash","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"salt","type":"bytes32"},{"indexed":true,"internalType":"address","name":"deployedAddress","type":"address"}],"name":"Deployed","type":"event"},{"inputs":[{"internalType":"bytes","name":"bytecode","type":"bytes"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"name":"deploy","outputs":[{"internalType":"address","name":"deployedAddress_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"bytecode","type":"bytes"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"bytes","name":"init","type":"bytes"}],"name":"deployAndInit","outputs":[{"internalType":"address","name":"deployedAddress_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"bytecode","type":"bytes"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"name":"deployedAddress","outputs":[{"internalType":"address","name":"deployedAddress_","type":"address"}],"stateMutability":"view","type":"function"}];
const cdaAddress = '0x98B2920D53612483F91F12Ed7754E51b4A77919e';

const multiDeployerJSON = require("../artifacts/contracts/MultiChainDeployer.sol/MultiChainDeployer.json");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

const v = "eight";
const salt = ethers.utils.formatBytes32String(v);

const ABI = ["function initialize(address gateway_, address gasReceiver_)"];
const iface = new ethers.utils.Interface(ABI);

// goerli addresses
//const init = iface.encodeFunctionData("initialize", [ "0xe432150cce91c13a887f7D836923d5597adD8E31", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6" ]);

const chain = hre.network.name;
var addr = {};
addr.goerli = {
    "name": "ethereum-2",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": ""
};
addr.mumbai = {
    "name": "Polygon",
    "gateway": "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": ""
};
addr["arbitrum-goerli"] = {
    "name": "arbitrum",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": ""
};
const init = iface.encodeFunctionData("initialize", [ addr[chain].gateway, addr[chain].gas ]);

async function main() {

    const factory = new ethers.Contract(cdaAddress, cdaABI, signer);
    //const result = await factory.deploy(multiDeployerJSON.bytecode, salt);
    const result = await factory.deployAndInit(multiDeployerJSON.bytecode, salt, init);
    console.log(result);
    await result.wait();

}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });