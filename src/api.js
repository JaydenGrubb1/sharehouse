/**
 * Server address
 */
const SERVER = 'http://127.0.0.1:3001';

/**
 * Gets the users authentication token from cookie storage
 * @returns The users authentication token
 */
function getToken() {
	return document.cookie.replace("token=", "");
}

/**
 * Checks if the user is currently logged in
 * @returns True if the user is logged in
 */
export function isLoggedIn() {
	return getToken().length > 0;
}