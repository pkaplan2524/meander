//*****************************************************************************
//
//  utils/routing
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const chalk     = require('chalk');
const express   = require('express');
const proxy     = require('http-proxy-middleware');

const authMiddleware = require('../middleware/userAuth');

const routing = {

	ourApp: null,

	init: (app) => {
		this.ourApp = app;
	},

	configureRoute: ( filePath, url, middleware = false) => {
		if (process.env.PORT) {
			const message = '    adding route for: ' + chalk.green( url) + chalk.yellow((!!middleware)? " - with auth":"");
			console.log( message)
		}
		const router  = require('../routers/' + filePath);

		if (middleware)
			this.ourApp.use( url, express.json(), authMiddleware, router)
		else {
			this.ourApp.use( url, express.json(), router)
		}
	},

	configureProxy: ( url, config) => {
		if (process.env.PORT) {
			const message = '    adding proxy route for: ' + chalk.green( url);
			console.log( message)
		}
		this.ourApp.use(url, proxy( config));
	}
}

module.exports = routing