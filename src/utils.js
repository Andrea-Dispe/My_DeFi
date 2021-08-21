import Web3 from 'web3';
import getDomain from './services/Env';
const web3 = new Web3(getDomain());

// this function is in test. Now working on moving the data to the farm page
export const fetchTokenPrice = async (tokenZeroSymbol, tokenOneSymbol) => {
  //these below conditions are temporary and will need to be fixed as coingecko wants to be fed
  // only with their token id and not with the token symbol. Sometime token Id in coingecko is
  // different from the token symbol.
  //I wrote a script to get the token list from coingecko and store it into json in data folder.
  // TODO: use the json data to filter token by symbols and get the id to be fed into the price api



  // THIS SHIT IS JUST TEMPORARY!!!!!
  if (tokenZeroSymbol === 'cake') {
    tokenZeroSymbol = 'pancakeswap-token';
  } else if (tokenZeroSymbol === 'btcb') {
    tokenZeroSymbol = 'binance-bitcoin';
  } else if (tokenZeroSymbol === 'eth') {
    tokenZeroSymbol = 'ethereum';
  } else if (tokenZeroSymbol === 'dot') {
    tokenZeroSymbol = 'polkadot';
  } else if (tokenZeroSymbol === 'bnb') {
    tokenZeroSymbol = 'binancecoin';
  } else if (tokenZeroSymbol === 'alpaca') {
    tokenZeroSymbol = 'alpaca-finance';
  } else if (tokenZeroSymbol === 'usdt') {
    tokenZeroSymbol = 'tether';
  } else if (tokenZeroSymbol === 'busd') {
    tokenZeroSymbol = 'binance-usd';
  } else if (tokenZeroSymbol === 'beth') {
    tokenZeroSymbol = 'binance-eth';
  } else if (tokenZeroSymbol === 'xvs') {
    tokenZeroSymbol = 'venus';
  } else if (tokenZeroSymbol === 'link') {
    tokenZeroSymbol = 'chainlink';
  } else if (tokenZeroSymbol === 'yfi') {
    tokenZeroSymbol = 'yearn-finance';
  } else if (tokenZeroSymbol === 'usdc') {
    tokenZeroSymbol = 'usd-coin';
  } else if (tokenZeroSymbol === 'ust') {
    tokenZeroSymbol = 'wrapped-ust';
  } else if (tokenZeroSymbol === 'comp') {
    tokenZeroSymbol = 'compound-coin';
  } else if (tokenZeroSymbol === 'itam') {
    tokenZeroSymbol = 'itam-games';
  } else if (tokenZeroSymbol === 'bmxx') {
    tokenZeroSymbol = 'multiplier-bsc';
  } else if (tokenZeroSymbol === 'bor') {
    tokenZeroSymbol = 'boringdao-[old]';
  } else if (tokenZeroSymbol === 'bry') {
    tokenZeroSymbol = 'berry-data';
  } else if (tokenZeroSymbol === 'uni') {
    tokenZeroSymbol = 'uniswap';
  } else if (tokenZeroSymbol === 'comp') {
    tokenZeroSymbol = 'compound-governance-token';
  }

  if (tokenOneSymbol === 'cake') {
    tokenOneSymbol = 'pancakeswap-token';
  } else if (tokenOneSymbol === 'btcb') {
    tokenOneSymbol = 'binance-bitcoin';
  } else if (tokenOneSymbol === 'eth') {
    tokenOneSymbol = 'ethereum';
  } else if (tokenOneSymbol === 'dot') {
    tokenOneSymbol = 'polkadot';
  } else if (tokenOneSymbol === 'bnb') {
    tokenOneSymbol = 'binancecoin';
  } else if (tokenOneSymbol === 'alpaca') {
    tokenOneSymbol = 'alpaca-finance';
  } else if (tokenOneSymbol === 'usdt') {
    tokenOneSymbol = 'tether';
  } else if (tokenOneSymbol === 'busd') {
    tokenOneSymbol = 'binance-usd';
  } else if (tokenOneSymbol === 'beth') {
    tokenOneSymbol = 'binance-eth';
  } else if (tokenOneSymbol === 'xvs') {
    tokenOneSymbol = 'venus';
  } else if (tokenOneSymbol === 'link') {
    tokenOneSymbol = 'chainlink';
  } else if (tokenOneSymbol === 'yfi') {
    tokenOneSymbol = 'yearn-finance';
  } else if (tokenOneSymbol === 'usdc') {
    tokenOneSymbol = 'usd-coin';
  } else if (tokenOneSymbol === 'ust') {
    tokenOneSymbol = 'wrapped-ust';
  } else if (tokenOneSymbol === 'comp') {
    tokenOneSymbol = 'compound-coin';
  } else if (tokenOneSymbol === 'itam') {
    tokenOneSymbol = 'itam-games';
  } else if (tokenOneSymbol === 'bmxx') {
    tokenOneSymbol = 'multiplier-bsc';
  } else if (tokenOneSymbol === 'bor') {
    tokenOneSymbol = 'boringdao-[old]';
  } else if (tokenOneSymbol === 'bry') {
    tokenOneSymbol = 'berry-data';
  }else if (tokenOneSymbol === 'uni') {
    tokenOneSymbol = 'uniswap';
  }else if (tokenOneSymbol === 'comp') {
    tokenOneSymbol = 'compound-governance-token';
  }



  // this is the endpoint to query symbols of coins. We will need this later on to get the symbol of the coins of the pools
  // because coingecko allows to query for token price only with a token id as argument which in some cases is different from
  // from the token symbol. Example: while we use symbols like cake for the pancake token, coingecko wants to be fed with
  // their token id for cake which is called pancakeswap-token.
  const tokenSymbolCoinGeckoApi = `https://api.coingecko.com/api/v3/coins/list`;

  // to consider there is a limit to the number of request to coingecko. If we call the list and filter for tokens to find
  // the id needed to feed the price token api we will make 2 api call per user instead of 1
  const tokenPriceCoinGeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenZeroSymbol}%2C${tokenOneSymbol}&vs_currencies=usd`;
  const res = await fetch(tokenPriceCoinGeckoApi);
  const data = await res.json();
  // because CoinGecko is so dumb to return the tokens prices not in order of token symbol requested we need to make sure token zero is token <zero></zero>
  const priceTokenZero = data[tokenZeroSymbol];
  const priceTokenOne = data[tokenOneSymbol];
  // console.log(`${tokenZeroSymbol}: `, priceTokenZero);
  // console.log(`${tokenOneSymbol}: `, priceTokenOne);
  return [priceTokenZero, priceTokenOne];
};

export const fetchCakePrice = async () => {
  const cakePriceCoinGeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=pancakeswap-token&vs_currencies=usd`;
  const res = await fetch(cakePriceCoinGeckoApi);
  const cakePrice = await res.json();
  return cakePrice['pancakeswap-token'].usd;
};

