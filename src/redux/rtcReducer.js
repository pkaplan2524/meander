//*****************************************************************************
const defaultState = {
	stream: null,
	microphones: [],
	cameras: [],
	speakers: [],
	selectedCamera: '',
	selectedMicrophone: '',
	selectedSpeaker: '',
	audioPaused: false,
	videoPaused: false,
	screen: null
};
//*****************************************************************************
export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_STREAM':
			return { ...state, stream: action.stream };

		case 'SET_CAMERAS':
			return { ...state, cameras: action.cameras };

		case 'SET_MICROPHONES':
			return { ...state, microphones: action.microphones };

		case 'SET_SPEAKERS':
			return { ...state, speakers: action.speakers };

		case 'SET_SELECTED_CAMERA':
			return { ...state, selectedCamera: action.selectedCamera };

		case 'SET_SELECTED_MICROPHONE':
			return { ...state, selectedMicrophone: action.selectedMicrophone };

		case 'SET_SELECTED_SPEAKER':
			return { ...state, selectedSpeaker: action.selectedSpeaker };

		case 'AUDIO_PAUSED':
			return { ...state, audioPaused: action.audioPaused };

		case 'VIDEO_PAUSED':
			return { ...state, videoPaused: action.videoPaused };

		case 'SCREEN_CAPTURE_STREAM':
			return { ...state, screen: action.screen };

		case 'GET':
		default:
			return state;
	}
};
//*****************************************************************************
export const setStream = (stream) => {
	return {
		type: 'SET_STREAM',
		stream: stream
	}
};
//*****************************************************************************
export const setCameras = (cameras) => {
	return {
		type: 'SET_CAMERAS',
		cameras: cameras
	}
};
//*****************************************************************************
export const setMicrophones = (microphones) => {
	return {
		type: 'SET_MICROPHONES',
		microphones: microphones
	}
};
//*****************************************************************************
export const setSpeakers = (speakers) => {
	return {
		type: 'SET_SPEAKERS',
		speakers: speakers
	}
};
//*****************************************************************************
export const setSelectedCamera = (selectedCamera) => {
	return {
		type: 'SET_SELECTED_CAMERA',
		selectedCamera: (selectedCamera) ? selectedCamera : ''
	}
};
//*****************************************************************************
export const setSelectedMicrophone = (selectedMicrophone) => {
	return {
		type: 'SET_SELECTED_MICROPHONE',
		selectedMicrophone: (selectedMicrophone) ? selectedMicrophone : ''
	}
};
//*****************************************************************************
export const setSelectedSpeaker = (selectedSpeaker) => {
	return {
		type: 'SET_SELECTED_SPEAKER',
		selectedSpeaker: (selectedSpeaker) ? selectedSpeaker : ''
	}
};
//*****************************************************************************
export const setAudioPaused = (pause) => {
	return {
		type: 'AUDIO_PAUSED',
		audioPaused: !!pause
	}
};
//*****************************************************************************
export const setVideoPaused = (pause) => {
	return {
		type: 'VIDEO_PAUSED',
		videoPaused: !!pause
	}
};
//*****************************************************************************
export const setScreenCaptureStream = (stream) => {
	return {
		type: 'SCREEN_CAPTURE_STREAM',
		screen: stream
	}
}
//*****************************************************************************
export const getRTCData = () => {
	return {
		type: 'GET'
	}
};