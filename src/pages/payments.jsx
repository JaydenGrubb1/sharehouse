import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Card, CardBody, CardDeck, CardHeader, CardSubtitle, CardText, Collapse, UncontrolledAlert, UncontrolledTooltip } from "reactstrap";
import { getDebt, getTotalDebt } from "../api";
import Pending from "../components/payments/pending";
import Transactions from "../components/payments/transactions";

export default function Payments() {

	const [error, setError] = useState();

	const [debt, setDebt] = useState(0);
	const [totalDebt, setTotalDebt] = useState(0);

	async function getDebts() {
		let results = await getDebt();
		let sum = 0;
		let total = 0;
		if (results.error) {
			setError(results.message);
		} else {
			if (results.data) {
				let debts = Object.values(results.data);
				sum = debts.reduce((a, x) => a + x, 0);
			}
		}
		results = await getTotalDebt();
		if (results.error) {
			setError(results.message);
		} else {
			total = results.total;
		}

		setDebt(sum);
		setTotalDebt(total);
	}

	useEffect(() => {
		getDebts();
	}, []);

	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Payments</title>
			</Helmet>
			<Collapse isOpen={error}>
				<UncontrolledAlert color="danger">{error}</UncontrolledAlert>
			</Collapse>
			<h4 className="text-left">Payments</h4>
			<CardDeck className="mt-3">
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
						<CardText tag="h2">${debt.toFixed(2)}</CardText>
						<Button color="primary">Pay Debt</Button>
					</CardBody>
				</Card>
				<Card>
					<CardHeader className="d-flex">
						<h5 className="my-auto">Total Debt</h5>
					</CardHeader>
					<CardBody>
						<CardSubtitle>Total amount of unpaid debt between all users</CardSubtitle>
						<CardText tag="h2">${totalDebt.toFixed(2)}</CardText>
						<Button color="primary">Add Receipt</Button>
					</CardBody>
				</Card>
			</CardDeck>
			<Pending error={setError} />
			<Transactions error={setError} />
		</div>
	);
}