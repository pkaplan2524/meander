import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import Loading from "../Layout/Loading";
import withParticipants from "../Layout/withParticipants";
import Screen1 from '../Layout/ScreenViews/Screen1';
import Screen2PiP from '../Layout/ScreenViews/Screen2PiP';
import Screen3PiP from '../Layout/ScreenViews/Screen3PiP';
import Screen4Quadrants from '../Layout/ScreenViews/Screen4Quadrants';
//*****************************************************************************
const mapStateToProps = (state) => ({
	name: state.socket.name,
	room: state.socket.room
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
});
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	MeetingRoomDefaultContainer: {
		height: "100%",
		flexDirection: "row",
		backgroundColor: theme.palette.grey[400],
		padding: "8px"
	}
}));

const MeetingRoomPage = (props) => {
	const { localStream, participants, room, name } = props;
	const { id } = props.match.params;
	const classes = useStyles();
	const [mainDimensions, setMainDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		// We are getting the application's main view. I know this is 'old school'
		// and not very React-y, but it was quick and dirty.
		// We use this to determine portrait/landscape in each of the views. 
		const main = document.getElementById("application-main-view");
		setMainDimensions({ width: main.clientWidth, height: main.clientHeight })
		window.addEventListener('resize', onResize);
		return function cleanup() {
			window.removeEventListener('resize', onResize);
		}
	}, [])

	const onResize = (e) => {
		const main = document.getElementById("application-main-view");
		setMainDimensions({ width: main.clientWidth, height: main.clientHeight })
	}

	let Component = '';
	switch (participants.length) {
		case 0: // Just you, no remote
			Component = Screen1;
			break;
		case 1: // One remote
			Component = Screen2PiP;
			break;
		case 2: // Two remote
			Component = Screen3PiP;
			break;
		case 3: // Three remote
			Component = Screen4Quadrants;
			break;
		default:
			break;
	}

	const change = props.remoteStreamsChanged + props.localStreamChanged;
	return (
		<React.Fragment>
			{(localStream === null) ? <Loading /> : (room === null) ? <div>{id} is not a valid room</div> : (
				(participants.length < 4) ? (
					<Component
						localStream={localStream}
						name={name}
						participants={participants}
						change={change}
						dimensions={mainDimensions}
						topBanner={"Stopit"}
					/>) : (
						<div className={classes.MeetingRoomDefaultContainer}>
							Womp Womp
						</div>
					)
			)
			}
		</React.Fragment>)
}
export default withParticipants(connect(mapStateToProps, mapDispatchToProps)(MeetingRoomPage));