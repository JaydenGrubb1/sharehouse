import { faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faHome, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Footer() {
	return (
		<footer className="footer">
			<div className="container d-flex h-100">
				<div className="my-auto w-100 d-flex">
					<span className="text-muted my-auto">&copy; Copyright 2021-{new Date().getFullYear()} Jayden Grubb</span>
					{/* <span className="ml-auto"><a className="text-muted" href="mailto:contact@jaydengrubb.com">contact@jaydengrubb.com</a></span> */}
					<a className="ml-auto my-auto h4" href="https://github.com/JaydenGrubb1" target="_blank"><FontAwesomeIcon className="text-muted" icon={faGithub} /></a>
					<a className="ml-1 my-auto h4" href="https://www.linkedin.com/in/jayden-grubb-ab162a123/" target="_blank"><FontAwesomeIcon className="text-muted" icon={faLinkedin} /></a>
					<a className="ml-1 my-auto h4" href="https://twitter.com/JaydenGrubb" target="_blank"><FontAwesomeIcon className="text-muted" icon={faTwitter} /></a>
					<a className="ml-1 my-auto h4" href="mailto:contact@jaydengrubb.com"><FontAwesomeIcon className="text-muted" icon={faEnvelope} /></a>
					<a className="ml-1 my-auto h4" href="https://www.jaydengrubb.com/" target="_blank"><FontAwesomeIcon className="text-muted" icon={faHome} /></a>
				</div>
			</div>
		</footer>
	);
}