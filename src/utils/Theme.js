import { createMuiTheme } from '@material-ui/core/styles';

const colorPrimary = '#d63030';
const colorSecondary = '#0984e3';
const colorTertiary = '#fdcb6e';

export default createMuiTheme({
	mixins: {
		toolbar: {
			minHeight: "48px",
			'@media (min-width: 600px)': {
				minHeight: "48px",
			},
		}
	},
	palette: {
		primary: {
			main: `${colorPrimary}`
		},
		secondary: {
			main: `${colorSecondary}`
		},
		common: {
			// tertiary is not an official color.
			// Would have to fill in light/dark etc
			tertiary: `${colorTertiary}`
		},
	},
});