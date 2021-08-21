import { Button, Card, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch, Link as RouterLink } from 'react-router-dom';


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
  let { id } = useParams();
  let { url } = useRouteMatch();

  return (
    <Paper style={{ backgroundColor: '#ffffff' }}>
      <div className={classes.wrapper}>
        <Typography className={classes.title}>
          | &nbsp; {url.includes('pledge') ? `${t('pledge')} ${id}` : `${t('withdraw-pledge')} h${id}`}
        </Typography>
        <Grid container alignItems="center" direction="column" style={{ marginTop: '85px' }}>
          <Grid item>
            <Card className={classes.mainCard}>
              <Grid container justify="space-between">
                <Typography className={classes.textInfoTop}>{t('pledged')}</Typography>
                <Typography className={classes.textInfoTop}>236.23 h{id}</Typography>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.mainCard} >
              <Grid container justify="center" wrap="nowrap" className={classes.topButtonsContainer}>
                <Button
                  className={`${url.includes('release-pledge') ? classes.inActive : ''} ${classes.topButton}`}
                  component={RouterLink}
                  to={`/stake/${id}/pledge`}
                >
                  {t('pledge')}
                </Button>
                <Button
                  className={`${url.includes('pledge') ? classes.inActive : ''} ${classes.topButton}`}
                  component={RouterLink}
                  to={`/stake/${id}/release-pledge`}
                >
                  {t('release_pledge')}
                </Button>
              </Grid>
              <Grid className={classes.cardContentWrapper} container>
                <Grid container justify="space-between" className={classes.cardContentBackground}>
                  <Grid container justify="space-between">
                    <Grid className={classes.cardContent}>{url.includes('release') ? t('number_of_released') : t('pledge_amount')}</Grid>
                    <Grid className={classes.cardContent}>{url.includes('release') ? t('releasable') : t('pledgeable')}: 10.23BNB</Grid>
                  </Grid>
                  <Grid container justify="space-between" style={{ marginTop: '20px' }}>
                    <Grid className={classes.cardContent}>10.23</Grid>
                    <Grid className={classes.cardContent}>hBNB | {t('max')}</Grid>
                  </Grid>
                </Grid>

                <Grid container justify="space-around" className={classes.buttonsBottomContainer}>
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
