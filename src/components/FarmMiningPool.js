// TODO: once useContext or Redux is implemented need to change the excl icon to white for the dark mode
// TODO: alternate Coingeko API with Coinmarketcap api in order to increase the http requests limit
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//Mui
import { Grid, Input, Button, Divider, Card, Typography, Paper, Avatar } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';

// components
import Wrapper from './Wrapper';
import HuskySlider from './HuskySlider';

//data
import mainnet from '../mainnet.json';
import { farm } from '../services/VaultService';
import { getWalletTokenBalance } from '../services/ContractHelper';
import {
  calculate_loss_and_fee_and_pair_standard,
  tokensBegin,
  getFarmingData,
  getYieldFarmAPR,
} from '../services/PancakeService';
import { fetchTokenPrice, fetchCakePrice, formatPercentage } from '../utils';

// web3
import Web3 from 'web3';
import getDomain from '../services/Env';
const web3 = new Web3(getDomain());
import { useWeb3React } from '@web3-react/core';

// icons / images
import Icons from '../icons/icons';
import excl from '../icons/excl.png';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
    paddingBottom: '165px',
  },
  title: {
    fontSize: '24px',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    padding: '46px 0px 40px',
  },
  textSubtitles: {
    fontSize: '18px',
    paddingTop: '15px',
  },
  walletBalance: {
    opacity: '0.6',
    fontSize: '14px',
    marginBottom: '7px',
  },
  suppliedtokenOneSymbol: {
    padding: '17px 0px 17px 18px',
    textTransform: 'uppercase',
  },
  percentage: {
    margin: '21px 0px 55px',
  },
  stepperTitle: {
    margin: '65px 0px 45px',
    padding: '0px 5px 0px 20px',
  },
  loanCurrencyTitle: {
    padding: '90px 0px 65px',
  },
  loanCurrencyContainer: {
    width: '300px',
    marginTop: '38px',
  },
  loanCurrencyButton: {
    textTransform: 'uppercase',
    width: '120px',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '5px',
    marginRight: '20px',
  },
  loanCurrencyFirst: {
    backgroundColor: theme.palette.mode === 'dark' ? '#FB646B' : '#313745',
  },
  loanCurrencyThicker: {
    Size: '18px',
    marginLeft: '5px',
    color: '#000  ',
  },
  riskNotification: {
    color: '#FF0000',
    padding: '27px 150px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
  },
  someCard: {
    padding: '26px 32px',
    backgroundColor: '#313745',
    color: '#ffffff',
    height: '260px',
    boxSizing: 'border-box',
  },
  card: {
    padding: '10px 35px 10px',
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#FFFFFF',
    marginTop: '18px',
    marginBottom: '26px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgb(49 55 69 / 15%)',
  },
  swapData: {
    padding: '24px 0px',
  },
  divider: {
    backgroundColor: '#C6C6C8',
    opacity: '0.4',
  },
  button: {
    width: '148px',
    fontSize: '18px',
  },
  exclIcon: {
    marginLeft: '10px',
  },
  summary: {
    textTransform: 'uppercase',
  },
}));

