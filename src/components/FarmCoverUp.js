
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import excl from '../icons/excl.png';
import rightarrow from '../icons/rightarrow.png';

//data
import Icons from '../icons/icons';

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
  card: {
    padding: '32px 35px 93px',
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2D' : '#FFFFFF',
    marginTop: '18px',
    marginBottom: '26px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgb(49 55 69 / 15%)',
  },
  textSubtitles: {
    fontSize: '18px',
  },
  walletBalance: {
    marginBottom: '7px',
    opacity: '0.6',
    fontSize: '14px',
  },
  divider: {
    backgroundColor: '#C6C6C8',
    opacity: '0.4',
  },
  suppliedSwappedToken: {
    padding: '17px 0px 17px 18px',
    textTransform: 'uppercase',
  },
  percentage: {
    margin: '21px 0px 55px',
  },
  swapData: {
    padding: '24px 0px',
  },
  textData: {
    textTransform: 'uppercase',
    display: 'flex',
  },
  textDull: {
    textDecoration: 'line-through',
    color: '#BEBEBE',
  },spaceSides: {
    margin: '0px 5px'
  },
  button: {
    width: '148px',
    fontSize: '18px',
  },
}));

const FarmCoverUp = () => {
  const { pairs } = useParams();
  const { t } = useTranslation();
  const classes = useStyles();
  const [suppliedToken, swappedToken] = pairs.toLowerCase().split('-');

  return (
    <Paper className={classes.root}>
      <Wrapper>
        <Typography className={classes.title}>| &nbsp; {t('cover_up')}</Typography>

        <Card className={classes.card}>
          <Typography className={`${classes.subTitle} ${classes.textSubtitles}`}>{t('invested_assets')}</Typography>

          <Grid style={{ paddingTop: '35px' }}>
            <Typography className={classes.walletBalance}>{t('wallet_balance')}: 2.46</Typography>
            <Divider className={classes.divider} />
            <Grid container wrap="nowrap">
              <Grid container alignItems="center">
                <Avatar src={Icons[suppliedToken]} />
                <Typography className={classes.suppliedSwappedToken}>6.456789101112</Typography>
              </Grid>
              <Grid container justify="flex-end">
                <Typography className={classes.suppliedSwappedToken}>{suppliedToken}</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>

          <Grid container justify="space-between" style={{ margin: '21px 0px 55px' }}>
            {[25, 50, 75, 100].map((percentage) => (
              <Button className={classes.button} variant="contained" color="primary" key={percentage}>
                {percentage}%
              </Button>
            ))}
          </Grid>

          <Grid>
            <Typography className={classes.walletBalance}>{t('wallet_balance')}: 2.46</Typography>
            <Divider className={classes.divider} />
            <Grid container wrap="nowrap">
              <Grid container alignItems="center">
                <Avatar src={Icons[swappedToken]} />
                <Typography className={classes.suppliedSwappedToken}>6.456789101112</Typography>
              </Grid>
              <Grid container justify="flex-end">
                <Typography className={classes.suppliedSwappedToken}>{swappedToken}</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Grid>

          <Grid container justify="space-between" className={classes.percentage}>
            {[25, 50, 75, 100].map((percentage) => (
              <Button className={classes.button} variant="contained" color="primary" key={percentage}>
                {percentage}%
              </Button>
            ))}
          </Grid>

          <Divider className={classes.divider} />
          <Grid className={classes.swapData} container justify="space-between">
            <Typography>PancakeSwap {t('transaction_fees_and_slippage')}</Typography>
            <Typography>0.12%</Typography>
          </Grid>
          <Divider className={classes.divider} />
          <Grid className={classes.swapData} container justify="space-between">
            <Typography>PancakeSwap {t('add_asset_value')}</Typography>
            <Typography className={classes.textData}>
              236.77 {swappedToken} + 1.63 {suppliedToken}{' '}
            </Typography>
          </Grid>
          <Divider className={classes.divider} />

          <Grid style={{ marginTop: '96px' }}>
            <Divider className={classes.divider} />

            <Grid className={classes.swapData} container justify="space-between">
              <Typography>
                {t('updated_debt_ratio')}
                <img src={excl} style={{ marginLeft: '5px' }} alt="exclamation point icon"/>
              </Typography>

              <Typography className={classes.textData}>
                <span className={classes.textDull}>49.26%</span> <img src={rightarrow} className={classes.spaceSides} alt="right arrow icon"/> 39.26%{' '}
              </Typography>
            </Grid>

            <Divider className={classes.divider} />

            <Grid className={classes.swapData} container justify="space-between">
              <Typography>{t('updated_risk_factor')}</Typography>
              <Typography className={classes.textData}>
                <span className={classes.textDull}>49.26%</span>{' '}
                <img src={rightarrow} className={classes.spaceSides} alt="right arrow icon" /> 39.26%{' '}
              </Typography>
            </Grid>
            <Divider className={classes.divider} />

            <Grid className={classes.swapData} style={{ height: '65.74px' }} container justify="space-between">
              <Typography>{t('updated_total_asset_value')}</Typography>
              <Typography className={classes.textData}>
                <Grid container direction="column" alignItems="flex-end" style={{ marginTop: '-10px' }}>
                  <span className={classes.textDull}>4.03ETH+1，027.71BTCB</span>
                  <Grid container alignItems="center">
                    <img src={rightarrow} className={classes.spaceSides} alt="right arrow icon"/>
                    <span>5.25ETH+1，339.10BTCB</span>
                  </Grid>
                </Grid>
              </Typography>
            </Grid>

            <Divider className={classes.divider} />
          </Grid>
        </Card>
        <Grid container justify="center" style={{ padding: '66px 385px' }}>
          <Button variant="contained" color="primary" className={classes.button}>
            {t('cover_up')}
          </Button>
        </Grid>
      </Wrapper>
    </Paper>
  );
};

export default FarmCoverUp;
