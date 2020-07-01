import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MicOff from '@material-ui/icons/MicOff';
import Mic from '@material-ui/icons/Mic';
import VideoStats from "./VideoStats";
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	BannerContainer: {
		padding: ".5em",
		//textAlign: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(1, 1, 1, .25)",
		color: theme.palette.grey[200],
		overflow: "hidden",
		borderBottom: "1px solid " + theme.palette.grey[400],
		display: "flex",
		flex: "0 0 2.5em",
	},
	BannerLeft: {
		paddingLeft: "8px",
		textAlign: "left",
		zIndex: 2,
	},
	BannerCenter: {
		zIndex: 2,
		textAlign: "center",
		flex: "1 1"
	},
	BannerRight: {
		zIndex: 2,
		paddingRight: "8px",
		textAlign: "right",
	}
}));

const VideoBanner = (props) => {
	const { name, peer } = props;
	const classes = useStyles();
	const [audioMuted, setAudioMuted] = useState(null);

	useEffect(() => {
		if (peer && peer.meanderPeer && peer.meanderPeer.remoteStream) {
			const audio = peer.meanderPeer.remoteStream.getAudioTracks()
			if (audio) audio.forEach((track) => {
				if (track.enabled === audioMuted) {
					track.enabled = !audioMuted;
				}
			})
		}
	}, [audioMuted, peer])

	const toggleMute = () => {
		console.log("toggle")
		setAudioMuted(!audioMuted);
	}

	if (peer && peer.meanderPeer && peer.meanderPeer.remoteStream && (audioMuted === null)) {
		console.log(peer.meanderPeer.remoteStream)
		const audio = peer.meanderPeer.remoteStream.getAudioTracks()
		if (audio) audio.forEach((track) => {
			setAudioMuted(!track.enabled);
			console.log(audio)
		})

	}

	return (
		<div className={classes.BannerContainer}>
			<div className={classes.BannerLeft}>
				{
					peer && (
						audioMuted ? <MicOff fontSize="small" onClick={toggleMute} /> :
							<Mic fontSize="small" onClick={toggleMute} />

					)
				}

			</div>
			<div className={classes.BannerCenter}>{name}</div>
			<div className={classes.BannerRight}>
				<VideoStats name={name} peer={peer} />
			</div>
		</div >
	)
}
export default VideoBanner;