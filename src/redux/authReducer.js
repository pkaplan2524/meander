//*****************************************************************************
const defaultState = {
	token: null,
	user: null
};
//*****************************************************************************
export default (state = defaultState, action) => {
	switch (action.type) {
		case 'LOGIN':
			return { token: action.token, user: action.user };
		case 'LOGOUT':
			return { token: null, user: null };
		default:
			return state;
	}
};
//*****************************************************************************
export const login = (token, user) => {
	return {
		type: 'LOGIN',
		token,
		user
	}
};
//*****************************************************************************
export const logout = () => {
	return {
		type: 'LOGOUT',
		token: null,
		user: null
	};
};
