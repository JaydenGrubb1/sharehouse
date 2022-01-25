import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../api";

export default function User(props) {
	const { user } = useParams();
	const [details, setDetails] = useState();

	async function getDetails() {
		let results = await getUser(user);

		if (results.error || !results.data) {
			if (results.error)
				setError(results.error);
			else
				setError("An unknown error occured");
		} else {
			setDetails(JSON.stringify(results.data, null, 3));
		}
	}

	useEffect(() => {
		getDetails();
	}, []);

	return (
		<div>
			{details}
		</div>
	)
};