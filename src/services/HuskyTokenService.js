import {getWeb3HuskyTokenContract} from './ContractHelper';


export async function getBalanceOf(param = {}) {
    const husky = getWeb3HuskyTokenContract();

    const balance = await husky.methods.balanceOf(param.userAddress).call();

    return balance;
}