import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

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
						<Routes>
							<Route path="/payments" element={<Payments />} />
							<Route path="/statistics" element={<Statistics />} />
							<Route path="/account" element={<Account />} />
							<Route path="/admin" element={<Admin />} />
							<Route path="/users/:user" element={<User />} />
							<Route path="/" element={<Home />} />
						</Routes>
					</main>
					<Footer />
				</Router>
			</div >
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