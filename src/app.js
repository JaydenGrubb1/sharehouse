import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/header";
import Login from "./components/login";

import Home from "./pages/home";
import Payments from "./pages/payments";
import Statistics from "./pages/statistics";
import Account from "./pages/account";

import { isLoggedIn } from "./api";

export default function App() {
	if (isLoggedIn()) {
		return (
			<div>
				<Router>
					<Header />
					<main>
						<Switch>
							<Route path="/payments">
								<Payments />
							</Route>
							<Route path="/statistics">
								<Statistics />
							</Route>
							<Route path="/account">
								<Account />
							</Route>
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