// hardhat deployment
const tokenAmount = 10000000;
const ethAmount = 1000000;

console.log('THIS DEPLOYMENT IS USELESS, the router\'s pair creation doesn\'t work properly. Use truffle instead.');

async function main() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const token = await ethers.getContractFactory('MyToken');
  var exp = ethers.BigNumber.from("10").pow(18);
  const supply = ethers.BigNumber.from("50").mul(exp);

  const weth = await ethers.getContractFactory('WETH');
  const wethInst = await weth.deploy();

  const factory = await ethers.getContractFactory('UniswapV2Factory');
  const factoryInst = await factory.deploy(deployer.address);

  const router = await ethers.getContractFactory('UniswapV2Router02');
  const routerInst = await router.deploy(factoryInst.address, wethInst.address);

  console.log('router deployed at ' + routerInst.address);

  const tokenInst = await token.deploy(supply, 'name2', 'symbol2');
  console.log("Token deployed to:" + tokenInst.address);

  await tokenInst.approve(routerInst.address, tokenAmount);

   await factoryInst.createPair(tokenInst.address, wethInst.address);
  const pairAddress = await factoryInst.allPairs(0);
    console.log('pair address', pairAddress); 

    // Fails due to library differences
  await routerInst.addLiquidityETH(tokenInst.address, tokenAmount, 1, 1, deployer.address, 9999999999, { value: ethAmount } );  
}
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});