import React, { useState } from "react";
import { Button, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { createReceipt, getEmail } from "../../api";

export default function Receipt(props) {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [showDatetime, setShowDatetime] = useState(false);
	const [store, setStore] = useState();
	const [amount, setAmount] = useState();

	async function onSubmit() {
		setLoading(true);
		let details = {
			"user": getEmail(),
			"store": store,
			"cost": amount
		};
		let results = await createReceipt(details);
		if (results.error) {
			setError(results.message);
		} else {
			setError();
			props.toggle();
		}
		setLoading(false);
	}

	return (
		<div>
			<Modal isOpen={props.open} toggle={props.toggle}>
				<ModalHeader toggle={props.toggle}>Create Receipt</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for="storefield">Store</Label>
							<Input type="text" name="store" id="storefield" value={store} onChange={x => setStore(x.target.value)} />
						</FormGroup>
						<FormGroup>
							<Label for="amountfield">Amount</Label>
							<InputGroup>
								<InputGroupAddon addonType="prepend">
									<InputGroupText>$</InputGroupText>
								</InputGroupAddon>
								<Input type="number" name="amount" id="amountfield" value={amount} onChange={x => setAmount(x.target.value)} />
							</InputGroup>
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input type="checkbox" checked={!showDatetime} />Use current date and time
							</Label>
						</FormGroup>
						<Collapse isOpen={showDatetime}>
							<FormGroup>
								<Label for="datefield">Date</Label>
								<Input type="date" name="date" id="datefield" />
							</FormGroup>
							<FormGroup>
								<Label for="timefield">Time</Label>
								<Input type="time" name="time" id="timefield" />
							</FormGroup>
						</Collapse>
					</Form>
					<p className="text-danger text-center mt-3">{error}</p>
				</ModalBody>
				<ModalFooter>
					{loading &&
						<Spinner color="primary"></Spinner>
					}
					<Button color="primary" onClick={onSubmit} disabled={loading}>Save</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}