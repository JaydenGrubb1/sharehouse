import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Button, Card, CardHeader, Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, InputGroup, Label, Row, UncontrolledAlert } from "reactstrap";
import { getUser } from "../api";

export default function User() {
	const { user } = useParams();
	const [error, setError] = useState();
	const [details, setDetails] = useState({ name: "", email: "", bsb: "", acc: "" });

	const [nameCopied, setNameCopied] = useState(false);
	const [emailCopied, setEmailCopied] = useState(false);
	const [bsbCopied, setBSBCopied] = useState(false);
	const [accCopied, setACCCopied] = useState(false);

	async function getDetails() {
		let results = await getUser(user);

		if (results.error || !results.data) {
			if (results.error)
				setError(results.error);
			else
				setError("An unknown error occured");
		} else {
			setError();
			setDetails(results.data);
		}
	}

	async function copy(text, feedback) {
		try {
			await navigator.clipboard.writeText(text);
			console.log("\"" + text + "\" was copied");
			if (feedback) {
				setNameCopied(false);
				setEmailCopied(false);
				setBSBCopied(false);
				setACCCopied(false);
				feedback(true);
				setTimeout(() => feedback(false), 3000);
			}
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getDetails();
		setNameCopied(false);
		setEmailCopied(false);
		setBSBCopied(false);
		setACCCopied(false);
	}, []);

	const fixBorder = { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 };

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Account</title>
			</Helmet>
			<Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse>
			<h4 className="text-left">Details</h4>
			<Card className="mt-3">
				<CardHeader className="d-flex">
					<h5 className="my-auto">About</h5>
				</CardHeader>
				<Form className="p-3">
					<FormGroup>
						<Label for="namefield">Name</Label>
						<InputGroup>
							<Input valid={nameCopied} disabled value={details.name} />
							<Button color="primary" style={fixBorder} onClick={() => copy(details.name, setNameCopied)}>
								<FontAwesomeIcon icon={faCopy} />
							</Button>
							<FormFeedback valid>Copied to clipboard</FormFeedback>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="emailfield">Email</Label>
						<InputGroup>
							<Input valid={emailCopied} disabled value={details.email} />
							<Button color="primary" style={fixBorder} onClick={() => copy(details.email, setEmailCopied)}>
								<FontAwesomeIcon icon={faCopy} />
							</Button>
							<FormFeedback valid>Copied to clipboard</FormFeedback>
						</InputGroup>
					</FormGroup>
					<Label>Banking</Label>
					<Row form>
						<Col>
							<FormGroup>
								<InputGroup>
									<Input valid={bsbCopied} disabled value={details.bsb} />
									<Button color="primary" style={fixBorder} onClick={() => copy(details.bsb, setBSBCopied)}>
										<FontAwesomeIcon icon={faCopy} />
									</Button>
									<FormFeedback valid>Copied to clipboard</FormFeedback>
								</InputGroup>
								<FormText>
									BSB
								</FormText>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<InputGroup>
									<Input valid={accCopied} disabled value={details.acc} />
									<Button color="primary" style={fixBorder} onClick={() => copy(details.acc, setACCCopied)}>
										<FontAwesomeIcon icon={faCopy} />
									</Button>
									<FormFeedback valid>Copied to clipboard</FormFeedback>
								</InputGroup>
								<FormText>
									ACC
								</FormText>
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</Card>
		</div>
	);
}