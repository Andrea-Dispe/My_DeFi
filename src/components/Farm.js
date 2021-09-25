
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// MUI
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Grid,
  Button,
  MenuItem,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
} from '@material-ui/core';

//components
import LanguageSwitch from './LanguageSwitch';
import Wrapper from './Wrapper';

//data
import mainnet from '../mainnet.json';
import farmFilters from '../data/farmFilters';
import {
  calculate_loss_and_fee_and_pair_standard,
  tokensBegin,
  getFarmingData,
  getYieldFarmAPR,
} from '../services/PancakeService';
import { fetchTokenPrice, fetchCakePrice, formatPercentage, fetchTokenPriceTest } from '../utils';

// incons & images
import Icons from '../icons/icons';

// web3
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#ffffff',
    marginBottom: '115px',
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgb(49 55 69 / 15%)',
  },
  topCard: {
    width: '274px',
    boxShadow: '0px 0px 10px 0px rgb(49 55 69 / 15%)',
    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#2A2A2D',
    borderRadius: '8px',
    padding: '17px 40px 24px',
    boxSizing: 'border-box',
  },
  topCardAvatar: {
    width: '38px',
    height: '38px',
  },
  root: {
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
  },
  title: {
    fontSize: '24px',
    color: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
    padding: '46px 0px 40px',
  },
  flex: {
    display: 'flex',
  },
  topButton: {
    textTransform: 'uppercase',
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2A2A2D',
  },
  button: {
    width: '147px',
    backgroundColor: theme.palette.mode === 'dark' ? '#060606' : '#E2E2E2',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    border: theme.palette.mode === 'dark' ? '1px solid rgba(81, 81, 81, 111115)' : 'none',
    borderRadius: '6px',
  },
  buttonSm: {
    width: '90px',
  },
  activeButton: {
    backgroundColor: '#009BFD',
    color: '#FFFFFF',
  },
  avatar: {
    marginRight: '10px',
  },
  topDropdownSelectContainer: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#E2E2E2',
    borderRadius: '8px',
    width: '180px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    borderRadius: '10px',
    padding: '63px 0px 120px',
    minHeight: '300px',
  },
  tableHead: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#E2E2E2',
  },
  tableRow: {
    height: '95px',
  },
  lolli: {
    backgroundColor: '#00ff00',
  },
}));

