import expressJwt from 'express-jwt';
const fs = require('fs');
const publicKey = fs.readFileSync('public.key');

export default () => {
	return [
		// authenticate JWT token and attach user to request object (req.user)
		expressJwt({ secret:publicKey, algorithms: ['RS256'] }).unless({path: ['/_ah/warmup', '/upload']})
	];
}
