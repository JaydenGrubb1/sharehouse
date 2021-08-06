import dateFormat from "dateformat";
import React from "react";

export default function ReceiptEntry(props) {

	const timestamp = dateFormat(props.data.timestamp, "d mmm yy - h:MM tt")

	const tableStyle = {
		verticalAlign: "middle",
		whiteSpace: "nowrap"
	};

	return (
		<tr className="my-auto">
			<td className="col-2 text-left" style={tableStyle}>${props.data.cost.toFixed(2)}</td>
			<td className="col-5" style={tableStyle}>
				<span>{props.data.user}</span>
				<span className="sm-table-col">
					<br />
					<span className="text-muted small">{timestamp}</span>
				</span>
			</td>
			<td className="col-3" style={tableStyle}>{props.data.store}</td>
			<td className="col-3 lg-table-col text-right" style={tableStyle}>{timestamp}</td>
		</tr>
	)
}