const CustomInput = withStyles({
  input: {
    '&[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
})(Input);

const FarmMiningPool = ({ farmPools }) => {
  const classes = useStyles();
  const history = useHistory();
  const tradeFee = 0.0025;
  const { pairs } = useParams();
  const { account } = useWeb3React();
  const { t } = useTranslation();
  // symbols of the pair tokens
  let [tokenZeroSymbol, tokenOneSymbol] = pairs.toLowerCase().split('-');
  // amount of chosen leverage
  const [leverage, setLeverage] = useState(1);
  // amount of base tokens the user inputs
  const [inputTokenZeroAmount, setInputTokenZeroAmount] = useState(0);
  // amount of farming tokens the user inputs
  const [inputTokenOneAmount, setInputTokenOneAmount] = useState(0);
  // amount of total borrowed asset
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  // amount of balance of the base Token from the user's wallet
  const [walletBalanceTokenZero, setWalletBalanceTokenZero] = useState(0);
  // amount of balance of the farming Token from the user's wallet
  const [walletBalanceTokenOne, setWalletBalanceTokenOne] = useState(0);
  // amount of base tokens in the exchange pool
  const [tokenZeroPool, setTokenZeroPool] = useState(0);
  // amount of farming tokens in the exchange pool
  const [tokenOnePool, setTokenOnePool] = useState(0);
  // amount of base Tokens the user gets with farming
  const [baseTokensGet, setBaseTokensGet] = useState(0);
  // amount of farming Tokens the user gets with farming
  const [farmingTokensGet, setFarmingTokensGet] = useState(0);
  // current % of the trading fees accounting for the total price impact
  const [totalPriceImpactTradingFees, setTotalPriceImpactTradingFees] = useState(0);
  // current $ price of the token Zero
  const [priceTokenZero, setPriceTokenZero] = useState(0);
  // current $ price of the token One
  const [priceTokenOne, setPriceTokenOne] = useState(0);
  // current $ price for the cake token
  const [cakePrice, setCakePrice] = useState();
  // current TVL of the pool
  const [tvl, setTvl] = useState(0);
  // current farming data
  const [data, setData] = useState();
  // current exchange (Pancake) pool address
  const [exchangePoolAddress, setExchangePoolAddress] = useState();
  // current exchange (Pancake) pool ID
  const [exchangePoolId, setExchangePoolId] = useState();
  // current APY
  const [apy, setApy] = useState(0);

  // get the worker from the farmPools that matches the pairs param in the url
  const worker = farmPools.filter((pool) => pool.name === pairs);
  const workerParam = {
    inputTokenOneAmount,
    minLPAmount: 0,
    address: worker.address,
  };

  const apyParam = {
    pId: exchangePoolId,
    tvl,
    cakePrice,
  };

  // on HuskySlider bar change
  function handleSliderBarChange(event, leverage) {
    setLeverage(leverage);

    handleBorrowedTokenAmount(inputTokenZeroAmount, leverage);
  }

  // calculate the borrowed Amount
  const handleBorrowedTokenAmount = (inputTokenZeroAmount, newLeverage = leverage) => {
    const borrowedAmount = (newLeverage - 1) * inputTokenZeroAmount;

    setTotalBorrowed(borrowedAmount);
  };

  // on HuskySlider manual input change
  const handleSliderInputChange = (event) => {
    let amount = parseFloat(event.target.value);
    setLeverage(event.target.value === '' ? '' : amount);
    setTotalBorrowed(tokenZeroSymbol * amount);
    handleBorrowedTokenAmount(inputTokenZeroAmount, amount);
  };

  // TODO: I dont remember what is this for
  const handleBlur = () => {
    if (leverage < 0) {
      setLeverage(0);
    } else if (leverage > 3) {
      setLeverage(3);
    }
  };

  // on the first supplied token manual input change
  const handleInputTokenZeroAmount = (e) => {
    if (e.target.value < 0) {
      setInputTokenZeroAmount(0);
    } else if (e.target.value > walletBalanceTokenZero) {
      setInputTokenZeroAmount(walletBalanceTokenZero);
    } else {
      setInputTokenZeroAmount(e.target.value);
    }
    handleBorrowedTokenAmount(e.target.value);
  };

  // on the second supplied token manual input change
  const handleInputTokenOneAmount = (e) => {
    if (e.target.value < 0) {
      setInputTokenOneAmount(0);
    } else if (e.target.value > walletBalanceTokenOne) {
      setInputTokenOneAmount(walletBalanceTokenOne);
    } else {
      setInputTokenOneAmount(e.target.value);
    }
  };

  // on the first token 25,50,75,100% button change
  const handlePortionBaseTokenAmount = (percentage, pairNumber, balance) => {
    const amount = (percentage / 100) * balance;
    pairNumber === 1 ? setInputTokenZeroAmount(amount) : setInputTokenOneAmount(amount);

    handleBorrowedTokenAmount(amount);
  };

  // when farm button is clicked
  const handleFarm = () => {
    const pId = 0;
    const maxReturn = 0;
    farm(worker[0].vaultAddress, pId, worker, leverage, maxReturn, inputTokenOneAmount, 0, workerParam);
  };

  useEffect(() => {
    // get the price for token zero and token one
    const prices = fetchTokenPrice(tokenZeroSymbol, tokenOneSymbol);
    Promise.resolve(prices).then((res) => {
      const [priceTokenZero, priceTokenOne] = res;
      setPriceTokenZero(priceTokenZero.usd);
      setPriceTokenOne(priceTokenOne.usd);
    });

    // get the price of cake token
    const cakePrice = fetchCakePrice();
    Promise.resolve(cakePrice).then((price) => setCakePrice(price));

    // get the address and the pId for the current farming pool on Pancakeswap that we need to get the
    // amount of token Zero and token One in the exchange pool
    const exchangePool = mainnet.Exchanges.Pancakeswap.LpTokens.filter((pool) => {
      const split = pairs.split('-');
      // swap the tokens because the original and the swapped tokens have the same address
      // example: BNB-ETH and ETH-BNB have the same pool address
      const swappedPairs = split[1].concat('-', split[0]);
      if (!pool.name.includes('Legacy')) {
        if (pool.name.includes(pairs) || pool.name.includes(swappedPairs)) {
          return pool;
        }
      }
    })[0];

    setExchangePoolAddress(exchangePool.address);
    setExchangePoolId(exchangePool.pId);
  }, []);

  useEffect(() => {
    // get the value of the pool for Token zero and token one to calculate the TVL
    if (exchangePoolAddress) {
      const tokensBeginBalances = tokensBegin(exchangePoolAddress);
      Promise.resolve(tokensBeginBalances).then((values) => {
        setTokenZeroPool(values[0]);
        setTokenOnePool(values[1]);
      });
    }
  }, [exchangePoolAddress]);

  useEffect(() => {
    // store the tvl for this pool
    const tvl0 = (tokenZeroPool / 10 ** 18) * priceTokenZero;
    const tvl1 = (tokenOnePool / 10 ** 18) * priceTokenOne;

    setTvl(tvl0 + tvl1);
  }, [priceTokenZero, priceTokenOne, tokenZeroPool, tokenOnePool]);

  useEffect(() => {
    // get Farming data
    const rawFarmingData = calculate_loss_and_fee_and_pair_standard(
      leverage,
      inputTokenZeroAmount,
      inputTokenOneAmount,
      tokenZeroPool,
      tokenOnePool,
      false,
      tradeFee
    );
    Promise.resolve(rawFarmingData).then((values) => {
      setData(values);
    });

    // get APY
    if (tvl && cakePrice && exchangePoolId) {
      const rawApy = getYieldFarmAPR(apyParam);
      // console.log('rawApy: ', rawApy);
      Promise.resolve(rawApy).then((apy) => {
        setApy(formatPercentage(apy));
      });
    }
  }, [leverage, inputTokenZeroAmount, inputTokenOneAmount, tokenZeroPool, tokenOnePool]);

  useEffect(() => {
    if (data) {
      const [totalpriceimpactandtradingfees, totalborrowed, basetoken_get, farmingtoken_get] = data;
      setTotalPriceImpactTradingFees((totalpriceimpactandtradingfees * 100).toFixed(2));
      setTotalBorrowed(totalborrowed);
      setBaseTokensGet(basetoken_get);
      setFarmingTokensGet(farmingtoken_get);
    }
  }, [data]);

  useEffect(() => {
    // if MetaMask is connected and web3React fetched a value for the account
    if (account) {
      // get the balance for the base token and the farming token
      const baseTokenBalance = getWalletTokenBalance(account, mainnet.Tokens[tokenZeroSymbol.toUpperCase()]);
      const farmingTokenBalance = getWalletTokenBalance(account, mainnet.Tokens[tokenOneSymbol.toUpperCase()]);
      Promise.resolve(baseTokenBalance).then((value) => setWalletBalanceTokenZero(value));
      Promise.resolve(farmingTokenBalance).then((value) => setWalletBalanceTokenOne(value));
    }
  }, [account]);

  return (
    <Paper className={classes.root}>
      <Wrapper>
        <Typography className={classes.title}>
          | &nbsp; {t('mining')} PancakeSwap {pairs} {t('pool')}
        </Typography>
        {/* first block */}
        <Card className={classes.card}>
          <Typography className={`${classes.subTitle} ${classes.textSubtitles}`}>{t('supply_assets')}</Typography>
          <Grid style={{ paddingTop: '35px' }}>
            <Typography className={classes.walletBalance}>
              {t('wallet_balance')}: {walletBalanceTokenZero}
            </Typography>

            <Divider className={classes.divider} />
            <Grid container wrap="nowrap">
              <Grid container alignItems="center">
                <Avatar src={Icons[tokenZeroSymbol]} />
                <CustomInput
                  id="farmingToken"
                  className={classes.suppliedtokenOneSymbol}
                  value={inputTokenZeroAmount}
                  type="number"
                  onChange={handleInputTokenZeroAmount}
                  disableUnderline
                  autoFocus={true}
                  inputProps={{
                    step: 0.001,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
              <Grid container justifyContent="flex-end">
                <Typography className={classes.suppliedtokenOneSymbol}>{tokenZeroSymbol}</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>
          <Grid container justifyContent="space-between" className={classes.percentage}>
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                key={percentage}
                onClick={() => handlePortionBaseTokenAmount(percentage, 1, walletBalanceTokenZero)}
              >
                {percentage}%
              </Button>
            ))}
          </Grid>
          <Grid>
            <Typography className={classes.walletBalance}>
              {t('wallet_balance')}: {walletBalanceTokenOne}
            </Typography>
            <Divider className={classes.divider} />
            <Grid container wrap="nowrap">
              <Grid container alignItems="center">
                <Avatar src={Icons[tokenOneSymbol]} />
                <CustomInput
                  id="farmingToken"
                  className={classes.suppliedtokenOneSymbol}
                  value={inputTokenOneAmount}
                  type="number"
                  onChange={handleInputTokenOneAmount}
                  disableUnderline
                  autoFocus={true}
                  inputProps={{
                    step: 0.001,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
              <Grid container justifyContent="flex-end">
                <Typography className={classes.suppliedtokenOneSymbol}>{tokenOneSymbol}</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>

          <Grid container justifyContent="space-between" className={classes.percentage}>
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                key={percentage}
                onClick={() => handlePortionBaseTokenAmount(percentage, 2, walletBalanceTokenOne)}
              >
                {percentage}%
              </Button>
            ))}
          </Grid>
          <Grid className={classes.stepperTitle}>
            <Typography className={classes.textSubtitles}>{t('leverage')}</Typography>

            <HuskySlider
              handleSliderChange={handleSliderBarChange}
              handleInputChange={handleSliderInputChange}
              handleBlur={handleBlur}
              leverage={leverage}
              style={{ marginBottom: 50 }}
            />
          </Grid>
          <Grid className={classes.loanCurrencyTitle}>
            <Typography className={classes.textSubtitles}>{t('loan_currency')}</Typography>

            <Grid container wrap="nowrap">
              <Grid
                container
                alignItems="center"
                wrap="nowrap"
                className={`${classes.loanCurrencyFirst} ${classes.loanCurrencyButton}`}
              >
                <Avatar src={Icons[tokenZeroSymbol]} />
                <span className={classes.loanCurrencyThicker}>{tokenZeroSymbol}</span>
              </Grid>

              <Grid container alignItems="center" wrap="nowrap" className={`${classes.loanCurrencyButton}`}>
                <Avatar src={Icons[tokenOneSymbol]} />
                <span className={classes.loanCurrencyThicker}>{tokenOneSymbol}</span>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <Typography className={classes.riskNotification}>{t('risk_factor_notification')}</Typography>

        {/* second block */}
        <Card className={classes.card}>
          <Grid>
            <Grid container justifyContent="space-between" className={classes.swapData}>
              <Typography>{t('supplied_assets')}</Typography>
              <Typography className={classes.summary}>
                {inputTokenZeroAmount.toLocaleString()} {tokenZeroSymbol} + {inputTokenOneAmount.toLocaleString()}{' '}
                {tokenOneSymbol}
              </Typography>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container justifyContent="space-between" className={classes.swapData}>
              <Typography>{t('borrowed_assets')}</Typography>
              <Typography className={classes.summary}>
                {totalBorrowed.toLocaleString()} {tokenZeroSymbol}
              </Typography>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container justifyContent="space-between" className={classes.swapData}>
              <Typography>PancakeSwap {t('transaction_fees_and_slippage')}</Typography>
              <Typography>{totalPriceImpactTradingFees} %</Typography>
            </Grid>
            <Divider className={classes.divider} />
            {/* <Grid container justifyContent="space-between" className={classes.swapData}>
              <Typography>
                {t('risk_factor')}
                <img src={excl} className={classes.exclIcon} alt="exclamation point icon" />
              </Typography>
              <Typography>69.78%</Typography>
            </Grid> */}
            {/* <Divider className={classes.divider} /> */}
            <Grid container justifyContent="space-between" className={classes.swapData}>
              <Grid>
                <Typography>{t('position_value')}</Typography>
              </Grid>
              <Typography className={classes.summary}>
                {baseTokensGet.toLocaleString()} {tokenZeroSymbol} + {farmingTokensGet.toLocaleString()} {tokenOneSymbol}
              </Typography>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container justifyContent="space-between" className={classes.swapData}>
              <Grid>
                <Typography>{t('comprehensive_annualized_yield')}</Typography>
              </Grid>
              <Typography className={classes.typography}>{apy}</Typography>
            </Grid>
          </Grid>
        </Card>

        <Grid container justifyContent="space-between" style={{ padding: '66px 385px' }}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => history.push(`/farm/${pairs}/cover-up`)}
          >
            {t('authorize')}
          </Button>
          <Button variant="contained" color="primary" className={classes.button} onClick={() => handleFarm()}>
            {leverage}X {t('mining')}
          </Button>
        </Grid>
      </Wrapper>
    </Paper>
  );
};

export default FarmMiningPool;
