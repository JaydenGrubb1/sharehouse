import React, { useState } from "react";
import { Alert, Button, Card, CardHeader, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Label, List, Spinner } from "reactstrap";
import { setPassword } from "../../api";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MIN_PWD_LENGTH = 10;

export default function Security(props) {

	const [pwd, setPwd] = useState("xxxxxxxx");
	const [confPwd, setConfPwd] = useState();

	const [pwdLength, setPwdLength] = useState(true);
	const [pwdCase, setPwdCase] = useState(true);
	const [pwdNum, setPwdNum] = useState(true);
	const [pwdLoading, setPwdLoading] = useState(false);

	const pwdInvalid = () => pwdLength || pwdCase || pwdNum;

	const [change, setChange] = useState(false);
	const toggle = () => setChange(!change);

	async function updatePassword() {
		setPwdLoading(true);
		let result = await setPassword(pwd);
		if (result.error) {
			props.error(result.message);
			setPwdLoading(false);
		} else {
			setChange(false);
			await props.getUpdated();
			setTimeout(() => {
				props.error("");
				setPwd("xxxxxxxx");
				setPwdLoading(false);
				setPwdLength(true);
			}, 200);
		}
	}

	return (
		<Card className="mt-3" id="security">
			<CardHeader className="d-flex">
				<h5 className="my-auto">Security</h5>
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
					{pwdInvalid() &&
						<FormFeedback invalid>Passwords is not strong enough</FormFeedback>
					}
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
						<FormText>Last changed: {props.updated ? props.updated.toLocaleDateString() : "never"}</FormText>
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
	);
}