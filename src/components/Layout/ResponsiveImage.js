import React from 'react';
import { useTheme } from '@material-ui/core/styles';

export default function ResponsiveImage(props) {
	let DPR = window.devicePixelRatio;
	const theme = useTheme();
	const CRAZY_BIG_SCREEN = 32767;

	if (!props.images)
		console.error("ResponsiveImage requires images prop");

	const images = props.images;
	const isObj = (typeof images === "object")
	let newArray = [];

	if (isObj) {
		for (let [key, value] of Object.entries(images)) {
			let size = (key === 'max') ? CRAZY_BIG_SCREEN : theme.breakpoints.values[key];
			if (props.dpr === "auto") size = Math.trunc(size / DPR);
			const media = `(max-width: ${size}px)`;
			newArray.push({ srcset: value, media, size });
		}
	}
	newArray.sort((a, b) => {
		return (a.size > b.size) ? 1 : -1;
	})

	return (
		<picture style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			{
				isObj ? (
					newArray.map((obj) => {
						if (obj.size === CRAZY_BIG_SCREEN) {
							return <img key={obj.srcset} srcSet={obj.srcset} alt={props.alt} className={props.className} />
						}
						else
							return <source key={obj.srcset} srcSet={obj.srcset} media={obj.media} alt={props.alt} className={props.className} />
					})
				) : (
						<img srcSet={images} alt={props.alt} />
					)
			}
		</picture>
	);
}