export default function Farm({ farmPools, filteredFarmPools, setFilteredFarmPools }) {
  const classes = useStyles();
  const { account } = useWeb3React();

  const languages = ['de', 'se'];
  const history = useHistory();
  const mainPageTopInfoCards = [{ title: 'price', icon: Icons.logo }];
  const { t } = useTranslation();
  const [leverageActive, setLeverageActive] = useState(true);
  const [liquidationActive, setLiquidationActive] = useState(false);
  const [selected, setSelected] = useState('all');

  useEffect(() => {
    // get current farming position
    if (account) {
      const alpacaAPIPosition = `https://api.alpacafinance.org/v1/positions?owner=${account}`;
      // fetchFarmPositionId(alpacaAPIPosition).
      fetch(alpacaAPIPosition).then((data) => console.log('data', data));
    }
  }, [account]);

  const handleChange = (state) => {
    if (state === leverageActive) {
      if (!leverageActive) {
        setLeverageActive(!leverageActive);
        setLiquidationActive(!liquidationActive);
      }
    }
    if (state === liquidationActive) {
      if (!liquidationActive) {
        setLeverageActive(!leverageActive);
        setLiquidationActive(!liquidationActive);
      }
    }
  };

  const handleFilterPools = (name) => {
    let filteredPools;
    if (name === 'all') {
      filteredPools = farmPools;
    } else if (name === 'others') {
      filteredPools = farmPools.filter((pool) => {
        //filter all pools whose tokenOne is not in farmFilters name
        const names = farmFilters.map((filter) => filter.name);
        if (
          names.findIndex((name) => name === pool.tokenOne.toLowerCase()) === -1 &&
          names.findIndex((name) => name === pool.tokenTwo.toLowerCase()) === -1
        ) {
          return pool;
        }
      });
    } else {
      filteredPools = farmPools.filter((pool) => {
        if (pool.tokenOne === name.toUpperCase() || pool.tokenTwo === name.toUpperCase()) {
          return pool;
        }
      });
    }

    setFilteredFarmPools(filteredPools);
    setSelected(name);
  };

  return (
    <Paper className={classes.root}>
      <Wrapper>
        {/* first block */}
        <Grid container justifyContent="space-between" alignItems="center" style={{ padding: '22px 0px 26px' }}>
          <Grid>
            <Button
              variant="contained"
              onClick={() => {
                handleChange(leverageActive);
              }}
              className={`${classes.button} ${leverageActive ? classes.activeButton : ''}`}
              style={{ marginRight: '5px' }}
            >
              {t('leveraged_position')}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleChange(liquidationActive);
              }}
              className={`${classes.button} ${liquidationActive ? classes.activeButton : ''}`}
            >
              {t('liquidation_position')}
            </Button>
          </Grid>
          {mainPageTopInfoCards.map(({ title, icon }) => (
            <Card className={classes.topCard} key={title}>
              <Grid container direction="column">
                <Grid container alignItems="center" justifyContent="space-around" style={{ marginBottom: '16px' }}>
                  <Avatar src={icon} style={{ borderRadius: '0%', height: 'auto' }} />
                  {title === 'price' ? <Typography>Token {t(`${title}`)}</Typography> : <Typography>{t(`${title}`)}</Typography>}
                </Grid>

                {title !== 'price' ? (
                  <Grid container justifyContent="flex-end">
                    <Typography style={{ fontSize: '23px', fontWeight: 600 }}>$1169063398.73</Typography>
                  </Grid>
                ) : (
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Typography style={{ fontSize: '23px', fontWeight: 600 }}>$98.70000</Typography>
                    <Typography style={{ fontSize: '14px', opacity: '0.8' }}>
                      {t('purchase')} {`>`}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          ))}
        </Grid>

        {/* second block */}
        <Card className={classes.card}>
          <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
            {liquidationActive ? (
              <>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('trading_pair')}</Typography>
                  <Grid container alignItems="center" justifyContent="center">
                    <Avatar src={Icons.bnb} className={classes.avatar} style={{ margin: '-5px', zIndex: 1 }} />
                    <Avatar src={Icons.cake} className={classes.avatar} />
                    <Typography style={{ marginLeft: '5px' }}>BNB-CAKE</Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('liquidated_asset_value')}</Typography>
                  <Typography>10.00 BNB</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('debt_value')}</Typography>
                  <Typography>88 BNB</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('liquidation_penalty')}</Typography>
                  <Typography>0.63 BNB</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('refund_amount')}</Typography>
                  <Typography>9.63 BNB</Typography>
                </Grid>
              </>
            ) : (
              <>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('total_asset_value')}</Typography>
                  <Typography style={{ marginLeft: '5px' }}> 8.01 BNB</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('debt_value')}</Typography>
                  <Typography>4.0 BNB </Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('annualized_income')}</Typography>
                  <Typography>236.23%</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('debt_ratio')}</Typography>
                  <Typography>56.23%</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('liquidation_debt_ratio')}</Typography>
                  <Typography>83.3%</Typography>
                </Grid>
                <Grid container justifyContent="space-around" direction="column" alignItems="center">
                  <Typography>{t('risk_factor')}</Typography>
                  <Typography>59% </Typography>
                </Grid>
                <Grid container justifyContent="space-around" alignItems="center" direction="column">
                  <Typography>{t('operating')}</Typography>
                  <Grid container wrap="nowrap">
                    <Button variant="contained" color="primary" className={classes.buttonSm} style={{ marginRight: '5px' }}>
                      {t('cover')}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.buttonSm}
                      onClick={() => history.push(`/close/sssssssssss/convert`)}
                    >
                      {t('sell')}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Card>

        {/* third block */}
        <div className={classes.flex}>
          <Grid container>
            {farmFilters.map((item, index) => (
              <Grid item xs={2} key={index}>
                <MenuItem
                  key={item.name}
                  className={classes.topButton}
                  onClick={() => handleFilterPools(item.name)}
                  selected={selected === item.name}
                >
                  <Avatar src={item.icon} className={classes.avatar} />
                  {item.name === 'all' ? t('all') : item.name && item.name === 'others' ? t('others') : item.name}
                </MenuItem>
              </Grid>
            ))}
          </Grid>
          <div className={classes.topDropdownSelectContainer}>
            <LanguageSwitch languages={languages} />
          </div>
        </div>

        <TableContainer className={classes.tableContainer}>
          <Table aria-label="customized table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell style={{ width: '250px', textAlign: 'center' }}>{t('mining_pool')}</TableCell>
                <TableCell align="center">TVL</TableCell>
                <TableCell align="right">{t('maximum_leverage')}</TableCell>
                <TableCell align="right">{t('annualized_income')}</TableCell>
                <TableCell style={{ paddingRight: '50px' }} align="right">
                  {t('operating')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmPools.map((worker, idx) => (
                <TableRow key={idx} className={classes.tableRow}>
                  <TableCell component="th" scope="worker">
                    <Grid container justifyContent="space-evenly" alignItems="center" style={{ width: '300px' }}>
                      <Grid container alignItems="center" style={{ width: 'auto' }}>
                        <Avatar src={Icons[worker.tokenZeroSymbol.toLowerCase()]} style={{ marginRight: '-8px', zIndex: 1 }} />
                        <Avatar src={Icons[worker.tokenOneSymbol.toLowerCase()]} />
                      </Grid>
                      {worker.name}
                    </Grid>
                  </TableCell>
                  <TableCell align="center">{worker.tvl}</TableCell>
                  <TableCell align="right">3</TableCell>
                  <TableCell align="right">{worker.apy || 'nothing'}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.buttonSm}
                      onClick={() => history.push(`/farm/${worker.name}/mining-pool`)}
                    >
                      {t('farm')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
    </Paper>
  );
}
