import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateFormat from "dateformat";
import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import { approvePayment } from "../../api";

export default function PaymentEntry(props) {

	const timestamp = dateFormat(props.data.timestamp, "d mmm yy - h:MM tt")

	const tableStyle = {
		verticalAlign: "middle",
		whiteSpace: "nowrap"
	};

	const color = () => {
		switch (props.data.status) {
			case "pending":
				return "text-warning";
			case "approved":
				return "text-success";
			case "rejected":
				return "text-danger";
			default:
				return "";
		}
	}

	async function setStatus(approved) {
		let results = await approvePayment(props.data.id, approved);
		if (results.error) {
			props.error(results.message);
		} else {
			props.refresh();
		}
	}

	return (
		<tr className="my-auto">
			<td className="col-2 text-left" style={tableStyle}>${props.data.amount.toFixed(2)}</td>
			<td className="col-5" style={tableStyle}>
				<span>
					{props.pending
						?
						<a href={"/users/" + props.data.from}>{props.data.from}</a>
						:
						<a href={"/users/" + props.data.to}>{props.data.to}</a>
					}
				</span>
				<span className="sm-table-col">
					<br />
					<span className="text-muted small">{timestamp}</span>
				</span>
			</td>
			<td className="col-3 lg-table-col" style={tableStyle}>{timestamp}</td>
			{props.pending
				?
				<td className="col-2" style={tableStyle}>
					<ButtonGroup className="w-100">
						<Button color="success" onClick={() => setStatus(true)}><FontAwesomeIcon icon={faCheck} /></Button>
						<Button color="danger" onClick={() => setStatus(false)}><FontAwesomeIcon icon={faTimes} /></Button>
					</ButtonGroup>
				</td>
				:
				<td className="col-2 text-uppercase text-right" style={tableStyle}>
					<span className={color()}>{props.data.status}</span>
				</td>
			}
		</tr>
	)
}