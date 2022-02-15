import React, { useState, useEffect } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown } from "reactstrap";
import { getStatInfo } from "../api";

const MAX_GUESSES = 6;

export default function Predictions(props) {

	const [options, setOptions] = useState();
	const [guesses, setGuesses] = useState();
	const [showGuess, setShowGuess] = useState(false);
	const toggleGuess = () => setShowGuess(!showGuess);

	async function getOptions() {
		let results = await getStatInfo(props.type);

		if (results.error || !results.data) {
			console.log("error");
			return;
		}

		setOptions(results.data.map(x => x[props.type.substring(0, props.type.length - 1)]));
	}

	function updateGuesses() {
		if (!options)
			return;

		setGuesses();

		if (!props.text)
			return;

		console.log(options);

		let results = options.filter(x => x.toLowerCase().includes(props.text.toLowerCase()));

		if (results.length > MAX_GUESSES) {
			results = results.slice(0, MAX_GUESSES);
		}

		if (results.length === 1 && props.text.toLowerCase() === results[0].toLowerCase()) {
			return;
		}

		if (results.length > 0) {
			let output = results.map(x => {
				let y = x.toLowerCase().indexOf(props.text.toLowerCase());
				let z = props.text.length === 1 ? y + 1 : y + props.text.length;
				return {
					pre: x.substring(0, y),
					intra: x.substring(y, z),
					post: x.substring(z, x.length),
					value: x
				}
			});

			setGuesses(output);
		}
	}

	useEffect(() => {
		getOptions();
		setShowGuess(true);
		updateGuesses();
	}, []);

	useEffect(() => {
		setShowGuess(true);
		updateGuesses();
	}, [props.text]);

	return (
		<InputGroupButtonDropdown addonType="append" isOpen={showGuess && guesses} toggle={toggleGuess} >
			<DropdownToggle style={{ padding: "0px", borderWidth: "0px" }} tabIndex={-1} />
			<DropdownMenu>
				{guesses &&
					guesses.map(x => (
						<DropdownItem key={x.value} onClick={() => {
							props.setText(x.value);
						}}>
							{x.pre}<strong>{x.intra}</strong>{x.post}
						</DropdownItem>
					))
				}
			</DropdownMenu>
		</InputGroupButtonDropdown>
	);
}