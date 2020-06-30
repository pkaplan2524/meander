import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	container: {
		display: "flex",
		flexDirection: "column",
		position: "relative",
		width: "100%",
		flex: "1 1 100%",
		overflow: "hidden",
		height: "100%",
		fontSize: "inherit"
	},
	loadingIconContainer: {
		margin: "auto",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		color: theme.palette.primary.main,

	},
	loadingIcon: {
		fontSize: "4em"
	}
}));

const Loading = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.container} >
			<div className={classes.loadingIconContainer} >
				<div>
					<CircularProgress className={classes.loadingIcon} color="primary" />
				</div>
				<div>
					loading...
				</div>
			</div>
		</div>
	)
}
export default Loading;