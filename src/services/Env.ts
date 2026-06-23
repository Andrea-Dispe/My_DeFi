
import mainnet from '../mainnet.json';
import testnet from '../testnet.json';

type Env = 'dev' | 'test' | 'prod';

const DevRPC = 'http://localhost:8545';
const TestRPC = 'https://data-seed-prebsc-1-s3.binance.org:8545';
const DefaultRPC = 'https://bsc-dataseed.binance.org/';

function getEnv(): Env {
  return (process.env.REACT_APP_ENV as Env) ?? 'prod';
}

export function getFairLaunch(): string {
    const env = getEnv();
    switch (env) {
        case 'dev':   return '';
        case 'test':  return (testnet as any).FairLaunch.address;
        default:      return (mainnet as any).FairLaunch.address;
    }
}

export function getToken(): string {
    const env = getEnv();
    switch (env) {
        case 'dev':   return '';
        case 'test':  return (testnet as any).Tokens.ALPACA;
        default:      return (mainnet as any).Tokens.ALPACA;
    }
}

export function getPancakeMasterChef(): string {
    const env = getEnv();
    switch (env) {
        case 'dev':   return '';
        case 'test':  return (testnet as any).Exchanges.Pancakeswap.MasterChef;
        default:      return (mainnet as any).Exchanges.Pancakeswap.MasterChef;
    }
}

export function getDomain(): string {
    const env = getEnv();
    switch (env) {
        case 'dev':   return DevRPC;
        case 'test':  return TestRPC;
        default:      return DefaultRPC;
    }
}

export default getDomain;
