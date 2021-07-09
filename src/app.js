import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "normalize.css"
import "./styles/app.css";
import Header from "./components/header";
import Home from "./pages/home";

export default function App() {
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
}