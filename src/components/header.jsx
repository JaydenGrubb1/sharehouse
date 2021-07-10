import React from "react";
import { useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { doLogout } from "../api";

export default function Header() {

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	return (
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
	);
};