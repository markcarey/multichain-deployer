const multiDeployerJSON = require("../artifacts/contracts/MultiChainDeployer.sol/MultiChainDeployer.json");
const multiDeployerAddress = '0xC994ADdbd399F44Be1F0371C717DEcAaA8f0d917'; // goerli
const destinationAddress = '0xc29B914b347d23FFb62e7B24E965D555FCeDF630'; // mumbai

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

const v = "four";
const salt = ethers.utils.formatBytes32String(v);

async function main() {

    const factory = new ethers.Contract(multiDeployerAddress, multiDeployerJSON.abi, signer);
    const result = await factory.deploy(multiDeployerJSON.bytecode, salt, ["Polygon"], [destinationAddress]);
    console.log(result);
    await result.wait();

}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });