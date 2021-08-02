import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardSubtitle, CardText, UncontrolledTooltip } from "reactstrap";
import { getDebt } from "../../api";
import Payment from "../modals/payment";

export default function YourDebt(props) {

	const [debt, setDebt] = useState(0);
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	async function getData() {
		let results = await getDebt();
		if (results.error) {
			props.error(results.message);
			setDebt(0);
		} else {
			if (results.data) {
				let debts = Object.values(results.data);
				setDebt(debts.reduce((a, x) => a + x, 0));
			}else{
				setDebt(0);
			}
		}
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<Card>
			<CardHeader className="d-flex">
				<h5 className="my-auto">Your Debt</h5>
			</CardHeader>
			<CardBody>
				<CardSubtitle>
					Total amount of unpaid debt to all users <FontAwesomeIcon icon={faQuestionCircle} id="debtTooltip" />
					<UncontrolledTooltip target="debtTooltip" placement="bottom">
						"Your Debt" does not account for any pending payments. If you have already made a payment, please wait until it has been approved by the reciever.
					</UncontrolledTooltip>
				</CardSubtitle>
				<CardText tag="h2">${debt && debt.toFixed(2)}</CardText>
				<Button color="primary" onClick={toggle}>Pay Debt</Button>
			</CardBody>
			<Payment open={modal} toggle={toggle} />
		</Card>
	);
}