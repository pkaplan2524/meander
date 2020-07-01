import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import Popover from '@material-ui/core/Popover';
import { v4 as uuidv4 } from 'uuid';

//*****************************************************************************
const useStyles = makeStyles(theme => ({
	StatsPopup: {
		width: "20em",
		padding: "8px",
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
}));

const VideoStats = (props) => {
	const { peer } = props;
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [initalizedStats, setInitalizedStats] = useState(false);
	const [stats, setStats] = useState(null);
	const [bitrate, setBitrate] = useState(0);
	const [popoverId] = useState(uuidv4());

	useEffect(() => {
		return function cleanup() {
			if (initalizedStats) clearInterval(initalizedStats);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	if (peer && !initalizedStats) {
		const interval = setInterval(() => {
			setStats({
				connectionState: peer.meanderPeer.peerConnection.connectionState,
				iceConnectionState: peer.meanderPeer.peerConnection.iceConnectionState,
				signalingState: peer.meanderPeer.peerConnection.signalingState,
			});
			setBitrate((peer.meanderPeer.stats) ?
				((peer.meanderPeer.stats.outboundRtpVideo) ?
					peer.meanderPeer.stats.outboundRtpVideo.bitrate : 0) : 0);
		}, 1000);
		setInitalizedStats(interval)
	}

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	let iconColor = classes.BandwidthIconBad;
	if (bitrate > 1000)
		iconColor = classes.BandwidthIconGood;
	else if (bitrate > 600)
		iconColor = classes.BandwidthIconOK;

	const open = Boolean(anchorEl);
	return (
		peer ? (
			<React.Fragment>
				<div onClick={handlePopoverOpen}>
					<ImportExportIcon fontSize="small" className={iconColor} />
				</div>
				<Popover
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
					transformOrigin={{ vertical: 'top', horizontal: 'right', }}
					disableRestoreFocus
					id={popoverId}
					onClick={handlePopoverClose}
				>
					<div className={classes.StatsPopup}>
						<div><strong>Connection State</strong>: {stats && stats.connectionState}</div>
						<div><strong>Signaling State</strong>: {stats && stats.signalingState}</div>
						<div><strong>ICE Connection State</strong>: {stats && stats.iceConnectionState}</div>
						<hr />
						<strong>BitRate</strong>: {bitrate.toFixed(2)}
					</div>
				</Popover>
			</React.Fragment>
		) : <div></div>
	)
}
export default VideoStats;