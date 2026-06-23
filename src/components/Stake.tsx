import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
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
    boxSizing: 'border-box',
    padding: '30px 40px 20px',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    marginBottom: '100px',
  },
  cardHeader: {
    padding: '0px',
    marginBottom: '69px',
  },
  cardContent: {
    padding: '0px',
  },
  stakeApy: {
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
}));

export default function Stake({ stakes }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Typography style={{ fontSize: '24px', color: '#ffffff', margin: '46px 0px 40px' }}>| &nbsp; {t('stake')}</Typography>
      <Grid container className={classes.gridContainer}>
        {stakes.map((stake) => (
          <Grid key={stake.name} xs={12} sm={6} md={4} item className={classes.gridItem}>
            <Avatar alt={stake.name} src={stake.icon} className={classes.avatar}></Avatar>
            <Card className={`${classes.root} ${classes.cardContainer}`}>
              <CardHeader title={stake.name} className={`${classes.textCentered} ${classes.cardHeader}`} />
              <CardContent className={classes.cardContent}>
                <Typography variant="h4" className={`${classes.textCentered} ${classes.stakeApy}`}>
                  {stake.apy}
                  <span style={{ fontSize: '24px' }}>%</span>
                </Typography>
                <Typography className={`${classes.textCentered} ${classes.apr}`}>{t('annualized_rate_of_return')}</Typography>
                <Divider className={classes.divider} />

                <Grid container justifyContent={'space-between'} className={classes.dt}>
                  <Typography>{t('total_deposit')}</Typography>
                  <Typography>{stake.TVL}</Typography>
                </Grid>

                <Grid container justifyContent={'space-between'} className={classes.dt}>
                  <Typography>{t('total_borrowed')}</Typography>
                  <Typography>{stake.saved}</Typography>
                </Grid>

                <Grid container justifyContent={'space-between'} className={classes.dt}>
                  <Typography>{t('capital_utilization_rate')}</Typography>
                  <Typography>{stake.dailyOutput}</Typography>
                </Grid>
              </CardContent>

              <CardActions disableSpacing className={classes.buttonGroup}>
                <Button variant="contained" color="primary" className={classes.button}>
                  {t('deposit')}
                </Button>
                <Button variant="contained" color="primary" className={classes.button}>
                  {t('withdraw')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

