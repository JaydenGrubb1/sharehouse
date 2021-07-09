import React from "react";

import "../styles/header.css";

export default function Header() {
	return (
		<nav className="navbar">
			<ul className="navbar-nav">
				<li className="nav-item">
					<a href="/" className="nav-link">
						<span className="link-text">Home</span>
					</a>
				</li>
				<li className="nav-item">
					<a href="/payments" className="nav-link">
						<span className="link-text">Payments</span>
					</a>
				</li>
				<li className="nav-item">
					<a href="/statistics" className="nav-link">
						<span className="link-text">Statistics</span>
					</a>
				</li>
				<li className="nav-item">
					<a href="/account" className="nav-link">
						<span className="link-text">Account</span>
					</a>
				</li>
				<li className="nav-item">
					<a href="/logout" className="nav-link">
						<span className="link-text">Logout</span>
					</a>
				</li>
			</ul>
		</nav>
	);
}