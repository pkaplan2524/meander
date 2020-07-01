import React from 'react';
import { makeStyles } from '@material-ui/styles';
import RemoteVideo from '../RemoteVideo';
import BaseVideo from '../BaseVideo';

const useStyles = makeStyles(theme => ({
	container: {
		height: "100%",
		padding: "8px"
	},
	row: {
		height: "50%",
	},
	quadrant: {
		width: "50%",
		float: "left",
		height: "100%"
	}
}));

const Screen4Quadrants = (props) => {
	const { localStream, participants, name } = props;
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<div className={classes.row}>
				<div className={classes.quadrant}>
					<RemoteVideo peer={participants[0]} showBanner={true} name={participants[0].name} muted={false} change={props.remoteStreamsChanged} match="height" />
				</div>
				<div className={classes.quadrant}>
					<RemoteVideo peer={participants[1]} showBanner={true} name={participants[1].name} muted={false} change={props.remoteStreamsChanged} match="height" />

				</div>
			</div>
			<div className={classes.row}>
				<div className={classes.quadrant}>
					<RemoteVideo peer={participants[2]} showBanner={true} name={participants[2].name} muted={false} change={props.remoteStreamsChanged} match="height" />
				</div>
				<div className={classes.quadrant}>
					<BaseVideo stream={localStream} muted={true} showBanner={true} name={name + " (Me)"} match="height" />
				</div>
			</div>
		</div>
	)
}
export default Screen4Quadrants;