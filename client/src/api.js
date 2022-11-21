/**
 * Server address
 */
let SERVER = process.env.REACT_APP_API;

if (isDev()) {
	// dev code
	SERVER = 'http://127.0.0.1:3001';
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
 * @param {object} content The content of the request, either an object to converted to JSON or a file to upload
 * @param {string} cache The cacheing protocol
 * @param {string} upload The name of the resource being uploaded, undefined if not uploading
 * @param {function} then A function to execute after fetch
 * @returns The error status and/or results of the fetch request
 */
function doFetch(url, method, content, cache = "default", upload = undefined, then) {
	let auth = undefined;
	if (isLoggedIn()) {
		auth = "Bearer " + getCookie("token");
	}

	let body = undefined;
	let headers = {
		"Authorization": auth
	};

	if (upload) {
		body = new FormData();
		body.append(upload, content);
	} else {
		body = JSON.stringify(content);
		headers["Content-Type"] = "application/json";
	}

	return fetch(url, {
		method: method.toUpperCase(),
		cache: cache,
		headers,
		body
	}).then(res => {
		if (res.ok)
			return res.json();
		else {
			let type = res.headers.get("Content-Type");
			if (type.includes("text/html")) {
				return {
					error: true,
					message: "Unhandled Error: (" + res.status + ") " + res.statusText
				};
			} else {
				return res.json();
			}
		}
	}).then(data => {
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
 * Gets the root address of the server
 * @returns The root address of the server
 */
export function getServerRoot() {
	return SERVER;
}

/**
 * Hashes an integer and outputs a hex string
 * @param {integer} num The integer to hash
 * @returns The hash of the integer in hex
 */
export function hashInteger(num) {
	let hash = num;
	hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
	hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
	hash = (hash >> 16) ^ hash;

	return (hash % 65536).toString(16).padStart(4, '0') + "" + num.toString(16).padStart(4, '0');
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

	return doFetch(url, "POST", { email, password }, "no-store", undefined, (data) => {
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
 * Gets a user's details or the current user if not specified
 * @param {string} email The users email
 * @returns The user's details
 */
export function getUser(email) {
	if (!email) {
		email = getEmail();
	}

	const url = new URL(SERVER + "/users/" + encodeURIComponent(email) + "/details");

	return doFetch(url, "GET");
}

/**
 * Gets a list of all users
 * @returns A list of user's
 */
export function getAllUsers() {
	const url = new URL(SERVER + "/users");

	return doFetch(url, "GET");
}

/**
 * Gets the current user's config
 * @returns The user's config
 */
export function getUserConfig() {
	const url = new URL(SERVER + "/users/config");

	return doFetch(url, "GET");
}

/**
 * Sets the current user's password
 * @param {string} password The user's new password
 * @returns The error status of the operation
 */
export function setPassword(password) {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return doFetch(url, "PUT", { password }, "no-store");
}

/**
 * Sets the current user's details
 * @param {object} details The user's new details
 * @returns The error status of the operation
 */
export function setDetails(details) {
	const url = new URL(SERVER + "/users/" + encodeURIComponent(getEmail()));

	return doFetch(url, "PUT", details, "no-store", undefined, (data) => {
		if (!data.error && data.new_token)
			setCookie("token", data.new_token.token, data.new_token.expires_in);
		return data;
	})
}

/**
 * Gets the current user's notification options
 * @returns The user's notification options
 */
export function getNotifyOptions() {
	const url = new URL(SERVER + "/users/notify");

	return doFetch(url, "GET");
}

/**
 * Sets the current user's notification options
 * @param {object} options The user's new notification options
 * @returns The error status of the operation
 */
export function setNotifyOptions(options) {
	const url = new URL(SERVER + "/users/notify");

	return doFetch(url, "PUT", options, "no-store");
}

// DOC
export function getVAPID() {
	const url = new URL(SERVER + "/notification/vapid");

	return doFetch(url, "GET");
}

// DOC
export function registerDevice(endpoint) {
	const url = new URL(SERVER + "/notification/register");

	return doFetch(url, "POST", endpoint, "no-store");
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

export function getStatInfo(type = "store") {
	const url = new URL(SERVER + "/statistics/info/" + type);

	return doFetch(url, "GET");
}

/**
 * Gets a list of payments
 * @returns A list of payments
 */
export function getPayments(from, to, status, limit = 5, page = 0, order = 'timestamp', reverse = false) {
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

	return doFetch(url, "GET");
}

/**
 * Gets a list of the current users pending payments
 * @returns A list of pending payments
 */
export function getPending() {
	const url = new URL(SERVER + "/payments/pending");

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
 * Gets details about a receipt
 * @param {integer} id The id of the receipt
 * @returns Details about the receipt
 */
export function getReceipt(id) {
	const url = new URL(SERVER + "/receipts/" + id);

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
 * Uploads an image and associates it with a receipt
 * @param {file} image The image file to upload
 * @param {integer} id The ID of the receipt to associate with
 * @returns The error status of the operation
 */
export function uploadReceiptImg(image, id) {
	const url = new URL(SERVER + "/receipts/upload/" + id);

	return doFetch(url, "POST", image, "no-store", "image");
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