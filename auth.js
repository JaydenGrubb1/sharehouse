const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * Checks if a user is logged in using their JWT
 * Success: adds the authorized user's email and admin tag to the request headers
 * Failure: stops request and returns eror status and message
 */
const authorize = (req, res, next) => {
	const authorization = req.headers.authorization;

	if (!authorization) {
		res.status(401).json({
			error: true,
			message: "Authorization header ('Bearer token') not found"
		});
		req.error = true;
		return;
	}

	if (authorization.split(' ').length === 2) {
		token = authorization.split(' ')[1];
	} else {
		res.status(401).json({
			error: true,
			message: "Authorization header is malformed"
		});
		req.error = true;
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.exp < Date.now()) {
			res.status(401).json({
				error: true,
				message: "JWT token has expired"
			});
			req.error = true;
			return;
		}
		req.email = decoded.email;

		req.knex.from('users').select('admin').where('email', '=', req.email).then(rows => {
			if(rows.length < 1){
				res.status(401).json({
					error: true,
					message: "JWT user's email has changed"
				});
				return;
			}

			req.admin = rows[0].admin === 1;

			if (next)
				next();
		})
	} catch (err) {
		res.status(401).json({
			error: true,
			message: "Invalid JWT token"
		});
		console.log(err)
		req.error = true;
	}
};

module.exports = authorize;