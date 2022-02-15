import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Collapse, UncontrolledAlert } from "reactstrap";
import { getUser } from "../api";
import Details from "../components/account/details";
import Security from "../components/account/security";

export default function Account() {

	const [updated, setUpdated] = useState(new Date());

	const [error, setError] = useState("");

	async function getLastUpdated() {
		let results = await getUser();

		if (results.error || !results.data) {
			if (results.error)
				setError(results.error);
			else
				setError("An unknown error occured");
		} else {
			if (results.data.updated)
				setUpdated(new Date(results.data.updated));
			else
				setUpdated(null);
		}
	}

	useEffect(() => {
		getLastUpdated();
	}, []);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Account</title>
			</Helmet>
			<Collapse isOpen={!updated}>
				<UncontrolledAlert color="warning">Default password still in use, it is strongly recommended that you change your password.</UncontrolledAlert>
			</Collapse>
			<Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse>
			<h4 className="text-left">Account</h4>
			<Details error={setError} />
			<Security error={setError} updated={updated} getUpdated={getLastUpdated} />
		</div>
	);
}