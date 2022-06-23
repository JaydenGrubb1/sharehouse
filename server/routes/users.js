const express = require('express');
const router = express.Router();
const auth = require('../auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
	const email = req.body.email.toLowerCase();
	const password = req.body.password;

	if (!email || !password) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, both email and password are required"
		});
		return;
	}

	req.knex.from('users').select('hash', 'admin').where('email', '=', email).then(rows => {
		if (rows.length !== 1) {
			res.status(401).json({
				error: true,
				message: "User does not exist"
			});
			return;
		}

		const hash = rows[0].hash;
		const admin = rows[0].admin;

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
			const token = jwt.sign({ email, admin, exp }, process.env.JWT_SECRET);

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

	req.knex.from('users').select('name', 'email', 'bsb', 'acc', 'admin', 'default').then(rows => {
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

	const email = req.body.email.toLowerCase();

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
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

// DOC
router.get('/config', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('user_config').select('*').where('user', '=', req.email)
		.orderBy('position').then(rows => {
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

// DOC
router.post('/config', auth, function (req, res, next) {
	if (!req.email)
		return;

	res.status(501).json({
		error: true,
		message: "Not implemented"
	});
});

/**
 * Get a user's notofication settings
 */
router.get('/notify', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('users').select('notify_receipt', 'notify_payment')
		.where('email', '=', req.email).then(rows => {
			res.status(200).json({
				error: false,
				data: {
					paymentEmail: rows[0].notify_payment === 'email' || rows[0].notify_payment === 'both',
					paymentPush: rows[0].notify_payment === 'push' || rows[0].notify_payment === 'both',
					receiptEmail: rows[0].notify_receipt === 'email' || rows[0].notify_receipt === 'both',
					receiptPush: rows[0].notify_receipt === 'push' || rows[0].notify_receipt === 'both'
				}
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
 * Set a user's notofication settings
 */
router.put('/notify', auth, function (req, res, next) {
	if (!req.email)
		return;

	let paymentEmail = req.body.paymentEmail;
	let paymentPush = req.body.paymentPush;
	let receiptEmail = req.body.receiptEmail;
	let receiptPush = req.body.receiptPush;

	let notify_payment = "off";
	if (paymentEmail) {
		if (paymentPush) {
			notify_payment = "both";
		} else {
			notify_payment = "email";
		}
	} else if (paymentPush) {
		notify_payment = "push";
	}

	let notify_receipt = "off";
	if (receiptEmail) {
		if (receiptPush) {
			notify_receipt = "both";
		} else {
			notify_receipt = "email";
		}
	} else if (receiptPush) {
		notify_receipt = "push";
	}

	req.knex.from('users').where('email', '=', req.email)
		.update({ notify_payment, notify_receipt }).then(() => {
			res.status(200).json({
				error: false,
				message: "User notification update successful"
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
router.get('/:email/details', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('users').select('name', 'email', 'updated', 'bsb', 'acc', 'admin', 'default')
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

// FIXME unknown routes match email address instead
/**
 * Updates a user's details
 */
router.put('/:email', auth, function (req, res, next) {
	if (!req.email)
		return;

	const old_email = req.params.email;

	const new_email = undefined;
	if (req.body.email)
		new_email = req.body.email.toLowerCase();

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
			if (req.token) {
				res.status(200).json({
					error: false,
					message: "User update successful",
					new_token: {
						token: req.token,
						expires_in: req.exp
					}
				});
			} else {
				res.status(200).json({
					error: false,
					message: "User update successful"
				});
			}
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

			const expiry = 60 * 60 * 24;
			const exp = Date.now() + expiry * 1000;
			const email = new_email;
			const admin = req.admin;
			const token = jwt.sign({ email, admin, exp }, process.env.JWT_SECRET);

			req.knex.from('users').where('email', '=', old_email).update(req.body).then(() => {
				res.status(200).json({
					error: false,
					message: "User update successful",
					new_token: {
						token: token,
						expires_in: expiry
					}
				});
			}).catch(error => {
				res.status(500).json({
					error: true,
					message: "Internal server error"
				});
				console.log(error);
			});
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
			return;
		});
	} else {
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