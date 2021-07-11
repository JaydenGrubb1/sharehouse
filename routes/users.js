const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../auth');

const ALLOWED_USER_FIELDS = {
	name: "",
	email: "",
	password: "",
	bsb: "",
	acc: "",
	admin: false
}

/**
 * Log a user in
 */
router.post('/login', function (req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, both email and password are required"
		});
		return;
	}

	req.knex.from('users').select('hash').where('email', '=', email).then(rows => {
		if (rows.length !== 1) {
			res.status(401).json({
				error: true,
				message: "User does not exist"
			});
			return;
		}

		const hash = rows[0].hash;

		bcrypt.compare(password, hash).then(match => {
			if (!match) {
				res.status(401).json({
					error: true,
					message: "Incorrect email or password"
				});
				return;
			}

			const expiry = 60 * 60 * 24;
			const exp = Date.now() + expiry * 1000;
			const token = jwt.sign({ email, exp }, process.env.JWT_SECRET);

			res.status(200).json({
				error: false,
				token_type: "Bearer",
				token: token,
				expires_in: expiry
			});
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

/**
 * Get all users
 */
router.get('/', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('users').select('name', 'email', 'bsb', 'acc', 'admin').then(rows => {
		res.status(200).json({
			error: false,
			data: rows
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

/**
 * Get a user's details
 */
router.get('/:email', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('users').select('name', 'email', 'updated', 'bsb', 'acc', 'admin')
		.where('email', '=', req.params.email).then(rows => {
			res.status(200).json({
				error: false,
				data: rows[0]
			});
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
		});
});

/**
 * Creates a user
 */
router.post('/', auth, function (req, res, next) {
	if (!req.email)
		return;

	if (!req.admin) {
		res.status(403).json({
			error: true,
			message: "Forbidded, must be an admin user"
		});
		return;
	}

	const email = req.body.email;

	if (!email) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, email is required"
		});
		return;
	}

	req.knex.from('users').select('email').where('email', '=', email).then(rows => {
		if (rows.length > 0) {
			res.status(409).json({
				error: true,
				message: "User already exists"
			});
			return;
		}

		const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		const hash = bcrypt.hashSync(password, 10);
		req.knex.from('users').insert({ email, hash }).then(() => {
			res.status(201).json({
				error: false,
				message: "User created",
				password: password
			});
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

/**
 * Updates a user's details
 */
router.put('/:email', auth, function (req, res, next) {
	if (!req.email)
		return;

	const old_email = req.params.email;
	const new_email = req.body.email;

	if (req.email !== old_email && !req.admin) {
		res.status(403).json({
			error: true,
			message: "Forbidden, must be an admin user or the owner of this account"
		});
		return;
	}

	if (req.body.admin && !req.admin) {
		res.status(403).json({
			error: true,
			message: "Forbidden, must be an admin user"
		});
		return;
	}

	for (var prop in req.body) {
		if (!ALLOWED_USER_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid body parameter"
			});
			return;
		}
	}

	if (req.body.password) {
		const hash = bcrypt.hashSync(req.body.password, 10);
		req.body.hash = hash;
		req.body.updated = new Date();
		delete req.body.password;
	}

	const after = (req, res) => {
		req.knex.from('users').where('email', '=', old_email).update(req.body).then(() => {
			res.status(200).json({
				error: false,
				message: "User update successful"
			});
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
		});
	}

	if (old_email !== new_email && new_email) {
		req.knex.from('users').select('email').where('email', '=', new_email).then(rows => {
			if (rows.length > 0) {
				res.status(409).json({
					error: true,
					message: "User already exists with that email"
				});
				return;
			}

			after(req, res);
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
			return;
		});
	} else {
		after(req, res);
	}
});

/**
 * Deletes a user
 */
router.delete('/:email', auth, function (req, res, next) {
	if (!req.admin)
		return;

	req.knex.from('users').del().where('email', '=', req.params.email).then(() => {
		res.status(200).json({
			error: false,
			message: "User deleted"
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

/**
 * Method not allowed handlers
 */
router.all('/', function (req, res, next) {
	res.set('Allow', 'GET, POST');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET and POST"
	});
});
router.all('/:email', function (req, res, next) {
	res.set('Allow', 'GET, PUT, DELETE');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET, PUT and DELETE"
	});
});
router.all('/login', function (req, res, next) {
	res.set('Allow', 'POST');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: POST"
	});
});

module.exports = router;