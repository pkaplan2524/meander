import React from 'react';

import BaseVideo from "./BaseVideo";
//*****************************************************************************
const RemoteView = (props) => {
	const { peer, match, muted } = props;
	const connectionState = peer.peerConnection.peerConnection.connectionState;
	const iceConnectionState = peer.peerConnection.peerConnection.iceConnectionState;
	const signalingState = peer.peerConnection.peerConnection.signalingState;
	console.log(connectionState, signalingState, iceConnectionState)
	return (
		<BaseVideo stream={peer.peerConnection.remoteStream} topBanner={peer.name} muted={muted} match={match} />
	)
}
export default RemoteView;