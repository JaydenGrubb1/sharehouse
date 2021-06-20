const express = require('express');
const router = express.Router();

router.get('/payments', function (req, res, next) {
	if (req.query.user) {
		req.knex.from('payments').select('*').where('from_id', '=', req.query.user).then(rows => {
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
	}else{
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

router.get('/receipts', function (req, res, next) {
	if (req.query.user) {
		req.knex.from('receipts').select('*').where('user_id', '=', req.query.user).then(rows => {
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
	}else{
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