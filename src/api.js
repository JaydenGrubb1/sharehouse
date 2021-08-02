/**
 * Server address
 */
let SERVER = "";
 if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
	SERVER = 'http://127.0.0.1:3001';
} else {
	SERVER = 'https://sharehouse.jaydengrubb.com:8080/api';
    // production code
}

/**
 * Gets the value of a specified cookie
 * @param {string} name The name of the cookie to retrieve
 * @returns The value of the cookie
 */
function getCookie(name) {
	const cookies = document.cookie;
	if (!cookies) {
		return null;
	}
	const cookie = cookies.split("; ").find(x => x.startsWith(name + "="));
	if (!cookie) {
		return null;
	}
	return cookie.split("=")[1];
}

/**
 * Stores a cookie
 * @param {string} name The name of the cookie
 * @param {object} value The value of the cookie
 * @param {integer} expiry The expiry time of the cookie in seconds from now
 */
function setCookie(name, value, expiry) {
	let date = new Date();
	date.setSeconds(date.getSeconds() + expiry);
	document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/; samesite=lax;";
}

/**
 * Gets the current user's email
 * @returns The current user's email
 */
export function getEmail() {
	const token = getCookie("token");
	const payload = token.split(".")[1];
	const data = JSON.parse(atob(payload));
	return data.email;
}

/**
 * Gets the current user's admin state
 * @returns True if the current user is an admin
 */
export function getAdmin() {
	const token = getCookie("token");
	const payload = token.split(".")[1];
	const data = JSON.parse(atob(payload));
	return data.admin === 1;
}

/**
 * Checks if the user is currently logged in
 * @returns True if the user is logged in
 */
export function isLoggedIn() {
	return getCookie("token") !== null;
}

/**
 * Attempts to log a user in and retrieve their JWT
 * @param {string} email The users email
 * @param {string} password The users password
 * @returns The data object returned by the fetch request
 */
export function doLogin(email, password) {
	const url = new URL(SERVER + "/users/login");

	return fetch(url.href, {
		method: "POST",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			password
		})
	}).then(res => res.json()).then(data => {
		if (!data.error)
			setCookie("token", data.token, data.expires_in);
		return data;
	}).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Logs a user out by deleting the JWT
 */
export function doLogout() {
	setCookie("token", "", -86400);
	window.location.reload();
}

/**
 * Gets the current user's details
 * @returns The user's details
 */
export function getUser() {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return fetch(url.href, {
		method: "GET",
		cache: "default",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		}
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Sets the current user's password
 * @param {string} password The user's new password
 * @returns The error status of the operation
 */
export function setPassword(password) {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return fetch(url.href, {
		method: "PUT",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		},
		body: JSON.stringify({
			password
		})
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Sets the current user's details
 * @param {object} details The user's new details
 * @returns The error status of the operation
 */
export function setDetails(details) {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return fetch(url.href, {
		method: "PUT",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		},
		body: JSON.stringify(details)
	}).then(res => res.json()).then(data => {
		if (!data.error && data.new_token)
			setCookie("token", data.new_token.token, data.new_token.expires_in);
		return data;
	}).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Gets the current user's debt
 * @returns The user's debt
 */
export function getDebt() {
	const url = new URL(SERVER + "/statistics/debt/" + encodeURIComponent(getEmail()));

	return fetch(url.href, {
		method: "GET",
		cache: "default",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		}
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Gets the total unpaid debt
 * @returns The total unpaid debt
 */
export function getTotalDebt() {
	const url = new URL(SERVER + "/statistics/total");

	return fetch(url.href, {
		method: "GET",
		cache: "default",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		}
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Gets a list of the users payments
 * @returns A list of the users payments
 */
export function getPayments(from, to, status, limit = 5, page = 0, order = 'timestamp', reverse = false, self = false) {
	const url = new URL(SERVER + "/payments");

	if (from)
		url.searchParams.append("from", from);
	if (to)
		url.searchParams.append("to", to);
	if (status)
		url.searchParams.append("status", status);

	url.searchParams.append("limit", limit);
	url.searchParams.append("page", page);
	url.searchParams.append("order", order);
	url.searchParams.append("reverse", reverse);
	url.searchParams.append("self", self);

	return fetch(url.href, {
		method: "GET",
		cache: "default",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		}
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Approves or rejects a payment
 * @param {integer} id The id of the payment
 * @param {boolean} approved True to approve, false to reject
 * @returns The error status of the operation
 */
export function approvePayment(id, approved) {
	const url = new URL(SERVER + "/payments/" + id + "/approve");

	return fetch(url.href, {
		method: "PUT",
		cache: "default",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		},
		body: JSON.stringify({ accepted: approved })
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}

/**
 * Creates a receipt entry
 * @param {object} details The details of the receipt
 * @returns The error status of the operation
 */
export function createReceipt(details) {
	const url = new URL(SERVER + "/receipts");

	return fetch(url.href, {
		method: "POST",
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getCookie("token")
		},
		body: JSON.stringify(details)
	}).then(res => res.json()).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	})
}