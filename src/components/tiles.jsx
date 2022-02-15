import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, CardColumns, CardDeck } from "reactstrap";
import { getUserConfig } from "../api";
import TotalDebt from "./payments/totaldebt";
import YourDebt from "./payments/yourdebt";
import Averages from "./statistics/average";

function TilePiece(props) {
	switch (props.element) {
		case 'your_debt':
			return (
				<div>
					<YourDebt error={props.setError} refresh={props.refresh} setRefresh={props.setRefresh} />
				</div>
			);
		case 'total_debt':
			return (
				<div>
					<TotalDebt error={props.setError} refresh={props.refresh} setRefresh={props.setRefresh} />
				</div>
			);
		case 'average':
			return (
				<div>
					<Averages error={props.setError} refresh={props.refresh} setRefresh={props.setRefresh} />
				</div>
			);
		default:
			return <div />
	}
}

export default function Tiles(props) {

	const [refresh, setRefresh] = useState(0);
	const [elements, setElements] = useState();

	async function getConfig() {
		let results = await getUserConfig();
		if (results.error || !results.data) {
			props.error(results.message);
		} else {
			setElements(results.data.map(elm => elm.element));
		}
	}

	useEffect(() => {
		getConfig();
	}, [])

	return (
		<div>
			<CardColumns className="mt-3">
				{elements &&
					elements.map(elm => {
						return <TilePiece
							element={elm}
							error={props.setError}
							refresh={refresh}
							setRefresh={setRefresh}
						/>
					})
				}
			</CardColumns>
			<Button className="w-100 mb-3 p-2" color="primary"><FontAwesomeIcon icon={faPlusCircle} size="2x" /></Button>
		</div>
	);
}