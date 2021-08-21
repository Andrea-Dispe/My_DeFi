// TODO: what is the hide white spaces on the top right? I made it a checkbox but need to be changed?
// TODO: the sedcond card has too many columns and the layout breaks when the app is in english
// TODO: Refactor code

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import {Grid, Button, Divider, Card, Typography, Paper, Avatar} from '@material-ui/core';

//components
import Wrapper from './Wrapper';

//data
import Icons from '../icons/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
    paddingBottom: '165px',
  },
  titleContainer: {
    padding: '46px 0px 40px',
  },
  title: {
    fontSize: '24px',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  },
  inputWhiteSpaces: {
    height: '17px',
    width: '18px',
    borderRadius: '50%',
  },
  cardTitle: {
    fontSize: '18px',
    padding: '33px 00px 15px',
  },
  card: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#ffffff',
    marginBottom: '45px',
    padding: '0px 32px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgb(49 55 69 / 15%)',
  },
  avatar: {
     width: '32px',
     height: '32px'
  },
  divider: {
    backgroundColor: '#C6C6C8',
    opacity: '0.4',
  },
  button: {
    width: '103px',
    fontSize: '16px',
  },
  exclIcon: {
    marginLeft: '10px',
  },
}));

const Profile = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [depositPool, setDepositPool] = useState(false);
  const [stake, setStake] = useState(false);
  const [leverage, setLeverage] = useState(false);
  const [liquidation, setLiquidation] = useState(false);
  const [lockUp1, setLockUp1] = useState(false);
  const [lockUp2, setLockUp2] = useState(false);

  const depositPoolCoin = 'BTCB';

  return (
    <Paper className={classes.root}>
      <Wrapper>
        <Grid container justify="space-between" className={classes.titleContainer}>
          <Typography className={classes.title}>| &nbsp; {t('my_profile')}</Typography>
          <Typography className={classes.title} component="label">
            <input type="checkbox" id="white_spaces" name="whiteSpaces" value="false" className={classes.inputWhiteSpaces} />
            {t('hide_white_spaces')}
          </Typography>
        </Grid>
        {/* deposit pool */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('deposit_pool')}</Typography>
          <Divider className={classes.divider} />

          {depositPool ? (
            <Grid container wrap="nowrap" justify="center" style={{ height: '156px' }}>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('deposit_currency')}</Typography>
                <Grid container alignItems="center">
                  <Avatar src={Icons.btc} className={classes.avatar}/>
                  <Typography style={{ marginLeft: '5px' }}>{depositPoolCoin}</Typography>
                </Grid>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('deposit_rate')}</Typography>
                <Typography>12.36% </Typography>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('initial_investment')}</Typography>
                <Typography>10 {depositPoolCoin}</Typography>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('income_asset')}</Typography>
                <Typography>0.63 {depositPoolCoin}</Typography>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('synthetic_assets')}</Typography>
                <Typography>9.63 H{depositPoolCoin}</Typography>
              </Grid>
              <Grid container justify="space-around" alignItems="center" direction="column">
                <Typography>{t('operating')}</Typography>
                <Grid container wrap="nowrap">
                  <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                    {t('deposit')}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => history.push(`/close/${depositPoolCoin}/convert`)}
                  >
                    {t('withdraw')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <>
              <Grid container style={{ padding: '25px' }} justify="center">
                <Button color="primary" variant="contained" onClick={() => setDepositPool(true)}>
                  Fill data
                </Button>
              </Grid>
              <Divider className={classes.divider} />
            </>
          )}
        </Card>
        {/* stake */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('stake')}</Typography>
          <Divider className={classes.divider} />
          {stake ? (
            <>
              <Grid container wrap="nowrap" justify="center" style={{ height: '156px' }}>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('pledged_assets')}</Typography>
                  <Grid container alignItems="center">
                    <Avatar src={Icons.btc} className={classes.avatar}/>
                    <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
                  </Grid>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('annualized_income')}</Typography>
                  <Typography>12.36% </Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('pledged_assets_value')}</Typography>
                  <Typography>10 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('token_reward')}</Typography>
                  <Typography>0.63 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" alignItems="center" direction="column">
                  <Typography>{t('operating')}</Typography>
                  <Grid container wrap="nowrap">
                    <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                      {t('deposit')}
                    </Button>
                    <Button variant="contained" color="primary" className={classes.button}>
                      {t('withdraw')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container justify="space-between" style={{ paddingTop: '27px' }}>
                <Grid container alignItems="center" style={{ width: 'auto' }}>
                  <Avatar src={Icons.logo} />
                  <span style={{ marginLeft: '5px' }}> Husky {t('rewards')}</span>
                </Grid>
                <Typography style={{ fontSize: '36px' }}>826.23</Typography>
                <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '63px', height: '40px' }}>
                  {t('receive')}
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid container style={{ padding: '25px' }} justify="center">
                <Button color="primary" variant="contained" onClick={() => setStake(true)}>
                  Fill data
                </Button>
              </Grid>
              <Divider className={classes.divider} />
            </>
          )}
        </Card>
        {/* leverage */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('leverage_mining')}</Typography>
          <Divider className={classes.divider} />
          {leverage ? (
            <>
              <Grid container wrap="nowrap" justify="center" style={{ height: '156px' }}>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('total_asset_value')}</Typography>
                  <Grid container alignItems="center">
                    <Avatar src={Icons.btc} className={classes.avatar}/>
                    <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
                  </Grid>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('debt_value')}</Typography>
                  <Typography>12.36% </Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('annualized_income')}</Typography>
                  <Typography>10 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('debt_ratio')}</Typography>
                  <Typography>0.63 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('liquidation_debt_ratio')}</Typography>
                  <Typography>0.63 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('risk_factor')}</Typography>
                  <Typography>0.63 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" direction="column">
                  <Typography>{t('token_reward')}</Typography>
                  <Typography>0.63 BTCB</Typography>
                </Grid>
                <Grid container justify="space-around" alignItems="center" direction="column">
                  <Typography>{t('operating')}</Typography>
                  <Grid container wrap="nowrap">
                    <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                      {t('deposit')}
                    </Button>
                    <Button variant="contained" color="primary" className={classes.button}>
                      {t('withdraw')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container justify="space-between" style={{ paddingTop: '27px' }}>
                <Grid container alignItems="center" style={{ width: 'auto' }}>
                  <Avatar src={Icons.logo} />
                  <span style={{ marginLeft: '5px' }}> Husky {t('rewards')}</span>
                </Grid>
                <Typography style={{ fontSize: '36px' }}>826.23</Typography>
                <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '63px', height: '40px' }}>
                  {t('receive')}
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid container style={{ padding: '25px' }} justify="center">
                <Button color="primary" variant="contained" onClick={() => setLeverage(true)}>
                  Fill data
                </Button>
              </Grid>
              <Divider className={classes.divider} />
            </>
          )}
        </Card>
        {/* liquidation */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('liquidation')}</Typography>
          <Divider className={classes.divider} />
          {liquidation ? (
            <Grid container wrap="nowrap" justify="center" style={{ height: '156px' }}>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('trading_pair')}</Typography>
                <Grid container alignItems="center">
                  <Avatar src={Icons.btc} className={classes.avatar}/>
                  <Typography style={{ margin: '0px 5px' }}>BTCB</Typography>
                  <Avatar src={Icons.cake} className={classes.avatar}/>
                </Grid>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('liquidated_asset_value')}</Typography>
                <Typography>12.36% </Typography>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('debt_value')}</Typography>
                <Typography>10 BTCB</Typography>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('liquidation_penalty')}</Typography>
                <Typography>0.63 BTCB</Typography>
              </Grid>
              <Grid container justify="space-around" direction="column">
                <Typography>{t('refund_amount')}</Typography>
                <Typography>0.63 BTCB</Typography>
              </Grid>
              {/* <Grid container justify="space-around" alignItems="center" direction="column">
              <Typography>{t('operating')}</Typography>
              <Grid container wrap="nowrap">
                <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                  {t('deposit')}
                </Button>
                <Button variant="contained" color="primary" className={classes.button}>
                  {t('withdraw')}
                </Button>
              </Grid>
            </Grid> */}
            </Grid>
          ) : (
            <>
              <Grid container style={{ padding: '25px' }} justify="center">
                <Button color="primary" variant="contained" onClick={() => setLiquidation(true)}>
                  Fill data
                </Button>
              </Grid>
              <Divider className={classes.divider} />
            </>
          )}
        </Card>

        {/* lock-up */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('lock-up')}</Typography>
          <Grid>
            <Divider className={classes.divider} />
            {lockUp1 ? (
              <>
                <Grid container wrap="nowrap" justify="center" style={{ height: '156px' }}>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('provide_liquidity')}</Typography>
                    <Grid container alignItems="center">
                      <Avatar src={Icons.logo} className={classes.avatar}/>
                      <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('locked_position')}</Typography>
                    <Typography>12.36% </Typography>
                  </Grid>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('annualized_income')}</Typography>
                    <Typography>10 BTCB</Typography>
                  </Grid>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('annualized_income')}</Typography>
                    <Typography>0.63 BTCB</Typography>
                  </Grid>
                  <Grid container justify="space-around" alignItems="center" direction="column">
                    <Typography>{t('operating')}</Typography>
                    <Grid container wrap="nowrap">
                      <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                        {t('pledge')}
                      </Button>
                      <Button variant="contained" color="primary" className={classes.button}>
                        {t('withdraw')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid container justify="space-between" style={{ paddingTop: '27px' }}>
                  <Grid container alignItems="center" style={{ width: 'auto' }}>
                    <Avatar src={Icons.logo} />
                    <span style={{ marginLeft: '5px' }}> Husky {t('rewards')}</span>
                  </Grid>
                  <Typography style={{ fontSize: '36px' }}>826.23</Typography>
                  <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '63px', height: '40px' }}>
                    {t('receive')}
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid container style={{ padding: '25px' }} justify="center">
                  <Button color="primary" variant="contained" onClick={() => setLockUp1(true)}>
                    Fill data
                  </Button>
                </Grid>
                <Divider className={classes.divider} />
              </>
            )}
          </Grid>

          <Grid style={{ marginTop: '80px' }}>
            <Divider className={classes.divider} />
            {lockUp2 ? (
              <>
                <Grid container wrap="nowrap" justify="center" style={{ height: '156px' }}>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('single_currency_lock')}</Typography>
                    <Grid container alignItems="center">
                      <Avatar src={Icons.logo} className={classes.avatar}/>
                      <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('locked_position')}</Typography>
                    <Typography>4 BTCB </Typography>
                  </Grid>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('locked_up_value')}</Typography>
                    <Typography>236.58%</Typography>
                  </Grid>
                  <Grid container justify="space-around" direction="column">
                    <Typography>{t('annualized_income')}</Typography>
                    <Typography>0.63 BTCB</Typography>
                  </Grid>
                  <Grid container justify="space-around" alignItems="center" direction="column">
                    <Typography>{t('operating')}</Typography>
                    <Grid container wrap="nowrap">
                      <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                        {t('pledge')}
                      </Button>
                      <Button variant="contained" color="primary" className={classes.button}>
                        {t('withdraw')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid container justify="space-between" style={{ paddingTop: '27px' }}>
                  <Grid container alignItems="center" style={{ width: 'auto' }}>
                    <Avatar src={Icons.logo} />
                    <span style={{ marginLeft: '5px' }}> Husky {t('rewards')}</span>
                  </Grid>
                  <Typography style={{ fontSize: '36px' }}>826.23</Typography>
                  <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '63px', height: '40px' }}>
                    {t('receive')}
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid container style={{ padding: '25px' }} justify="center">
                  <Button color="primary" variant="contained" onClick={() => setLockUp2(true)}>
                    Fill data
                  </Button>
                </Grid>
                <Divider className={classes.divider} />
              </>
            )}
          </Grid>
        </Card>
      </Wrapper>
    </Paper>
  );
};

export default Profile;
