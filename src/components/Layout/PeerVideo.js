import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

//*****************************************************************************
const mapStateToProps = (state) => ({
	cameras: state.rtc.cameras,
	microphones: state.rtc.microphones,
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
});
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	container: {
		display: "flex",
		flexDirection: "column",
		position: "relative",
		width: "100%",
		height: "100%",
		textAlign: "center",
		backgroundColor: "black",
		overflow: "hidden",

	},
	title: {
		width: "100%",
		padding: ".5em",
		textAlign: "center",
		backgroundColor: theme.palette.grey[800],
		color: theme.palette.grey[200],
		overflow: "hidden",
		borderTop: "1px solid " + theme.palette.grey[400],
		borderRight: "1px solid " + theme.palette.grey[400],
		height: "2.5em",
		minHeight: "2.5em",
		display: "flex",
		flex: "0 0 2.5em"
	},
	vidContainer1: {
		position: "absolute",
		bottom: 0,
		top: "2.5em",
		left: 0,
		right: 0
	},
	vidContainer2: {
		position: "absolute",
		bottom: 0,
		top: 0,
		left: 0,
		right: 0
	},

	video: {
		textAlign: "center",
		verticalAlign: "bottom",
		height: "100%",
		width: "100%",

	},
	icon: {
		margin: "auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		flexDirection: "column",
		color: "white"
	}
}));

const BaseVideo = (props) => {
	const { stream } = props;
	const classes = useStyles();
	const videoRef = useRef();
	const containerRef = useRef();
	const [ourState, setOurState] = useState("new");
	// const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
	//const [customStyle] = useState({ width: "100%" });

	useEffect(() => {
		const localRef = videoRef.current;
		return function cleanup() {
			setOurState("closed");
			localRef.removeEventListener('loadedmetadata', onLoadMetaData);
			window.removeEventListener('resize', onResize);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const showTitlebar = () => {
		if (props.topBanner) {
			return <div className={classes.title}>{props.topBanner}</div>
		}
	}

	const onResize = (e) => {
		// if (videoRef.current) {
		// 	const aspectRatio = (videoDimensions.height / videoDimensions.width) * 100;
		// 	const containerAspectRatio = (videoRef.current.clientHeight / videoRef.current.clientWidth) * 100;
		// 	console.log(videoRef.current.getBoundingClientRect(), containerAspectRatio, aspectRatio);


		// 	const portraitVideo = videoDimensions.height > videoDimensions.width;
		// 	if (portraitVideo) {
		// 		setCustomStyle({ width: parseInt(aspectRatio).toString() + "%" })
		// 	}
		// 	else {
		// 		// setCustomStyle({ height: videoRef.current.offsetHeight + "px" })
		// 		console.log(videoRef.current.offsetHeight)
		// 	}
		// }
		// else console.log(videoRef)
	}

	const onLoadMetaData = (event) => {
		// if (ourState !== 'closed') {
		// 	setVideoDimensions({
		// 		height: event.target.videoHeight,
		// 		width: event.target.videoWidth
		// 	})
		// }
	}

	if (ourState === 'new') {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
			videoRef.current.addEventListener('loadedmetadata', onLoadMetaData);
			window.addEventListener('resize', onResize);
			setOurState("running");
		}
	}

	return (
		<div className={classes.container} ref={containerRef}>
			{showTitlebar()}
			{
				stream === null ?
					<div className={classes.icon} ><div><CircularProgress /></div> <div>loading...</div></div> :
					<React.Fragment></React.Fragment>
			}
			<div className={(props.topBanner) ? classes.vidContainer1 : classes.vidContainer2}>
				<video
					autoPlay
					playsInline
					controls={false}
					ref={videoRef}
					className={classes.video}
					muted={props.muted} />
			</div>
		</div>
	)
}
BaseVideo.defaultProps = {
	muted: false,
	stream: null,
	onLoadMetaData: () => { }
};
export default connect(mapStateToProps, mapDispatchToProps)(BaseVideo);