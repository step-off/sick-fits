const cookieParser = require('cookie-parser');
require('dotenv').config();
const createServer = require('./createServer');
const jwt = require('jsonwebtoken');

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
	const { token } = req.cookies;
	if (token) {
		const { userId } = jwt.verify(token, process.env.APP_SECRET);
		req.userId = userId;
	}
	next();
});

server.start({
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL
	}
}, options => {
	console.log(`Server is running on port: ${options.port}`)
})
