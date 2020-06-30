import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { startLogout } from "../../utils/authUser";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://meander-pk.herokuapp.com">
				Peter Kaplan
      </Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		/* Change this to perm image */
		backgroundImage: 'url(https://source.unsplash.com/random)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

function LogoutPage(props) {
	const classes = useStyles();

	props.startLogout();

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={12} sm={12} md={12} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						You have successfully logged out
					 </Typography>

					<Link href="/" variant="body2">
						Login
               </Link>

					<Box mt={5}>
						<Copyright />
					</Box>

				</div>
			</Grid>
		</Grid>
	);
}
//*****************************************************************************
const mapStateToProps = (state) => ({
	isAuth: !!state.auth.user
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
	startLogout: () => startLogout(dispatch)
});
//*****************************************************************************
export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);