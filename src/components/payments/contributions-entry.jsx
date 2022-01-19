import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";

function ContributionEntry(props, ref) {

	const [checked, setChecked] = useState(true);
	const [expanded, setExpanded] = useState(false);
	const [offset, setOffset] = useState(0);
	const [paying, setPaying] = useState(0);
	const toggleExpanded = () => setExpanded(!expanded);

	useEffect(() => {
		props.update();
	}, [checked, offset]);

	useImperativeHandle(ref, () => ({
		getDetails() {
			return {
				checked,
				offset: parseFloat(offset),
				paying: paying,
				user: props.user
			};
		},
		setDetails(amount) {
			setPaying(amount);
		}
	}), [checked, offset, paying]);

	useEffect(() => {
		setChecked(props.user.default);
		setOffset(0);
	}, [props.visible]);

	return (
		<div className={!props.end && "border-bottom"}>
			<Form className="p-3">
				<FormGroup check className="d-flex">
					<Label check>
						<Input type="checkbox" checked={checked} onChange={x => {
							setChecked(x.target.checked);
							if (!x.target.checked) {
								setOffset(0);
							}
						}} />
						{props.user.name}{' '}
						{checked &&
							<span className="text-muted font-italic">
								- (${paying && paying.toFixed(2)})
							</span>
						}
					</Label>
					<FontAwesomeIcon className="ml-auto my-auto" icon={expanded ? faCaretUp : faCaretDown} onClick={toggleExpanded} />
				</FormGroup>
				<Collapse isOpen={expanded}>
					<InputGroup className="mt-3">
						<InputGroupAddon addonType="prepend">
							<InputGroupText>
								Offset
							</InputGroupText>
							<InputGroupText>
								$
							</InputGroupText>
						</InputGroupAddon>
						<Input value={offset} onChange={x => setOffset(x.target.value)} />
					</InputGroup>
				</Collapse>
			</Form>
		</div>
	);
}

export default forwardRef(ContributionEntry);