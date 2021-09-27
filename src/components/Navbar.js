// TODO: useContext and useReducer to be implemented (currently using web3react as context, see in future if that is not enough)
import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { truncateAddress } from '../utils';

// Mui
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

//Icons
import Icons from '../icons/icons';
import { MenuList } from '@material-ui/core';
import Brightness3Icon from '@material-ui/icons/Brightness3';

// web3
import WalletsConnectModal from './WalletsConnectModal';
import WalletMetamaskConnected from './WalletMetamaskConnected';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles((theme) => ({
  menuContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  navbar: {
    height: '111px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWallet: {
    borderRadius: '21.54px',
    borderColor: '#FBFBFD',
    borderWidth: '2px',
    borderStyle: 'solid',
    fontSize: '18px',
    padding: '1px 14px',
    color: '#ffffff',
    height: '35px',
    alignSelf: 'center',
    minWidth: '130px',
    maxWidth: '300px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '1240px',
    boxSizing: 'border-box',
    padding: '0px',
  },
  button: {
    color: '#ffffff',
    fontSize: '18px',
    margin: '0px',
    padding: '0px',
    borderBottom: '4px solid transparent',
    textTransform: 'uppercase',
  },
  hgbtn: {
    height: '55px',
  },
  title: {
    fontSize: '36px',
    color: '#ffffff',
    padding: '20px',
    marginRight: '15px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  selected: {
    borderBottom: '4px solid #ffffff',
    backgroundColor: 'transparent',
  },
}));

export default function Navbar({
  changeTheme,
  darkMode,
  languages,
  connectMetamask,
  connnectWalletConnect,
  isConnected,
  setIsConnected,
}) {
  const menuItem = ['saving-pool', 'stake', 'farm', 'lock-up', 'profile'];
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  let { account, active } = useWeb3React();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang) => {
    i18next.changeLanguage(lang.code);
    setAnchorEl(null);
  };

  const handleWalletsOpen = () => {
    setIsOpen(true);
  };
  const handleWalletClose = () => {
    setIsOpen(false);
  };

  if (active) {
    localStorage.setItem('active', active);
  }

  return (
    <AppBar align="center" color="inherit" elevation={0} position="static" className={`${classes.navbar}`}>
      <Toolbar className={classes.toolbar}>
        <Link to="/" className={classes.logoContainer}>
          <Typography variant="h6" className={classes.title} align="left">
            DeFi Farm
          </Typography>
        </Link>
        <div className={classes.menuContainer}>
          <MenuList
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-around',
            }}
          >
            {menuItem.map((item) => (
              <MenuItem
                classes={{
                  selected: classes.selected,
                }}
                style={{ backgroundColor: 'transparent' }}
                className={`${classes.button} ${classes.hgbtn}`}
                component={Link}
                to={item === 'saving-pool' ? '/' : `/${item}`}
                key={item}
                selected={
                  item === 'saving-pool'
                    ? location.pathname === '/' || location.pathname.includes('withdraw') || location.pathname.includes('deposit')
                    : location.pathname.includes(item)
                }
              >
                {t(`${item}`)}
              </MenuItem>
            ))}
          </MenuList>

          <Button className={classes.itemWallet} onClick={handleWalletsOpen}>
            {!active ? t('connect_wallet') : truncateAddress(account)}
          </Button>

          {!active ? (
            <WalletsConnectModal
              handleWalletClose={handleWalletClose}
              isOpen={isOpen}
              connectMetamask={connectMetamask}
              connnectWalletConnect={connnectWalletConnect}
            />
          ) : (
            <WalletMetamaskConnected handleWalletClose={handleWalletClose} isOpen={isOpen} />
          )}
        </div>
        <Button onClick={changeTheme} style={{ padding: '0px' }}>
          {darkMode ? <Brightness3Icon className={classes.button} /> : <WbSunnyIcon className={classes.button} />}
        </Button>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.button}>
          CN/EN
        </Button>
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {languages.map((lang) => (
            <MenuItem key={lang.country_code} style={{ color: 'white', fontSize: '17px' }} onClick={() => handleClose(lang)}>
              <span className={`flag-icon flag-icon-${lang.country_code}`}></span>
              <span style={{ marginLeft: '6px' }}>{lang.name}</span>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
