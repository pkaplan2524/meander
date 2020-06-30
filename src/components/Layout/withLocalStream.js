import React, { useState } from 'react';
import { connect } from 'react-redux';
//*****************************************************************************
const mapStateToProps = (state) => ({
	selectedCamera: state.rtc.selectedCamera,
	selectedMicrophone: state.rtc.selectedMicrophone,
	audioPaused: state.rtc.audioPaused,
	videoPaused: state.rtc.videoPaused,
	screen: state.rtc.screen
});
//*****************************************************************************
const WithLocalStream = (Component) => {
	function WrappedComponent(props) {
		const {
			selectedMicrophone,
			selectedCamera,
			videoPaused = false,
			audioPaused = false,
			screen } = props;
		const [initialized, setInitialized] = useState(false);
		const [prevMic, setPrevMic] = useState(selectedMicrophone);
		const [prevCamera, setPrevCamera] = useState(selectedCamera);
		const [prevScreen, setPrevScreen] = useState(null);
		const [prevVideo, setPrevVideo] = useState(null);
		const [localStream, setLocalStream] = useState(null);
		const [localStreamChanged, setLocalStreamChange] = useState(null);

		const createStream = async () => {
			let stream = null;
			try {
				const constraints = {
					audio:
						(selectedMicrophone === '') ? true : { deviceId: { exact: selectedMicrophone } },
					video:
						(selectedCamera === '') ? true : {
							deviceId: { exact: selectedCamera },
							width: { ideal: 1280 },
							height: { ideal: 720 },
							framerate: { ideal: 30 }
						}
				}
				stream = await navigator.mediaDevices.getUserMedia(constraints);
				setLocalStream(stream)
			}
			catch (error) {
				setLocalStream(-1)
			}
		}

		const swapTracks = (newTracks) => {
			if (newTracks.length > 0) {
				const oldTracks = (newTracks[0].kind === 'audio') ?
					localStream.getAudioTracks() : localStream.getVideoTracks();
				if (oldTracks.length > 0)
					localStream.removeTrack(oldTracks[0]);
				localStream.addTrack(newTracks[0]);
			}
		}

		const changeStream = async ({ videoId = null, audioId = null }) => {
			if (localStream === null) return;

			const constraints = {
				audio: (selectedMicrophone === '') ? true : { deviceId: { exact: selectedMicrophone } },
				video: (selectedCamera === '') ? true : {
					deviceId: { exact: selectedCamera },
					width: { ideal: 1280 },
					height: { ideal: 720 },
					framerate: { ideal: 30 }
				}
			}

			try {
				const tempStream = await navigator.mediaDevices.getUserMedia(constraints);
				swapTracks(tempStream.getAudioTracks());
				swapTracks(tempStream.getVideoTracks());
				setLocalStreamChange((s) => s + 1);
			}
			catch (error) {
				console.log("Error in changeStream:", error);
			}
		}

		if (!initialized && selectedMicrophone && selectedCamera) {
			createStream();
			setInitialized(true);
		}

		if (prevCamera !== selectedCamera) {
			changeStream({ videoId: selectedCamera });
			setPrevCamera(selectedCamera);
		}

		if (prevMic !== selectedMicrophone) {
			changeStream({ audioId: selectedMicrophone });
			setPrevMic(selectedMicrophone);
		}

		if (localStream && localStream !== -1) {
			if (prevScreen !== screen) {
				if (screen === null) {
					// We are turning off screen sharing
					const screenTracks = localStream.getVideoTracks();
					swapTracks(prevVideo);
					if (screenTracks) screenTracks[0].stop();
				}
				else {
					// We are turning screen sharing on
					const videoTracks = localStream.getVideoTracks();

					const screenTracks = screen.getTracks();
					swapTracks(screenTracks);
					setPrevVideo(videoTracks);
				}
				setPrevScreen(screen);
			}

			const audio = localStream.getAudioTracks()
			if (audio) audio.forEach((track) => {
				if (track.enabled === audioPaused) {
					track.enabled = !audioPaused;
				}
			})
			const video = localStream.getVideoTracks()
			if (video) video.forEach((track) => {
				if (track.enabled === videoPaused) {
					track.enabled = !videoPaused;
				}
			})
		}

		const extendedProps = { localStream, localStreamChanged, ...props }
		return (
			<Component {...extendedProps} />
		)
	}
	return connect(mapStateToProps)(WrappedComponent)
}
export default WithLocalStream;