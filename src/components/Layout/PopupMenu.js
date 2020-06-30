import React, { useEffect, useState, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		alignItems: "flex-end",
	},
	popper: {
		zIndex: 3000,
		top: ".7em !important",
		left: ".5em !important",
		'&[x-placement*="bottom"] $arrow': {
			top: 0,
			right: '2em',
			marginTop: '-0.9em',
			width: '3em',
			height: '1em',
			'&::before': {
				borderWidth: '0 1em 1em 1em',
				borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
			},
		},
		'&[x-placement*="top"] $arrow': {
			bottom: 0,
			left: 0,
			marginBottom: '-0.9em',
			width: '3em',
			height: '1em',
			'&::before': {
				borderWidth: '1em 1em 0 1em',
				borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
			},
		},
		'&[x-placement*="right"] $arrow': {
			left: 0,
			marginLeft: '-0.9em',
			height: '3em',
			width: '1em',
			'&::before': {
				borderWidth: '1em 1em 1em 0',
				borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
			},
		},
		'&[x-placement*="left"] $arrow': {
			right: 0,
			marginRight: '-0.9em',
			height: '3em',
			width: '1em',
			'&::before': {
				borderWidth: '1em 0 1em 1em',
				borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
			},
		},
	},
	arrow: {
		position: 'absolute',
		fontSize: 7,
		width: '3em',
		height: '3em',
		'&::before': {
			content: '""',
			margin: 'auto',
			display: 'block',
			width: 0,
			height: 0,
			borderStyle: 'solid',
		},
	},
	menuIconContainer: {
		marginLeft: "auto",
		marginRight: "0px",
		"&:hover": {
			backgroundColor: "transparent"
		},
		padding: "0px"
	},
}));

const MenuListComposition = (props) => {
	const { menuItems } = props;
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const prevOpen = useRef(open);
	const anchorRef = useRef(null);
	const arrowRef = useRef(null);

	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}
		prevOpen.current = open;
	}, [open]);


	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	function handleListKeyDown(event) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}

	return (
		<div className={classes.root}>
			<IconButton
				className={classes.menuIconContainer}
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
				edge="end"
				color="inherit"
				disableRipple
			>
				{props.children}
			</IconButton>
			<Popper
				open={open}
				placement="bottom-end"
				anchorEl={anchorRef.current}
				role={undefined}
				transition={true}
				className={classes.popper}
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
					>
						<div>
							<span ref={arrowRef} className={classes.arrow}></span>
							<Paper elevation={6}>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										autoFocusItem={open}
										id="menu-list-grow"
										onKeyDown={handleListKeyDown}>
										{menuItems.map((item => {
											if (item.name === 'divider')
												return <Divider key={uuidv4()} />
											return (
												<MenuItem
													onClick={(e) => {
														if (!!item.onClick)
															item.onClick(e, item);
														handleClose(e);
													}}
													key={uuidv4()}
													component={Link}
													to={item.to}
												>
													{item.name}
												</MenuItem>
											)
										}))}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</div>
					</Grow>
				)}
			</Popper>
		</div>
	);
}
export default MenuListComposition;