import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '1240px', margin: '0px auto'
  }
}))

const Wrapper = (props) => {
  const classes = useStyles();
  const {children} = props;
  return (
    <div className={classes.wrapper}>{children}</div>
   );
}

export default Wrapper;




