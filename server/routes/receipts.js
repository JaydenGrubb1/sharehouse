const express = require('express');
const router = express.Router();
const auth = require('../auth');

const ALLOWED_RECEIPT_FIELDS = {
	user: "",
	store: "",
	location: "",
	description: "",
	amount: 0.0,
	timestamp: "",
	contributions: []
}

const ALLOWED_CONTRIBUTION_FIELDS = {
	user: "",
	amount: 0.0
}

const ALLOWED_GETALL_FIELDS = {
	user: ""
}

const DEFAULT_SORTING_ORDERS = {
	timestamp: false,
	amount: false
}

const CONTRIBUTION_ERROR_THRESHOLD = 0.00000001;

/**
 * Gets all receipts
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

	let query = req.knex.from('v_receipts').select(req.knex.raw('SQL_CALC_FOUND_ROWS *'))
		.where('timestamp', '>=', '1970-01-01 00:00:00');

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

	// TODO Figure out why this was here
	// if (req.query.user) {
	// 	req.knex.from('receipts').select('*').where('timestamp', '>=', '1970-01-01 00:00:00').where('user', '=', req.query.user).then(rows => {
	// 		res.status(200).json({
	// 			error: false,
	// 			data: rows
	// 		});
	// 	}).catch(error => {
	// 		res.status(500).json({
	// 			error: true,
	// 			message: "Internal server error"
	// 		});
	// 		console.log(error);
	// 	});
	// } else {
	// 	req.knex.from('receipts').select('*').where('timestamp', '>=', '1970-01-01 00:00:00').then(rows => {
	// 		res.status(200).json({
	// 			error: false,
	// 			data: rows
	// 		});
	// 	}).catch(error => {
	// 		res.status(500).json({
	// 			error: true,
	// 			message: "Internal server error"
	// 		});
	// 		console.log(error);
	// 	});
	// }
});

/**
 * Gets a receipt with a specific ID
 */
router.get('/:id', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('v_receipts').select('*').where('id', '=', req.params.id).then(rows => {
		if (rows.length !== 1) {
			res.status(404).json({
				error: true,
				message: "Receipt with the requested ID could not be found"
			});
			return;
		}

		req.knex.from('transactions').select('user', req.knex.raw('-amount as amount'))
			.where('receipt_id', '=', req.params.id).where('amount', '<', 0).then(rows2 => {
				rows[0].contributions = rows2;
				res.status(200).json({
					error: false,
					data: rows[0]
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
 * Creates a receipt
 */
router.post('/', auth, function (req, res, next) {
	if (!req.email)
		return;

	for (var prop in req.body) {
		if (!ALLOWED_RECEIPT_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid body parameter"
			});
			return;
		}
	}

	let contributions = req.body.contributions;
	let amount = req.body.amount;
	let user = req.body.user;

	if (!amount || !contributions) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, both amount and contributions are required"
		});
		return;
	}

	contributions.forEach(x => {
		for (var prop in x) {
			if (!ALLOWED_CONTRIBUTION_FIELDS.hasOwnProperty(prop)) {
				res.status(400).json({
					error: true,
					message: "Invalid contributions parameter"
				});
				return;
			}
		}
	});

	if (Math.abs(contributions.reduce((a, x) => a += x.amount, 0) - amount) > CONTRIBUTION_ERROR_THRESHOLD) {
		res.status(400).json({
			error: true,
			message: "Invalid contributions distribution"
		});
		return;
	}

	if (user && !req.admin) {
		res.status(403).json({
			error: true,
			message: "Forbidded, must be an admin user"
		});
		return;
	}

	if (!user)
		user = req.email;

	if (!req.body.timestamp)
		req.body.timestamp = new Date();
	else
		req.body.timestamp = new Date(req.body.timestamp);

	delete req.body.contributions;
	delete req.body.amount;
	delete req.body.user;

	req.knex.from('receipts').insert(req.body).then(rows => {
		const receiptID = rows[0];
		contributions.push({ user, amount: -amount });
		contributions.forEach(x => {
			x.receipt_id = receiptID;
			x.amount *= -1;
		});

		req.knex.from('transactions').insert(contributions).then(() => {
			res.status(201).json({
				error: false,
				message: "Receipt created",
				id: receiptID
			});
			let recipients = contributions.filter(x => Math.sign(x.amount) !== Math.sign(amount));
			sendNotification(req, recipients, req.body, user, amount);
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

async function sendNotification(req, recipients, details, user, amount) {
	recipients.forEach(recipient => {
		req.knex.from('users').select('notify_receipt').where('email', '=', recipient.user).then(rows => {
			let useEmail = rows[0].notify_receipt === 'email' || rows[0].notify_receipt === 'both';
			let usePush = rows[0].notify_receipt === 'push' || rows[0].notify_receipt === 'both';

			if (useEmail) {
				email = {
					from: process.env.MAIL_USER,
					to: recipient.user,
					subject: "Sharehouse Receipt Added",
					text: "User " + user + " has added a receipt of $" + amount.toFixed(2) + ".\n" +
						"To view details about this receipt head to https://sharehouse.jaydengrubb.com/payments .\n\n" +
						"This is an automated email, please do not reply to this email. If you need help with an issue, go outside and ask the gatekeeper.\n" +
						"To unsubscribe or manage your notification settings, head to https://sharehouse.jaydengrubb.com/account#notifications"
				};
				req.mail.sendMail(email).catch(error => {
					// TODO Error message
					console.log(error);
				});
			}

			if (usePush) {
				req.knex.from('subscriptions').select('endpoint').where('user', '=', recipient.user).then(rows => {
					rows.forEach(row => {
						let payload = {
							type: "receipt",
							user: user,
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
	});
}

/**
 * Updates a receipt's details
 */
// TODO Reimplement this
/*
router.put('/:id', auth, function (req, res, next) {
	if (!req.email)
		return;

	for (var prop in req.body) {
		if (!ALLOWED_RECEIPT_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid body parameter"
			});
			return;
		}
	}

	req.knex.from('receipts').update(req.body).where('id', '=', req.params.id).then(() => {
		res.status(200).json({
			error: false,
			message: "Receipt update successful"
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
 * Deletes a receipt //TODO Should work, needs testing
 */
router.delete('/:id', auth, function (req, res, next) {
	if (!req.admin)
		return;

	req.knex.from('receipts').del().where('id', '=', req.params.id).then(() => {
		res.status(200).json({
			error: false,
			message: "Receipt deleted"
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
router.all('/:id', function (req, res, next) {
	res.set('Allow', 'GET, PUT, DELETE');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET, PUT and DELETE"
	});
});

module.exports = router;