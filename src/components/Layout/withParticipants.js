import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PeerConnection from "../../utils/RTCPeerConnection";
import { setUserList, setRoom } from "../../redux/socketReducer";
import withLocalStream from "./withLocalStream";
//*****************************************************************************
const mapStateToProps = (state) => ({
	socket: state.socket.socket,
	name: state.socket.name
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
	setUserList: (list) => dispatch(setUserList(list)),
	setRoom: (room) => dispatch(setRoom(room))
});
//*****************************************************************************
const WithParticipants = (Component) => {
	function WrappedComponent(props) {
		const {
			socket,
			name,
			setUserList,
			setRoom,
			localStream,
			localStreamChanged } = props;
		const { id } = props.match.params;

		const [initalized, setInitalized] = useState(false);
		const [participants, setParticipants] = useState([]);
		const [prevStreamChanged, setPrevStreamChanged] = useState(-1);
		const [remoteStreamsChanged, setRemoteStreamsChanged] = useState(0);

		useEffect(() => {
			return function cleanup() {
				leaveRoom();
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [])

		// Called once when you enter the meeting room
		const enterRoom = () => {
			setInitalized(true);
			socket.emit('enter-room', { roomId: id, name: name }, (room, users) => {
				socket.on('user-entered-room', userEnteredRoom);
				socket.on('user-left-room', userLeftRoom);
				socket.on('start-p2p', startP2P);
				setUserList(users);
				setRoom(room);
			});
		}

		const leaveRoom = () => {
			socket.off('user-entered-room');
			socket.off('user-left-room');
			socket.off('start-p2p');

			socket.emit('leave-room', id, (room) => {
				setRoom(null);
				setUserList([]);
			});
		}

		const userEnteredRoom = async (user) => {
			const peerConnection = new PeerConnection({
				socket,
				user,
				localStream,
				onRemoteStream: onRemoteStream
			});
			await peerConnection.jumpStart(false)
			setParticipants(participants => [...participants, { id: user.id, remote: false, name: user.name, peerConnection }]);
			socket.emit('start-p2p', user.id);
		}

		const userLeftRoom = async (id) => {
			setParticipants((participants) => {
				const participant = participants.find((item) => item.id === id)
				if (participant)
					participant.peerConnection.terminate();
				return participants.filter((item) => item.id !== id)
			});
		}

		const startP2P = async (user) => {
			const peerConnection = new PeerConnection({
				socket,
				user,
				localStream,
				onRemoteStream: onRemoteStream

			});
			await peerConnection.jumpStart(true)
			setParticipants(participants => [...participants, { id: user.id, remote: true, name: user.name, peerConnection }]);
		}

		const onRemoteStream = (newStream) => {
			// Force an update
			setRemoteStreamsChanged((s) => s + 1);
		}

		if (!initalized && localStream)
			enterRoom();

		if (localStreamChanged !== prevStreamChanged) {
			participants.forEach((participant) => {
				participant.peerConnection.setStream(localStream)
			})
			setPrevStreamChanged(localStreamChanged);
		}

		const extendedProps = { remoteStreamsChanged, participants, ...props }
		return (
			<Component {...extendedProps} />
		)
	}

	return connect(mapStateToProps, mapDispatchToProps)(withLocalStream(WrappedComponent))
}
export default WithParticipants;