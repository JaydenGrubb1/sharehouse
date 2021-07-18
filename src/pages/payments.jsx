import React from "react";
import { Helmet } from "react-helmet";
import { Button, Card, CardBody, CardDeck, CardHeader, CardSubtitle, CardText, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink, Table, UncontrolledDropdown } from "reactstrap";
import Entry from "../components/entry";

export default function Payments() {

	const tableStyle = {
		verticalAlign: "middle",
		whiteSpace: "nowrap"
	};

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
							<tr className="my-auto">
								<td style={tableStyle}>7 Jul 21</td>
								<td style={tableStyle}>8:30 am</td>
								<td style={tableStyle}>test1@testmail.com</td>
								<td style={tableStyle}>$32.50</td>
								<td style={tableStyle} className="text-right"><Button color="primary" outline>Cancel</Button></td>
							</tr>
							<tr className="my-auto">
								<td style={tableStyle}>21 Jul 21</td>
								<td style={tableStyle}>11:47 pm</td>
								<td style={tableStyle}>test2@testmail.com</td>
								<td style={tableStyle}>$127.34</td>
								<td style={tableStyle} className="text-right"><Button color="primary" outline>Cancel</Button></td>
							</tr>
						</tbody>
					</Table>
				</CardBody>
			</Card>
			<Entry>
				<p>INNER HTML</p>
			</Entry>
			<Card className="mt-3">
				<CardHeader>
					<h5>Past Transactions</h5>
				</CardHeader>
				<CardBody className="p-0">
					<ListGroup flush>
						<ListGroupItem>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<p className="my-auto">17 Jul 21</p>
								<p className="my-auto">8:30 am</p>
								<p className="my-auto">test1@testmail.com</p>
								<p className="my-auto">$32.50</p>
								<Button color="primary" outline>Cancel</Button>
							</div>
						</ListGroupItem>
						<ListGroupItem>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<p className="my-auto">19 Jul 21</p>
								<p className="my-auto">11:49 pm</p>
								<p className="my-auto">jaydengrubb1@gmail.com</p>
								<p className="my-auto">$170.37</p>
								<Button color="primary" outline>Cancel</Button>
							</div>
						</ListGroupItem>
					</ListGroup>
				</CardBody>
			</Card>
		</div>
	);
}