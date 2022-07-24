import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect, useState } from "react";
import { Button, Collapse, Modal, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Progress } from "reactstrap";
import { doLogout, isAdmin, isDev } from "../api";

export default function Header() {

	const [progress, setProgress] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [logout, setLogout] = useState(false);
	const [themeIcon, setThemeIcon] = useState(faMoon);
	const toggle = () => setIsOpen(!isOpen);
	const toggleLogout = () => setLogout(!logout);

	function toggleTheme() {
		if (document.body.classList.contains("light-theme")) {
			document.body.classList.replace("light-theme", "dark-theme");
			localStorage.setItem("color-theme", "dark-theme");
			setThemeIcon(faSun);
		} else {
			document.body.classList.replace("dark-theme", "light-theme");
			localStorage.setItem("color-theme", "light-theme");
			setThemeIcon(faMoon);
		}
	}

	useEffect(() => {
		setProgress(100);
		
		if (document.body.classList.contains("dark-theme")) {
			setThemeIcon(faSun);
		}
	}, []);

	return (
		<div>
			<Navbar color="dark" dark expand="md">
				<NavbarBrand href="/">sharehouse</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="d-flex w-100" navbar>
						<NavItem>
							<NavLink href="/payments">Payments</NavLink>
						</NavItem>
						{isDev() &&
							<NavItem>
								<NavLink href="/statistics">Statistics</NavLink>
							</NavItem>
						}
						{isAdmin() &&
							<NavItem>
								<NavLink href="/admin">Admin</NavLink>
							</NavItem>
						}
						<NavItem>
							<NavLink href="/account">Account</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="#" onClick={toggleLogout}>Logout</NavLink>
						</NavItem>
						<NavItem className="ml-auto">
							<NavLink href="#" onClick={toggleTheme}><FontAwesomeIcon icon={themeIcon} size="lg" /></NavLink>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
			<Progress value={progress} style={{ height: "2.5px", borderRadius: "0px" }} />
			<Modal isOpen={logout} toggle={toggleLogout}>
				<ModalHeader toggle={toggleLogout}>Logout</ModalHeader>
				<ModalFooter>
					<Button color="primary" onClick={doLogout}>Confirm</Button>
					<Button color="primary" outline onClick={toggleLogout}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};