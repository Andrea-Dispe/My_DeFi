import { Button, Card, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  wrapper: {
    backGroundColor: '#ffffff',
  },
  table: {
    minWidth: 700,
  },
  root: {
    borderRadius: '15px',
  },
  inActive: {
    backgroundColor: '#4B4B4C',
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
  let { id } = useParams();
  let { url } = useRouteMatch();
  console.log('includes', url.includes('deposit'));

  console.log('id in deposit is: ', url);

  return (
    <Paper className={classes.wrapper} style={{ backgroundColor: '#ffffff' }}>
      <div style={{ width: '1240px', margin: '0px auto' }}>
        <Typography style={{ fontSize: '24px', color: '#000000', padding: '46px 0px 40px' }}>
          | &nbsp; {url.includes('deposit') ? `${t('deposit')} ${id}` : `${t('withdraw')} h${id}`}
        </Typography>
        <Grid container alignItems="center" direction="column" style={{ marginTop: '85px' }}>
          <Grid item>
            <Card
              style={{
                width: '510px',
                backgroundColor: '#060606',
                borderRadius: '14px',
                marginBottom: '20px',
              }}
            >
              <Grid container justify="space-between">
                <Typography style={{ padding: '30px', color: '#ffffff', fontSize: '20px' }}>{t('pledged')}</Typography>
                <Typography style={{ padding: '30px', color: '#ffffff', fontSize: '20px' }}>236.23 h{id}</Typography>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card
              style={{
                width: '510px',
                backgroundColor: '#060606',
                borderRadius: '14px',
                marginBottom: '20px',
              }}
            >
              <Grid container justify="center" wrap="nowrap" style={{ height: '65px', marginBottom: '42px' }}>
                <Button style={{ color: '#ffffff', width: '100%' }} className={url.includes('withdraw') ? classes.inActive : ''}>
                  {t('pledge')}
                </Button>
                <Button style={{ color: '#ffffff', width: '100%' }} className={url.includes('deposit') ? classes.inActive : ''}>
                  {t('cancel_pledge')}
                </Button>
              </Grid>
              <Grid style={{ padding: '0px 55px' }} container>
                <Grid container justify="space-between" style={{ padding: '21px 50px', backgroundColor: '#2A2A2D' }}>
                  <Grid container justify="space-between">
                    <Grid style={{ color: '#ffffff' }}>{url.includes('deposit') ? t('deposit_amount') : t('withdraw_quantity')}</Grid>
                    <Grid style={{ color: '#ffffff' }}>{t('balance')}: 10.23BNB</Grid>
                  </Grid>
                  <Grid container justify="space-between" style={{ marginTop: '20px' }}>
                    <Grid style={{ color: '#ffffff' }}>10.23</Grid>
                    <Grid style={{ color: '#ffffff' }}>BNB | {t('max')}</Grid>
                  </Grid>
                </Grid>

                <Grid container justify="space-around" style={{ padding: '60px 0px 42px' }}>
                  {url.includes('pledge') ? (
                    <>
                      <Button className={`${classes.button} ${classes.buttonDeposit}`} variant="contained" color="primary">
                        {t('authorize')}
                      </Button>
                      <Button className={`${classes.button} ${classes.buttonDeposit}`} variant="contained" color="primary">
                        {t('confirm')}
                      </Button>
                    </>
                  ) : (
                    <Button className={`${classes.button} ${classes.buttonWithdraw}`} variant="contained" color="primary">
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
