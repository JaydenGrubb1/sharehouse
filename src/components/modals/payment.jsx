import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import Entry from "./entry";

export default function Payment(props) {

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	async function onSubmit() {
		setLoading(true);

		setLoading(false);
	}

	return (
		<div>
			<Modal isOpen={props.open} toggle={props.toggle}>
				<ModalHeader toggle={props.toggle}>Create Payments</ModalHeader>
				<ModalBody className="p-0">
					<Entry email="jaydengrubb1@gmail.com" />
					<Entry email="test1@testmail.com" />
					<Entry email="test2@testmail.com" end />
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