import React, { useEffect, useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function Pager(props) {

	const [pages, setPages] = useState(5);
	const [activePage, setActivePage] = useState(0);
	const [pageList, setPageList] = useState();

	const [min, setMin] = useState(0);
	const [max, setMax] = useState(5);

	function updatePage(page, count = pages) {
		let list = [];
		for (let i = 0; i < count; i++) {
			list.push(i + 1);
		}

		let newMax = max;
		let newMin = min;
		if (page + 3 > max) {
			newMax = page + 2;
			newMin = newMax - 5;
			setMax(newMax);
			setMin(newMin);
		}

		if (page < min + 1) {
			newMin = page - 1;
			newMax = newMin + 5;
			setMax(newMax);
			setMin(newMin);
		}

		if (newMax > pages)
			newMin--;
		if (newMin < 0) {
			newMin = 0;
			newMax++;
		}
		list = list.slice(newMin, newMax);

		setPageList(list);
		setActivePage(page);
		if (props.setOffset)
			props.setOffset(activePage);
	}

	useEffect(() => {
		let count = props.results / props.limit;
		setPages(count);
		updatePage(0, count);
	}, []);

	if (pages > 1) {
		return (
			<div className="w-100 d-flex p-0 my-3">
				<div className="pager-center">
					<Pagination className="remove-ul-margin">
						{pages > 2 &&
							<PaginationItem disabled={activePage === 0}>
								<PaginationLink first onClick={() => updatePage(0)} />
							</PaginationItem>
						}
						<PaginationItem disabled={activePage === 0}>
							<PaginationLink previous onClick={() => updatePage(activePage - 1)} />
						</PaginationItem>
						{pageList &&
							pageList.map(x => {
								return (
									<PaginationItem active={x === activePage + 1}>
										<PaginationLink onClick={() => updatePage(x - 1)}>
											{x}
										</PaginationLink>
									</PaginationItem>
								)
							})
						}
						<PaginationItem disabled={activePage === pages - 1}>
							<PaginationLink next onClick={() => updatePage(activePage + 1)} />
						</PaginationItem>
						{pages > 2 &&
							<PaginationItem disabled={activePage === pages - 1}>
								<PaginationLink last onClick={() => updatePage(pages - 1)} />
							</PaginationItem>
						}
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