import dateFormat from "dateformat";
import React, { createRef, useState, useEffect } from "react";
import { Button, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { createReceipt } from "../../api";
import ContributionEntry from "../payments/contributions-entry";

export default function Receipt(props) {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [showDatetime, setShowDatetime] = useState(false);
	const [showContributions, setShowContributions] = useState(false);
	const [store, setStore] = useState();
	const [amount, setAmount] = useState();
	const [date, setDate] = useState();
	const [time, setTime] = useState();
	const [contributions, setContributions] = useState();
	const [refs, setRefs] = useState([]);

	async function onSubmit() {
		setLoading(true);

		if (!showDatetime) {
			setDate(dateFormat(new Date(), "yyyy-mm-dd"));
			setTime(dateFormat(new Date(), "HH:MM"));
		}

		let details = {
			store: store,
			cost: amount,
			timestamp: Date.parse("".concat(date, " ", time))
		};
		let results = await createReceipt(details);
		if (results.error) {
			setError(results.message);
		} else {
			setError();
			props.toggle();
		}

		setLoading(false);
		props.setRefresh(props.refresh + 1);
	}

	async function getUsers() {
		let test = {
			id: 1,
			name: "Jayden",
			offset: 0
		};
		let list = [
			{ id: 1, user: "jaydengrubb1@gmail.com", offset: 0, paying: 32.45 },
			{ id: 2, user: "jaydengrubb1@gmail.com", offset: 0, paying: 32.45 },
			{ id: 3, user: "jaydengrubb1@gmail.com", offset: 0, paying: 32.45 }
		];

		setContributions(list);

		setRefs(ref => (
			Array(list.length).fill().map((_, i) => refs[i] || createRef())
		));
	}

	useEffect(() => {
		getUsers();

		setStore();
		setAmount();
		setShowDatetime(false);
		setShowContributions(false); // TODO Re enable this
		setDate(dateFormat(new Date(), "yyyy-mm-dd"));
		setTime(dateFormat(new Date(), "HH:MM"));
	}, [props.open]);

	return (
		<div>
			<Modal isOpen={props.open} toggle={props.toggle}>
				<ModalHeader toggle={props.toggle}>Create Receipt</ModalHeader>
				<ModalBody className="p-0">
					<Form onSubmit={onSubmit}>
						<div className="p-3">
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
									<Input type="checkbox" checked={!showDatetime} onChange={x => setShowDatetime(!x.target.checked)} />Use current date and time
								</Label>
							</FormGroup>
							<Collapse isOpen={showDatetime}>
								<FormGroup>
									<Label for="datefield">Date</Label>
									<Input type="date" name="date" id="datefield" value={date} onChange={x => setDate(x.target.value)} />
								</FormGroup>
								<FormGroup>
									<Label for="timefield">Time</Label>
									<Input type="time" name="time" id="timefield" value={time} onChange={x => setTime(x.target.value)} />
								</FormGroup>
							</Collapse>
							<FormGroup check>
								<Label check>
									<Input type="checkbox" checked={!showContributions} onChange={x => setShowContributions(!x.target.checked)} />Distribute evenly
								</Label>
							</FormGroup>
						</div>
						<Collapse isOpen={showContributions}>
							<div className="border-top">
								{contributions &&
									contributions.map((data, index) => {
										return <ContributionEntry
											data={data}
											end={index === contributions.length - 1}
											ref={refs[index]}
											key={index}
										/>
									})
								}
							</div>
						</Collapse>
					</Form>
					{error &&
						<p className="text-danger text-center mt-3">{error}</p>
					}
				</ModalBody>
				<ModalFooter>
					{loading &&
						<Spinner color="primary"></Spinner>
					}
					<Button color="primary" onClick={props.toggle} outline disabled={loading}>Cancel</Button>
					<Button color="primary" onClick={onSubmit} disabled={loading}>Save</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}