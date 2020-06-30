import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//*****************************************************************************
import authReducer from "./authReducer";
import rtcReducer from "./rtcReducer";
import socketReducer from "./socketReducer";
//*****************************************************************************
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
	const store = createStore(
		combineReducers({
			auth: authReducer,
			rtc: rtcReducer,
			socket: socketReducer,
		}),
		composeEnhancers(applyMiddleware(thunk))
	);
	return store;
};