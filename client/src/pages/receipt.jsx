import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Alert, Card, CardBody, CardDeck, CardHeader, CardImg, CardText, Collapse, UncontrolledAlert } from "reactstrap";
import { getServerRoot, hashInteger } from "../api";

export default function User() {
	const { id } = useParams();
	const [loaded, setLoaded] = useState(true);

	const idInt = parseInt(id);
	const hashID = hashInteger(idInt);

	async function getDetails(){
		// let results = 
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
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis accusamus sit molestias in perferendis molestiae dignissimos quisquam. Officia cum veritatis, dolore enim ipsa quibusdam consequatur sapiente reiciendis. Ducimus, doloribus praesentium!
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