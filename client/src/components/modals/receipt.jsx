import dateFormat from "dateformat";
import React, { createRef, useState, useEffect, useRef } from "react";
import { Button, Card, CardDeck, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { createReceipt, getAllUsers, uploadReceiptImg } from "../../api";
import ContributionEntry from "../payments/contributions-entry";
import Predictions from "../predictions";

export default function Receipt(props) {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [showDatetime, setShowDatetime] = useState(false);
	const [showContributions, setShowContributions] = useState(false);
	const [image, setImage] = useState(undefined);
	const [imageSrc, setImageSrc] = useState(undefined);
	const [store, setStore] = useState();
	const [location, setLocation] = useState();
	const [description, setDescription] = useState();
	const [amount, setAmount] = useState(0);
	const [date, setDate] = useState();
	const [time, setTime] = useState();
	const [users, setUsers] = useState();
	const [refs, setRefs] = useState([]);
	const [updateCount, setUC] = useState(0);
	const [userCount, setUserCount] = useState();
	const update = () => setUC(updateCount + 1);
	const inputFile = useRef(null);

	async function onSubmit() {
		setLoading(true);

		if (!showDatetime) {
			setDate(dateFormat(new Date(), "yyyy-mm-dd"));
			setTime(dateFormat(new Date(), "HH:MM"));
		}

		let contributions = [];

		for (let i = 0; i < refs.length; i++) {
			let ref = refs[i];
			if (!ref.current)
				return;
			let current = ref.current.getDetails();
			if (current.checked && current.paying !== 0) {
				contributions.push({ user: current.user.email, amount: current.paying });
			}
		}

		let details = {
			store: store,
			location: location,
			description: description,
			amount: amount,
			timestamp: Date.parse("".concat(date, " ", time)),
			contributions: contributions
		};

		let results = await createReceipt(details);
		if (results.error) {
			setError(results.message);
		} else {
			if (imageSrc) {
				results = await uploadReceiptImg(image, results.id);

				if (results.error) {
					setError(results.message);
				} else {
					setError();
					props.toggle();
				}
			}
		}

		setLoading(false);
		props.setRefresh(props.refresh + 1);
	}

	function calculate() {
		if (!users) {
			return;
		}

		let count = 0;
		let details = [];

		for (let i = 0; i < refs.length; i++) {
			let ref = refs[i];
			if (!ref.current)
				return;
			details.push(ref.current.getDetails());
			if (details[i].checked)
				count++;
		}

		setUserCount(count);

		let total = amount;

		for (let i = 0; i < refs.length; i++) {
			total -= details[i].offset;
		}

		for (let i = 0; i < refs.length; i++) {
			let value = 0;

			if (details[i].checked) {
				value = (total / count) + details[i].offset;
			}

			refs[i].current.setDetails(value);
		}
	}

	function showImagePreview(event) {
		let file = event.target.files[0];
		event.stopPropagation();
		event.preventDefault();
		setImage(file);
		setImageSrc(URL.createObjectURL(file));
	}

	async function getUsers() {
		let results = await getAllUsers();
		if (results.error || !results.data) {
			setError(results.message);
		} else {
			setError();
			let list = results.data.map(x => ({
				email: x.email,
				default: x.default === 1
			}));
			setUsers(list);
			setRefs(ref => (
				Array(list.length).fill().map((_, i) => refs[i] || createRef())
			));
		}
	}

	useEffect(() => {
		calculate();
	}, [amount, updateCount]);

	useEffect(() => {
		getUsers();
		setStore();
		setLocation();
		setDescription();
		setAmount(0);
		setShowDatetime(false);
		setShowContributions(false);
		setDate(dateFormat(new Date(), "yyyy-mm-dd"));
		setTime(dateFormat(new Date(), "HH:MM"));
		setImage(undefined);
		setImageSrc(undefined);
	}, [props.open]);

	const fixBorder = { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 };

	return (
		<div>
			<Modal isOpen={props.open} toggle={props.toggle}>
				<ModalHeader toggle={props.toggle}>Create Receipt</ModalHeader>
				<ModalBody className="p-0">
					<Form onSubmit={onSubmit} autoComplete={false}>
						<div className="p-3">
							<FormGroup>
								<Label for="storefield">Store</Label>
								<InputGroup>
									<Predictions text={store} setText={setStore} type="stores" />
									<Input autoComplete="off" className="rounded-left" type="text" name="store" id="storefield" value={store} onChange={x => setStore(x.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<Label for="locationfield">Location <span className="text-muted">(Optional)</span></Label>
								<InputGroup>
									<Predictions text={location} setText={setLocation} type="locations" />
									<Input autoComplete="off" className="rounded-left" type="text" name="location" id="locationfield" value={location} onChange={x => setLocation(x.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<Label for="descriptionfield">Description <span className="text-muted">(Optional)</span></Label>
								<InputGroup>
									<Input className="rounded-left" type="text" name="description" id="descriptionfield" value={description} onChange={x => setDescription(x.target.value)} />
								</InputGroup>
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
									{' '}
									{!showContributions &&
										<span className="text-muted font-italic">
											- (${amount && (amount / userCount).toFixed(2)} each for {userCount} users)
										</span>
									}
								</Label>
							</FormGroup>
						</div>
						<Collapse isOpen={showContributions}>
							<div className="border-top">
								{users &&
									users.map((user, index) => {
										return <ContributionEntry
											user={user}
											end={index === users.length - 1}
											ref={refs[index]}
											key={index}
											update={update}
											visible={showContributions}
										/>
									})
								}
							</div>
						</Collapse>
						<Collapse isOpen={imageSrc}>
							<img src={imageSrc} className="img-fluid px-3 pb-3 img-rounded" />
						</Collapse>
						<div className="px-3">
							<input type="file" id="file" ref={inputFile} style={{ display: "none" }} onChange={showImagePreview} accept="image/png, image/jpg, image/jpeg" />
							<CardDeck className="mb-3">
								<Card>
									<Button color="primary" onClick={() => inputFile.current.click()} disabled={loading} outline>Upload Image</Button>
								</Card>
								<Card>
									<Button color="primary" onClick={onSubmit} disabled outline>Take Photo</Button>
								</Card>
							</CardDeck>
						</div>
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