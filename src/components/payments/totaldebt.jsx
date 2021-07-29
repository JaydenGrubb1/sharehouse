import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardSubtitle, CardText } from "reactstrap";
import { getTotalDebt } from "../../api";
import Receipt from "../modals/receipt";

export default function TotalDebt(props) {

	const [debt, setDebt] = useState(0);
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	async function getData() {
		let results = await getTotalDebt();
		if (results.error) {
			props.error(results.message);
		} else {
			setDebt(results.total);
		}
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<Card>
			<CardHeader className="d-flex">
				<h5 className="my-auto">Total Debt</h5>
			</CardHeader>
			<CardBody>
				<CardSubtitle>Total amount of unpaid debt between all users</CardSubtitle>
				<CardText tag="h2">${debt && debt.toFixed(2)}</CardText>
				<Button color="primary" onClick={toggle}>Add Receipt</Button>
			</CardBody>
			<Receipt open={modal} toggle={toggle} />
		</Card>
	);
}