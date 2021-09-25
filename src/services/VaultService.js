import { ethers } from 'ethers';
import BigNumber from 'bignumber.js/bignumber';
import { getVaultContract, getWeb3VaultContract } from './ContractHelper';
import { BLOCKS_PER_YEAR, DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from './Config';
import { getFairLaunch } from './Env';

const mathematics1 = 0.4; // Less than 50% utilization
const mathematics2 = 0; // Between 50% and 90%
const mathematics3 = 13; // Between 90% and 100%


// testing data dependencies
import getDomain from './Env';
import Web3 from 'web3';
const web3 = new Web3(getDomain());



export async function getBalanceOf(param = {}) {
  const vault = getWeb3VaultContract(param.address); //new web3.eth.Contract(VaultABI, param.address);

  const balance = await vault.methods.balanceOf(param.userAddress).call();

  return balance;
}

export async function getLandRate(param = {}) {
  const vault = getWeb3VaultContract(param.vaultAddress); //new web3.eth.Contract(VaultABI, param.address);

  const totalToken = parseInt(await vault.methods.totalToken().call());
  const vaultDebtVal = parseInt(await vault.methods.vaultDebtVal().call());
  const utilization = totalToken > 0 ? vaultDebtVal / totalToken : 0;

  let landRate = 0;
  // Interest=m∗utilization+b
  if (utilization < 0.5) {
    landRate = mathematics1 * utilization;
  } else if (utilization > 0.9) {
    landRate = mathematics3 * utilization - 11.5;
  } else {
    landRate = mathematics2 * utilization + 0.2;
  }

  return landRate;
}

export async function getPoolInfo(param = {}) {
  const vault = getWeb3VaultContract(param.address); //new web3.eth.Contract(VaultABI, param.address);

  const name = await vault.methods.name().call();
  const symbol = await vault.methods.symbol().call();
  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());
  const vaultDebtShare = parseInt(await vault.methods.vaultDebtShare().call());
  const vaultDebtVal = parseInt(await vault.methods.vaultDebtVal().call());
  const utilization = totalToken > 0 ? vaultDebtVal / totalToken : 0;

  let landRate = 0;
  // Interest=m∗utilization+b
  if (utilization < 0.5) {
    landRate = mathematics1 * utilization;
  } else if (utilization > 0.9) {
    landRate = mathematics3 * utilization - 11.5;
  } else {
    landRate = mathematics2 * utilization + 0.2;
  }
  let landApr = landRate * 0.9 * utilization;
  let stakeApr = BLOCKS_PER_YEAR.times(param.token * param.tokenPrice).div(
    (param.baseTokenPrice * totalToken * totalToken) / totalSupply
  );
  let totalApr = landApr + stakeApr;
  let data = {
    name: name,
    symbol: symbol,
    totalBorrowed: vaultDebtVal,
    totalDeposit: totalToken,
    capitalUtilizationRate: utilization,
    landApr: landApr,
    stakeApr: stakeApr.toNumber(),
    totalApr: totalApr,
    apy: Math.pow(1 + totalApr / 365, 365) - 1,
    exchangeRate: totalToken / totalSupply,
  };

  // console.log('totalDeposit: ', parseInt(web3.utils.fromWei(BigInt(data.totalBorrowed).toString())).toLocaleString({
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2
  // }));

  return data;
}

export async function getStakeApr(param = {}) {
  const vault = getWeb3VaultContract(param.address); //new web3.eth.Contract(VaultABI, param.address);

  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());

  let stakeApr = BLOCKS_PER_YEAR.times(param.token * param.tokenPrice).div(
    (param.baseTokenPrice * totalToken * totalToken) / totalSupply
  );
  // console.log('getStakeApr: ' + stakeApr.toNumber());

  return stakeApr.toNumber();
}

export async function getStakeValue(param = {}) {
  const vault = getWeb3VaultContract(param.address); //new web3.eth.Contract(VaultABI, param.address);
  const name = await vault.methods.name().call();

  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());
  const balance = await vault.methods.balanceOf(getFairLaunch()).call();

  // let stakeValue = (balance * param.baseTokenPrice * totalToken) / totalSupply;
  let stakeValue = (balance * 100 * totalToken) / totalSupply;

  return stakeValue;
}

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
};

export const deposit = async (address, amount) => {
  const vault = getVaultContract(address);
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();

  const tx = await vault.deposit(value, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const withdraw = async (address, amount) => {
  const vault = getVaultContract(address);
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();

  const tx = await vault.withdraw(value, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const farm = async (address, pid, worker, amount, loan, maxReturn, param = {}) => {
  const vault = getVaultContract(address);
  const abiCoder = new ethers.utils.AbiCoder();
  const dataStrategy = abiCoder.encode(['uint256', 'uint256'], [param.farmingTokenAmount, param.minLPAmount]);
  const dataWorker = abiCoder.encode(['address', 'bytes'], [param.address, dataStrategy]);

  const tx = await vault.work(pid, worker, amount, loan, maxReturn, dataWorker, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const unfarm = async (address, pid, worker, amount, loan, maxReturn, param = {}) => {
  const vault = getVaultContract(address);
  const abiCoder = new ethers.utils.AbiCoder();
  const dataStrategy = abiCoder.encode(['uint256'], [param.minFarmingToken]);
  const dataWorker = abiCoder.encode(['address', 'bytes'], [param.address, dataStrategy]);

  const tx = await vault.work(pid, worker, amount, loan, maxReturn, dataWorker, options);
  const receipt = await tx.wait();
  return receipt.status;
};
