import React from 'react';
import { makeStyles } from '@material-ui/styles';
import RemoteVideo from '../RemoteVideo';
import withPip from "./withPiP";

const useStyles = makeStyles(theme => ({
	containerPortrait: {
		height: "100%",
	},
	containerLandscape: {
		height: "100%"
	},

	videoLandscape: {
		width: "50%",
		float: "left",
		height: "100%"
	},
	videoPortrait: {
		width: "100%",
		float: "left",
		height: "50%"
	},
}));

const Screen3PiP = (props) => {
	const { participants, dimensions } = props;
	const classes = useStyles();

	const portrait = dimensions.height > dimensions.width;
	const containerClass = (portrait) ? classes.containerPortrait : classes.containerLandscape
	const videoClass = (portrait) ? classes.videoPortrait : classes.videoLandscape

	const peerVideo = (peer) => (
		<div className={videoClass} key={peer.id}>
			<RemoteVideo peer={peer} topBanner={peer.name} muted={false} change={props.remoteStreamsChanged} match="height" />
		</div>
	)

	return (
		<div className={containerClass}>
			{participants.map((peer) => peerVideo(peer))}
		</div>
	)
}
export default withPip(Screen3PiP);
