## Meander
As in the opposite of Zoom.


I wanted to learn WebRTC and I'm not a big fan of Zoom. So I set out to create a simple video conferencing web app that could accomodate my, admittedly minor, needs. This project is the end result.

This app does not do anything too fancy. It creates streams between each of the participants (inbound and outbound in a full mesh). The server does not play middleman (one of my complaints about the afore mentioned Zoom). The only thing that the server does is keep track of active meeting codes and exchange ICE(Internet Connectivity Establishment) signaling.

## Getting Started

In the root dierctory create a file named '.env.development.local'. Add the following lines to that file:

```
APP_NAME=Meander Video Conferencing
PORT=3000
SPA=TRUE
REACT_DEV_PORT=3001
REACT_APP_AUTH=true
```
Then, at the command line:

```
yarn install
yarn run server-dev-node
yarn run client-dev
```

Chrome will opne and the app will run.

## Available Scripts

In the project directory, you can run:

### `yarn run start`

Starts the server in production mode. Used by Heroku to run the app.

### `yarn run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run client-dev`

Starts the client in development mode. It will use the development server. 

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn run server-dev`

Starts the server in development mode, using nodemon. The page will reload if you make edits.


### `yarn run server-dev-node`
Starts the server in development mode, using node. 

### `yarn run server-prod`
Starts the server in production mode, using node. 

### `yarn run start-dev`

Will do a build and start the server in dev mode.

### `yarn run start-prod`

will do a build and start the server in production mode.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


