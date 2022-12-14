const multiDeployerJSON = require("../artifacts/contracts/MultiChainDeployer.sol/MultiChainDeployer.json");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

const axelarSDK = require("@axelar-network/axelarjs-sdk");
const sdk = new axelarSDK.AxelarQueryAPI({
    environment: "testnet",
});
const axelar = new axelarSDK.AxelarGMPRecoveryAPI({
    environment: "testnet",
});

const chain = hre.network.name;
console.log(chain);

var addr = {};
addr.goerli = {
    "name": "ethereum-2",
    "gasToken": "ETH",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757"
};
addr.mumbai = {
    "name": "Polygon",
    "gasToken": "MATIC",
    "gateway": "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757"
};
addr["arbitrum-goerli"] = {
    "name": "arbitrum",
    "gasToken": "ETH",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757"
};
addr["moonbeam-alpha"] = {
    "name": "Moonbeam",
    "gasToken": "DEV",
    "gateway": "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757"
};

const v = "twentysix";
const salt = ethers.utils.formatBytes32String(v);

//const pHash = ethers.utils.solidityKeccak256(["bytes"],[p]);



const ABI = ["function initialize(address gateway_, address gasReceiver_)"];
const iface = new ethers.utils.Interface(ABI);

async function main() {

    const senderOptions = { privateKey: PRIVATE_KEY, provider: ethers.provider };

    //const response = await axelar.manualRelayToDestChain(
    //const response = await axelar.execute(
    //    '0xf199df0b363fe29d462808b5c0fcf9d50862be1eda83a438617e4ce3b053791b',
    //    senderOptions
    //);
    //console.log(response);
    //return;

    //const targetChains = [ "goerli", "mumbai", "moonbeam-alpha" ];
    //const targetChains = [ "goerli", "moonbeam-alpha" ];
    //const targetChains = [ "arbitrum-goerli" ];
    const targetChains = [ "moonbeam-alpha", "mumbai" ];
    var chainNames = [];
    var destinations = [];
    var inits = [];
    var fees = [];
    var totalFee = 0;
    for (let i = 0; i < targetChains.length; i++) {
        var thisChain = targetChains[i];
        if ( thisChain == chain ) {
            chainNames.push("this");
            fees.push("0");
        } else {
            chainNames.push(addr[thisChain].name);
            const gasFee = await sdk.estimateGasFee(addr[chain].name, addr[thisChain].name, addr[chain].gasToken, 2000000);
            fees.push("" + gasFee);
            totalFee += parseInt(gasFee);
        }
        destinations.push(addr[thisChain].multi);
        inits.push(iface.encodeFunctionData("initialize", [ addr[thisChain].gateway, addr[thisChain].gas ]));
    }
    console.log("fee", totalFee);
    //return;

    const factory = new ethers.Contract(addr[chain].multi, multiDeployerJSON.abi, signer);
    //const result = await factory.multiDeploy(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees);
    console.log(multiDeployerJSON.bytecode, salt, chainNames, destinations, inits);
    const result = await factory.multiDeployAndInit(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees, inits, {value: "" + totalFee});
    console.log(result);
    await result.wait();

}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });