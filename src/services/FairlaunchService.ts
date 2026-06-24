import BigNumber from 'bignumber.js';
import { getFairLaunchContract, getWeb3FairLaunchContract } from './ContractHelper';
import { DEFAULT_TOKEN_DECIMAL } from './Config';
import { callWithEstimateGas } from './EstimateGas';

interface PoolParam {
  pId?: number;
  id?: number;
}

export async function getPoolTokenPerBlock(param: PoolParam = {}): Promise<number> {
    const fairLaunch = getWeb3FairLaunchContract();
    const alpacaPerBlock: string = await fairLaunch.methods.alpacaPerBlock().call() as string;
    const totalAllocPoint: string = await fairLaunch.methods.totalAllocPoint().call() as string;
    const poolInfo: any = await fairLaunch.methods.poolInfo(param.pId).call();
    return Number(alpacaPerBlock) * poolInfo.allocPoint / Number(totalAllocPoint);
}

export async function getPoolTokenDaily(param: PoolParam = {}): Promise<number> {
    const fairLaunch = getWeb3FairLaunchContract();
    const alpacaPerBlock2: string = await fairLaunch.methods.alpacaPerBlock().call() as string;
    const totalAllocPoint2: string = await fairLaunch.methods.totalAllocPoint().call() as string;
    const poolInfo2: any = await fairLaunch.methods.poolInfo(param.id).call();
    // BSC produces a block every ~3 seconds → 28 800 blocks/day
    const blocksPerDay = (24 * 60 * 60) / 3;
    return Number(alpacaPerBlock2) * poolInfo2.allocPoint * blocksPerDay / Number(totalAllocPoint2);
}

export const stakeFarm = async (address: string, pid: number, amount: string): Promise<boolean> => {
    const fairLaunch = getFairLaunchContract();
    const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
    const tx = await callWithEstimateGas({
      contract: fairLaunch,
      methodName: 'deposit',
      methodArgs: [address, pid, value],
    });
    const receipt = await tx.wait();
    return receipt.status === 1;
};

export const unstakeFarm = async (address: string, pid: number, amount: string): Promise<boolean> => {
    const fairLaunch = getFairLaunchContract();
    const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
    const tx = await callWithEstimateGas({
      contract: fairLaunch,
      methodName: 'withdraw',
      methodArgs: [address, pid, value],
    });
    const receipt = await tx.wait();
    return receipt.status === 1;
};

export const harvestFarm = async (pid: number): Promise<boolean> => {
    const fairLaunch = getFairLaunchContract();
    const tx = await callWithEstimateGas({
      contract: fairLaunch,
      methodName: 'harvest',
      methodArgs: [pid],
    });
    const receipt = await tx.wait();
    return receipt.status === 1;
};
