import React, { useEffect, useState } from "react";
import { Alert, Button, Card, CardHeader, Col, Collapse, Form, FormFeedback, FormGroup, FormText, Input, Label, Row, Spinner, UncontrolledAlert } from "reactstrap";
import { getNotifyOptions, getVAPID, registerDevice, setNotifyOptions } from "../../api";

export default function Notifications(props) {

	const [original, setOriginal] = useState();

	const [payEmail, setPayEmail] = useState(true);
	const [payPush, setPayPush] = useState(true);
	const [recEmail, setRecEmail] = useState(false);
	const [recPush, setRecPush] = useState(false);

	const [pushAvailable, setPushAvailable] = useState(true);
	const [loading, setLoading] = useState(false);
	const [permLoading, setPermLoading] = useState(false);
	const altered = () => original && (original.paymentEmail !== payEmail || original.paymentPush !== payPush || original.receiptEmail !== recEmail || original.receiptPush !== recPush);

	async function handlePermission(status) {
		if (status === 'granted') {
			let worker = await navigator.serviceWorker.ready;
			let push = await worker.pushManager;
			let vapid = await getVAPID();

			if (vapid.error || !vapid.key) {
				if (vapid.error)
					props.error(vapid.error);
				else
					props.error("An unknown error occured");
			}

			let result = await push.subscribe({
				userVisibleOnly: true,
				applicationServerKey: vapid.key
			});

			let pass = await registerDevice({ endpoint: result });

			setPermLoading(false);
			setPushAvailable(true);
		}
	}

	async function getPermission() {
		setPermLoading(true);
		Notification.requestPermission(handlePermission);
	}

	async function saveOptions() {
		setLoading(true);
		let options = {
			paymentEmail: payEmail,
			paymentPush: payPush,
			receiptEmail: recEmail,
			receiptPush: recPush
		}
		let results = await setNotifyOptions(options);

		if (results.error)
			props.error(results.error);
		else
			setOriginal(options);

		setLoading(false);
	}

	async function getOptions() {
		let results = await getNotifyOptions();

		if (results.error || !results.data) {
			if (results.error)
				props.error(results.error);
			else
				props.error("An unknown error occured");
		} else {
			setOriginal(results.data);
			setPayEmail(results.data.paymentEmail);
			setPayPush(results.data.paymentPush);
			setRecEmail(results.data.receiptEmail);
			setRecPush(results.data.receiptPush);
		}
		setPushAvailable(Notification.permission === "granted");
	}

	useEffect(() => {
		getOptions();
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
							<Button color="danger" className="ml-2" outline onClick={() => {
								setPayPush(false);
								setRecPush(false);
							}}>Disable</Button>
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
					<Button color="primary" disabled={!altered()} outline onClick={() => {
						setPayEmail(original.paymentEmail);
						setPayPush(original.paymentPush);
						setRecEmail(original.receiptEmail);
						setRecPush(original.receiptPush);
					}}>Cancel</Button>
					<Button color="primary" disabled={!altered()} className="ml-2" onClick={saveOptions}>Save</Button>
					{loading &&
						<Spinner color="primary" className="ml-auto my-auto" />
					}
				</div>
			</Form>
		</Card>
	)
}