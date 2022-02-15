import dateFormat from "dateformat";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import { getEmail } from "../../api";

function Entry(props, ref) {

	const [checked, setChecked] = useState(false);
	const [showDatetime, setShowDatetime] = useState(true);

	const [amount, setAmount] = useState();
	const [date, setDate] = useState();
	const [time, setTime] = useState();

	useImperativeHandle(ref, () => ({
		getDetails() {
			if (checked === false)
				return null;

			if (!showDatetime) {
				setDate(dateFormat(new Date(), "yyyy-mm-dd"));
				setTime(dateFormat(new Date(), "HH:MM"));
			}

			return {
				from: getEmail(),
				to: props.user,
				amount: amount,
				timestamp: Date.parse("".concat(date, " ", time))
			}
		}
	}), [checked, amount, showDatetime, date, time]);

	useEffect(() => {
		setAmount(props.amount.toFixed(2));
		setDate(dateFormat(new Date(), "yyyy-mm-dd"));
		setTime(dateFormat(new Date(), "HH:MM"));
	}, []);

	return (
		<div className={!props.end && "border-bottom"}>
			<Form className="p-3">
				<FormGroup check>
					<Label check>
						<Input type="checkbox" checked={checked} onChange={x => setChecked(x.target.checked)} />{props.user}
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
							<Input type="checkbox" checked={showDatetime} onChange={x => setShowDatetime(x.target.checked)} />Use current date and time
						</Label>
					</FormGroup>
					<Collapse isOpen={!showDatetime}>
						<FormGroup>
							<Label for="datefield">Date</Label>
							<Input type="date" name="date" id="datefield" value={date} onChange={x => setDate(x.target.value)} />
						</FormGroup>
						<FormGroup>
							<Label for="timefield">Time</Label>
							<Input type="time" name="time" id="timefield" value={time} onChange={x => setTime(x.target.value)} />
						</FormGroup>
					</Collapse>
				</Collapse>
			</Form>
		</div>
	);
}

export default forwardRef(Entry);