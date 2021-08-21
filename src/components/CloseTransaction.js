import { Button, Card, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch, Link as RouterLink } from 'react-router-dom';

//data

//components
import Wrapper from './Wrapper';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
    paddingBottom: '165px',
  },
  title: {
    fontSize: '24px',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    padding: '46px 0px 40px'
  },
  card: {
    width: '510px',
       backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#000000',

    borderRadius: '14px',
    marginBottom: '20px',
  },
  inActive: {
    backgroundColor: '#4B4B4C',
  },
  button: {
    borderRadius: '6px',
    padding: '15px 0px',
    fontSize: '18px',
  },
  buttonDeposit: {
    width: '184px',
  },
  buttonWithdraw: {
    width: '100%',
  },
  divider: {
    backgroundColor: '#C6C6C8',
    opacity: '0.4',
  },
}));

const Deposit = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { id } = useParams();
  let { url } = useRouteMatch();
  console.log('includes', url.includes('deposit'));

  console.log('id in deposit is: ', url);

  return (
    <Paper className={classes.root}>
      <Wrapper>
        <Typography className={classes.title}>
          | &nbsp; {t('close_debt')}
        </Typography>

        <Grid container alignItems="center" direction="column" style={{ marginTop: '85px' }}>
          <Card className={classes.card}>
            <Grid container justify="center" wrap="nowrap" style={{ height: '65px', marginBottom: '37px' }}>
              <Button
                style={{ color: '#ffffff', width: '100%' }}
                className={url.includes('minimize') ? classes.inActive : ''}
                component={RouterLink}
                to={`/close/${id}/convert`}
              >
                {t('convert_to')} {id}
              </Button>
              <Button
                style={{ color: '#ffffff', width: '100%' }}
                className={url.includes('convert') ? classes.inActive : ''}
                component={RouterLink}
                to={`/close/${id}/minimize`}
              >
                {t('minimize_transactions')}
              </Button>
            </Grid>
            <Grid container justify="space-between" style={{ padding: '0px 27px' }} direction="column">
              <Grid item>
                <Grid container justify="space-between">
                  <Grid style={{ color: '#ffffff' }}>{t('total_asset_value')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>1017.77 DODO + 4.07 {id}</Grid>
                </Grid>
                <Grid container justify="space-between" style={{ marginTop: '42px' }}>
                  <Grid style={{ color: '#ffffff' }}>{t('transaction_amount')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>{url.includes('convert') ? `0.00 DODO` : `1017.77 DODO`}</Grid>
                </Grid>
                <Grid container justify="space-between" style={{ marginTop: '42px' }}>
                  <Grid style={{ color: '#ffffff' }}>{url.includes('convert') ? t('transaction_fee') : 'PancakeSwap' + t('transaction_fee')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>{url.includes('convert') ? `0.00 DODO` : `2.94 DODO (0.25%)`}</Grid>
                </Grid>
                <Grid container justify="space-between" style={{ marginTop: '42px' }}>
                  <Grid style={{ color: '#ffffff' }}>{t('converted_to_total_asset_value')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>{url.includes('convert') ? `1017.77 DODO + 4.07 ${id}` : `8.12 ${id}`}</Grid>
                </Grid>
                <Grid container justify="space-between" style={{ marginTop: '42px', marginBottom: '42px' }}>
                  <Grid style={{ color: '#ffffff' }}>{t('debt_value')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>4.00 {id}</Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item>
                <Grid container justify="space-between" style={{ marginTop: '42px' }}>
                  <Grid style={{ color: '#ffffff' }}> {t('received_assets')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>{url.includes('convert') ? `1017.98 DODO + 0.066 ${id}` : `4.00 ${id}`}</Grid>
                </Grid>
                <Grid container justify="space-between" style={{ marginTop: '42px' }}>
                  <Grid style={{ color: '#ffffff' }}>{t('minimum_received')}</Grid>
                  <Grid style={{ color: '#ffffff' }}>{url.includes('convert') ? `1017.98 DODO + 0.066 ${id}` : `4.00 ${id}`}</Grid>
                </Grid>
                <Grid container justify="space-around" style={{ padding: '42px 0px 39px' }}>
                  <Button className={`${classes.button} ${classes.buttonWithdraw}`} variant="contained" color="primary">
                    {t('confirm')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Wrapper>
    </Paper>
  );
};

export default Deposit;