export const truncateAddress = (account, left = 4, right = 4) => {
  if (typeof account !== 'string') {
    account = account.toString();
  }
  const first = account.slice(0, left);
  const last = account.slice(-right);
  return first.concat('...', last);
};

export const copyToClipboard = (id) => {
  var r = document.createRange();
  r.selectNode(document.getElementById(id));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
};

export const splitPairs = (pair) => {
  return pair.toLowerCase().split('-');
};

export const renderPairsAvatars = (pair, n, Icons) => {
  const [pair1, pair2] = splitPairs(pair);
  return n === 1 ? Icons[pair1] : Icons[pair2];
};

export const formatBigNumber = (value) => {
  return parseInt(web3.utils.fromWei(BigInt(value).toString())).toLocaleString(
    'en-US'
    // {
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // }
  );
};

export const formatPercentage = (value) => {
  return value.toLocaleString('en', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const sumLendingPoolData = (url, lendingData, loading, lendingPoolData, data) => {
  if (!url.includes('stake')) {
    let finalResult;
    lendingData.length && loading === false
      ? (finalResult = lendingPoolData
          .map((pool) => parseFloat(formatBigNumber(pool[data]).replace(/\,/g, '')))
          .reduce((cur, acc) => cur + acc)
          .toLocaleString())
      : '';
    return finalResult;
  }
};
