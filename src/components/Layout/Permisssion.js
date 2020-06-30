import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
		fontSize: "2em",
		textAlign: "center",
		padding: "2em"
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
					Permission to use the camera and microphone was not granted. <br />Not much else to do here...maybe play cards or something.
				</div>
			</div>
		</div>
	)
}
export default Loading;