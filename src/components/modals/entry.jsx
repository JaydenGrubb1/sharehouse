import React, { useState } from "react";
import { Button, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";

export default function Entry(props) {

	const [checked, setChecked] = useState(false);
	const [showDatetime, setShowDatetime] = useState(true);

	const [amount, setAmount] = useState();

	return (
		<div className={!props.end && "border-bottom"}>
			<Form className="p-3">
				<FormGroup check>
					<Label check>
						<Input type="checkbox" checked={checked} onClick={x => setChecked(x.target.checked)} />{props.email}
					</Label>
				</FormGroup>
				<Collapse isOpen={checked}>
					<FormGroup className="mt-1">
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
							<Input type="checkbox" checked={showDatetime} onClick={x => setShowDatetime(x.target.checked)} />Use current date and time
						</Label>
					</FormGroup>
					<Collapse isOpen={!showDatetime}>
						<FormGroup>
							<Label for="datefield">Date</Label>
							<Input type="date" name="date" id="datefield" />
						</FormGroup>
						<FormGroup>
							<Label for="timefield">Time</Label>
							<Input type="time" name="time" id="timefield" />
						</FormGroup>
					</Collapse>
				</Collapse>
			</Form>
		</div>
	);
}