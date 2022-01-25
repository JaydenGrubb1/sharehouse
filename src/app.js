import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/header";
import Login from "./components/modals/login";

import Home from "./pages/home";
import Payments from "./pages/payments";
import Statistics from "./pages/statistics";
import User from "./pages/user";
import Account from "./pages/account";
import Admin from "./pages/admin";

import { isLoggedIn } from "./api";
import Footer from "./components/footer";

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
							<Route path="/account/:user">
								<User />
							</Route>
							<Route path="/account">
								<Account />
							</Route>
							<Route path="/admin">
								<Admin />
							</Route>
							<Route path="/">
								<Home />
							</Route>
						</Switch>
					</main>
					<Footer />
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