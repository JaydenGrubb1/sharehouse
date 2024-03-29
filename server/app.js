const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const options = require('./knexfile');
const knex = require('knex')(options);
const helmet = require('helmet');
const mailer = require('nodemailer');
const push = require('web-push');
const fs = require('fs');
const upload = require('express-fileupload');
const cors = require('cors');

const notificationRouter = require('./routes/notification');
const paymentsRouter = require('./routes/payments');
const receiptsRouter = require('./routes/receipts');
const statisticsRouter = require('./routes/statistics');
const userRouter = require('./routes/users');

const app = express();
const transporter = mailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});
push.setVapidDetails('mailto:' + process.env.MAIL_USER, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);

app.use(logger('combined'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(upload({
	createParentPath: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
	req.knex = knex;
	req.mail = transporter;
	req.webpush = push;
	req.pathfunc = path;
	req.fs = fs;
	next();
});

app.use('/notification', notificationRouter);
app.use('/payments', paymentsRouter);
app.use('/receipts', receiptsRouter);
app.use('/statistics', statisticsRouter);
app.use('/users', userRouter);

app.use('/test', function (req, res, next) {
	res.status(200).json({
		error: false,
		message: "Test completed succesfully at " + new Date().toLocaleString()
	});
});
app.use(function (req, res, next) {
	res.status(404).json({
		error: true,
		message: "Page not found",
		url: req.protocol + '://' + req.get('host') + req.originalUrl
	});
});

// TODO Periodically delete temp uploads folder

module.exports = app;