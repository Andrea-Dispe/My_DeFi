// TODOL like the others pages, useContext -> excl icon  darkmode

import { useTranslation } from 'react-i18next';

// MUI
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

//data
import Icons from '../icons/icons';
import excl from '../icons/excl.png';

//components
import Wrapper from './Wrapper';

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
  topCard: {
    padding: '26px 32px',
    backgroundColor: '#2A2A2D',
    color: '#ffffff',
    height: '260px',
    boxSizing: 'border-box',
  },
  topCardTitle: {
    fontSize: '20px',
  },
  smallText: {
    fontSize: '16px',
  },
  topCardContent: {
    marginTop: '-55px',
  },
  leftSpace: {
    marginLeft: '10px',
  },
  fullHeight: {
    height: '100%',
  },
  subTitle: {
    padding: '54px 0px',
  },
  card: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#ffffff',
    marginTop: '47px',
    padding: '0px 40px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgb(49 55 69 / 15%)',
  },
  dataContainer: {
    margin: '60px 0px',
  },
  dataTitle: {
    padding: '17px 0px',
  },
  symbolLeftSpace: {
    marginLeft: '4px',
  },
  lightPurple: {
    color: '#FB646B',
  },
  lightOrange: {
    color: '#FC9B02',
  },
  actionContainer: {
    width: '340px',
    margin: '0 auto',
  },
  containerTopSpace: {
    paddingTop: '27px',
  },
  divider: {
    backgroundColor: '#C6C6C8',
    opacity: '0.4',
  },
  button: {
    width: '105px',
    fontSize: '18px',
    display: 'flex',
    margin: '31px auto 40px',
  },
}));

export default function LockUp() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Paper className={classes.root}>
      <Wrapper>
        <Typography className={classes.title}>| &nbsp; {t('lock-up')}</Typography>

        <Grid spacing={3} container>
          <Grid item xs={6}>
            <Card className={classes.topCard}>
              <Grid container className={classes.fullHeight}>
                <Grid container item alignItems="center">
                  <Avatar src={Icons.logo}></Avatar>
                  <Typography className={`${classes.topCardTitle} ${classes.leftSpace}`}> Token {t('price')}</Typography>
                </Grid>
                <Grid container alignItems="center" justify="center" className={classes.fullHeight}>
                  <Typography variant="h4" className={classes.topCardContent}>
                    139.65<span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>USDT</span>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className={classes.topCard}>
              <Grid container className={classes.fullHeight}>
                <Grid container item alignItems="center">
                  <Avatar src={Icons.logo}></Avatar>
                  <Typography className={`${classes.topCardTitle} ${classes.leftSpace}`}>Token {t('locked_position')}</Typography>
                </Grid>
                <Grid container alignItems="center" justify="center" className={classes.fullHeight}>
                  <Typography variant="h4" className={classes.topCardContent}>
                    20.34<span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>M CORGI</span>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Card className={classes.card}>
          <Typography className={classes.subTitle}>{t('provide_liquidity')}</Typography>
          <Grid>
            <Divider className={classes.divider} />
            <Grid container justify="space-between" wrap="nowrap">
              <Grid item container wrap="nowrap" alignItems="center" style={{width: 'auto'}}>
                <Typography className={classes.dataTitle}>Token-USDT LP {t('lock-up')}</Typography>
                <img src={excl} className={classes.leftSpace} alt="exclamation point icon" />
              </Grid>

              <Grid item >
                <Typography className={classes.dataTitle}>256987 Token/{t('released_today')}</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>

          <Grid container wrap="nowrap" className={classes.dataContainer}>
            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('annualized_income')}</Typography>
              <Typography variant="h4" className={classes.lightPurple}>
                20.34<span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>%</span>
              </Typography>
            </Grid>

            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('locked_up_amount')} (Token-USDT LP)</Typography>
              <Typography variant="h4" className={classes.lightOrange}>
                <span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>$</span>
                58.36
                <span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>M</span>
              </Typography>
            </Grid>
          </Grid>

          <Grid className={classes.actionContainer}>
            <Divider className={classes.divider} />
            <Typography className={classes.dataTitle}>{t('get')} Token-USDT LP</Typography>
            <Divider className={classes.divider} />
            <Button variant="contained" color="primary" className={classes.button}>
              {t('pledge')}
            </Button>
          </Grid>

          <Grid className={classes.containerTopSpace}>
            <Divider className={classes.divider} />
            <Grid container justify="space-between" wrap="nowrap">
              <Grid item container wrap="nowrap" alignItems="center" style={{width: 'auto'}}>
                <Typography className={classes.dataTitle}>Token-USDT LP {t('lock-up')}</Typography>
                <img src={excl} className={classes.leftSpace} alt="exclamation point icon" />
              </Grid>
              <Grid item wrap="nowrap">
                <Typography className={classes.dataTitle}>256987 Token/{t('released_today')}</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>

          <Grid container wrap="nowrap" className={classes.dataContainer}>
            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('annualized_income')}</Typography>
              <Typography variant="h4" className={classes.lightPurple}>
                20.34<span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>%</span>
              </Typography>
            </Grid>

            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('locked_up_amount')} (Token-BNB LP)</Typography>
              <Typography variant="h4" className={classes.lightOrange}>
                <span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>$</span>
                58.36
                <span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>M</span>
              </Typography>
            </Grid>
          </Grid>

          <Grid className={classes.actionContainer}>
            <Divider className={classes.divider} />
            <Typography className={classes.dataTitle}>{t('get')} Token-USDT LP</Typography>
            <Divider className={classes.divider} />
            <Button variant="contained" color="primary" className={classes.button}>
              {t('pledge')}
            </Button>
          </Grid>
        </Card>

        <Card className={classes.card}>
          <Typography className={classes.containerTopSpace}>{t('single_currency_lock')}</Typography>
          <Grid className={classes.containerTopSpace}>
            <Divider className={classes.divider} />
            <Grid container justify="space-between">
              <Typography className={classes.dataTitle}>Token {t('lock-up')}</Typography>
              <Typography className={classes.dataTitle}>256987 Token/{t('released_today')}</Typography>
              <Typography className={classes.dataTitle}>
                {t('released_period')}: 2 {t('years')}
              </Typography>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>

          <Grid container wrap="nowrap" className={classes.dataContainer}>
            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('locked_position')} (Token)</Typography>
              <Typography variant="h4" className={classes.lightOrange}>
                23654.2365<span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>%</span>
              </Typography>
            </Grid>

            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('annualized_income')}</Typography>
              <Typography variant="h4" className={classes.lightPurple}>
                2630.34<span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>%</span>
              </Typography>
            </Grid>

            <Grid container item direction="column" alignItems="center">
              <Typography className={classes.dataTitle}>{t('locked_up_amount')} (Token)</Typography>
              <Typography variant="h4" className={classes.lightOrange}>
                <span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>$</span>
                58.36
                <span className={`${classes.smallText} ${classes.symbolLeftSpace}`}>M</span>
              </Typography>
            </Grid>
          </Grid>

          <Grid className={classes.actionContainer}>
            <Divider className={classes.divider} />
            <Typography className={classes.dataTitle}>{t('get')} Token-USDT LP</Typography>
            <Divider className={classes.divider} />
            <Button variant="contained" color="primary" className={classes.button}>
              {t('pledge')}
            </Button>
          </Grid>
        </Card>
      </Wrapper>
    </Paper>
  );
}
