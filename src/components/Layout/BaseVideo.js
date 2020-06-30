import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Loading from "./Loading";
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	BaseVideoContainer: {
		display: "flex",
		flexDirection: "column",
		position: "relative",
		width: "100%",
		flex: "1 1 100%",
		textAlign: "center",
		backgroundColor: "black",
		border: "1px solid",
		borderColor: theme.palette.grey[100],
		borderRadius: "1em",
		overflow: "hidden",
	},
	MatchHeight: {
		height: "100%",
	},
	BaseVideoBanner: {
		position: "absolute",
		width: "100%",
		padding: ".5em",
		textAlign: "center",
		justifyContent: "center",
		backgroundColor: "rgba(1, 1, 1, .25)",
		color: theme.palette.grey[200],
		overflow: "hidden",
		borderBottom: "1px solid " + theme.palette.grey[400],
		height: "2.5em",
		minHeight: "2.5em",
		display: "flex",
		flex: "0 0 2.5em",
		bottom: "0px",
	},
	BaseVideoInnerContainer: {
		flex: "1 1",
		overflow: "hidden",
	},
	BaseVideoVideo: {
		textAlign: "center",
		verticalAlign: "bottom",
		height: "100%",
		width: "100%",
	},
}));

const BaseVideo = (props) => {
	const { stream, change, match = "width" } = props;
	const classes = useStyles();
	const videoRef = useRef();
	const containerRef = useRef();
	const [ourState, setOurState] = useState("new");
	const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

	useEffect(() => {
		const localRef = videoRef.current;
		return function cleanup() {
			setOurState("closed");
			if (localRef)
				localRef.removeEventListener('loadedmetadata', onLoadMetaData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
			setOurState("running");
		}
	}, [videoRef, stream, change])

	const showTitlebar = () => {
		if (props.videoBanner) {
			return <div className={classes.BaseVideoBanner}>{props.videoBanner}</div>
		}
	}

	const onLoadMetaData = (event) => {
		console.log(event)
		if (event.target.videoHeight) {
			if ((event.target.videoHeight !== videoDimensions.height) ||
				(event.target.videoWidth !== videoDimensions.width)) {
				setVideoDimensions({
					height: event.target.videoHeight,
					width: event.target.videoWidth
				})
			}
		}
	}

	if (ourState === 'new') {
		if (videoRef.current && stream) {
			videoRef.current.addEventListener('loadedmetadata', onLoadMetaData);
			setOurState("connecting");
		}
	}

	let containerClass = classes.BaseVideoContainer;
	if (match === "height")
		containerClass += " " + classes.MatchHeight;

	return (
		<div className={containerClass} ref={containerRef} >
			{
				stream === null ? <Loading /> : (
					<div className={classes.BaseVideoInnerContainer}>
						<video
							autoPlay
							playsInline
							controls={false}
							ref={videoRef}
							className={classes.BaseVideoVideo}
							muted={props.muted}
						/>
						{showTitlebar()}
					</div>

				)
			}
		</div>
	)
}
BaseVideo.defaultProps = {
	muted: false,
	stream: null,
	onLoadMetaData: () => { }
};
export default BaseVideo;