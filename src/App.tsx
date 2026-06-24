import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';
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
import dummyLendingPoolData from './data/dummyLendingPoolData';
import mainnet from './mainnet.json';
import { getPoolInfo, getStakeValue, getStakeApr } from './services/VaultService';
import { getPoolTokenDaily } from './services/FairlaunchService';
import { fetchTokenPrice, fetchCakePrice, formatPercentage } from './utils';
import {
  tokensBegin,
  getYieldFarmAPR,
} from './services/PancakeService';
import { useWeb3React } from '@web3-react/core';
import './App.css';


// Supported display languages for the language switcher
const languages = [
  { code: 'en', name: 'English', country_code: 'us' },
  { code: 'zh', name: 'Chinese', country_code: 'cn' },
];

const useStyles = makeStyles(() => ({
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

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lendingData, setLendingData] = useState<any[]>([]);
  const [stakedValue, setStakedValue] = useState<any[]>([]);
  const [poolTokenDaily, setPoolTokenDaily] = useState<any[]>([]);
  const [farmPools] = useState<any[]>([]);
  const [filteredFarmPools, setFilteredFarmPools] = useState<any[]>([]);
  const { account } = useWeb3React();
  const [cakePrice, setCakePrice] = useState<number | undefined>();
  const [pools, setPools] = useState<any[]>([]);

  const [, startTransition] = useTransition();

  const loadBlockchainData = useCallback(() => {
    startTransition(() => {
      setLoading(true);
    });

    // LENDING POOL DATA
    const lendingPromises = (mainnet as any).Vaults.map((pool: any) =>
      getPoolInfo(pool).then((dataPool: any) => {
        dataPool.name = dataPool.name.replace('Interest Bearing ', '');
        return dataPool;
      })
    );

    Promise.all(lendingPromises)
      .then((values) => setLendingData(values))
      .catch((error: unknown) => console.error('Lending pool load error:', error));

    const stakedPromises = (mainnet as any).Vaults.map((pool: any) =>
      Promise.all([
        getStakeValue(pool),
        getStakeApr(pool),
      ]).then(([stakeValue, stakeAPR]) => ({ name: pool.name, stakeValue, stakeAPR }))
    );

    Promise.all(stakedPromises)
      .then((values) => setStakedValue(values))
      .catch((error: unknown) => console.error('Staked value load error:', error));

    const tokenDailyPromises = (mainnet as any).FairLaunch.pools.map((pool: any) =>
      getPoolTokenDaily(pool)
    );

    Promise.all(tokenDailyPromises)
      .then((values) => setPoolTokenDaily(values))
      .catch((error: unknown) => console.error('Token daily load error:', error));

    startTransition(() => {
      setLoading(false);
    });
  }, []);

  const loadFarmData = useCallback(async () => {
    if (!cakePrice) return;

    const cleanPools = (mainnet as any).Exchanges.Pancakeswap.LpTokens.filter(
      (lpPool: any) => !lpPool.name.includes('Legacy')
    ).map((lpPool: any) => ({
      ...lpPool,
      name: lpPool.name.replace(' LP', ''),
    }));

    const farmPromises = cleanPools.map(async (lpPool: any) => {
      const pool = { ...lpPool };
      const [tokenZeroSymbol, tokenOneSymbol] = pool.name.split('-');
      pool.tokenZeroSymbol = tokenZeroSymbol;
      pool.tokenOneSymbol = tokenOneSymbol;

      const tokensBeginBalances = await tokensBegin(pool.address);
      pool.reserveTokenZero = tokensBeginBalances[0];
      pool.reserveTokenOne = tokensBeginBalances[1];

      const prices = await fetchTokenPrice(
        tokenZeroSymbol.toLowerCase(),
        tokenOneSymbol.toLowerCase()
      );
      pool.priceTokenZero = prices[0].usd;
      pool.priceTokenOne = prices[1].usd;

      const tvl0 = (pool.reserveTokenZero / 10 ** 18) * pool.priceTokenZero;
      const tvl1 = (pool.reserveTokenOne / 10 ** 18) * pool.priceTokenOne;
      const totalTvlNumber = tvl0 + tvl1;
      pool.tvl = totalTvlNumber.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      const param = { pId: pool.pId, cakePrice, tvl: totalTvlNumber };
      const poolApy = await getYieldFarmAPR(param);
      pool.apy = formatPercentage(poolApy);

      return pool;
    });

    Promise.all(farmPromises)
      .then((data) => setPools(data))
      .catch((error: unknown) => console.error('Farm data load error:', error));
  }, [cakePrice]);

  // On mount: read theme preference, load blockchain data, fetch CAKE price
  useEffect(() => {
    const stored = localStorage.getItem('isDark');
    setDarkMode(stored ? JSON.parse(stored) : false);
    loadBlockchainData();

    fetchCakePrice()
      .then((price: number) => setCakePrice(price))
      .catch((error: unknown) => console.error('CAKE price fetch error:', error));
  }, [loadBlockchainData]);

  // Re-run farm data whenever the CAKE price resolves
  useEffect(() => {
    loadFarmData();
  }, [loadFarmData]);

  const darkTheme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      background: { paper: '#000000' },
      text: { primary: '#FFFFFF', secondary: '#00FF00' },
      primary: { main: '#009BFD', contrastText: '#ffffff' },
    },
  }), []);

  const lightTheme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      background: { paper: '#313745' },
      text: { primary: '#100E0E', secondary: '#00FF00' },
      divider: '#100E0E',
      primary: { main: '#009BFD', contrastText: '#ffffff' },
    },
  }), []);

  function changeTheme() {
    setDarkMode((prev) => {
      localStorage.setItem('isDark', JSON.stringify(!prev));
      return !prev;
    });
  }

  const stakingData = useMemo(
    () => stakedValue.map((value, index) => ({ ...value, TokenDaily: poolTokenDaily[index] })),
    [stakedValue, poolTokenDaily]
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Paper style={{ minHeight: '100vh' }}>
        <Divider className={classes.navBarDivider} />
        <Router>
          <MetamaskProvider>
            <Navbar
              changeTheme={changeTheme}
              darkMode={darkMode}
              languages={languages}
              isConnected={isConnected}
              setIsConnected={setIsConnected}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Pool
                    loading={loading}
                    dummyLendingPoolData={dummyLendingPoolData}
                    lendingData={lendingData}
                  />
                }
              />
              <Route
                path="/stake"
                element={
                  <Pool
                    loading={loading}
                    dummyLendingPoolData={dummyLendingPoolData}
                    stakingData={stakingData}
                    lendingData={lendingData}
                  />
                }
              />
              <Route
                path="/farm"
                element={
                  <Farm
                    farmPools={farmPools}
                    setFilteredFarmPools={setFilteredFarmPools}
                    filteredFarmPools={pools}
                  />
                }
              />
              <Route path="/lock-up" element={<LockUp />} />
              <Route path="/:id/deposit" element={<PoolActions />} />
              <Route path="/:id/withdraw" element={<PoolActions />} />
              <Route path="/stake/:id/pledge" element={<StakeActions />} />
              <Route path="/stake/:id/release-pledge" element={<StakeActions />} />
              <Route
                path="/farm/:pairs/mining-pool"
                element={<FarmMiningPool farmPools={farmPools} />}
              />
              <Route path="/farm/:pairs/cover-up" element={<FarmCoverUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/close/:id/convert" element={<CloseTransaction />} />
              <Route path="/close/:id/minimize" element={<CloseTransaction />} />
            </Routes>

            <Divider className={classes.footerDivider} />
            <Footer />
          </MetamaskProvider>
        </Router>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
