import React from "react";
import { Helmet } from "react-helmet";
import { Button, Card, CardBody, CardDeck, CardHeader, CardSubtitle, CardText, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import Entry from "../components/entry";

export default function Payments() {
	return (
		<div className="container p-3">
			<Helmet>
				<title>Sharehouse - Payments</title>
			</Helmet>
			<h4 className="text-left">Payments</h4>
			<CardDeck className="mt-3">
				<Card>
					<CardHeader>
						<h5>Your Debt</h5>
					</CardHeader>
					<CardBody>
						<CardSubtitle>Total amount of unpaid debt to all users</CardSubtitle>
						<CardText tag="h2">$123.45</CardText>
						<Button color="primary">Pay Debt</Button>
					</CardBody>
				</Card>
				<Card>
					<CardHeader>
						<h5>Total Debt</h5>
					</CardHeader>
					<CardBody>
						<CardSubtitle>Total amount of unpaid debt between all users</CardSubtitle>
						<CardText tag="h2">$543.21</CardText>
						<Button color="primary">Add Receipt</Button>
					</CardBody>
				</Card>
			</CardDeck>
			<Card className="mt-3">
				<CardHeader>
					<h5>Pending Payments</h5>
				</CardHeader>
				<CardBody className="p-0">
					<div className="p-3">
						<UncontrolledDropdown>
							<DropdownToggle color="primary" caret>
								Filter
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem>Header</DropdownItem>
								<DropdownItem>Action</DropdownItem>
								<DropdownItem>Another Action</DropdownItem>
								<DropdownItem>Another Action</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</div>
					<Table className="my-0" responsive>
						<tbody>
							<Entry pending data={{ cost: 32.50, name: "test1@testmail.com", timestamp: Date.parse("2021/07/07 08:30:00") }} />
							<Entry pending data={{ cost: 127.34, name: "test2@testmail.com", timestamp: Date.parse("21 Jul 21 - 11:47 pm") }} />
							<Entry pending data={{ cost: 34, name: "test3@testmail.com", timestamp: new Date() }} />
						</tbody>
					</Table>
				</CardBody>
			</Card>
			<Card className="mt-3">
				<CardHeader>
					<h5>Past Transactions</h5>
				</CardHeader>
				<CardBody className="p-0">
					<Table className="my-0" responsive>
						<tbody>
							<Entry data={{ cost: 32.50, name: "test1@testmail.com", timestamp: Date.parse("2021/07/07 08:30:00"), status: "approved" }} />
							<Entry data={{ cost: 127.34, name: "test2@testmail.com", timestamp: Date.parse("21 Jul 21 - 11:47 pm"), status: "pending" }} />
							<Entry data={{ cost: 34, name: "test3@testmail.com", timestamp: new Date(), status: "denied" }} />
						</tbody>
					</Table>
				</CardBody>
			</Card>
		</div>
	);
}