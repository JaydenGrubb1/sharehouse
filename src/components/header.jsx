import React from "react";
import { useEffect, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Progress } from "reactstrap";
import { doLogout } from "../api";

export default function Header() {

	const [progress, setProgress] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	useEffect(() => {
		setProgress(100);
	}, []);

	return (
		<div>
			<Navbar color="dark" dark expand="md">
				<NavbarBrand href="/">sharehouse</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="mr-auto" navbar>
						<NavItem>
							<NavLink href="/payments">Payments</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="/statistics">Stats</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="/account">Account</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="/" onClick={doLogout}>Logout</NavLink>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
			<Progress value={progress} style={{ height: "2.5px", borderRadius: "0px" }} />
		</div>
	);
};