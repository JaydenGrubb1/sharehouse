import { faCaretDown, faCaretUp, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Collapse, Table } from "reactstrap";
import { getEmail, getPayments, } from "../../api";
import Pager from "../pager";
import Entry from "./entry";

export default function Pending(props) {

	const [data, setData] = useState();
	const [filterOpen, setFilterOpen] = useState(false);
	const toggleFilter = () => setFilterOpen(!filterOpen);

	async function getData() {
		let results = await getPayments(undefined, getEmail(), "pending");
		if (results.error) {
			console.log(results);
			props.error(results.message);
		} else {
			if (results.data && results.data.length > 0) {
				setData(results.data);
			} else {
				setData(undefined);
			}
		}
	}

	useEffect(() => {
		getData();
	}, []);

	if (data)
		return (
			<Card className="mt-3">
				<CardHeader className="d-flex">
					<h5 className="my-auto">Pending Payments</h5>
					<Button className="ml-auto my-auto" outline onClick={getData}>
						<FontAwesomeIcon icon={faSync} />
					</Button>
				</CardHeader>
				<CardBody className="p-0">
					<div className="p-3">
						<Button color="primary" onClick={toggleFilter}>
							Filter <FontAwesomeIcon icon={filterOpen ? faCaretUp : faCaretDown} />
						</Button>
						<Collapse isOpen={filterOpen}>

						</Collapse>
					</div>
					<Table className="my-0" responsive>
						<tbody>
							{data &&
								data.map(x => {
									return <Entry pending data={x} error={props.error} refresh={getData} />
								})
							}
						</tbody>
					</Table>
					<Pager />
				</CardBody>
			</Card>
		);
	else
		return (
			<div />
		);
}