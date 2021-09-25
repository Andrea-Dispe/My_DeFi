import { getWeb3MasterChefContract, getWeb3PancakePairContract, fromWei } from './ContractHelper';
import { BLOCKS_PER_YEAR } from './Config';

export async function getYieldFarmAPR(param = {}) {
  const masterChef = getWeb3MasterChefContract(); //new web3.eth.Contract(MasterChefABI, getPancakeMasterChef());

  const cakePerBlock = await masterChef.methods.cakePerBlock().call();
  const totalAllocPoint = await masterChef.methods.totalAllocPoint().call();
  // Pid echange pool id
  const poolInfo = await masterChef.methods.poolInfo(param.pId).call();

  const poolCakeYear = BLOCKS_PER_YEAR.times(cakePerBlock * poolInfo.allocPoint).div(totalAllocPoint);
  // cake price from coingecko
  const emissionCakePerYear = poolCakeYear.times(param.cakePrice).div(10 ** 18)

  const lpToken = getWeb3PancakePairContract(poolInfo.lpToken); //new web3.eth.Contract(PancakePairABI, poolInfo.lpToken);
  const totalSupply = await lpToken.methods.totalSupply().call();
  //getRserves sum and $$$
  const tvl = param.tvl;

  const yieldFarmAPR = emissionCakePerYear.div(tvl);

  // const masterChef2 = new ethers.Contract(getPancakeMasterChef(), MasterChefABI, provider);
  return yieldFarmAPR.toNumber();
}

export async function getPancakeTradingFeesAPR(param = {}) {
  const volumeUSD = (param.volumeUSD7Day * 17) / 10000; // 7日dailyVolumeUSD求和,0.17% - Returned to Liquidity Pools in the form of a fee reward for liquidity providers

  const tradingFeesAPR = (volumeUSD / param.reserveUSD7Day) * 365;

  return tradingFeesAPR;
}

export async function tokensBegin(address) {
  const contract = await getWeb3PancakePairContract(address);
  const tokensValue = await contract.methods.getReserves().call();
  // const baseTokenBegin = tokensValue._reserve0
  // const farmingTokenBegin = tokensValue._reserve1
  // need result into ethers instead of wei?
  const baseTokenBegin = parseFloat(tokensValue._reserve0);
  const farmingTokenBegin = parseFloat(tokensValue._reserve1);

  return [baseTokenBegin, farmingTokenBegin];
}

export const _calculate_loss = (basetoken_total, leverage, basetoken_begin, farmingtoken_begin, tradefee) => {
  // Calculate the initial solution
  let assetsborrowed = (basetoken_total / leverage) * (leverage - 1);
  const basetoken_balance = basetoken_total - assetsborrowed;
  let exchange_value =
    (Math.sqrt(basetoken_begin * (basetoken_begin + assetsborrowed + basetoken_balance)) - basetoken_begin) / 0.998;
  let basetoken_end = basetoken_begin + exchange_value * (1 - tradefee);
  let farmingtoken_end = (basetoken_begin * farmingtoken_begin) / basetoken_end;
  let farmingtoken_num = farmingtoken_begin - farmingtoken_end;
  let price = farmingtoken_end / basetoken_end;
  let priceimpactandtradingfees =
    (exchange_value * tradefee + (exchange_value * (1 - tradefee) * exchange_value * (1 - tradefee)) / basetoken_begin) /
    basetoken_balance;
  let assetsborrowed_expect = basetoken_balance * (leverage - 1) * (1 - priceimpactandtradingfees / 100);
  let get_pair_2;

  while (assetsborrowed / assetsborrowed_expect < 0.999999999999 || assetsborrowed / assetsborrowed_expect > 1.0000000000001) {
    assetsborrowed = assetsborrowed_expect;
    exchange_value =
      (Math.sqrt(basetoken_begin * (basetoken_begin + assetsborrowed + basetoken_balance)) - basetoken_begin) / 0.998;
    basetoken_end = basetoken_begin + exchange_value * (1 - tradefee);
    farmingtoken_end = (basetoken_begin * farmingtoken_begin) / basetoken_end;
    farmingtoken_num = farmingtoken_begin - farmingtoken_end;
    get_pair_2 = farmingtoken_num / (farmingtoken_end + farmingtoken_num);
    price = farmingtoken_end / basetoken_end;
    priceimpactandtradingfees =
      (exchange_value * tradefee + (exchange_value * (1 - tradefee) * exchange_value * (1 - tradefee)) / basetoken_end) /
      basetoken_total;
    assetsborrowed_expect = basetoken_balance * (leverage - 1) * (1 - priceimpactandtradingfees / 100);
  }
  return [
    assetsborrowed,
    priceimpactandtradingfees,
    price,
    get_pair_2,
    basetoken_end,
    farmingtoken_end,
    farmingtoken_num,
    exchange_value,
  ];
};

