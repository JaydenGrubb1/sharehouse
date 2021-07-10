import React from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Alert, Button, Card, CardHeader, Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Label, List, Row, Spinner, UncontrolledTooltip } from "reactstrap";
import { getUser, setPassword } from "../api";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MIN_PWD_LENGTH = 10;

export default function Account() {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [bsb, setBsb] = useState();
	const [acc, setAcc] = useState();
	const [pwd, setPwd] = useState("xxxxxxxx");
	const [confPwd, setConfPwd] = useState("xx");
	const [update, setUpdate] = useState(new Date());

	const [change, setChange] = useState(false);
	const toggle = () => setChange(!change);

	const [pwdLength, setPwdLength] = useState(true);
	const [pwdCase, setPwdCase] = useState(true);
	const [pwdNum, setPwdNum] = useState(true);

	const pwdInvalid = () => pwdLength || pwdCase || pwdNum;

	const [pwdLoading, setPwdLoading] = useState(false);
	const [pwdError, setPwdError] = useState("");

	async function getResults() {
		let results = await getUser();
		setName(results.data.name);
		setEmail(results.data.email);
		setBsb(results.data.bsb);
		setAcc(results.data.acc);
		if (results.data.updated)
			setUpdate(new Date(results.data.updated));
		else
			setUpdate(undefined);
	}

	async function updatePassword() {
		setPwdLoading(true);
		let result = await setPassword(pwd);
		if (result.error) {
			setPwdError(result.message);
			setPwdLoading(false);
		} else {
			setChange(false);
			await getResults();
			setTimeout(() => {
				setPwdError("");
				setPwd("xxxxxxxx");
				setPwdLoading(false);
				setPwdLength(true);
			}, 200);
		}
	}

	useEffect(() => {
		getResults();
	}, []);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Account</title>
			</Helmet>
			{!update &&
				<Alert color="warning">Default password still in use, it is strongly recommended that you change your password.</Alert>
			}
			<h4 className="text-left">Account</h4>
			<Card className="mt-3">
				<CardHeader>
					<h5>Details</h5>
				</CardHeader>
				<Form className="p-3">
					<FormGroup>
						<Label for="namefield">Name</Label>
						<Input type="text" name="name" id="namefield" value={name} onChange={x => {
							setName(x.target.value);
						}}></Input>
						<FormFeedback valid>NOICE</FormFeedback>
						<FormFeedback invalid>BAD BOI</FormFeedback>
					</FormGroup>
					<FormGroup>
						<Label for="emailfield">Email</Label>
						<Input type="email" name="email" id="emailfield" value={email} onChange={x => {
							setEmail(x.target.value);
						}}></Input>
					</FormGroup>
					<Label>Banking</Label>
					<Row form>
						<Col>
							<FormGroup>
								<Input type="number" name="bsb" id="bsbfield" placeholder="BSB" value={bsb} onChange={x => {
									setBsb(x.target.value);
								}}></Input>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Input type="number" name="account" id="accountfield" placeholder="ACC" value={acc} onChange={x => {
									setAcc(x.target.value);
								}}></Input>
							</FormGroup>
						</Col>
					</Row>
					<Row form className="float-left">
						<Col>
							<Button color="secondary" onClick={() => {
								console.log("cancel!");
							}}>Cancel</Button>
						</Col>
						<Col>
							<Button color="primary" onClick={() => {
								console.log("submit!");
							}}>Save</Button>
						</Col>
					</Row>
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
								let password = x.target.value;
								setPwdLength(password.length >= MIN_PWD_LENGTH === false);
								setPwdCase((/[a-z]/.test(password) && /[A-Z]/.test(password)) === false)
								setPwdNum((/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) === false)
								setPwd(password);
							}}
						></Input>
						<FormFeedback invalid>Passwords is not strong enough</FormFeedback>
						<FormFeedback valid>Good password</FormFeedback>
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
							<FormFeedback valid>Passwords match</FormFeedback>
						</FormGroup>
						<p className="text-danger">{pwdError}</p>
						<Row form className="float-left">
							<Col>
								<Button color="secondary" onClick={() => {
									setPwd("xxxxxxxx");
									setPwdLength(true);
									setPwdCase(true);
									setPwdNum(true);
									toggle();
								}}>Cancel</Button>
							</Col>
							<Col>
								<Button disabled={pwdInvalid() || pwd !== confPwd} color="primary" onClick={() => {
									console.log("submit!");
									updatePassword();
								}}>Save</Button>
							</Col>
							{pwdLoading &&
								<Col>
									<Spinner color="primary" />
								</Col>
							}
						</Row>
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