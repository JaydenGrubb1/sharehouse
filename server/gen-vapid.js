const push = require('web-push');
const vapidKeys = push.generateVAPIDKeys();
console.log(vapidKeys);