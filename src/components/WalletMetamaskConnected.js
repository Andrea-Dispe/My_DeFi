// TODO: Copy to the clipboard works because I hid the span with the full account address outside the visible page.
// would be better to find a better solution in future
// TODO: add change wallet functionality to its button


import { makeStyles, withStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icons from '../icons/icons';
import { useWeb3React } from '@web3-react/core';
import { truncateAddress, copyToClipboard} from '../utils';

import { useTranslation } from 'react-i18next';

const Header = withStyles({
  root: {
    padding: '23px 0px 35px',
    fontWeight: 'bold',
  },
})(CardHeader);

// const Content = withStyles({
//   root: {
//     padding: '0px 60px',
//   },
// })(CardContent);


const Clock = withStyles({
  img: {
    objectFit: 'contain',
    width: '25px',
    marginTop: '3px'
  },
})(Avatar);



const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    width: '550px',
    height: '330px',
    borderRadius: '30px',
    backgroundColor: '#F7F7F7',
    // color: '#000',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: '22px',
  },
  cardContent: {
    padding: '0px 90px',
  },
  cardWalletWrapper: {
    backgroundColor: '#060606',
    borderRadius: '20px',
    marginBottom: '30px',
  },
  cardButton: {
    width: '100%',
  },
  walletContainer: {
    padding: '0px 24px',
  },
  cardText: {
    color: '#ffffff',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: '19px',
  },
  walletAvatar: {
    borderRadius: '0px',
  },
  closeModal: {
    position: 'absolute',
    top: '20px',
    right: '4px',
  },
  button: {
    textTransform: 'none',
  },
  mainButton: {
    borderRadius: '25px',
    fontSize: '20px',
  },
  secondaryButton: {
    textDecoration: 'underline',
    padding: '0px'
  },
  address: {
    fontSize: '30px',
    fontWeight: 'bold',
  },
}));


const WalletsConnectModal = ({ handleWalletClose, isOpen }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {  account, deactivate } = useWeb3React();

  
  return (
    <Modal open={isOpen} onClose={handleWalletClose} aria-labelledby="Popup wallet choice" aria-describedby="Popup menu window to choose the wallet to connect to">
      <Card className={classes.cardWrapper}>
        <Grid>
          <Header title={t('account')} className={classes.cardTitle} />
          <Button className={classes.closeModal} onClick={handleWalletClose}>
            X
          </Button>
          <CardContent className={classes.cardContent}>
            <Grid container justify='center'>
              <Typography style={{fontSize: '18px'}}>{t('connected_with_metamask')}</Typography>
            </Grid>
            <Grid container justify='center' style={{padding: '25px 0px'}}>
              <Clock src={Icons.clock} />
              <Typography className={classes.address}>{truncateAddress(account, 6, 6)}</Typography>
              <span style={{position: 'absolute', left: '-99999px'}} id='address'>{account}</span>
            </Grid>
            <Grid container justify="space-around" style={{marginBottom: '30px'}}>
              <Button className={`${classes.button} ${classes.secondaryButton}`} onClick={() => copyToClipboard('address')}>{t('copy_address')}</Button>
              <Button className={`${classes.button} ${classes.secondaryButton}`} href={`https://bscscan.com/address/${account}`} target="_blank" >{t('view_on_bsc')}</Button>
            </Grid>
            <Grid container justify="center">
              <Button variant="contained" color="primary" className={`${classes.button} ${classes.mainButton}`} onClick={() => deactivate()}>
                {t('change_wallet')}
              </Button>
              {/* <CardActions className={classes.cardWalletWrapper}>
              <Button className={classes.cardButton} onClick={connectMetamask}>
                <Grid container justify="space-between" className={classes.walletContainer}>
                  <Typography className={classes.cardText}>MetaMask</Typography>
                  <WalletAvatar src={MetaMaskIcon}/>




                </Grid>
              </Button>
            </CardActions>
            <CardActions className={classes.cardWalletWrapper}>
              <Button className={classes.cardButton} onClick={connnectWalletConnect}>
                <Grid container justify="space-between" className={classes.walletContainer}>
                  <Typography className={classes.cardText}>Wallet Connect</Typography>
                  <WalletAvatar src={WalletConnectIcon} className={classes.walletAvatar} />
                </Grid>
              </Button>
            </CardActions> */}
            </Grid>
          </CardContent>
        </Grid>
      </Card>
    </Modal>
  );
};

export default WalletsConnectModal;