export const getFarmingData = (
  leverage,
  basetoken_balance,
  farmingtoken_balance,
  basetoken_begin,
  farmingtoken_begin,
  tradefee = 0.0025
) => {
  const price_now = farmingtoken_begin / basetoken_begin;
  if (
    basetoken_balance + (basetoken_balance + farmingtoken_balance / price_now) * (leverage - 1) * 0.997 >=
    farmingtoken_balance / price_now
  ) {
    const totolvalue_balance = basetoken_balance + farmingtoken_balance / price_now;
    const basetoken_total =
      basetoken_balance +
      (basetoken_balance + farmingtoken_balance / price_now) * (leverage - 1) * 0.997 -
      farmingtoken_balance / price_now;
    const basetoken_begin_total = basetoken_begin + farmingtoken_balance / price_now;
    const farmingtoken_begin_total = farmingtoken_begin + farmingtoken_balance; //overall investment farmingbalance
    const get_pair_1 = farmingtoken_balance / farmingtoken_begin_total;
    const dataloss = _calculate_loss(basetoken_total, leverage, basetoken_begin_total, farmingtoken_begin_total, tradefee);
    // calculate datadataloss
    const basetoken_end = dataloss[4];
    const farmingtoken_end = dataloss[5];
    const farmingtoken_num = dataloss[6];
    const exchangevalue = dataloss[7];
    const totalpriceimpactandtradingfees = (basetoken_total / totolvalue_balance) * dataloss[1]; // Overall loss
    const totalborrowed =
      (farmingtoken_balance / price_now + basetoken_balance) * (leverage - 1) * (1 - totalpriceimpactandtradingfees / 100); // Calculation according to the previous price
    // get_pair_2 = dataloss[3]
    // Final proportion
    const basetoken_get = basetoken_end * get_pair_1 + basetoken_total - exchangevalue;
    const farmingtoken_get = farmingtoken_end * get_pair_1 + farmingtoken_num;
    return [totalpriceimpactandtradingfees, totalborrowed, basetoken_get, farmingtoken_get];
  }

  //basetoken is not enough for farming conversion
  if (
    basetoken_balance + (basetoken_balance + farmingtoken_balance / price_now) * (leverage - 1) * 0.997 <
    farmingtoken_balance / price_now
  ) {
    const totolvalue_balance = basetoken_balance + farmingtoken_balance / price_now; //Converted to basetoken
    const farmingtoken_total =
      farmingtoken_balance -
      (basetoken_balance * price_now + (basetoken_balance * price_now + farmingtoken_balance) * (leverage - 1) * 0.997); //Additional investable amount
    let basetoken_begin_total =
      basetoken_begin + (basetoken_balance + (basetoken_balance + farmingtoken_balance / price_now) * (leverage - 1) * 0.997);
    const farmingtoken_begin_total =
      farmingtoken_begin +
      (basetoken_balance + (basetoken_balance + farmingtoken_balance / price_now) * (leverage - 1) * 0.997) * price_now; //overall investment farmingbalance
    //print(farmingtoken_begin)
    const get_pair_1 =
      (basetoken_balance + (basetoken_balance + farmingtoken_balance / price_now) * (leverage - 1) * 0.997) / basetoken_begin;
    const dataloss = _calculate_loss(farmingtoken_total, leverage, farmingtoken_begin_total, basetoken_begin_total, tradefee);
    const basetoken_end = dataloss[5];
    const farmingtoken_end = dataloss[4];
    const basetoken_num = dataloss[6];
    const exchangevalue = dataloss[7]; //farmingtokenexchangevalue
    const totalpriceimpactandtradingfees = (farmingtoken_total * dataloss[1]) / (totolvalue_balance * price_now);
    const totalborrowed =
      (farmingtoken_balance / price_now + basetoken_balance) * (leverage - 1) * (1 - totalpriceimpactandtradingfees / 100);
    //get_pair_2 = dataloss[3]
    // Final proportion
    const basetoken_get = basetoken_end * get_pair_1 + basetoken_num;
    const farmingtoken_get = farmingtoken_end * get_pair_1 + farmingtoken_total - exchangevalue;
    return [totalpriceimpactandtradingfees, totalborrowed, basetoken_get, farmingtoken_get];
  }
};
// type_of_borrow is bool
export async function calculate_loss_and_fee_and_pair_standard(
  leverage,
  token0,
  token1,
  token0_pool,
  token1_pool,
  type_of_borrow,
  tradefee = 0.0025
) {
  // return [totalpriceimpactandtradingfees, the token totalborrowed, token0_get, token1_get]
  token0 = token0 * 10 ** 18;
  token1 = token1 * 10 ** 18;
  let data;
  let temp;

  if (type_of_borrow) {
    data = await getFarmingData(leverage, token1, token0, token1_pool, token0_pool, tradefee);
    if (data) {
      data[1] = data[1] / 10 ** 18;
      data[2] = data[2] / 10 ** 18;
      data[3] = data[3] / 10 ** 18;
      temp = data[2];
      data[2] = data[3];
      data[3] = temp;
      return data;
    }
  }

  if (type_of_borrow === false) {
    data = await getFarmingData(leverage, token0, token1, token0_pool, token1_pool, tradefee);
    if (data) {
      data[1] = data[1] / 10 ** 18;
      data[2] = data[2] / 10 ** 18;
      data[3] = data[3] / 10 ** 18;

      return data;
    }
  }
}
