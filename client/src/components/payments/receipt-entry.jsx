import dateFormat from "dateformat";
import React, { useState } from "react";
import { hashInteger } from "../../api";

export default function ReceiptEntry(props) {

	const date = dateFormat(props.data.timestamp, "d mmm yy")
	const time = dateFormat(props.data.timestamp, "h:MM tt");

	const tableStyle = {
		verticalAlign: "middle",
		whiteSpace: "nowrap"
	};

	// return (
	// 	<tr className="my-auto">
	// 		<td className="col-2 text-left" style={tableStyle}>${props.data.amount.toFixed(2)}</td>
	// 		<td className="col-5" style={tableStyle}>
	// 			<span><a href={"/users/" + props.data.user}>{props.data.user}</a></span>
	// 			<span className="sm-table-col">
	// 				<br />
	// 				<span className="text-muted small">{timestamp}</span>
	// 			</span>
	// 		</td>
	// 		<td className="col-3" style={tableStyle}>{props.data.store}</td>
	// 		<td className="col-3 lg-table-col text-right" style={tableStyle}>{timestamp}</td>
	// 	</tr>
	// )

	return (
		<tr className="my-auto" id={props.data.id}>
			<td style={tableStyle} className="col-1 text-left">
				<a href={"/receipt/" + props.data.id}>
					{hashInteger(props.data.id)}
				</a>
			</td>
			<td style={tableStyle} className="col-3 hide-small">{props.data.store}</td>
			<td className="col-6">
				<span className="d-none show-small">{props.data.store}</span>
				<br className="d-none show-small"></br>
				<span className="text-muted-cond small-cond text-truncate">{props.data.user}</span>
			</td>
			<td style={tableStyle} className="col-2 text-left">${props.data.amount.toFixed(2)}</td>
			<td className="col-2 text-right" style={tableStyle}>
				<span className="small-cond">{date}</span>
				<br className="d-none show-small"></br>
				<span className="hide-small"> - </span>
				<span className="small-cond">{time}</span>
			</td>
		</tr>
	)
}