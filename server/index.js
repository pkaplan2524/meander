//*****************************************************************************
//
//  index.js
//
//  This file should not need to be edited.
//
//  To add routes modify  '/app-config/routes.js'
//  To add proxies modify '/app-config/proxies.js'
//  To add sockets modify '/app-config/sockets.js'
//
//  The databse can be set via process.env.MONGODB_URL
//
//  You can configure if it will react as an SPA 
//  via process.env.SPA=TRUE
//
//  This is designed to be a node template which can
//  accomodate express, mongoose, socket.io and proxies.
//
//  Copyright Peter Kaplan 2019-2020. All rights reserved.
//*****************************************************************************
//*****************************************************************************
// System Requires
//*****************************************************************************
const chalk = require('chalk');
const express = require('express');
const http = require('http');
const https = require('https');
const proxy = require('http-proxy-middleware');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const routing = require('./utils/routing');
const nlSockets = require('./app-config/sockets');

var key = fs.readFileSync(__dirname + '/../certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/../certs/selfsigned.crt');
var httpsOptions = {
    key: key,
    cert: cert
};

//*****************************************************************************
// Startup message
//*****************************************************************************
if (process.env.PORT) console.log('')
if (process.env.PORT) console.log(chalk.cyanBright.underline('Starting ' + process.env.APP_NAME + " Server"))

//*****************************************************************************
// Variable/Path Configuration
//*****************************************************************************
const publicDirectoryPath = path.join(__dirname, '../build')

//*****************************************************************************
// Connect to database (if configured in env)
//*****************************************************************************
if (process.env.MONGODB_URL) {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    if (process.env.PORT) console.log('Configuring Database: ' + chalk.green(process.env.MONGODB_URL))
}

//*****************************************************************************
// Configure Express
//*****************************************************************************
if (process.env.PORT) console.log('Configuring Express...')
const app = express()
const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

routing.init(app);
app.set('x-powered-by', false)

//*****************************************************************************
// Configure Express Routes
//*****************************************************************************
if (process.env.PORT) console.log('Configuring Express Routes..')
require('./app-config/routes');

//*****************************************************************************
// Proxy paths to other servers
//*****************************************************************************
if (process.env.PORT) console.log('Configuring Proxy Routes..')
require('./app-config/proxies');

//*****************************************************************************
// Static assests & html
//*****************************************************************************
if (process.env.PORT) {
    console.log('Configuring Static Routes..')
    const message = '    adding: ' + chalk.green(publicDirectoryPath);
    console.log(message)
}
app.use(express.static(publicDirectoryPath))

//*****************************************************************************
// Last in line will be a 404 or SPA index page
//*****************************************************************************
// If we are a single page app we want all remaining page calls to 
// flow to our app. If you want people to get 404s, remove this line.
if (process.env.SPA) {
    if (process.env.PORT) console.log('    adding default route for Single Page Application')
    app.use('*', express.static(publicDirectoryPath))
}
else {
    console.log('    adding default route for Page not found - 404')
    app.get('*', (req, res) => {
        res.status(404).render('404', {
            title: 'Page not found - 404',
            errorMessage: "The page you are looking for could not be found and we're just worried sick about it."
        })
    })
}

//*****************************************************************************
// Configure websocket
//*****************************************************************************
if (process.env.PORT) console.log('Configuring Socket.IO..')
nlSockets.configure(httpServer);

//*****************************************************************************
// Start Server if PORT is defined as an env variable. If it does not exist
// we are running the test suite and should export the 'app'
//*****************************************************************************
if (process.env.PORT) {
    const port = parseInt((process.env.REACT_DEV_PORT) ? process.env.REACT_DEV_PORT : process.env.PORT);
    httpServer.listen(port, () => {
        console.log('HTTP Server is running on port: ' + chalk.green(port))
        httpsServer.listen(port + 1, () => {
            console.log('HTTPS Server is running on port: ' + chalk.green(port + 1))
            console.log('')
            console.log('Waiting for connections...')
        });
    })
}
else {
    module.exports = app
}