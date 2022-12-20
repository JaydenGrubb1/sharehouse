import dateFormat from "dateformat";
import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Alert, Card, CardBody, CardDeck, CardHeader, CardImg, CardText, Col, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row, UncontrolledAlert } from "reactstrap";
import { getReceipt, getServerRoot, hashInteger } from "../api";

export default function User() {
	const { id } = useParams();
	const [loaded, setLoaded] = useState(true);
	const [data, setData] = useState();

	async function getDetails() {
		let results = await getReceipt(parseInt(id));

		if (results.error) {
			// TODO handle error
		} else {
			let cont = results.data.contributions;
			
			cont.forEach((x) => {
				x.offset = ((x.amount * cont.length) - results.data.amount) / (-1 + cont.length);
			})
			
			setData(results.data);
		}
	}

	useEffect(() => {
		getDetails();
	}, []);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Receipt {id}</title>
			</Helmet>
			{/* <Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse> */}
			<h4 className="text-left">Receipt <em>{id}</em></h4>
			<CardDeck className="mt-3">
				<Card>
					<CardHeader className="d-flex">
						<h5 className="my-auto">Details</h5>
					</CardHeader>
					{/* <CardBody>
						<CardText>
							<samp style={{whiteSpace: "pre-wrap"}}>
								{JSON.stringify(data, null, 2)}
							</samp>

						</CardText>
					</CardBody> */}
					{data &&
						<Form className="p-3">
							<FormGroup>
								<Label for="userfield">User</Label>
								<Input id="userfield" disabled value={data.user} />
							</FormGroup>
							<FormGroup>
								<Label for="storefield">Store</Label>
								<Input id="storefield" disabled value={data.store} />
							</FormGroup>
							<FormGroup>
								<Label for="locationfield">Location</Label>
								<Input id="locationfield" disabled value={data.location} />
							</FormGroup>
							<FormGroup>
								<Label for="descriptionfield">Description</Label>
								<Input id="descriptionfield" disabled value={data.description} />
							</FormGroup>
							<FormGroup>
								<Label for="amountfield">Amount</Label>
								<InputGroup>
									<InputGroupAddon addonType="prepend">
										<InputGroupText>$</InputGroupText>
									</InputGroupAddon>
									<Input id="amountfield" disabled value={data.amount} />
								</InputGroup>
							</FormGroup>
							<Label for="receiptfield">Receipt Timestamp</Label>
							<Row id="receiptfield" form>
								<Col>
									<FormGroup>
										<Input type="date" disabled required value={dateFormat(data.timestamp, "yyyy-mm-dd")} />
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Input type="time" disabled required value={dateFormat(data.timestamp, "HH:MM")} />
									</FormGroup>
								</Col>
							</Row>
							{data.record_timestamp &&
								<div>
									<Label for="recordfield">Record Timestamp</Label>
									<Row id="recordfield" form>
										<Col>
											<FormGroup>
												<Input type="date" disabled required value={dateFormat(data.record_timestamp, "yyyy-mm-dd")} />
											</FormGroup>
										</Col>
										<Col>
											<FormGroup>
												<Input type="time" disabled required value={dateFormat(data.record_timestamp, "HH:MM")} />
											</FormGroup>
										</Col>
									</Row>
								</div>
							}
							{/* <samp style={{ whiteSpace: "pre-wrap" }}>
								{JSON.stringify(data.contributions, null, 2)}
							</samp> */}
						</Form>
					}
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