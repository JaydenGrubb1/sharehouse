const express = require('express');
const router = express.Router();
const auth = require('../auth');

const ALLOWED_AVERAGE_MODES = [
	'average_01',
	'average_02',
	'average_03',
	'average_06',
	'average_12',
	'average_all'
]

router.get('/total', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('v_debt').sum({ total: 'debt' }).where('debt', '>', 0).then(rows => {
		res.status(200).json({
			error: false,
			total: rows[0].total
		});
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

// FIXME Does not work with new database yet
router.get('/average/:months', auth, function (req, res, next) {
	// if (!req.email)
	// 	return;

	// FIXME
	res.status(501).json({
		error: true,
		message: "Statistics has not yet been reimplemented"
	});
	return;

	const mode = req.params.months;
	if (!ALLOWED_AVERAGE_MODES.includes(mode)) {
		res.status(400).json({
			error: true,
			message: "Invalid average mode"
		});
		return;
	}

	req.knex.from(mode).select('*').then(rows => {
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

router.get('/debt/:email', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('v_debt').select('*').then(rows => {
		let count = rows.length;
		for (let x = 0; x < count; x++) {
			if (rows[x].debt < 0)
				continue;
			for (let y = 0; y < x; y++) {
				let transfer = Math.min(Math.abs(rows[y].debt), rows[x].debt);
				transfer = parseFloat(transfer.toFixed(2));
				if (transfer === 0)
					continue;

				rows[y].debt += transfer;
				rows[x].debt -= transfer;
				if (!rows[x].paying)
					rows[x].paying = {};
				if (!rows[y].paying)
					rows[y].paying = {};
				rows[x].paying[rows[y].user] = transfer;
				rows[y].paying[rows[x].user] = -1 * transfer;
			}
		}

		for (let i = 0; i < count; i++) {
			if (rows[i].user == req.params.email) {
				res.status(200).json({
					error: false,
					data: rows[i].paying
				});
				return;
			}
		}

		res.status(200).json(rows);
	}).catch(error => {
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
		console.log(error);
	});
});

router.get('/info/stores', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('receipts').select('store').count({ frequency: '*' })
		.groupBy('store').orderBy('frequency', 'desc').then(rows => {
			res.status(200).json({
				error: false,
				data: rows.filter(x => x.store !== null)
			});
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
		});
});

router.get('/info/locations', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('receipts').select('location').count({ frequency: '*' })
		.groupBy('location').orderBy('frequency', 'desc').then(rows => {
			res.status(200).json({
				error: false,
				data: rows.filter(x => x.location !== null)
			});
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
		});
});

/**```
 * Method not allowed handlers
 */
router.all('/total', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});
router.all('/average/:months', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});
router.all('/debt/:email', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});
router.all('/info/stores', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});
router.all('/info/locations', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});

module.exports = router;