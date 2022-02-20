const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.get('/vapid', auth, function (req, res, next) {
	if (!req.email)
		return;

	res.status(200).json({
		error: false,
		key: process.env.VAPID_PUBLIC
	});
});

router.post('/register', auth, function (req, res, next) {
	if (!req.email)
		return;

	let endpoint = JSON.stringify(req.body.endpoint);

	console.log(JSON.parse(endpoint));

	if (!endpoint) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, field: endpoint is required"
		});
		return;
	}

	req.knex.from('subscriptions').insert({ user: req.email, endpoint }).then(() => {
		res.status(200).json({
			error: false,
			message: "Device registration succesful"
		});
	});
});

module.exports = router;