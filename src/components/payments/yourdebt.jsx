import { faCaretDown, faCaretUp, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardSubtitle, CardText, Collapse, Table, UncontrolledTooltip } from "reactstrap";
import { getDebt, getPending } from "../../api";
import Payment from "../modals/payment";

export default function YourDebt(props) {

	const [debt, setDebt] = useState(0);
	const [pending, setPending] = useState();
	const [debtList, setDebtList] = useState();
	const [modal, setModal] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const toggleModal = () => setModal(!modal);
	const toggleDetails = () => setShowDetails(!showDetails);

	async function getDebtData() {
		let results = await getDebt();
		if (results.error) {
			props.error(results.message);
			setDebt(0);
		} else {
			if (results.data) {
				let debts = Object.values(results.data);
				setDebt(debts.reduce((a, x) => a + x, 0));

				debts = Object.keys(results.data).map(key => ({
					user: key,
					cost: results.data[key]
				}))
				setDebtList(debts);
			} else {
				setDebt(0);
			}
		}
	}

	async function getPendingData() {
		let results = await getPending();
		if (results.error) {
			props.error(results.message);
			setPending(undefined);
		} else {
			if (results.total) {
				setPending(results.total);
			} else {
				setPending(undefined)
			}
		}
	}

	useEffect(() => {
		getDebtData();
		getPendingData();
	}, [props.refresh]);

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
				<CardText tag="h2">
					${debt && debt.toFixed(2)}{' '}
					{debtList && debt > 0 &&
						<FontAwesomeIcon icon={showDetails ? faCaretUp : faCaretDown} onClick={toggleDetails} />
					}
					{pending &&
						<span className="h5 text-warning">{' '}${pending.toFixed(2)}{' '}pending</span>
					}
				</CardText>
				<Collapse isOpen={showDetails}>
					<Table>
						<tbody>
							{debtList &&
								debtList.map((data, index) => {
									return (
										<tr key={index}>
											<td>${data.cost.toFixed(2)}</td>
											<td>{data.user}</td>
										</tr>
									)
								})
							}
						</tbody>
					</Table>
				</Collapse>
				<Button color="primary" onClick={toggleModal} disabled={debt <= 0}>Pay Debt</Button>
			</CardBody>
			<Payment open={modal} toggle={toggleModal} debts={debtList} refresh={props.refresh} setRefresh={props.setRefresh} />
		</Card>
	);
}