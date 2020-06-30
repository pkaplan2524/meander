import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
//*****************************************************************************
const useStyles = makeStyles({
	AboutDialog: {
		width: "100%"
	},
});

const AboutDialog = (props) => {
	const { onClose, open } = props;

	const classes = useStyles();
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog
			onClose={handleClose}
			open={open}
			classes={{
				paper: classes.AboutDialog
			}}
		>
			<div onClick={onClose}>
				<DialogTitle>
					<Typography
						gutterBottom variant="h5"
						component="h2"
						color="textPrimary"
					>
						Meander (As in the opposite of Zoom)
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography
						paragraph variant="body1"
						component="p"
						color="textSecondary"
					>
						I wanted to learn WebRTC and I'm not a big fan of Zoom. So I set out to create a simple video conferencing web app that could accomodate my, admittedly minor, needs. This project is the end result.
							</Typography>
					<Typography
						paragraph variant="body1"
						component="p"
						color="textSecondary"
					>
						This app does not do anything too fancy. It creates streams between each of the participants (one inbound and one outbound). The server does not play middleman (one of my complaints about the afore mentioned Zoom). The only thing that the server does is keep track of active meeting codes and exchange ICE(Internet Connectivity Establishment) signaling.
							</Typography>
					<Typography
						paragraph variant="body1"
						component="p"
						color="textSecondary"
					>
						This means that each new paricipant adds overhead to the meeting (both bandwidth and propccessing power). So, don't expect to have any large meetings, it will bog down your browser. I've successfully had 4 or 5 streams running, your mileage may vary.
							</Typography>
				</DialogContent>
			</div>
		</Dialog >
	);
}
export default AboutDialog;