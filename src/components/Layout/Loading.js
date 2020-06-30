import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	LoadingContainer: {
		display: "flex",
		flex: "1 1 100%",
		flexDirection: "column",
		fontSize: "inherit",
		height: "100%",
		overflow: "hidden",
		position: "relative",
		width: "100%",
	},
	LoadingIconContainer: {
		margin: "auto",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		color: theme.palette.primary.main,

	},
	LoadingIcon: {
		fontSize: "4em"
	}
}));

const Loading = (props) => {
	const classes = useStyles();
	return (
		<div className={classes.LoadingContainer} >
			<div className={classes.LoadingIconContainer} >
				<div>
					<CircularProgress className={classes.LoadingIcon} color="primary" />
				</div>
				<div>
					loading...
				</div>
			</div>
		</div>
	)
}
export default Loading;