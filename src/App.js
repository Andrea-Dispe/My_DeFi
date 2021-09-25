import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

//mui
import { createTheme, ThemeProvider, Paper } from '@material-ui/core';
import { makeStyles, StylesProvider } from '@material-ui/styles';

import Divider from '@material-ui/core/Divider';

//components
import Pool from './components/Pool';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Farm from './components/Farm';
import LockUp from './components/LockUp';
import PoolActions from './components/PoolActions';
import StakeActions from './components/StakeActions';
import Profile from './components/Profile';
import FarmMiningPool from './components/FarmMiningPool';
import FarmCoverUp from './components/FarmCoverUp';
import CloseTransaction from './components/CloseTransaction';
import MetamaskProvider from './components/MetamaskProvider';

//data
import dummyLendingPoolData from './data/dummyLendingPoolData';
import mainnet from './mainnet.json';
import { getPoolInfo, getStakeValue, getStakeApr, getLandRate } from './services/VaultService';
import { getPoolTokenDaily } from './services/FairlaunchService';
import { fetchTokenPrice, fetchCakePrice, formatPercentage, fetchTokenPriceTest } from './utils';
import {
  calculate_loss_and_fee_and_pair_standard,
  tokensBegin,
  getFarmingData,
  getYieldFarmAPR,
} from './services/PancakeService';

//web3
import { useWeb3React } from '@web3-react/core';

import WalletConnectProvider from '@walletconnect/web3-provider';

const useStyles = makeStyles((theme) => ({
  navBarDivider: {
    backgroundColor: '#ffffff',
    position: 'relative',
    top: '112px',
    opacity: '0.5',
  },
  footerDivider: {
    backgroundColor: '#ffffff',
    opacity: '0.5',
  },
}));

// languages
const languages = [
  {
    code: 'en',
    name: 'English',
    country_code: 'us',
  },
  {
    code: 'zh',
    name: 'Chinese',
    country_code: 'cn',
  },
];




