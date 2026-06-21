import { InjectedConnector } from '@web3-react/injected-connector'

// BSC Mainnet: 56, BSC Testnet: 97
// Ethereum Mainnet: 1, Ropsten: 3, Rinkeby: 4, Goerli: 5, Kovan: 42
export const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97]
})

