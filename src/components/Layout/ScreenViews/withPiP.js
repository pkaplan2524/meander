import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import BaseVideo from '../BaseVideo';

const PiPZIndex = 20;
const useStyles = makeStyles(theme => ({
	PiPContainerVideo: {
		position: "relative",
		height: "100%",
		padding: "8px"
	},
	PiPContainerOverlay: {
		top: "8px",
		right: "8px",
		left: "8px",
		bottom: "8px",
		position: "absolute",
		display: "flex",
		flexDirection: "column"
	},
	PiPInnnerConatiner: {
		display: "flex",
		flex: "1 1",
		position: "relative",
	},
	bannerAdjust: {
		height: "2.5em",
		position: "relative"
	},
	topRightMini: {
		position: "absolute",
		cursor: "pointer",
		top: 8,
		right: 8,
		width: "25%",
		zIndex: PiPZIndex,
	},
	topLeftMini: {
		position: "absolute",
		cursor: "pointer",
		top: 8,
		left: 8,
		width: "25%",
		zIndex: PiPZIndex,
	},
	topMiddleMini: {
		position: "absolute",
		cursor: "pointer",
		top: 8,
		left: "37.5%",
		width: "25%",
		zIndex: PiPZIndex,
	},
	bottomRightMini: {
		position: "absolute",
		cursor: "pointer",
		bottom: 8,
		right: 8,
		width: "25%",
		zIndex: PiPZIndex,
	},
	bottomLeftMini: {
		position: "absolute",
		cursor: "pointer",
		bottom: 8,
		left: 8,
		width: "25%",
		zIndex: PiPZIndex,
	},
	bottomMiddleMini: {
		position: "absolute",
		cursor: "pointer",
		bottom: 8,
		left: "37.5%",
		width: "25%",
		zIndex: PiPZIndex,
	},
	middleLeftMini: {
		position: "absolute",
		cursor: "pointer",
		top: "42%",
		left: 8,
		width: "25%",
		zIndex: PiPZIndex,

	},
	middleRightMini: {
		position: "absolute",
		cursor: "pointer",
		top: "42%",
		right: 8,
		width: "25%",
		zIndex: PiPZIndex,
	},
}));

const WithPiP = (Component) => {
	function WrappedComponent(props) {
		const { localStream, change, dimensions, showBanner } = props;
		const classes = useStyles();
		const [positionClass, setPositionClass] = useState(classes.topLeftMini)
		const miniRef = useRef();

		useState(() => {
			let pos = localStorage.getItem('PiP-Position');
			if (!classes[pos]) pos = false;
			pos = pos ? pos : classes.topLeftMini;
			setPositionClass(pos);
		}, [])

		const setPosition = (value) => {
			setPositionClass(value);
			localStorage.setItem('PiP-Position', value);
		}

		let heightStyle = { height: dimensions.width * 0.25 };
		if (localStream) {
			const trackSettings = localStream.getVideoTracks()[0].getSettings();
			heightStyle.height = heightStyle.height * (trackSettings.height / trackSettings.width);
		}

		const extendedProps = { ...props }
		return (
			<div className={classes.PiPContainerVideo}>
				<Component {...extendedProps} />
				<div className={classes.PiPContainerOverlay}>
					<div className={classes.PiPInnnerConatiner}>
						<div className={classes.topLeftMini} ref={miniRef}
							onClick={() => setPosition(classes.topLeftMini)} style={heightStyle}>
						</div>
						<div className={classes.topRightMini}
							onClick={() => setPosition(classes.topRightMini)} style={heightStyle}>
						</div>
						<div className={classes.topMiddleMini}
							onClick={() => setPosition(classes.topMiddleMini)} style={heightStyle}>
						</div>
						<div className={classes.bottomRightMini}
							onClick={() => setPosition(classes.bottomRightMini)} style={heightStyle}>
						</div>
						<div className={classes.bottomLeftMini}
							onClick={() => setPosition(classes.bottomLeftMini)} style={heightStyle}>
						</div>
						<div className={classes.bottomMiddleMini}
							onClick={() => setPosition(classes.bottomMiddleMini)} style={heightStyle}>
						</div>
						<div className={classes.middleLeftMini}
							onClick={() => setPosition(classes.middleLeftMini)} style={heightStyle}>
						</div>
						<div className={classes.middleRightMini}
							onClick={() => setPosition(classes.middleRightMini)} style={heightStyle}>
						</div>
						<div className={positionClass} >
							<BaseVideo stream={localStream} muted={true} change={change} match="height" />
						</div>
					</div>
					{(showBanner) && <div className={classes.bannerAdjust}></div>}
				</div>
			</div>
		)
	}
	return WrappedComponent
}
export default WithPiP;