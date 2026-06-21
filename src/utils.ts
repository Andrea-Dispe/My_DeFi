import Web3 from 'web3';
import getDomain from './services/Env';

const web3 = new Web3(getDomain());

const COINGECKO_ID_MAP: Record<string, string> = {
  cake:   'pancakeswap-token',
  btcb:   'binance-bitcoin',
  eth:    'ethereum',
  dot:    'polkadot',
  bnb:    'binancecoin',
  alpaca: 'alpaca-finance',
  usdt:   'tether',
  busd:   'binance-usd',
  beth:   'binance-eth',
  xvs:    'venus',
  link:   'chainlink',
  yfi:    'yearn-finance',
  usdc:   'usd-coin',
  ust:    'wrapped-ust',
  comp:   'compound-governance-token',
  itam:   'itam-games',
  bmxx:   'multiplier-bsc',
  bor:    'boringdao-[old]',
  bry:    'berry-data',
  uni:    'uniswap',
};

function toCoingeckoId(symbol: string): string {
  return COINGECKO_ID_MAP[symbol] ?? symbol;
}

export const fetchTokenPrice = async (
  tokenZeroSymbol: string,
  tokenOneSymbol: string
): Promise<[{ usd: number }, { usd: number }]> => {
  const idZero = toCoingeckoId(tokenZeroSymbol);
  const idOne  = toCoingeckoId(tokenOneSymbol);

  // TODO: urls in env
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(idZero)}%2C${encodeURIComponent(idOne)}&vs_currencies=usd`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko price fetch failed: ${res.status}`);
  const data = await res.json();
  return [data[idZero] ?? { usd: 0 }, data[idOne] ?? { usd: 0 }];
};

export const fetchCakePrice = async (): Promise<number> => {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=pancakeswap-token&vs_currencies=usd';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko CAKE price fetch failed: ${res.status}`);
  const data = await res.json();
  return data['pancakeswap-token'].usd as number;
};

export const truncateAddress = (account: string | { toString(): string }, left = 4, right = 4): string => {
  const str = typeof account === 'string' ? account : account.toString();
  return str.slice(0, left).concat('...', str.slice(-right));
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy'); // last-resort fallback
    document.body.removeChild(textarea);
  }
};

export const splitPairs = (pair: string): string[] => pair.toLowerCase().split('-');

export const renderPairsAvatars = (pair: string, n: number, Icons: Record<string, string>): string => {
  const [pair1, pair2] = splitPairs(pair);
  return n === 1 ? Icons[pair1] : Icons[pair2];
};

export const formatBigNumber = (value: string | number | bigint): string => {
  return parseInt(web3.utils.fromWei(BigInt(value).toString(), 'ether')).toLocaleString('en-US');
};

export const formatPercentage = (value: number): string => {
  return value.toLocaleString('en', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const sumLendingPoolData = (
  url: string,
  lendingData: any[],
  loading: boolean,
  lendingPoolData: any[],
  data: string
): string | undefined => {
  if (!url.includes('stake') && lendingData.length && loading === false) {
    return lendingPoolData
      .map((pool) => parseFloat(formatBigNumber(pool[data]).replace(/,/g, '')))
      .reduce((cur, acc) => cur + acc)
      .toLocaleString();
  }
  return undefined;
};
