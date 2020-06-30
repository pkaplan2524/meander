import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = "250px";
const titleBarHeight = "3em";

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'absolute',
		display: "flex",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	titleBar: {
		position: 'absolute',
		display: "flex",
		top: 0,
		left: 0,
		right: 0,
		height: titleBarHeight,
		backgroundColor: "whitesmoke",
		color: "black",
		paddingLeft: "1em",
		paddingRight: "1em"

	},
	drawer: {
		zIndex: theme.zIndex.appBar - 1
	},
	drawerPaper: {
		position: 'absolute',
		display: "flex",
		top: titleBarHeight,
		width: drawerWidth,
		bottom: 0,
		[theme.breakpoints.down('xs')]: {
			width: "100%",
		}
	},
	content: {
		display: "flex",
		backgroundColor: "inherit",
		position: 'absolute',
		flexDirection: "column",
		top: titleBarHeight,
		bottom: 0,
		left: drawerWidth,
		right: 0,
		flexShrink: 0,
		overflowY: "auto",
		[theme.breakpoints.down('xs')]: {
			width: "100%",
			left: 0
		}
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	}
}));

export default function ResponsiveDrawer(props) {
	const classes = useStyles();
	const theme = useTheme();

	const isClient = typeof window === 'object';
	const getWindowSize = () => {
		return {
			width: isClient ? window.innerWidth : undefined,
			height: isClient ? window.innerHeight : undefined
		};
	}

	const [windowSize, setWindowSize] = useState(getWindowSize());
	const [drawerOpen, setDrawerOpen] = useState(windowSize.width > theme.breakpoints.values.xs);


	useEffect(() => {
		if (!isClient) {
			return false;
		}

		function handleResize() {
			setWindowSize(getWindowSize());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	useEffect(() => {
		handleDrawerToggle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selected]);

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	const toggleDrawer = (open) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setDrawerOpen(!open);
	};

	return (
		<div className={classes.root}>
			<AppBar className={clsx(classes.titleBar)} elevation={1}>
				<Toolbar>
					<IconButton
						color="secondary"
						aria-label="open drawer"
						onClick={handleDrawerToggle}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: windowSize.width > theme.breakpoints.values.sm,
						})}
					>
						{drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
					<Typography noWrap>
						{props.header}
					</Typography>
				</Toolbar>
			</AppBar>
			<SwipeableDrawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={drawerOpen || windowSize.width >= theme.breakpoints.values.sm}
				classes={{ paper: classes.drawerPaper }}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
			>
				{props.drawer}
			</SwipeableDrawer>

			<div className={classes.content}>
				{props.children}
			</div>
		</div >
	)
}