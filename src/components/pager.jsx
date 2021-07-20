import React, { useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function Pager(props) {

	const [pages, setPages] = useState(5);
	const [activePage, setActivePage] = useState(1);

	if (pages > 1) {
		return (
			<div className="w-100 d-flex p-0 my-3">
				<div className="pager-center">
					<Pagination className="remove-ul-margin">
						<PaginationItem>
							<PaginationLink first href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink previous href="#" />
						</PaginationItem>
						<PaginationItem active>
							<PaginationLink href="#">
								1
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">
								3
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">
								4
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">
								5
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink next href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink last href="#" />
						</PaginationItem>
					</Pagination>
				</div>
			</div>
		);
	} else {
		return (
			<div />
		);
	}
}