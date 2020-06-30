import socketio from "socket.io-client";
import { setSocket, addUser, deleteUser, setName } from "../redux/socketReducer";

const startSocketIO = (reduxStore) => {
	const io = socketio();

	reduxStore.dispatch(setSocket(io));
	io.on('welcome', (value) => {

	});

	io.on('user-entered-room', (user) => {
		reduxStore.dispatch(addUser(user));
	});

	io.on('user-left-room', (user) => {
		reduxStore.dispatch(deleteUser(user));
	});

	const name = localStorage.getItem('name');
	if (name) reduxStore.dispatch(setName(name));
}

export default startSocketIO;
