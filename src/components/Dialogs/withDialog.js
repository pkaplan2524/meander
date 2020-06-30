import React, { useState } from 'react';

const WithDialog = (Component) => {
	function WrappedComponent(props) {
		const { change, onClick } = props;
		const [open, setOpen] = useState(props.open);
		const [toggle, setToggle] = useState(change);

		const onClose = (value) => {
			setOpen(false);
		};

		if (change !== toggle) {
			setToggle(change);
			setOpen((o) => !o);
		}

		const extendedProps = { open, onClose, ...props }
		return (
			<Component {...extendedProps} />
		)
	}
	return WrappedComponent;
}
export default WithDialog;