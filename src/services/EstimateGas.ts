import { ethers, Contract } from 'ethers'

interface EstimateGasParams {
  contract: Contract
  methodName: string
  methodArgs: any[]
  gasMarginPer10000: number
}

export const estimateGas = async ({
  contract,
  methodName,
  methodArgs,
  gasMarginPer10000,
}: EstimateGasParams): Promise<ethers.BigNumber> => {
  if (!contract[methodName]) {
    throw new Error(`Method ${methodName} doesn't exist on ${contract.address}`)
  }
  const rawGasEstimation = await contract.estimateGas[methodName](...methodArgs)
  // By convention, ethers.BigNumber values are multiplied by 1000 to avoid dealing with real numbers
  const gasEstimation = rawGasEstimation
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(gasMarginPer10000)))
    .div(ethers.BigNumber.from(10000))
  return gasEstimation
}

interface CallWithEstimateGasParams {
  contract: Contract
  methodName: string
  methodArgs?: any[]
  gasMarginPer10000?: number
}

export const callWithEstimateGas = async ({
  contract,
  methodName,
  methodArgs = [],
  gasMarginPer10000 = 1000,
}: CallWithEstimateGasParams): Promise<ethers.providers.TransactionResponse> => {
  const gasEstimation = await estimateGas({
    contract,
    methodName,
    methodArgs,
    gasMarginPer10000,
  })
  const tx = await contract[methodName](...methodArgs, {
    gasLimit: gasEstimation,
  })
  return tx
}
