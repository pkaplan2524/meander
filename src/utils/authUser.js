import axios from "axios";
import { login, logout } from '../redux/authReducer';

// leaving the userAuth stiff in for now. Never know if we will want to 
// add userAuth in the future.

const startLogin = (reduxDispatch, userName, password) => {
	const params = {
		"email": userName,
		"password": password
	}
	return new Promise((resolve, reject) => {
		axios.post("/sso/login", params).then((response) => {
			const token = response.data.token;
			axios.defaults.headers.common['Authorization'] = "Bearer " + token;

			localStorage.setItem('token', JSON.stringify(token));
			// InitGlobals(response.data.user, dispatch)
			reduxDispatch(login(token, response.data.user));
			resolve(response.data.user)
		}).catch(error => reject(error));
	});
}

const startLogout = (reduxDispatch) => {
	const token = JSON.parse(localStorage.getItem('token')) || null;
	if (token !== null) {
		return axios.post("/sso/logout").then((response) => {
			localStorage.removeItem('token');
			axios.defaults.headers.common['Authorization'] = undefined;
			reduxDispatch(logout());
		})
			.catch(function (error) {
				// Im not sure what to do with an error here
				// so I'm removing the localStorage items anyway
				localStorage.removeItem('token');
			});
	};
}

const checkAuth = (reduxDispatch) => {
	const token = JSON.parse(localStorage.getItem('token')) || null;
	axios.defaults.headers.common['Authorization'] = "Bearer " + token;
	return new Promise((resolve, reject) => {
		if (token !== null) {
			axios.get('/sso/checkAuth').then((response) => {
				reduxDispatch(login(token, response.data.user));
				// InitGlobals(response.data.user, dispatch)
				resolve(response.data.user);
			})
				.catch(function (error) {
					localStorage.removeItem('token');
					resolve();
				});
		}
		else {
			resolve();
		}
	})
}

export { startLogin, startLogout, checkAuth }