import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { getAverages } from "../../api";

const MODE_TEXT_MAPPINGS = {
	average_01: "1 Month",
	average_02: "2 Months",
	average_03: "3 Months",
	average_06: "6 Months",
	average_12: "12 Months",
	average_all: "All Time",
}

const rand = () => Math.round(Math.random() * 20 - 10);

export default function Averages(props) {

	const [mode, setMode] = useState('average_01');
	const [labels, setLabels] = useState();
	const [costData, setCostData] = useState();
	const [averageData, setAverageData] = useState();

	const data = {
		labels: labels,
		datasets: [
			{
				type: 'line',
				label: '7-day Average',
				borderColor: 'rgb(54, 162, 235)',
				borderWidth: 2,
				fill: false,
				data: averageData,
			},
			{
				type: 'bar',
				label: 'Weekly Amount',
				backgroundColor: 'rgb(255, 99, 132)',
				data: costData,
				borderColor: 'white',
				borderWidth: 2,
			}
		],
	};

	async function getData() {
		console.log("getting data...");
		let results = await getAverages(mode);
		if (results.error) {
			props.error(results.message);
		} else {
			setLabels(results.data.map(x => x.week));
			setCostData(results.data.map(x => x.amount));
			setAverageData(results.data.map(x => x.average));
		}
	}

	useEffect(() => {
		getData();
	}, [mode]);

	return (
		<Card>
			<CardHeader className="d-flex">
				<h5 className="my-auto">7-day Average</h5>
			</CardHeader>
			<CardBody>
				<UncontrolledDropdown>
					<DropdownToggle color="primary">
						{MODE_TEXT_MAPPINGS[mode]} <FontAwesomeIcon icon={faCaretDown} />
					</DropdownToggle>
					<DropdownMenu>
						<DropdownItem onClick={() => setMode('average_all')}>All Time</DropdownItem>
						<DropdownItem onClick={() => setMode('average_01')}>1 Month</DropdownItem>
						<DropdownItem onClick={() => setMode('average_02')}>2 Months</DropdownItem>
						<DropdownItem onClick={() => setMode('average_03')}>3 Months</DropdownItem>
						<DropdownItem onClick={() => setMode('average_06')}>6 Months</DropdownItem>
						<DropdownItem onClick={() => setMode('average_12')}>12 Months</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
				<Bar data={data} />
			</CardBody>
		</Card>
	)
}