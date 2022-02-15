import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Collapse, Jumbotron, UncontrolledAlert } from "reactstrap";
import { getUser } from "../api";
import Tiles from "../components/tiles";

export default function Home() {

	const [error, setError] = useState();
	const [name, setName] = useState();

	async function getData() {
		let results = await getUser();
		if (results.error) {
			setError(results.message);
		} else {
			if (results.data.name) {
				setName(", " + results.data.name);
			} else {
				setName();
			}
		}
	}

	useEffect(() => {
		getData();
	}, [])

	return (
		<div className="container">
			<Helmet>
				<title>Sharehouse</title>
			</Helmet>
			<Jumbotron fluid className="mb-3">
				<div className="p-3">
					<h1 className="display-3">Welcome{name}</h1>
					<p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
				</div>
				<hr className="my-2" />
				<div className="p-3">
					<p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
					<p className="lead">
						<Button color="primary">Learn More</Button>
					</p>
				</div>
			</Jumbotron>
			<Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse>
			{/* <Tiles error={setError} setError={setError} /> */}
		</div>
	);
}