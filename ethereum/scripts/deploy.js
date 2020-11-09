require("@nomiclabs/hardhat-ethers");

async function main() {
    const token = await ethers.getContractFactory('MyToken');
    var exp = ethers.BigNumber.from("10").pow(18);
    const supply = ethers.BigNumber.from("50").mul(exp);
    const inst = await token.deploy(supply, 'name', 'symbol');

    console.log("Token deployed to:" + inst.address);
  }
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});