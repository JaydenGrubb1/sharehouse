import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef, useImperativeHandle } from "react";
import { useState } from "react/cjs/react.development";
import { Badge, Collapse, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, UncontrolledDropdown } from "reactstrap";

function ContributionEntry(props, ref) {

	const [checked, setChecked] = useState(true);
	const [expanded, setExpanded] = useState(false);
	const [offset, setOffset] = useState(0);
	const toggleExpanded = () => setExpanded(!expanded);

	useImperativeHandle(ref, () => ({
		getDetails() {
			return undefined;
		}
	}), [checked, offset])

	return (
		<div className={!props.end && "border-bottom"}>
			<Form className="p-3">
				<FormGroup check className="d-flex">
					<Label check>
						<Input type="checkbox" checked={checked} onClick={x => setChecked(x.target.checked)} />
						{props.data.user}{' '}
						<span className="text-muted font-italic">
							$({props.data.paying})
						</span>
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
						<Input value={(offset > 0 ? "+" : "") + offset} onChange={x => setOffset(x.target.value)} />
					</InputGroup>
				</Collapse>
			</Form>
		</div>
	);
}

export default forwardRef(ContributionEntry);