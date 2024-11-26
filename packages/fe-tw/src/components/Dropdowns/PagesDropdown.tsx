import type { Links } from "@/types/nav";
import Link from "next/link";
import React from "react";
import { usePopper } from "react-popper";

const PagesDropdown = ({ links }: { links: Links }) => {
	// dropdown props
	const [referenceElement, _setReferenceElement] = React.useState(null);
	const [popperElement, _setPopperElement] = React.useState(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement);

	const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
	const openDropdownPopover = () => {
		setDropdownPopoverShow(true);
	};
	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false);
	};
	return (
		<>
			<button
				type="button"
				className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
				ref={referenceElement}
				onClick={(e) => {
					e.preventDefault();
					dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
				}}
			>
				Pages
			</button>
			<div
				ref={popperElement}
				className={`${dropdownPopoverShow ? "block " : "hidden "}bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
				style={styles.popper}
				{...attributes.popper}
			>
				{links.headers.map((header, index) => (
					<div key={header.title}>
						{index !== 0 && (
							<div className="h-0 mx-4 my-2 border border-solid border-slate-100" />
						)}
						<span className="text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400">
							{header.title}
						</span>
						{header.entries.map((entry) => (
							<Link
								href={entry.url}
								key={entry.title}
								className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
							>
								{entry.title}
							</Link>
						))}
					</div>
				))}
			</div>
		</>
	);
};

export default PagesDropdown;
