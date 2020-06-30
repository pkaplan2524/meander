import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	PermissionContainer: {
		display: "flex",
		flexDirection: "column",
		position: "relative",
		width: "100%",
		flex: "1 1 100%",
		overflow: "hidden",
		height: "100%",
		fontSize: "inherit"
	},
	PermissionBody: {
		margin: "auto",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		color: theme.palette.primary.main,
		fontSize: "2em",
		textAlign: "center",
		padding: "2em"
	},
}));

const Loading = () => {
	const classes = useStyles();
	return (
		<div className={classes.PermissionContainer} >
			<div className={classes.PermissionBody} >
				<div>
					Permission to use the camera and microphone was not granted. <br />Not much else to do here...maybe play cards or something.
				</div>
			</div>
		</div>
	)
}
export default Loading;