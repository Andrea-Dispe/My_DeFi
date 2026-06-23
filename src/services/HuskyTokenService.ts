import { getWeb3TokenContract } from './ContractHelper';

interface TokenParam {
  userAddress: string;
}

export async function getBalanceOf(param: TokenParam): Promise<string> {
  const token = getWeb3TokenContract();
  return token.methods.balanceOf(param.userAddress).call();
}