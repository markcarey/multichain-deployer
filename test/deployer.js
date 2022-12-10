const { expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");
const abiCoder = new ethers.utils.AbiCoder();

const multiDeployerJSON = require("../artifacts/contracts/MultiChainDeployer.sol/MultiChainDeployer.json");
const gatewayABI = [{"inputs":[{"internalType":"address","name":"authModule_","type":"address"},{"internalType":"address","name":"tokenDeployerImplementation_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyVoted","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"BurnFailed","type":"error"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"DuplicateAdmin","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"ExceedMintLimit","type":"error"},{"inputs":[],"name":"InvalidAdminThreshold","type":"error"},{"inputs":[],"name":"InvalidAdmins","type":"error"},{"inputs":[],"name":"InvalidAmount","type":"error"},{"inputs":[],"name":"InvalidAuthModule","type":"error"},{"inputs":[],"name":"InvalidChainId","type":"error"},{"inputs":[],"name":"InvalidCodeHash","type":"error"},{"inputs":[],"name":"InvalidCommands","type":"error"},{"inputs":[],"name":"InvalidSetMintLimitsParams","type":"error"},{"inputs":[],"name":"InvalidTokenDeployer","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"MintFailed","type":"error"},{"inputs":[],"name":"NotAdmin","type":"error"},{"inputs":[],"name":"NotProxy","type":"error"},{"inputs":[],"name":"NotSelf","type":"error"},{"inputs":[],"name":"SetupFailed","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"TokenAlreadyExists","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"TokenContractDoesNotExist","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"TokenDeployFailed","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"TokenDoesNotExist","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"destinationChain","type":"string"},{"indexed":false,"internalType":"string","name":"destinationContractAddress","type":"string"},{"indexed":true,"internalType":"bytes32","name":"payloadHash","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"payload","type":"bytes"}],"name":"ContractCall","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"commandId","type":"bytes32"},{"indexed":false,"internalType":"string","name":"sourceChain","type":"string"},{"indexed":false,"internalType":"string","name":"sourceAddress","type":"string"},{"indexed":true,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":true,"internalType":"bytes32","name":"payloadHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"sourceTxHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"sourceEventIndex","type":"uint256"}],"name":"ContractCallApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"commandId","type":"bytes32"},{"indexed":false,"internalType":"string","name":"sourceChain","type":"string"},{"indexed":false,"internalType":"string","name":"sourceAddress","type":"string"},{"indexed":true,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":true,"internalType":"bytes32","name":"payloadHash","type":"bytes32"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"sourceTxHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"sourceEventIndex","type":"uint256"}],"name":"ContractCallApprovedWithMint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"destinationChain","type":"string"},{"indexed":false,"internalType":"string","name":"destinationContractAddress","type":"string"},{"indexed":true,"internalType":"bytes32","name":"payloadHash","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"payload","type":"bytes"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ContractCallWithToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"commandId","type":"bytes32"}],"name":"Executed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes","name":"newOperatorsData","type":"bytes"}],"name":"OperatorshipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"address","name":"tokenAddresses","type":"address"}],"name":"TokenDeployed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"limit","type":"uint256"}],"name":"TokenMintLimitUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"destinationChain","type":"string"},{"indexed":false,"internalType":"string","name":"destinationAddress","type":"string"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"adminEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"}],"name":"adminThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"}],"name":"admins","outputs":[{"internalType":"address[]","name":"results","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"allTokensFrozen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"bytes32","name":"commandId","type":"bytes32"}],"name":"approveContractCall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"bytes32","name":"commandId","type":"bytes32"}],"name":"approveContractCallWithMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"authModule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"burnToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"destinationChain","type":"string"},{"internalType":"string","name":"destinationContractAddress","type":"string"},{"internalType":"bytes","name":"payload","type":"bytes"}],"name":"callContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"destinationChain","type":"string"},{"internalType":"string","name":"destinationContractAddress","type":"string"},{"internalType":"bytes","name":"payload","type":"bytes"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"callContractWithToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"deployToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"input","type":"bytes"}],"name":"execute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getBool","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getBytes","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getInt","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getUint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commandId","type":"bytes32"}],"name":"isCommandExecuted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commandId","type":"bytes32"},{"internalType":"string","name":"sourceChain","type":"string"},{"internalType":"string","name":"sourceAddress","type":"string"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"bytes32","name":"payloadHash","type":"bytes32"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"isContractCallAndMintApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commandId","type":"bytes32"},{"internalType":"string","name":"sourceChain","type":"string"},{"internalType":"string","name":"sourceAddress","type":"string"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"bytes32","name":"payloadHash","type":"bytes32"}],"name":"isContractCallApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"mintToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"destinationChain","type":"string"},{"internalType":"string","name":"destinationAddress","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sendToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"symbols","type":"string[]"},{"internalType":"uint256[]","name":"limits","type":"uint256[]"}],"name":"setTokenMintLimits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"params","type":"bytes"}],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"tokenAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDeployer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"tokenFrozen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"tokenMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"tokenMintLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"newOperatorsData","type":"bytes"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"transferOperatorship","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes32","name":"newImplementationCodeHash","type":"bytes32"},{"internalType":"bytes","name":"setupParams","type":"bytes"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commandId","type":"bytes32"},{"internalType":"string","name":"sourceChain","type":"string"},{"internalType":"string","name":"sourceAddress","type":"string"},{"internalType":"bytes32","name":"payloadHash","type":"bytes32"}],"name":"validateContractCall","outputs":[{"internalType":"bool","name":"valid","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commandId","type":"bytes32"},{"internalType":"string","name":"sourceChain","type":"string"},{"internalType":"string","name":"sourceAddress","type":"string"},{"internalType":"bytes32","name":"payloadHash","type":"bytes32"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"validateContractCallAndMint","outputs":[{"internalType":"bool","name":"valid","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

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

var logs = [];
const debug = true;
const logOutput = true;

function log(msg, data) {
    logs.push(msg);
    if (data) {
        logs.push(data);
    }
    if (debug) {
        console.log(msg, data);
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

var addr = {};
addr.goerli = {
    "name": "ethereum-2",
    "gasToken": "ETH",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757",
    "rpc": process.env.API_URL_GOERLI,
    "start": 8111045,
    "deployed": false
};
addr.mumbai = {
    "name": "Polygon",
    "gasToken": "MATIC",
    "gateway": "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757",
    "rpc": process.env.API_URL_MUMBAI,
    start: 29590855,
    "deployed": false
};
addr["arbitrum-goerli"] = {
    "name": "arbitrum",
    "gasToken": "ETH",
    "gateway": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757",
    "rpc": process.env.API_URL_ARBIGOERLI,
    "start": 2540667,
    "deployed": false
};
addr["moonbeam-alpha"] = {
    "name": "Moonbeam",
    "gasToken": "DEV",
    "gateway": "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    "gas": "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    "multi": "0x6736C14F38909e9E17E0312EC9DBdD0d75F0D757",
    "rpc": process.env.API_URL_MOONBEAMALPHA,
    "start": 3331013,
    "deployed": false
};

const textSalt = "salt" + Date.now();
var salt = ethers.utils.formatBytes32String(textSalt);

const ABI = ["function initialize(address gateway_, address gasReceiver_)"];
const iface = new ethers.utils.Interface(ABI);

const allChains = [ "goerli", "mumbai", "arbitrum-goerli", "moonbeam-alpha" ];
for (let i = 0; i < allChains.length; i++) {
    var thisChain = allChains[i];
    const chainProvider = new ethers.providers.JsonRpcProvider({"url": addr[thisChain].rpc});
    addr[thisChain].multiContract = new ethers.Contract(addr[thisChain].multi, multiDeployerJSON.abi, chainProvider);
    addr[thisChain].gatewayContract = new ethers.Contract(addr[thisChain].gateway, gatewayABI, chainProvider);
    addr[thisChain].signer = new ethers.Wallet(PRIVATE_KEY, chainProvider);
}

var targetChains = [];
var deployer;

before('Buncha stuff that happens first', async function () {
    log('###Getting Ready...');
    //targetChains = [ "goerli", "mumbai", "arbitrum-goerli", "moonbeam-alpha" ];
    //targetChains = [ "goerli", "moonbeam-alpha" ];
    //targetChains = [ "mumbai", "arbitrum-goerli" ];
    targetChains = [ "moonbeam-alpha", "mumbai" ];
    deployer = new ethers.Contract(addr[chain].multi, multiDeployerJSON.abi, signer);
});

describe("Multi Deploy via Individual Txns", async function(){

    it("should send callContract GMPs from separate txns", async function () {

        for (let j = 0; j < targetChains.length; j++) {
            var deployChains = [ targetChains[j] ];
            var chainNames = [];
            var destinations = [];
            var inits = [];
            var fees = [];
            var totalFee = 0;
            for (let i = 0; i < deployChains.length; i++) {
                var thisChain = deployChains[i];
                log('starting with chain ' + thisChain);
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
            } //for i
            log("fee", totalFee);

            //const result = await factory.multiDeploy(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees);
            //log(multiDeployerJSON.bytecode, salt, chainNames, destinations, inits);
            const abiCoder = new ethers.utils.AbiCoder();
            const payload = abiCoder.encode(["bytes","bytes32","bytes","address"], [multiDeployerJSON.bytecode, salt, inits[0], process.env.PUBLIC_KEY]);
            //log("payload", payload);
            const payloadHash = ethers.utils.solidityKeccak256(["bytes"],[payload]);
            addr[targetChains[j]].payloadHash = payloadHash;
            addr[targetChains[j]].deployedAddress = await deployer.deployedAddress(multiDeployerJSON.bytecode, process.env.PUBLIC_KEY, salt);
            log("payloadHash", payloadHash);

            await expect(deployer.multiDeployAndInit(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees, inits, {value: "" + totalFee}))
                .to.emit(addr[chain].gatewayContract, 'ContractCall')
                .withArgs(addr[targetChains[j]].multi, chainNames[0], addr[targetChains[j]].multi.toLowerCase(), payloadHash, payload);

        } // for j

    }); // it    

    it("should deploy contracts on the destination chain(s)", async function () {
        this.timeout(100000000);
        var checking = true;
        while (checking) {
            await sleep(60000); // wait 60 seconds
            for (let j = 0; j < targetChains.length; j++) {
                let deployedFilter = addr[targetChains[j]].multiContract.filters.Deployed();
                let deployLogs = await addr[targetChains[j]].multiContract.queryFilter(deployedFilter, addr[targetChains[j]].start, 'latest');
                //log(JSON.stringify(deployLogs));
                for (let i = 0; i < deployLogs.length; i++) {
                    log("log found for " + targetChains[j], deployLogs[i].args);
                    const bytecodeHash = deployLogs[i].args.bytecodeHash;
                    const logSalt = deployLogs[i].args.salt;
                    const deployedAddress = deployLogs[i].args.salt;
                    if ( (bytecodeHash == ethers.utils.id(multiDeployerJSON.bytecode)) && (logSalt == salt) && (deployedAddress == addr[targetChains[j]].deployedAddress) ) {
                        addr[targetChains[j]].deployed = true;
                        log("matched!", deployLogs[i].args);
                    } else {
                        log("not a match");
                    }
                } // for i
            } // for j
            var done = true;
            for (let j = 0; j < targetChains.length; j++) {
                if (addr[targetChains[j]].deployed != true) {
                    done = false;
                }
            }
            if (done) {
                checking = false;
            }
        } // while
        expect(checking).to.be.false;;
    });


});

describe("Multi Deploy via a Single Txn", async function(){


    it("should send muliple callContract GMPs from same txn", async function () {

        salt = ethers.utils.formatBytes32String("salty" + Date.now());

        //for (let j = 0; j < targetChains.length; j++) {
            var deployChains = targetChains;
            var chainNames = [];
            var destinations = [];
            var inits = [];
            var fees = [];
            var totalFee = 0;
            const expectedAddress = await deployer.deployedAddress(multiDeployerJSON.bytecode, process.env.PUBLIC_KEY, salt);
            var externalChainCount = 0;
            for (let i = 0; i < deployChains.length; i++) {
                var thisChain = deployChains[i];
                log('starting with chain ' + thisChain);
                if ( thisChain == chain ) {
                    chainNames.push("this");
                    fees.push("0");
                } else {
                    externalChainCount++;
                    chainNames.push(addr[thisChain].name);
                    const gasFee = await sdk.estimateGasFee(addr[chain].name, addr[thisChain].name, addr[chain].gasToken, 2000000);
                    fees.push("" + gasFee);
                    totalFee += parseInt(gasFee);
                }
                destinations.push(addr[thisChain].multi);
                inits.push(iface.encodeFunctionData("initialize", [ addr[thisChain].gateway, addr[thisChain].gas ]));
                const payload = abiCoder.encode(["bytes","bytes32","bytes","address"], [multiDeployerJSON.bytecode, salt, inits[i], process.env.PUBLIC_KEY]);
                //log("payload", payload);
                const payloadHash = ethers.utils.solidityKeccak256(["bytes"],[payload]);
                addr[targetChains[i]].payload = payload;
                addr[targetChains[i]].payloadHash = payloadHash;
                addr[targetChains[i]].deployedAddress = expectedAddress;
                log("payloadHash", payloadHash);
    
            } //for i
            log("fee", totalFee);

            //const result = await factory.multiDeploy(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees);
            //log(multiDeployerJSON.bytecode, salt, chainNames, destinations, inits);

            if (externalChainCount == 1) {
                await expect(deployer.multiDeployAndInit(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees, inits, {value: "" + totalFee}))
                    .to.emit(addr[chain].gatewayContract, 'ContractCall')
                    .withArgs(addr[targetChains[0]].multi, chainNames[0], addr[targetChains[0]].multi.toLowerCase(), addr[targetChains[0]].payloadHash, addr[targetChains[0]].payload);
            }
            if (externalChainCount == 2) {
                await expect(deployer.multiDeployAndInit(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees, inits, {value: "" + totalFee}))
                    .to.emit(addr[chain].gatewayContract, 'ContractCall')
                    .withArgs(addr[targetChains[0]].multi, chainNames[0], addr[targetChains[0]].multi.toLowerCase(), addr[targetChains[0]].payloadHash, addr[targetChains[0]].payload)
                    .to.emit(addr[chain].gatewayContract, 'ContractCall')
                    .withArgs(addr[targetChains[1]].multi, chainNames[1], addr[targetChains[1]].multi.toLowerCase(), addr[targetChains[1]].payloadHash, addr[targetChains[1]].payload);
            }
            if (externalChainCount == 3) {
                await expect(deployer.multiDeployAndInit(multiDeployerJSON.bytecode, salt, chainNames, destinations, fees, inits, {value: "" + totalFee}))
                    .to.emit(addr[chain].gatewayContract, 'ContractCall')
                    .withArgs(addr[targetChains[0]].multi, chainNames[0], addr[targetChains[0]].multi.toLowerCase(), addr[targetChains[0]].payloadHash, addr[targetChains[0]].payload)
                    .to.emit(addr[chain].gatewayContract, 'ContractCall')
                    .withArgs(addr[targetChains[1]].multi, chainNames[1], addr[targetChains[1]].multi.toLowerCase(), addr[targetChains[1]].payloadHash, addr[targetChains[1]].payload)
                    .to.emit(addr[chain].gatewayContract, 'ContractCall')
                    .withArgs(addr[targetChains[2]].multi, chainNames[2], addr[targetChains[2]].multi.toLowerCase(), addr[targetChains[2]].payloadHash, addr[targetChains[2]].payload);
            }

        // } // for j

    }); // it    

    it("should deploy contracts on the destination chain(s)", async function () {
        this.timeout(10000000);
        const sourceChain = addr[chain].name;
        const sourceAdress = addr[chain].multi;
        const newSalt = ethers.utils.solidityKeccak256(["bytes"],[abiCoder.encode(["address","bytes32"], [process.env.PUBLIC_KEY, salt])]);
        for (let j = 0; j < targetChains.length; j++) {
            var thisChain = targetChains[j];
            if (thisChain == chain) {
                // already deployed by inital txn
            } else {
                const payload = addr[thisChain].payload;
                const payloadHash = addr[thisChain].payloadHash;
                log("ready to deploy to " + thisChain);
                await expect(addr[thisChain].multiContract.connect(addr[thisChain].signer).execute(payloadHash, sourceChain, sourceAdress, payload))
                    .to.emit(addr[thisChain].multiContract, "Deployed")
                    .withArgs(ethers.utils.solidityKeccak256(["bytes"],[multiDeployerJSON.bytecode]), newSalt, addr[thisChain].deployedAddress);
            }
        } // for j
    });


});

after("Console Logs", function(){
    if (logOutput) {
        console.log(logs);
    }
});