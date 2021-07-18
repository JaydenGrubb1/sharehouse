import React from "react";
import { Helmet } from "react-helmet";

export default function Admin() {
	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Admin</title>
			</Helmet>
			<h4 className="text-left">Admin</h4>
		</div>
	);
}