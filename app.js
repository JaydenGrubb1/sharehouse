const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const options = require('./knexfile');
const knex = require('knex')(options);
const helmet = require('helmet');
const cors = require('cors');

const paymentsRouter = require('./routes/payments');
const receiptsRouter = require('./routes/receipts');
const statisticsRouter = require('./routes/statistics');
const userRouter = require('./routes/users');

const app = express();

app.use(logger('combined'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
	req.knex = knex;
	next();
});

app.use('/payments', paymentsRouter);
app.use('/receipts', receiptsRouter);
app.use('/statistics', statisticsRouter);
app.use('/users', userRouter);

app.use('/test', function (req, res, next) {
	res.status(200).json({
		error: false,
		message: "Test successful"
	});
});
app.use(function (req, res, next) {
	res.status(404).json({
		error: true,
		message: "Page not found",
		url: req.protocol + '://' + req.get('host') + req.originalUrl
	});
});

module.exports = app;