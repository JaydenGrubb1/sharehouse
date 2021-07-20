import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { CardDeck, Collapse, UncontrolledAlert } from "reactstrap";
import Pending from "../components/payments/pending";
import TotalDebt from "../components/payments/totaldebt";
import Transactions from "../components/payments/transactions";
import YourDebt from "../components/payments/yourdebt";

export default function Payments() {

	const [error, setError] = useState();

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Payments</title>
			</Helmet>
			<Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse>
			<h4 className="text-left">Payments</h4>
			<CardDeck className="mt-3">
				<YourDebt error={setError} />
				<TotalDebt error={setError} />
			</CardDeck>
			<Pending error={setError} />
			<Transactions error={setError} />
		</div>
	);
}