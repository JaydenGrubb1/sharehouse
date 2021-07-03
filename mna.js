const express = require('express');
const router = express.Router();

router.all('/', function (req, res, next) {
	res.set('Allow', 'GET, PUT');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});

module.exports = router;