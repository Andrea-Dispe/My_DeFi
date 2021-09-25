import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import i18next from 'i18next';

export default function LanguageSwitch({ languages }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang) => {
    i18next.changeLanguage(lang.code)
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((lang, index) => (
          <MenuItem key={index} onClick={() => handleClose(lang)}>
            <span className={`flag-icon flag-icon-${lang.country_code}`}> {lang.country_code}</span>
            {lang.country_code}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
