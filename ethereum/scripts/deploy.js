require("@nomiclabs/hardhat-ethers");

const tokenAmount = 10000000;
const ethAmount = 1000;

const isLocal = true;

async function main() {

  const [deployer] = await ethers.getSigners();
  if (isLocal) {
    const weth = await ethers.getContractFactory('WETH');
    const wethInst = await weth.deploy();

    const factory = await ethers.getContractFactory('UniswapV2Factory02Mock');
    const factoryInst = await factory.deploy(wethInst.address);

    const router = await ethers.getContractFactory('UniswapV2RouterMock');
    const routerInst = await router.deploy(factoryInst.address, wethInst.address);

    console.log('router deployed at ' + routerInst.address)
  }

     const token = await ethers.getContractFactory('MyToken');
 /*   var exp = ethers.BigNumber.from("10").pow(18);
    const supply = ethers.BigNumber.from("50").mul(exp);
    const tokenInst = await token.deploy(supply, 'name2', 'symbol2');

    console.log("Token deployed to:" + tokenInst.address); */

    //const tokenInst = await token.attach('0x0306bAc141b07ab9DD8CBAbFc0d8AAA995821Ae2');

    
    const routerAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const routerInst = await router.attach(routerAddr);

    //await tokenInst.approve(routerInst.address, tokenAmount);
  console.log('approved');


/*   const tx = deployer.sendTransaction({
    to: routerInst.address,
    value: ethAmount,//ethers.utils.parseEther("1.0")
    data: 
}); */

  await routerInst.ethAmount(ethAmount).addLiquidityETH(tokenInst.address, tokenAmount, 1, 1, token.address, 9999999999 );
  }
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});