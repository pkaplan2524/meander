const proxyConfig = { 
	target: 'https://owner-api.teslamotors.com',
	logLevel: 'silent',
	secure: false,
	changeOrigin: true,
	ws: true,
	xfwd: true 
};
module.exports = proxyConfig;