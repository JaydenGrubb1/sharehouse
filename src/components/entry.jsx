import dateFormat from "dateformat";
import React from "react";
import { Button } from "reactstrap";

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
			case "denied":
				return "text-danger";
			default:
				return "";
		}
	}

	const t = props.data.timestamp;
	const tf = dateFormat(t, "d mmm yy - h:MM tt")

	return (
		<tr className="my-auto">
			<td className="col-2" style={tableStyle}>${props.data.amount.toFixed(2)}</td>
			<td className="col-5" style={tableStyle}>
				<span>{props.data.to}</span>
				<span className="sm-table-col">
					<br />
					<span className="text-muted small">{tf}</span>
				</span>
			</td>
			<td className="col-3 lg-table-col" style={tableStyle}>{tf}</td>
			{props.pending
				?
				<td className="col-2" style={tableStyle}><Button color="primary" className="w-100" outline>Cancel</Button></td>
				:
				<td className="col-2 text-uppercase" style={tableStyle}>
					<span className={color()}>{props.data.status}</span>
				</td>
			}
		</tr>
	)
}