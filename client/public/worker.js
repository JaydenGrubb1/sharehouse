self.addEventListener('push', (event) => {
	let payload;
	try {
		payload = JSON.parse(event.data.text());
	} catch (error) {
		// TODO Check error
		return;
	}

	let body = "";
	let title = "";

	if (payload.type === 'receipt') {
		body = payload.user + " added a receipt of $" + payload.amount.toFixed(2);
		title = "Receipt Added";
	}
	else {
		body = payload.user + " paid you $" + payload.amount.toFixed(2);
		title = "Payment Added"
	}

	let options = {
		body: body,
		// icon: 'favicon.ico',
		badge: 'favicon.ico',
		// vibrate: [100, 50, 100],
		// Star Wars because why not
		// Doesn't work on devices newer than Android 8.0
		vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
		tag: 'sharehouse-' + payload.type,
		renotify: true,
		data: {
			dateOfArrival: Date.now(),
			primaryKey: '2'
		},
		actions: [
			{
				action: 'view', title: payload.type === 'receipt' ? 'View Receipts' : 'View Payments',
				// icon: 'images/checkmark.png'
			},
			{
				action: 'close', title: 'Close',
				// icon: 'images/xmark.png'
			},
		]
	};
	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	
	if (event.action === 'close') {
		return;
	}

	clients.openWindow('https://sharehouse.jaydengrubb.com/payments');
});