import 'webrtc-adapter';
import {
	setStream,
	setCameras,
	setMicrophones,
	setSpeakers,
	setSelectedCamera,
	setSelectedMicrophone
} from '../redux/rtcReducer';

const constraints = {
	'video': {
		width: { ideal: 1280 },
		height: { ideal: 720 },
		framerate: { ideal: 30 }
	},
	'audio': true
}

const VIDEO_INPUT_DEVICES = "videoinput";
const AUDIO_INPUT_DEVICES = "audioinput";
const AUDIO_OUTPUT_DEVICES = "audiooutput";

const openMediaDevices = async (constraints) => {
	try {
		if (navigator.mediaDevices)
			return await navigator.mediaDevices.getUserMedia(constraints);
	}
	catch (error) {
		return -1;
	}
}

const getConnectedDevices = async () => {
	return await navigator.mediaDevices.enumerateDevices();
}

const loadDevices = async (reduxDispatch) => {
	const devices = await getConnectedDevices();
	const cameras = devices.filter((device) => device.kind === VIDEO_INPUT_DEVICES);
	const microphones = devices.filter((device) => device.kind === AUDIO_INPUT_DEVICES);
	const speakers = devices.filter((device) => device.kind === AUDIO_OUTPUT_DEVICES);
	reduxDispatch(setCameras(cameras));
	reduxDispatch(setMicrophones(microphones));
	reduxDispatch(setSpeakers(speakers));

	// Check for stored values
	let camera = localStorage.getItem('camera')
	let microphone = localStorage.getItem('microphone')

	// Now check to see if the device you are using a device that does not 
	// exist anymore
	if (cameras.length > 0 && (!cameras.find((device) => device.deviceId === camera))) {
		camera = cameras[0].deviceId;
		localStorage.setItem('camera', camera)
	}
	if (microphones.length > 0 && (!microphones.find((device) => device.deviceId === microphone))) {
		microphone = microphones[0].deviceId;
		localStorage.setItem('microphone', microphone)
	}

	reduxDispatch(setSelectedCamera(camera));
	reduxDispatch(setSelectedMicrophone(microphone));
}

const startWebRTC = async (reduxDispatch) => {
	try {
		// Give ourselves a stream just so that the user gets asked early
		const stream = await openMediaDevices(constraints);
		reduxDispatch(setStream(stream));
		loadDevices(reduxDispatch);

		// Listen for changes to media devices and update the list accordingly
		navigator.mediaDevices.addEventListener('devicechange', async event => {
			loadDevices(reduxDispatch);
		});
	}
	catch (error) {
		console.error('Error accessing media devices.', error);
	}
}

export default startWebRTC;
