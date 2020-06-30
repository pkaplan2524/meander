import React, { useState } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import { setSelectedCamera, setSelectedMicrophone } from "../../redux/rtcReducer";
import { setName } from "../../redux/socketReducer";
//*****************************************************************************
const mapStateToProps = (state) => ({
	name: state.socket.name,
	cameras: state.rtc.cameras,
	microphones: state.rtc.microphones,
	selectedCamera: state.rtc.selectedCamera,
	selectedMicrophone: state.rtc.selectedMicrophone
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
	setSelectedCamera: (camera) => dispatch(setSelectedCamera(camera)),
	setSelectedMicrophone: (microphone) => dispatch(setSelectedMicrophone(microphone)),
	setName: (name) => dispatch(setName(name))
});
//*****************************************************************************
const useStyles = makeStyles({
	SettingsDialog: {
		width: "100%"
	},
	SettingsSelect: {
		width: '100%',
		marginBottom: '1.2em'
	}
});

const SettingsDialog = (props) => {
	const {
		name,
		cameras,
		selectedCamera,
		setSelectedCamera,
		microphones,
		selectedMicrophone,
		setSelectedMicrophone,
		setName,
		onClose,
		open } = props;

	const classes = useStyles();
	const [localName, setLocalName] = useState(name);

	const handleClose = () => {
		setName(localName);
		localStorage.setItem('name', localName)
		onClose();
	};

	const changeMircophone = (event) => {
		setSelectedMicrophone(event.target.value);
		localStorage.setItem('microphone', event.target.value)
	};

	const changeCamera = (event) => {
		setSelectedCamera(event.target.value);
		localStorage.setItem('camera', event.target.value)
	};

	const mapDevicesToMenuItem = (devices) => {
		return devices.map((device) => (
			<MenuItem key={device.deviceId} value={device.deviceId}>
				{device.label}
			</MenuItem>
		))
	}

	return (
		<Dialog
			onClose={handleClose}
			open={open}
			classes={{
				paper: classes.SettingsDialog
			}}
		>
			<div >
				<DialogTitle>User Settings</DialogTitle>
				<DialogContent>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						value={localName}
						label="Name"
						color="primary"
						onChange={(e) => setLocalName(e.target.value)}
					/>
					<br />
					<br />
					<InputLabel >
						Audio Input:
        			</InputLabel>
					<Select
						value={selectedMicrophone}
						onChange={changeMircophone}
						className={classes.SettingsSelect}
					>
						{mapDevicesToMenuItem(microphones)}
					</Select>
					<InputLabel>
						Video Input:
        			</InputLabel>
					<Select
						value={selectedCamera}
						onChange={changeCamera}
						className={classes.SettingsSelect}
					>
						{mapDevicesToMenuItem(cameras)}
					</Select>
					<br />
				</DialogContent>
			</div>
		</Dialog>
	);
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);