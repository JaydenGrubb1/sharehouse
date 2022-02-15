import React from "react";
import { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { doLogin, isLoggedIn } from "../../api";

export default function Login() {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function onSubmit() {
		setLoading(true);
		let result = await doLogin(email, password);
		if (result.error) {
			setError(result.message);
		} else {
			setError("");
			if(isLoggedIn())
				window.location.reload();
		}
		setLoading(false);
	}

	return (
		<div>
			<Modal isOpen={true}>
				<ModalHeader>Login</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for="emailfield">Email</Label>
							<Input type="email" name="email" id="emailfield" autoComplete="username" value={email} onChange={x => setEmail(x.target.value)} />
						</FormGroup>
						<FormGroup>
							<Label for="passwordfield">Password</Label>
							<Input type="password" name="password" id="passwordfield" autoComplete="current-password" value={password} onChange={x => setPassword(x.target.value)} />
						</FormGroup>
					</Form>
					<p className="text-danger text-center">{error}</p>
				</ModalBody>
				<ModalFooter>
					{loading &&
						<Spinner color="primary"></Spinner>
					}
					<Button color="primary" onClick={onSubmit}>Login</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}