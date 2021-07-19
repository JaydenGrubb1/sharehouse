import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Card, CardBody, CardDeck, CardHeader, CardSubtitle, CardText, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledAlert, UncontrolledDropdown } from "reactstrap";
import { getDebt, getPayments, getTotalDebt } from "../api";
import Entry from "../components/entry";

export default function Payments() {

	const [error, setError] = useState();

	const [debt, setDebt] = useState(0);
	const [totalDebt, setTotalDebt] = useState(0);
	const [pending, setPending] = useState();
	const [payments, setPayments] = useState();
	const [receipts, setReceipts] = useState();

	const [pendingNum, setPendingNum] = useState(10);
	const [transNum, setTransNum] = useState(10);

	async function getDebts() {
		let results = await getDebt();
		let sum = 0;
		let total = 0;
		if (results.error) {
			setError(results.error);
		} else {
			if (results.data) {
				let debts = Object.values(results.data);
				sum = debts.reduce((a, x) => a + x, 0);
			}
		}
		results = await getTotalDebt();
		if (results.error) {
			setError(results.error);
		} else {
			total = results.total;
		}

		setDebt(sum);
		setTotalDebt(total);
	}

	async function getPending() {
		setPending();
	}

	async function getTransactions() {
		let results = await getPayments();
		if (results.error) {
			setError(results.error);
		} else {
			if (results.data) {
				setPayments(results.data);
			}
		}
		setReceipts();
	}

	useEffect(() => {
		getDebts();
		getPending();
		getTransactions();
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
					<CardHeader>
						<h5>Your Debt</h5>
					</CardHeader>
					<CardBody>
						<CardSubtitle>Total amount of unpaid debt to all users</CardSubtitle>
						<CardText tag="h2">${debt.toFixed(2)}</CardText>
						<Button color="primary">Pay Debt</Button>
					</CardBody>
				</Card>
				<Card>
					<CardHeader>
						<h5>Total Debt</h5>
					</CardHeader>
					<CardBody>
						<CardSubtitle>Total amount of unpaid debt between all users</CardSubtitle>
						<CardText tag="h2">${totalDebt.toFixed(2)}</CardText>
						<Button color="primary">Add Receipt</Button>
					</CardBody>
				</Card>
			</CardDeck>
			{pending &&
				<Card className="mt-3">
					<CardHeader>
						<h5>Pending Payments</h5>
					</CardHeader>
					<CardBody className="p-0">
						<div className="p-3">
							<UncontrolledDropdown>
								<DropdownToggle color="primary" caret>
									Limit {pendingNum}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem onClick={() => setPendingNum(10)}>10</DropdownItem>
									<DropdownItem onClick={() => setPendingNum(20)}>20</DropdownItem>
									<DropdownItem onClick={() => setPendingNum(40)}>40</DropdownItem>
									<DropdownItem onClick={() => setPendingNum(60)}>60</DropdownItem>
									<DropdownItem onClick={() => setPendingNum(80)}>80</DropdownItem>
									<DropdownItem onClick={() => setPendingNum(100)}>100</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</div>
						<Table className="my-0" responsive>
							<tbody>
								{
									pending.map(x => {
										return <Entry data={x} />
									})
								}
							</tbody>
						</Table>
					</CardBody>
				</Card>
			}
			<Card className="mt-3">
				<CardHeader>
					<h5>Past Transactions</h5>
				</CardHeader>
				<CardBody className="p-0">
					<div className="p-3">
						<UncontrolledDropdown>
							<DropdownToggle color="primary" caret>
								Limit {transNum}
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={() => setTransNum(10)}>10</DropdownItem>
								<DropdownItem onClick={() => setTransNum(20)}>20</DropdownItem>
								<DropdownItem onClick={() => setTransNum(40)}>40</DropdownItem>
								<DropdownItem onClick={() => setTransNum(60)}>60</DropdownItem>
								<DropdownItem onClick={() => setTransNum(80)}>80</DropdownItem>
								<DropdownItem onClick={() => setTransNum(100)}>100</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</div>
					<Table className="my-0" responsive>
						<tbody>
							{payments &&
								payments.map(x => {
									return <Entry data={x} />
								})
							}
						</tbody>
					</Table>
					<Table className="my-0" responsive>
						<tbody>
							{receipts &&
								receipts.map(x => {
									return <Entry data={x} />
								})
							}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		</div>
	);
}