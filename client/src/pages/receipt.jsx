import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { getServerRoot } from "../api";

export default function User() {
	const { id } = useParams();
	const [loaded, setLoaded] = useState(true);

	return (
		<div className="container p-3">
			{loaded &&
				<img className="img-fluid" src={getServerRoot() + "/receipts/" + id + "/image"} onError={() => setLoaded(false)}></img>
			}
			{!loaded &&
				<span>No Image Found</span>
			}
		</div>
	);
}