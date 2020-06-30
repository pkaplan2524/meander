const socketio = require('socket.io');
const uuid = require('uuid');

let userList = [];
let roomsList = [];

const getUser = (id) => {
	return userList.find((item) => (item.id === id));
}

const getRoom = (id) => {
	getUser(id);
	return getUser(id).room || null;
}

const configureSockets = (httpServer) => {
	exportObj.io = socketio(httpServer);

	//*********************************************************************** */
	exportObj.io.on('connection', (socket) => {
		socket.emit('welcome', 'Welcome to the WebRTC Socket');
		userList.push({ id: socket.id, room: null, name: "" });

		socket.on('disconnect', (error) => {
			userList = userList.filter(user => user.id !== socket.id)
			roomsList.forEach((room) => {
				leaveRoom(room, socket);
			});
		});

		socket.on('create-room', (callback) => {
			let meetingRoomObject = {
				admin: uuid.v4(),
				attendee: uuid.v4(),
				id: uuid.v4(),
				adminList: [],
				attendeeList: []
			}
			roomsList.push(meetingRoomObject);
			callback({ admin: meetingRoomObject.admin, attendee: meetingRoomObject.attendee });
		})

		socket.on('distroy-room', (roomId) => {
			// Should we check for in use?
			roomsList = roomsList.filter((item) => (item.id !== roomId));
		})

		socket.on('enter-room', ({ roomId, name }, callback) => {
			const room = roomsList.find((item) => (item.admin === roomId || item.attendee === roomId));
			if (room) {
				const user = userList.find((item) => item.id === socket.id)
				user.room = room.id;
				user.name = name;
				((room.admin === roomId) ? room.adminList : room.attendeeList).push(user);
				socket.join(room.id);
				exportObj.io.to(room.id).emit('user-entered-room', user);
				if (callback)
					callback(room.id, [...room.adminList, ...room.attendeeList]);
			}
			else {
				if (callback)
					callback(null, []);
			}
		})

		const leaveRoom = (room, socket) => {
			room.adminList = room.adminList.filter((item) => item.id !== socket.id);
			room.attendeeList = room.attendeeList.filter((item) => item.id !== socket.id);

			exportObj.io.to(room.id).emit('user-left-room', socket.id);
			socket.leave(room.id);
		}

		socket.on('leave-room', (roomId) => {
			const room = roomsList.find((item) => (item.admin === roomId || item.attendee === roomId));
			if (room) {
				leaveRoom(room, socket);
			}
		})

		socket.on('start-p2p', (id, callback) => {
			socket.to(id).emit('start-p2p', getUser(socket.id));
		});

		socket.on('send-offer', (payload) => {
			socket.to(payload.to).emit('receive-offer', payload);
		});

		socket.on('send-answer', (payload) => {
			socket.to(payload.to).emit('receive-answer', payload);
		})

		// need to see whom is sending and who is receiving
		socket.on('ice-candidate-request', (payload) => {
			socket.to(payload.to).emit('ice-candidate-request', payload);
		})

		socket.on('ice-candidate-response', (payload) => {
			socket.to(payload.to).emit('ice-candidate-response', payload);
		})

	});
	return exportObj;
};

var exportObj = {
	configure: configureSockets,
	socketio: socketio,
	io: null,
	online: null,
}

module.exports = exportObj;

// io.on('connect', onConnect);

// function onConnect(socket) {

// 	// sending to the client
// 	socket.emit('hello', 'can you hear me?', 1, 2, 'abc');

// 	// sending to all clients except sender
// 	socket.broadcast.emit('broadcast', 'hello friends!');

// 	// sending to all clients in 'game' room except sender
// 	socket.to('game').emit('nice game', "let's play a game");

// 	// sending to all clients in 'game1' and/or in 'game2' room, except sender
// 	socket.to('game1').to('game2').emit('nice game', "let's play a game (too)");

// 	// sending to all clients in 'game' room, including sender
// 	io.in('game').emit('big-announcement', 'the game will start soon');

// 	// sending to all clients in namespace 'myNamespace', including sender
// 	io.of('myNamespace').emit('bigger-announcement', 'the tournament will start soon');

// 	// sending to a specific room in a specific namespace, including sender
// 	io.of('myNamespace').to('room').emit('event', 'message');

// 	// sending to individual socketid (private message)
// 	io.to(socketId).emit('hey', 'I just met you');

// 	// WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
// 	// named `socket.id` but the sender. Please use the classic `socket.emit()` instead.

// 	// sending with acknowledgement
// 	socket.emit('question', 'do you think so?', function (answer) { });

// 	// sending without compression
// 	socket.compress(false).emit('uncompressed', "that's rough");

// 	// sending a message that might be dropped if the client is not ready to receive messages
// 	socket.volatile.emit('maybe', 'do you really need it?');

// 	// specifying whether the data to send has binary data
// 	socket.binary(false).emit('what', 'I have no binaries!');

// 	// sending to all clients on this node (when using multiple nodes)
// 	io.local.emit('hi', 'my lovely babies');

// 	// sending to all connected clients
// 	io.emit('an event sent to all connected clients');

// };
// Note: The following events are reserved and should not be used as event names by your application:

// connect
// connect_error
// connect_timeout
// error
// disconnect
// disconnecting
// newListener
// reconnect_attempt
// reconnecting
// reconnect_error
// reconnect_failed
// removeListener
// ping
// pong