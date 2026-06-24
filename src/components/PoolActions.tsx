import { useState, useOptimistic, useTransition } from 'react';
import { Button, Card, Grid, Paper, Typography, Input } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
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

const Deposit = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const { id } = useParams<{ id: string }>();
  const depositToken = id!.toUpperCase();
  const [amount, setAmount] = useState<string>('0');
  const { account } = useWeb3React();

  const [balance, setBalance] = useState<string>('0.00000000');
  const [optimisticBalance, addOptimisticBalance] = useOptimistic(
    balance,
    (current: string, delta: number) =>
      Math.max(0, parseFloat(current) - delta).toFixed(8)
  );

  const [isPending, startTransition] = useTransition();

  const getFullBalance = async (acc: string | null | undefined) => {
    if (!acc) return;
    const maxAmount = await getWalletBnbBalance(acc);
    setBalance(maxAmount);
    setAmount(maxAmount);
  };

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(e.target.value) < 0) {
      setAmount('0');
    } else {
      setAmount(e.target.value);
    }
  };

  const handleAction = () => {
    const numericAmount = parseFloat(amount);
    if (!id || isNaN(numericAmount) || numericAmount <= 0) return;

    startTransition(async () => {
      //  adjust displayed balance before the tx confirms
      addOptimisticBalance(numericAmount);
      try {
        if (url.includes('deposit')) {
          await deposit(id, amount);
        } else {
          await withdraw(id, amount);
        }
        const confirmed = await getWalletBnbBalance(account ?? '');
        setBalance(confirmed);
      } catch (err) {
        console.error('Transaction failed:', err);
      }
    });
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
              <Grid container justifyContent="space-between">
                <Typography className={classes.textInfoTop}>{t('saved')}</Typography>
                <Typography className={classes.textInfoTop}>***{depositToken}</Typography>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.mainCard} style={{marginBottom: '120px'}}>
              <Grid container justifyContent="center" wrap="nowrap" className={classes.topButtonsContainer}>
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
                <Grid container justifyContent="space-between" className={classes.cardContentBackground}>
                  <Grid container justifyContent="space-between">
                    <Grid className={classes.cardContent}>
                      {url.includes('deposit') ? t('deposit_amount') : t('withdraw_quantity')}
                    </Grid>
                  <Grid className={classes.cardContent}>{t('balance')}: {optimisticBalance} {depositToken}</Grid>
                  </Grid>
                  <Grid container justifyContent="space-between" style={{ marginTop: '20px' }}>
                    <Input
                      className={`${classes.cardContent} ${classes.textField}`}
                      value={amount}
                      type="number"
                      onChange={handleAmount}
                      disableUnderline
                      autoFocus={true}
                      inputProps={{
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
                <Grid container justifyContent="space-between" className={classes.cardContentBackground}>
                  <Grid className={classes.cardContent}>9.63</Grid>
                  <Grid className={classes.cardContent}>h{depositToken}</Grid>
                </Grid>

                <Grid container justifyContent="space-around" className={classes.buttonsBottomContainer}>
                {url.includes('deposit') ? (
                    <>
                      <Button
                        className={`${classes.button} ${classes.buttonDeposit}`}
                        variant="contained"
                        color="primary"
                        disabled={isPending}
                      >
                        {t('authorize')}
                      </Button>
                      <Button
                        className={`${classes.button} ${classes.buttonDeposit}`}
                        variant="contained"
                        color="primary"
                        disabled={isPending}
                        onClick={handleAction}
                      >
                        {isPending ? t('pending') + '...' : t('confirm')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={`${classes.button} ${classes.buttonWithdraw}`}
                      variant="contained"
                      color="primary"
                      disabled={isPending}
                      onClick={handleAction}
                    >
                      {isPending ? t('pending') + '...' : t('confirm')}
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

