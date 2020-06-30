import React, { useState } from 'react';
import { connect } from 'react-redux';
//*****************************************************************************
const mapStateToProps = (state) => ({
	selectedCamera: state.rtc.selectedCamera,
	selectedMicrophone: state.rtc.selectedMicrophone
});
//*****************************************************************************
const mapDispatchToProps = (dispatch) => ({
});
//*****************************************************************************
const WithHOC = (Component) => {
	function WrappedComponent(props) {
		// Add code here


		// add what will be passed on to the extended props
		const extendedProps = { ...props }
		return (
			<Component {...extendedProps} />
		)
	}
	return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)
}
export default WithHOC;
