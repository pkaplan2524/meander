import React, { useState } from 'react';
import { connect } from 'react-redux';

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';

import BaseVideo from "../Layout/BaseVideo";
import withLocalStream from "../Layout/withLocalStream";
import Permissions from "../Layout/Permisssion";
//*****************************************************************************
const mapStateToProps = (state) => ({
	socket: state.socket.socket,
});
//*****************************************************************************
const useStyles = makeStyles(theme => {
	return ({
		root: {
			overflowY: "hidden",
			height: "100%",
			backgroundColor: theme.palette.background.default,
			padding: theme.spacing(1),
		},
		horizContainer: {
			padding: theme.spacing(1),
			paddingBottom: "0px"
		},
		fullScreen: {
			height: "100%",
			overflowY: "auto",
			display: "flex",
			paddingTop: "10vh",
			paddingBottom: "10vh",
			[theme.breakpoints.down('xs')]: {
				paddingTop: 0,
				paddingBottom: 0,
			},
			"@media (max-height: 600px)": {
				paddingTop: 0,
				paddingBottom: 0,
			}
		},
		controlBox: {
			maxWidth: theme.breakpoints.values.md,
			marginLeft: "auto",
			marginRight: "auto",
			overflowY: "auto",
		},
		meetingButtons: {
			width: "16em",
			minWidth: "16em"
		},
		meetingText: {
			width: "100%",
			paddingLeft: theme.spacing(1),
		},
		textIndent: {
			paddingLeft: "1em"
		},
	})
});

const HomePage = (props) => {
	const { localStream, socket } = props
	const classes = useStyles();
	const [roomName, setRoomName] = useState("")
	const [pressedCreate, setPressedCreate] = useState(false);

	const path = "/meeting/" + roomName;
	const url = window.location.origin + path;

	const createMeetingRoom = async () => {
		socket.emit('create-room', (meeting) => {
			setRoomName(meeting.admin);
			setPressedCreate(true);
		});
	}

	const joinMeeting = async () => {
		props.history.push(path);
	}

	const onChange = (event) => {
		setRoomName(event.target.value);
	}

	if (localStream === -1) return <Permissions />

	return (
		<div className={classes.root}>
			<div spacing={0} className={classes.fullScreen}>
				<Card variant="outlined" className={classes.controlBox}>
					<CardContent>
						<Grid container spacing={1} className={classes.horizContainer}>
							<Grid item xl={6} lg={6} md={6} sm={5} xs={12}>
								<BaseVideo stream={localStream} muted={true} />
							</Grid>
							<Grid item xl={6} lg={6} md={6} sm={7} xs={12}>
								<div className={classes.textIndent}>
									<Typography paragraph variant="body2" component="p" color="textSecondary">
										To start a meeting generate a meeting code by pressing the button.
									</Typography>
								</div>
								<CardActions>
									<Button color="primary" variant="outlined" className={classes.meetingButtons} onClick={createMeetingRoom}>
										Create Meeting Code
									</Button>
								</CardActions>

								<CardActions>
									<Button
										variant="outlined"
										color="primary"
										className={classes.meetingButtons}
										onClick={joinMeeting}
										disabled={roomName.length === 0}
									>
										Join Meeting
								  </Button>
								</CardActions>
								<TextField
									className={classes.meetingText}
									variant="outlined"
									margin="normal"
									required
									fullWidth
									value={roomName}
									id="room"
									label="Meeting Code"
									name="room"
									color="secondary"
									onChange={onChange}
								/>
								{
									pressedCreate && (
										<div className={classes.textIndent}>
											<Typography paragraph variant="body2" component="p" color="textSecondary">
												Now that you have created a meeting code you can send participants the link listed below. <br />You can press the Join Meeing button to join the meeting.
													<br />
												<br />
												<a href={url}>{url}</a>
											</Typography>
										</div>
									)
								}
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</div>
		</div >
	)
}
export default withLocalStream(connect(mapStateToProps)(HomePage));



