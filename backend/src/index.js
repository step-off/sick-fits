const cookieParser = require('cookie-parser');
require('dotenv').config();
const createServer = require('./createServer');

const server = createServer();

server.express.use(cookieParser());

server.start({
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL
	}
}, options => {
	console.log(`Server is running on port: ${options.port}`)
})
