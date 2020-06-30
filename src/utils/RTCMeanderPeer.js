const { RTCPeerConnection, RTCSessionDescription } = window;

const defaultConnectionConfig = {
	iceServers: [{ "urls": ["stun:stun.l.google.com:19302"] }],
	iceTransportPolicy: "all"
}
const offerOptions = {
	offerToReceiveAudio: 1,
	offerToReceiveVideo: 1
};

class MeanderPeer {
	ourConnectionState = 'new';
	onRemoteStream = () => { }
	peerConnection = null;
	iceCandidateArray = [];

	user = null;
	socket = null;
	localStream = null
	remoteStream = null;
	extendOfferFlag = false;

	constructor({
		user = null,
		socket = null,
		localStream = null,
		onRemoteStream = () => { },
		connectionConfig = defaultConnectionConfig
	}) {
		this.user = user;
		this.socket = socket;
		this.localStream = localStream;
		this.onRemoteStream = onRemoteStream;
		this.peerConnection = new RTCPeerConnection(connectionConfig)
	}

	jumpStart = async (makeOffer) => {
		await this.initialize();
		this.addTracks();
		if (makeOffer) {
			await this.extendOffer();
		}
	}

	initialize = async () => {
		//console.log("initialize", this.ourConnectionState);
		this.socket.on('receive-offer', this.receiveOffer);
		this.socket.on('receive-answer', this.recieveAnswer);
		this.socket.on('ice-candidate-request', this.recieveCandidateRequest);

		this.peerConnection.addEventListener('icecandidate', this.onIceCandidate);
		this.peerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange)
		this.peerConnection.addEventListener('connectionstatechange', this.onConnectionStateChange)
		this.peerConnection.addEventListener('signalingstatechange', this.onSignalingStateChange)
		this.peerConnection.addEventListener('track', this.onTrack);
		this.peerConnection.createDataChannel("test");

		this.ourConnectionState = "initalized";
	}

	terminate = () => {
		//console.log("terminate")
		this.ourConnectionState = "closed";

		this.socket.off('create-peer');
		this.socket.off('accept-peer');
		this.socket.off('ice-candidate-request');

		this.peerConnection.removeEventListener('signalingstatechange', this.onSignalingStateChange)
		this.peerConnection.removeEventListener('icecandidate', this.onIceCandidate);
		this.peerConnection.removeEventListener('track', this.onTrack);
		this.peerConnection.removeEventListener('iceconnectionstatechange', this.onIceConnectionStateChange)
		this.peerConnection.removeEventListener('connectionstatechange', this.onConnectionStateChange)

		this.peerConnection.close();
	}

	restart = () => {
		this.terminate();
		this.jumpStart(this.extendOfferFlag)
	}

	extendOffer = async (restart) => {
		console.log("extendOffer")
		this.ourConnectionState = "offerExtended";
		this.extendOfferFlag = true;

		if (restart === true)
			offerOptions.iceRestart = true;

		try {
			const offer = await this.peerConnection.createOffer(offerOptions);
			await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
			this.socket.emit('send-offer', {
				to: this.user.id,
				from: this.socket.id,
				offer: JSON.stringify(offer)
			});
		} catch (error) {
			console.log("Error in extendOffer:", error)
		}
	}

	addTracks = () => {
		console.log("addTracks", this.peerConnection)
		if (this.localStream) {
			this.localStream.getTracks().forEach(track => {
				this.peerConnection.addTrack(track, this.localStream);
			});
			this.ourConnectionState = "tracksAdded";
		}
	}

	receiveOffer = async (payload) => {
		console.log("receiveOffer")
		if (this.user.id === payload.from && payload.to === this.socket.id) {
			this.ourConnectionState = "answerExtended";
			try {
				await this.peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(payload.offer)));
				var answer = await this.peerConnection.createAnswer();
				await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
			} catch (error) {
				console.log("Error in receiveOffer:", error)
			}
			const replyPayload = {
				to: payload.from,
				from: payload.to,
				answer: JSON.stringify(answer)
			}
			this.socket.emit('send-answer', replyPayload);
		}
	}

	recieveAnswer = async (payload) => {
		console.log("recieveAnswer")
		if (this.user.id === payload.from && payload.to === this.socket.id) {
			this.ourConnectionState = "peersConnected";
			try {
				await this.peerConnection.setRemoteDescription(
					new RTCSessionDescription(JSON.parse(payload.answer))
				)
			} catch (e) {
				console.log('Error acceptPeer:', payload, e)
			};
		}
	}

	recieveCandidateRequest = async (payload) => {
		// console.log("recieveCandidateRequest", this)
		if (this.user.id === payload.from && payload.to === this.socket.id) {
			const candidate = JSON.parse(payload.candidate);
			if ((candidate === null) || (candidate.candidate === '')) {
				return;
			}

			try {
				// There is an isse where the peerConnection will try to get a jump start 
				// on the ICE candidates and it will emit candidates before the connection
				// is comeplete. Well, a peer can't do anything with the candidate until
				// the peer signalingState is in a 'stable' state. Therefore, we queue up the
				// candidates if our connection is not ready for them.
				if ((this.peerConnection.signalingState === 'stable')
					&& this.iceCandidateArray.length === 0) {
					await this.peerConnection.addIceCandidate(candidate)
				} else {
					this.iceCandidateArray.push(candidate);
				}
			} catch (e) {
				console.log("Error candidateRequest", e, candidate)
			}
		}
	}

	onIceCandidate = async (event) => {
		// console.log("onIceCandidate", this.socket.id, this.user.id)
		const payload = {
			from: this.socket.id,
			to: this.user.id,
			candidate: JSON.stringify(event.candidate)
		}
		this.socket.emit('ice-candidate-request', payload);
	}

	onTrack = async (event) => {
		console.log("onTrack")
		this.remoteStream = event.streams[0];
		this.onRemoteStream(event.streams[0]);
	}

	onIceConnectionStateChange = (status) => {
		console.log("onIceConnectionStateChange", this.peerConnection.iceConnectionState)
		if ((this.peerConnection.iceConnectionState === 'completed') || (this.peerConnection.iceConnectionState === "connected")) {
			this.onRemoteStream(this.remoteStream)
		}
		if (this.peerConnection.iceConnectionState === 'failed') {
			console.log("failed restart", this)
			this.extendOffer(true);
		}
	}

	onConnectionStateChange = (status) => {
		console.log("onConnectionStateChange", this.peerConnection.connectionState)
		if (this.peerConnection.connectionState === 'failed' && this.extendOfferFlag) {
			// this.extendOffer();
		}
		if ((this.peerConnection.connectionState === 'completed') || (this.peerConnection.connectionState === "connected")) {
			this.onRemoteStream(this.remoteStream)
		}
	}

	onSignalingStateChange = async (status) => {
		console.log("onSignalingStateChange", this.peerConnection.signalingState);
		if (this.peerConnection.signalingState === 'stable') {
			while (this.iceCandidateArray.length) {
				let candidate = this.iceCandidateArray.shift();
				await this.peerConnection.addIceCandidate(candidate)
			}
		}
	}

	setOnRemoteStream = (newFnc) => {
		this.onRemoteStream = newFnc;
		return this.remoteStream;
	}

	setStream = (newStream) => {
		this.localStream = newStream
		const tracks = this.localStream.getTracks();
		const senders = this.peerConnection.getSenders();
		if (tracks.length > 0) {
			senders.forEach((sender) => {
				const track = tracks.find((t) => sender.track.kind === t.kind);
				if (track.id !== sender.track.id)
					sender.replaceTrack(track);
			})
		}
	}
}
export default MeanderPeer;