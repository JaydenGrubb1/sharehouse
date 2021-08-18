import React, { createRef, useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { createPayment } from "../../api";
import Entry from "./entry";

export default function Payment(props) {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [refs, setRefs] = useState([]);

	async function onSubmit() {
		setLoading(true);

		for (let i = 0; i < refs.length; i++) {
			let ref = refs[i];
			let details = ref.current.getDetails();
			if (details === null)
				continue;
			let results = await createPayment(details);
			if (results.error) {
				setError(results.message);
				break;
			} else {
				setError();
				props.toggle();
			}
		}

		setLoading(false);
	}

	useEffect(() => {
		if (!props.debts)
			return;

		setRefs(ref => (
			Array(props.debts.length).fill().map((_, i) => refs[i] || createRef())
		));
	}, props.debts);

	return (
		<div>
			<Modal isOpen={props.open} toggle={props.toggle}>
				<ModalHeader toggle={props.toggle}>Create Payments</ModalHeader>
				<ModalBody className="p-0">
					{props.debts &&
						props.debts.map((debt, index) => {
							return <Entry
								user={debt.user}
								cost={debt.cost}
								end={index === props.debts.length - 1}
								ref={refs[index]}
								key={index}
							/>
						})
					}
					{error &&
						<p className="text-danger text-center mt-3">{error}</p>
					}
				</ModalBody>
				<ModalFooter>
					{loading &&
						<Spinner color="primary"></Spinner>
					}
					<Button color="primary" onClick={props.toggle} disabled={loading} outline>Cancel</Button>
					<Button color="primary" onClick={onSubmit} disabled={loading}>Save</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}