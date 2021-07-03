const express = require('express');
const router = express.Router();
const auth = require('../auth');

const ALLOWED_RECEIPT_FIELDS = {
	user: "",
	store: "",
	cost: 0.0
}

/**
 * Gets all receipts
 */
router.get('/', auth, function (req, res, next) {
	if (!req.email)
		return;

	if (req.query.user) {
		req.knex.from('receipts').select('*').where('user', '=', req.query.user).then(rows => {
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
	} else {
		req.knex.from('receipts').select('*').then(rows => {
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
	}
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

	const user = req.body.user;
	const cost = req.body.cost;

	if (!user || !cost) {
		res.status(400).json({
			error: true,
			message: "Request body incomplete, both a user and cost are required"
		});
		return;
	}

	req.knex.from('receipts').insert(req.body).then(rows => {
		req.knex.from('payments').insert({
			from: user,
			to: user,
			amount: cost,
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
router.put('/', auth, function (req, res, next) {
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

module.exports = router;