import {getWeb3TokenTokenContract} from './ContractHelper';


export async function getBalanceOf(param = {}) {
    const token = getWeb3TokenTokenContract();

    const balance = await token.methods.balanceOf(param.userAddress).call();

    return balance;
}  