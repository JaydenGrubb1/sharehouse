/**
 * Server port
 */
let PORT = 8080;

/**
 * Server address
 */
let SERVER = 'https://sharehouse.jaydengrubb.com:' + PORT + '/api';

if (isDev()) {
	// dev code
	SERVER = 'http://127.0.0.1:3001';
	// SERVER = 'https://sharehouse.jaydengrubb.com:8080/api';
	// SERVER = 'https://sharehouse.jaydengrubb.com:8082/api';
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
 * Performs a fetch request with a set of arguements
 * @param {URL} url The URL of the endpoint to access
 * @param {string} method The request method, i.e. GET, POST, PUT, etc
 * @param {object} body The body of the request (will be passed through JSON.Stringify())
 * @param {string} cache The cacheing protocol
 * @param {function} then A function to execute after fetch
 * @returns The error status and/or results of the fetch request
 */
function doFetch(url, method, body, cache = "default", then) {
	let auth = undefined;
	if (isLoggedIn()) {
		auth = "Bearer " + getCookie("token");
	}

	return fetch(url, {
		method: method.toUpperCase(),
		cache: cache,
		headers: {
			"Content-Type": "application/json",
			"Authorization": auth
		},
		body: JSON.stringify(body)
	}).then(res => res.json()).then(data => {
		if (data) {
			if (then)
				return then(data);
			else
				return data;
		} else {
			if (then)
				return then();
			else
				return null;
		}
	}).catch(e => {
		console.log(e);
		return JSON.stringify({
			error: true,
			message: "Connection timed out"
		});
	});
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
export function isAdmin() {
	const token = getCookie("token");
	const payload = token.split(".")[1];
	const data = JSON.parse(atob(payload));
	return data.admin === 1;
}

/**
 * Checks if this is a dev version of the site
 * @returns True if this is a dev version of the site
 */
export function isDev() {
	return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
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

	return doFetch(url, "POST", { email, password }, "no-store", (data) => {
		if (!data.error)
			setCookie("token", data.token, data.expires_in);
		return data;
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

	return doFetch(url, "GET");
}

/**
 * Sets the current user's password
 * @param {string} password The user's new password
 * @returns The error status of the operation
 */
export function setPassword(password) {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return doFetch(url, "PUT", password, "no-store");
}

/**
 * Sets the current user's details
 * @param {object} details The user's new details
 * @returns The error status of the operation
 */
export function setDetails(details) {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return doFetch(url, "PUT", details, "no-store", (data) => {
		if (!data.error && data.new_token)
			setCookie("token", data.new_token.token, data.new_token.expires_in);
		return data;
	})
}

/**
 * Gets the current user's debt
 * @returns The user's debt
 */
export function getDebt() {
	const url = new URL(SERVER + "/statistics/debt/" + encodeURIComponent(getEmail()));

	return doFetch(url, "GET");
}

/**
 * Gets the total unpaid debt
 * @returns The total unpaid debt
 */
export function getTotalDebt() {
	const url = new URL(SERVER + "/statistics/total");

	return doFetch(url, "GET");
}

/**
 * Gets a list of payments
 * @returns A list of payments
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

	return doFetch(url, "GET");
}

/**
 * Gets a list of receipts
 * @returns A list of receipts
 */
export function getReceipts(user, limit = 10, page = 0, order = 'timestamp', reverse = false) {
	const url = new URL(SERVER + "/receipts");

	if (user)
		url.searchParams.append("user", user);

	url.searchParams.append("limit", limit);
	url.searchParams.append("page", page);
	url.searchParams.append("order", order);
	url.searchParams.append("reverse", reverse);

	return doFetch(url, "GET");
}

/**
 * Approves or rejects a payment
 * @param {integer} id The id of the payment
 * @param {boolean} accepted True to approve, false to reject
 * @returns The error status of the operation
 */
export function approvePayment(id, accepted) {
	const url = new URL(SERVER + "/payments/" + id + "/approve");

	return doFetch(url, "PUT", { accepted: accepted });
}

/**
 * Creates a receipt entry
 * @param {object} details The details of the receipt
 * @returns The error status of the operation
 */
export function createReceipt(details) {
	const url = new URL(SERVER + "/receipts");

	return doFetch(url, "POST", details, "no-store");
}

/**
 * Creates a payment entry
 * @param {object} details The details of the payment
 * @returns The error status of the operation
 */
export function createPayment(details) {
	const url = new URL(SERVER + "/payments");

	return doFetch(url, "POST", details, "no-store");
}

/**
 * Gets a list of averages
 * @param {string} mode The averaging mode to use
 * @returns A list of average data points
 */
export function getAverages(mode) {
	const url = new URL(SERVER + "/statistics/average/" + mode);

	return doFetch(url, "GET");
}