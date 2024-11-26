"use client";
import React from "react";

import { usePopper } from "react-popper";
export default function UserDropdown() {
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
				type={"button"}
				className="text-slate-500 block"
				ref={referenceElement}
				onClick={(e) => {
					e.preventDefault();
					dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
				}}
			>
				<div className="items-center flex">
					<span className="w-12 h-12 text-sm text-white bg-slate-200 inline-flex items-center justify-center rounded-full">
						<img
							alt="..."
							className="w-full rounded-full align-middle border-none shadow-lg"
							src="/assets/img/team-1-800x800.jpg"
						/>
					</span>
				</div>
			</button>
			<div
				ref={popperElement}
				className={`${dropdownPopoverShow ? "block " : "hidden "}bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
				style={styles.popper}
				{...attributes.popper}
			>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Action
				</button>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Another action
				</button>
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Something else here
				</button>
				<div className="h-0 my-2 border border-solid border-slate-100" />
				<button
					type="button"
					className={
						"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
					}
					onClick={(e) => e.preventDefault()}
				>
					Seprated link
				</button>
			</div>
		</>
	);
}
