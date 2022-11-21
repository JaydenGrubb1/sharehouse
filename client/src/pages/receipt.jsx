import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Alert, Card, CardBody, CardDeck, CardHeader, CardImg, CardText, Collapse, UncontrolledAlert } from "reactstrap";
import { getReceipt, getServerRoot, hashInteger } from "../api";

export default function User() {
	const { id } = useParams();
	const [loaded, setLoaded] = useState(true);

	const idInt = parseInt(id);
	const hashID = hashInteger(idInt);

	const [data, setData] = useState();

	async function getDetails() {
		let results = await getReceipt(idInt);

		if (results.error) {
			// TODO handle error
		} else {
			setData(results.data);
		}
	}

	useEffect(() => {
		getDetails();
	}, []);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Receipt {hashID}</title>
			</Helmet>
			{/* <Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse> */}
			<h4 className="text-left">Receipt <em>{hashID}</em></h4>
			<CardDeck className="mt-3">
				<Card>
					<CardHeader className="d-flex">
						<h5 className="my-auto">Details</h5>
					</CardHeader>
					<CardBody>
						<CardText>
							<samp style={{whiteSpace: "pre-wrap"}}>
								{JSON.stringify(data, null, 2)}
							</samp>
						</CardText>
					</CardBody>
				</Card>
				<Card>
					<CardHeader className="d-flex">
						<h5 className="my-auto">Image</h5>
					</CardHeader>
					<CardBody>
						{loaded &&
							<img className="img-fluid rounded" src={getServerRoot() + "/receipts/" + id + "/image"} onError={() => setLoaded(false)}></img>
						}
						{!loaded &&
							<Alert color="warning">No Image Found</Alert>
						}
					</CardBody>
				</Card>
			</CardDeck>
		</div>
	);
}