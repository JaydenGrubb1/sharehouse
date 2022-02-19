import React, { useEffect, useState } from "react";
import { Button, Card, CardHeader, Col, Form, FormFeedback, FormGroup, FormText, Input, Label, Row, Spinner } from "reactstrap";

export default function Notifications(props) {

	const [payEmail, setPayEmail] = useState(true);
	const [payPush, setPayPush] = useState(false);
	const [recEmail, setRecEmail] = useState(false);
	const [recPush, setRecPush] = useState(false);

	useEffect(() => {
		
	}, [payEmail, payPush, recEmail, recPush]);

	return (
		<Card className="mt-3">
			<CardHeader className="d-flex">
				<h5 className="my-auto">Notifications</h5>
			</CardHeader>
			<Form className="p-3">
				<div className="d-flex">
					New Payments
					<FormGroup check inline className="ml-auto">
						<Input type="checkbox" checked={!payEmail && !payPush} onClick={() => { setPayEmail(false); setPayPush(false); }} />
						<Label check>Off</Label>
					</FormGroup>
					<FormGroup check inline className="">
						<Input type="checkbox" checked={payEmail} onClick={() => setPayEmail(!payEmail)} />
						<Label check>Email</Label>
					</FormGroup>
					<FormGroup check inline>
						<Input type="checkbox" checked={payPush} onClick={() => setPayPush(!payPush)} />
						<Label check>Push</Label>
					</FormGroup>
				</div>
				<div className="d-flex mt-3">
					New Receipts
					<FormGroup check inline className="ml-auto">
						<Input type="checkbox" checked={!recEmail && !recPush} onClick={() => { setRecEmail(false); setRecPush(false); }} />
						<Label check>Off</Label>
					</FormGroup>
					<FormGroup check inline>
						<Input type="checkbox" checked={recEmail} onClick={() => setRecEmail(!recEmail)} />
						<Label check>Email</Label>
					</FormGroup>
					<FormGroup check inline>
						<Input type="checkbox" checked={recPush} onClick={() => setRecPush(!recPush)} />
						<Label check>Push</Label>
					</FormGroup>
				</div>
			</Form>
		</Card>
	)
}