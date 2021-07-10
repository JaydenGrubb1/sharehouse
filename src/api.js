/**
 * Server address
 */
const SERVER = 'http://192.168.86.42:3001';

/**
 * Gets the users authentication token from cookie storage
 * @returns The users authentication token
 */
function getToken() {
	const cookie = document.cookie;
	if (!cookie) {
		return null;
	}
	const token = cookie.split("; ").find(x => x.startsWith("token="));
	if (!token) {
		return null;
	}
	return token.split("=")[1];
}

/**
 * Stores the users authentication token into cookie storage
 * @param {string} token The user authentication token
 * @param {integer} expiry The expiry time in seconds from now
 */
function setToken(token, expiry) {
	let date = new Date();
	date.setSeconds(date.getSeconds() + expiry);
	document.cookie = "token=" + token + "; expires=" + date.toUTCString() + "; path=/;";
}

/**
 * Checks if the user is currently logged in
 * @returns True if the user is logged in
 */
export function isLoggedIn() {
	return getToken() !== null;
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
			setToken(data.token, data.expires_in);
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
	setToken("", -86400);
	window.location.reload();
}