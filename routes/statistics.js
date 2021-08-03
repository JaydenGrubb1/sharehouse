const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.get('/total', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('debt').sum({ total: 'debt' }).where('debt', '>', 0).then(rows => {
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

router.get('/debt/:email', auth, function (req, res, next) {
	if (!req.email)
		return;

	req.knex.from('debt').select('*').then(rows => {
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
				rows[x].paying[rows[y].user] = transfer;
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
router.all('/debt/:email', function (req, res, next) {
	res.set('Allow', 'GET');
	res.status(405).json({
		error: true,
		message: "Method not allowed, allowed methods are: GET"
	});
});

module.exports = router;