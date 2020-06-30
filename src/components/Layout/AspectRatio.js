import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
	aspectRatioLetterbox: {
		position: "relative",
		width: "100%",
		paddingTop: "56.25%",
	},
	aspectRatioLetterboxPortrait: {
		position: "relative",
		width: "100%",
		paddingTop: "177%",
	},
	aspectRatioTV: {
		position: "relative",
		width: "100%",
		paddingTop: "75%",
	},
	aspectRatioTVPortrait: {
		position: "relative",
		width: "100%",
		paddingTop: "133%",
	},
	innerWrapper: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		overflow: "hidden"
	}
}));

const AspectRatio = (props) => {
	const classes = useStyles();
	let outerClasss = classes.aspectRatioLetterBox;
	switch (props.variant) {
		case "TV":
			outerClasss = classes.aspectRatioTV;
			break;
		case "TVP":
			outerClasss = classes.aspectRatioTVPortrait;
			break;
		case "LetterboxP":
			outerClasss = classes.aspectRatioLetterboxPortrait;
			break;
		case "Letterbox":
		default:
			outerClasss = classes.aspectRatioLetterbox;
			break;
	}

	return (
		<div className={outerClasss}>
			<div className={classes.innerWrapper}>
				{props.children}
			</div>
		</div>
	)
}
export default AspectRatio;
