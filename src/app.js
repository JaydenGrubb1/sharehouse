import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/header";
import Home from "./pages/home";
import Login from "./components/login";

import { isLoggedIn } from "./api";

export default function App() {
	if (isLoggedIn()) {
		return (
			<div>
				<Helmet>
					<title>Sharehouse</title>
				</Helmet>
				<Router>
					<Header />
					<main>
						<Switch>
							<Route path="/">
								<Home />
							</Route>
						</Switch>
					</main>
				</Router>
			</div>
		);
	} else {
		return (
			<div>
				<Helmet>
					<title>Login</title>
				</Helmet>
				<Login />
			</div>
		);
	}
}