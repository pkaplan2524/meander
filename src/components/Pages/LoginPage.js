import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert'
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { startLogin } from "../../utils/authUser";
import validator from 'validator';
import ResponsiveImage from "../Layout/ResponsiveImage";

import xs from "../../assets/images/logo-xs.png"
import sm from "../../assets/images/logo-sm.png"
import md from "../../assets/images/logo-md.png"
import lg from "../../assets/images/logo-lg.png"
import max from "../../assets/images/logo-max.png"

const imagesObj = {
	sm: xs,
	md: sm,
	lg: md,
	xl: lg,
	max: max
};

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://material-ui.com/">
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
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
		marginLeft: "auto",
		marginRight: "auto",
		padding: theme.spacing(4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		maxWidth: "500px"
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
	logo: {
		width: "75%"
	}
}));

function SignInSide(props) {
	const classes = useStyles();
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [hasFailed, setHasFailed] = useState(false);

	const handleLogin = (e) => {
		props.startLogin(userName, password).catch((e) => {
			setHasFailed(true);
		});
	}

	const onUserNameChange = (e) => {
		setUserName(e.target.value);
	};

	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const onKeyUpPW = (e) => {
		if (e.keyCode === 13) {
			handleLogin(e)
		}
	};

	const validate = () => {
		return (validator.isEmail(userName) && password.length > 5)
	}

	const canSignIn = validate();
	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<ResponsiveImage images={imagesObj} alt="Logo" className={classes.logo} />
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
         		 </Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							color="secondary"
							onChange={onUserNameChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							color="secondary"
							onChange={onPasswordChange}
							onKeyUp={onKeyUpPW}
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="secondary" />}
							label="Remember me"

						/>
						{
							(!hasFailed) || (
								<Alert severity="error">
									The username or password you used was incorrect. Please try again.
								</Alert>
							)
						}
						<Button
							type="button"
							fullWidth
							variant="contained"
							color="secondary"
							className={classes.submit}
							onClick={handleLogin}
							disabled={!canSignIn}
						>
							Sign In
            		</Button>
						<Grid container>
							<Grid item xs={6}>
								<Link href="/forgot" variant="body2">
									Forgot password?
                			</Link>
							</Grid>
							<Grid item xs={6}>
								<Link href="/signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
						<Box mt={5}>
							<Copyright />
						</Box>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
//*****************************************************************************
const mapStateToProps = (state) => ({
	// isAuth: !!state.auth.user
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
	startLogin: (userName, password) => startLogin(dispatch, userName, password)
});
//*****************************************************************************
export default connect(mapStateToProps, mapDispatchToProps)(SignInSide);