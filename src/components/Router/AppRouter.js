//*****************************************************************************
//
//  AppRouter.js
//
//*****************************************************************************
// System Imports
//*****************************************************************************
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
//*****************************************************************************
import Navbar from "../Layout/Navbar";
import Loading from "../Layout/Loading"

import HomePage from "../Pages/HomePage"
import MeetingPage from "../Pages/MeetingPage"
import LoginPage from "../Pages/LoginPage"
import LogoutPage from "../Pages/LogoutPage"
//*****************************************************************************
const AppRouter = (props) => (
	<BrowserRouter>
		<CssBaseline />
		{
			(props.isAuth || process.env.REACT_APP_USE_LOGIN !== "true") ? (
				(props.isLive) ? (
					<Navbar  >
						<Switch>
							<Route exact path="/meeting/:id" component={MeetingPage} />
							<Route exact path="/logout" component={LogoutPage} />
							<Route exact path="/loading" component={Loading} />
							<Route path="/" component={HomePage} />
						</Switch>
					</Navbar>
				) : <Loading />
			) : (
					<Switch>
						<Route exact path="/logout" component={LogoutPage} />
						<Route component={LoginPage} />
					</Switch>
				)
		}
	</BrowserRouter>
);
//*****************************************************************************
const mapStateToProps = (state) => ({
	isAuth: !!state.auth.user,
	isLive: !!state.rtc.stream,
});
//*****************************************************************************
export default connect(mapStateToProps)(AppRouter);