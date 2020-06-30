import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setAudioPaused, setVideoPaused, setScreenCaptureStream } from "../../redux/rtcReducer";
import 'webrtc-adapter';

import AppBar from '@material-ui/core/AppBar'
import Toobar from '@material-ui/core/Toolbar'
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import MenuIcon from '@material-ui/icons/MenuRounded';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import InfoIcon from '@material-ui/icons/Info';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import SettingsDialog from "../Dialogs/Settings";
import AboutDialog from "../Dialogs/About";
import logo from "../../assets/images/navbarLogo.png";
//*****************************************************************************
const mapStateToProps = (state) => ({
	selectedCamera: state.rtc.selectedCamera,
	selectedMicrophone: state.rtc.selectedMicrophone,
	audioPaused: state.rtc.audioPaused,
	videoPaused: state.rtc.videoPaused,
	screen: state.rtc.screen
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
	setAudioPaused: (pause) => dispatch(setAudioPaused(pause)),
	setVideoPaused: (pause) => dispatch(setVideoPaused(pause)),
	setScreenCaptureStream: (stream) => dispatch(setScreenCaptureStream(stream))
});
//*****************************************************************************
const useStyles = makeStyles(theme => ({
	appbar: {
		paddingLeft: "0.2em",
		paddingRight: "0.2em",
		backgroundColor: theme.palette.background.default,
	},
	main: {
		top: theme.mixins.toolbar.minHeight,
		left: "0px",
		right: "0px",
		bottom: "0px",
		position: "fixed",
		backgroundColor: theme.palette.background.default
	},
	grow: {
		flexGrow: 1,
	},
	toolbarHeight: {
		...theme.mixins.toolbar,
	},
	logo: {
		...theme.mixins.toolbar
	},
	logoButton: {
		position: "absolute",
		left: 0,
		right: 0,
		top: "4px",
		height: "3em",
		margin: "auto",
		padding: 0,
		"&:hover": {
			backgroundColor: "transparent"
		}
	},
	menuIconContainer: {
		padding: "6px",
	},
	menuIcons: {
		height: "32px",
		width: "32px",
		padding: "0px",
		minWidth: "34px",
		"& svg": {
			fontSize: "1.8em"
		}
	},
	drawer: {
		minWidth: "14em",
		[theme.breakpoints.down('xs')]: {
			minWidth: "100%",
		},

	},
	drawerItem: {
		...theme.typography.tab,
		display: "flex",
		alignItems: "center",
		opacity: 0.7,
		"& svg": {
			width: "1.5em",
			height: "1.5em",
			paddingRight: "3px"
		}

	},
	drawerItemSelected: {
		"& .MuiListItemText-root": {
			opacity: 1
		}
	}
}));

const routes = [
	{
		name: "Exit Menu",
		primaryIndex: 0,
		icon: <ChevronLeft />,
		disabled: false,
		close: true,
		onClick: () => { }
	},
	{
		name: "Home",
		to: "/",
		primaryIndex: 0,
		icon: <HomeIcon />,
		disabled: false,
		onClick: () => { }
	},
	{
		name: "Settings...",
		dialog: SettingsDialog,
		primaryIndex: 0,
		icon: <SettingsIcon />,
		disabled: false,
	},
	{
		name: "About Meander...",
		dialog: AboutDialog,
		primaryIndex: 0,
		icon: <InfoIcon />,
		disabled: false,
	},
];

function Appbar(props) {
	const {
		audioPaused,
		setAudioPaused,
		videoPaused,
		setVideoPaused,
		screen,
		setScreenCaptureStream } = props;
	const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
	const classes = useStyles();
	const [openDrawer, setOpenDrawer] = useState(false);

	let temp = 0;
	routes.forEach((route) => {
		if (window.location.pathname === route.to) {
			temp = route.primaryIndex;
		}
	});

	const [selectedLink, setSelectedLink] = useState(temp);

	// const handleChange = (event, newValue) => {
	// 	setSelectedLink(newValue);
	// };

	const handleItemClicked = (e, route) => {
		if (!!route.onClick) {
			route.onClick();
		}
		if (!route.to) {
			setSelectedLink(selectedLink);
		}
		else {
			setSelectedLink(route.primaryIndex);
			setOpenDrawer(false);
		}
		if (route.close) setOpenDrawer(false);
	}

	const handleToggleMic = () => {
		setAudioPaused(!audioPaused);
	}
	const handleToggleCamera = () => {
		setVideoPaused(!videoPaused);
	}

	const handleToggleScreenSharing = async () => {
		if (screen === null) {
			try {
				const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, cursor: "always" });
				setScreenCaptureStream(displayMediaStream);
			}
			catch (error) {
				console.log(error)
			}

		}
		else {
			// Need to kill it here
			setScreenCaptureStream(null);
		}

	}

	function OurListItem(route) {
		const [open, setOpen] = useState(false)
		return (
			<React.Fragment key={"drawer-" + route.name + route.to}>
				{route.dialog && <route.dialog open={open} onClose={() => {
					setOpen(false); setOpenDrawer(false);
				}} />}
				<ListItem
					onClick={(e) => {
						setOpen(!open);
						handleItemClicked(e, route);
					}}
					divider
					button
					component={route.to ? Link : 'div'}
					to={route.to}
					classes={{ selected: classes.drawerItemSelected }}
					selected={selectedLink === route.primaryIndex}
				>
					<ListItemText
						className={classes.drawerItem}
						disableTypography>
						{route.icon}
						{route.name}
					</ListItemText>
				</ListItem>
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			<AppBar position="fixed" color="inherit" className={classes.appbar} elevation={0}>

				<Toobar disableGutters >

					<Button
						component={Link}
						to="/"
						className={classes.logoButton}
						onClick={() => setSelectedLink(0)}
						disableRipple
					>
						<img src={logo} alt="logo" />
					</Button>

					<Button onClick={() => setOpenDrawer(!openDrawer)} className={classes.menuIcons}>
						<MenuIcon />
					</Button>
					<React.Fragment>
						<SwipeableDrawer
							disableBackdropTransition={!iOS}
							disableDiscovery={!iOS}
							open={openDrawer}
							onClose={() => setOpenDrawer(false)}
							onOpen={() => setOpenDrawer(true)}
							classes={{ paper: classes.drawer }}
						>
							{/*<div className={classes.toolbarHeight} />*/}
							<List disablePadding>
								{routes.map((route) => OurListItem(route))}
							</List>
						</SwipeableDrawer>
					</React.Fragment>
					<div className={classes.grow}></div>
					<Button onClick={handleToggleScreenSharing} className={classes.menuIcons}>
						{screen ? <DesktopAccessDisabledIcon /> : <DesktopWindowsIcon />}
					</Button>

					<Button onClick={handleToggleMic} className={classes.menuIcons}>
						{audioPaused ? <MicOff /> : <Mic />}
					</Button>
					<Button onClick={handleToggleCamera} className={classes.menuIcons}>
						{videoPaused ? <VideocamOff /> : <Videocam />}
					</Button>
				</Toobar>
			</AppBar>
			{
				(props.children) ? (
					<main className={classes.main} id="application-main-view">
						{props.children}
					</main>
				) : <div></div>

			}
		</React.Fragment>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Appbar)
