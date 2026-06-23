import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { getVaultContract, getWeb3VaultContract } from './ContractHelper';
import { BLOCKS_PER_YEAR, DEFAULT_TOKEN_DECIMAL } from './Config';
import { getFairLaunch, getDomain } from './Env';
import { callWithEstimateGas } from './EstimateGas';

// Interest rate model constants (piecewise linear)
// - utilization < 50 %:  rate = 0.4 * utilization
// - utilization 50-90 %: rate = 0.2 (flat � mathematics2 contribution is 0, intercept 0.2)
// - utilization > 90 %:  rate = 13 * utilization - 11.5
const mathematics1 = 0.4;
const mathematics2 = 0;
const mathematics3 = 13;

interface VaultParam {
  address?: string;
  vaultAddress?: string;
  name?: string;
  token?: number;
  tokenPrice?: number;
  baseTokenPrice?: number;
}

interface FarmParam {
  farmingTokenAmount?: string;
  minLPAmount?: string;
  address?: string;
  minFarmingToken?: string;
}

export async function getBalanceOf(param: VaultParam = {}): Promise<string> {
  const vault = getWeb3VaultContract(param.address!);
  return vault.methods.balanceOf(param.address).call();
}

export async function getLandRate(param: VaultParam = {}): Promise<number> {
  const vault = getWeb3VaultContract(param.vaultAddress!);

  const totalToken = parseInt(await vault.methods.totalToken().call());
  const vaultDebtVal = parseInt(await vault.methods.vaultDebtVal().call());
  const utilization = totalToken > 0 ? vaultDebtVal / totalToken : 0;

  if (utilization < 0.5) return mathematics1 * utilization;
  if (utilization > 0.9) return mathematics3 * utilization - 11.5;
  return mathematics2 * utilization + 0.2;
}

export async function getPoolInfo(param: VaultParam = {}): Promise<Record<string, any>> {
  const vault = getWeb3VaultContract(param.address!);

  const name: string = await vault.methods.name().call();
  const symbol: string = await vault.methods.symbol().call();
  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());
  const vaultDebtVal = parseInt(await vault.methods.vaultDebtVal().call());
  const utilization = totalToken > 0 ? vaultDebtVal / totalToken : 0;

  let landRate = 0;
  if (utilization < 0.5) {
    landRate = mathematics1 * utilization;
  } else if (utilization > 0.9) {
    landRate = mathematics3 * utilization - 11.5;
  } else {
    landRate = mathematics2 * utilization + 0.2;
  }

  const landApr = landRate * 0.9 * utilization;
  const stakeApr = BLOCKS_PER_YEAR.times((param.token ?? 0) * (param.tokenPrice ?? 0)).div(
    ((param.baseTokenPrice ?? 1) * totalToken * totalToken) / totalSupply
  );
  const totalApr = landApr + stakeApr.toNumber();

  return {
    name,
    symbol,
    totalBorrowed: vaultDebtVal,
    totalDeposit: totalToken,
    capitalUtilizationRate: utilization,
    landApr,
    stakeApr: stakeApr.toNumber(),
    totalApr,
    apy: Math.pow(1 + parseFloat(String(totalApr)) / 365, 365) - 1,
    exchangeRate: totalToken / totalSupply,
  };
}

export async function getStakeApr(param: VaultParam = {}): Promise<number> {
  const vault = getWeb3VaultContract(param.address!);

  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());

  const stakeApr = BLOCKS_PER_YEAR.times((param.token ?? 0) * (param.tokenPrice ?? 0)).div(
    ((param.baseTokenPrice ?? 1) * totalToken * totalToken) / totalSupply
  );

  return stakeApr.toNumber();
}

export async function getStakeValue(param: VaultParam = {}): Promise<number> {
  const vault = getWeb3VaultContract(param.address!);

  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());
  const balance: string = await vault.methods.balanceOf(getFairLaunch()).call();

  return (Number(balance) * 100 * totalToken) / totalSupply;
}

export const deposit = async (address: string, amount: string): Promise<boolean> => {
  const vault = getVaultContract(address);
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  const tx = await callWithEstimateGas({
    contract: vault,
    methodName: 'deposit',
    methodArgs: [value],
  });
  const receipt = await tx.wait();
  return receipt.status;
};

export const withdraw = async (address: string, amount: string): Promise<boolean> => {
  const vault = getVaultContract(address);
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  const tx = await callWithEstimateGas({
    contract: vault,
    methodName: 'withdraw',
    methodArgs: [value],
  });
  const receipt = await tx.wait();
  return receipt.status;
};

export const farm = async (
  address: string,
  pid: number,
  worker: string,
  amount: string,
  loan: string,
  maxReturn: string,
  param: FarmParam = {}
): Promise<boolean> => {
  const vault = getVaultContract(address);
  const abiCoder = new ethers.utils.AbiCoder();
  const dataStrategy = abiCoder.encode(
    ['uint256', 'uint256'],
    [param.farmingTokenAmount, param.minLPAmount]
  );
  const dataWorker = abiCoder.encode(['address', 'bytes'], [param.address, dataStrategy]);
  const tx = await callWithEstimateGas({
    contract: vault,
    methodName: 'work',
    methodArgs: [pid, worker, amount, loan, maxReturn, dataWorker],
  });
  const receipt = await tx.wait();
  return receipt.status;
};

export const unfarm = async (
  address: string,
  pid: number,
  worker: string,
  amount: string,
  loan: string,
  maxReturn: string,
  param: FarmParam = {}
): Promise<boolean> => {
  const vault = getVaultContract(address);
  const abiCoder = new ethers.utils.AbiCoder();
  const dataStrategy = abiCoder.encode(['uint256'], [param.minFarmingToken]);
  const dataWorker = abiCoder.encode(['address', 'bytes'], [param.address, dataStrategy]);
  const tx = await callWithEstimateGas({
    contract: vault,
    methodName: 'work',
    methodArgs: [pid, worker, amount, loan, maxReturn, dataWorker],
  });
  const receipt = await tx.wait();
  return receipt.status;
};
