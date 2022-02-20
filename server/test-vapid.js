const push = require('web-push');
require('dotenv').config();

push.setVapidDetails('mailto:' + process.env.MAIL_USER, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);

let sub = {}; // retrieve from database

push.sendNotification(sub, 'test message');