const tokenAmount = 10000000;
const ethAmount = 1000;

async function main() {

  const token = await ethers.getContractFactory('MyToken');
  var exp = ethers.BigNumber.from("10").pow(18);
  const supply = ethers.BigNumber.from("50").mul(exp);

  const weth = await ethers.getContractFactory('WETH');
  const wethInst = await weth.deploy();

  const factory = await ethers.getContractFactory('UniswapV2Factory');
  const factoryInst = await factory.deploy(wethInst.address);

  const router = await ethers.getContractFactory('UniswapV2Router02');
  const routerInst = await router.deploy(factoryInst.address, wethInst.address);

  console.log('router deployed at ' + routerInst.address);

  const tokenInst = await token.deploy(supply, 'name2', 'symbol2');
  console.log("Token deployed to:" + tokenInst.address);

  await tokenInst.approve(routerInst.address, tokenAmount);

  await routerInst.addLiquidityETH(tokenInst.address, tokenAmount, 1, 1, tokenInst.address, 9999999999, { value: ethAmount } );  
}
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});