import React from "react";
import ReactDOM from "react-dom";
import { isDev } from "./api";
import App from "./app";

const rootElement = document.getElementById("root");
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	rootElement
);

navigator.serviceWorker.register('/worker.js').then(rego => {
	console.log(rego);
}).catch(error => {
	console.log(error);
});