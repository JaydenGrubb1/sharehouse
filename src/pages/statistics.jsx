import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { CardDeck, Collapse, UncontrolledAlert } from "reactstrap";
import Averages from "../components/statistics/average";

export default function Statistics() {

	const [error, setError] = useState();

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Statistics</title>
			</Helmet>
			<Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse>
			<h4 className="text-left">Statistics</h4>
			<CardDeck className="mt-3">
				<Averages error={setError} />
			</CardDeck>
		</div>
	);
}