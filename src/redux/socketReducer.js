//*****************************************************************************
const defaultState = {
	socket: null,
	room: null,
	name: '',
	users: []
};
//*****************************************************************************
export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_SOCKET':
			return { ...state, socket: action.socket };

		case 'SET_ROOM':
			return { ...state, room: action.room };

		case 'SET_NAME':
			return { ...state, name: action.name };

		case 'SET_USER_LIST':
			return { ...state, users: action.users };

		case 'ADD_USER':
			return { ...state, users: [...state.users, action.user] };

		case 'DELETE_USER':
			return { ...state, users: state.users.filter(item => item.id !== action.user) };

		case 'GET':
		default:
			return state;
	}
};
//*****************************************************************************
export const setSocket = (socket) => {
	return {
		type: 'SET_SOCKET',
		socket: socket
	}
};
//*****************************************************************************
export const setRoom = (room) => {
	return {
		type: 'SET_ROOM',
		room: room
	}
};
//*****************************************************************************
export const setName = (name) => {
	return {
		type: 'SET_NAME',
		name: name
	}
};
//*****************************************************************************
export const setUserList = (users) => {
	return {
		type: 'SET_USER_LIST',
		users: users
	}
};
//*****************************************************************************
export const addUser = (user) => {
	return {
		type: 'ADD_USER',
		user: user
	}
};
//*****************************************************************************
export const deleteUser = (user) => {
	return {
		type: 'DELETE_USER',
		user: user
	}
};

//*****************************************************************************
export const getRoomData = () => {
	return {
		type: 'GET',
	}
};
