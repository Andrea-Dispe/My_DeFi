//TODO: when will apply useCOntext to pass the darkmode var to the components need to use it to rendere the back arrow in the light mode
import React, { useState } from 'react';
import { Button, Card, Grid, Paper, Typography, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch, Link as RouterLink } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
//data
import whiteDownArrow from '../icons/white-downarrow.png';
import { withdraw, deposit} from '../services/VaultService';
import { getWalletBnbBalance } from '../services/ContractHelper';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '1240px',
    margin: '0px auto',
  },
  title: {
    fontSize: '24px',
    color: '#000000',
    padding: '46px 0px 40px',
  },
  mainCard: {
    width: '510px',
    backgroundColor: theme.palette.mode === 'dark' ? '#060606' : '#FFFFFF',
    boxShadow: theme.palette.mode === 'dark' ? '' : '0px 2px 21px 0px rgba(49, 55, 69, 0.14)',
    borderRadius: '14px',
    marginBottom: '20px',
  },
  textInfoTop: {
    padding: '30px',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    fontSize: '20px',
  },
  topButtonsContainer: {
    height: '65px',
    marginBottom: '42px',
  },
  topButton: {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    width: '100%',
  },
  inActive: {
    backgroundColor: theme.palette.mode === 'dark' ? '#4B4B4C' : '#E2E2E2',
  },
  cardContentWrapper: {
    padding: '0px 55px',
  },
  cardContentBackground: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#DFDFDF',
    padding: '20px 50px',
  },
  cardContent: {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  },
  textField: {
    width: '130px',
    textAlign: 'center',
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
  depositContainer: {
    width: '50%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  deposit: {
    padding: '10px 0px',
    marginLeft: '15px',
  },
  buttonsBottomContainer: {
    padding: '60px 0px 42px',
  },
  button: {
    borderRadius: '6px',
    padding: '18px 0px',
    fontSize: '18px',
  },
  buttonDeposit: {
    width: '184px',
  },
  buttonWithdraw: {
    width: '100%',
  },
}));

const Deposit = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { url } = useRouteMatch();
  const { id } = useParams();
  const depositToken = id.toUpperCase();
  const [amount, setAmount] = useState(0);
  const { account } = useWeb3React();


  const getFullBalance = async (account) => {
    const maxAmount = await getWalletBnbBalance(account);
    setAmount(maxAmount);
  };

  const handleAmount = (e) => {
    if (e.target.value < 0) {
      setAmount(0);
    } else {
      setAmount(e.target.value);
    }
  };


  return (
    <Paper style={{ backgroundColor: '#ffffff' }}>
      <div className={classes.wrapper}>
        <Typography className={classes.title}>
          | &nbsp; {url.includes('deposit') ? `${t('deposit')} ${depositToken}` : `${t('withdraw')} h${depositToken}`}
        </Typography>
        <Grid container alignItems="center" direction="column" style={{ marginTop: '75px' }}>
          <Grid item>
            <Card className={classes.mainCard}>
              <Grid container justify="space-between">
                <Typography className={classes.textInfoTop}>{t('saved')}</Typography>
                <Typography className={classes.textInfoTop}>***{depositToken}</Typography>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.mainCard} style={{marginBottom: '120px'}}>
              <Grid container justify="center" wrap="nowrap" className={classes.topButtonsContainer}>
                <Button
                  className={`${url.includes('withdraw') ? classes.inActive : ''} ${classes.topButton}`}
                  component={RouterLink}
                  to={`/${depositToken}/deposit`}
                >
                  {t('deposit')}
                </Button>
                <Button
                  className={`${url.includes('deposit') ? classes.inActive : ''} ${classes.topButton}`}
                  component={RouterLink}
                  to={`/${depositToken}/withdraw`}
                >
                  {t('withdraw')}
                </Button>
              </Grid>
              <Grid className={classes.cardContentWrapper} container>
                <Grid container justify="space-between" className={classes.cardContentBackground}>
                  <Grid container justify="space-between">
                    <Grid className={classes.cardContent}>
                      {url.includes('deposit') ? t('deposit_amount') : t('withdraw_quantity')}
                    </Grid>
                    <Grid className={classes.cardContent}>
                      {t('balance')}: 10.23{depositToken}
                    </Grid>
                  </Grid>
                  <Grid container justify="space-between" style={{ marginTop: '20px' }}>
                    <Input
                      className={`${classes.cardContent} ${classes.textField}`}
                      value={amount}
                      type="number"
                      onChange={handleAmount}
                      disableUnderline
                      autoFocus={true}
                      inputProps={{
                        // disabled: 'true',
                        // readonly: 'true',
                        step: 0.001,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                      }}
                    />

                    <Grid className={classes.cardContent} style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography style={{ padding: '6px 8px' }}>{depositToken}</Typography> |
                      <Button onClick={() => getFullBalance(account)} style={{ textDecoration: 'underline' }}>
                        {t('max')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container alignItems="center">
                  <div className={classes.depositContainer}>
                    <img src={whiteDownArrow} alt="down arrow white icon" />
                  </div>
                  <Typography className={`${classes.cardContent} ${classes.deposit}`}>{t('deposit_money')}</Typography>
                </Grid>
                <Grid container justify="space-between" className={classes.cardContentBackground}>
                  <Grid className={classes.cardContent}>9.63</Grid>
                  <Grid className={classes.cardContent}>h{depositToken}</Grid>
                </Grid>

                <Grid container justify="space-around" className={classes.buttonsBottomContainer}>
                  {url.includes('deposit') ? (
                    <>
                      <Button
                        className={`${classes.button} ${classes.buttonDeposit}`}
                        variant="contained"
                        color="primary"
                      >
                        {t('authorize')}
                      </Button>
                      <Button
                        className={`${classes.button} ${classes.buttonDeposit}`}
                        variant="contained"
                        color="primary"
                        onClick={() => deposit(account, amount)}
                      >
                        {t('confirm')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={`${classes.button} ${classes.buttonWithdraw}`}
                      variant="contained"
                      color="primary"
                      onClick={() => withdraw(account, amount)}

                    >
                      {t('confirm')}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default Deposit;
