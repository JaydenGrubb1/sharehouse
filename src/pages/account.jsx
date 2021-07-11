import React from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Alert, Button, Card, CardHeader, Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Label, List, Row, Spinner } from "reactstrap";
import { getUser, setDetails, setPassword } from "../api";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MIN_PWD_LENGTH = 10;

export default function Account() {

	const [original, setOriginal] = useState();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [bsb, setBsb] = useState();
	const [acc, setAcc] = useState();
	const [pwd, setPwd] = useState("xxxxxxxx");
	const [confPwd, setConfPwd] = useState("xx");
	const [update, setUpdate] = useState(new Date());

	const [change, setChange] = useState(false);
	const toggle = () => setChange(!change);

	const [nameValid, setNameValid] = useState("");
	const [emailValid, setEmailValid] = useState("");
	const [bsbValid, setBsbValid] = useState("");
	const [accValid, setAccValid] = useState("");
	const [pwdLength, setPwdLength] = useState(true);
	const [pwdCase, setPwdCase] = useState(true);
	const [pwdNum, setPwdNum] = useState(true);

	const pwdInvalid = () => pwdLength || pwdCase || pwdNum;
	const detailsInvalid = () => nameValid || emailValid || bsbValid || accValid;
	const altered = () => original && (name !== original.name || email !== original.email || bsb !== original.bsb || acc !== original.acc);

	const [pwdLoading, setPwdLoading] = useState(false);
	const [error, setError] = useState("");

	const [detailsLoading, setDetailsLoading] = useState(false);

	async function getResults() {
		let results = await getUser();

		if (results.error || !results.data) {

		} else {
			setOriginal(results.data);
			setName(results.data.name);
			setEmail(results.data.email);
			setBsb(results.data.bsb);
			setAcc(results.data.acc);
			if (results.data.updated)
				setUpdate(new Date(results.data.updated));
			else
				setUpdate(null);
		}
	}

	async function updatePassword() {
		setPwdLoading(true);
		let result = await setPassword(pwd);
		if (result.error) {
			setError(result.message);
			setPwdLoading(false);
		} else {
			setChange(false);
			await getResults();
			setTimeout(() => {
				setError("");
				setPwd("xxxxxxxx");
				setPwdLoading(false);
				setPwdLength(true);
			}, 200);
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
			setError(result.message);
		} else {
			setError("");
			await getResults();
		}
		setDetailsLoading(false);
	}

	useEffect(() => {
		getResults();
	}, []);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Account</title>
			</Helmet>
			<Collapse isOpen={!update}>
				<Alert color="warning">Default password still in use, it is strongly recommended that you change your password.</Alert>
			</Collapse>
			<Collapse isOpen={error}>
				<Alert color="danger">{error}</Alert>
			</Collapse>
			<h4 className="text-left">Account</h4>
			<Card className="mt-3">
				<CardHeader>
					<h5>Details</h5>
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
										else if (str && str.length !== 8 && str.length !== 9)
											setAccValid("ACC must be between 8 and 9 digits long");
										else
											setAccValid("");
									}}
								></Input>
								<FormFeedback invalid>{accValid}</FormFeedback>
							</FormGroup>
						</Col>
					</Row>
					<div style={{ display: "flex" }}>
						<Button color="primary" disabled={!altered()} outline onClick={() => {
							setError(null);
							setNameValid("");
							setEmailValid("");
							setBsbValid("");
							setAccValid("");
							getResults();
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
			<Card className="mt-3">
				<CardHeader>
					<h5>Security</h5>
				</CardHeader>
				<Form className="p-3">
					<FormGroup>
						<Label for="passwordfield">Password</Label>
						<Input
							disabled={!change}
							type="password"
							name="password"
							id="passwordfield"
							autoComplete="new-password"
							value={pwd}
							valid={!pwdInvalid() && change}
							invalid={pwdInvalid() && change}
							onChange={x => {
								let str = x.target.value;
								setPwdLength((str.length >= MIN_PWD_LENGTH) === false);
								setPwdCase((/[a-z]/.test(str) && /[A-Z]/.test(str)) === false)
								setPwdNum((/[a-zA-Z]/.test(str) && /[0-9]/.test(str)) === false)
								setPwd(str);
							}}
						></Input>
						<FormFeedback invalid>Passwords is not strong enough</FormFeedback>
						{/* <FormFeedback valid>Good password</FormFeedback> */}
						{change &&
							<Collapse isOpen={pwdInvalid()}>
								<Alert className="mt-3" color={pwdInvalid() ? "danger" : "success"}>
									<List type="unstyled">
										<li><FontAwesomeIcon icon={pwdLength ? faTimes : faCheck} /> Is atleast {MIN_PWD_LENGTH} characters long</li>
										<li><FontAwesomeIcon icon={pwdCase ? faTimes : faCheck} /> Contains both upper and lower case letters</li>
										<li><FontAwesomeIcon icon={pwdNum ? faTimes : faCheck} /> Contains both letters and numbers</li>
									</List>
								</Alert>
							</Collapse>
						}
						<Collapse isOpen={!change}>
							<FormText>Last changed: {update ? update.toLocaleDateString() : "never"}</FormText>
						</Collapse>
					</FormGroup>
					<Collapse isOpen={change}>
						<FormGroup>
							<Label for="confpasswordfield">Confirm Password</Label>
							<Input
								type="password"
								name="confpassword"
								id="confpasswordfield"
								autoComplete="new-password"
								value={confPwd}
								valid={pwd === confPwd && confPwd.length >= MIN_PWD_LENGTH}
								invalid={pwd !== confPwd}
								onChange={x => {
									setConfPwd(x.target.value);
								}}
							></Input>
							<FormFeedback invalid>Passwords do not match</FormFeedback>
							{/* <FormFeedback valid>Passwords match</FormFeedback> */}
						</FormGroup>
						<div style={{ display: "flex" }}>
							<Button color="primary" outline onClick={() => {
								setPwd("xxxxxxxx");
								setPwdLength(true);
								setPwdCase(true);
								setPwdNum(true);
								toggle();
							}}>Cancel</Button>
							<Button
								disabled={pwdInvalid() || pwd !== confPwd}
								color="primary"
								className="ml-2"
								onClick={() => {
									console.log("submit!");
									updatePassword();
								}}
							>Save</Button>
							{pwdLoading &&
								<Spinner color="primary" className="ml-auto my-auto" />
							}
						</div>
					</Collapse>
					<Collapse isOpen={!change}>
						<Button color="primary" onClick={() => {
							setPwd("");
							setConfPwd("");
							toggle();
						}}>Change Password</Button>
					</Collapse>
				</Form>
			</Card>
		</div>
	);
}