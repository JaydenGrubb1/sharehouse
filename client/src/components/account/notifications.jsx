import React, { useEffect, useState } from "react";
import { Alert, Button, Card, CardHeader, Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Label, Row, Spinner, UncontrolledAlert } from "reactstrap";

export default function Notifications(props) {

	const [payEmail, setPayEmail] = useState(true);
	const [payPush, setPayPush] = useState(true);
	const [recEmail, setRecEmail] = useState(false);
	const [recPush, setRecPush] = useState(false);

	const [pushAvailable, setPushAvailable] = useState(false);
	const [loading, setLoading] = useState(false);
	const [permLoading, setPermLoading] = useState(false);
	const altered = () => false;

	async function getPermission() {
		setPermLoading(true);
	}

	async function getOptions() {

	}

	useEffect(() => {

	}, [payEmail, payPush, recEmail, recPush]);

	useEffect(() => {
		// setPushAvailable(Notification.permission === "granted");
	}, []);


	return (
		<Card className="mt-3" id="notifications">
			<CardHeader className="d-flex">
				<h5 className="my-auto">Notifications</h5>
			</CardHeader>
			<Form className="p-3">
				<Collapse isOpen={!pushAvailable && (payPush || recPush)}>
					<UncontrolledAlert color="danger">
						Push notifications are enabled but have not been given permission on this device.
						<br />
						<div className="mt-2 d-flex">
							<Button color="danger" onClick={getPermission}>Allow</Button>
							<Button color="danger" className="ml-2" outline onClick={getPermission}>Disable</Button>
							{permLoading &&
								<Spinner color="danger" className="ml-auto my-auto" />
							}
						</div>
					</UncontrolledAlert>
				</Collapse>
				<Collapse isOpen={!pushAvailable && !(payPush || recPush)}>
					<UncontrolledAlert color="primary">
						Allow push notifications for instant notifications on new payments or receipts.
						<br />
						<div className="mt-2 d-flex">
							<Button color="primary" onClick={getPermission}>Enable</Button>
							{/* <Button color="primary" className="ml-2" outline onClick={getPermission}>Disable</Button> */}
							{permLoading &&
								<Spinner color="primary" className="ml-auto my-auto" />
							}
						</div>
					</UncontrolledAlert>
				</Collapse>
				<div className="d-flex">
					New Payment
					<FormGroup check inline className="ml-auto">
						<Input type="checkbox" checked={!payEmail && !payPush} onClick={() => { setPayEmail(false); setPayPush(false); }} />
						<Label check>Off</Label>
					</FormGroup>
					<FormGroup check inline className="">
						<Input type="checkbox" checked={payEmail} onClick={() => setPayEmail(!payEmail)} />
						<Label check>Email</Label>
					</FormGroup>
					<FormGroup check inline>
						<Input type="checkbox" disabled={!pushAvailable} checked={payPush} onClick={() => setPayPush(!payPush)} />
						<Label check>Push</Label>
					</FormGroup>
				</div>
				<div className="d-flex mt-3">
					New Receipt
					<FormGroup check inline className="ml-auto">
						<Input type="checkbox" checked={!recEmail && !recPush} onClick={() => { setRecEmail(false); setRecPush(false); }} />
						<Label check>Off</Label>
					</FormGroup>
					<FormGroup check inline>
						<Input type="checkbox" checked={recEmail} onClick={() => setRecEmail(!recEmail)} />
						<Label check>Email</Label>
					</FormGroup>
					<FormGroup check inline>
						<Input type="checkbox" disabled={!pushAvailable} checked={recPush} onClick={() => setRecPush(!recPush)} />
						<Label check>Push</Label>
					</FormGroup>
				</div>
				<div className="d-flex mt-3">
					<Button color="primary" disabled={!altered()} outline>Cancel</Button>
					<Button color="primary" disabled={!altered()} className="ml-2">Save</Button>
					{loading &&
						<Spinner color="primary" className="ml-auto my-auto" />
					}
				</div>
			</Form>
		</Card>
	)
}