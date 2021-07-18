/**
 * Server address
 */
const SERVER = 'http://192.168.86.42:3001';

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
function getEmail() {
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
	return fetch(SERVER + "/users/login", {
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
	return fetch(SERVER + "/users/" + encodeURIComponent(getEmail()), {
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
	return fetch(SERVER + "/users/" + encodeURIComponent(getEmail()), {
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
	return fetch(SERVER + "/users/" + encodeURIComponent(getEmail()), {
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