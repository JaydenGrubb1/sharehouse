import React, { useEffect, useState } from "react";
import { Button, Card, CardHeader, Col, Form, FormFeedback, FormGroup, FormText, Input, Label, Row, Spinner } from "reactstrap";
import { getUser, setDetails } from "../../api";

export default function Details(props) {

	const [original, setOriginal] = useState();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [bsb, setBsb] = useState();
	const [acc, setAcc] = useState();

	const [nameValid, setNameValid] = useState("");
	const [emailValid, setEmailValid] = useState("");
	const [bsbValid, setBsbValid] = useState("");
	const [accValid, setAccValid] = useState("");
	const detailsInvalid = () => nameValid || emailValid || bsbValid || accValid;
	const altered = () => original && (name !== original.name || email !== original.email || bsb !== original.bsb || acc !== original.acc);

	const [detailsLoading, setDetailsLoading] = useState(false);

	async function getDetails() {
		let results = await getUser();

		if (results.error || !results.data) {
			if (results.error)
				props.error(results.error);
			else
				props.error("An unknown error occured");
		} else {
			setOriginal(results.data);
			setName(results.data.name);
			setEmail(results.data.email);
			setBsb(results.data.bsb);
			setAcc(results.data.acc);
		}
	}

	async function updateDetails() {
		setDetailsLoading(true);
		let details = {
			name: name,
			email: email,
			bsb: bsb,
			acc: acc
		};
		let result = await setDetails(details);
		if (result.error) {
			props.error(result.message);
		} else {
			props.error("");
			await getDetails();
		}
		setDetailsLoading(false);
	}

	useEffect(() => {
		getDetails();
	}, []);

	return (
		<Card className="mt-3" id="details">
			<CardHeader className="d-flex">
				<h5 className="my-auto">Details</h5>
			</CardHeader>
			<Form className="p-3">
				<FormGroup>
					<Label for="namefield">Name</Label>
					<Input
						type="text"
						name="name"
						id="namefield"
						valid={!nameValid && original && name !== original.name}
						invalid={nameValid}
						value={name}
						onChange={x => {
							let str = x.target.value;
							if (!/^[a-zA-Z ]*$/.test(str))
								setNameValid("Names can only contain english letters");
							else if (str.length < 2 || str.length > 40)
								setNameValid("Names must be between 2 and 40 letters long");
							else
								setNameValid("");
							setName(str);
						}}
					></Input>
					<FormFeedback invalid>{nameValid}</FormFeedback>
				</FormGroup>
				<FormGroup>
					<Label for="emailfield">Email</Label>
					<Input
						type="email"
						name="email"
						id="emailfield"
						valid={!emailValid && original && email !== original.email}
						invalid={emailValid}
						value={email}
						onChange={x => {
							let str = x.target.value;
							if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str))
								setEmailValid("Invalid email address");
							else if (str.length > 100)
								setEmailValid("Email addresses must be no longer than 100 characters");
							else
								setEmailValid("");
							setEmail(str);
						}}
					></Input>
					<FormFeedback invalid>{emailValid}</FormFeedback>
				</FormGroup>
				<Label>Banking</Label>
				<Row form>
					<Col>
						<FormGroup>
							<Input
								type="number"
								name="bsb"
								id="bsbfield"
								valid={!bsbValid && original && bsb !== original.bsb}
								invalid={bsbValid}
								placeholder="BSB"
								value={bsb}
								onChange={x => {
									let str = x.target.value;
									if (str.length >= 1)
										setBsb(str);
									else
										return;

									if (!/^[0-9]*$/.test(str))
										setBsbValid("BSB must only contain numbers");
									else if (str && str.length !== 6)
										setBsbValid("BSB must be exactly 6 digits long");
									else
										setBsbValid("");
								}}
							></Input>
							<FormFeedback invalid>{bsbValid}</FormFeedback>
							<FormText>
								BSB
							</FormText>
						</FormGroup>
					</Col>
					<Col>
						<FormGroup>
							<Input
								type="number"
								name="account"
								id="accountfield"
								valid={!accValid && original && acc !== original.acc}
								invalid={accValid}
								placeholder="ACC"
								value={acc}
								onChange={x => {
									let str = x.target.value;
									if (str.length >= 1)
										setAcc(str);
									else
										return;

									if (!/^[0-9]*$/.test(str))
										setAccValid("ACC must only contain numbers");
									else if (str && (str.length < 6 || str.length > 9))
										setAccValid("ACC must be between 6 and 9 digits long");
									else
										setAccValid("");
								}}
							></Input>
							<FormFeedback invalid>{accValid}</FormFeedback>
							<FormText>
								ACC
							</FormText>
						</FormGroup>
					</Col>
				</Row>
				<div className="d-flex">
					<Button color="primary" disabled={!altered()} outline onClick={() => {
						setNameValid("");
						setEmailValid("");
						setBsbValid("");
						setAccValid("");
						getDetails();
					}}>Cancel</Button>
					<Button color="primary" disabled={!altered() || detailsInvalid()} className="ml-2" onClick={() => {
						updateDetails();
					}}>Save</Button>
					{detailsLoading &&
						<Spinner color="primary" className="ml-auto my-auto" />
					}
				</div>
			</Form>
		</Card>
	);
}