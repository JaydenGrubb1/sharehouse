const express = require('express');
const router = express.Router();
const auth = require('../auth');

const ALLOWED_PAYMENT_FIELDS = {
	from: "",
	to: "",
	amount: 0.0,
	timestamp: ""
}

const ALLOWED_GETALL_FIELDS = {
	from: "",
	to: "",
	status: "",
	self: 0
}

const DEFAULT_SORTING_ORDERS = {
	timestamp: false
}

/**
 * Approves a payment record
 */
router.put('/:id/approve', auth, function (req, res, next) {
	if (!req.email)
		return;

	const id = req.params.id;
	const approved = req.body.accepted;

	if (typeof (approved) !== 'boolean') {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, boolean accepted is required"
		});
		return;
	}

	req.knex.from('v_payments').select('to', 'status').where('id', '=', id).then(rows => {
		if (!req.admin) {
			if (rows[0].to !== req.email) {
				res.status(403).json({
					error: true,
					message: "Forbidden, must be an admin user or the owner of the payee account"
				});
				return;
			}

			if (rows[0].status !== "pending") {
				res.status(403).json({
					error: true,
					message: "Forbidden, must be an admin user"
				});
				return;
			}
		}

		req.knex.from('payments').update({ status: approved ? "approved" : "rejected" })
			.where('id', '=', id).then(() => {
				res.status(200).json({
					error: false,
					message: "Payment update successful"
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
 * Gets all payment records
 */
router.get('/', auth, function (req, res, next) {
	if (!req.email)
		return;

	const limit = req.query.limit;
	const offset = req.query.page * limit;
	const order = req.query.order;
	const reverse = req.query.reverse === 'true';

	delete req.query.limit;
	delete req.query.page;
	delete req.query.order;
	delete req.query.reverse;

	for (var prop in req.query) {
		if (!ALLOWED_GETALL_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid query parameter"
			});
			return;
		}
	}

	if (DEFAULT_SORTING_ORDERS[order] === undefined) {
		res.status(400).json({
			error: true,
			message: "Invalid sorting parameter"
		});
		return;
	}

	let query = req.knex.from(function () {
		this.select('*').from(`v_payments`).as(`all`)
	}).select(req.knex.raw('SQL_CALC_FOUND_ROWS *')).where('timestamp', '>=', '1970-01-01 00:00:00');

	if (Object.keys(req.query).length > 0)
		query.where(req.query);

	if (limit && limit > 0) {
		query.limit(limit);

		if (offset && offset >= 0)
			query.offset(offset);
	}

	if (order)
		query.orderBy(order, (reverse ^ DEFAULT_SORTING_ORDERS[order]) ? 'asc' : 'desc');

	query.then(rows => {
		req.knex.raw('select FOUND_ROWS() as count').then(result => {
			res.status(200).json({
				error: false,
				data: rows,
				count: result[0][0].count
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
 * Gets the total amount of pending payments to each user
 */
router.get('/pending', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('v_payments').select('to').sum({ total: 'amount' })
		.where({ status: 'pending', from: req.email }).groupBy('to').then(rows => {
			let sum = rows.reduce((a, x) => a += x.total, 0);
			res.status(200).json({
				error: false,
				data: rows,
				total: sum
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
 * Gets a payment record with a specific ID
 */
router.get('/:id', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('v_payments').select('*').where('id', '=', req.params.id).then(rows => {
		if (rows.length !== 1) {
			res.status(404).json({
				error: true,
				message: "Payment with the requested ID could not be found"
			});
			return;
		}

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
 * Creates a payment record
 */
router.post('/', auth, function (req, res, next) {
	if (!req.email)
		return;

	for (var prop in req.body) {
		if (!ALLOWED_PAYMENT_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid body parameter"
			});
			return;
		}
	}

	const from = req.body.from;
	const to = req.body.to;
	const amount = req.body.amount;

	delete req.body.from;
	delete req.body.to;
	delete req.body.amount;

	if (!from || !to || !amount) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, fields: from, to and amount are all required"
		});
		return;
	}

	if (!req.body.timestamp)
		req.body.timestamp = new Date();
	else
		req.body.timestamp = new Date(req.body.timestamp);

	req.knex.from('payments').insert(req.body).then(rows => {
		const paymentID = rows[0];
		req.knex.from('transactions').insert([
			{ "payment_id": paymentID, "user": from, "amount": amount },
			{ "payment_id": paymentID, "user": to, "amount": -amount }
		]).then(() => {
			res.status(201).json({
				error: false,
				message: "Payment recorded",
				id: paymentID
			});

			sendNotification(req, from, to, amount);
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

async function sendNotification(req, from, to, amount) {
	req.knex.from('users').select('notify_payment').where('email', '=', to).then(rows => {
		let useEmail = rows[0].notify_payment === 'email' || rows[0].notify_payment === 'both';
		let usePush = rows[0].notify_payment === 'push' || rows[0].notify_payment === 'both';

		if (useEmail) {
			email = {
				from: process.env.MAIL_USER,
				to: to,
				subject: "Sharehouse Pending Payment",
				text: "User " + from + " has made a payment to you of $" + amount.toFixed(2) + ", and is pending approval.\n" +
					"Please check your bank transactions and then head to https://sharehouse.jaydengrubb.com/payments to approve or reject this payment.\n\n" +
					"This is an automated email, please do not reply to this email. If you need help with an issue, go outside and ask the gatekeeper.\n" +
					"To unsubscribe or manage your notification settings, head to https://sharehouse.jaydengrubb.com/account#notifications"
			};
			req.mail.sendMail(email).catch(error => {
				// TODO Error message
				console.log(error);
			});
		}

		if (usePush) {
			req.knex.from('subscriptions').select('endpoint').where('user', '=', to).then(rows => {
				rows.forEach(row => {
					let payload = {
						type: "payment",
						user: from,
						amount: amount
					}
					req.webpush.sendNotification(JSON.parse(row.endpoint), JSON.stringify(payload));
				});
			}).catch(error => {
				// TODO Error message
				console.log(error);
			});;
		}
	}).catch(error => {
		// TODO Error message
		console.log(error);
	});
}

/**
 * Updates a payment record's details
 */
// TODO Reimplement this
/*
router.put('/:id', auth, function (req, res, next) {
	if (!req.email)
		return;

	for (var prop in req.body) {
		if (!ALLOWED_PAYMENT_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid body parameter"
			});
			return;
		}
	}

	req.knex.from('payments').update(req.body).where('id', '=', req.params.id).then(() => {
		res.status(200).json({
			error: false,
			message: "Payment update successful"
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});
*/

/**
 * Deletes a payment record
 */
router.delete('/:id', auth, function (req, res, next) {
	if (!req.admin)
		return;

	req.knex.from('payments').del().where('id', '=', req.params.id).then(() => {
		res.status(200).json({
			error: false,
			message: "Payment record deleted"
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

// TODO
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
router.all('/:id', function (req, res, next) {
	res.set('Allow', 'GET, PUT, DELETE');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET, PUT and DELETE"
	});
});
router.all('/pending', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});
router.all('/:id/approve', function (req, res, next) {
	res.set('Allow', 'PUT');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: PUT"
	});
});

module.exports = router;