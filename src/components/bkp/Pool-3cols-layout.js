import React from 'react';
import { useTranslation } from 'react-i18next';
import {useRouteMatch, useHistory } from 'react-router-dom';

// MUI
import { makeStyles, StylesProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/button';
import Divider from '@material-ui/core/divider';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

//data
import Icons from '../icons/icons';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '67px',
    height: '67px',
    position: 'absolute',
    right: '18px',
    top: '-33px',
  },
  textCentered: { textAlign: 'center' },
  gridContainer: {
    justifyContent: 'space-between',
    margin: '0px',
  },
  gridItem: {
    maxWidth: '320px',
    position: 'relative',
  },
  cardContainer: {
    maxWidth: 345,
    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#2A2A2D',
    boxSizing: 'border-box',
    padding: '30px 40px 20px',
    borderRadius: '14px',
    marginBottom: '100px',
  },
  topCard: {
    width: '267px',
    height: '120px',
    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#2A2A2D',
    borderRadius: '8px',
    padding: '17px 40px 24px',
    boxSizing: 'border-box',
  },
  cardHeader: {
    padding: '0px',
    marginBottom: '69px',
  },
  cardContent: {
    padding: '0px',
  },
  poolApy: {
    marginBottom: '63px',
    fontSize: '48px',
    lineHeight: '23px',
    fontWeight: 'bold',
  },
  apr: {
    marginBottom: '30px',
  },
  divider: {
    marginBottom: '30px',
  },
  dt: {
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px',
  },
  button: {
    width: '111px',
  },
  poolWrapper: {
    width: '1240px',
    margin: '0 auto',
  },
}));

export default function Pool({ pools }) {
  let { url } = useRouteMatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const mainPageTopInfoCards = [
    { title: 'total_locked_position', icon: Icons.logo },
    { title: 'total_borrowed', icon: Icons.logo },
    { title: 'today_incomes', icon: Icons.logo },
    { title: 'price', icon: Icons.logo },
  ];
  return (
    <StylesProvider injectFirst>
    <Paper>
      <Paper className={classes.poolWrapper}>
        {url.includes('stake') ? (
          <Typography style={{ fontSize: '24px', color: '#ffffff', padding: '46px 0px 40px' }}>
            | &nbsp; {url.includes('stake') ? t('stake') : t('saving-pool')}
          </Typography>
        ) : (
          <Grid container justify="space-between" style={{ padding: '75px 0px 105px' }}>
            {mainPageTopInfoCards.map(({ title, icon }) => (
              <Card className={classes.topCard} key={title}>
                <Grid container direction="column">
                  <Grid container alignItems="center" justify="space-between" style={{ marginBottom: '16px' }}>
                    <Avatar src={icon} style={{ borderRadius: '0%', height: '41px' }} />
                    {title === 'price' ? <Typography>Husky {t(`${title}`)}</Typography> : <Typography>{t(`${title}`)}</Typography>}
                  </Grid>

                  {title !== 'price' ? (
                    <Grid container justify="flex-end">
                      <Typography style={{ fontSize: '23px', fontWeight: 600 }}>$1169063398.73</Typography>
                    </Grid>
                  ) : (
                    <Grid container justify="space-between" alignItems="center">
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
        )}

        <Grid container className={classes.gridContainer}>
          {pools.map((pool) => (
            <Grid key={pool.name} xs={12} sm={6} md={4} item className={classes.gridItem}>
              <Avatar alt={pool.name} src={pool.icon} className={classes.avatar}></Avatar>
              <Card className={`${classes.cardContainer}`}>
                <CardHeader title={pool.name} className={`${classes.textCentered} ${classes.cardHeader}`} />
                <CardContent className={classes.cardContent}>
                  <Typography variant="h4" className={`${classes.textCentered} ${classes.poolApy}`}>
                    {pool.apy}
                    <span style={{ fontSize: '24px' }}>%</span>
                  </Typography>
                  <Typography className={`${classes.textCentered} ${classes.apr}`}>{t('annualized_rate_of_return')}</Typography>
                  <Divider className={classes.divider} />

                  <Grid container justify={'space-between'} className={classes.dt}>
                    <Typography item>{url.includes('stake') ? 'TVL' : t('total_deposit')}</Typography>
                    <Typography item>{url.includes('stake') ? pool.TVL : pool.totalDeposit}</Typography>
                  </Grid>

                  <Grid container justify={'space-between'} className={classes.dt}>
                    <Typography>{url.includes('stake') ? t('saved') : t('total_borrowed')}</Typography>
                    <Typography>{url.includes('stake') ? pool.saved : pool.totalBorrowed}</Typography>
                  </Grid>

                  <Grid container justify={'space-between'} className={classes.dt}>
                    <Typography>{url.includes('stake') ? t('daily_output') : t('capital_utilization_rate')}</Typography>
                    <Typography>{url.includes('stake') ? pool.dailyOutput : pool.capitalUtilizationRate}</Typography>
                  </Grid>
                </CardContent>
                <CardActions disableSpacing className={classes.buttonGroup}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                      url.includes('stake') ? history.push(`/stake/${pool.name}/pledge`) : history.push(`${pool.name}/deposit`);
                    }}
                  >
                    {url.includes('stake') ? t('pledge') : t('deposit')}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                      url.includes('stake') ? history.push(`/stake/${pool.name}/release-pledge`) : history.push(`${pool.name}/withdraw`);
                    }}
                  >
                    {url.includes('stake') ? t('withdraw') : t('withdraw')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Paper>
    </StylesProvider>
  );
}
