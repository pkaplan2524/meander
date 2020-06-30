import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';

import AppRouter from "../Router/AppRouter";
import configureStore from '../../redux/reduxStore';
import theme from '../../utils/Theme';
import { checkAuth } from '../../utils/authUser';
import startWebRTC from "../../utils/webrtc";
import startSocketIO from "../../utils/sockets";
import './App.scss';

const useAuth = process.env.REACT_APP_USE_LOGIN === "true";

function App() {
  const [reduxStore] = useState(configureStore());
  const [checkingAuth, setCheckingAuth] = useState(useAuth);
  const [startingUp, setStartingUp] = useState(true);

  if (useAuth) {
    checkAuth(reduxStore.dispatch).then(() => {
      setCheckingAuth(false);
    });
  }

  if (startingUp) {
    startSocketIO(reduxStore);
    startWebRTC(reduxStore.dispatch);
    setStartingUp(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <Provider store={reduxStore}>
        {
          checkingAuth ? (
            <React.Fragment></React.Fragment>
          ) : (
              <AppRouter />
            )
        }
      </Provider>
    </ThemeProvider>
  );
}
export default App;