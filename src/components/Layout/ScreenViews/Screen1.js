import React from 'react';
import { makeStyles } from '@material-ui/styles';
import BaseVideo from '../BaseVideo';

const useStyles = makeStyles(theme => ({
	container: {
		height: "100%",
		position: "relative",
	},
}));

const ScreenSolo = (props) => {
	const { localStream, name } = props;
	const classes = useStyles();
	return (
		<div className={classes.container}>
			<BaseVideo stream={localStream} videoBanner={name + " (Me)"} muted={true} match="height" />
		</div>
	)
}
export default ScreenSolo;
