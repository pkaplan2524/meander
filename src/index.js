//*****************************************************************************
//
//		index.js
//
//		This is the main entry point for this React App. This file should not 
//		have to change.
//
//		Copyright Peter Kaplan 2019-2020. All rights reserved.
//
//*****************************************************************************
import React from 'react';
import ReactDOM from 'react-dom';
//*****************************************************************************
import * as serviceWorker from './utils/serviceWorker';
import App from './components/App/App';
//*****************************************************************************
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
//*****************************************************************************
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//*****************************************************************************
serviceWorker.unregister();
//*****************************************************************************
// Playground
//*****************************************************************************