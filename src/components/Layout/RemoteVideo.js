import React from 'react';

import BaseVideo from "./BaseVideo";
//*****************************************************************************
const RemoteView = (props) => {
	const { peer, match, muted } = props;
	// const connectionState = peer.meanderPeer.peerConnection.connectionState;
	// const iceConnectionState = peer.meanderPeer.peerConnection.iceConnectionState;
	// const signalingState = peer.meanderPeer.peerConnection.signalingState;
	// console.log(connectionState, signalingState, iceConnectionState)
	return (
		<BaseVideo stream={peer.meanderPeer.remoteStream} showBanner={true} name={peer.name} peer={peer} muted={muted} match={match} />
	)
}
export default RemoteView;