import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import MicOff from '@material-ui/icons/MicOff';
import Mic from '@material-ui/icons/Mic';

import Popover from '@material-ui/core/Popover';
import { v4 as uuidv4 } from 'uuid';

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
	},
	BandwidthIconBad: {
		color: "red"
	},
	BandwidthIconOK: {
		color: "yellow"
	},
	BandwidthIconGood: {
		color: "green"
	},
	popover: {
		pointerEvents: 'none',
	},
	StatsPopup: {
		width: "20em",
		height: "6em",
		padding: "8px",
	}
}));

const VideoBanner = (props) => {
	const { name, peer } = props;
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [initalizedStats, setInitalizedStats] = useState(false);
	//	const [stats, setStats] = useState(null);
	const [bitrate, setBitrate] = useState(0);
	const [popoverId] = useState(uuidv4());
	const [audioMuted, setAudioMuted] = useState(null);

	useEffect(() => {
		return function cleanup() {
			if (initalizedStats) clearInterval(initalizedStats);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	if (peer && !initalizedStats) {
		const interval = setInterval(() => {
			const stats = peer.meanderPeer.stats;
			//	setStats(peer.meanderPeer.stats);
			setBitrate((stats) ? ((stats.outboundRtpVideo) ? stats.outboundRtpVideo.bitrate : 0) : 0)
		}, 1000);
		setInitalizedStats(interval)
	}

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const toggleMute = () => {
		console.log("toggle")
		setAudioMuted(!audioMuted);
	}

	let iconColor = classes.BandwidthIconBad;
	if (bitrate > 1000)
		iconColor = classes.BandwidthIconGood;
	else if (bitrate > 600)
		iconColor = classes.BandwidthIconOK;

	if (peer && peer.meanderPeer && peer.meanderPeer.remoteStream && (audioMuted === null)) {
		console.log(peer.meanderPeer.remoteStream)
		const audio = peer.meanderPeer.remoteStream.getAudioTracks()
		if (audio) audio.forEach((track) => {
			setAudioMuted(!track.enabled);
			console.log(audio)
			// if (track.enabled === audioPaused) {
			// 	track.enabled = !audioPaused;
			// }
		})

	}

	const open = Boolean(anchorEl);
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
				<div
					// aria-owns={open ? popoverId : undefined}
					// aria-haspopup="true"
					onClick={handlePopoverOpen}
				>
					<ImportExportIcon fontSize="small" className={iconColor} />
				</div>
				<Popover
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					disableRestoreFocus
					id={popoverId}
					onClick={handlePopoverClose}
				>
					<div className={classes.StatsPopup}>Bitrate: {bitrate.toFixed(2)}</div>
				</Popover>

			</div>
		</div>
	)
}
export default VideoBanner;