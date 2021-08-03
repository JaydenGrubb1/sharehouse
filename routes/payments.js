const express = require('express');
const router = express.Router();
const auth = require('../auth');

const ALLOWED_PAYMENT_FIELDS = {
	from: "",
	to: "",
	amount: 0.0,
	timestamp: ""
}

const ALLOWD_GETALL_FIELDS = {
	from: "",
	to: "",
	status: "",
	self: 0
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

	req.knex.from('payments').select('to', 'status').where('id', '=', id).then(rows => {
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
	const reverse = req.query.reverse === true;

	delete req.query.limit;
	delete req.query.page;
	delete req.query.order;
	delete req.query.reverse;

	for (var prop in req.query) {
		if (!ALLOWD_GETALL_FIELDS.hasOwnProperty(prop)) {
			res.status(400).json({
				error: true,
				message: "Invalid query parameter"
			});
			return;
		}
	}

	let query = req.knex.from(function () {
		this.select(req.knex.raw('*, (`from` = `to`) as `self`')).from(`payments`).as(`all`)
	}).select('*');

	if (Object.keys(req.query).length > 0)
		query.where(req.query);

	if (limit && limit > 0) {
		query.limit(limit);

		if (offset && offset >= 0)
			query.offset(offset);
	}

	if (order)
		query.orderBy(order, reverse ? 'asc' : 'dec');

	query.then(rows => {
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
 * Gets a payment record with a specific ID
 */
router.get('/:id', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('payments').select('*').where('id', '=', req.params.id).then(rows => {
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

	if (!req.body.from || !req.body.to || !req.body.amount) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, fields: from, to and amount are all required"
		});
		return;
	}

	if (!req.body.timestamp)
		req.body.timestamp = new Date();

	req.knex.from('payments').insert(req.body).then(rows => {
		res.status(201).json({
			error: false,
			message: "Payment recorded",
			id: rows[0]
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
 * Updates a payment record's details
 */
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

/**
 * Deletes a payment record
 */
router.delete('/:id', auth, function (req, res, next) {
	if (!req.admin)
		return;

	req.knex.from('payment').del().where('id', '=', req.params.id).then(() => {
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
router.all('/:id/approve', function (req, res, next) {
	res.set('Allow', 'PUT');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: PUT"
	});
});

module.exports = router;