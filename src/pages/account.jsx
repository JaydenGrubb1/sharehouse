import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Alert, Button, Card, CardHeader, Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Label, Row } from "reactstrap";

export default function Account() {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [pwd, setPwd] = useState("xxxxxxxx");
	const [confPwd, setConfPwd] = useState("");
	const [update, setUpdate] = useState(new Date());
	const [change, setChange] = useState(false);
	const toggle = () => setChange(!change);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Account</title>
			</Helmet>
			{/* <Alert color="warning">Password must be changed</Alert> */}
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
								<Input type="text" name="bsb" id="bsbfield" placeholder="BSB"></Input>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Input type="text" name="account" id="accountfield" placeholder="ACC"></Input>
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
						<Input disabled={!change} type="password" name="password" id="passwordfield" autoComplete="new-password" value={pwd} onChange={x => {
							setPwd(x.target.value);
						}}></Input>
						<Collapse isOpen={!change}>
							{update &&
								<FormText>Last changed: {update.toLocaleDateString()}</FormText>
							}
						</Collapse>
					</FormGroup>
					<Collapse isOpen={change}>
						<FormGroup>
							<Label for="confpasswordfield">Confirm Password</Label>
							<Input invalid type="password" name="confpassword" id="confpasswordfield" autoComplete="new-password" value={confPwd} onChange={x => {
								setConfPwd(x.target.value);
							}}></Input>
							<FormFeedback invalid>Passwords do not match!</FormFeedback>
						</FormGroup>
						<Row form className="float-left">
							<Col>
								<Button color="secondary" onClick={() => {
									setPwd("xxxxxxxx");
									toggle();
								}}>Cancel</Button>
							</Col>
							<Col>
								<Button color="primary" onClick={() => {
									console.log("submit!");
								}}>Save</Button>
							</Col>
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