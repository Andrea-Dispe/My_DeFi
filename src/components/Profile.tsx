import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { Grid, Button, Divider, Card, Typography, Paper, Avatar } from '@mui/material';
import Wrapper from './Wrapper';
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
    height: '32px',
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
  const navigate = useNavigate();

  const depositPoolCoin = 'BTCB';

  return (
    <Paper className={classes.root}>
      <Wrapper>
        <Grid container justifyContent="space-between" className={classes.titleContainer}>
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

          <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('deposit_currency')}</Typography>
              <Grid container alignItems="center">
                <Avatar src={Icons.btcb} className={classes.avatar} />
                <Typography style={{ marginLeft: '5px' }}>{depositPoolCoin}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('deposit_rate')}</Typography>
              <Typography>12.36% </Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('initial_investment')}</Typography>
              <Typography>10 {depositPoolCoin}</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('income_asset')}</Typography>
              <Typography>0.63 {depositPoolCoin}</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('synthetic_assets')}</Typography>
              <Typography>9.63 H{depositPoolCoin}</Typography>
            </Grid>
            <Grid container justifyContent="space-around" alignItems="center" direction="column">
              <Typography>{t('operating')}</Typography>
              <Grid container wrap="nowrap">
                <Button variant="contained" color="primary" className={classes.button} style={{ marginRight: '22px' }}>
                  {t('deposit')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => navigate(`/close/${depositPoolCoin}/convert`)}
                >
                  {t('withdraw')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        {/* stake */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('stake')}</Typography>
          <Divider className={classes.divider} />

          <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('pledged_assets')}</Typography>
              <Grid container alignItems="center">
                <Avatar src={Icons.btcb} className={classes.avatar} />
                <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('annualized_income')}</Typography>
              <Typography>12.36% </Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('pledged_assets_value')}</Typography>
              <Typography>10 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('token_reward')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" alignItems="center" direction="column">
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
          <Grid container justifyContent="space-between" style={{ paddingTop: '27px' }}>
            <Grid container alignItems="center" style={{ width: 'auto' }}>
              <Avatar src={Icons.alpaca} />
              <span style={{ marginLeft: '5px' }}> Token {t('rewards')}</span>
            </Grid>
            <Typography style={{ fontSize: '36px' }}>826.23</Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{ marginRight: '63px', height: '40px' }}
            >
              {t('receive')}
            </Button>
          </Grid>
        </Card>
        {/* leverage */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('leverage_mining')}</Typography>
          <Divider className={classes.divider} />

          <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('total_asset_value')}</Typography>
              <Grid container alignItems="center">
                <Avatar src={Icons.btcb} className={classes.avatar} />
                <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('debt_value')}</Typography>
              <Typography>12.36% </Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('annualized_income')}</Typography>
              <Typography>10 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('debt_ratio')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('liquidation_debt_ratio')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('risk_factor')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('token_reward')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" alignItems="center" direction="column">
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
          <Grid container justifyContent="space-between" style={{ paddingTop: '27px' }}>
            <Grid container alignItems="center" style={{ width: 'auto' }}>
              <Avatar src={Icons.alpaca} />
              <span style={{ marginLeft: '5px' }}> Token {t('rewards')}</span>
            </Grid>
            <Typography style={{ fontSize: '36px' }}>826.23</Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{ marginRight: '63px', height: '40px' }}
            >
              {t('receive')}
            </Button>
          </Grid>
        </Card>
        {/* liquidation */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('liquidation')}</Typography>
          <Divider className={classes.divider} />

          <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('trading_pair')}</Typography>
              <Grid container alignItems="center">
                <Avatar src={Icons.btcb} className={classes.avatar} />
                <Typography style={{ margin: '0px 5px' }}>BTCB</Typography>
                <Avatar src={Icons.cake} className={classes.avatar} />
              </Grid>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('liquidated_asset_value')}</Typography>
              <Typography>12.36% </Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('debt_value')}</Typography>
              <Typography>10 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('liquidation_penalty')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
            <Grid container justifyContent="space-around" direction="column">
              <Typography>{t('refund_amount')}</Typography>
              <Typography>0.63 BTCB</Typography>
            </Grid>
          </Grid>
        </Card>

        {/* lock-up */}
        <Card className={classes.card} style={{ paddingBottom: '42px' }}>
          <Typography className={classes.cardTitle}>{t('lock-up')}</Typography>
          <Grid>
            <Divider className={classes.divider} />

            <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('provide_liquidity')}</Typography>
                <Grid container alignItems="center">
                  <Avatar src={Icons.alpaca} className={classes.avatar} />
                  <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('locked_position')}</Typography>
                <Typography>12.36% </Typography>
              </Grid>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('annualized_income')}</Typography>
                <Typography>10 BTCB</Typography>
              </Grid>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('annualized_income')}</Typography>
                <Typography>0.63 BTCB</Typography>
              </Grid>
              <Grid container justifyContent="space-around" alignItems="center" direction="column">
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
            <Grid container justifyContent="space-between" style={{ paddingTop: '27px' }}>
              <Grid container alignItems="center" style={{ width: 'auto' }}>
                <Avatar src={Icons.alpaca} />
                <span style={{ marginLeft: '5px' }}> Token {t('rewards')}</span>
              </Grid>
              <Typography style={{ fontSize: '36px' }}>826.23</Typography>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                style={{ marginRight: '63px', height: '40px' }}
              >
                {t('receive')}
              </Button>
            </Grid>
          </Grid>

          <Grid style={{ marginTop: '80px' }}>
            <Divider className={classes.divider} />

            <Grid container wrap="nowrap" justifyContent="center" style={{ height: '156px' }}>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('single_currency_lock')}</Typography>
                <Grid container alignItems="center">
                  <Avatar src={Icons.alpaca} className={classes.avatar} />
                  <Typography style={{ marginLeft: '5px' }}>BTCB</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('locked_position')}</Typography>
                <Typography>4 BTCB </Typography>
              </Grid>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('locked_up_value')}</Typography>
                <Typography>236.58%</Typography>
              </Grid>
              <Grid container justifyContent="space-around" direction="column">
                <Typography>{t('annualized_income')}</Typography>
                <Typography>0.63 BTCB</Typography>
              </Grid>
              <Grid container justifyContent="space-around" alignItems="center" direction="column">
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
            <Grid container justifyContent="space-between" style={{ paddingTop: '27px' }}>
              <Grid container alignItems="center" style={{ width: 'auto' }}>
                <Avatar src={Icons.alpaca} />
                <span style={{ marginLeft: '5px' }}> Token {t('rewards')}</span>
              </Grid>
              <Typography style={{ fontSize: '36px' }}>826.23</Typography>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                style={{ marginRight: '63px', height: '40px' }}
              >
                {t('receive')}
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Wrapper>
    </Paper>
  );
};

export default Profile;

