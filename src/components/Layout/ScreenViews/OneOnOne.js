import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import AspectRatio from "../AspectRatio";

const useStyles = makeStyles(theme => ({
	topRightMini: {
		position: "absolute",
		top: 8,
		right: 8,
		width: "25%",
		height: "25%",
		zIndex: "1000",
	},
	topLeftMini: {
		position: "absolute",
		top: 8,
		left: 8,
		width: "25%",
		height: "25%",
		zIndex: "1000",
	},
	topMiddleMini: {
		position: "absolute",
		top: 8,
		left: "37.5%",
		width: "25%",
		height: "25%",
		zIndex: "1000",
	},
	bottomRightMini: {
		position: "absolute",
		bottom: 8,
		right: 8,
		width: "25%",
		height: "25%",
		zIndex: "1000",
	},
	bottomLeftMini: {
		position: "absolute",
		bottom: 8,
		left: 8,
		width: "25%",
		height: "25%",
		zIndex: "1000",
	},
	bottomMiddleMini: {
		position: "absolute",
		bottom: 8,
		left: "37.5%",
		width: "25%",
		height: "25%",
		zIndex: "1000",
	},
}));

const OneOnOne = (props) => {
	const classes = useStyles();
	const [positionClass, setPositionClass] = useState(classes.topLeftMini)

	const setPosition = (value) => {
		console.log(value)
		setPositionClass(value);
	}

	return (
		<AspectRatio>
			{props.children}

			<div className={classes.topLeftMini}
				onClick={() => setPosition(classes.topLeftMini)}>
			</div>
			<div className={classes.topRightMini}
				onClick={() => setPosition(classes.topRightMini)}>
			</div>
			<div className={classes.topMiddleMini}
				onClick={() => setPosition(classes.topMiddleMini)}>
			</div>
			<div className={classes.bottomRightMini}
				onClick={() => setPosition(classes.bottomRightMini)}>
			</div>
			<div className={classes.bottomLeftMini}
				onClick={() => setPosition(classes.bottomLeftMini)}>
			</div>
			<div className={classes.bottomMiddleMini}
				onClick={() => setPosition(classes.bottomMiddleMini)}>
			</div>

			<div className={positionClass} >{props.miniView}</div>
		</AspectRatio>
	)
}
export default OneOnOne;
