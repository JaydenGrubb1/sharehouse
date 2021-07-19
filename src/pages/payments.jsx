import { faCaretDown, faCaretUp, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Card, CardBody, CardDeck, CardHeader, CardSubtitle, CardText, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledAlert, UncontrolledDropdown, UncontrolledTooltip } from "reactstrap";
import { getDebt, getPayments, getTotalDebt } from "../api";
import Entry from "../components/entry";

export default function Payments() {

	const [error, setError] = useState();

	const [debt, setDebt] = useState(0);
	const [totalDebt, setTotalDebt] = useState(0);
	const [pending, setPending] = useState();
	const [payments, setPayments] = useState();
	const [receipts, setReceipts] = useState();

	const [limit, setLimit] = useState(10);
	const [pFilterOpen, setPFilterOpen] = useState(false);
	const [tFilterOpen, setTFilterOpen] = useState(false);

	const togglePFilter = () => setPFilterOpen(!pFilterOpen);
	const toggleTFilter = () => setTFilterOpen(!tFilterOpen);

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
			{!pending &&
				<Card className="mt-3">
					<CardHeader>
						<h5>Pending Payments</h5>
					</CardHeader>
					<CardBody className="p-0">
						<div className="p-3">
							<Button color="primary" onClick={togglePFilter}>
								Filter <FontAwesomeIcon icon={pFilterOpen ? faCaretUp : faCaretDown} />
							</Button>
							<Collapse isOpen={pFilterOpen}>

							</Collapse>
						</div>
						<Table className="my-0" responsive>
							<tbody>
								{pending &&
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
						<Button color="primary" onClick={toggleTFilter}>
							Filter <FontAwesomeIcon icon={tFilterOpen ? faCaretUp : faCaretDown} />
						</Button>
						<Collapse isOpen={tFilterOpen}>
							<div className="mt-3">
								<UncontrolledDropdown>
									<DropdownToggle color="primary">
										Limit {limit} <FontAwesomeIcon icon={faCaretDown} />
									</DropdownToggle>
									<DropdownMenu>
										<DropdownItem onClick={() => setLimit(10)}>10</DropdownItem>
										<DropdownItem onClick={() => setLimit(20)}>20</DropdownItem>
										<DropdownItem onClick={() => setLimit(40)}>40</DropdownItem>
										<DropdownItem onClick={() => setLimit(60)}>60</DropdownItem>
										<DropdownItem onClick={() => setLimit(80)}>80</DropdownItem>
										<DropdownItem onClick={() => setLimit(100)}>100</DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>
							</div>
						</Collapse>
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