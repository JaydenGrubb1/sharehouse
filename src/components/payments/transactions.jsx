import { faCaretDown, faCaretUp, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { getPayments } from "../../api";
import Pager from "../pager";
import Entry from "./entry";

export default function Transactions(props) {
	const [payments, setPayments] = useState(undefined);
	const [receipts, setReceipts] = useState();

	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(10);
	const [filterOpen, setFilterOpen] = useState(false);

	const toggleFilter = () => setFilterOpen(!filterOpen);

	async function getData() {
		let results = await getPayments(undefined, undefined, undefined, limit, offset);
		if (results.error) {
			props.error(results.message);
		} else {
			if (results.data && results.data.length > 0) {
				setPayments(results.data);
			} else {
				setPayments(undefined);
			}
		}
		setReceipts();
	}

	useEffect(() => {
		getData();
	}, []);

	return (<Card className="mt-3">
		<CardHeader className="d-flex">
			<h5 className="my-auto">Past Transactions</h5>
			{/* <Button className="ml-auto my-auto" outline onClick={getData}>
				<FontAwesomeIcon icon={faSync} />
			</Button> */}
		</CardHeader>
		<CardBody className="p-0">
			<div className="p-3">
				<Button color="primary" onClick={toggleFilter}>
					Filter <FontAwesomeIcon icon={filterOpen ? faCaretUp : faCaretDown} />
				</Button>
				<Collapse isOpen={filterOpen}>
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
							return <Entry data={x} error={props.error} refresh={getData} />
						})
					}
				</tbody>
			</Table>
			<Table className="my-0" responsive>
				<tbody>
					{receipts &&
						receipts.map(x => {
							return <Entry data={x} error={props.error} refresh={getData} />
						})
					}
				</tbody>
			</Table>
			{payments &&
				< Pager results={payments.length} limit={limit} setOffset={setOffset} />
			}
		</CardBody>
	</Card>
	);
}