import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateFormat from "dateformat";
import React from "react";
import { Button, ButtonGroup } from "reactstrap";

export default function Entry(props) {

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

	const t = props.data.timestamp;
	const tf = dateFormat(t, "d mmm yy - h:MM tt")

	return (
		<tr className="my-auto">
			<td className="col-2 text-left" style={tableStyle}>${props.data.amount.toFixed(2)}</td>
			<td className="col-5" style={tableStyle}>
				<span>{props.pending ? props.data.from : props.data.to}</span>
				<span className="sm-table-col">
					<br />
					<span className="text-muted small">{tf}</span>
				</span>
			</td>
			<td className="col-3 lg-table-col" style={tableStyle}>{tf}</td>
			{props.pending
				?
				<td className="col-2" style={tableStyle}>
					<ButtonGroup className="w-100">
						<Button color="success"><FontAwesomeIcon icon={faCheck} /></Button>
						<Button color="danger"><FontAwesomeIcon icon={faTimes} /></Button>
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