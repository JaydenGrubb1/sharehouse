const express = require('express');
const router = express.Router();
const auth = require('../auth');

const ALLOWED_RECEIPT_FIELDS = {
	user: "",
	store: "",
	cost: 0.0,
	timestamp: ""
}

const ALLOWD_GETALL_FIELDS = {
	user: ""
}

const DEFAULT_SORTING_ORDERS = {
	timestamp: false
}

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
		if (!ALLOWD_GETALL_FIELDS.hasOwnProperty(prop)) {
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

	let query = req.knex.from('receipts').select(req.knex.raw('SQL_CALC_FOUND_ROWS *'))
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

	req.knex.from('receipts').select('*').where('id', '=', req.params.id).then(rows => {
		if (rows.length !== 1) {
			res.status(404).json({
				error: true,
				message: "Receipt with the requested ID could not be found"
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

	if (!req.body.cost) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, cost is required"
		});
		return;
	}

	if (req.body.user && !req.admin) {
		res.status(403).json({
			error: true,
			message: "Forbidded, must be an admin user"
		});
		return;
	}

	if (!req.body.user)
		req.body.user = req.email;

	if (!req.body.timestamp)
		req.body.timestamp = new Date();
	else
		req.body.timestamp = new Date(req.body.timestamp);

	req.knex.from('receipts').insert(req.body).then(rows => {
		req.knex.from('payments').insert({
			from: req.body.user,
			to: req.body.user,
			amount: req.body.cost,
			timestamp: req.body.timestamp,
			status: "approved"
		}).then(rows2 => {
			res.status(201).json({
				error: false,
				message: "Receipt created",
				receiptID: rows[0],
				paymentID: rows2[0]
			});
		})
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

/**
 * Updates a receipt's details
 */
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

/**
 * Deletes a receipt
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