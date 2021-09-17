import React from "react";
import { Helmet } from "react-helmet";
import { Button, Jumbotron } from "reactstrap";

export default function Home() {
	return (
		<div className="container">
			<Helmet>
				<title>Sharehouse</title>
			</Helmet>
			<Jumbotron fluid>
				<div className="p-3">
					<h1 className="display-3">Hello, world!</h1>
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
		</div>
	);
}