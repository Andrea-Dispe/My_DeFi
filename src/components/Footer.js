import React from 'react';
import {Button, ButtonGroup, Container,Divider, Avatar } from '@material-ui/core';
import { makeStyles, withStyles} from '@material-ui/styles';

//data
import footerLinks from '../data/footerLinks'

const useStyles = makeStyles((theme) => ({
  footer: {
    height: '142px',
    position: 'relative',
    bottom: '0px',
    display: 'flex',
    justifyContent: 'center',
  },

}));

const FooterAvatars = withStyles({
  root: {
    borderRadius: '0px',
  },
  img: {
    objectFit: 'contain'
  }
})(Avatar);


const Footer = () => {
  const classes = useStyles();

  return (

    <Container className={`${classes.footer}`}>
    <Divider />
      <ButtonGroup>
        {footerLinks.map((item, index) => (
          <Button key={index} style={{border: 'none'}} startIcon={<FooterAvatars src={item.icon} />}></Button>
        ))}
      </ButtonGroup>
    </Container>

  );
};

export default Footer;
