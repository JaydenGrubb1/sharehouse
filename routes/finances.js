const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.get('/debt/:email', auth, function (req, res, next) {
	if (!req.email)
		return;

	let dict = {};
	let total = 0;

	req.knex.from('payments').select('from').sum({ debt: 'amount' })
		.where({status: 'approved'}).groupBy('from').orderBy('debt', 'desc').then(rows => {
			let count = rows.length;
			for (let i = 0; i < count; i++) {
				total += rows[i].debt;
				dict[i] = new Object();
				dict[i].id = rows[i].from;
				dict[i].paid = rows[i].debt;
			}
			for (let i = 0; i < count; i++) {
				dict[i].debt = (total / count) - dict[i].paid;
				dict[i].remaining = Math.min(dict[i].debt, 0);
				dict[i].paying = new Object();
			}
			for (let x = 0; x < count; x++) {
				if (dict[x].debt > 0)
					continue;
				for (let y = 0; y < count; y++) {
					if (x === y)
						continue;
					if (dict[y].debt <= 0)
						continue;
					if (dict[x].remaining >= 0)
						break;

					let trans = Math.min(Math.abs(dict[x].remaining), Math.abs(dict[y].debt));
					dict[x].remaining += trans;
					dict[y].debt -= trans;
					dict[y].paying[dict[x].id] = trans;
				}
			}
			for(let i = 0; i < count; i++){
				if(dict[i].id == req.params.email){
					res.status(200).json({
						error: false,
						data: dict[i].paying
					});
					return;
				}
			}
			res.status(200).json({
				error: false,
				data: dict
			})
		}).catch(error => {
			res.status(500).json({
				error: true,
				message: "Internal server error"
			});
			console.log(error);
		});
});

router.get('/payments', auth, function (req, res, next) {
	if (!req.email)
		return;

	if (req.query.user) {
		req.knex.from('payments').select('*').where('from', '=', req.query.user).then(rows => {
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
		req.knex.from('payments').select('*').then(rows => {
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

router.get('/receipts', auth, function (req, res, next) {
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

module.exports = router;