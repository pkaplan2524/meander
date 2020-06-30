import React from 'react';
import { makeStyles } from '@material-ui/styles';
import RemoteVideo from '../RemoteVideo';
import withPip from "./withPiP";

const useStyles = makeStyles(theme => ({
	container: {
		position: "relative",
		height: "100%"
	},
}));

const Screen2PiP = (props) => {
	const { participants } = props;
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<RemoteVideo peer={participants[0]} videoBanner={participants[0].name} muted={false} match="height" />
		</div>
	)
}
export default withPip(Screen2PiP);