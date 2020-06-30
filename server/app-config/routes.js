const routing = require('../utils/routing');

if (process.env.MONGODB_URL) {
	routing.configureRoute('sso', '/sso');
}

// const stun = require('stun');

// stun.request('stun1.l.google.com:19302', (err, res) => {
// 	if (err) {
// 		console.error(err);
// 	} else {
// 		console.log(res);
// 		console.log(res.getXorAddress());

// 		// const { address } = res.getXorAddress();
// 		// console.log('your ip', address);
// 	}
// });