function App() {
  // const [darkMode, setDarkMode] = useState(false);
  const [darkMode, setDarkMode] = useState();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lendingData, setLendingData] = useState([]);
  const [stakedValue, setStakedValue] = useState([]);
  const [poolTokenDaily, setPoolTokenDaily] = useState([]);
  const [farmPools, setFarmPools] = useState([]);
  const [filteredFarmPools, setFilteredFarmPools] = useState([]);
  const { account } = useWeb3React();
  const [cakePrice, setCakePrice] = useState();
  const [pools, setPools] = useState([]);



  async function connnectWalletConnect() {
    // wallet connect``
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: 'https://mainnet.mycustomnode.com',
          3: 'https://ropsten.mycustomnode.com',
          100: 'https://dai.poa.network',
          // ...
        },
      });
      await provider.enable();
    } catch (error) {
      console.error(error);
    }
  }

  async function loadBloackchainData(isMounted) {
    // LENDING POOL DATA
    const lendingData = mainnet.Vaults.map((pool) => {
      const loadLendingData = async () => {
        const dataPool = await getPoolInfo(pool);
        dataPool.name = dataPool.name.replace('Interest Bearing ', '');
        return dataPool;
      };
      return loadLendingData();
    });

    Promise.all(lendingData)
      .then((values) => {
        setLendingData(values);
      })
      .catch((error) => console.error('error', error));

    const stakedValue = mainnet.Vaults.map((pool) => {
      const loadingStakingData = async () => {
        const name = pool.name;
        const stakeValue = await getStakeValue(pool);
        const stakeAPR = await getStakeApr(pool);
        return { name, stakeValue, stakeAPR };
      };
      return loadingStakingData();
    });
    Promise.all(stakedValue)
      .then((values) => {
        setStakedValue(values);
      })
      .catch((error) => console.error('error', error));

    const poolTokenDaily = mainnet.FairLaunch.pools.map((pool) => {
      const loadingTokenDaily = async () => {
        const TokenDaily = await getPoolTokenDaily(pool);
        return TokenDaily;
      };
      return loadingTokenDaily();
    });
    Promise.all(poolTokenDaily)
      .then((values) => {
        setPoolTokenDaily(values);
      })
      .catch((error) => console.error('error', error));

    setLoading(false);
  }

  async function loadFarmData() {
    const cleanPools = mainnet.Exchanges.Pancakeswap.LpTokens.filter((lpPool) => {
      if (!lpPool.name.includes('Legacy')) {
        lpPool.name = lpPool.name.replace(' LP', '');
        return lpPool;
      }
    });
    const farmPools = cleanPools.map((lpPool) => {
      async function processPools() {
        // get the 2 token symbols
        const [tokenZeroSymbol, tokenOneSymbol] = lpPool.name.split('-');
        lpPool.tokenZeroSymbol = tokenZeroSymbol;
        lpPool.tokenOneSymbol = tokenOneSymbol;

        // get reserves token 0 and token 1
        const tokensBeginBalances = await tokensBegin(lpPool.address);
        lpPool.reserveTokenZero = tokensBeginBalances[0];
        lpPool.reserveTokenOne = tokensBeginBalances[1];

        // get token0 price and token1 price
        const prices = await fetchTokenPrice(tokenZeroSymbol.toLowerCase(), tokenOneSymbol.toLowerCase());
        lpPool.priceTokenZero = prices[0].usd;
        lpPool.priceTokenOne = prices[1].usd;

        // calculate and store tvl
        const tvl0 = (lpPool.reserveTokenZero / 10 ** 18) * lpPool.priceTokenZero;
        const tvl1 = (lpPool.reserveTokenOne / 10 ** 18) * lpPool.priceTokenOne
        const totalTvlNumber = tvl0 + tvl1;
        lpPool.tvl = totalTvlNumber.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        // create the object with pId, cakeprice and tvl
        if (cakePrice) {
          const param = { pId: lpPool.pId, cakePrice, tvl: totalTvlNumber };
          const poolApy = await getYieldFarmAPR(param);
          lpPool.apy = formatPercentage(poolApy);
        }

        return lpPool;
      }
      const poolData = processPools();
      return poolData;
    });

    Promise.all(farmPools).then((data) => setPools(data));
  }



  async function getLending() {
    const t = await getLandRate(farmPools[0]);

  }

  useEffect((loading) => {
    let isMounted = true;
    setDarkMode(JSON.parse(localStorage.getItem('isDark')));
    setLoading(true);
    loadBloackchainData(isMounted, loading);

    // get Cake price
    const getCakePrice = async () => {
      const cakePrice = await fetchCakePrice();
      setCakePrice(cakePrice);
    };
    getCakePrice();
    // cleanup
    return () => (isMounted = false);
  }, []);

  useEffect(() => {
     loadFarmData()
  }, [cakePrice])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        paper: '#000000',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#00FF00',
      },
      primary: {
        main: '#009BFD',
        contrastText: '#ffffff',
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        paper: '#313745',
      },
      text: {
        primary: '#100E0E',
        secondary: '#00FF00',
      },
      divider: '#100E0E',
      primary: {
        main: '#009BFD',
        contrastText: '#ffffff',
      },
    },
  });

  function changeTheme() {
    setDarkMode(!darkMode);
    localStorage.setItem('isDark', JSON.stringify(!darkMode));
  }

  const stakingData = stakedValue.map((value, index) => {
    return { ...value, TokenDaily: poolTokenDaily[index] };
  });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <StylesProvider injectFirst>
        <Paper style={{ minHeight: '100vh' }}>
          <Divider className={classes.navBarDivider} />
          <Router>
            <MetamaskProvider>
              <Navbar
                changeTheme={changeTheme}
                darkMode={darkMode}
                languages={languages}
                connnectWalletConnect={connnectWalletConnect}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
              />

              <Switch>
                <Route exact path="/">
                  <Pool loading={loading} dummyLendingPoolData={dummyLendingPoolData} lendingData={lendingData} />
                </Route>

                <Route exact path="/stake">
                  <Pool
                    loading={loading}
                    dummyLendingPoolData={dummyLendingPoolData}
                    stakingData={stakingData}
                    lendingData={lendingData}
                  />
                </Route>
                <Route exact path="/farm">
                  <Farm farmPools={farmPools} setFilteredFarmPools={setFilteredFarmPools} filteredFarmPools={pools} />
                </Route>
                <Route path="/lock-up">
                  <LockUp />
                </Route>
                <Route path="/:id/deposit">
                  <PoolActions />
                </Route>
                <Route path="/:id/withdraw">
                  <PoolActions />
                </Route>
                <Route path="/stake/:id/pledge">
                  <StakeActions />
                </Route>
                <Route path="/stake/:id/release-pledge">
                  <StakeActions />
                </Route>
                <Route path="/farm/:pairs/mining-pool">
                  <FarmMiningPool farmPools={farmPools} account={account} />
                </Route>
                <Route path="/farm/:pairs/cover-up">
                  <FarmCoverUp />
                </Route>
                <Route path="/profile">
                  <Profile />
                </Route>
                <Route path="/close/:id/convert">
                  <CloseTransaction />
                </Route>
                <Route path="/close/:id/minimize">
                  <CloseTransaction />
                </Route>
              </Switch>
              {/* </Wrapper> */}
              <Divider className={classes.footerDivider} />

              <Footer />
            </MetamaskProvider>
          </Router>
        </Paper>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
