import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
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




