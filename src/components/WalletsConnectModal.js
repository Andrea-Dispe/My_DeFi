import { makeStyles, withStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icons from '../icons/icons';

import { useTranslation } from 'react-i18next';

import { useWeb3React } from '@web3-react/core';
import { Injected } from '../connectors';

const Header = withStyles({
  root: {
    padding: '42px 0px',
  },
})(CardHeader);

const Content = withStyles({
  root: {
    padding: '0px 60px',
  },
})(CardContent);

const WalletAvatar = withStyles({
  img: {
    objectFit: 'contain',
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
    top: '40px',
    right: '4px',
  },
}));

const WalletMetamaskConnected = ({ handleWalletClose, isOpen, connectMetamask, connnectWalletConnect }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { activate } = useWeb3React();

  const handleClick = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
      return;
    }

    try {
      console.log('Attempting to activate MetaMask connector...');

      // First activate the connector - this calls getLibrary
      await activate(Injected);
      console.log('MetaMask connector activated successfully');

      // Then try to switch to BSC Mainnet (0x38)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
        console.log('Switched to BSC Mainnet');
      } catch (switchError) {
        // If the chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          console.log('BSC chain not found, adding it...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
              },
            ],
          });
        } else {
          console.error('Error switching chain:', switchError);
        }
      }

      handleWalletClose();
    } catch (error) {
      console.error('Error activating connector:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleWalletClose} aria-labelledby="Popup wallet choice" aria-describedby="Popup menu window to choose the wallet to connect to">
      <Card className={classes.cardWrapper}>
        <Grid>
          <Header title={t('connect_wallet')} className={classes.cardTitle} />
          <Button className={classes.closeModal} onClick={handleWalletClose}>
            X
          </Button>
          <Content>
            <CardActions className={classes.cardWalletWrapper}>
              <Button className={classes.cardButton} onClick={handleClick}>
                <Grid container justify="space-between" className={classes.walletContainer}>
                  <Typography className={classes.cardText}>MetaMask</Typography>
                  <WalletAvatar src={Icons.metamask} />
                </Grid>
              </Button>
            </CardActions>
            <CardActions className={classes.cardWalletWrapper}>
              <Button className={classes.cardButton} onClick={connnectWalletConnect}>
                <Grid container justify="space-between" className={classes.walletContainer}>
                  <Typography className={classes.cardText}>Wallet Connect</Typography>
                  <WalletAvatar src={Icons.walletConnect} className={classes.walletAvatar} />
                </Grid>
              </Button>
            </CardActions>
          </Content>
        </Grid>
      </Card>
    </Modal>
  );
};

export default WalletMetamaskConnected;
