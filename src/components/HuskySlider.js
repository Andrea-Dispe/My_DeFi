import React from 'react';
import { withStyles, makeStyles } from '@material-ui/styles';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 45,
  },
  inputContainer: {
    // marginLeft: '22px',
    // top: '-6px',
    // backgroundColor: 'lightgrey',
    padding: '0px 10px 0px 0px',
    // borderRadius:' 5px',
  },
});



const CustomSlider = withStyles((theme) => ({
  root: {
    // color: '#52af77',
    // height: 800,
    // margin: '0px 25px'
  },
  thumb: {
    height: 20,
    width: 20,
    // backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -6,
    marginLeft: -10,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: '#FB646B',
  },
  active: {
    // border: '6px solid #FB646B',
    // borderRadius: '50%'
  },
  valueLabel: {
    left: 'calc(-50% + 13px)',
  },
  mark: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    marginTop: -2,
    marginLeft: -10,
    top: 10,
    color: '#C8C8CA',
  },
  markActive: {
    opacity: 1,
    backgroundColor: '#FB646B',
  },

  markLabel: {
    color:  theme.palette.mode === 'dark' ? '#FFFFFF' : 'rgba(0,0,0,0.65)',
    // colro: '#FB646B',
    fontSize: 15,
    marginTop: 5,
  },
  markLabelActive: {
    // border: '6px solid #FB646B',
    // borderRadius: '50%',
    color: '#FB646B',
    fontWeight: '500',
  },
  track: {
    height: 10,
    borderRadius: 30,
    color: '#FB646B',
  },
  rail: {
    height: 10,
    color: '#C8C8CA',
    borderRadius: 30,
  },
}))(Slider);

const CustomInput = withStyles({
  input: {
    // backgroundColor: 'lightgrey',
    padding: '5px 0px 5px 0px',
    borderRadius: '10px',
    fontSize: '18px',
    width: '57px',
    textAlign: 'center',
    '&[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
})(Input);

const CustomGrid = withStyles( theme => ({
  item: {
    marginLeft: '22px',
    top: '-6px',
    backgroundColor:  theme.palette.mode === 'dark' ? '#656568' : 'lightgrey',
    padding: '0px 10px 0px 0px',
    borderRadius: ' 5px',
  },
}))(Grid);

export default function HuskySlider({ handleSliderChange, handleInputChange, leverage, handleBlur }) {
  const sliderMarks = [
    { value: 1, label: '1.0x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2.0x' },
    { value: 2.5, label: '2.5x' },
    { value: 3, label: '3.0x' },
  ];

  const classes = useStyles();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs>
        <CustomSlider
          // valueLabelDisplay="auto"
          aria-label="Husky slider"
          // defaultValue="0"
          min={1}
          max={3}
          step={0.1}
          marks={sliderMarks}
          onChange={handleSliderChange}
          value={typeof leverage === 'number' ? leverage : 0}
        />
      </Grid>
      <CustomGrid item className={classes.inputContainer}>
        <CustomInput
          className={classes.input}
          value={leverage}
          margin="dense"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            // disabled: 'true',
            // readonly: 'true',
            step: 0.1,
            min: 1.0,
            max: 3.0,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
          autoFocus={true}
          disableUnderline
          // InputAdornment="disablePointerEvents"
        />
        X
      </CustomGrid>
    </Grid>
  );
}
