import { ethers } from 'ethers';
import Web3 from 'web3';
import getDomain from './Env';
import { getFairLaunch, getToken, getPancakeMasterChef } from './Env';
import FairLaunchABI from '../artifacts/contracts/FairLaunch.sol/FairLaunch.json';
import TokenAbi from '../artifacts/contracts/Token.sol/Token.json';
import MasterChefABI from '../artifacts/contracts/PancakeSwap.sol/PancakeMasterChef.json';
import PancakePairABI from '../artifacts/contracts/PancakeSwap.sol/PancakePair.json';
import VaultABI from '../artifacts/contracts/Vault.sol/Vault.json';

// Minimal ERC-20 ABI — only balanceOf is needed for wallet balance queries.
const minABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

const web3 = new Web3(getDomain());
const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getDomain());

// Security: getProvider() is intentionally lazy — it only accesses window.ethereum
// when a user-initiated action requires a signer. This avoids crashing when the
// app loads in an environment without MetaMask.
const getProvider = (): ethers.providers.Web3Provider => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it to proceed.');
  }
  return new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
};

export const fromWei = (amount: string): string => {
  return web3.utils.fromWei(amount, 'ether');
};

export const getWalletBnbBalance = async (address: string): Promise<string> => {
  const rawBalance = await web3.eth.getBalance(address);
  return parseFloat(web3.utils.fromWei(rawBalance, 'ether')).toFixed(8);
};

export const getWalletTokenBalance = async (
  walletAddress: string,
  tokenAddress: string
): Promise<string> => {
  const contract = new web3.eth.Contract(minABI as any, tokenAddress);
  const rawBalance: string = await contract.methods.balanceOf(walletAddress).call();
  return parseFloat(web3.utils.fromWei(rawBalance, 'ether')).toFixed(8);
};

const getContract = (abi: any, address: string, signer?: ethers.Signer): ethers.Contract => {
  return new ethers.Contract(address, abi, signer ?? simpleRpcProvider);
};

export const getFairLaunchContract = (): ethers.Contract => {
  return getContract(FairLaunchABI, getFairLaunch(), getProvider().getSigner());
};

export const getWeb3FairLaunchContract = () => {
  return new web3.eth.Contract(FairLaunchABI as any, getFairLaunch());
};

export const getTokenContract = (): ethers.Contract => {
  return getContract(TokenAbi, getToken(), getProvider().getSigner());
};

// Bug fix: was previously named getWeb3TokenTokenContract (double "Token")
export const getWeb3TokenContract = () => {
  return new web3.eth.Contract(TokenAbi as any, getToken());
};

export const getMasterChefContract = (): ethers.Contract => {
  return getContract(MasterChefABI, getPancakeMasterChef(), getProvider().getSigner());
};

export const getWeb3MasterChefContract = () => {
  return new web3.eth.Contract(MasterChefABI as any, getPancakeMasterChef());
};

export const getPancakePairContract = (address: string): ethers.Contract => {
  return getContract(PancakePairABI, address, getProvider().getSigner());
};

export const getWeb3PancakePairContract = (address: string) => {
  return new web3.eth.Contract(PancakePairABI as any, address);
};

export const getVaultContract = (address: string): ethers.Contract => {
  return getContract(VaultABI, address, getProvider().getSigner());
};

export const getWeb3VaultContract = (address: string) => {
  return new web3.eth.Contract(VaultABI as any, address);
};
